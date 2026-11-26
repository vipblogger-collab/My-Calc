import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { CATEGORIES } from './src/data/categories.ts';
import { ALL_CALCULATORS, getCalculatorUrl } from './src/data/calculators/index.ts';
import { ARTICLES } from './src/data/articles.ts';
import { localizePath } from './src/i18n/routing.ts';
import { injectSeoIntoHtml } from './src/seo/routeMeta.ts';
import { SITE_NAME, SITE_URL } from './src/config/site.ts';
import { ACTIVE_WORLD_CURRENCY_CODES } from './src/lib/calculators/currencies.ts';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CachedRates {
  base: string;
  rates: Record<string, number>;
  currencyCount: number;
  lastUpdatedUtc: string;
  nextUpdateUtc: string;
  provider: string;
  fetchedAtMs: number;
}

let ratesCache: CachedRates | null = null;
const FX_CACHE_TTL_MS = 15 * 60 * 1000;
const FX_FORCE_COOLDOWN_MS = 20 * 1000;

async function fetchJsonWithTimeout<T>(url: string, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Upstream API responded with ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchLiveGlobalRates(): Promise<CachedRates> {
  let primaryRates: Record<string, number> | null = null;
  let lastUpdatedUtc = new Date().toUTCString();
  let nextUpdateUtc = new Date(Date.now() + FX_CACHE_TTL_MS).toUTCString();
  let provider = 'ExchangeRate-API (open.er-api.com)';

  try {
    const data = await fetchJsonWithTimeout<{
      result: string;
      base_code?: string;
      rates?: Record<string, number>;
      time_last_update_utc?: string;
      time_next_update_utc?: string;
    }>('https://open.er-api.com/v6/latest/USD', 7000);

    if (data.result === 'success' && data.rates && Object.keys(data.rates).length > 50) {
      primaryRates = { ...data.rates, USD: 1 };
      if (data.time_last_update_utc) lastUpdatedUtc = data.time_last_update_utc;
      if (data.time_next_update_utc) nextUpdateUtc = data.time_next_update_utc;
    }
  } catch {
    primaryRates = null;
  }

  // Supplement missing active world currencies (e.g., KPW) or act as full failover
  try {
    const backup = await fetchJsonWithTimeout<{
      date?: string;
      usd?: Record<string, number>;
    }>(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      primaryRates ? 2500 : 7000
    );

    if (backup.usd) {
      if (primaryRates) {
        for (const code of ACTIVE_WORLD_CURRENCY_CODES) {
          if (!primaryRates[code]) {
            const val = backup.usd[code.toLowerCase()];
            if (typeof val === 'number' && Number.isFinite(val) && val > 0) {
              primaryRates[code] = val;
            }
          }
        }
      } else {
        const failoverRates: Record<string, number> = { USD: 1 };
        for (const code of ACTIVE_WORLD_CURRENCY_CODES) {
          const val = backup.usd[code.toLowerCase()];
          if (typeof val === 'number' && Number.isFinite(val) && val > 0) {
            failoverRates[code] = val;
          }
        }
        if (Object.keys(failoverRates).length > 50) {
          primaryRates = failoverRates;
          lastUpdatedUtc = backup.date ? `${backup.date} 00:00:00 UTC` : new Date().toUTCString();
          nextUpdateUtc = new Date(Date.now() + FX_CACHE_TTL_MS).toUTCString();
          provider = 'Global FX Feed (fawazahmed0/currency-api)';
        }
      }
    }
  } catch {
    // Ignore backup fetch errors when primary succeeded
  }

  if (!primaryRates) {
    throw new Error('All live global exchange-rate providers failed');
  }

  return {
    base: 'USD',
    rates: primaryRates,
    currencyCount: Object.keys(primaryRates).length,
    lastUpdatedUtc,
    nextUpdateUtc,
    provider,
    fetchedAtMs: Date.now(),
  };
}

function resolveServerPort(): number {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--port' && args[i + 1]) {
      const parsed = Number(args[i + 1]);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    } else if (arg.startsWith('--port=')) {
      const parsed = Number(arg.slice('--port='.length));
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
  }
  const envPort = Number(process.env.PORT);
  const nginxPort = Number(process.env.NGINX_PORT);
  if (
    process.env.NODE_ENV !== 'production' &&
    Number.isFinite(envPort) &&
    Number.isFinite(nginxPort) &&
    envPort === nginxPort
  ) {
    return Number(process.env.DEFAULT_APP_PORT) || 3000;
  }
  return Number.isFinite(envPort) && envPort > 0 ? envPort : 3000;
}

function resolveServerHost(): string {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--host' && args[i + 1]) return args[i + 1];
    if (arg.startsWith('--host=')) return arg.slice('--host='.length);
  }
  return '0.0.0.0';
}

function isHtmlPageRequest(req: express.Request): boolean {
  if (req.method !== 'GET') return false;
  const reqPath = req.path;
  if (
    reqPath.startsWith('/api/') ||
    reqPath.startsWith('/@') ||
    reqPath.startsWith('/src/') ||
    reqPath.startsWith('/node_modules/')
  ) {
    return false;
  }
  if (path.extname(reqPath) !== '') return false;
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept === '*/*' || accept === '';
}

async function startServer() {
  const app = express();
  const PORT = resolveServerPort();
  const HOST = resolveServerHost();
  const httpServer = http.createServer(app);

  app.use(express.json());

  // Real live global exchange rate proxy (165+ world currencies, 15-min cache + force refresh)
  app.get('/api/exchange-rates', async (req, res) => {
    const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';
    const cacheAgeMs = ratesCache ? Date.now() - ratesCache.fetchedAtMs : Infinity;
    const canUseCache =
      ratesCache &&
      (forceRefresh ? cacheAgeMs < FX_FORCE_COOLDOWN_MS : cacheAgeMs < FX_CACHE_TTL_MS);

    if (canUseCache && ratesCache) {
      res.json({
        base: ratesCache.base,
        rates: ratesCache.rates,
        currencyCount: ratesCache.currencyCount,
        lastUpdatedUtc: ratesCache.lastUpdatedUtc,
        nextUpdateUtc: ratesCache.nextUpdateUtc,
        provider: ratesCache.provider,
        cached: true,
      });
      return;
    }

    try {
      ratesCache = await fetchLiveGlobalRates();
      res.json({
        base: ratesCache.base,
        rates: ratesCache.rates,
        currencyCount: ratesCache.currencyCount,
        lastUpdatedUtc: ratesCache.lastUpdatedUtc,
        nextUpdateUtc: ratesCache.nextUpdateUtc,
        provider: ratesCache.provider,
        cached: false,
      });
    } catch (err) {
      if (ratesCache) {
        res.json({
          base: ratesCache.base,
          rates: ratesCache.rates,
          currencyCount: ratesCache.currencyCount,
          lastUpdatedUtc: ratesCache.lastUpdatedUtc,
          nextUpdateUtc: ratesCache.nextUpdateUtc,
          provider: `${ratesCache.provider} (stale cache)`,
          cached: true,
        });
        return;
      }
      res.status(502).json({
        error: 'Unable to fetch live exchange rates at the moment. Please try again shortly.',
        detail: err instanceof Error ? err.message : 'Network error',
      });
    }
  });

  // SEO robots.txt
  app.get('/robots.txt', (_req, res) => {
    const baseUrl = (process.env.SITE_URL || SITE_URL).replace(/\/$/, '');
    res.type('text/plain');
    res.send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /en/admin\nDisallow: /ar/admin\n\nSitemap: ${baseUrl}/sitemap.xml\n`
    );
  });

  // Dynamic Bilingual XML Sitemap (/en/... & /ar/... with xhtml:link hreflang alternates)
  app.get('/sitemap.xml', (_req, res) => {
    const baseUrl = (process.env.SITE_URL || SITE_URL).replace(/\/$/, '');
    const today = new Date().toISOString().slice(0, 10);

    const neutralPages: { path: string; priority: string; changefreq: string }[] = [
      { path: '/', priority: '1.0', changefreq: 'weekly' },
      { path: '/guides/', priority: '0.8', changefreq: 'weekly' },
      { path: '/about-us/', priority: '0.5', changefreq: 'monthly' },
      { path: '/contact-us/', priority: '0.5', changefreq: 'monthly' },
      { path: '/privacy-policy/', priority: '0.4', changefreq: 'yearly' },
      { path: '/terms-of-service/', priority: '0.4', changefreq: 'yearly' },
      { path: '/disclaimer/', priority: '0.4', changefreq: 'yearly' },
      { path: '/cookie-policy/', priority: '0.4', changefreq: 'yearly' },
      { path: '/sitemap/', priority: '0.5', changefreq: 'weekly' },
    ];

    for (const cat of CATEGORIES) {
      neutralPages.push({ path: `/${cat.slug}/`, priority: '0.9', changefreq: 'weekly' });
    }
    for (const calc of ALL_CALCULATORS) {
      neutralPages.push({ path: getCalculatorUrl(calc), priority: '0.8', changefreq: 'monthly' });
    }
    for (const art of ARTICLES) {
      neutralPages.push({ path: `/guides/${art.slug}/`, priority: '0.7', changefreq: 'monthly' });
    }

    const entries: string[] = [];
    for (const page of neutralPages) {
      const enLoc = `${baseUrl}${localizePath(page.path, 'en')}`;
      const arLoc = `${baseUrl}${localizePath(page.path, 'ar')}`;
      const alternates =
        `    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}"/>\n` +
        `    <xhtml:link rel="alternate" hreflang="ar" href="${arLoc}"/>\n` +
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${enLoc}"/>`;

      for (const loc of [enLoc, arLoc]) {
        entries.push(
          `  <url>\n    <loc>${loc}</loc>\n${alternates}\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`
        );
      }
    }

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
      `${entries.join('\n')}\n` +
      `</urlset>`;

    res.type('application/xml');
    res.send(xml);
  });

  if (process.env.NODE_ENV !== 'production') {
    const disableHmr = process.env.DISABLE_HMR === 'true';
    const vitePromise = (async () => {
      const { createServer: createViteServer } = await import('vite');
      return createViteServer({
        server: {
          middlewareMode: true,
          hmr: disableHmr ? false : { server: httpServer },
          ws: disableHmr ? (false as const) : undefined,
        },
        appType: 'spa',
      });
    })();

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        if (isHtmlPageRequest(req)) {
          const indexPath = path.resolve(__dirname, 'index.html');
          const rawHtml = fs.readFileSync(indexPath, 'utf-8');
          const baseUrl = (process.env.SITE_URL || SITE_URL).replace(/\/$/, '');
          const seoHtml = injectSeoIntoHtml(rawHtml, req.path, baseUrl);
          const transformed = await vite.transformIndexHtml(req.originalUrl, seoHtml);
          res.status(200).set('Content-Type', 'text/html').end(transformed);
          return;
        }
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });

    httpServer.listen(PORT, HOST, () => {
      console.log(`${SITE_NAME} server listening on http://${HOST}:${PORT}`);
    });

    await vitePromise;
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    app.get('*', (req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        const rawHtml = fs.readFileSync(indexFile, 'utf-8');
        const baseUrl = (process.env.SITE_URL || SITE_URL).replace(/\/$/, '');
        const seoHtml = injectSeoIntoHtml(rawHtml, req.path, baseUrl);
        res.status(200).set('Content-Type', 'text/html').end(seoHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });

    httpServer.listen(PORT, HOST, () => {
      console.log(`${SITE_NAME} server listening on http://${HOST}:${PORT}`);
    });
  }
}

startServer();
