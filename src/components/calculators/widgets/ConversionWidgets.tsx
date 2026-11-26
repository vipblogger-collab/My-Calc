import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Globe, RefreshCw } from 'lucide-react';
import {
  UNIT_SPECS,
  convertLinearUnit,
  convertTemperature,
  convertFuelEconomy,
  convertCurrencyAmount,
  TempUnit,
  FuelUnit,
} from '../../../lib/calculators/conversion.ts';
import {
  ACTIVE_WORLD_CURRENCY_CODES,
  CurrencyOptionItem,
  POPULAR_CURRENCIES_AR,
  POPULAR_CURRENCIES_EN,
  buildCurrencyCatalog,
  fetchLiveGlobalRatesDirect,
  formatConvertedCurrency,
  formatFxSpotRate,
  safeFetchJson,
} from '../../../lib/calculators/currencies.ts';
import {
  CalcSplitLayout,
  ErrorAlert,
  NumberInput,
  ResultHero,
  SearchableCurrencySelect,
  SelectInput,
  StatTile,
  fmtNum,
} from './FormPrimitives.tsx';
import { ResultActions } from '../ResultActions.tsx';
import { useAppContext } from '../../../context/AppContext.tsx';

const FX_CLIENT_CACHE_KEY = 'mysmartcalc_fx_rates_v1';
const FX_CLIENT_CACHE_TTL_MS = 15 * 60 * 1000;

interface CachedClientRates {
  rates: Record<string, number>;
  lastUpdatedUtc: string;
  provider: string;
  fetchedAtMs: number;
}

function readClientRatesCache(): CachedClientRates | null {
  try {
    const raw = window.localStorage.getItem(FX_CLIENT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedClientRates>;
    if (
      parsed &&
      parsed.rates &&
      typeof parsed.rates === 'object' &&
      Object.keys(parsed.rates).length > 50 &&
      typeof parsed.fetchedAtMs === 'number'
    ) {
      return {
        rates: parsed.rates,
        lastUpdatedUtc: parsed.lastUpdatedUtc || '',
        provider: parsed.provider || 'Live Global FX Feed',
        fetchedAtMs: parsed.fetchedAtMs,
      };
    }
  } catch {
    // Ignore storage/parse errors
  }
  return null;
}

function writeClientRatesCache(payload: CachedClientRates): void {
  try {
    window.localStorage.setItem(FX_CLIENT_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

function CurrencyConverterWidget() {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const [amount, setAmount] = useState('1000');
  const [fromCur, setFromCur] = useState('USD');
  const [toCur, setToCur] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    const cached = readClientRatesCache();
    if (!forceRefresh && cached && Date.now() - cached.fetchedAtMs < FX_CLIENT_CACHE_TTL_MS) {
      setRates(cached.rates);
      setLastUpdated(cached.lastUpdatedUtc);
      setProvider(cached.provider);
      setLoading(false);
      return;
    }

    try {
      let resolved: CachedClientRates | null = null;

      // 1. Try local backend proxy first (safe JSON parse handles 404/HTML/text responses cleanly)
      try {
        const endpoint = forceRefresh ? '/api/exchange-rates?refresh=1' : '/api/exchange-rates';
        const data = await safeFetchJson<{
          rates?: Record<string, number>;
          lastUpdatedUtc?: string;
          provider?: string;
        }>(endpoint, 5000);
        if (data?.rates && Object.keys(data.rates).length > 50) {
          resolved = {
            rates: data.rates,
            lastUpdatedUtc: data.lastUpdatedUtc || '',
            provider: data.provider || 'Live Global FX Feed',
            fetchedAtMs: Date.now(),
          };
        }
      } catch {
        resolved = null;
      }

      // 2. Fallback to direct CORS-enabled global FX feeds if /api/exchange-rates is unavailable
      if (!resolved) {
        const direct = await fetchLiveGlobalRatesDirect(FX_CLIENT_CACHE_TTL_MS);
        resolved = {
          rates: direct.rates,
          lastUpdatedUtc: direct.lastUpdatedUtc,
          provider: direct.provider,
          fetchedAtMs: direct.fetchedAtMs,
        };
      }

      setRates(resolved.rates);
      setLastUpdated(resolved.lastUpdatedUtc);
      setProvider(resolved.provider);
      writeClientRatesCache(resolved);
    } catch {
      if (cached) {
        setRates(cached.rates);
        setLastUpdated(cached.lastUpdatedUtc);
        setProvider(isAr ? `${cached.provider} (نسخة محفوظة)` : `${cached.provider} (cached)`);
      } else {
        setError(
          isAr
            ? 'تعذر جلب أسعار الصرف العالمية المباشرة حالياً. يرجى المحاولة مرة أخرى.'
            : 'Unable to fetch live exchange rates at the moment. Please try again shortly.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(false);
  }, []);

  const availableCodes = useMemo(() => {
    if (!rates) return Array.from(ACTIVE_WORLD_CURRENCY_CODES);
    return Object.keys(rates);
  }, [rates]);

  const currencyCatalog = useMemo(
    () => buildCurrencyCatalog(availableCodes, lang),
    [availableCodes, lang]
  );

  const currencyNameMap = useMemo(() => {
    const map = new Map<string, CurrencyOptionItem>();
    for (const item of currencyCatalog) {
      map.set(item.code, item);
    }
    return map;
  }, [currencyCatalog]);

  const numericAmt = parseFloat(amount);
  const validAmt = Number.isFinite(numericAmt) && numericAmt >= 0;

  const conversion = useMemo(() => {
    if (!rates || !validAmt) return null;
    try {
      return convertCurrencyAmount(numericAmt, fromCur, toCur, rates);
    } catch {
      return null;
    }
  }, [rates, validAmt, numericAmt, fromCur, toCur]);

  const swap = () => {
    setFromCur(toCur);
    setToCur(fromCur);
  };

  const quickTargets = useMemo(() => {
    const baseList = isAr ? POPULAR_CURRENCIES_AR : POPULAR_CURRENCIES_EN;
    return baseList
      .filter((c) => c !== fromCur && (!rates || Boolean(rates[c])))
      .slice(0, 9);
  }, [isAr, fromCur, rates]);

  const fromMeta = currencyNameMap.get(fromCur);
  const toMeta = currencyNameMap.get(toCur);

  return (
    <CalcSplitLayout
      inputs={
        <>
          <NumberInput
            label="Amount"
            value={amount}
            onChange={setAmount}
            min={0}
            placeholder="1000"
          />
          <div className="space-y-3">
            <SearchableCurrencySelect
              id="currency-from-select"
              label="From Currency"
              value={fromCur}
              onChange={setFromCur}
              catalog={currencyCatalog}
              isAr={isAr}
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={swap}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-xs font-medium text-[#475569] transition-colors"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{isAr ? 'تبديل العملات' : 'Swap Currencies'}</span>
              </button>
            </div>
            <SearchableCurrencySelect
              id="currency-to-select"
              label="To Currency"
              value={toCur}
              onChange={setToCur}
              catalog={currencyCatalog}
              isAr={isAr}
            />
          </div>
          <div className="pt-2 space-y-1.5 text-xs text-[#64748B]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#0F172A]">
                <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
                {isAr
                  ? `${currencyCatalog.length} عملة عالمية متاحة`
                  : `${currencyCatalog.length} World Currencies Supported`}
              </span>
              <button
                type="button"
                onClick={() => fetchRates(true)}
                disabled={loading}
                className="inline-flex items-center gap-1 text-[#2563EB] hover:underline disabled:opacity-50 font-medium"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>{isAr ? 'تحديث السعر' : 'Refresh'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#64748B]">
              {provider
                ? isAr
                  ? `المصدر العالمي: ${provider}`
                  : `Global source: ${provider}`
                : isAr
                ? 'جارٍ جلب أسعار الصرف العالمية المباشرة...'
                : 'Fetching live global market rates...'}
            </p>
          </div>
        </>
      }
      results={
        <>
          {error && <ErrorAlert message={error} />}
          {loading && !rates && (
            <div className="animate-pulse space-y-3">
              <div className="h-24 rounded-xl bg-[#F1F5F9]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 rounded-lg bg-[#F1F5F9]" />
                <div className="h-16 rounded-lg bg-[#F1F5F9]" />
              </div>
            </div>
          )}
          {conversion && (
            <>
              <ResultHero
                label={
                  isAr
                    ? `${fmtNum(numericAmt, 2)} ${fromMeta?.name || fromCur} (${fromCur}) يساوي`
                    : `${fmtNum(numericAmt, 2)} ${fromMeta?.name || fromCur} (${fromCur}) equals`
                }
                value={`${formatConvertedCurrency(conversion.converted, toCur)} ${toCur}`}
                subtext={
                  lastUpdated
                    ? `${toMeta?.name || toCur} · ${isAr ? 'آخر تحديث عالمي:' : 'Last global update:'} ${lastUpdated}`
                    : toMeta?.name
                }
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatTile
                  label={`1 ${fromCur} to ${toCur}`}
                  value={`${formatFxSpotRate(conversion.directRate)} ${toCur}`}
                />
                <StatTile
                  label={`1 ${toCur} to ${fromCur}`}
                  value={`${formatFxSpotRate(conversion.inverseRate)} ${fromCur}`}
                />
              </div>

              {rates && validAmt && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-[#64748B] mb-2">
                    {isAr
                      ? `المكافئ الفوري لـ ${fmtNum(numericAmt, 2)} ${fromCur} (انقر للاختيار)`
                      : `Quick Global Equivalents for ${fmtNum(numericAmt, 2)} ${fromCur} (click to select)`}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {quickTargets.map((code) => {
                      const res = convertCurrencyAmount(numericAmt, fromCur, code, rates);
                      const isSelected = code === toCur;
                      const meta = currencyNameMap.get(code);
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setToCur(code)}
                          title={meta?.name || code}
                          className={`rounded-lg border px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                            isSelected
                              ? 'border-[#2563EB] bg-[#EFF6FF]'
                              : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <span className="font-semibold text-[#475569]">{code}</span>
                          <span className="font-mono-tabular text-[#0F172A]" dir="ltr">
                            {formatConvertedCurrency(res.converted, code)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <ResultActions
                copyText={`${numericAmt} ${fromCur} = ${formatConvertedCurrency(conversion.converted, toCur)} ${toCur} (1 ${fromCur} = ${formatFxSpotRate(conversion.directRate)} ${toCur}, updated ${lastUpdated})`}
                onReset={() => {
                  setAmount('1000');
                  setFromCur('USD');
                  setToCur('EUR');
                }}
              />
            </>
          )}
        </>
      }
    />
  );
}

function TemperatureWidget() {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const [val, setVal] = useState('37');
  const [from, setFrom] = useState<TempUnit>('C');
  const [to, setTo] = useState<TempUnit>('F');

  const options: { value: TempUnit; label: string }[] = [
    { value: 'C', label: 'Celsius (°C)' },
    { value: 'F', label: 'Fahrenheit (°F)' },
    { value: 'K', label: 'Kelvin (K)' },
    { value: 'R', label: 'Rankine (°R)' },
  ];

  const num = parseFloat(val);
  const valid = Number.isFinite(num);
  const converted = valid ? convertTemperature(num, from, to) : NaN;

  return (
    <CalcSplitLayout
      inputs={
        <>
          <NumberInput label="Temperature Value" value={val} onChange={setVal} />
          <SelectInput
            label="From Scale"
            value={from}
            onChange={(v) => setFrom(v as TempUnit)}
            options={options}
          />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-xs font-medium text-[#475569]"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isAr ? 'تبديل المقاييس' : 'Swap Scales'}</span>
            </button>
          </div>
          <SelectInput
            label="To Scale"
            value={to}
            onChange={(v) => setTo(v as TempUnit)}
            options={options}
          />
        </>
      }
      results={
        valid ? (
          <>
            <ResultHero
              label={`${num} °${from} equals`}
              value={`${fmtNum(converted, 4)} ${to === 'K' ? 'K' : `°${to}`}`}
            />
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt) => (
                <StatTile
                  key={opt.value}
                  label={opt.label}
                  value={`${fmtNum(convertTemperature(num, from, opt.value), 3)} ${
                    opt.value === 'K' ? 'K' : `°${opt.value}`
                  }`}
                />
              ))}
            </div>
            <ResultActions
              copyText={`${num} ${from} = ${fmtNum(converted, 4)} ${to}`}
              onReset={() => {
                setVal('37');
                setFrom('C');
                setTo('F');
              }}
            />
          </>
        ) : (
          <ErrorAlert message="Please enter a valid numeric temperature." />
        )
      }
    />
  );
}

function FuelEconomyWidget() {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const [val, setVal] = useState('32');
  const [from, setFrom] = useState<FuelUnit>('mpg_us');
  const [to, setTo] = useState<FuelUnit>('l100km');

  const options: { value: FuelUnit; label: string }[] = [
    { value: 'mpg_us', label: 'Miles per Gallon (US MPG)' },
    { value: 'mpg_uk', label: 'Miles per Gallon (Imperial UK)' },
    { value: 'kml', label: 'Kilometers per Liter (km/L)' },
    { value: 'l100km', label: 'Liters per 100 km (L/100km)' },
  ];

  const num = parseFloat(val);
  const valid = Number.isFinite(num) && num > 0;
  const converted = valid ? convertFuelEconomy(num, from, to) : 0;

  return (
    <CalcSplitLayout
      inputs={
        <>
          <NumberInput label="Fuel Economy Value" value={val} onChange={setVal} min={0.01} />
          <SelectInput
            label="From Unit"
            value={from}
            onChange={(v) => setFrom(v as FuelUnit)}
            options={options}
          />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-xs font-medium text-[#475569]"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isAr ? 'تبديل الوحدات' : 'Swap Units'}</span>
            </button>
          </div>
          <SelectInput
            label="To Unit"
            value={to}
            onChange={(v) => setTo(v as FuelUnit)}
            options={options}
          />
        </>
      }
      results={
        valid ? (
          <>
            <ResultHero
              label="Converted Fuel Economy"
              value={`${fmtNum(converted, 3)} ${options.find((o) => o.value === to)?.label.split('(')[1]?.replace(')', '') || ''}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt) => (
                <StatTile
                  key={opt.value}
                  label={opt.label}
                  value={fmtNum(convertFuelEconomy(num, from, opt.value), 3)}
                />
              ))}
            </div>
            <ResultActions
              copyText={`${num} ${from} = ${fmtNum(converted, 3)} ${to}`}
              onReset={() => {
                setVal('32');
                setFrom('mpg_us');
                setTo('l100km');
              }}
            />
          </>
        ) : (
          <ErrorAlert message="Enter a positive value greater than zero." />
        )
      }
    />
  );
}

const DEFAULT_PAIRS: Record<string, [string, string, string]> = {
  'length-converter': ['10', 'mi', 'km'],
  'weight-converter': ['150', 'lb', 'kg'],
  'volume-converter': ['2', 'gal_us', 'l'],
  'area-converter': ['2000', 'ft2', 'm2'],
  'speed-converter': ['65', 'mph', 'kmh'],
  'time-converter': ['48', 'hr', 'day'],
  'data-storage-converter': ['1', 'TB', 'GiB'],
  'energy-converter': ['500', 'kcal', 'kJ'],
  'pressure-converter': ['35', 'psi', 'bar'],
  'power-converter': ['150', 'kW', 'hp_mech'],
  'angle-converter': ['180', 'deg', 'rad'],
  'cooking-measurement-converter': ['2', 'cup_us', 'ml'],
};

function LinearUnitWidget({ slug }: { slug: string }) {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const spec = UNIT_SPECS[slug];
  const defaults = DEFAULT_PAIRS[slug] || ['1', spec.units[0].id, spec.units[1]?.id || spec.units[0].id];

  const [val, setVal] = useState(defaults[0]);
  const [fromUnit, setFromUnit] = useState(defaults[1]);
  const [toUnit, setToUnit] = useState(defaults[2]);

  useEffect(() => {
    const d = DEFAULT_PAIRS[slug] || ['1', spec.units[0].id, spec.units[1]?.id || spec.units[0].id];
    setVal(d[0]);
    setFromUnit(d[1]);
    setToUnit(d[2]);
  }, [slug, spec]);

  const num = parseFloat(val);
  const valid = Number.isFinite(num);
  const converted = valid ? convertLinearUnit(slug, num, fromUnit, toUnit) : NaN;
  const fromDef = spec.units.find((u) => u.id === fromUnit) || spec.units[0];
  const toDef = spec.units.find((u) => u.id === toUnit) || spec.units[0];

  const options = spec.units.map((u) => ({
    value: u.id,
    label: `${u.label} (${u.symbol})`,
  }));

  return (
    <CalcSplitLayout
      inputs={
        <>
          <NumberInput label="Value to Convert" value={val} onChange={setVal} />
          <SelectInput label="From Unit" value={fromUnit} onChange={setFromUnit} options={options} />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setFromUnit(toUnit);
                setToUnit(fromUnit);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-xs font-medium text-[#475569] transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isAr ? 'تبديل الوحدات' : 'Swap Units'}</span>
            </button>
          </div>
          <SelectInput label="To Unit" value={toUnit} onChange={setToUnit} options={options} />
        </>
      }
      results={
        valid ? (
          <>
            <ResultHero
              label={`${fmtNum(num, 6)} ${fromDef.label} equals`}
              value={`${fmtNum(converted, 6)} ${toDef.symbol}`}
              subtext={`1 ${fromDef.symbol} = ${fmtNum(
                convertLinearUnit(slug, 1, fromUnit, toUnit),
                8
              )} ${toDef.symbol}`}
            />

            <div>
              <h4 className="text-xs font-semibold text-[#64748B] mb-2">
                {isAr ? 'جميع الوحدات المكافئة' : 'All Equivalent Units'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pe-1">
                {spec.units.map((u) => (
                  <div
                    key={u.id}
                    className={`rounded-lg border px-3 py-2 flex items-center justify-between text-xs ${
                      u.id === toUnit
                        ? 'border-[#2563EB] bg-[#EFF6FF]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="text-[#475569] truncate me-2">{u.label}</span>
                    <span className="font-mono-tabular font-semibold text-[#0F172A] shrink-0" dir="ltr">
                      {fmtNum(convertLinearUnit(slug, num, fromUnit, u.id), 6)} {u.symbol}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ResultActions
              copyText={`${num} ${fromDef.symbol} = ${fmtNum(converted, 6)} ${toDef.symbol}`}
              onReset={() => {
                setVal(defaults[0]);
                setFromUnit(defaults[1]);
                setToUnit(defaults[2]);
              }}
            />
          </>
        ) : (
          <ErrorAlert message="Please enter a valid number to convert." />
        )
      }
    />
  );
}

export function ConversionWidget({ slug }: { slug: string }) {
  if (slug === 'currency-converter') return <CurrencyConverterWidget />;
  if (slug === 'temperature-converter') return <TemperatureWidget />;
  if (slug === 'fuel-economy-converter') return <FuelEconomyWidget />;
  if (UNIT_SPECS[slug]) return <LinearUnitWidget slug={slug} />;
  return <ErrorAlert message="Converter widget not found." />;
}
