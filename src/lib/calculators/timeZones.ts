import type { Language } from '../../types/calculator.ts';

export interface TimeZoneOptionItem {
  value: string; // IANA zone ID e.g. 'Asia/Kuwait' or 'UTC'
  cityLabel: string;
  regionLabel: string;
  offsetLabel: string;
  displayLabel: string;
  isPopular: boolean;
  searchText: string;
}

export const POPULAR_TIME_ZONES_EN = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Riyadh',
  'Asia/Kuwait',
  'Asia/Dubai',
  'Africa/Cairo',
  'Asia/Qatar',
  'Asia/Bahrain',
  'Asia/Amman',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export const POPULAR_TIME_ZONES_AR = [
  'Asia/Riyadh',
  'Asia/Kuwait',
  'Asia/Dubai',
  'Africa/Cairo',
  'Asia/Qatar',
  'Asia/Bahrain',
  'Asia/Muscat',
  'Asia/Amman',
  'Asia/Beirut',
  'Asia/Baghdad',
  'Africa/Casablanca',
  'Africa/Tunis',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Tokyo',
  'UTC',
];

const AR_ZONE_NAMES: Record<string, string> = {
  UTC: 'التوقيت العالمي المنسق (UTC)',
  'Asia/Riyadh': 'الرياض (السعودية)',
  'Asia/Kuwait': 'الكويت',
  'Asia/Dubai': 'دبي (الإمارات)',
  'Africa/Cairo': 'القاهرة (مصر)',
  'Asia/Qatar': 'الدوحة (قطر)',
  'Asia/Bahrain': 'المنامة (البحرين)',
  'Asia/Muscat': 'مسقط (عُمان)',
  'Asia/Amman': 'عمّان (الأردن)',
  'Asia/Beirut': 'بيروت (لبنان)',
  'Asia/Baghdad': 'بغداد (العراق)',
  'Asia/Damascus': 'دمشق (سوريا)',
  'Asia/Aden': 'عدن (اليمن)',
  'Asia/Jerusalem': 'القدس',
  'Asia/Gaza': 'غزة',
  'Asia/Hebron': 'الخليل',
  'Africa/Casablanca': 'الدار البيضاء (المغرب)',
  'Africa/Algiers': 'الجزائر',
  'Africa/Tunis': 'تونس',
  'Africa/Tripoli': 'طرابلس (ليبيا)',
  'Africa/Khartoum': 'الخرطوم (السودان)',
  'Europe/London': 'لندن (المملكة المتحدة)',
  'Europe/Paris': 'باريس (فرنسا)',
  'Europe/Berlin': 'برلين (ألمانيا)',
  'Europe/Istanbul': 'إسطنبول (تركيا)',
  'Europe/Madrid': 'مدريد (إسبانيا)',
  'Europe/Rome': 'روما (إيطاليا)',
  'Europe/Moscow': 'موسكو (روسيا)',
  'America/New_York': 'نيويورك (التوقيت الشرقي)',
  'America/Chicago': 'شيكاغو (التوقيت المركزي)',
  'America/Denver': 'دنفر (التوقيت الجبلي)',
  'America/Los_Angeles': 'لوس أنجلوس (توقيت المحيط الهادئ)',
  'America/Toronto': 'تورونتو (كندا)',
  'America/Sao_Paulo': 'ساو باولو (البرازيل)',
  'Asia/Tokyo': 'طوكيو (اليابان)',
  'Asia/Seoul': 'سول (كوريا الجنوبية)',
  'Asia/Shanghai': 'شنغهاي (الصين)',
  'Asia/Hong_Kong': 'هونغ كونغ',
  'Asia/Singapore': 'سنغافورة',
  'Asia/Kolkata': 'مومباي / نيودلهي (الهند)',
  'Asia/Karachi': 'كراتشي (باكستان)',
  'Asia/Kuala_Lumpur': 'كوالالمبور (ماليزيا)',
  'Asia/Jakarta': 'جاكرتا (إندونيسيا)',
  'Australia/Sydney': 'سيدني (أستراليا)',
  'Pacific/Auckland': 'أوكلاند (نيوزيلندا)',
};

const FALLBACK_TIME_ZONES = [
  'UTC',
  'Africa/Abidjan',
  'Africa/Accra',
  'Africa/Addis_Ababa',
  'Africa/Algiers',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Africa/Johannesburg',
  'Africa/Khartoum',
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Tripoli',
  'Africa/Tunis',
  'America/Anchorage',
  'America/Argentina/Buenos_Aires',
  'America/Bogota',
  'America/Caracas',
  'America/Chicago',
  'America/Denver',
  'America/Halifax',
  'America/Lima',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/New_York',
  'America/Phoenix',
  'America/Santiago',
  'America/Sao_Paulo',
  'America/St_Johns',
  'America/Toronto',
  'America/Vancouver',
  'Asia/Aden',
  'Asia/Amman',
  'Asia/Baghdad',
  'Asia/Bahrain',
  'Asia/Baku',
  'Asia/Bangkok',
  'Asia/Beirut',
  'Asia/Colombo',
  'Asia/Damascus',
  'Asia/Dhaka',
  'Asia/Dubai',
  'Asia/Gaza',
  'Asia/Hong_Kong',
  'Asia/Jakarta',
  'Asia/Jerusalem',
  'Asia/Kabul',
  'Asia/Karachi',
  'Asia/Kathmandu',
  'Asia/Kolkata',
  'Asia/Kuala_Lumpur',
  'Asia/Kuwait',
  'Asia/Manila',
  'Asia/Muscat',
  'Asia/Qatar',
  'Asia/Riyadh',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Taipei',
  'Asia/Tehran',
  'Asia/Tokyo',
  'Atlantic/Reykjavik',
  'Australia/Adelaide',
  'Australia/Brisbane',
  'Australia/Melbourne',
  'Australia/Perth',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Athens',
  'Europe/Berlin',
  'Europe/Brussels',
  'Europe/Dublin',
  'Europe/Istanbul',
  'Europe/Lisbon',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Moscow',
  'Europe/Paris',
  'Europe/Rome',
  'Europe/Stockholm',
  'Europe/Vienna',
  'Europe/Warsaw',
  'Europe/Zurich',
  'Pacific/Auckland',
  'Pacific/Honolulu',
];

let cachedRawZones: string[] | null = null;

export function getAllWorldTimeZoneIds(): string[] {
  if (cachedRawZones) return cachedRawZones;
  try {
    const intlAny = Intl as unknown as {
      supportedValuesOf?: (key: string) => string[];
    };
    if (typeof intlAny.supportedValuesOf === 'function') {
      const supported = intlAny.supportedValuesOf('timeZone');
      const set = new Set<string>(['UTC', ...supported]);
      cachedRawZones = Array.from(set);
      return cachedRawZones;
    }
  } catch {
    // Fallback below
  }
  cachedRawZones = FALLBACK_TIME_ZONES;
  return cachedRawZones;
}

function getZoneOffsetLabel(tz: string, refDate: Date): string {
  if (tz === 'UTC' || tz === 'Etc/UTC' || tz === 'Etc/GMT') return 'UTC+00:00';
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'longOffset',
    }).formatToParts(refDate);
    const val = parts.find((p) => p.type === 'timeZoneName')?.value;
    if (val) return val.replace(/^GMT/, 'UTC') || 'UTC+00:00';
  } catch {
    // Fallback to shortOffset
  }
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(refDate);
    const val = parts.find((p) => p.type === 'timeZoneName')?.value;
    if (val) return val.replace(/^GMT/, 'UTC');
  } catch {
    // Ignore invalid zone
  }
  return 'UTC';
}

export function getTimeZoneDisplayLabel(tz: string, lang: Language): string {
  if (lang === 'ar' && AR_ZONE_NAMES[tz]) {
    return AR_ZONE_NAMES[tz];
  }
  const parts = tz.split('/');
  const city = parts[parts.length - 1].replace(/_/g, ' ');
  if (parts.length >= 2) {
    return `${city} (${parts[0].replace(/_/g, ' ')})`;
  }
  return tz;
}

export function buildTimeZoneCatalog(lang: Language): TimeZoneOptionItem[] {
  const popularOrder = lang === 'ar' ? POPULAR_TIME_ZONES_AR : POPULAR_TIME_ZONES_EN;
  const popularIndex = new Map(popularOrder.map((z, idx) => [z, idx]));
  const now = new Date();

  const items: TimeZoneOptionItem[] = getAllWorldTimeZoneIds().map((tz) => {
    const parts = tz.split('/');
    const regionLabel = parts.length > 1 ? parts[0].replace(/_/g, ' ') : 'Global';
    const cityEn = parts[parts.length - 1].replace(/_/g, ' ');
    const offsetLabel = getZoneOffsetLabel(tz, now);
    const arName = AR_ZONE_NAMES[tz] || '';
    const displayLabel = getTimeZoneDisplayLabel(tz, lang);

    return {
      value: tz,
      cityLabel: lang === 'ar' && arName ? arName : cityEn,
      regionLabel,
      offsetLabel,
      displayLabel,
      isPopular: popularIndex.has(tz),
      searchText: `${tz} ${cityEn} ${regionLabel} ${offsetLabel} ${arName}`.toLowerCase(),
    };
  });

  items.sort((a, b) => {
    const pa = popularIndex.get(a.value);
    const pb = popularIndex.get(b.value);
    if (pa !== undefined && pb !== undefined) return pa - pb;
    if (pa !== undefined) return -1;
    if (pb !== undefined) return 1;
    return a.value.localeCompare(b.value, 'en');
  });

  return items;
}
