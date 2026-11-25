import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext.tsx';
import { translateWidgetLabel } from '../../../i18n/translations.ts';

export function fmtCurrency(val: number, decimals = 2): string {
  if (!Number.isFinite(val)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
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
      <div className="relative flex items-center" dir="ltr">
        {prefix && (
          <span className="absolute left-3 text-sm font-medium text-[#64748B] pointer-events-none select-none">
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
          className={`w-full h-10 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-colors ${
            prefix ? 'pl-8' : 'pl-3'
          } ${suffix ? 'pr-12' : 'pr-3'}`}
        />
        {suffix && (
          <span className="absolute right-3 text-xs font-medium text-[#64748B] pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
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
