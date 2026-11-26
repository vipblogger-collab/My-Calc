export const GOLD_NISAB_GRAMS = 85;
export const SILVER_NISAB_GRAMS = 595;
export const ZAKAT_RATE = 0.025; // 2.5%

export type GoldKarat = 24 | 22 | 21 | 18;

export interface GoldHoldingItem {
  id: string;
  karat: GoldKarat;
  weightGrams: number;
}

export interface ZakatInsanInput {
  moneyAmount: number;
  goldItems: GoldHoldingItem[];
  silverWeightGrams: number;
  gold24kPricePerGram: number;
  silverPricePerGram: number;
  enforceMoneyNisab?: boolean;
}

export interface GoldHoldingBreakdown extends GoldHoldingItem {
  pricePerGram: number;
  estimatedValue: number;
  pure24kGrams: number;
}

export interface ZakatInsanResult {
  goldPricesByKarat: Record<GoldKarat, number>;
  goldNisabValue: number;
  silverNisabValue: number;

  moneyAmount: number;
  moneyMeetsNisab: boolean;
  moneyZakat: number;

  goldTotalRawGrams: number;
  goldPure24kGrams: number;
  goldEstimatedValue: number;
  goldMeetsNisab: boolean;
  goldZakat: number;
  goldBreakdown: GoldHoldingBreakdown[];

  silverWeightGrams: number;
  silverEstimatedValue: number;
  silverMeetsNisab: boolean;
  silverZakat: number;

  totalZakatDue: number;
}

const pos = (v: number): number => (Number.isFinite(v) && v > 0 ? v : 0);

export function getGoldPricesByKarat(gold24kPricePerGram: number): Record<GoldKarat, number> {
  const p24 = pos(gold24kPricePerGram);
  return {
    24: p24,
    22: p24 * (22 / 24),
    21: p24 * (21 / 24),
    18: p24 * (18 / 24),
  };
}

export function calculateZakat(input: ZakatInsanInput): ZakatInsanResult {
  const goldPricesByKarat = getGoldPricesByKarat(input.gold24kPricePerGram);
  const silverPrice = pos(input.silverPricePerGram);

  const goldNisabValue = GOLD_NISAB_GRAMS * goldPricesByKarat[24];
  const silverNisabValue = SILVER_NISAB_GRAMS * silverPrice;

  // 1. Cash / Money Zakat (2.5%)
  const moneyAmount = pos(input.moneyAmount);
  const moneyMeetsNisab = goldNisabValue <= 0 ? moneyAmount > 0 : moneyAmount >= goldNisabValue;
  const moneyZakat =
    input.enforceMoneyNisab && !moneyMeetsNisab ? 0 : moneyAmount * ZAKAT_RATE;

  // 2. Gold Zakat (multi-karat items converted to pure 24K equivalent for Sharia 85g Nisab)
  let goldTotalRawGrams = 0;
  let goldPure24kGrams = 0;
  let goldEstimatedValue = 0;

  const goldBreakdown: GoldHoldingBreakdown[] = (input.goldItems || []).map((item) => {
    const weightGrams = pos(item.weightGrams);
    const karat: GoldKarat = item.karat === 22 || item.karat === 21 || item.karat === 18 ? item.karat : 24;
    const pricePerGram = goldPricesByKarat[karat];
    const estimatedValue = weightGrams * pricePerGram;
    const pure24kGrams = weightGrams * (karat / 24);

    goldTotalRawGrams += weightGrams;
    goldPure24kGrams += pure24kGrams;
    goldEstimatedValue += estimatedValue;

    return {
      ...item,
      karat,
      weightGrams,
      pricePerGram,
      estimatedValue,
      pure24kGrams,
    };
  });

  const goldMeetsNisab = goldPure24kGrams >= GOLD_NISAB_GRAMS;
  const goldZakat = goldMeetsNisab ? goldEstimatedValue * ZAKAT_RATE : 0;

  // 3. Silver Zakat (Nisab = 595g)
  const silverWeightGrams = pos(input.silverWeightGrams);
  const silverEstimatedValue = silverWeightGrams * silverPrice;
  const silverMeetsNisab = silverWeightGrams >= SILVER_NISAB_GRAMS;
  const silverZakat = silverMeetsNisab ? silverEstimatedValue * ZAKAT_RATE : 0;

  const totalZakatDue = moneyZakat + goldZakat + silverZakat;

  return {
    goldPricesByKarat,
    goldNisabValue,
    silverNisabValue,
    moneyAmount,
    moneyMeetsNisab,
    moneyZakat,
    goldTotalRawGrams,
    goldPure24kGrams,
    goldEstimatedValue,
    goldMeetsNisab,
    goldZakat,
    goldBreakdown,
    silverWeightGrams,
    silverEstimatedValue,
    silverMeetsNisab,
    silverZakat,
    totalZakatDue,
  };
}
