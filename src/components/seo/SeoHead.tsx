import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { extractLangFromPath, localizePath } from '../../i18n/routing.ts';
import { SITE_URL } from '../../config/site.ts';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  schemas?: Record<string, unknown>[];
}

export function SeoHead({ title, description, canonicalPath, schemas }: SeoHeadProps) {
  const { lang } = useAppContext();

  useEffect(() => {
    document.title = title;

    const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:locale', lang === 'ar' ? 'ar_AR' : 'en_US');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    const origin = SITE_URL;
    const rawPath = canonicalPath ?? window.location.pathname;
    const { neutralPath } = extractLangFromPath(rawPath);

    const enUrl = `${origin}${localizePath(neutralPath, 'en')}`;
    const arUrl = `${origin}${localizePath(neutralPath, 'ar')}`;
    const localizedUrl = lang === 'ar' ? arUrl : enUrl;

    setMeta('property', 'og:url', localizedUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', localizedUrl);

    // Update bilingual hreflang alternate links
    document
      .querySelectorAll('link[data-smartcalc-hreflang="true"], link[data-calcaxis-hreflang="true"]')
      .forEach((el) => el.remove());
    const alternates: { hreflang: string; href: string }[] = [
      { hreflang: 'en', href: enUrl },
      { hreflang: 'ar', href: arUrl },
      { hreflang: 'x-default', href: enUrl },
    ];
    alternates.forEach((alt) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alt.hreflang);
      link.setAttribute('href', alt.href);
      link.setAttribute('data-smartcalc-hreflang', 'true');
      document.head.appendChild(link);
    });

    // Clean up old dynamic JSON-LD scripts
    document
      .querySelectorAll('script[data-smartcalc-ld="true"], script[data-calcaxis-ld="true"]')
      .forEach((s) => s.remove());

    if (schemas && schemas.length > 0) {
      schemas.forEach((schema) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-smartcalc-ld', 'true');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }
  }, [title, description, canonicalPath, schemas, lang]);

  return null;
}
