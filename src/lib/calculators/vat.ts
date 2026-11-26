export type VatMode = 'add' | 'extract' | 'settlement';
export type VatDiscountType = 'none' | 'percent' | 'fixed';

export interface VatLineInput {
  mode: 'add' | 'extract';
  unitAmount: number;
  quantity?: number;
  vatRatePercent: number;
  discountType?: VatDiscountType;
  discountValue?: number;
}

export interface VatLineResult {
  mode: 'add' | 'extract';
  quantity: number;
  vatRatePercent: number;
  grossBeforeDiscount: number;
  discountAmount: number;
  netAmount: number;
  vatAmount: number;
  totalAmount: number;
  perUnitNet: number;
  perUnitVat: number;
  perUnitTotal: number;
  vatShareOfTotalPercent: number;
}

export interface VatSettlementInput {
  salesAmount: number;
  purchasesAmount: number;
  vatRatePercent: number;
  amountsIncludeVat?: boolean;
}

export interface VatSettlementResult {
  vatRatePercent: number;
  amountsIncludeVat: boolean;
  salesNet: number;
  outputVat: number;
  salesTotal: number;
  purchasesNet: number;
  inputVat: number;
  purchasesTotal: number;
  netVatPayable: number; // > 0 payable to authority, < 0 refundable / credit
  isRefundDue: boolean;
}

export interface CountryVatInfo {
  countryCode: string;
  standardVatRate: number;
  currencyCode: string;
  hasVat: boolean;
  regimeLabelEn: string;
  regimeLabelAr: string;
}

const pos = (v: number): number => (Number.isFinite(v) && v > 0 ? v : 0);

// Standard country VAT / GST rates and primary ISO currency codes
const COUNTRY_VAT_DATA: Record<string, [number, string, string?, string?]> = {
  // GCC & Arab League
  SA: [15, 'SAR', 'VAT (ضريبة القيمة المضافة)', 'ضريبة القيمة المضافة'],
  AE: [5, 'AED', 'VAT', 'ضريبة القيمة المضافة'],
  BH: [10, 'BHD', 'VAT', 'ضريبة القيمة المضافة'],
  OM: [5, 'OMR', 'VAT', 'ضريبة القيمة المضافة'],
  KW: [0, 'KWD', 'No general VAT currently', 'لا توجد ضريبة قيمة مضافة حالياً'],
  QA: [0, 'QAR', 'No general VAT currently', 'لا توجد ضريبة قيمة مضافة حالياً'],
  EG: [14, 'EGP', 'Standard VAT', 'ضريبة القيمة المضافة'],
  JO: [16, 'JOD', 'General Sales Tax / VAT', 'الضريبة العامة على المبيعات'],
  LB: [11, 'LBP', 'VAT', 'ضريبة القيمة المضافة'],
  MA: [20, 'MAD', 'Standard TVA / VAT', 'الضريبة على القيمة المضافة'],
  TN: [19, 'TND', 'Standard TVA / VAT', 'الأداء على القيمة المضافة'],
  DZ: [19, 'DZD', 'Standard TVA / VAT', 'الرسم على القيمة المضافة'],
  SD: [17, 'SDG', 'Standard VAT', 'ضريبة القيمة المضافة'],
  MR: [16, 'MRU', 'Standard TVA / VAT', 'الضريبة على القيمة المضافة'],
  PS: [16, 'ILS', 'Standard VAT', 'ضريبة القيمة المضافة'],
  YE: [5, 'YER', 'General Sales Tax', 'الضريبة العامة على المبيعات'],
  DJ: [10, 'DJF', 'VAT', 'ضريبة القيمة المضافة'],
  KM: [10, 'KMF', 'Consumption Tax', 'ضريبة الاستهلاك'],
  SO: [5, 'SOS', 'Sales / Goods Tax', 'ضريبة المبيعات'],
  IQ: [0, 'IQD', 'No general VAT (custom rate supported)', 'لا توجد ضريبة قيمة مضافة عامة (يمكن التحديد يدوياً)'],
  SY: [0, 'SYP', 'No standard VAT (custom rate supported)', 'لا توجد ضريبة موحدة (يمكن التحديد يدوياً)'],
  LY: [0, 'LYD', 'No general VAT', 'لا توجد ضريبة قيمة مضافة'],

  // Europe
  GB: [20, 'GBP', 'Standard UK VAT'],
  DE: [19, 'EUR', 'Standard MwSt / VAT'],
  FR: [20, 'EUR', 'Standard TVA / VAT'],
  IT: [22, 'EUR', 'Standard IVA / VAT'],
  ES: [21, 'EUR', 'Standard IVA / VAT'],
  NL: [21, 'EUR', 'Standard BTW / VAT'],
  BE: [21, 'EUR', 'Standard BTW / TVA'],
  AT: [20, 'EUR', 'Standard USt / VAT'],
  PT: [23, 'EUR', 'Standard IVA / VAT'],
  IE: [23, 'EUR', 'Standard VAT'],
  GR: [24, 'EUR', 'Standard FPA / VAT'],
  FI: [25.5, 'EUR', 'Standard ALV / VAT'],
  LU: [17, 'EUR', 'Standard TVA / VAT'],
  MT: [18, 'EUR', 'Standard VAT'],
  CY: [19, 'EUR', 'Standard VAT'],
  EE: [22, 'EUR', 'Standard VAT'],
  LV: [21, 'EUR', 'Standard PVN / VAT'],
  LT: [21, 'EUR', 'Standard PVM / VAT'],
  SK: [23, 'EUR', 'Standard DPH / VAT'],
  SI: [22, 'EUR', 'Standard DDV / VAT'],
  HR: [25, 'EUR', 'Standard PDV / VAT'],
  PL: [23, 'PLN', 'Standard PTU / VAT'],
  SE: [25, 'SEK', 'Standard Moms / VAT'],
  DK: [25, 'DKK', 'Standard Moms / VAT'],
  NO: [25, 'NOK', 'Standard MVA / VAT'],
  CZ: [21, 'CZK', 'Standard DPH / VAT'],
  HU: [27, 'HUF', 'Standard ÁFA / VAT'],
  RO: [19, 'RON', 'Standard TVA / VAT'],
  BG: [20, 'BGN', 'Standard ДДС / VAT'],
  CH: [8.1, 'CHF', 'Standard MwSt / TVA'],
  IS: [24, 'ISK', 'Standard VSK / VAT'],
  LI: [8.1, 'CHF', 'Standard VAT'],
  AD: [4.5, 'EUR', 'IGI Indirect Tax'],
  MC: [20, 'EUR', 'TVA / VAT'],
  TR: [20, 'TRY', 'Standard KDV / VAT'],
  UA: [20, 'UAH', 'Standard VAT'],
  RU: [20, 'RUB', 'Standard VAT'],
  BY: [20, 'BYN', 'Standard VAT'],
  RS: [20, 'RSD', 'Standard PDV / VAT'],
  BA: [17, 'BAM', 'Standard PDV / VAT'],
  ME: [21, 'EUR', 'Standard PDV / VAT'],
  AL: [20, 'ALL', 'Standard TVSH / VAT'],
  MK: [18, 'MKD', 'Standard DDV / VAT'],
  MD: [20, 'MDL', 'Standard TVA / VAT'],
  GE: [18, 'GEL', 'Standard VAT'],
  AM: [20, 'AMD', 'Standard VAT'],
  AZ: [18, 'AZN', 'Standard VAT'],

  // Americas
  US: [0, 'USD', 'No federal VAT (state sales tax varies ~0–10%)', 'لا توجد ضريبة اتحادية موحدة (تختلف ضرائب الولايات)'],
  CA: [5, 'CAD', 'Federal GST (plus provincial HST/PST)', 'ضريبة السلع والخدمات الفيدرالية (GST)'],
  MX: [16, 'MXN', 'Standard IVA / VAT'],
  BR: [17, 'BRL', 'Standard ICMS / VAT benchmark'],
  AR: [21, 'ARS', 'Standard IVA / VAT'],
  CL: [19, 'CLP', 'Standard IVA / VAT'],
  CO: [19, 'COP', 'Standard IVA / VAT'],
  PE: [18, 'PEN', 'Standard IGV / VAT'],
  EC: [15, 'USD', 'Standard IVA / VAT'],
  UY: [22, 'UYU', 'Standard IVA / VAT'],
  PY: [10, 'PYG', 'Standard IVA / VAT'],
  BO: [13, 'BOB', 'Standard IVA / VAT'],
  VE: [16, 'VES', 'Standard IVA / VAT'],
  CR: [13, 'CRC', 'Standard IVA / VAT'],
  PA: [7, 'PAB', 'Standard ITBMS'],
  DO: [18, 'DOP', 'Standard ITBIS'],
  GT: [12, 'GTQ', 'Standard IVA / VAT'],
  HN: [15, 'HNL', 'Standard ISV'],
  SV: [13, 'USD', 'Standard IVA / VAT'],
  NI: [15, 'NIO', 'Standard IVA / VAT'],
  JM: [15, 'JMD', 'General Consumption Tax'],
  TT: [12.5, 'TTD', 'Standard VAT'],
  BB: [17.5, 'BBD', 'Standard VAT'],
  BS: [10, 'BSD', 'Standard VAT'],
  GY: [14, 'GYD', 'Standard VAT'],
  SR: [10, 'SRD', 'Standard VAT'],
  BZ: [12.5, 'BZD', 'General Sales Tax'],

  // Asia & Pacific
  JP: [10, 'JPY', 'Consumption Tax', 'ضريبة الاستهلاك'],
  CN: [13, 'CNY', 'Standard VAT'],
  KR: [10, 'KRW', 'Standard VAT'],
  IN: [18, 'INR', 'Standard GST'],
  ID: [11, 'IDR', 'Standard PPN / VAT'],
  TH: [7, 'THB', 'Standard VAT'],
  VN: [10, 'VND', 'Standard VAT'],
  PH: [12, 'PHP', 'Standard VAT'],
  MY: [8, 'MYR', 'Service Tax (SST)'],
  SG: [9, 'SGD', 'Standard GST'],
  AU: [10, 'AUD', 'Standard GST'],
  NZ: [15, 'NZD', 'Standard GST'],
  TW: [5, 'TWD', 'Business Tax / VAT'],
  HK: [0, 'HKD', 'No VAT / GST'],
  MO: [0, 'MOP', 'No VAT / GST'],
  BN: [0, 'BND', 'No VAT / GST'],
  PK: [18, 'PKR', 'Standard GST'],
  BD: [15, 'BDT', 'Standard VAT'],
  LK: [18, 'LKR', 'Standard VAT'],
  NP: [13, 'NPR', 'Standard VAT'],
  MV: [8, 'MVR', 'Goods & Services Tax (GST)'],
  KZ: [12, 'KZT', 'Standard VAT'],
  UZ: [12, 'UZS', 'Standard VAT'],
  KG: [12, 'KGS', 'Standard VAT'],
  TJ: [14, 'TJS', 'Standard VAT'],
  TM: [15, 'TMT', 'Standard VAT'],
  MN: [10, 'MNT', 'Standard VAT'],
  KH: [10, 'KHR', 'Standard VAT'],
  LA: [10, 'LAK', 'Standard VAT'],
  MM: [5, 'MMK', 'Commercial Tax'],
  FJ: [15, 'FJD', 'Standard VAT'],
  PG: [10, 'PGK', 'Standard GST'],
  WS: [15, 'WST', 'Standard VAGST'],
  TO: [15, 'TOP', 'Consumption Tax'],
  VU: [15, 'VUV', 'Standard VAT'],
  AF: [10, 'AFN', 'Business Receipts / BRT'],
  IR: [10, 'IRR', 'Standard VAT'],
  IL: [18, 'ILS', 'Standard VAT'],

  // Sub-Saharan Africa
  ZA: [15, 'ZAR', 'Standard VAT'],
  NG: [7.5, 'NGN', 'Standard VAT'],
  KE: [16, 'KES', 'Standard VAT'],
  GH: [15, 'GHS', 'Standard VAT'],
  ET: [15, 'ETB', 'Standard VAT'],
  TZ: [18, 'TZS', 'Standard VAT'],
  UG: [18, 'UGX', 'Standard VAT'],
  RW: [18, 'RWF', 'Standard VAT'],
  SN: [18, 'XOF', 'Standard TVA / VAT'],
  CI: [18, 'XOF', 'Standard TVA / VAT'],
  ML: [18, 'XOF', 'Standard TVA / VAT'],
  BF: [18, 'XOF', 'Standard TVA / VAT'],
  NE: [19, 'XOF', 'Standard TVA / VAT'],
  TG: [18, 'XOF', 'Standard TVA / VAT'],
  BJ: [18, 'XOF', 'Standard TVA / VAT'],
  CM: [19.25, 'XAF', 'Standard TVA / VAT'],
  GA: [18, 'XAF', 'Standard TVA / VAT'],
  CG: [18, 'XAF', 'Standard TVA / VAT'],
  TD: [18, 'XAF', 'Standard TVA / VAT'],
  GQ: [15, 'XAF', 'Standard IVA / VAT'],
  CF: [19, 'XAF', 'Standard TVA / VAT'],
  CD: [16, 'CDF', 'Standard TVA / VAT'],
  AO: [14, 'AOA', 'Standard IVA / VAT'],
  MZ: [16, 'MZN', 'Standard IVA / VAT'],
  ZM: [16, 'ZMW', 'Standard VAT'],
  ZW: [15, 'ZWG', 'Standard VAT'],
  BW: [14, 'BWP', 'Standard VAT'],
  NA: [15, 'NAD', 'Standard VAT'],
  MU: [15, 'MUR', 'Standard VAT'],
  SC: [15, 'SCR', 'Standard VAT'],
  MG: [20, 'MGA', 'Standard TVA / VAT'],
  MW: [16.5, 'MWK', 'Standard VAT'],
  SZ: [15, 'SZL', 'Standard VAT'],
  LS: [15, 'LSL', 'Standard VAT'],
  CV: [15, 'CVE', 'Standard IVA / VAT'],
  GM: [15, 'GMD', 'Standard VAT'],
  SL: [15, 'SLE', 'Standard GST'],
  LR: [10, 'LRD', 'Goods & Services Tax'],
  GN: [18, 'GNF', 'Standard TVA / VAT'],
  BI: [18, 'BIF', 'Standard TVA / VAT'],
  ER: [5, 'ERN', 'Sales Tax'],
  SS: [18, 'SSP', 'Sales / Excise Benchmark'],
  ST: [15, 'STN', 'Standard IVA / VAT'],
};

export function getCountryVatInfo(countryCode: string): CountryVatInfo {
  const upper = countryCode.trim().toUpperCase();
  const entry = COUNTRY_VAT_DATA[upper];
  if (entry) {
    const [rate, currencyCode, enLabel, arLabel] = entry;
    const hasVat = rate > 0;
    return {
      countryCode: upper,
      standardVatRate: rate,
      currencyCode,
      hasVat,
      regimeLabelEn: enLabel || (hasVat ? 'Standard VAT / GST' : 'No national VAT'),
      regimeLabelAr: arLabel || (hasVat ? 'نسبة الضريبة القياسية' : 'لا توجد ضريبة قيمة مضافة'),
    };
  }
  return {
    countryCode: upper,
    standardVatRate: 0,
    currencyCode: 'USD',
    hasVat: false,
    regimeLabelEn: 'Custom VAT / tax rate',
    regimeLabelAr: 'نسبة ضريبة مخصصة حسب النشاط',
  };
}

export function calculateVatLine(input: VatLineInput): VatLineResult {
  const unit = pos(input.unitAmount);
  const qty = pos(input.quantity ?? 1);
  const ratePct = pos(input.vatRatePercent);
  const rateFactor = ratePct / 100;

  const grossInput = unit * qty;

  if (input.mode === 'add') {
    const dVal = pos(input.discountValue ?? 0);
    let discountAmount = 0;
    if (input.discountType === 'percent') {
      discountAmount = grossInput * Math.min(dVal, 100) / 100;
    } else if (input.discountType === 'fixed') {
      discountAmount = Math.min(dVal, grossInput);
    }

    const netAmount = Math.max(0, grossInput - discountAmount);
    const vatAmount = netAmount * rateFactor;
    const totalAmount = netAmount + vatAmount;

    return {
      mode: 'add',
      quantity: qty,
      vatRatePercent: ratePct,
      grossBeforeDiscount: grossInput,
      discountAmount,
      netAmount,
      vatAmount,
      totalAmount,
      perUnitNet: qty > 0 ? netAmount / qty : 0,
      perUnitVat: qty > 0 ? vatAmount / qty : 0,
      perUnitTotal: qty > 0 ? totalAmount / qty : 0,
      vatShareOfTotalPercent: totalAmount > 0 ? (vatAmount / totalAmount) * 100 : 0,
    };
  }

  // Extract VAT from inclusive total: Net = Total / (1 + r), VAT = Total - Net
  const totalAmount = grossInput;
  const netAmount = rateFactor > 0 ? totalAmount / (1 + rateFactor) : totalAmount;
  const vatAmount = Math.max(0, totalAmount - netAmount);

  return {
    mode: 'extract',
    quantity: qty,
    vatRatePercent: ratePct,
    grossBeforeDiscount: totalAmount,
    discountAmount: 0,
    netAmount,
    vatAmount,
    totalAmount,
    perUnitNet: qty > 0 ? netAmount / qty : 0,
    perUnitVat: qty > 0 ? vatAmount / qty : 0,
    perUnitTotal: qty > 0 ? totalAmount / qty : 0,
    vatShareOfTotalPercent: totalAmount > 0 ? (vatAmount / totalAmount) * 100 : 0,
  };
}

export function calculateVatSettlement(input: VatSettlementInput): VatSettlementResult {
  const salesRaw = pos(input.salesAmount);
  const purchasesRaw = pos(input.purchasesAmount);
  const ratePct = pos(input.vatRatePercent);
  const rateFactor = ratePct / 100;
  const inclusive = input.amountsIncludeVat !== false;

  const salesNet = inclusive && rateFactor > 0 ? salesRaw / (1 + rateFactor) : salesRaw;
  const outputVat = inclusive ? Math.max(0, salesRaw - salesNet) : salesNet * rateFactor;
  const salesTotal = salesNet + outputVat;

  const purchasesNet =
    inclusive && rateFactor > 0 ? purchasesRaw / (1 + rateFactor) : purchasesRaw;
  const inputVat = inclusive
    ? Math.max(0, purchasesRaw - purchasesNet)
    : purchasesNet * rateFactor;
  const purchasesTotal = purchasesNet + inputVat;

  const netVatPayable = outputVat - inputVat;

  return {
    vatRatePercent: ratePct,
    amountsIncludeVat: inclusive,
    salesNet,
    outputVat,
    salesTotal,
    purchasesNet,
    inputVat,
    purchasesTotal,
    netVatPayable,
    isRefundDue: netVatPayable < 0,
  };
}
