/**
 * IP Geolocation and Region Detection Utility
 * Automatically resolves visitor's region, city, and country flag on site load.
 */

export interface GeoLocationInfo {
  country: string;
  countryAr: string;
  countryCode: string;
  countryFlag: string;
  city: string;
  region: string;
}

// Convert country code to emoji flag
export const getFlagEmoji = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Map of common country codes to Arabic names
const ARABIC_COUNTRIES: Record<string, string> = {
  SA: 'المملكة العربية السعودية',
  AE: 'الإمارات العربية المتحدة',
  EG: 'جمهورية مصر العربية',
  MA: 'المملكة المغربية',
  DZ: 'الجمهورية الجزائرية',
  IQ: 'العراق',
  KW: 'الكويت',
  OM: 'سلطنة عمان',
  QA: 'قطر',
  BH: 'البحرين',
  JO: 'الأردن',
  PS: 'فلسطين',
  LB: 'لبنان',
  SY: 'سوريا',
  TN: 'تونس',
  LY: 'ليبيا',
  YE: 'اليمن',
  SD: 'السودان',
  TR: 'تركيا',
  US: 'الولايات المتحدة',
  GB: 'المملكة المتحدة',
  DE: 'ألمانيا',
  FR: 'فرنسا',
  CA: 'كندا',
};

// Fallback estimation using browser Intl timezone
export const getTimezoneFallbackGeo = (): GeoLocationInfo => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  let countryCode = 'SA';
  let city = 'الرياض';
  let region = 'الشرق الأوسط';

  if (tz.includes('Riyadh')) {
    countryCode = 'SA';
    city = 'الرياض';
  } else if (tz.includes('Dubai')) {
    countryCode = 'AE';
    city = 'دبي';
  } else if (tz.includes('Cairo')) {
    countryCode = 'EG';
    city = 'القاهرة';
  } else if (tz.includes('Casablanca')) {
    countryCode = 'MA';
    city = 'الدار البيضاء';
  } else if (tz.includes('Algiers')) {
    countryCode = 'DZ';
    city = 'الجزائر';
  } else if (tz.includes('Baghdad')) {
    countryCode = 'IQ';
    city = 'بغداد';
  } else if (tz.includes('Kuwait')) {
    countryCode = 'KW';
    city = 'الكويت';
  } else if (tz.includes('Amman')) {
    countryCode = 'JO';
    city = 'عمان';
  } else if (tz.includes('Istanbul')) {
    countryCode = 'TR';
    city = 'إسطنبول';
  } else if (tz.includes('London')) {
    countryCode = 'GB';
    city = 'لندن';
  } else if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago')) {
    countryCode = 'US';
    city = 'الولايات المتحدة';
  }

  const countryAr = ARABIC_COUNTRIES[countryCode] || 'الشرق الأوسط';
  const flag = getFlagEmoji(countryCode);

  return {
    country: tz.split('/')[1]?.replace('_', ' ') || 'Global',
    countryAr,
    countryCode,
    countryFlag: flag,
    city,
    region,
  };
};

/**
 * Fetch automatic IP Geolocation
 */
export const detectUserGeoLocation = async (): Promise<GeoLocationInfo> => {
  if (typeof window === 'undefined') return getTimezoneFallbackGeo();

  // Check cache in session or local storage first
  const cached = localStorage.getItem('apexdrop_user_geo');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // continue
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    // Try reliable IP lookup
    const res = await fetch('https://ipwho.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false) {
        const countryCode = data.country_code || 'SA';
        const flag = data.flag?.emoji || getFlagEmoji(countryCode);
        const countryAr = ARABIC_COUNTRIES[countryCode] || data.country || 'الشرق الأوسط';

        const result: GeoLocationInfo = {
          country: data.country || 'Global',
          countryAr,
          countryCode,
          countryFlag: flag,
          city: data.city || 'المدينة',
          region: data.region || 'المنطقة',
        };

        localStorage.setItem('apexdrop_user_geo', JSON.stringify(result));
        return result;
      }
    }
  } catch {
    // network failure / timeout -> fallback to timezone
  }

  const fallback = getTimezoneFallbackGeo();
  localStorage.setItem('apexdrop_user_geo', JSON.stringify(fallback));
  return fallback;
};
