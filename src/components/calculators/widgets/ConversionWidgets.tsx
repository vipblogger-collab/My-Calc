import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
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
  CalcSplitLayout,
  ErrorAlert,
  NumberInput,
  ResultHero,
  SelectInput,
  StatTile,
  fmtNum,
} from './FormPrimitives.tsx';
import { ResultActions } from '../ResultActions.tsx';
import { useAppContext } from '../../../context/AppContext.tsx';

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD – US Dollar ($)' },
  { value: 'EUR', label: 'EUR – Euro (€)' },
  { value: 'GBP', label: 'GBP – British Pound (£)' },
  { value: 'JPY', label: 'JPY – Japanese Yen (¥)' },
  { value: 'CAD', label: 'CAD – Canadian Dollar (C$)' },
  { value: 'AUD', label: 'AUD – Australian Dollar (A$)' },
  { value: 'CHF', label: 'CHF – Swiss Franc' },
  { value: 'CNY', label: 'CNY – Chinese Yuan (¥)' },
  { value: 'INR', label: 'INR – Indian Rupee (₹)' },
  { value: 'MXN', label: 'MXN – Mexican Peso' },
  { value: 'BRL', label: 'BRL – Brazilian Real (R$)' },
  { value: 'SGD', label: 'SGD – Singapore Dollar' },
  { value: 'HKD', label: 'HKD – Hong Kong Dollar' },
  { value: 'NZD', label: 'NZD – New Zealand Dollar' },
  { value: 'KRW', label: 'KRW – South Korean Won (₩)' },
  { value: 'SEK', label: 'SEK – Swedish Krona' },
  { value: 'NOK', label: 'NOK – Norwegian Krone' },
  { value: 'DKK', label: 'DKK – Danish Krone' },
  { value: 'PLN', label: 'PLN – Polish Zloty' },
  { value: 'TRY', label: 'TRY – Turkish Lira' },
  { value: 'ZAR', label: 'ZAR – South African Rand' },
  { value: 'AED', label: 'AED – UAE Dirham' },
  { value: 'SAR', label: 'SAR – Saudi Riyal' },
  { value: 'THB', label: 'THB – Thai Baht' },
  { value: 'IDR', label: 'IDR – Indonesian Rupiah' },
  { value: 'MYR', label: 'MYR – Malaysian Ringgit' },
  { value: 'PHP', label: 'PHP – Philippine Peso' },
  { value: 'VND', label: 'VND – Vietnamese Dong' },
  { value: 'ILS', label: 'ILS – Israeli Shekel' },
  { value: 'CZK', label: 'CZK – Czech Koruna' },
];

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

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/exchange-rates');
      const data = await res.json();
      if (!res.ok || !data.rates) {
        throw new Error(data.error || 'Exchange rate service unavailable.');
      }
      setRates(data.rates);
      setLastUpdated(data.lastUpdatedUtc || '');
      setProvider(data.provider || 'Live FX Feed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load live exchange rates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

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

  const quickTargets = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR', 'CHF'].filter(
    (c) => c !== fromCur
  );

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
            <SelectInput
              label="From Currency"
              value={fromCur}
              onChange={setFromCur}
              options={CURRENCY_OPTIONS}
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
            <SelectInput
              label="To Currency"
              value={toCur}
              onChange={setToCur}
              options={CURRENCY_OPTIONS}
            />
          </div>
          <div className="pt-2 flex items-center justify-between text-xs text-[#64748B]">
            <span>
              {provider
                ? isAr
                  ? `المصدر: ${provider}`
                  : `Source: ${provider}`
                : isAr
                ? 'جارٍ جلب أسعار الصرف المباشرة...'
                : 'Fetching live market rates...'}
            </span>
            <button
              type="button"
              onClick={fetchRates}
              disabled={loading}
              className="inline-flex items-center gap-1 text-[#2563EB] hover:underline disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'تحديث' : 'Refresh'}</span>
            </button>
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
                label={`${fmtNum(numericAmt, 2)} ${fromCur} equals`}
                value={`${fmtNum(conversion.converted, 2)} ${toCur}`}
                subtext={lastUpdated ? `${isAr ? 'آخر تحديث:' : 'Last updated:'} ${lastUpdated}` : undefined}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatTile
                  label={`1 ${fromCur} to ${toCur}`}
                  value={`${conversion.directRate.toFixed(6)} ${toCur}`}
                />
                <StatTile
                  label={`1 ${toCur} to ${fromCur}`}
                  value={`${conversion.inverseRate.toFixed(6)} ${fromCur}`}
                />
              </div>

              {rates && validAmt && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-[#64748B] mb-2">
                    {isAr
                      ? `المكافئ بالعملات الرئيسية لـ ${fmtNum(numericAmt, 2)} ${fromCur}`
                      : `Major Currency Equivalents for ${fmtNum(numericAmt, 2)} ${fromCur}`}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {quickTargets.slice(0, 6).map((code) => {
                      const res = convertCurrencyAmount(numericAmt, fromCur, code, rates);
                      return (
                        <div
                          key={code}
                          className="rounded-lg border border-[#E2E8F0] px-3 py-2 flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-[#475569]">{code}</span>
                          <span className="font-mono-tabular text-[#0F172A]">
                            {fmtNum(res.converted, 2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <ResultActions
                copyText={`${numericAmt} ${fromCur} = ${conversion.converted.toFixed(2)} ${toCur} (1 ${fromCur} = ${conversion.directRate.toFixed(6)} ${toCur}, updated ${lastUpdated})`}
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
