import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Check, ChevronDown, Search } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext.tsx';
import { translateWidgetLabel } from '../../../i18n/translations.ts';
import {
  ACTIVE_WORLD_CURRENCY_CODES,
  CurrencyOptionItem,
  buildCurrencyCatalog,
  formatCompactMoneyAxis,
  formatMoney,
  getCurrencySymbol,
} from '../../../lib/calculators/currencies.ts';

export function fmtCurrency(val: number, decimals?: number, currencyCode = 'USD'): string {
  return formatMoney(val, currencyCode, decimals);
}

export function useCurrencyFormat() {
  const { currencyCode, setCurrencyCode, lang } = useAppContext();
  const currencySymbol = useMemo(() => getCurrencySymbol(currencyCode), [currencyCode]);
  const fmtMoney = (val: number, decimals?: number) => formatMoney(val, currencyCode, decimals);
  const fmtCompactAxis = (val: number) => formatCompactMoneyAxis(val, currencyCode);
  return {
    currencyCode,
    setCurrencyCode,
    currencySymbol,
    fmtMoney,
    fmtCompactAxis,
    lang,
  };
}

export function fmtNum(val: number, maxDecimals = 4): string {
  if (!Number.isFinite(val)) return '—';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
  }).format(val);
}

export function FieldLabel({
  htmlFor,
  label,
  hint,
}: {
  htmlFor?: string;
  label: string;
  hint?: string;
}) {
  const { lang } = useAppContext();
  const displayLabel = translateWidgetLabel(label, lang);
  const displayHint = hint ? translateWidgetLabel(hint, lang) : undefined;
  return (
    <div className="flex items-baseline justify-between gap-2 mb-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[#1E293B]">
        {displayLabel}
      </label>
      {displayHint && <span className="text-xs text-[#64748B]">{displayHint}</span>}
    </div>
  );
}

export function NumberInput({
  id,
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step = 'any',
  placeholder,
}: {
  id?: string;
  label: string;
  hint?: string;
  value: string | number;
  onChange: (val: string) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: string | number;
  placeholder?: string;
}) {
  const { lang } = useAppContext();
  const inputId = id || `field-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const displayPlaceholder = placeholder ? translateWidgetLabel(placeholder, lang) : undefined;
  return (
    <div>
      <FieldLabel htmlFor={inputId} label={label} hint={hint} />
      <div
        className="flex items-center h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 gap-2 focus-within:ring-2 focus-within:ring-[#2563EB]/25 focus-within:border-[#2563EB] transition-colors"
        dir="ltr"
      >
        {prefix && (
          <span className="text-xs font-semibold text-[#64748B] pointer-events-none select-none shrink-0">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={displayPlaceholder}
          className="w-full min-w-0 bg-transparent text-sm text-[#0F172A] tabular-nums focus:outline-none"
        />
        {suffix && (
          <span className="text-xs font-medium text-[#64748B] pointer-events-none select-none shrink-0">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function SearchableCurrencySelect({
  id,
  label,
  value,
  onChange,
  catalog,
  isAr,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  catalog: CurrencyOptionItem[];
  isAr: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => catalog.find((c) => c.code === value) || catalog[0],
    [catalog, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((c) => c.searchText.includes(q));
  }, [catalog, query]);

  const popularFiltered = useMemo(
    () => (query.trim() ? [] : filtered.filter((c) => c.isPopular)),
    [filtered, query]
  );

  const otherFiltered = useMemo(
    () => (query.trim() ? filtered : filtered.filter((c) => !c.isPopular)),
    [filtered, query]
  );

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 20);
    } else {
      setQuery('');
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <FieldLabel htmlFor={id} label={label} />
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm text-[#0F172A] flex items-center justify-between gap-2 hover:border-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span
            className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] font-mono-tabular text-xs font-bold shrink-0"
            dir="ltr"
          >
            {selected?.code || value}
          </span>
          <span className="truncate text-[#0F172A]">
            {selected ? selected.name : value}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute z-40 mt-1.5 w-full rounded-xl border border-[#CBD5E1] bg-white shadow-lg overflow-hidden"
        >
          <div className="p-2 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute start-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث بالرمز أو الاسم (مثل KWD، دينار، USD)...'
                    : 'Search code or currency (e.g. USD, EUR, KWD)...'
                }
                className="w-full h-8 rounded-md border border-[#CBD5E1] bg-white ps-8 pe-2.5 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-[#F1F5F9]">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-[#64748B]">
                {isAr ? 'لا توجد عملة مطابقة للبحث.' : 'No matching currency found.'}
              </div>
            ) : (
              <>
                {popularFiltered.length > 0 && (
                  <div className="py-1">
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B] bg-[#F8FAFC]">
                      {isAr ? 'العملات الشائعة' : 'Popular Currencies'}
                    </div>
                    {popularFiltered.map((item) => {
                      const active = item.code === value;
                      return (
                        <button
                          key={`pop-${item.code}`}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            onChange(item.code);
                            setOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs flex items-center justify-between gap-2 text-start transition-colors ${
                            active
                              ? 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold'
                              : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="font-mono-tabular font-bold w-9 shrink-0" dir="ltr">
                              {item.code}
                            </span>
                            <span className="truncate">{item.name}</span>
                          </span>
                          <span className="flex items-center gap-1.5 shrink-0">
                            {item.symbol !== item.code && (
                              <span className="text-[11px] text-[#64748B]" dir="ltr">
                                {item.symbol}
                              </span>
                            )}
                            {active && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {otherFiltered.length > 0 && (
                  <div className="py-1">
                    {!query.trim() && (
                      <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B] bg-[#F8FAFC]">
                        {isAr
                          ? `جميع عملات العالم (${catalog.length})`
                          : `All World Currencies (${catalog.length})`}
                      </div>
                    )}
                    {otherFiltered.map((item) => {
                      const active = item.code === value;
                      return (
                        <button
                          key={`all-${item.code}`}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            onChange(item.code);
                            setOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs flex items-center justify-between gap-2 text-start transition-colors ${
                            active
                              ? 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold'
                              : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="font-mono-tabular font-bold w-9 shrink-0" dir="ltr">
                              {item.code}
                            </span>
                            <span className="truncate">{item.name}</span>
                          </span>
                          <span className="flex items-center gap-1.5 shrink-0">
                            {item.symbol !== item.code && (
                              <span className="text-[11px] text-[#64748B]" dir="ltr">
                                {item.symbol}
                              </span>
                            )}
                            {active && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CurrencySelector({
  value,
  onChange,
  id = 'global-calc-currency',
  label = 'Currency',
}: {
  value?: string;
  onChange?: (code: string) => void;
  id?: string;
  label?: string;
} = {}) {
  const { currencyCode, setCurrencyCode, lang } = useAppContext();
  const isAr = lang === 'ar';
  const catalog = useMemo(
    () => buildCurrencyCatalog(Array.from(ACTIVE_WORLD_CURRENCY_CODES), lang),
    [lang]
  );

  return (
    <SearchableCurrencySelect
      id={id}
      label={label}
      value={value ?? currencyCode}
      onChange={onChange ?? setCurrencyCode}
      catalog={catalog}
      isAr={isAr}
    />
  );
}

export function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  const { lang } = useAppContext();
  const inputId = id || `select-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  return (
    <div>
      <FieldLabel htmlFor={inputId} label={label} />
      <select
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {translateWidgetLabel(o.label, lang)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: T;
  onChange: (val: T) => void;
  options: { value: T; label: string }[];
}) {
  const { lang } = useAppContext();
  return (
    <div>
      {label && <FieldLabel label={label} />}
      <div className="inline-flex w-full p-1 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                active
                  ? 'bg-white text-[#2563EB] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {translateWidgetLabel(opt.label, lang)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ResultHero({
  label,
  value,
  subtext,
  accent = 'blue',
}: {
  label: string;
  value: string;
  subtext?: string;
  accent?: 'blue' | 'green' | 'slate';
}) {
  const { lang } = useAppContext();
  const bg =
    accent === 'green'
      ? 'bg-[#F0FDF4] border-[#BBF7D0]'
      : accent === 'slate'
      ? 'bg-[#F8FAFC] border-[#E2E8F0]'
      : 'bg-[#EFF6FF] border-[#BFDBFE]';
  const valColor =
    accent === 'green'
      ? 'text-[#15803D]'
      : accent === 'slate'
      ? 'text-[#0F172A]'
      : 'text-[#1D4ED8]';

  const valueDir = /[\u0600-\u06FF]/.test(value) ? 'rtl' : 'ltr';

  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${bg}`}>
      <p className="text-xs font-medium text-[#64748B]">{translateWidgetLabel(label, lang)}</p>
      <p className={`mt-1 font-mono-tabular text-2xl sm:text-3xl font-bold tracking-tight ${valColor}`} dir={valueDir}>
        {value}
      </p>
      {subtext && <p className="mt-1.5 text-xs text-[#475569]">{subtext}</p>}
    </div>
  );
}

export function StatTile({ label, value }: { label: string; value: string }) {
  const { lang } = useAppContext();
  const valueDir = /[\u0600-\u06FF]/.test(value) ? 'rtl' : 'ltr';
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-3">
      <p className="text-xs text-[#64748B]">{translateWidgetLabel(label, lang)}</p>
      <p className="mt-0.5 font-mono-tabular text-base font-semibold text-[#0F172A]" dir={valueDir}>
        {value}
      </p>
    </div>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  const { lang } = useAppContext();
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]"
    >
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{translateWidgetLabel(message, lang)}</span>
    </div>
  );
}

export function CalcSplitLayout({
  inputs,
  results,
}: {
  inputs: React.ReactNode;
  results: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
        {inputs}
      </div>
      <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
        {results}
      </div>
    </div>
  );
}
