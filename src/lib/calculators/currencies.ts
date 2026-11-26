import type { Language } from '../../types/calculator.ts';

export const ACTIVE_WORLD_CURRENCY_CODES = new Set<string>([
  'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
  'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL',
  'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP',
  'CNH', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP',
  'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL',
  'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK',
  'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JEP',
  'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KPW', 'KRW',
  'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD',
  'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK',
  'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR',
  'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD',
  'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE',
  'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT',
  'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD',
  'UYU', 'UZS', 'VED', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XCG',
  'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWG', 'ZWL',
]);

export const POPULAR_CURRENCIES_EN = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'SAR',
  'AED', 'KWD', 'EGP', 'TRY', 'MXN', 'BRL', 'SGD', 'HKD', 'KRW', 'NZD',
];

export const POPULAR_CURRENCIES_AR = [
  'USD', 'SAR', 'AED', 'KWD', 'EGP', 'QAR', 'BHD', 'OMR', 'JOD', 'EUR',
  'GBP', 'TRY', 'MAD', 'TND', 'DZD', 'IQD', 'LBP', 'JPY', 'CNY', 'CHF',
];

const THREE_DECIMAL_CURRENCIES = new Set(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND']);

const FALLBACK_NAMES_EN: Record<string, string> = {
  CLF: 'Chilean Unit of Account (UF)',
  CNH: 'Chinese Yuan (Offshore)',
  FOK: 'Faroese Króna',
  GGP: 'Guernsey Pound',
  IMP: 'Isle of Man Pound',
  JEP: 'Jersey Pound',
  KID: 'Kiribati Dollar',
  SLE: 'Sierra Leonean Leone',
  TVD: 'Tuvaluan Dollar',
  VED: 'Venezuelan Bolívar Digital',
  XCG: 'Caribbean Guilder',
  ZWG: 'Zimbabwean Gold',
};

const FALLBACK_NAMES_AR: Record<string, string> = {
  CLF: 'وحدة حساب تشيلية (UF)',
  CNH: 'يوان صيني (خارجي)',
  FOK: 'كرونة فاروية',
  GGP: 'جنيه غيرنزي',
  IMP: 'جنيه جزيرة مان',
  JEP: 'جنيه جيرزي',
  KID: 'دولار كيريباتي',
  SLE: 'ليون سيراليوني',
  TVD: 'دولار توفالو',
  VED: 'بوليفار فنزويلي رقمي',
  XCG: 'غيلدر كاريبي',
  ZWG: 'ذهب زيمبابوي',
};

const CUSTOM_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  CNH: '¥',
  INR: '₹',
  KRW: '₩',
  TRY: '₺',
  RUB: '₽',
  UAH: '₴',
  PLN: 'zł',
  THB: '฿',
  VND: '₫',
  PHP: '₱',
  NGN: '₦',
  ILS: '₪',
  BRL: 'R$',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  SAR: 'SAR',
  AED: 'AED',
  KWD: 'KWD',
  QAR: 'QAR',
  BHD: 'BHD',
  OMR: 'OMR',
  JOD: 'JOD',
  EGP: 'EGP',
};

let displayEn: Intl.DisplayNames | null = null;
let displayAr: Intl.DisplayNames | null = null;

function getDisplayNames(lang: Language): Intl.DisplayNames | null {
  try {
    if (lang === 'ar') {
      if (!displayAr) displayAr = new Intl.DisplayNames(['ar'], { type: 'currency' });
      return displayAr;
    }
    if (!displayEn) displayEn = new Intl.DisplayNames(['en'], { type: 'currency' });
    return displayEn;
  } catch {
    return null;
  }
}

export function getCurrencyName(code: string, lang: Language): string {
  const upper = code.toUpperCase();
  const dn = getDisplayNames(lang);
  if (dn) {
    try {
      const localized = dn.of(upper);
      if (localized && localized.toUpperCase() !== upper) {
        if (lang === 'ar' && FALLBACK_NAMES_AR[upper] && localized === upper) {
          return FALLBACK_NAMES_AR[upper];
        }
        return localized;
      }
    } catch {
      // fall through to explicit fallback
    }
  }
  if (lang === 'ar') {
    return FALLBACK_NAMES_AR[upper] || FALLBACK_NAMES_EN[upper] || upper;
  }
  return FALLBACK_NAMES_EN[upper] || upper;
}

export function getCurrencySymbol(code: string): string {
  const upper = code.toUpperCase();
  if (CUSTOM_SYMBOLS[upper]) return CUSTOM_SYMBOLS[upper];
  try {
    const parts = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: upper,
      currencyDisplay: 'symbol',
    }).formatToParts(1);
    const sym = parts.find((p) => p.type === 'currency')?.value;
    if (sym && sym.length <= 6) return sym;
  } catch {
    // ignore unsupported currency code
  }
  return upper;
}

export interface CurrencyOptionItem {
  code: string;
  nameEn: string;
  nameAr: string;
  name: string;
  symbol: string;
  isPopular: boolean;
  searchText: string;
}

export function buildCurrencyCatalog(
  availableCodes: string[],
  lang: Language
): CurrencyOptionItem[] {
  const popularOrder = lang === 'ar' ? POPULAR_CURRENCIES_AR : POPULAR_CURRENCIES_EN;
  const popularIndex = new Map(popularOrder.map((c, idx) => [c, idx]));

  const uniqueCodes = Array.from(
    new Set(
      (availableCodes.length > 0 ? availableCodes : Array.from(ACTIVE_WORLD_CURRENCY_CODES))
        .map((c) => c.toUpperCase())
        .filter((c) => /^[A-Z]{3}$/.test(c))
    )
  );

  const items: CurrencyOptionItem[] = uniqueCodes.map((code) => {
    const nameEn = getCurrencyName(code, 'en');
    const nameAr = getCurrencyName(code, 'ar');
    const name = lang === 'ar' ? nameAr : nameEn;
    const symbol = getCurrencySymbol(code);
    const isPopular = popularIndex.has(code);
    return {
      code,
      nameEn,
      nameAr,
      name,
      symbol,
      isPopular,
      searchText: `${code} ${nameEn} ${nameAr} ${symbol}`.toLowerCase(),
    };
  });

  items.sort((a, b) => {
    const popA = popularIndex.get(a.code);
    const popB = popularIndex.get(b.code);
    if (popA !== undefined && popB !== undefined) return popA - popB;
    if (popA !== undefined) return -1;
    if (popB !== undefined) return 1;
    return a.code.localeCompare(b.code);
  });

  return items;
}

export function formatConvertedCurrency(value: number, currencyCode: string): string {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  let decimals = THREE_DECIMAL_CURRENCIES.has(currencyCode.toUpperCase()) ? 3 : 2;
  if (abs > 0 && abs < 0.0001) decimals = 8;
  else if (abs > 0 && abs < 0.01) decimals = 6;
  else if (abs > 0 && abs < 1 && decimals < 4) decimals = 4;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals <= 3 ? decimals : 2,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatFxSpotRate(rate: number): string {
  if (!Number.isFinite(rate)) return '—';
  const abs = Math.abs(rate);
  if (abs === 0) return '0';
  if (abs >= 100) return rate.toFixed(4);
  if (abs >= 1) return rate.toFixed(6);
  if (abs >= 0.001) return rate.toFixed(6);
  return rate.toFixed(8);
}

export function formatMoney(val: number, currencyCode = 'USD', decimals?: number): string {
  if (!Number.isFinite(val)) return '—';
  const upper = currencyCode.toUpperCase();
  try {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: upper,
      currencyDisplay: 'symbol',
    };
    if (typeof decimals === 'number') {
      options.minimumFractionDigits = decimals;
      options.maximumFractionDigits = decimals;
    }
    return new Intl.NumberFormat('en-US', options).format(val);
  } catch {
    const d = typeof decimals === 'number' ? decimals : THREE_DECIMAL_CURRENCIES.has(upper) ? 3 : 2;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(val);
    return `${upper} ${formatted}`;
  }
}

export function formatCompactMoneyAxis(val: number, currencyCode = 'USD'): string {
  if (!Number.isFinite(val)) return '0';
  const sym = getCurrencySymbol(currencyCode);
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  const suffixSym = sym.length <= 2 ? '' : ` ${sym}`;
  const prefixSym = sym.length <= 2 ? sym : '';
  if (abs >= 1_000_000) {
    return `${sign}${prefixSym}${(abs / 1_000_000).toFixed(1)}M${suffixSym}`;
  }
  if (abs >= 1000) {
    return `${sign}${prefixSym}${Math.round(abs / 1000)}k${suffixSym}`;
  }
  return `${sign}${prefixSym}${Math.round(abs)}${suffixSym}`;
}

export interface LiveExchangeRatesPayload {
  base: string;
  rates: Record<string, number>;
  currencyCount: number;
  lastUpdatedUtc: string;
  nextUpdateUtc: string;
  provider: string;
  fetchedAtMs: number;
}

export async function safeFetchJson<T>(url: string, timeoutMs = 7000): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    const raw = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      throw new Error('Response was not valid JSON');
    }
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchLiveGlobalRatesDirect(ttlMs = 15 * 60 * 1000): Promise<LiveExchangeRatesPayload> {
  let primaryRates: Record<string, number> | null = null;
  let lastUpdatedUtc = new Date().toUTCString();
  let nextUpdateUtc = new Date(Date.now() + ttlMs).toUTCString();
  let provider = 'ExchangeRate-API (open.er-api.com)';

  try {
    const data = await safeFetchJson<{
      result?: string;
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

  try {
    const backup = await safeFetchJson<{
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
          nextUpdateUtc = new Date(Date.now() + ttlMs).toUTCString();
          provider = 'Global FX Feed (fawazahmed0/currency-api)';
        }
      }
    }
  } catch {
    // Ignore backup error when primary succeeded
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

export const TROY_OUNCE_IN_GRAMS = 31.1034768;

export interface LiveMetalPricesPayload {
  gold24kUsdPerGram: number;
  silverUsdPerGram: number;
  rates: Record<string, number>;
  lastUpdatedUtc: string;
  provider: string;
  fetchedAtMs: number;
}

export async function fetchLiveMetalPricesDirect(): Promise<LiveMetalPricesPayload> {
  const metalFeeds = [
    {
      url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      provider: 'Global Spot Feed (XAU/XAG Market Rate)',
    },
    {
      url: 'https://latest.currency-api.pages.dev/v1/currencies/usd.json',
      provider: 'Global Spot Mirror (XAU/XAG Market Rate)',
    },
  ];

  let usdRatesMap: Record<string, number> | null = null;
  let dateStr = '';
  let usedProvider = metalFeeds[0].provider;

  for (const feed of metalFeeds) {
    try {
      const data = await safeFetchJson<{
        date?: string;
        usd?: Record<string, number>;
      }>(feed.url, 6000);
      if (data?.usd?.xau && data?.usd?.xag && data.usd.xau > 0 && data.usd.xag > 0) {
        usdRatesMap = data.usd;
        dateStr = data.date || '';
        usedProvider = feed.provider;
        break;
      }
    } catch {
      // try next feed
    }
  }

  if (!usdRatesMap || !usdRatesMap.xau || !usdRatesMap.xag) {
    throw new Error('Unable to retrieve live global gold and silver prices');
  }

  const gold24kUsdPerGram = 1 / usdRatesMap.xau / TROY_OUNCE_IN_GRAMS;
  const silverUsdPerGram = 1 / usdRatesMap.xag / TROY_OUNCE_IN_GRAMS;

  const rates: Record<string, number> = { USD: 1 };
  for (const code of ACTIVE_WORLD_CURRENCY_CODES) {
    const val = usdRatesMap[code.toLowerCase()];
    if (typeof val === 'number' && Number.isFinite(val) && val > 0) {
      rates[code] = val;
    }
  }

  // Ensure any currency missing from the metal feed is filled from open.er-api
  try {
    const fx = await safeFetchJson<{ result?: string; rates?: Record<string, number> }>(
      'https://open.er-api.com/v6/latest/USD',
      3500
    );
    if (fx.result === 'success' && fx.rates) {
      for (const [k, v] of Object.entries(fx.rates)) {
        if (!rates[k] && typeof v === 'number' && Number.isFinite(v) && v > 0) {
          rates[k] = v;
        }
      }
    }
  } catch {
    // Ignore secondary FX supplement error
  }

  return {
    gold24kUsdPerGram,
    silverUsdPerGram,
    rates,
    lastUpdatedUtc: dateStr ? `${dateStr} (Global Spot)` : new Date().toUTCString(),
    provider: usedProvider,
    fetchedAtMs: Date.now(),
  };
}


