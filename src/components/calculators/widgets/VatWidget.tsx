import { useMemo, useState } from 'react';
import { Calculator, Globe, MinusCircle, PlusCircle, Scale } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext.tsx';
import { getCountryName } from '../../../lib/calculators/countryHolidays.ts';
import { formatMoney, getCurrencySymbol } from '../../../lib/calculators/currencies.ts';
import {
  type VatDiscountType,
  type VatMode,
  calculateVatLine,
  calculateVatSettlement,
  getCountryVatInfo,
} from '../../../lib/calculators/vat.ts';
import {
  CalcSplitLayout,
  CurrencySelector,
  FieldLabel,
  NumberInput,
  ResultHero,
  SearchableCountrySelect,
  SegmentedControl,
} from './FormPrimitives.tsx';
import { ResultActions } from '../ResultActions.tsx';

const QUICK_RATES = [0, 5, 10, 14, 15, 16, 19, 20];
const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000];

export function VatWidget() {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';

  const initialCountry = isAr ? 'SA' : 'GB';
  const initialInfo = getCountryVatInfo(initialCountry);

  const [countryCode, setCountryCode] = useState<string>(initialCountry);
  const [vatRate, setVatRate] = useState<string>(String(initialInfo.standardVatRate));
  const [vatCurrency, setVatCurrency] = useState<string>(initialInfo.currencyCode);
  const [mode, setMode] = useState<VatMode>('add');

  // Add / Extract state
  const [amountInput, setAmountInput] = useState<string>('1000');
  const [quantityInput, setQuantityInput] = useState<string>('1');
  const [discountType, setDiscountType] = useState<VatDiscountType>('none');
  const [discountValue, setDiscountValue] = useState<string>('0');
  const [decimals, setDecimals] = useState<'0' | '2' | '3'>('2');

  // Monthly settlement state
  const [salesInput, setSalesInput] = useState<string>('50000');
  const [purchasesInput, setPurchasesInput] = useState<string>('30000');
  const [settlementBasis, setSettlementBasis] = useState<'inclusive' | 'exclusive'>('inclusive');

  const currencySymbol = useMemo(() => getCurrencySymbol(vatCurrency), [vatCurrency]);
  const fmtMoney = (val: number, dec?: number) => formatMoney(val, vatCurrency, dec);

  const countryVatInfo = useMemo(() => getCountryVatInfo(countryCode), [countryCode]);
  const countryName = useMemo(() => getCountryName(countryCode, lang), [countryCode, lang]);

  const handleCountryChange = (nextCode: string) => {
    setCountryCode(nextCode);
    const info = getCountryVatInfo(nextCode);
    setVatRate(String(info.standardVatRate));
    if (info.currencyCode) {
      setVatCurrency(info.currencyCode);
    }
  };

  const handleReset = () => {
    const info = getCountryVatInfo(initialCountry);
    setCountryCode(initialCountry);
    setVatRate(String(info.standardVatRate));
    setVatCurrency(info.currencyCode);
    setMode('add');
    setAmountInput('1000');
    setQuantityInput('1');
    setDiscountType('none');
    setDiscountValue('0');
    setDecimals('2');
    setSalesInput('50000');
    setPurchasesInput('30000');
    setSettlementBasis('inclusive');
  };

  const decimalPlaces = Number(decimals);
  const rateNum = parseFloat(vatRate) || 0;

  const lineResult = useMemo(
    () =>
      calculateVatLine({
        mode: mode === 'extract' ? 'extract' : 'add',
        unitAmount: parseFloat(amountInput) || 0,
        quantity: parseFloat(quantityInput) || 0,
        vatRatePercent: rateNum,
        discountType,
        discountValue: parseFloat(discountValue) || 0,
      }),
    [mode, amountInput, quantityInput, rateNum, discountType, discountValue]
  );

  const settlementResult = useMemo(
    () =>
      calculateVatSettlement({
        salesAmount: parseFloat(salesInput) || 0,
        purchasesAmount: parseFloat(purchasesInput) || 0,
        vatRatePercent: rateNum,
        amountsIncludeVat: settlementBasis === 'inclusive',
      }),
    [salesInput, purchasesInput, rateNum, settlementBasis]
  );

  const netPercent =
    lineResult.totalAmount > 0 ? (lineResult.netAmount / lineResult.totalAmount) * 100 : 100;
  const vatPercentOfTotal =
    lineResult.totalAmount > 0 ? (lineResult.vatAmount / lineResult.totalAmount) * 100 : 0;

  const copySummary =
    mode === 'settlement'
      ? isAr
        ? `مقاصة الضريبة (${countryName} - ${rateNum}%): ضريبة المبيعات ${fmtMoney(settlementResult.outputVat, decimalPlaces)} | ضريبة المشتريات ${fmtMoney(settlementResult.inputVat, decimalPlaces)} | ${settlementResult.isRefundDue ? 'فائض قابل للاسترداد' : 'صافي الضريبة المستحقة'} ${fmtMoney(Math.abs(settlementResult.netVatPayable), decimalPlaces)}`
        : `VAT Clearing (${countryName} - ${rateNum}%): Output VAT ${fmtMoney(settlementResult.outputVat, decimalPlaces)} | Input VAT ${fmtMoney(settlementResult.inputVat, decimalPlaces)} | ${settlementResult.isRefundDue ? 'Refundable Credit' : 'Net Payable'} ${fmtMoney(Math.abs(settlementResult.netVatPayable), decimalPlaces)}`
      : isAr
      ? `حاسبة الضريبة (${countryName} - ${rateNum}%): الصافي ${fmtMoney(lineResult.netAmount, decimalPlaces)} | الضريبة ${fmtMoney(lineResult.vatAmount, decimalPlaces)} | الإجمالي ${fmtMoney(lineResult.totalAmount, decimalPlaces)}`
      : `VAT (${countryName} - ${rateNum}%): Net ${fmtMoney(lineResult.netAmount, decimalPlaces)} | VAT ${fmtMoney(lineResult.vatAmount, decimalPlaces)} | Total ${fmtMoney(lineResult.totalAmount, decimalPlaces)}`;

  const csvData =
    mode === 'settlement'
      ? {
          filename: `vat-settlement-${countryCode.toLowerCase()}.csv`,
          headers: isAr
            ? ['البند', 'المبلغ الصافي', 'الضريبة', 'الإجمالي', 'العملة']
            : ['Item', 'Net Amount', 'VAT Amount', 'Gross Total', 'Currency'],
          rows: [
            [
              isAr ? 'المبيعات' : 'Sales',
              settlementResult.salesNet.toFixed(decimalPlaces),
              settlementResult.outputVat.toFixed(decimalPlaces),
              settlementResult.salesTotal.toFixed(decimalPlaces),
              vatCurrency,
            ],
            [
              isAr ? 'المشتريات' : 'Purchases',
              settlementResult.purchasesNet.toFixed(decimalPlaces),
              settlementResult.inputVat.toFixed(decimalPlaces),
              settlementResult.purchasesTotal.toFixed(decimalPlaces),
              vatCurrency,
            ],
            [
              settlementResult.isRefundDue
                ? isAr
                  ? 'فائض ضريبي مسترد'
                  : 'Refundable VAT Credit'
                : isAr
                ? 'صافي الضريبة المستحقة'
                : 'Net VAT Payable',
              '—',
              Math.abs(settlementResult.netVatPayable).toFixed(decimalPlaces),
              '—',
              vatCurrency,
            ],
          ],
        }
      : {
          filename: `vat-calculation-${countryCode.toLowerCase()}.csv`,
          headers: isAr ? ['البند', 'القيمة', 'العملة'] : ['Line Item', 'Amount', 'Currency'],
          rows: [
            [
              isAr ? 'المبلغ قبل الخصم' : 'Subtotal Before Discount',
              lineResult.grossBeforeDiscount.toFixed(decimalPlaces),
              vatCurrency,
            ],
            ...(lineResult.discountAmount > 0
              ? [
                  [
                    isAr ? 'الخصم' : 'Discount',
                    lineResult.discountAmount.toFixed(decimalPlaces),
                    vatCurrency,
                  ],
                ]
              : []),
            [
              isAr ? 'المبلغ الصافي (قبل الضريبة)' : 'Net Amount (Excl. VAT)',
              lineResult.netAmount.toFixed(decimalPlaces),
              vatCurrency,
            ],
            [
              isAr ? `قيمة الضريبة (${rateNum}%)` : `VAT Amount (${rateNum}%)`,
              lineResult.vatAmount.toFixed(decimalPlaces),
              vatCurrency,
            ],
            [
              isAr ? 'الإجمالي (شامل الضريبة)' : 'Total (Incl. VAT)',
              lineResult.totalAmount.toFixed(decimalPlaces),
              vatCurrency,
            ],
          ],
        };

  return (
    <div className="space-y-6">
      {/* 1. Primary Country, Rate & Currency Configuration Bar */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
            <Globe className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span>
              {isAr ? 'اختيار الدولة ونسبة الضريبة / الفائدة' : 'Country, Tax Rate & Currency'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
            <span>{countryName}</span>
            <span aria-hidden="true">·</span>
            <span>
              {isAr ? countryVatInfo.regimeLabelAr : countryVatInfo.regimeLabelEn}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular font-semibold text-[#0F172A]">
              {countryVatInfo.standardVatRate}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <SearchableCountrySelect
              id="vat-country-select"
              label={isAr ? 'اختر البلد (جميع دول العالم)' : 'Select Country (All World Countries)'}
              value={countryCode}
              onChange={handleCountryChange}
            />
          </div>

          <div>
            <NumberInput
              id="vat-rate-input"
              label={isAr ? 'نسبة الضريبة / الفائدة (%)' : 'VAT / Tax Rate (%)'}
              suffix="%"
              value={vatRate}
              onChange={setVatRate}
              min={0}
              max={100}
              step="0.5"
            />
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {QUICK_RATES.map((preset) => {
                const active = Math.abs(rateNum - preset) < 0.001;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setVatRate(String(preset))}
                    className={`px-2 py-1 rounded-md text-xs font-mono-tabular font-medium transition-colors whitespace-nowrap shrink-0 border ${
                      active
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1D4ED8]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1] hover:text-[#0F172A]'
                    }`}
                  >
                    {preset}%
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <CurrencySelector
              id="vat-currency-select"
              label={isAr ? 'العملة' : 'Currency'}
              value={vatCurrency}
              onChange={setVatCurrency}
            />
          </div>
        </div>
      </div>

      {/* 2. Calculation Mode Switcher (3 modes inspired by vat.kss.sa & itqantools) */}
      <div
        role="tablist"
        aria-label={isAr ? 'وضع حساب الضريبة' : 'VAT Calculation Mode'}
        className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]"
      >
        {(
          [
            {
              id: 'add' as VatMode,
              label: isAr ? 'إضافة الضريبة' : 'Add VAT',
              icon: PlusCircle,
            },
            {
              id: 'extract' as VatMode,
              label: isAr ? 'استخراج الضريبة من الإجمالي' : 'Extract VAT from Total',
              icon: MinusCircle,
            },
            {
              id: 'settlement' as VatMode,
              label: isAr ? 'مقاصة الضريبة الشهرية' : 'Monthly VAT Clearing',
              icon: Scale,
            },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-white text-[#2563EB] shadow-sm'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Two-Column Calculator Workspace */}
      <CalcSplitLayout
        inputs={
          mode === 'settlement' ? (
            <div className="space-y-4">
              <SegmentedControl
                label={isAr ? 'أساس المبالغ المدخلة' : 'Entered Amounts Basis'}
                value={settlementBasis}
                onChange={setSettlementBasis}
                options={[
                  {
                    value: 'inclusive',
                    label: isAr ? 'شاملة الضريبة' : 'VAT Inclusive',
                  },
                  {
                    value: 'exclusive',
                    label: isAr ? 'قبل الضريبة' : 'VAT Exclusive',
                  },
                ]}
              />

              <NumberInput
                id="vat-monthly-sales"
                label={
                  settlementBasis === 'inclusive'
                    ? isAr
                      ? 'إجمالي المبيعات (شامل الضريبة)'
                      : 'Total Sales (VAT Inclusive)'
                    : isAr
                    ? 'إجمالي المبيعات (قبل الضريبة)'
                    : 'Total Sales (Excl. VAT)'
                }
                prefix={currencySymbol}
                value={salesInput}
                onChange={setSalesInput}
                min={0}
              />

              <NumberInput
                id="vat-monthly-purchases"
                label={
                  settlementBasis === 'inclusive'
                    ? isAr
                      ? 'إجمالي المشتريات والمصروفات (شامل الضريبة)'
                      : 'Total Purchases (VAT Inclusive)'
                    : isAr
                    ? 'إجمالي المشتريات والمصروفات (قبل الضريبة)'
                    : 'Total Purchases (Excl. VAT)'
                }
                prefix={currencySymbol}
                value={purchasesInput}
                onChange={setPurchasesInput}
                min={0}
              />

              <SegmentedControl
                label={isAr ? 'الخانات العشرية' : 'Decimal Places'}
                value={decimals}
                onChange={setDecimals}
                options={[
                  { value: '0', label: '0' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                ]}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <NumberInput
                  id="vat-amount-input"
                  label={
                    mode === 'add'
                      ? isAr
                        ? 'المبلغ قبل الضريبة (سعر الوحدة)'
                        : 'Net Amount Before VAT (Unit Price)'
                      : isAr
                      ? 'المبلغ الإجمالي شامل الضريبة'
                      : 'Gross Amount Including VAT'
                  }
                  prefix={currencySymbol}
                  value={amountInput}
                  onChange={setAmountInput}
                  min={0}
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {QUICK_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmountInput(String(preset))}
                      className="px-2.5 py-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#94A3B8] text-xs font-mono-tabular text-[#334155] transition-colors whitespace-nowrap shrink-0"
                    >
                      {preset.toLocaleString('en-US')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
                <NumberInput
                  id="vat-qty-input"
                  label={isAr ? 'الكمية' : 'Quantity'}
                  value={quantityInput}
                  onChange={setQuantityInput}
                  min={1}
                  step="1"
                />

                <SegmentedControl
                  label={isAr ? 'الخانات العشرية' : 'Decimals'}
                  value={decimals}
                  onChange={setDecimals}
                  options={[
                    { value: '0', label: '0' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                  ]}
                />
              </div>

              {mode === 'add' && (
                <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
                  <FieldLabel label={isAr ? 'الخصم (اختياري)' : 'Discount (Optional)'} />
                  <SegmentedControl
                    value={discountType}
                    onChange={setDiscountType}
                    options={[
                      { value: 'none', label: isAr ? 'بدون خصم' : 'None' },
                      { value: 'percent', label: isAr ? 'نسبة %' : 'Percent %' },
                      { value: 'fixed', label: isAr ? 'مبلغ ثابت' : 'Fixed Amount' },
                    ]}
                  />
                  {discountType !== 'none' && (
                    <NumberInput
                      id="vat-discount-val"
                      label={
                        discountType === 'percent'
                          ? isAr
                            ? 'نسبة الخصم (%)'
                            : 'Discount Percentage (%)'
                          : isAr
                          ? 'قيمة الخصم الثابت'
                          : 'Fixed Discount Amount'
                      }
                      prefix={discountType === 'fixed' ? currencySymbol : undefined}
                      suffix={discountType === 'percent' ? '%' : undefined}
                      value={discountValue}
                      onChange={setDiscountValue}
                      min={0}
                      max={discountType === 'percent' ? 100 : undefined}
                    />
                  )}
                </div>
              )}
            </div>
          )
        }
        results={
          mode === 'settlement' ? (
            <div className="space-y-4">
              <ResultHero
                label={
                  settlementResult.isRefundDue
                    ? isAr
                      ? 'فائض ضريبي قابل للاسترداد / الترحيل'
                      : 'Refundable / Carried-Forward VAT Credit'
                    : isAr
                    ? 'صافي الضريبة المستحقة للدفع'
                    : 'Net VAT Payable to Tax Authority'
                }
                value={fmtMoney(Math.abs(settlementResult.netVatPayable), decimalPlaces)}
                accent={settlementResult.isRefundDue ? 'green' : 'blue'}
                subtext={
                  isAr
                    ? `ضريبة المبيعات المحصّلة: ${fmtMoney(settlementResult.outputVat, decimalPlaces)} − ضريبة المشتريات القابلة للخصم: ${fmtMoney(settlementResult.inputVat, decimalPlaces)}`
                    : `Output VAT Collected: ${fmtMoney(settlementResult.outputVat, decimalPlaces)} − Deductible Input VAT: ${fmtMoney(settlementResult.inputVat, decimalPlaces)}`
                }
              />

              <div className="rounded-xl border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9]">
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-[#475569]">
                    {isAr ? 'صافي المبيعات (بدون ضريبة)' : 'Net Sales (Excl. VAT)'}
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#0F172A]">
                    {fmtMoney(settlementResult.salesNet, decimalPlaces)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-[#475569]">
                    {isAr ? `ضريبة المبيعات المحصّلة (${rateNum}%)` : `Output VAT (${rateNum}%)`}
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#2563EB]">
                    +{fmtMoney(settlementResult.outputVat, decimalPlaces)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-[#475569]">
                    {isAr ? 'صافي المشتريات (بدون ضريبة)' : 'Net Purchases (Excl. VAT)'}
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#0F172A]">
                    {fmtMoney(settlementResult.purchasesNet, decimalPlaces)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-[#475569]">
                    {isAr ? `ضريبة المشتريات القابلة للخصم (${rateNum}%)` : `Deductible Input VAT (${rateNum}%)`}
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#16A34A]">
                    −{fmtMoney(settlementResult.inputVat, decimalPlaces)}
                  </span>
                </div>
              </div>

              <ResultActions copyText={copySummary} onReset={handleReset} csvData={csvData} />
            </div>
          ) : (
            <div className="space-y-4">
              <ResultHero
                label={
                  mode === 'add'
                    ? isAr
                      ? 'المبلغ الإجمالي شامل الضريبة'
                      : 'Total Price Including VAT'
                    : isAr
                    ? 'السعر الصافي الأصلي (قبل الضريبة)'
                    : 'Extracted Net Price (Before VAT)'
                }
                value={fmtMoney(
                  mode === 'add' ? lineResult.totalAmount : lineResult.netAmount,
                  decimalPlaces
                )}
                accent={mode === 'add' ? 'blue' : 'green'}
                subtext={
                  isAr
                    ? `قيمة الضريبة (${rateNum}%): ${fmtMoney(lineResult.vatAmount, decimalPlaces)} · ${
                        lineResult.quantity > 1
                          ? `سعر الوحدة شامل الضريبة: ${fmtMoney(lineResult.perUnitTotal, decimalPlaces)}`
                          : `نسبة الضريبة من الإجمالي: ${lineResult.vatShareOfTotalPercent.toFixed(1)}%`
                      }`
                    : `VAT (${rateNum}%): ${fmtMoney(lineResult.vatAmount, decimalPlaces)} · ${
                        lineResult.quantity > 1
                          ? `Unit incl. VAT: ${fmtMoney(lineResult.perUnitTotal, decimalPlaces)}`
                          : `VAT share of total: ${lineResult.vatShareOfTotalPercent.toFixed(1)}%`
                      }`
                }
              />

              {/* Visual Net vs VAT Share Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span>
                    {isAr ? 'المبلغ الصافي' : 'Net Base'}: {netPercent.toFixed(1)}%
                  </span>
                  <span>
                    {isAr ? 'الضريبة' : 'VAT'}: {vatPercentOfTotal.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden flex">
                  <div
                    className="h-full bg-[#0F172A] transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(0, netPercent))}%` }}
                  />
                  <div
                    className="h-full bg-[#2563EB] transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(0, vatPercentOfTotal))}%` }}
                  />
                </div>
              </div>

              {/* Clean Single-Level Hairline Ledger */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9]">
                {lineResult.discountAmount > 0 && (
                  <>
                    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-[#475569]">
                        {isAr ? 'الإجمالي قبل الخصم' : 'Subtotal Before Discount'}
                      </span>
                      <span className="font-mono-tabular font-medium text-[#0F172A]">
                        {fmtMoney(lineResult.grossBeforeDiscount, decimalPlaces)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-[#475569]">
                        {isAr ? 'قيمة الخصم' : 'Discount'}
                      </span>
                      <span className="font-mono-tabular font-medium text-[#16A34A]">
                        −{fmtMoney(lineResult.discountAmount, decimalPlaces)}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-[#475569]">
                    {isAr ? 'المبلغ الصافي (قبل الضريبة)' : 'Net Amount (Excl. VAT)'}
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#0F172A]">
                    {fmtMoney(lineResult.netAmount, decimalPlaces)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-[#475569]">
                    {isAr ? `قيمة الضريبة (${rateNum}%)` : `VAT Amount (${rateNum}%)`}
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#2563EB]">
                    {fmtMoney(lineResult.vatAmount, decimalPlaces)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3 text-sm bg-[#F8FAFC]">
                  <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-[#2563EB]" />
                    {isAr ? 'المبلغ الإجمالي (شامل الضريبة)' : 'Gross Total (Incl. VAT)'}
                  </span>
                  <span className="font-mono-tabular font-bold text-[#0F172A]">
                    {fmtMoney(lineResult.totalAmount, decimalPlaces)}
                  </span>
                </div>
              </div>

              <ResultActions copyText={copySummary} onReset={handleReset} csvData={csvData} />
            </div>
          )
        }
      />
    </div>
  );
}
