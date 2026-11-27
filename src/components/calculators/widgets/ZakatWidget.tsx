import { useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  Calendar,
  Coins,
  Gem,
  Info,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  type GoldKarat,
  calculateZakat,
} from '../../../lib/calculators/zakat.ts';
import {
  type LiveMetalPricesPayload,
  fetchLiveMetalPricesDirect,
  safeFetchJson,
} from '../../../lib/calculators/currencies.ts';
import {
  CurrencySelector,
  FieldLabel,
  NumberInput,
  fmtNum,
  useCurrencyFormat,
} from './FormPrimitives.tsx';
import { ResultActions } from '../ResultActions.tsx';

type ZakatTab = 'money' | 'gold' | 'silver';

interface GoldRowState {
  id: string;
  karat: GoldKarat;
  weight: string;
}

const METALS_CACHE_KEY = 'mysmartcalc_metals_v2';
const AUTO_REFRESH_SECONDS = 600; // 10 minutes live refresh

function sanitizeZakatNumberInput(raw: string): string {
  if (raw === '') return '';
  return raw.replace(/^0+(?=\d)/, '');
}

function clearCachedMetals(): void {
  try {
    window.localStorage.removeItem(METALS_CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
}

function readCachedMetals(): LiveMetalPricesPayload | null {
  try {
    const raw = window.localStorage.getItem(METALS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LiveMetalPricesPayload>;
    if (
      parsed &&
      typeof parsed.gold24kUsdPerGram === 'number' &&
      parsed.gold24kUsdPerGram > 0 &&
      typeof parsed.silverUsdPerGram === 'number' &&
      parsed.silverUsdPerGram > 0 &&
      parsed.rates &&
      typeof parsed.fetchedAtMs === 'number'
    ) {
      return parsed as LiveMetalPricesPayload;
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

function writeCachedMetals(payload: LiveMetalPricesPayload): void {
  try {
    window.localStorage.setItem(METALS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota errors
  }
}

function formatCountdown(sec: number): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export function ZakatWidget() {
  const { currencyCode, currencySymbol, fmtMoney, lang } = useCurrencyFormat();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<ZakatTab>('money');
  const [moneyAmount, setMoneyAmount] = useState('0');
  const [goldRows, setGoldRows] = useState<GoldRowState[]>([
    { id: 'gold-1', karat: 24, weight: '0' },
  ]);
  const [silverWeight, setSilverWeight] = useState('0');

  const [metalsPayload, setMetalsPayload] = useState<LiveMetalPricesPayload | null>(null);
  const [metalsLoading, setMetalsLoading] = useState(true);
  const [metalsError, setMetalsError] = useState(false);
  const [secondsToNextRefresh, setSecondsToNextRefresh] = useState(AUTO_REFRESH_SECONDS);

  const fetchMetalPrices = async (forceRefresh = false) => {
    setMetalsLoading(true);
    setMetalsError(false);

    if (forceRefresh) {
      clearCachedMetals();
    }

    const cached = forceRefresh ? null : readCachedMetals();
    if (!forceRefresh && cached && Date.now() - cached.fetchedAtMs < AUTO_REFRESH_SECONDS * 1000) {
      setMetalsPayload(cached);
      setMetalsLoading(false);
      setSecondsToNextRefresh(AUTO_REFRESH_SECONDS);
      return;
    }

    try {
      let resolved: LiveMetalPricesPayload | null = null;
      if (forceRefresh) {
        try {
          resolved = await fetchLiveMetalPricesDirect(true);
        } catch {
          resolved = null;
        }
        if (!resolved) {
          const data = await safeFetchJson<LiveMetalPricesPayload>(
            '/api/metal-prices?refresh=1',
            5000,
            true
          );
          if (data?.gold24kUsdPerGram > 0 && data?.silverUsdPerGram > 0 && data?.rates) {
            resolved = data;
          }
        }
      } else {
        try {
          const data = await safeFetchJson<LiveMetalPricesPayload>('/api/metal-prices', 5000);
          if (data?.gold24kUsdPerGram > 0 && data?.silverUsdPerGram > 0 && data?.rates) {
            resolved = data;
          }
        } catch {
          resolved = null;
        }
        if (!resolved) {
          resolved = await fetchLiveMetalPricesDirect(false);
        }
      }

      if (!resolved) {
        throw new Error('Unable to load live metal prices');
      }

      setMetalsPayload(resolved);
      writeCachedMetals(resolved);
      setSecondsToNextRefresh(AUTO_REFRESH_SECONDS);
    } catch {
      if (cached) {
        setMetalsPayload(cached);
      } else {
        setMetalsError(true);
      }
    } finally {
      setMetalsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetalPrices(false);
  }, []);

  // Countdown timer mirroring automatic live gold/silver refresh
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsToNextRefresh((prev) => {
        if (prev <= 1) {
          fetchMetalPrices(true);
          return AUTO_REFRESH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fxMultiplier = useMemo(() => {
    if (!metalsPayload?.rates) return currencyCode === 'USD' ? 1 : 0;
    return metalsPayload.rates[currencyCode] ?? (currencyCode === 'USD' ? 1 : 0);
  }, [metalsPayload, currencyCode]);

  const gold24kPrice = useMemo(() => {
    if (!metalsPayload || fxMultiplier <= 0) return 0;
    return metalsPayload.gold24kUsdPerGram * fxMultiplier;
  }, [metalsPayload, fxMultiplier]);

  const silverPrice = useMemo(() => {
    if (!metalsPayload || fxMultiplier <= 0) return 0;
    return metalsPayload.silverUsdPerGram * fxMultiplier;
  }, [metalsPayload, fxMultiplier]);

  const res = useMemo(
    () =>
      calculateZakat({
        moneyAmount: parseFloat(moneyAmount) || 0,
        goldItems: goldRows.map((row) => ({
          id: row.id,
          karat: row.karat,
          weightGrams: parseFloat(row.weight) || 0,
        })),
        silverWeightGrams: parseFloat(silverWeight) || 0,
        gold24kPricePerGram: gold24kPrice,
        silverPricePerGram: silverPrice,
        enforceMoneyNisab: false,
      }),
    [moneyAmount, goldRows, silverWeight, gold24kPrice, silverPrice]
  );

  const addGoldRow = () => {
    setGoldRows((prev) => [
      ...prev,
      { id: `gold-${Date.now()}-${prev.length + 1}`, karat: 21, weight: '0' },
    ]);
  };

  const removeGoldRow = (id: string) => {
    setGoldRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  };

  const updateGoldRow = (id: string, patch: Partial<GoldRowState>) => {
    setGoldRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const resetAll = () => {
    setMoneyAmount('0');
    setGoldRows([{ id: 'gold-1', karat: 24, weight: '0' }]);
    setSilverWeight('0');
  };

  const decimalsForCurrency = ['KWD', 'BHD', 'OMR', 'JOD', 'TND', 'LYD', 'IQD'].includes(currencyCode)
    ? 3
    : 2;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-6">
      {/* Header Banner + Currency Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1.5 text-xs font-semibold text-[#1D4ED8]">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isAr
                ? 'الحساب مبني على نسبة 2.5% للنصاب الشرعي'
                : 'Calculated at 2.5% based on the Sharia Nisab'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64748B]">
            {metalsLoading ? (
              <span>{isAr ? 'جاري تحديث أسعار الذهب والفضة العالمية...' : 'Updating live global gold & silver prices...'}</span>
            ) : metalsError ? (
              <span className="text-[#DC2626]">
                {isAr ? 'تعذر جلب السعر العالمي حالياً، حاول التحديث.' : 'Could not fetch live global spot rate right now.'}
              </span>
            ) : (
              <span>
                {(() => {
                  const cleanSpotDate = (metalsPayload?.lastUpdatedUtc || '')
                    .replace(/\s*\(Global Spot\)\s*/gi, '')
                    .trim();
                  const spotBadge = cleanSpotDate ? `${cleanSpotDate} (Global Spot)` : '(Global Spot)';
                  return isAr
                    ? `أسعار السوق العالمي المباشرة · ${spotBadge} · التحديث القادم خلال ${formatCountdown(secondsToNextRefresh)}`
                    : `Live global market spot · ${spotBadge} · Next update in ${formatCountdown(secondsToNextRefresh)}`;
                })()}
              </span>
            )}
            <button
              type="button"
              onClick={() => fetchMetalPrices(true)}
              disabled={metalsLoading}
              className="inline-flex items-center gap-1 font-semibold text-[#2563EB] hover:underline disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${metalsLoading ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'تحديث الآن' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        <div className="w-full md:w-72 shrink-0">
          <CurrencySelector id="zakat-currency-select" />
        </div>
      </div>

      {/* Live Gold & Silver Spot Strip */}
      {gold24kPrice > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {([24, 22, 21, 18] as GoldKarat[]).map((k) => (
            <div
              key={k}
              className="rounded-xl border border-[#E2E8F0] bg-[#FFFBEB]/60 px-3 py-2 text-center"
            >
              <div className="text-[11px] font-medium text-[#92400E]">
                {isAr ? `ذهب عيار ${k} / جم` : `${k}K Gold / g`}
              </div>
              <div className="font-mono-tabular text-xs font-bold text-[#0F172A] mt-0.5" dir="ltr">
                {fmtMoney(res.goldPricesByKarat[k], decimalsForCurrency)}
              </div>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-center">
            <div className="text-[11px] font-medium text-[#475569]">
              {isAr ? 'الفضة / جم' : 'Silver / g'}
            </div>
            <div className="font-mono-tabular text-xs font-bold text-[#0F172A] mt-0.5" dir="ltr">
              {fmtMoney(silverPrice, Math.max(3, decimalsForCurrency))}
            </div>
          </div>
        </div>
      )}

      {/* 3 Main Tabs matching insan.org.kw/zakatcalculation */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'money'}
          onClick={() => setActiveTab('money')}
          className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'money'
              ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] shadow-xs'
              : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:bg-white'
          }`}
        >
          <Banknote className="w-4 h-4 shrink-0" />
          <span>{isAr ? 'زكاة المال' : 'Cash Zakat'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'gold'}
          onClick={() => setActiveTab('gold')}
          className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'gold'
              ? 'border-[#D97706] bg-[#FFFBEB] text-[#B45309] shadow-xs'
              : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:bg-white'
          }`}
        >
          <Coins className="w-4 h-4 shrink-0" />
          <span>{isAr ? 'زكاة الذهب' : 'Gold Zakat'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'silver'}
          onClick={() => setActiveTab('silver')}
          className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'silver'
              ? 'border-[#475569] bg-[#F1F5F9] text-[#0F172A] shadow-xs'
              : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:bg-white'
          }`}
        >
          <Gem className="w-4 h-4 shrink-0" />
          <span>{isAr ? 'زكاة الفضة' : 'Silver Zakat'}</span>
        </button>
      </div>

      {/* Main 2-Column Content: Active Calculator Card + Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Calculator Panel */}
        <div className="lg:col-span-7">
          {activeTab === 'money' && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="bg-[#F8FAFC] px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2.5">
                <Banknote className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {isAr ? 'زكاة المال' : 'Cash / Money Zakat'}
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <NumberInput
                  label={
                    isAr
                      ? `إجمالي المال الذي حال عليه الحول (${currencyCode})`
                      : `Total Cash Held for One Full Hawl (${currencyCode})`
                  }
                  prefix={currencySymbol}
                  value={moneyAmount}
                  onChange={(v) => setMoneyAmount(sanitizeZakatNumberInput(v))}
                  onFocus={() => {
                    if (moneyAmount === '0') setMoneyAmount('');
                  }}
                  onBlur={() => {
                    if (moneyAmount === '') setMoneyAmount('0');
                  }}
                  min={0}
                  step="any"
                />

                <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] px-4 py-3 flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-[#166534]">
                    {isAr ? 'قيمة الزكاة المستحقة عن المال:' : 'Zakat Due on Cash:'}
                  </span>
                  <span className="font-mono-tabular text-base sm:text-lg font-extrabold text-[#15803D]" dir="ltr">
                    {fmtMoney(res.moneyZakat, decimalsForCurrency)}
                  </span>
                </div>

                {res.goldNisabValue > 0 && (
                  <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2.5 text-xs text-[#475569] flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>
                      {res.moneyAmount > 0 && !res.moneyMeetsNisab
                        ? isAr
                          ? `تنبيه شرعي: المبلغ المدخل أقل من نصاب الذهب (85 جم عيار 24 = ${fmtMoney(res.goldNisabValue, decimalsForCurrency)}) ما لم ينضم إليه ذهب أو فضة يكملان النصاب.`
                          : `Note: Amount is below the 85g 24K gold Nisab (${fmtMoney(res.goldNisabValue, decimalsForCurrency)}) unless combined with gold or silver.`
                        : isAr
                        ? `النصاب الشرعي للنقود (بقيمة 85 جرام ذهب عيار 24): ${fmtMoney(res.goldNisabValue, decimalsForCurrency)}`
                        : `Sharia Cash Nisab (85g 24K Gold): ${fmtMoney(res.goldNisabValue, decimalsForCurrency)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gold' && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="bg-[#FFFBEB]/70 px-5 py-3.5 border-b border-[#FDE68A] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Coins className="w-5 h-5 text-[#D97706]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {isAr ? 'زكاة الذهب' : 'Gold Zakat'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addGoldRow}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة عيار جديد' : 'Add Gold Karat'}</span>
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  {goldRows.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-12 gap-2.5 items-end rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3"
                    >
                      <div className="col-span-6 sm:col-span-6">
                        <NumberInput
                          label={isAr ? 'وزن الذهب بالجرام' : 'Gold Weight (g)'}
                          suffix={isAr ? 'جم' : 'g'}
                          value={row.weight}
                          onChange={(v) => updateGoldRow(row.id, { weight: sanitizeZakatNumberInput(v) })}
                          onFocus={() => {
                            if (row.weight === '0') updateGoldRow(row.id, { weight: '' });
                          }}
                          onBlur={() => {
                            if (row.weight === '') updateGoldRow(row.id, { weight: '0' });
                          }}
                          min={0}
                          step="0.001"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-5">
                        <FieldLabel label={isAr ? 'عيار الذهب' : 'Gold Karat'} />
                        <select
                          value={row.karat}
                          onChange={(e) =>
                            updateGoldRow(row.id, { karat: Number(e.target.value) as GoldKarat })
                          }
                          className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                        >
                          <option value={24}>{isAr ? '24 قيراط' : '24 Karat'}</option>
                          <option value={22}>{isAr ? '22 قيراط' : '22 Karat'}</option>
                          <option value={21}>{isAr ? '21 قيراط' : '21 Karat'}</option>
                          <option value={18}>{isAr ? '18 قيراط' : '18 Karat'}</option>
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex justify-end pb-1">
                        <button
                          type="button"
                          onClick={() => removeGoldRow(row.id)}
                          disabled={goldRows.length <= 1}
                          aria-label={isAr ? 'حذف العيار' : 'Delete karat row'}
                          className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#DC2626] hover:border-[#FECACA] disabled:opacity-35 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {res.goldTotalRawGrams > 0 && (
                  <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] px-4 py-3 space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-[#92400E]">
                        {isAr ? 'قيمة الذهب التقديرية:' : 'Estimated Gold Value:'}
                      </span>
                      <span className="font-mono-tabular font-bold text-[#78350F]" dir="ltr">
                        {fmtMoney(res.goldEstimatedValue, decimalsForCurrency)}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#B45309]">
                      {isAr
                        ? `الصافي المكافئ لعيار 24: ${fmtNum(res.goldPure24kGrams, 2)} جم (سعر عيار 24: ${fmtMoney(gold24kPrice, decimalsForCurrency)}/جم)`
                        : `Pure 24K equivalent: ${fmtNum(res.goldPure24kGrams, 2)} g (24K spot: ${fmtMoney(gold24kPrice, decimalsForCurrency)}/g)`}
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] px-4 py-3 flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-[#166534]">
                    {isAr ? 'قيمة الزكاة المستحقة عن الذهب:' : 'Zakat Due on Gold:'}
                  </span>
                  <span className="font-mono-tabular text-base sm:text-lg font-extrabold text-[#15803D]" dir="ltr">
                    {fmtMoney(res.goldZakat, decimalsForCurrency)}
                  </span>
                </div>

                {res.goldTotalRawGrams > 0 && !res.goldMeetsNisab && (
                  <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] px-3.5 py-2.5 text-xs text-[#991B1B] flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>
                      {isAr
                        ? `الوزن الصافي (${fmtNum(res.goldPure24kGrams, 2)} جم عيار 24) أقل من النصاب الشرعي (${GOLD_NISAB_GRAMS} جرام)`
                        : `Pure 24K weight (${fmtNum(res.goldPure24kGrams, 2)}g) is below Sharia Nisab (${GOLD_NISAB_GRAMS}g)`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'silver' && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="bg-[#F8FAFC] px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2.5">
                <Gem className="w-5 h-5 text-[#475569]" />
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {isAr ? 'زكاة الفضة' : 'Silver Zakat'}
                </h3>
              </div>

              <div className="p-5 space-y-4">
                <NumberInput
                  label={isAr ? 'وزن الفضة بالجرام' : 'Silver Weight (grams)'}
                  suffix={isAr ? 'جم' : 'g'}
                  value={silverWeight}
                  onChange={(v) => setSilverWeight(sanitizeZakatNumberInput(v))}
                  onFocus={() => {
                    if (silverWeight === '0') setSilverWeight('');
                  }}
                  onBlur={() => {
                    if (silverWeight === '') setSilverWeight('0');
                  }}
                  min={0}
                  step="0.001"
                />

                {res.silverWeightGrams > 0 && (
                  <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 flex items-center justify-between text-xs">
                    <span className="text-[#475569] font-medium">
                      {isAr ? 'قيمة الفضة التقديرية:' : 'Estimated Silver Value:'}
                    </span>
                    <span className="font-mono-tabular font-bold text-[#0F172A]" dir="ltr">
                      {fmtMoney(res.silverEstimatedValue, decimalsForCurrency)}
                    </span>
                  </div>
                )}

                <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] px-4 py-3 flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-[#166534]">
                    {isAr ? 'قيمة الزكاة المستحقة عن الفضة:' : 'Zakat Due on Silver:'}
                  </span>
                  <span className="font-mono-tabular text-base sm:text-lg font-extrabold text-[#15803D]" dir="ltr">
                    {fmtMoney(res.silverZakat, decimalsForCurrency)}
                  </span>
                </div>

                {res.silverWeightGrams > 0 && !res.silverMeetsNisab && (
                  <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] px-3.5 py-2.5 text-xs text-[#991B1B] flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>
                      {isAr
                        ? `الوزن أقل من النصاب الشرعي (${SILVER_NISAB_GRAMS} جرام)`
                        : `Weight is below Sharia Nisab (${SILVER_NISAB_GRAMS} grams)`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right / Summary Panel matching insan.org.kw/zakatcalculation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#CBD5E1] bg-white overflow-hidden shadow-xs">
            <div className="bg-[#0F172A] text-white px-5 py-3.5 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#93C5FD]" />
              <h3 className="text-sm font-bold">
                {isAr ? 'ملخص الزكاة' : 'Zakat Summary'}
              </h3>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm py-2 border-b border-[#F1F5F9]">
                <span className="text-[#475569]">{isAr ? 'زكاة المال' : 'Cash Zakat'}</span>
                <span className="font-mono-tabular font-bold text-[#0F172A]" dir="ltr">
                  {fmtMoney(res.moneyZakat, decimalsForCurrency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm py-2 border-b border-[#F1F5F9]">
                <span className="text-[#475569]">{isAr ? 'زكاة الذهب' : 'Gold Zakat'}</span>
                <span className="font-mono-tabular font-bold text-[#0F172A]" dir="ltr">
                  {fmtMoney(res.goldZakat, decimalsForCurrency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm py-2 border-b border-[#F1F5F9]">
                <span className="text-[#475569]">{isAr ? 'زكاة الفضة' : 'Silver Zakat'}</span>
                <span className="font-mono-tabular font-bold text-[#0F172A]" dir="ltr">
                  {fmtMoney(res.silverZakat, decimalsForCurrency)}
                </span>
              </div>

              <div className="rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-3.5 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#1E3A8A]">
                  {isAr ? 'الإجمالي المستحق' : 'Total Zakat Due'}
                </span>
                <span className="font-mono-tabular text-xl font-extrabold text-[#1D4ED8]" dir="ltr">
                  {fmtMoney(res.totalZakatDue, decimalsForCurrency)}
                </span>
              </div>
            </div>
          </div>

          <ResultActions
            copyText={
              isAr
                ? `ملخص الزكاة (${currencyCode}): زكاة المال ${fmtMoney(res.moneyZakat, decimalsForCurrency)} | زكاة الذهب ${fmtMoney(res.goldZakat, decimalsForCurrency)} | زكاة الفضة ${fmtMoney(res.silverZakat, decimalsForCurrency)} | الإجمالي المستحق ${fmtMoney(res.totalZakatDue, decimalsForCurrency)}`
                : `Zakat Summary (${currencyCode}): Cash ${fmtMoney(res.moneyZakat, decimalsForCurrency)} | Gold ${fmtMoney(res.goldZakat, decimalsForCurrency)} | Silver ${fmtMoney(res.silverZakat, decimalsForCurrency)} | Total Due ${fmtMoney(res.totalZakatDue, decimalsForCurrency)}`
            }
            onReset={resetAll}
          />
        </div>
      </div>
    </div>
  );
}
