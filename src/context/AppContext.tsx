import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AdConfig, ArticleDef, CalculatorDef, CategoryDef, Language } from '../types/calculator.ts';
import { ALL_CALCULATORS } from '../data/calculators/index.ts';
import { CATEGORIES } from '../data/categories.ts';
import { ARTICLES } from '../data/articles.ts';
import { UI_COPY } from '../i18n/translations.ts';
import { localizeArticle, localizeCalculator, localizeCategory } from '../i18n/calculatorAr.ts';
import { extractLangFromPath, localizePath } from '../i18n/routing.ts';

const DEFAULT_AD_CONFIG: AdConfig = {
  enabled: true,
  showSlotPlaceholders: false,
  provider: 'adsense',
  publisherId: '',
  slots: {
    homepageBanner: '',
    homepageInContent: '',
    categoryTop: '',
    calculatorTop: '',
    calculatorSidebar: '',
    calculatorInContent: '',
    pageBottom: '',
  },
};

const STORAGE_KEYS = {
  lang: 'calcaxis_lang_v1',
  currency: 'calcaxis_currency_v1',
  bookmarks: 'calcaxis_bookmarks_v1',
  recent: 'calcaxis_recent_v1',
  adConfig: 'calcaxis_ad_config_v2',
  calcOverrides: 'calcaxis_calc_overrides_v1',
  customArticles: 'calcaxis_articles_v1',
};

interface AppContextValue {
  lang: Language;
  setLang: (next: Language) => void;
  toggleLang: () => void;
  currencyCode: string;
  setCurrencyCode: (next: string) => void;
  l: (path: string) => string;
  ui: (typeof UI_COPY)[Language];
  categories: CategoryDef[];
  calculators: CalculatorDef[];
  articles: ArticleDef[];
  bookmarks: string[];
  recentSlugs: string[];
  adConfig: AdConfig;
  toggleBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  recordRecentView: (slug: string) => void;
  updateAdConfig: (next: AdConfig) => void;
  updateCalculatorMeta: (slug: string, patch: Partial<CalculatorDef>) => void;
  addOrUpdateArticle: (article: ArticleDef) => void;
  deleteCustomArticle: (slug: string) => void;
  resetCmsDefaults: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getInitialLang(): Language {
  try {
    const pathLang = extractLangFromPath(window.location.pathname).lang;
    if (pathLang) return pathLang;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('lang');
    if (q === 'ar' || q === 'en') return q;
    const saved = localStorage.getItem(STORAGE_KEYS.lang);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // ignore SSR/storage errors
  }
  return 'en';
}

function getInitialCurrency(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.currency);
    if (saved && /^[A-Z]{3}$/.test(saved)) return saved;
  } catch {
    // ignore storage errors
  }
  return 'USD';
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(getInitialLang);
  const [currencyCode, setCurrencyCodeState] = useState<string>(getInitialCurrency);
  const [bookmarks, setBookmarks] = useState<string[]>(() =>
    safeLoad<string[]>(STORAGE_KEYS.bookmarks, [])
  );
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() =>
    safeLoad<string[]>(STORAGE_KEYS.recent, [])
  );
  const [adConfig, setAdConfig] = useState<AdConfig>(() =>
    safeLoad<AdConfig>(STORAGE_KEYS.adConfig, DEFAULT_AD_CONFIG)
  );
  const [calcOverrides, setCalcOverrides] = useState<Record<string, Partial<CalculatorDef>>>(() =>
    safeLoad<Record<string, Partial<CalculatorDef>>>(STORAGE_KEYS.calcOverrides, {})
  );
  const [articleOverrides, setArticleOverrides] = useState<ArticleDef[]>(() =>
    safeLoad<ArticleDef[]>(STORAGE_KEYS.customArticles, [])
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(STORAGE_KEYS.lang, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.currency, currencyCode);
    } catch {
      // ignore
    }
  }, [currencyCode]);

  const setCurrencyCode = (next: string) => {
    const upper = next.trim().toUpperCase();
    if (/^[A-Z]{3}$/.test(upper)) {
      setCurrencyCodeState(upper);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
    } catch {
      // ignore storage quota errors
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recentSlugs));
    } catch {
      // ignore
    }
  }, [recentSlugs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.adConfig, JSON.stringify(adConfig));
    } catch {
      // ignore
    }
  }, [adConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.calcOverrides, JSON.stringify(calcOverrides));
    } catch {
      // ignore
    }
  }, [calcOverrides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.customArticles, JSON.stringify(articleOverrides));
    } catch {
      // ignore
    }
  }, [articleOverrides]);

  const categories = useMemo(() => {
    return CATEGORIES.map((c) => localizeCategory(c, lang));
  }, [lang]);

  const calculators = useMemo(() => {
    return ALL_CALCULATORS.map((calc) => {
      const localized = localizeCalculator(calc, lang);
      const ov = calcOverrides[calc.slug];
      return ov ? { ...localized, ...ov } : localized;
    });
  }, [calcOverrides, lang]);

  const articles = useMemo(() => {
    const map = new Map<string, ArticleDef>();
    ARTICLES.forEach((a) => map.set(a.slug, localizeArticle(a, lang)));
    articleOverrides.forEach((a) => map.set(a.slug, a));
    return Array.from(map.values());
  }, [articleOverrides, lang]);

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  const l = (path: string) => localizePath(path, lang);
  const ui = UI_COPY[lang];

  const toggleBookmark = (slug: string) => {
    setBookmarks((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]
    );
  };

  const isBookmarked = (slug: string) => bookmarks.includes(slug);

  const recordRecentView = (slug: string) => {
    setRecentSlugs((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 8));
  };

  const updateAdConfig = (next: AdConfig) => setAdConfig(next);

  const updateCalculatorMeta = (slug: string, patch: Partial<CalculatorDef>) => {
    setCalcOverrides((prev) => ({
      ...prev,
      [slug]: { ...(prev[slug] || {}), ...patch },
    }));
  };

  const addOrUpdateArticle = (article: ArticleDef) => {
    setArticleOverrides((prev) => {
      const filtered = prev.filter((a) => a.slug !== article.slug);
      return [article, ...filtered];
    });
  };

  const deleteCustomArticle = (slug: string) => {
    setArticleOverrides((prev) => prev.filter((a) => a.slug !== slug));
  };

  const resetCmsDefaults = () => {
    setAdConfig(DEFAULT_AD_CONFIG);
    setCalcOverrides({});
    setArticleOverrides([]);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        currencyCode,
        setCurrencyCode,
        l,
        ui,
        categories,
        calculators,
        articles,
        bookmarks,
        recentSlugs,
        adConfig,
        toggleBookmark,
        isBookmarked,
        recordRecentView,
        updateAdConfig,
        updateCalculatorMeta,
        addOrUpdateArticle,
        deleteCustomArticle,
        resetCmsDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
