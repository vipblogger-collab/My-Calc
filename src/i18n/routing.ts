import type { Language } from '../types/calculator.ts';

export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'ar'];

export function isSupportedLanguage(val: string | undefined | null): val is Language {
  return val === 'en' || val === 'ar';
}

/**
 * Extracts optional /en or /ar prefix from a URL pathname and returns the neutral path.
 */
export function extractLangFromPath(pathname: string): {
  lang: Language | null;
  neutralPath: string;
} {
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const match = /^\/(en|ar)(\/.*|$)/.exec(clean);
  if (!match) {
    return { lang: null, neutralPath: clean || '/' };
  }
  const lang = match[1] as Language;
  const rest = match[2] || '/';
  return {
    lang,
    neutralPath: rest.startsWith('/') ? rest : `/${rest}`,
  };
}

/**
 * Prefixes a route path with /en or /ar cleanly while preserving trailing slash style.
 */
export function localizePath(path: string, lang: Language): string {
  const { neutralPath } = extractLangFromPath(path);
  if (neutralPath === '/' || neutralPath === '') {
    return `/${lang}/`;
  }
  return `/${lang}${neutralPath}`;
}
