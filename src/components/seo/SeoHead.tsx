import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';

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

    const origin = window.location.origin;
    const url = `${origin}${canonicalPath ?? window.location.pathname}`;
    setMeta('property', 'og:url', url);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Clean up old dynamic JSON-LD scripts
    document.querySelectorAll('script[data-calcaxis-ld="true"]').forEach((s) => s.remove());

    if (schemas && schemas.length > 0) {
      schemas.forEach((schema) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-calcaxis-ld', 'true');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }
  }, [title, description, canonicalPath, schemas]);

  return null;
}
