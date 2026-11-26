import { ALL_CALCULATORS, getCalculatorBySlug } from '../data/calculators/index.ts';
import { CATEGORIES } from '../data/categories.ts';
import { ARTICLES } from '../data/articles.ts';
import { UI_COPY } from '../i18n/translations.ts';
import { localizeArticle, localizeCalculator, localizeCategory } from '../i18n/calculatorAr.ts';
import { extractLangFromPath, localizePath } from '../i18n/routing.ts';
import { Language } from '../types/calculator.ts';

export interface RouteSeoMeta {
  lang: Language;
  dir: 'ltr' | 'rtl';
  title: string;
  description: string;
  neutralPath: string;
  canonicalUrl: string;
  enUrl: string;
  arUrl: string;
  ogLocale: string;
}

const STATIC_PAGE_META: Record<
  string,
  {
    en: { title: string; description: string };
    ar: { title: string; description: string };
  }
> = {
  '/about-us': {
    en: {
      title: 'About Us | mysmartcalc.net',
      description: 'Learn how mysmartcalc.net builds fast, transparent, client-side online calculators with documented formulas.',
    },
    ar: {
      title: 'من نحن | mysmartcalc.net',
      description: 'تعرّف على كيفية بناء mysmartcalc.net لحاسبات سريعة وشفافة تعمل في المتصفح مع توثيق المعادلات.',
    },
  },
  '/contact-us': {
    en: {
      title: 'Contact Us | mysmartcalc.net',
      description: 'Send feedback, report a formula edge case, or request a new calculator on mysmartcalc.net.',
    },
    ar: {
      title: 'تواصل معنا | mysmartcalc.net',
      description: 'أرسل ملاحظاتك أو اقترح حاسبة جديدة أو أبلغ عن مسألة حسابية.',
    },
  },
  '/privacy-policy': {
    en: {
      title: 'Privacy Policy | mysmartcalc.net',
      description: 'How mysmartcalc.net handles browser storage, calculator inputs, analytics, and advertising privacy.',
    },
    ar: {
      title: 'سياسة الخصوصية | mysmartcalc.net',
      description: 'كيف تتعامل mysmartcalc.net مع تخزين المتصفح ومدخلات الحاسبة وخصوصية الإعلانات.',
    },
  },
  '/terms-of-service': {
    en: {
      title: 'Terms of Service | mysmartcalc.net',
      description: 'Terms governing use of mysmartcalc.net online calculators, formulas, and educational guides.',
    },
    ar: {
      title: 'شروط الاستخدام | mysmartcalc.net',
      description: 'الشروط المنظمة لاستخدام حاسبات ومعادلات وأدلة mysmartcalc.net الإلكترونية.',
    },
  },
  '/disclaimer': {
    en: {
      title: 'Disclaimer | mysmartcalc.net',
      description: 'Important financial, medical, tax, and exchange-rate disclaimers for mysmartcalc.net calculators.',
    },
    ar: {
      title: 'إخلاء المسؤولية | mysmartcalc.net',
      description: 'إفصاحات مهمة حول الحسابات المالية والطبية والضريبية وأسعار الصرف.',
    },
  },
  '/cookie-policy': {
    en: {
      title: 'Cookie Policy | mysmartcalc.net',
      description: 'Information on essential browser storage and optional advertising cookies on mysmartcalc.net.',
    },
    ar: {
      title: 'سياسة ملفات تعريف الارتباط | mysmartcalc.net',
      description: 'معلومات حول التخزين الأساسي في المتصفح وملفات تعريف الارتباط الإعلانية الاختيارية.',
    },
  },
  '/sitemap': {
    en: {
      title: 'HTML Sitemap | mysmartcalc.net',
      description: 'Browse all mysmartcalc.net calculator categories, individual calculation tools, educational guides, and legal resources.',
    },
    ar: {
      title: 'خريطة الموقع | mysmartcalc.net',
      description: 'تصفح جميع أقسام الحاسبات والأدوات الفردية والأدلة التعليمية وصفحات السياسات في مكان واحد.',
    },
  },
  '/admin': {
    en: {
      title: 'Content & Ad Settings | mysmartcalc.net',
      description: 'Manage calculator metadata, educational guides, and AdSense ad slot placements.',
    },
    ar: {
      title: 'إعدادات المحتوى والإعلانات | mysmartcalc.net',
      description: 'إدارة بيانات الحاسبات والأدلة التعليمية ومواضع إعلانات AdSense.',
    },
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function resolveRouteSeo(pathname: string, baseUrl: string): RouteSeoMeta {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const { lang: pathLang, neutralPath } = extractLangFromPath(pathname);
  const lang: Language = pathLang ?? 'en';
  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';
  const ui = UI_COPY[lang];

  const trimmed = neutralPath.replace(/\/+$/, '') || '/';
  let title: string = ui.home.seoTitle;
  let description: string = ui.home.seoDesc;
  let canonicalNeutral = trimmed === '/' ? '/' : `${trimmed}/`;

  if (trimmed === '/') {
    canonicalNeutral = '/';
  } else if (trimmed === '/guides') {
    title = `${ui.guides.title} | ${ui.brandName}`;
    description = ui.guides.subtitle;
    canonicalNeutral = '/guides/';
  } else if (trimmed.startsWith('/guides/')) {
    const slug = trimmed.slice('/guides/'.length);
    const article = ARTICLES.find((a) => a.slug === slug);
    if (article) {
      const locArt = localizeArticle(article, lang);
      title = `${locArt.title} | ${ui.brandName}`;
      description = locArt.summary;
      canonicalNeutral = `/guides/${article.slug}/`;
    }
  } else if (STATIC_PAGE_META[trimmed]) {
    const staticDoc = STATIC_PAGE_META[trimmed][lang];
    title = staticDoc.title;
    description = staticDoc.description;
    canonicalNeutral = `${trimmed}/`;
  } else {
    const segments = trimmed.split('/').filter(Boolean);
    if (segments.length === 1) {
      const cat = CATEGORIES.find((c) => c.slug === segments[0]);
      if (cat) {
        const locCat = localizeCategory(cat, lang);
        title = `${locCat.name} – ${ui.category.freeOnlineTools} | ${ui.brandName}`;
        description = locCat.description;
        canonicalNeutral = `/${cat.slug}/`;
      }
    } else if (segments.length >= 2) {
      const [catSlug, calcSlug] = segments;
      const calc = getCalculatorBySlug(calcSlug, ALL_CALCULATORS);
      if (calc) {
        const locCalc = localizeCalculator(calc, lang);
        const catMatch = CATEGORIES.find((c) => c.slug === catSlug)?.slug || calc.category;
        title = locCalc.seoTitle;
        description = locCalc.seoDescription;
        canonicalNeutral = `/${catMatch}/${calc.slug}/`;
      }
    }
  }

  const enUrl = `${cleanBase}${localizePath(canonicalNeutral, 'en')}`;
  const arUrl = `${cleanBase}${localizePath(canonicalNeutral, 'ar')}`;
  const canonicalUrl = lang === 'ar' ? arUrl : enUrl;

  return {
    lang,
    dir,
    title,
    description,
    neutralPath: canonicalNeutral,
    canonicalUrl,
    enUrl,
    arUrl,
    ogLocale: lang === 'ar' ? 'ar_AR' : 'en_US',
  };
}

export function injectSeoIntoHtml(html: string, pathname: string, baseUrl: string): string {
  const meta = resolveRouteSeo(pathname, baseUrl);
  const safeTitle = escapeHtml(meta.title);
  const safeDesc = escapeHtml(meta.description);

  let out = html.replace(/<html\b[^>]*>/i, `<html lang="${meta.lang}" dir="${meta.dir}">`);
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${safeDesc}" />`
  );
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );

  const extraHeadTags = [
    `    <meta property="og:url" content="${escapeHtml(meta.canonicalUrl)}" />`,
    `    <meta property="og:locale" content="${meta.ogLocale}" />`,
    `    <link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />`,
    `    <link rel="alternate" hreflang="en" href="${escapeHtml(meta.enUrl)}" data-smartcalc-hreflang="true" />`,
    `    <link rel="alternate" hreflang="ar" href="${escapeHtml(meta.arUrl)}" data-smartcalc-hreflang="true" />`,
    `    <link rel="alternate" hreflang="x-default" href="${escapeHtml(meta.enUrl)}" data-smartcalc-hreflang="true" />`,
  ].join('\n');

  out = out.replace(/<\/head>/i, `${extraHeadTags}\n  </head>`);
  return out;
}
