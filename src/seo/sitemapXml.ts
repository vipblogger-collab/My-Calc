import { CATEGORIES } from '../data/categories.ts';
import { ALL_CALCULATORS, getCalculatorUrl } from '../data/calculators/index.ts';
import { ARTICLES } from '../data/articles.ts';
import { localizePath } from '../i18n/routing.ts';

export const CANONICAL_SITEMAP_ORIGIN = 'https://www.mysmartcalc.net';

export const ROBOTS_TXT_CONTENT = `User-agent: *
Allow: /
Sitemap: ${CANONICAL_SITEMAP_ORIGIN}/sitemap.xml
`;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateSitemapXml(
  origin: string = CANONICAL_SITEMAP_ORIGIN,
  lastmod: string = new Date().toISOString().slice(0, 10)
): string {
  const baseUrl = origin.replace(/\/+$/, '');

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
    if (calc.published === false) continue;
    neutralPages.push({ path: getCalculatorUrl(calc), priority: '0.8', changefreq: 'monthly' });
  }

  for (const art of ARTICLES) {
    neutralPages.push({ path: `/guides/${art.slug}/`, priority: '0.7', changefreq: 'monthly' });
  }

  const entries: string[] = [];
  for (const page of neutralPages) {
    const enLoc = escapeXml(`${baseUrl}${localizePath(page.path, 'en')}`);
    const arLoc = escapeXml(`${baseUrl}${localizePath(page.path, 'ar')}`);
    const alternates =
      `    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}" />\n` +
      `    <xhtml:link rel="alternate" hreflang="ar" href="${arLoc}" />\n` +
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${enLoc}" />`;

    for (const loc of [enLoc, arLoc]) {
      entries.push(
        `  <url>\n    <loc>${loc}</loc>\n${alternates}\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`
      );
    }
  }

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${entries.join('\n')}\n` +
    `</urlset>\n`
  );
}
