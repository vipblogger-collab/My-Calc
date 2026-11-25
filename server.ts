import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { CATEGORIES } from './src/data/categories.ts';
import { ALL_CALCULATORS, getCalculatorUrl } from './src/data/calculators/index.ts';
import { ARTICLES } from './src/data/articles.ts';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CachedRates {
  base: string;
  rates: Record<string, number>;
  lastUpdatedUtc: string;
  nextUpdateUtc: string;
  provider: string;
  fetchedAtMs: number;
}

let ratesCache: CachedRates | null = null;
const ONE_HOUR_MS = 3600 * 1000;

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

async function startServer() {
  const app = express();
  const PORT = resolveServerPort();
  const HOST = resolveServerHost();
  const httpServer = http.createServer(app);

  app.use(express.json());

  // Real live exchange rate proxy with 1-hour caching
  app.get('/api/exchange-rates', async (_req, res) => {
    try {
      if (ratesCache && Date.now() - ratesCache.fetchedAtMs < ONE_HOUR_MS) {
        res.json({
          base: ratesCache.base,
          rates: ratesCache.rates,
          lastUpdatedUtc: ratesCache.lastUpdatedUtc,
          nextUpdateUtc: ratesCache.nextUpdateUtc,
          provider: ratesCache.provider,
          cached: true,
        });
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const response = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Upstream FX API responded with ${response.status}`);
      }

      const data = (await response.json()) as {
        result: string;
        base_code?: string;
        rates?: Record<string, number>;
        time_last_update_utc?: string;
        time_next_update_utc?: string;
      };

      if (data.result !== 'success' || !data.rates) {
        throw new Error('Malformed FX API response');
      }

      ratesCache = {
        base: data.base_code || 'USD',
        rates: data.rates,
        lastUpdatedUtc: data.time_last_update_utc || new Date().toUTCString(),
        nextUpdateUtc: data.time_next_update_utc || new Date(Date.now() + ONE_HOUR_MS).toUTCString(),
        provider: 'ExchangeRate-API (open.er-api.com)',
        fetchedAtMs: Date.now(),
      };

      res.json({
        base: ratesCache.base,
        rates: ratesCache.rates,
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
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${baseUrl.replace(/\/$/, '')}/sitemap.xml\n`);
  });

  // Dynamic XML Sitemap indexing every category, calculator, guide, and legal page
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const today = new Date().toISOString().slice(0, 10);

    const urls: { loc: string; priority: string; changefreq: string }[] = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
      { loc: `${baseUrl}/guides/`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/about-us/`, priority: '0.5', changefreq: 'monthly' },
      { loc: `${baseUrl}/contact-us/`, priority: '0.5', changefreq: 'monthly' },
      { loc: `${baseUrl}/privacy-policy/`, priority: '0.4', changefreq: 'yearly' },
      { loc: `${baseUrl}/terms-of-service/`, priority: '0.4', changefreq: 'yearly' },
      { loc: `${baseUrl}/disclaimer/`, priority: '0.4', changefreq: 'yearly' },
      { loc: `${baseUrl}/cookie-policy/`, priority: '0.4', changefreq: 'yearly' },
      { loc: `${baseUrl}/sitemap/`, priority: '0.5', changefreq: 'weekly' },
    ];

    for (const cat of CATEGORIES) {
      urls.push({ loc: `${baseUrl}/${cat.slug}/`, priority: '0.9', changefreq: 'weekly' });
    }
    for (const calc of ALL_CALCULATORS) {
      urls.push({ loc: `${baseUrl}${getCalculatorUrl(calc)}`, priority: '0.8', changefreq: 'monthly' });
    }
    for (const art of ARTICLES) {
      urls.push({ loc: `${baseUrl}/guides/${art.slug}/`, priority: '0.7', changefreq: 'monthly' });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      )
      .join('\n')}\n</urlset>`;

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
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });

    httpServer.listen(PORT, HOST, () => {
      console.log(`CalcAxis server listening on http://${HOST}:${PORT}`);
    });

    await vitePromise;
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });

    httpServer.listen(PORT, HOST, () => {
      console.log(`CalcAxis server listening on http://${HOST}:${PORT}`);
    });
  }
}

startServer();
