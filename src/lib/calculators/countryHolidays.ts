import type { Language } from '../../types/calculator.ts';

export interface PublicHolidayEntry {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface CountryOptionItem {
  code: string;
  nameEn: string;
  nameAr: string;
  name: string;
  weekendDays: number[]; // JS getUTCDay(): 0 = Sun ... 6 = Sat
  weekendLabelEn: string;
  weekendLabelAr: string;
  isPopular: boolean;
  searchText: string;
}

export const POPULAR_COUNTRIES_EN = [
  'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN', 'SG', 'CH',
  'NL', 'ES', 'IT', 'BR', 'MX', 'SA', 'AE', 'KW', 'EG', 'KR',
];

export const POPULAR_COUNTRIES_AR = [
  'KW', 'SA', 'AE', 'EG', 'QA', 'BH', 'OM', 'JO', 'IQ', 'LB',
  'MA', 'DZ', 'TN', 'PS', 'SY', 'YE', 'LY', 'SD', 'US', 'GB',
];

// Exclude obsolete ISO-3166 codes, macro-regions, and uninhabited territories
const EXCLUDED_REGION_CODES = new Set([
  'AC', 'AN', 'AQ', 'BU', 'BV', 'CP', 'CS', 'DD', 'DG', 'DY',
  'EA', 'EU', 'EZ', 'FX', 'GS', 'HM', 'HV', 'IC', 'IO', 'NH',
  'QO', 'RH', 'SU', 'TA', 'TF', 'TP', 'UK', 'UM', 'UN', 'VD',
  'XA', 'XB', 'YD', 'YU', 'ZR', 'ZZ',
]);

// Explicit non-Sat/Sun weekend definitions (JS weekday: 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat)
// Covers all Arab, Islamic, and special-weekend jurisdictions consistently across all browsers.
const EXPLICIT_WEEKEND_DAYS: Record<string, number[]> = {
  AF: [4, 5], // Thu & Fri
  IR: [5],    // Fri
  BN: [5, 0], // Fri & Sun
  BH: [5, 6], // Fri & Sat
  DJ: [5, 6], // Fri & Sat
  DZ: [5, 6], // Fri & Sat
  EG: [5, 6], // Fri & Sat
  IL: [5, 6], // Fri & Sat
  IQ: [5, 6], // Fri & Sat
  JO: [5, 6], // Fri & Sat
  KM: [5, 6], // Fri & Sat
  KW: [5, 6], // Fri & Sat
  LY: [5, 6], // Fri & Sat
  MV: [5, 6], // Fri & Sat
  OM: [5, 6], // Fri & Sat
  PS: [5, 6], // Fri & Sat
  QA: [5, 6], // Fri & Sat
  SA: [5, 6], // Fri & Sat
  SD: [5, 6], // Fri & Sat
  SO: [5, 6], // Fri & Sat
  SY: [5, 6], // Fri & Sat
  YE: [5, 6], // Fri & Sat
};

const WEEKDAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_NAMES_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

let regionDisplayEn: Intl.DisplayNames | null = null;
let regionDisplayAr: Intl.DisplayNames | null = null;

function getRegionDisplay(lang: Language): Intl.DisplayNames | null {
  try {
    if (lang === 'ar') {
      if (!regionDisplayAr) regionDisplayAr = new Intl.DisplayNames(['ar'], { type: 'region' });
      return regionDisplayAr;
    }
    if (!regionDisplayEn) regionDisplayEn = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionDisplayEn;
  } catch {
    return null;
  }
}

export function getCountryName(countryCode: string, lang: Language): string {
  const upper = countryCode.toUpperCase();
  const dn = getRegionDisplay(lang);
  if (dn) {
    try {
      const name = dn.of(upper);
      if (name && name.toUpperCase() !== upper && !/unknown region/i.test(name)) {
        return name;
      }
    } catch {
      // ignore invalid region code
    }
  }
  return upper;
}

export function getCountryWeekendDays(countryCode: string): number[] {
  const upper = countryCode.toUpperCase();
  if (EXPLICIT_WEEKEND_DAYS[upper]) {
    return EXPLICIT_WEEKEND_DAYS[upper];
  }
  try {
    const loc = new Intl.Locale(`en-${upper}`) as Intl.Locale & {
      getWeekInfo?: () => { weekend?: number[] };
      weekInfo?: { weekend?: number[] };
    };
    const info = typeof loc.getWeekInfo === 'function' ? loc.getWeekInfo() : loc.weekInfo;
    if (info?.weekend && Array.isArray(info.weekend) && info.weekend.length > 0) {
      // Intl.Locale ISO weekday uses 1=Mon ... 7=Sun -> convert to JS 0=Sun ... 6=Sat
      return info.weekend.map((isoDay) => isoDay % 7);
    }
  } catch {
    // Fallback for browsers without Intl.Locale weekInfo
  }
  return [6, 0]; // Sat & Sun default
}

export function formatWeekendLabel(weekendDays: number[], lang: Language): string {
  const names = lang === 'ar' ? WEEKDAY_NAMES_AR : WEEKDAY_NAMES_EN;
  const sep = lang === 'ar' ? ' و' : ' & ';
  return weekendDays.map((d) => names[d] || '').filter(Boolean).join(sep);
}

let cachedIsoCountryCodes: string[] | null = null;

export function getAllWorldCountryCodes(): string[] {
  if (cachedIsoCountryCodes) return cachedIsoCountryCodes;
  const dn = getRegionDisplay('en');
  const codes: string[] = [];
  for (let i = 65; i <= 90; i++) {
    for (let j = 65; j <= 90; j++) {
      const code = String.fromCharCode(i, j);
      if (EXCLUDED_REGION_CODES.has(code)) continue;
      const name = dn?.of(code);
      if (!name || name === code || /unknown region/i.test(name)) continue;
      codes.push(code);
    }
  }
  cachedIsoCountryCodes = codes;
  return codes;
}

export function buildCountryCatalog(lang: Language): CountryOptionItem[] {
  const popularOrder = lang === 'ar' ? POPULAR_COUNTRIES_AR : POPULAR_COUNTRIES_EN;
  const popularIndex = new Map(popularOrder.map((c, idx) => [c, idx]));

  const items: CountryOptionItem[] = getAllWorldCountryCodes().map((code) => {
    const nameEn = getCountryName(code, 'en');
    const nameAr = getCountryName(code, 'ar');
    const name = lang === 'ar' ? nameAr : nameEn;
    const weekendDays = getCountryWeekendDays(code);
    const weekendLabelEn = formatWeekendLabel(weekendDays, 'en');
    const weekendLabelAr = formatWeekendLabel(weekendDays, 'ar');

    return {
      code,
      nameEn,
      nameAr,
      name,
      weekendDays,
      weekendLabelEn,
      weekendLabelAr,
      isPopular: popularIndex.has(code),
      searchText: `${code} ${nameEn} ${nameAr}`.toLowerCase(),
    };
  });

  items.sort((a, b) => {
    const pa = popularIndex.get(a.code);
    const pb = popularIndex.get(b.code);
    if (pa !== undefined && pb !== undefined) return pa - pb;
    if (pa !== undefined) return -1;
    if (pb !== undefined) return 1;
    return a.name.localeCompare(b.name, lang === 'ar' ? 'ar' : 'en');
  });

  return items;
}

// --- Hijri (Umm al-Qura) conversion cache for countries missing from date-holidays ---
const hijriYearMapCache = new Map<number, Map<string, string[]>>();

function getHijriYearLookup(gregorianYear: number): Map<string, string[]> {
  const existing = hijriYearMapCache.get(gregorianYear);
  if (existing) return existing;

  const map = new Map<string, string[]>();
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const cursor = new Date(Date.UTC(gregorianYear, 0, 1, 12));
    while (cursor.getUTCFullYear() === gregorianYear) {
      const parts = fmt.formatToParts(cursor);
      const hm = Number(parts.find((p) => p.type === 'month')?.value);
      const hd = Number(parts.find((p) => p.type === 'day')?.value);
      if (hm && hd) {
        const key = `${hm}-${hd}`;
        const iso = cursor.toISOString().slice(0, 10);
        const list = map.get(key) || [];
        list.push(iso);
        map.set(key, list);
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  } catch {
    // Fallback if Intl islamic-umalqura is unavailable
  }
  hijriYearMapCache.set(gregorianYear, map);
  return map;
}

function addHijriHoliday(
  out: PublicHolidayEntry[],
  year: number,
  hMonth: number,
  hDay: number,
  nameEn: string,
  nameAr: string,
  lang: Language
) {
  const lookup = getHijriYearLookup(year);
  const dates = lookup.get(`${hMonth}-${hDay}`) || [];
  const name = lang === 'ar' ? nameAr : nameEn;
  for (const date of dates) {
    out.push({ date, name });
  }
}

function fixedDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number): string {
  const first = new Date(Date.UTC(year, month - 1, 1, 12));
  const diff = (weekday - first.getUTCDay() + 7) % 7;
  const day = 1 + diff + (nth - 1) * 7;
  return fixedDate(year, month, day);
}

interface FixedHolidaySpec {
  month: number;
  day: number;
  en: string;
  ar: string;
}

const ISLAMIC_STANDARD_COUNTRIES = new Set([
  'KW', 'QA', 'OM', 'JO', 'IQ', 'LB', 'SY', 'YE', 'PS', 'AF', 'MV', 'KG', 'TJ', 'TM',
]);

const SUPPLEMENTAL_FIXED_HOLIDAYS: Record<string, FixedHolidaySpec[]> = {
  KW: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 2, day: 25, en: 'Kuwait National Day', ar: 'اليوم الوطني الكويتي' },
    { month: 2, day: 26, en: 'Liberation Day', ar: 'يوم التحرير' },
  ],
  QA: [
    { month: 12, day: 18, en: 'Qatar National Day', ar: 'اليوم الوطني القطري' },
  ],
  OM: [
    { month: 1, day: 11, en: "Sultan's Accession Day", ar: 'يوم تولي السلطان' },
    { month: 11, day: 18, en: 'Oman National Day', ar: 'العيد الوطني العماني' },
    { month: 11, day: 19, en: 'Oman National Day (Day 2)', ar: 'العيد الوطني العماني (اليوم الثاني)' },
  ],
  JO: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 5, day: 25, en: 'Independence Day', ar: 'عيد الاستقلال الأردني' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  IQ: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 1, day: 6, en: 'Army Day', ar: 'عيد الجيش العراقي' },
    { month: 3, day: 21, en: 'Nowruz', ar: 'عيد نوروز' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 7, day: 14, en: 'Republic Day', ar: 'يوم الجمهورية' },
    { month: 10, day: 3, en: 'Iraqi National Day', ar: 'اليوم الوطني العراقي' },
    { month: 12, day: 10, en: 'Victory Day', ar: 'يوم النصر' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  LB: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 1, day: 6, en: 'Armenian Christmas', ar: 'عيد الميلاد الأرمني' },
    { month: 2, day: 9, en: 'St. Maron Day', ar: 'عيد مار مارون' },
    { month: 3, day: 25, en: 'Annunciation Day', ar: 'عيد البشارة' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 8, day: 15, en: 'Assumption Day', ar: 'عيد انتقال السيدة العذراء' },
    { month: 11, day: 22, en: 'Independence Day', ar: 'عيد الاستقلال اللبناني' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  SY: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 3, day: 21, en: "Mother's Day", ar: 'عيد الأم' },
    { month: 4, day: 17, en: 'Evacuation Day', ar: 'عيد الجلاء' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  YE: [
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 5, day: 22, en: 'Unity Day', ar: 'يوم الوحدة اليمنية' },
    { month: 9, day: 26, en: 'Revolution Day', ar: 'ثورة 26 سبتمبر' },
    { month: 10, day: 14, en: 'Liberation Day', ar: 'ثورة 14 أكتوبر' },
    { month: 11, day: 30, en: 'Independence Day', ar: 'عيد الاستقلال' },
  ],
  PS: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 1, day: 7, en: 'Orthodox Christmas', ar: 'عيد الميلاد الشرقي' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 11, day: 15, en: 'Independence Day', ar: 'إعلان الاستقلال الفلسطيني' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  AF: [
    { month: 3, day: 21, en: 'Nowruz', ar: 'نوروز' },
    { month: 8, day: 19, en: 'Independence Day', ar: 'عيد الاستقلال' },
  ],
  MV: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 7, day: 26, en: 'Independence Day', ar: 'عيد الاستقلال' },
    { month: 11, day: 3, en: 'Victory Day', ar: 'يوم النصر' },
    { month: 11, day: 11, en: 'Republic Day', ar: 'يوم الجمهورية' },
  ],
  KG: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 3, day: 8, en: "International Women's Day", ar: 'اليوم العالمي للمرأة' },
    { month: 3, day: 21, en: 'Nooruz', ar: 'عيد نوروز' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 5, day: 5, en: 'Constitution Day', ar: 'يوم الدستور' },
    { month: 5, day: 9, en: 'Victory Day', ar: 'يوم النصر' },
    { month: 8, day: 31, en: 'Independence Day', ar: 'عيد الاستقلال' },
  ],
  TJ: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 3, day: 8, en: "Mother's Day", ar: 'عيد الأم' },
    { month: 3, day: 21, en: 'Navruz', ar: 'عيد نوروز' },
    { month: 5, day: 9, en: 'Victory Day', ar: 'يوم النصر' },
    { month: 6, day: 27, en: 'National Unity Day', ar: 'يوم الوحدة الوطنية' },
    { month: 9, day: 9, en: 'Independence Day', ar: 'عيد الاستقلال' },
    { month: 11, day: 6, en: 'Constitution Day', ar: 'يوم الدستور' },
  ],
  TM: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 3, day: 8, en: "International Women's Day", ar: 'اليوم العالمي للمرأة' },
    { month: 3, day: 21, en: 'National Spring Holiday', ar: 'عيد الربيع الوطني' },
    { month: 5, day: 18, en: 'Constitution & Flag Day', ar: 'يوم الدستور والعلم' },
    { month: 9, day: 27, en: 'Independence Day', ar: 'عيد الاستقلال' },
    { month: 12, day: 12, en: 'Neutrality Day', ar: 'يوم الحياد' },
  ],
  NP: [
    { month: 1, day: 11, en: 'Prithvi Jayanti', ar: 'يوم الوحدة الوطنية' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 5, day: 29, en: 'Republic Day', ar: 'يوم الجمهورية' },
    { month: 9, day: 19, en: 'Constitution Day', ar: 'يوم الدستور' },
  ],
  KH: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 1, day: 7, en: 'Victory Day', ar: 'يوم النصر' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 9, day: 24, en: 'Constitution Day', ar: 'يوم الدستور' },
    { month: 11, day: 9, en: 'Independence Day', ar: 'عيد الاستقلال' },
  ],
  LA: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 3, day: 8, en: "International Women's Day", ar: 'اليوم العالمي للمرأة' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 12, day: 2, en: 'National Day', ar: 'اليوم الوطني' },
  ],
  MM: [
    { month: 1, day: 4, en: 'Independence Day', ar: 'عيد الاستقلال' },
    { month: 2, day: 12, en: 'Union Day', ar: 'يوم الاتحاد' },
    { month: 3, day: 2, en: "Peasants' Day", ar: 'يوم الفلاحين' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 7, day: 19, en: "Martyrs' Day", ar: 'يوم الشهداء' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  MN: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 3, day: 8, en: "International Women's Day", ar: 'اليوم العالمي للمرأة' },
    { month: 7, day: 11, en: 'Naadam Holiday', ar: 'عيد ندام الوطني' },
    { month: 11, day: 26, en: 'Republic Day', ar: 'يوم الجمهورية' },
  ],
  BT: [
    { month: 2, day: 21, en: "King's Birthday", ar: 'عيد ميلاد الملك' },
    { month: 5, day: 2, en: 'Third King Birth Anniversary', ar: 'ذكرى الملك الثالث' },
    { month: 12, day: 17, en: 'National Day', ar: 'اليوم الوطني' },
  ],
  TL: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 5, day: 20, en: 'Restoration of Independence', ar: 'استعادة الاستقلال' },
    { month: 11, day: 28, en: 'Proclamation of Independence', ar: 'إعلان الاستقلال' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  MO: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 10, day: 1, en: 'National Day', ar: 'اليوم الوطني' },
    { month: 12, day: 20, en: 'Macao SAR Establishment Day', ar: 'يوم تأسيس ماكاو' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  PG: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 9, day: 16, en: 'Independence Day', ar: 'عيد الاستقلال' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
    { month: 12, day: 26, en: 'Boxing Day', ar: 'يوم الصناديق' },
  ],
  SB: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 7, day: 7, en: 'Independence Day', ar: 'عيد الاستقلال' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  WS: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 6, day: 1, en: 'Independence Day', ar: 'عيد الاستقلال' },
    { month: 12, day: 25, en: 'Christmas Day', ar: 'عيد الميلاد المجيد' },
  ],
  KP: [
    { month: 1, day: 1, en: "New Year's Day", ar: 'رأس السنة الميلادية' },
    { month: 5, day: 1, en: 'Labour Day', ar: 'عيد العمال' },
    { month: 8, day: 15, en: 'Liberation Day', ar: 'يوم التحرير' },
    { month: 9, day: 9, en: 'Foundation Day', ar: 'يوم التأسيس' },
  ],
};

function getSupplementalCountryHolidays(
  countryCode: string,
  year: number,
  lang: Language
): PublicHolidayEntry[] {
  const upper = countryCode.toUpperCase();
  const out: PublicHolidayEntry[] = [];

  const fixedSpecs = SUPPLEMENTAL_FIXED_HOLIDAYS[upper];
  if (fixedSpecs) {
    for (const spec of fixedSpecs) {
      out.push({
        date: fixedDate(year, spec.month, spec.day),
        name: lang === 'ar' ? spec.ar : spec.en,
      });
    }
  } else {
    out.push({
      date: fixedDate(year, 1, 1),
      name: lang === 'ar' ? 'رأس السنة الميلادية' : "New Year's Day",
    });
  }

  // Qatar National Sports Day: 2nd Tuesday of February
  if (upper === 'QA') {
    out.push({
      date: nthWeekdayOfMonth(year, 2, 2, 2),
      name: lang === 'ar' ? 'اليوم الرياضي للدولة' : 'National Sports Day',
    });
  }

  if (ISLAMIC_STANDARD_COUNTRIES.has(upper)) {
    // Islamic New Year (1 Muharram)
    addHijriHoliday(out, year, 1, 1, 'Islamic New Year', 'رأس السنة الهجرية', lang);

    // Ashura in Iraq & Afghanistan (10 Muharram)
    if (upper === 'IQ' || upper === 'AF') {
      addHijriHoliday(out, year, 1, 10, 'Day of Ashura', 'يوم عاشوراء', lang);
    }

    // Mawlid (12 Rabi al-Awwal) - excluded in Qatar/AF official secular list or kept where official
    if (upper !== 'QA') {
      addHijriHoliday(out, year, 3, 12, "Prophet's Birthday (Mawlid)", 'المولد النبوي الشريف', lang);
    }

    // Al-Isra wal-Mi'raj (27 Rajab) for Kuwait & Oman
    if (upper === 'KW' || upper === 'OM') {
      addHijriHoliday(out, year, 7, 27, "Al-Isra' wal-Mi'raj", 'ذكرى الإسراء والمعراج', lang);
    }

    // Eid al-Fitr (1-3 Shawwal)
    addHijriHoliday(out, year, 10, 1, 'Eid al-Fitr (Day 1)', 'عيد الفطر (اليوم الأول)', lang);
    addHijriHoliday(out, year, 10, 2, 'Eid al-Fitr (Day 2)', 'عيد الفطر (اليوم الثاني)', lang);
    addHijriHoliday(out, year, 10, 3, 'Eid al-Fitr (Day 3)', 'عيد الفطر (اليوم الثالث)', lang);

    // Day of Arafat (9 Dhu al-Hijjah)
    if (['KW', 'QA', 'OM', 'JO', 'PS', 'AF', 'IQ'].includes(upper)) {
      addHijriHoliday(out, year, 12, 9, 'Waqfat Arafat Day', 'وقفة عرفات', lang);
    }

    // Eid al-Adha (10-12 Dhu al-Hijjah)
    addHijriHoliday(out, year, 12, 10, 'Eid al-Adha (Day 1)', 'عيد الأضحى (اليوم الأول)', lang);
    addHijriHoliday(out, year, 12, 11, 'Eid al-Adha (Day 2)', 'عيد الأضحى (اليوم الثاني)', lang);
    addHijriHoliday(out, year, 12, 12, 'Eid al-Adha (Day 3)', 'عيد الأضحى (اليوم الثالث)', lang);
  }

  return out;
}

export interface HolidaysConstructorLike {
  new (country: string, opts?: { types?: string[] }): {
    getHolidays(year: number, lang?: string): Array<{ date: string; name: string; type?: string }>;
  };
  new (): {
    getCountries(lang?: string): Record<string, string>;
  };
}

let cachedHolidaysCtor: HolidaysConstructorLike | null = null;
let cachedDhSupportedCountries: Set<string> | null = null;

export async function loadDateHolidaysEngine(): Promise<HolidaysConstructorLike | null> {
  if (cachedHolidaysCtor) return cachedHolidaysCtor;
  try {
    const mod = await import('date-holidays');
    const Ctor = (mod.default || mod) as unknown as HolidaysConstructorLike;
    cachedHolidaysCtor = Ctor;
    const probe = new Ctor();
    cachedDhSupportedCountries = new Set(Object.keys(probe.getCountries('en') || {}));
    return Ctor;
  } catch {
    return null;
  }
}

export function getCountryPublicHolidaysForYear(
  countryCode: string,
  year: number,
  lang: Language,
  holidaysCtor?: HolidaysConstructorLike | null
): PublicHolidayEntry[] {
  const upper = countryCode.toUpperCase();
  const ctor = holidaysCtor ?? cachedHolidaysCtor;

  if (ctor) {
    if (!cachedDhSupportedCountries) {
      try {
        cachedDhSupportedCountries = new Set(Object.keys(new ctor().getCountries('en') || {}));
      } catch {
        cachedDhSupportedCountries = new Set();
      }
    }
    if (cachedDhSupportedCountries.has(upper)) {
      try {
        const instance = new ctor(upper, { types: ['public'] });
        const raw = instance.getHolidays(year, lang === 'ar' ? 'ar' : 'en') || [];
        const byDate = new Map<string, Set<string>>();
        for (const item of raw) {
          if (item.type && item.type !== 'public') continue;
          const iso = String(item.date || '').slice(0, 10);
          if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) continue;
          const set = byDate.get(iso) || new Set<string>();
          if (item.name) set.add(item.name);
          byDate.set(iso, set);
        }
        if (byDate.size > 0) {
          return Array.from(byDate.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, names]) => ({
              date,
              name: Array.from(names).join(' · '),
            }));
        }
      } catch {
        // Fall through to supplemental calendar
      }
    }
  }

  const supplemental = getSupplementalCountryHolidays(upper, year, lang);
  const byDate = new Map<string, Set<string>>();
  for (const item of supplemental) {
    const set = byDate.get(item.date) || new Set<string>();
    set.add(item.name);
    byDate.set(item.date, set);
  }
  return Array.from(byDate.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, names]) => ({
      date,
      name: Array.from(names).join(' · '),
    }));
}

export function getCountryPublicHolidaysForRange(
  countryCode: string,
  startIso: string,
  endIso: string,
  lang: Language,
  holidaysCtor?: HolidaysConstructorLike | null
): PublicHolidayEntry[] {
  const startYear = parseInt(startIso.slice(0, 4), 10);
  const endYear = parseInt(endIso.slice(0, 4), 10);
  if (!startYear || !endYear) return [];
  const minY = Math.min(startYear, endYear);
  const maxY = Math.max(startYear, endYear);
  if (maxY - minY > 100) return [];

  const all: PublicHolidayEntry[] = [];
  for (let y = minY; y <= maxY; y++) {
    all.push(...getCountryPublicHolidaysForYear(countryCode, y, lang, holidaysCtor));
  }
  return all;
}
