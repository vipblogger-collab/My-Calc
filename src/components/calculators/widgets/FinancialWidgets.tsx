import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CompoundingFrequency,
  DebtItem,
  FilingStatus,
  PaymentFrequency,
  SalaryPeriod,
  calculateAmortizationWithExtra,
  calculateAutoLoan,
  calculateBudget,
  calculateCompoundInterest,
  calculateCreditCardPayoff,
  calculateDebtPayoff,
  calculateIncomeTax,
  calculateInflation,
  calculateInvestment,
  calculateLoan,
  calculateMortgage,
  calculateMortgageRefinance,
  calculateNetWorth,
  calculatePersonalLoan,
  calculateROI,
  calculateRetirement,
  calculateSalary,
  calculateSimpleInterest,
  solveInterestRate,
} from '../../../lib/calculators/financial.ts';
import {
  CalcSplitLayout,
  ErrorAlert,
  NumberInput,
  ResultHero,
  SegmentedControl,
  SelectInput,
  StatTile,
  fmtCurrency,
  fmtNum,
} from './FormPrimitives.tsx';
import { ResultActions } from '../ResultActions.tsx';
import { useAppContext } from '../../../context/AppContext.tsx';

export function FinancialWidget({ slug }: { slug: string }) {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  // Mortgage
  const [homePrice, setHomePrice] = useState('420000');
  const [downPayment, setDownPayment] = useState('20');
  const [downMode, setDownMode] = useState<'pct' | 'usd'>('pct');
  const [mortTerm, setMortTerm] = useState('30');
  const [mortRate, setMortRate] = useState('6.25');
  const [propTax, setPropTax] = useState('4800');
  const [homeIns, setHomeIns] = useState('1500');
  const [pmiRate, setPmiRate] = useState('0.5');

  // General Loan / Amortization / Interest Rate solver
  const [loanAmt, setLoanAmt] = useState('250000');
  const [loanRate, setLoanRate] = useState('6.5');
  const [loanYears, setLoanYears] = useState('30');
  const [loanFreq, setLoanFreq] = useState<PaymentFrequency>('monthly');
  const [extraMonthly, setExtraMonthly] = useState('150');
  const [targetMonthlyPay, setTargetMonthlyPay] = useState('1580');

  // Auto Loan
  const [autoPrice, setAutoPrice] = useState('34000');
  const [autoDown, setAutoDown] = useState('5000');
  const [autoTrade, setAutoTrade] = useState('4000');
  const [autoTax, setAutoTax] = useState('6.5');
  const [autoMonths, setAutoMonths] = useState('60');
  const [autoRate, setAutoRate] = useState('5.9');

  // Personal Loan
  const [persAmt, setPersAmt] = useState('15000');
  const [persRate, setPersRate] = useState('10.5');
  const [persMonths, setPersMonths] = useState('36');
  const [origFee, setOrigFee] = useState('3');

  // Compound / Simple / Savings / Investment
  const [principal, setPrincipal] = useState('10000');
  const [monthlyContrib, setMonthlyContrib] = useState('300');
  const [annualRate, setAnnualRate] = useState('7.0');
  const [yearsHorizon, setYearsHorizon] = useState('20');
  const [compFreq, setCompFreq] = useState<CompoundingFrequency>('monthly');
  const [taxDrag, setTaxDrag] = useState('0');
  const [simpleUnit, setSimpleUnit] = useState<'years' | 'months' | 'days'>('years');
  const [invFreq, setInvFreq] = useState<'monthly' | 'annually'>('monthly');
  const [invInflation, setInvInflation] = useState('2.5');

  // Retirement
  const [retAgeNow, setRetAgeNow] = useState('32');
  const [retAgeGoal, setRetAgeGoal] = useState('65');
  const [retLifeExp, setRetLifeExp] = useState('90');
  const [retSaved, setRetSaved] = useState('45000');
  const [retContrib, setRetContrib] = useState('800');
  const [retPreReturn, setRetPreReturn] = useState('7.0');
  const [retPostReturn, setRetPostReturn] = useState('5.0');
  const [retDesiredIncome, setRetDesiredIncome] = useState('80000');

  // Credit Card & Multi-Debt
  const [ccBalance, setCcBalance] = useState('6000');
  const [ccApr, setCcApr] = useState('21.99');
  const [ccMonthly, setCcMonthly] = useState('220');
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: '1', name: 'Credit Card', balance: 4500, aprPercent: 22.9, minPayment: 135 },
    { id: '2', name: 'Auto Loan', balance: 11000, aprPercent: 6.2, minPayment: 280 },
    { id: '3', name: 'Student Loan', balance: 14000, aprPercent: 4.8, minPayment: 180 },
  ]);
  const [debtExtra, setDebtExtra] = useState('250');

  // Inflation
  const [infAmount, setInfAmount] = useState('1000');
  const [infRate, setInfRate] = useState('3.0');
  const [infYears, setInfYears] = useState('20');

  // Salary
  const [salAmount, setSalAmount] = useState('38.5');
  const [salPeriod, setSalPeriod] = useState<SalaryPeriod>('hourly');
  const [salHours, setSalHours] = useState('40');
  const [salWeeks, setSalWeeks] = useState('52');

  // Income Tax
  const [taxGross, setTaxGross] = useState('95000');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [preTax401k, setPreTax401k] = useState('5000');
  const [stateTaxPct, setStateTaxPct] = useState('4.5');

  // Budget
  const [bIncome, setBIncome] = useState('6000');
  const [bHousing, setBHousing] = useState('1800');
  const [bUtils, setBUtils] = useState('220');
  const [bFood, setBFood] = useState('650');
  const [bTrans, setBTrans] = useState('450');
  const [bHealth, setBHealth] = useState('180');
  const [bDebt, setBDebt] = useState('300');
  const [bSavings, setBSavings] = useState('1200');
  const [bWants, setBWants] = useState('950');

  // Net Worth
  const [nwCash, setNwCash] = useState('28000');
  const [nwInv, setNwInv] = useState('65000');
  const [nwRet, setNwRet] = useState('140000');
  const [nwHome, setNwHome] = useState('380000');
  const [nwVeh, setNwVeh] = useState('22000');
  const [nwMort, setNwMort] = useState('260000');
  const [nwAuto, setNwAuto] = useState('12000');
  const [nwStud, setNwStud] = useState('15000');
  const [nwCard, setNwCard] = useState('2500');
  const [nwOtherL, setNwOtherL] = useState('0');

  // ROI
  const [roiInit, setRoiInit] = useState('10000');
  const [roiRet, setRoiRet] = useState('14641');
  const [roiYears, setRoiYears] = useState('4');

  // Refinance
  const [refiBal, setRefiBal] = useState('280000');
  const [refiOldRate, setRefiOldRate] = useState('7.25');
  const [refiOldYears, setRefiOldYears] = useState('25');
  const [refiNewRate, setRefiNewRate] = useState('5.85');
  const [refiNewYears, setRefiNewYears] = useState('25');
  const [refiCosts, setRefiCosts] = useState('4200');

  if (slug === 'mortgage-calculator') {
    const res = calculateMortgage({
      homePrice: parseFloat(homePrice) || 0,
      downPayment: parseFloat(downPayment) || 0,
      downPaymentIsPercent: downMode === 'pct',
      loanTermYears: parseFloat(mortTerm) || 30,
      interestRatePercent: parseFloat(mortRate) || 0,
      propertyTaxAnnual: parseFloat(propTax) || 0,
      homeInsuranceAnnual: parseFloat(homeIns) || 0,
      pmiAnnualPercent: parseFloat(pmiRate) || 0,
    });

    const pieData = [
      { name: isAr ? 'الأصل والفائدة' : 'Principal & Interest', value: Math.round(res.monthlyPrincipalAndInterest), color: '#2563EB' },
      { name: isAr ? 'ضريبة العقار' : 'Property Tax', value: Math.round(res.monthlyPropertyTax), color: '#0F172A' },
      { name: isAr ? 'تأمين المنزل' : 'Home Insurance', value: Math.round(res.monthlyHomeInsurance), color: '#16A34A' },
      ...(res.monthlyPMI > 0 ? [{ name: 'PMI', value: Math.round(res.monthlyPMI), color: '#D97706' }] : []),
    ];

    const annualSummary = useMemo(() => {
      const yearsMap = new Map<number, { year: number; principal: number; interest: number; balance: number }>();
      res.schedule.forEach((row) => {
        const cur = yearsMap.get(row.year) || { year: row.year, principal: 0, interest: 0, balance: row.balance };
        cur.principal += row.principal;
        cur.interest += row.interest;
        cur.balance = row.balance;
        yearsMap.set(row.year, cur);
      });
      return Array.from(yearsMap.values());
    }, [res.schedule]);

    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Home Price" prefix="$" value={homePrice} onChange={setHomePrice} min={0} />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-[#1E293B]">
                  {isAr ? 'الدفعة المقدمة' : 'Down Payment'}
                </span>
                <div className="inline-flex rounded border border-[#E2E8F0] overflow-hidden text-xs" dir="ltr">
                  <button
                    type="button"
                    onClick={() => setDownMode('pct')}
                    className={`px-2 py-0.5 ${downMode === 'pct' ? 'bg-[#2563EB] text-white' : 'bg-white text-[#64748B]'}`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownMode('usd')}
                    className={`px-2 py-0.5 ${downMode === 'usd' ? 'bg-[#2563EB] text-white' : 'bg-white text-[#64748B]'}`}
                  >
                    $
                  </button>
                </div>
              </div>
              <input
                type="number"
                dir="ltr"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm tabular-nums"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectInput
                label="Loan Term"
                value={mortTerm}
                onChange={setMortTerm}
                options={[
                  { value: '30', label: '30 Years' },
                  { value: '20', label: '20 Years' },
                  { value: '15', label: '15 Years' },
                  { value: '10', label: '10 Years' },
                ]}
              />
              <NumberInput label="Interest Rate" suffix="%" value={mortRate} onChange={setMortRate} min={0} step="0.05" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Property Tax / Yr" prefix="$" value={propTax} onChange={setPropTax} min={0} />
              <NumberInput label="Home Insurance / Yr" prefix="$" value={homeIns} onChange={setHomeIns} min={0} />
            </div>
            {res.downPaymentPercent < 20 && (
              <NumberInput label="PMI Annual Rate" suffix="%" value={pmiRate} onChange={setPmiRate} min={0} step="0.1" />
            )}
          </>
        }
        results={
          <>
            <ResultHero
              label="Estimated Monthly Mortgage Payment"
              value={fmtCurrency(res.totalMonthlyPayment)}
              subtext={
                isAr
                  ? `مبلغ القرض: ${fmtCurrency(res.loanAmount, 0)} · إجمالي الفائدة: ${fmtCurrency(res.totalInterest, 0)}`
                  : `Loan Amount: ${fmtCurrency(res.loanAmount, 0)} · Total Interest: ${fmtCurrency(res.totalInterest, 0)}`
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={68}>
                      {pieData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmtCurrency(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#475569]">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-mono-tabular font-semibold text-[#0F172A]" dir="ltr">{fmtCurrency(d.value)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#E2E8F0] flex justify-between font-semibold">
                  <span>{isAr ? 'إجمالي تكلفة القرض' : 'Total Loan Cost'}</span>
                  <span className="font-mono-tabular" dir="ltr">{fmtCurrency(res.totalLoanCost, 0)}</span>
                </div>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto border border-[#E2E8F0] rounded-lg">
              <table className="w-full text-xs text-start">
                <thead className="bg-[#F8FAFC] sticky top-0 border-b border-[#E2E8F0] text-[#64748B]">
                  <tr>
                    <th className="px-3 py-2">{isAr ? 'السنة' : 'Year'}</th>
                    <th className="px-3 py-2 text-end">{isAr ? 'الأصل' : 'Principal'}</th>
                    <th className="px-3 py-2 text-end">{isAr ? 'الفائدة' : 'Interest'}</th>
                    <th className="px-3 py-2 text-end">{isAr ? 'الرصيد المتبقي' : 'Ending Balance'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] font-mono-tabular">
                  {annualSummary.map((row) => (
                    <tr key={row.year}>
                      <td className="px-3 py-1.5 font-sans text-[#475569]">
                        {isAr ? `السنة ${row.year}` : `Year ${row.year}`}
                      </td>
                      <td className="px-3 py-1.5 text-end" dir="ltr">{fmtCurrency(row.principal, 0)}</td>
                      <td className="px-3 py-1.5 text-end" dir="ltr">{fmtCurrency(row.interest, 0)}</td>
                      <td className="px-3 py-1.5 text-end font-semibold" dir="ltr">{fmtCurrency(row.balance, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ResultActions
              copyText={`Monthly Mortgage: ${fmtCurrency(res.totalMonthlyPayment)} (P&I: ${fmtCurrency(res.monthlyPrincipalAndInterest)}, Loan: ${fmtCurrency(res.loanAmount, 0)}, Total Interest: ${fmtCurrency(res.totalInterest, 0)})`}
              csvData={{
                filename: 'mortgage-amortization.csv',
                headers: ['Month', 'Year', 'Payment', 'Principal', 'Interest', 'Remaining Balance'],
                rows: res.schedule.map((r) => [
                  r.month,
                  r.year,
                  r.payment.toFixed(2),
                  r.principal.toFixed(2),
                  r.interest.toFixed(2),
                  r.balance.toFixed(2),
                ]),
              }}
            />
          </>
        }
      />
    );
  }

  if (slug === 'loan-calculator') {
    const res = calculateLoan({
      loanAmount: parseFloat(loanAmt) || 0,
      interestRatePercent: parseFloat(loanRate) || 0,
      loanTermYears: parseFloat(loanYears) || 1,
      frequency: loanFreq,
    });
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Loan Amount" prefix="$" value={loanAmt} onChange={setLoanAmt} min={0} />
            <NumberInput label="Annual Interest Rate" suffix="%" value={loanRate} onChange={setLoanRate} min={0} step="0.1" />
            <NumberInput label="Loan Term" suffix="years" value={loanYears} onChange={setLoanYears} min={0.5} />
            <SegmentedControl
              label="Payment Frequency"
              value={loanFreq}
              onChange={setLoanFreq}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'biweekly', label: 'Biweekly' },
                { value: 'weekly', label: 'Weekly' },
              ]}
            />
          </>
        }
        results={
          <>
            <ResultHero
              label={`${loanFreq.charAt(0).toUpperCase() + loanFreq.slice(1)} Payment`}
              value={fmtCurrency(res.periodicPayment)}
              subtext={
                isAr
                  ? `إجمالي الفائدة: ${fmtCurrency(res.totalInterest)} · إجمالي المدفوع: ${fmtCurrency(res.totalCost)}`
                  : `Total Interest: ${fmtCurrency(res.totalInterest)} · Total Paid: ${fmtCurrency(res.totalCost)}`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Payments Count" value={String(res.periodsCount)} />
              <StatTile label="Total Interest" value={fmtCurrency(res.totalInterest)} />
              <StatTile label="Total Cost" value={fmtCurrency(res.totalCost)} />
            </div>
            <ResultActions
              copyText={`Loan ${fmtCurrency(parseFloat(loanAmt) || 0)} @ ${loanRate}%: ${fmtCurrency(res.periodicPayment)} (${loanFreq}), Total Interest: ${fmtCurrency(res.totalInterest)}`}
              csvData={{
                filename: 'loan-schedule.csv',
                headers: ['Period', 'Payment', 'Principal', 'Interest', 'Balance'],
                rows: res.schedule.map((r) => [r.month, r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2)]),
              }}
            />
          </>
        }
      />
    );
  }

  if (slug === 'auto-loan-calculator') {
    const res = calculateAutoLoan({
      vehiclePrice: parseFloat(autoPrice) || 0,
      downPayment: parseFloat(autoDown) || 0,
      tradeInValue: parseFloat(autoTrade) || 0,
      salesTaxPercent: parseFloat(autoTax) || 0,
      loanTermMonths: parseFloat(autoMonths) || 60,
      interestRatePercent: parseFloat(autoRate) || 0,
    });
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Vehicle Price" prefix="$" value={autoPrice} onChange={setAutoPrice} min={0} />
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Down Payment" prefix="$" value={autoDown} onChange={setAutoDown} min={0} />
              <NumberInput label="Trade-In Value" prefix="$" value={autoTrade} onChange={setAutoTrade} min={0} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Sales Tax" suffix="%" value={autoTax} onChange={setAutoTax} min={0} step="0.1" />
              <NumberInput label="Loan Term" suffix="months" value={autoMonths} onChange={setAutoMonths} min={12} max={96} step={12} />
            </div>
            <NumberInput label="Interest Rate (APR)" suffix="%" value={autoRate} onChange={setAutoRate} min={0} step="0.1" />
          </>
        }
        results={
          <>
            <ResultHero
              label="Monthly Auto Payment"
              value={fmtCurrency(res.monthlyPayment)}
              subtext={
                isAr
                  ? `أصل القرض المموّل: ${fmtCurrency(res.totalLoanAmount)} (شامل ضريبة مبيعات ${fmtCurrency(res.taxAmount)})`
                  : `Financed Principal: ${fmtCurrency(res.totalLoanAmount)} (incl. ${fmtCurrency(res.taxAmount)} sales tax)`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Loan Amount" value={fmtCurrency(res.totalLoanAmount)} />
              <StatTile label="Total Interest" value={fmtCurrency(res.totalInterest)} />
              <StatTile label="Total Vehicle Cost" value={fmtCurrency(res.totalCost)} />
            </div>
            <ResultActions
              copyText={`Auto Loan: ${fmtCurrency(res.monthlyPayment)}/mo | Financed: ${fmtCurrency(res.totalLoanAmount)} | Total Interest: ${fmtCurrency(res.totalInterest)}`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'personal-loan-calculator') {
    const res = calculatePersonalLoan({
      loanAmount: parseFloat(persAmt) || 0,
      interestRatePercent: parseFloat(persRate) || 0,
      loanTermMonths: parseFloat(persMonths) || 36,
      originationFeePercent: parseFloat(origFee) || 0,
    });
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Loan Amount" prefix="$" value={persAmt} onChange={setPersAmt} min={0} />
            <NumberInput label="Interest Rate" suffix="%" value={persRate} onChange={setPersRate} min={0} step="0.1" />
            <NumberInput label="Term" suffix="months" value={persMonths} onChange={setPersMonths} min={6} max={84} step={6} />
            <NumberInput label="Origination Fee" suffix="%" value={origFee} onChange={setOrigFee} min={0} max={15} step="0.25" />
          </>
        }
        results={
          <>
            <ResultHero
              label="Monthly Personal Loan Payment"
              value={fmtCurrency(res.monthlyPayment)}
              subtext={
                isAr
                  ? `صافي المبلغ المستلم: ${fmtCurrency(res.netProceeds)} · معدل الفائدة الفعلي: ${res.effectiveAprPercent.toFixed(2)}%`
                  : `Net Cash Proceeds: ${fmtCurrency(res.netProceeds)} · Effective APR: ${res.effectiveAprPercent.toFixed(2)}%`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Origination Fee" value={fmtCurrency(res.originationFeeAmount)} />
              <StatTile label="Total Interest" value={fmtCurrency(res.totalInterest)} />
              <StatTile label="Effective APR" value={`${res.effectiveAprPercent.toFixed(2)}%`} />
            </div>
            <ResultActions
              copyText={`Personal Loan: ${fmtCurrency(res.monthlyPayment)}/mo | Net Proceeds: ${fmtCurrency(res.netProceeds)} | Effective APR: ${res.effectiveAprPercent.toFixed(2)}%`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'compound-interest-calculator' || slug === 'savings-calculator' || slug === 'investment-calculator') {
    const compRes =
      slug === 'investment-calculator'
        ? null
        : calculateCompoundInterest({
            principal: parseFloat(principal) || 0,
            monthlyContribution: parseFloat(monthlyContrib) || 0,
            annualRatePercent: parseFloat(annualRate) || 0,
            years: parseFloat(yearsHorizon) || 1,
            compoundingFrequency: slug === 'savings-calculator' ? 'monthly' : compFreq,
            taxRatePercent: slug === 'savings-calculator' ? parseFloat(taxDrag) || 0 : 0,
          });

    const invRes =
      slug === 'investment-calculator'
        ? calculateInvestment({
            startingAmount: parseFloat(principal) || 0,
            additionalContribution: parseFloat(monthlyContrib) || 0,
            contributionFrequency: invFreq,
            annualReturnPercent: parseFloat(annualRate) || 0,
            years: parseFloat(yearsHorizon) || 1,
            inflationRatePercent: parseFloat(invInflation) || 0,
          })
        : null;

    const schedule = compRes ? compRes.yearlySchedule : invRes!.yearlySchedule;
    const futureVal = compRes ? compRes.futureValue : invRes!.futureValue;
    const totalContrib = compRes
      ? compRes.totalPrincipal + compRes.totalContributions
      : invRes!.totalContributions;
    const totalInterest = compRes ? compRes.totalInterest : invRes!.totalGain;

    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Starting Principal" prefix="$" value={principal} onChange={setPrincipal} min={0} />
            <NumberInput
              label={slug === 'investment-calculator' && invFreq === 'annually' ? 'Annual Contribution' : 'Monthly Contribution'}
              prefix="$"
              value={monthlyContrib}
              onChange={setMonthlyContrib}
              min={0}
            />
            {slug === 'investment-calculator' && (
              <SegmentedControl
                label="Contribution Cadence"
                value={invFreq}
                onChange={setInvFreq}
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'annually', label: 'Annually' },
                ]}
              />
            )}
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Annual Rate / APY" suffix="%" value={annualRate} onChange={setAnnualRate} min={0} step="0.1" />
              <NumberInput label="Time Horizon" suffix="years" value={yearsHorizon} onChange={setYearsHorizon} min={1} max={60} step={1} />
            </div>
            {slug === 'compound-interest-calculator' && (
              <SelectInput
                label="Compounding Frequency"
                value={compFreq}
                onChange={(v) => setCompFreq(v as CompoundingFrequency)}
                options={[
                  { value: 'daily', label: 'Daily (365/yr)' },
                  { value: 'monthly', label: 'Monthly (12/yr)' },
                  { value: 'quarterly', label: 'Quarterly (4/yr)' },
                  { value: 'semiannually', label: 'Semiannually (2/yr)' },
                  { value: 'annually', label: 'Annually (1/yr)' },
                ]}
              />
            )}
            {slug === 'savings-calculator' && (
              <NumberInput label="Tax Rate on Interest (Optional)" suffix="%" value={taxDrag} onChange={setTaxDrag} min={0} max={55} />
            )}
            {slug === 'investment-calculator' && (
              <NumberInput label="Estimated Inflation" suffix="%" value={invInflation} onChange={setInvInflation} min={0} step="0.1" />
            )}
          </>
        }
        results={
          <>
            <ResultHero
              label="Projected Future Balance"
              value={fmtCurrency(futureVal)}
              accent="green"
              subtext={
                invRes
                  ? isAr
                    ? `القيمة المعدلة بالتضخم (بقوة الشراء الحالية): ${fmtCurrency(invRes.inflationAdjustedValue)}`
                    : `Inflation-Adjusted (Today's Dollars): ${fmtCurrency(invRes.inflationAdjustedValue)}`
                  : compRes && parseFloat(taxDrag) > 0
                  ? isAr
                    ? `القيمة بعد الضريبة: ${fmtCurrency(compRes.afterTaxValue)}`
                    : `After-Tax Value: ${fmtCurrency(compRes.afterTaxValue)}`
                  : isAr
                  ? `إجمالي رأس المال والمساهمات: ${fmtCurrency(totalContrib)}`
                  : `Total Principal & Contributions: ${fmtCurrency(totalContrib)}`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Total Contributed" value={fmtCurrency(totalContrib, 0)} />
              <StatTile label="Total Interest / Gain" value={fmtCurrency(totalInterest, 0)} />
              <StatTile label="Growth Multiple" value={totalContrib > 0 ? `${(futureVal / totalContrib).toFixed(2)}×` : '—'} />
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={schedule}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                  <Tooltip formatter={(v) => fmtCurrency(Number(v), 0)} />
                  <Area type="monotone" dataKey="endingBalance" name={isAr ? 'إجمالي الرصيد' : 'Total Balance'} stroke="#2563EB" fill="#DBEAFE" />
                  <Area type="monotone" dataKey="totalPrincipalAndContributions" name={isAr ? 'المساهمات' : 'Contributions'} stroke="#0F172A" fill="#E2E8F0" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <ResultActions
              copyText={`Future Balance: ${fmtCurrency(futureVal)} | Total Contributed: ${fmtCurrency(totalContrib)} | Total Interest: ${fmtCurrency(totalInterest)}`}
              csvData={{
                filename: `${slug}-projection.csv`,
                headers: ['Year', 'Starting Balance', 'Contributions', 'Interest Earned', 'Ending Balance'],
                rows: schedule.map((r) => [
                  r.year,
                  r.startingBalance.toFixed(2),
                  r.contributions.toFixed(2),
                  r.interestEarned.toFixed(2),
                  r.endingBalance.toFixed(2),
                ]),
              }}
            />
          </>
        }
      />
    );
  }

  if (slug === 'simple-interest-calculator') {
    const res = calculateSimpleInterest({
      principal: parseFloat(principal) || 0,
      annualRatePercent: parseFloat(annualRate) || 0,
      timeValue: parseFloat(yearsHorizon) || 0,
      timeUnit: simpleUnit,
    });
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Principal" prefix="$" value={principal} onChange={setPrincipal} min={0} />
            <NumberInput label="Annual Rate" suffix="%" value={annualRate} onChange={setAnnualRate} min={0} step="0.1" />
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Time" value={yearsHorizon} onChange={setYearsHorizon} min={0} />
              <SelectInput
                label="Unit"
                value={simpleUnit}
                onChange={(v) => setSimpleUnit(v as typeof simpleUnit)}
                options={[
                  { value: 'years', label: 'Years' },
                  { value: 'months', label: 'Months' },
                  { value: 'days', label: 'Days' },
                ]}
              />
            </div>
          </>
        }
        results={
          <>
            <ResultHero
              label="Total Balance (Principal + Interest)"
              value={fmtCurrency(res.totalAmount)}
              subtext={`${isAr ? 'الفائدة البسيطة المكتسبة:' : 'Simple Interest Earned:'} ${fmtCurrency(res.interestEarned)}`}
            />
            <ResultActions copyText={`Simple Interest: ${fmtCurrency(res.interestEarned)} | Total: ${fmtCurrency(res.totalAmount)}`} />
          </>
        }
      />
    );
  }

  if (slug === 'retirement-calculator') {
    const res = calculateRetirement({
      currentAge: parseFloat(retAgeNow) || 30,
      retirementAge: parseFloat(retAgeGoal) || 65,
      lifeExpectancy: parseFloat(retLifeExp) || 90,
      currentSavings: parseFloat(retSaved) || 0,
      monthlyContribution: parseFloat(retContrib) || 0,
      preRetirementReturnPercent: parseFloat(retPreReturn) || 7,
      postRetirementReturnPercent: parseFloat(retPostReturn) || 5,
      desiredAnnualIncome: parseFloat(retDesiredIncome) || 60000,
    });
    return (
      <CalcSplitLayout
        inputs={
          <>
            <div className="grid grid-cols-3 gap-2">
              <NumberInput label="Age" value={retAgeNow} onChange={setRetAgeNow} min={18} max={85} />
              <NumberInput label="Retire" value={retAgeGoal} onChange={setRetAgeGoal} min={25} max={90} />
              <NumberInput label="Life Exp" value={retLifeExp} onChange={setRetLifeExp} min={50} max={110} />
            </div>
            <NumberInput label="Current Retirement Savings" prefix="$" value={retSaved} onChange={setRetSaved} min={0} />
            <NumberInput label="Monthly Contribution" prefix="$" value={retContrib} onChange={setRetContrib} min={0} />
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Pre-Ret Return" suffix="%" value={retPreReturn} onChange={setRetPreReturn} min={0} step="0.25" />
              <NumberInput label="In-Ret Return" suffix="%" value={retPostReturn} onChange={setRetPostReturn} min={0} step="0.25" />
            </div>
            <NumberInput label="Desired Annual Income" prefix="$" value={retDesiredIncome} onChange={setRetDesiredIncome} min={0} />
          </>
        }
        results={
          <>
            <ResultHero
              label={isAr ? `رصيد التقاعد المتوقع عند عمر ${retAgeGoal}` : `Projected Nest Egg at Age ${retAgeGoal}`}
              value={fmtCurrency(res.projectedNestEgg, 0)}
              accent={res.surplusOrShortfall >= 0 ? 'green' : 'blue'}
              subtext={
                isAr
                  ? `يدعم ${fmtCurrency(res.sustainableMonthlyIncome, 0)}/شهر · ${
                      res.surplusOrShortfall >= 0
                        ? `فائض قدره ${fmtCurrency(res.surplusOrShortfall, 0)}`
                        : `عجز قدره ${fmtCurrency(Math.abs(res.surplusOrShortfall), 0)}`
                    }`
                  : `Supports ${fmtCurrency(res.sustainableMonthlyIncome, 0)}/mo · ${
                      res.surplusOrShortfall >= 0
                        ? `Surplus of ${fmtCurrency(res.surplusOrShortfall, 0)}`
                        : `Shortfall of ${fmtCurrency(Math.abs(res.surplusOrShortfall), 0)}`
                    }`
              }
            />
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={res.projectionRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="age" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                  <Tooltip formatter={(v) => fmtCurrency(Number(v), 0)} />
                  <Area type="monotone" dataKey="balance" name={isAr ? 'رصيد المحفظة' : 'Portfolio Balance'} stroke="#2563EB" fill="#DBEAFE" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <ResultActions
              copyText={`Projected Nest Egg at ${retAgeGoal}: ${fmtCurrency(res.projectedNestEgg, 0)} | Sustainable Monthly Income: ${fmtCurrency(res.sustainableMonthlyIncome, 0)}`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'credit-card-payoff-calculator') {
    const res = calculateCreditCardPayoff({
      balance: parseFloat(ccBalance) || 0,
      aprPercent: parseFloat(ccApr) || 0,
      monthlyPayment: parseFloat(ccMonthly) || 0,
    });
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Current Card Balance" prefix="$" value={ccBalance} onChange={setCcBalance} min={0} />
            <NumberInput label="Credit Card APR" suffix="%" value={ccApr} onChange={setCcApr} min={0} step="0.1" />
            <NumberInput label="Planned Monthly Payment" prefix="$" value={ccMonthly} onChange={setCcMonthly} min={0} />
          </>
        }
        results={
          res.isPaymentInsufficient ? (
            <ErrorAlert
              message={
                isAr
                  ? `الدفعة الشهرية لا تغطي الفائدة الشهرية. ارفع الدفعة فوق ${fmtCurrency(res.minimumRequiredPayment)} لتخفيض أصل الدين.`
                  : `Monthly payment does not cover monthly interest charges. Increase payment above ${fmtCurrency(res.minimumRequiredPayment)} to reduce principal.`
              }
            />
          ) : (
            <>
              <ResultHero
                label="Time to Pay Off Balance"
                value={
                  isAr
                    ? `${res.monthsToPayoff} شهراً (${res.yearsToPayoff.toFixed(1)} سنة)`
                    : `${res.monthsToPayoff} months (${res.yearsToPayoff.toFixed(1)} yrs)`
                }
                subtext={
                  isAr
                    ? `إجمالي الفائدة المدفوعة: ${fmtCurrency(res.totalInterest)} · إجمالي المدفوع: ${fmtCurrency(res.totalPaid)}`
                    : `Total Interest Paid: ${fmtCurrency(res.totalInterest)} · Total Paid: ${fmtCurrency(res.totalPaid)}`
                }
              />
              <ResultActions
                copyText={`Credit Card Payoff: ${res.monthsToPayoff} months | Total Interest: ${fmtCurrency(res.totalInterest)}`}
              />
            </>
          )
        }
      />
    );
  }

  if (slug === 'debt-payoff-calculator') {
    const res = calculateDebtPayoff(debts, parseFloat(debtExtra) || 0);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <div className="space-y-2.5">
              {debts.map((d) => (
                <div key={d.id} className="rounded-lg border border-[#E2E8F0] p-2.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={d.name}
                      onChange={(e) =>
                        setDebts((prev) => prev.map((x) => (x.id === d.id ? { ...x, name: e.target.value } : x)))
                      }
                      className="text-xs font-semibold text-[#0F172A] bg-transparent border-b border-transparent focus:border-[#2563EB] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setDebts((prev) => prev.filter((x) => x.id !== d.id))}
                      disabled={debts.length <= 1}
                      className="text-[#94A3B8] hover:text-[#DC2626] disabled:opacity-30"
                      aria-label="Delete debt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <NumberInput
                      label="Bal ($)"
                      value={d.balance}
                      onChange={(v) =>
                        setDebts((prev) =>
                          prev.map((x) => (x.id === d.id ? { ...x, balance: parseFloat(v) || 0 } : x))
                        )
                      }
                    />
                    <NumberInput
                      label="APR (%)"
                      value={d.aprPercent}
                      onChange={(v) =>
                        setDebts((prev) =>
                          prev.map((x) => (x.id === d.id ? { ...x, aprPercent: parseFloat(v) || 0 } : x))
                        )
                      }
                    />
                    <NumberInput
                      label="Min ($)"
                      value={d.minPayment}
                      onChange={(v) =>
                        setDebts((prev) =>
                          prev.map((x) => (x.id === d.id ? { ...x, minPayment: parseFloat(v) || 0 } : x))
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setDebts((prev) => [
                    ...prev,
                    { id: String(Date.now()), name: isAr ? `دين ${prev.length + 1}` : `Debt ${prev.length + 1}`, balance: 3000, aprPercent: 15, minPayment: 90 },
                  ])
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة دين' : 'Add Debt'}</span>
              </button>
            </div>
            <NumberInput label="Extra Monthly Rollover Budget" prefix="$" value={debtExtra} onChange={setDebtExtra} min={0} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Debt-Free Timeline (Avalanche vs. Snowball)"
              value={isAr ? `${res.avalanche.monthsToPayoff} شهراً` : `${res.avalanche.monthsToPayoff} months`}
              accent="green"
              subtext={
                isAr
                  ? `طريقة الانهيار الجليدي توفر ${fmtCurrency(res.interestSavedWithAvalanche)} فائدة إضافية مقارنة بطريقة كرة الثلج`
                  : `Avalanche saves ${fmtCurrency(res.interestSavedWithAvalanche)} more interest than Snowball`
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#2563EB] bg-[#EFF6FF] p-3.5">
                <p className="text-xs font-semibold text-[#1D4ED8]">
                  {isAr ? 'الانهيار الجليدي (أعلى فائدة أولاً)' : 'Debt Avalanche (Highest APR First)'}
                </p>
                <p className="mt-1 font-mono-tabular text-lg font-bold text-[#0F172A]">
                  {res.avalanche.monthsToPayoff} {isAr ? 'شهر' : 'months'} · {fmtCurrency(res.avalanche.totalInterest)} {isAr ? 'فائدة' : 'int.'}
                </p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                <p className="text-xs font-semibold text-[#475569]">
                  {isAr ? 'كرة الثلج (أقل رصيد أولاً)' : 'Debt Snowball (Smallest Balance First)'}
                </p>
                <p className="mt-1 font-mono-tabular text-lg font-bold text-[#0F172A]">
                  {res.snowball.monthsToPayoff} {isAr ? 'شهر' : 'months'} · {fmtCurrency(res.snowball.totalInterest)} {isAr ? 'فائدة' : 'int.'}
                </p>
              </div>
            </div>
            <ResultActions
              copyText={`Avalanche: ${res.avalanche.monthsToPayoff} mos (${fmtCurrency(res.avalanche.totalInterest)} interest) | Snowball: ${res.snowball.monthsToPayoff} mos (${fmtCurrency(res.snowball.totalInterest)} interest)`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'amortization-calculator') {
    const res = calculateAmortizationWithExtra({
      loanAmount: parseFloat(loanAmt) || 0,
      interestRatePercent: parseFloat(loanRate) || 0,
      loanTermYears: parseFloat(loanYears) || 1,
      extraMonthlyPayment: parseFloat(extraMonthly) || 0,
    });
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Loan Amount" prefix="$" value={loanAmt} onChange={setLoanAmt} min={0} />
            <NumberInput label="Interest Rate" suffix="%" value={loanRate} onChange={setLoanRate} min={0} step="0.1" />
            <NumberInput label="Loan Term" suffix="years" value={loanYears} onChange={setLoanYears} min={1} max={40} />
            <NumberInput label="Extra Monthly Principal Payment" prefix="$" value={extraMonthly} onChange={setExtraMonthly} min={0} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Monthly Payment + Extra Principal"
              value={fmtCurrency(res.standardMonthlyPayment + (parseFloat(extraMonthly) || 0))}
              accent="green"
              subtext={
                isAr
                  ? `الفائدة الموفرة: ${fmtCurrency(res.interestSaved)} · السداد مبكراً بـ ${res.monthsSaved} شهراً`
                  : `Interest Saved: ${fmtCurrency(res.interestSaved)} · Paid off ${res.monthsSaved} months early`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Standard Interest" value={fmtCurrency(res.standardTotalInterest, 0)} />
              <StatTile label="Accelerated Interest" value={fmtCurrency(res.acceleratedTotalInterest, 0)} />
              <StatTile label="Payoff Months" value={`${res.acceleratedMonths} / ${res.standardMonths}`} />
            </div>
            <ResultActions
              copyText={`Amortization with $${extraMonthly}/mo extra: saves ${fmtCurrency(res.interestSaved)} and ${res.monthsSaved} months`}
              csvData={{
                filename: 'amortization-schedule.csv',
                headers: ['Month', 'Year', 'Payment', 'Principal', 'Interest', 'Extra', 'Balance'],
                rows: res.schedule.map((r) => [
                  r.month,
                  r.year,
                  r.payment.toFixed(2),
                  r.principal.toFixed(2),
                  r.interest.toFixed(2),
                  (r.extraPayment || 0).toFixed(2),
                  r.balance.toFixed(2),
                ]),
              }}
            />
          </>
        }
      />
    );
  }

  if (slug === 'interest-rate-calculator') {
    const months = Math.max(1, Math.round((parseFloat(loanYears) || 1) * 12));
    const principalVal = parseFloat(loanAmt) || 0;
    const payVal = parseFloat(targetMonthlyPay) || 0;
    const impliedApr = solveInterestRate(principalVal, payVal, months);
    const totalPaid = payVal * months;
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Loan Principal" prefix="$" value={loanAmt} onChange={setLoanAmt} min={1} />
            <NumberInput label="Monthly Payment" prefix="$" value={targetMonthlyPay} onChange={setTargetMonthlyPay} min={1} />
            <NumberInput label="Loan Term" suffix="years" value={loanYears} onChange={setLoanYears} min={0.5} />
          </>
        }
        results={
          totalPaid < principalVal ? (
            <ErrorAlert message="Total payments (Monthly × Months) are less than the loan principal." />
          ) : (
            <>
              <ResultHero
                label="Implied Annual Interest Rate (APR)"
                value={`${impliedApr.toFixed(3)}%`}
                subtext={
                  isAr
                    ? `إجمالي المدفوع: ${fmtCurrency(totalPaid)} · إجمالي الفائدة: ${fmtCurrency(totalPaid - principalVal)}`
                    : `Total Paid: ${fmtCurrency(totalPaid)} · Total Interest: ${fmtCurrency(totalPaid - principalVal)}`
                }
              />
              <ResultActions copyText={`Implied APR: ${impliedApr.toFixed(3)}% on ${fmtCurrency(principalVal)} @ ${fmtCurrency(payVal)}/mo`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'inflation-calculator') {
    const res = calculateInflation(parseFloat(infAmount) || 0, parseFloat(infRate) || 0, parseFloat(infYears) || 1);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Amount in Today's Dollars" prefix="$" value={infAmount} onChange={setInfAmount} min={0} />
            <NumberInput label="Annual Inflation Rate" suffix="%" value={infRate} onChange={setInfRate} step="0.1" />
            <NumberInput label="Years" suffix="yrs" value={infYears} onChange={setInfYears} min={1} max={80} />
          </>
        }
        results={
          <>
            <ResultHero
              label={isAr ? `التكلفة المستقبلية بعد ${infYears} سنة` : `Future Cost in ${infYears} Years`}
              value={fmtCurrency(res.futureEquivalent)}
              subtext={
                isAr
                  ? `القوة الشرائية لـ ${fmtCurrency(parseFloat(infAmount) || 0)} تنخفض إلى ${fmtCurrency(res.purchasingPowerOfOriginal)} (-${res.purchasingPowerLossPercent.toFixed(1)}%)`
                  : `Purchasing power of ${fmtCurrency(parseFloat(infAmount) || 0)} drops to ${fmtCurrency(res.purchasingPowerOfOriginal)} (-${res.purchasingPowerLossPercent.toFixed(1)}%)`
              }
            />
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={res.yearlyRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => fmtCurrency(Number(v))} />
                  <Area type="monotone" dataKey="futureCost" name={isAr ? 'التكلفة المستقبلية المكافئة' : 'Future Equivalent Cost'} stroke="#2563EB" fill="#DBEAFE" />
                  <Area type="monotone" dataKey="purchasingPower" name={isAr ? 'القوة الشرائية' : 'Purchasing Power'} stroke="#DC2626" fill="#FEE2E2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <ResultActions copyText={`After ${infYears} yrs at ${infRate}% inflation: ${fmtCurrency(res.futureEquivalent)} future cost`} />
          </>
        }
      />
    );
  }

  if (slug === 'salary-calculator') {
    const res = calculateSalary(
      parseFloat(salAmount) || 0,
      salPeriod,
      parseFloat(salHours) || 40,
      5,
      parseFloat(salWeeks) || 52
    );
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Pay Amount" prefix="$" value={salAmount} onChange={setSalAmount} min={0} />
            <SelectInput
              label="Pay Frequency"
              value={salPeriod}
              onChange={(v) => setSalPeriod(v as SalaryPeriod)}
              options={[
                { value: 'hourly', label: 'Hourly' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'biweekly', label: 'Biweekly (26/yr)' },
                { value: 'semimonthly', label: 'Semi-Monthly (24/yr)' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'annual', label: 'Annual' },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Hours / Week" value={salHours} onChange={setSalHours} min={1} max={100} />
              <NumberInput label="Weeks / Year" value={salWeeks} onChange={setSalWeeks} min={1} max={52} />
            </div>
          </>
        }
        results={
          <>
            <ResultHero label="Annual Gross Salary" value={fmtCurrency(res.annual)} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <StatTile label="Hourly" value={fmtCurrency(res.hourly)} />
              <StatTile label="Daily" value={fmtCurrency(res.daily)} />
              <StatTile label="Weekly" value={fmtCurrency(res.weekly)} />
              <StatTile label="Biweekly" value={fmtCurrency(res.biweekly)} />
              <StatTile label="Semi-Monthly" value={fmtCurrency(res.semimonthly)} />
              <StatTile label="Monthly" value={fmtCurrency(res.monthly)} />
            </div>
            <ResultActions copyText={`Annual: ${fmtCurrency(res.annual)} | Monthly: ${fmtCurrency(res.monthly)} | Hourly: ${fmtCurrency(res.hourly)}`} />
          </>
        }
      />
    );
  }

  if (slug === 'income-tax-calculator') {
    const res = calculateIncomeTax({
      grossIncome: parseFloat(taxGross) || 0,
      filingStatus,
      preTaxDeductions: parseFloat(preTax401k) || 0,
      stateTaxRatePercent: parseFloat(stateTaxPct) || 0,
    });
    const chartData = [
      { name: isAr ? 'الضريبة الفيدرالية' : 'Federal Tax', amount: Math.round(res.federalTax) },
      { name: 'FICA', amount: Math.round(res.socialSecurityTax + res.medicareTax) },
      { name: isAr ? 'ضريبة الولاية' : 'State Tax', amount: Math.round(res.stateTax) },
      { name: isAr ? 'صافي الدخل' : 'Take-Home', amount: Math.round(res.takeHomeAnnual) },
    ];
    return (
      <CalcSplitLayout
        inputs={
          <>
            <SelectInput
              label="Filing Status"
              value={filingStatus}
              onChange={(v) => setFilingStatus(v as FilingStatus)}
              options={[
                { value: 'single', label: 'Single' },
                { value: 'married_joint', label: 'Married Filing Jointly' },
                { value: 'head_of_household', label: 'Head of Household' },
              ]}
            />
            <NumberInput label="Gross Annual Income" prefix="$" value={taxGross} onChange={setTaxGross} min={0} />
            <NumberInput label="Pre-Tax 401(k) / HSA" prefix="$" value={preTax401k} onChange={setPreTax401k} min={0} />
            <NumberInput label="State Income Tax Rate" suffix="%" value={stateTaxPct} onChange={setStateTaxPct} min={0} step="0.25" />
          </>
        }
        results={
          <>
            <ResultHero
              label="Estimated Annual Take-Home Pay"
              value={fmtCurrency(res.takeHomeAnnual, 0)}
              accent="green"
              subtext={
                isAr
                  ? `${fmtCurrency(res.takeHomeMonthly, 0)}/شهر · المعدل الفعلي: ${res.effectiveTaxRatePercent.toFixed(1)}% · الشريحة الحدية: ${res.marginalBracketPercent}%`
                  : `${fmtCurrency(res.takeHomeMonthly, 0)}/mo · Effective Rate: ${res.effectiveTaxRatePercent.toFixed(1)}% · Marginal: ${res.marginalBracketPercent}%`
              }
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <StatTile label="Federal Tax" value={fmtCurrency(res.federalTax, 0)} />
              <StatTile label="Social Security" value={fmtCurrency(res.socialSecurityTax, 0)} />
              <StatTile label="Medicare" value={fmtCurrency(res.medicareTax, 0)} />
              <StatTile label="State Tax" value={fmtCurrency(res.stateTax, 0)} />
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                  <Tooltip formatter={(v) => fmtCurrency(Number(v), 0)} />
                  <Bar dataKey="amount" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ResultActions
              copyText={`Gross: ${fmtCurrency(res.grossIncome, 0)} | Take-Home: ${fmtCurrency(res.takeHomeAnnual, 0)} | Effective Tax: ${res.effectiveTaxRatePercent.toFixed(1)}%`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'budget-calculator') {
    const res = calculateBudget({
      monthlyIncome: parseFloat(bIncome) || 0,
      housing: parseFloat(bHousing) || 0,
      utilities: parseFloat(bUtils) || 0,
      food: parseFloat(bFood) || 0,
      transportation: parseFloat(bTrans) || 0,
      healthcare: parseFloat(bHealth) || 0,
      debtPayments: parseFloat(bDebt) || 0,
      savingsAndInvesting: parseFloat(bSavings) || 0,
      entertainmentAndOther: parseFloat(bWants) || 0,
    });
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Monthly Net Income" prefix="$" value={bIncome} onChange={setBIncome} min={0} />
            <div className="grid grid-cols-2 gap-2.5">
              <NumberInput label="Housing" prefix="$" value={bHousing} onChange={setBHousing} min={0} />
              <NumberInput label="Utilities" prefix="$" value={bUtils} onChange={setBUtils} min={0} />
              <NumberInput label="Food & Groceries" prefix="$" value={bFood} onChange={setBFood} min={0} />
              <NumberInput label="Transportation" prefix="$" value={bTrans} onChange={setBTrans} min={0} />
              <NumberInput label="Healthcare" prefix="$" value={bHealth} onChange={setBHealth} min={0} />
              <NumberInput label="Debt Minimums" prefix="$" value={bDebt} onChange={setBDebt} min={0} />
              <NumberInput label="Savings & Investing" prefix="$" value={bSavings} onChange={setBSavings} min={0} />
              <NumberInput label="Wants / Dining" prefix="$" value={bWants} onChange={setBWants} min={0} />
            </div>
          </>
        }
        results={
          <>
            <ResultHero
              label={res.unallocated >= 0 ? 'Monthly Unallocated Surplus' : 'Monthly Budget Deficit'}
              value={fmtCurrency(res.unallocated)}
              accent={res.unallocated >= 0 ? 'green' : 'blue'}
              subtext={
                isAr
                  ? `الاحتياجات: ${res.needsPercent.toFixed(1)}% (الهدف 50%) · الكماليات: ${res.wantsPercent.toFixed(1)}% (30%) · الادخار: ${res.savingsPercent.toFixed(1)}% (20%)`
                  : `Needs: ${res.needsPercent.toFixed(1)}% (50% target) · Wants: ${res.wantsPercent.toFixed(1)}% (30%) · Savings: ${res.savingsPercent.toFixed(1)}% (20%)`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Needs" value={fmtCurrency(res.needs, 0)} />
              <StatTile label="Wants" value={fmtCurrency(res.wants, 0)} />
              <StatTile label="Savings" value={fmtCurrency(res.savings, 0)} />
            </div>
            <ResultActions
              copyText={`Monthly Budget: Needs ${res.needsPercent.toFixed(1)}%, Wants ${res.wantsPercent.toFixed(1)}%, Savings ${res.savingsPercent.toFixed(1)}%, Surplus ${fmtCurrency(res.unallocated)}`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'net-worth-calculator') {
    const res = calculateNetWorth({
      cashAndChecking: parseFloat(nwCash) || 0,
      investments: parseFloat(nwInv) || 0,
      retirementAccounts: parseFloat(nwRet) || 0,
      realEstate: parseFloat(nwHome) || 0,
      vehiclesAndOtherAssets: parseFloat(nwVeh) || 0,
      mortgageBalance: parseFloat(nwMort) || 0,
      autoLoans: parseFloat(nwAuto) || 0,
      studentLoans: parseFloat(nwStud) || 0,
      creditCardDebt: parseFloat(nwCard) || 0,
      otherLiabilities: parseFloat(nwOtherL) || 0,
    });
    return (
      <CalcSplitLayout
        inputs={
          <>
            <p className="text-xs font-semibold text-[#16A34A]">{isAr ? 'الأصول' : 'Assets'}</p>
            <div className="grid grid-cols-2 gap-2.5">
              <NumberInput label="Cash & Bank" prefix="$" value={nwCash} onChange={setNwCash} min={0} />
              <NumberInput label="Brokerage" prefix="$" value={nwInv} onChange={setNwInv} min={0} />
              <NumberInput label="Retirement" prefix="$" value={nwRet} onChange={setNwRet} min={0} />
              <NumberInput label="Real Estate" prefix="$" value={nwHome} onChange={setNwHome} min={0} />
              <NumberInput label="Vehicles & Other" prefix="$" value={nwVeh} onChange={setNwVeh} min={0} />
            </div>
            <p className="text-xs font-semibold text-[#DC2626] pt-2">{isAr ? 'الالتزامات' : 'Liabilities'}</p>
            <div className="grid grid-cols-2 gap-2.5">
              <NumberInput label="Mortgage" prefix="$" value={nwMort} onChange={setNwMort} min={0} />
              <NumberInput label="Auto Loans" prefix="$" value={nwAuto} onChange={setNwAuto} min={0} />
              <NumberInput label="Student Loans" prefix="$" value={nwStud} onChange={setNwStud} min={0} />
              <NumberInput label="Credit Cards" prefix="$" value={nwCard} onChange={setNwCard} min={0} />
              <NumberInput label="Other Debt" prefix="$" value={nwOtherL} onChange={setNwOtherL} min={0} />
            </div>
          </>
        }
        results={
          <>
            <ResultHero
              label="Total Personal Net Worth"
              value={fmtCurrency(res.netWorth, 0)}
              accent={res.netWorth >= 0 ? 'green' : 'blue'}
              subtext={`${isAr ? 'نسبة الدين إلى الأصول:' : 'Debt-to-Asset Ratio:'} ${res.debtToAssetRatio.toFixed(1)}%`}
            />
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Total Assets" value={fmtCurrency(res.totalAssets, 0)} />
              <StatTile label="Total Liabilities" value={fmtCurrency(res.totalLiabilities, 0)} />
            </div>
            <ResultActions
              copyText={`Net Worth: ${fmtCurrency(res.netWorth, 0)} (Assets: ${fmtCurrency(res.totalAssets, 0)}, Liabilities: ${fmtCurrency(res.totalLiabilities, 0)})`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'roi-calculator') {
    const res = calculateROI(parseFloat(roiInit) || 1, parseFloat(roiRet) || 0, parseFloat(roiYears) || 1);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Initial Investment" prefix="$" value={roiInit} onChange={setRoiInit} min={0.01} />
            <NumberInput label="Amount Returned" prefix="$" value={roiRet} onChange={setRoiRet} min={0} />
            <NumberInput label="Investment Duration" suffix="years" value={roiYears} onChange={setRoiYears} min={0.05} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Total Return on Investment (ROI)"
              value={`${res.roiPercent.toFixed(2)}%`}
              accent={res.netProfit >= 0 ? 'green' : 'blue'}
              subtext={
                isAr
                  ? `صافي الربح: ${fmtCurrency(res.netProfit)} · العائد السنوي المركب (CAGR): ${res.annualizedRoiPercent.toFixed(2)}%`
                  : `Net Profit: ${fmtCurrency(res.netProfit)} · Annualized ROI (CAGR): ${res.annualizedRoiPercent.toFixed(2)}%`
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Net Gain / Loss" value={fmtCurrency(res.netProfit)} />
              <StatTile label="Annualized CAGR" value={`${res.annualizedRoiPercent.toFixed(2)}%`} />
            </div>
            <ResultActions copyText={`ROI: ${res.roiPercent.toFixed(2)}% | CAGR: ${res.annualizedRoiPercent.toFixed(2)}% | Net Profit: ${fmtCurrency(res.netProfit)}`} />
          </>
        }
      />
    );
  }

  // Mortgage Refinance
  const refiRes = calculateMortgageRefinance({
    currentBalance: parseFloat(refiBal) || 0,
    currentRatePercent: parseFloat(refiOldRate) || 0,
    remainingYears: parseFloat(refiOldYears) || 1,
    newRatePercent: parseFloat(refiNewRate) || 0,
    newTermYears: parseFloat(refiNewYears) || 1,
    closingCosts: parseFloat(refiCosts) || 0,
  });

  return (
    <CalcSplitLayout
      inputs={
        <>
          <NumberInput label="Remaining Loan Balance" prefix="$" value={refiBal} onChange={setRefiBal} min={0} />
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Current Rate" suffix="%" value={refiOldRate} onChange={setRefiOldRate} min={0} step="0.05" />
            <NumberInput label="Years Remaining" suffix="yrs" value={refiOldYears} onChange={setRefiOldYears} min={1} />
            <NumberInput label="New Rate" suffix="%" value={refiNewRate} onChange={setRefiNewRate} min={0} step="0.05" />
            <NumberInput label="New Loan Term" suffix="yrs" value={refiNewYears} onChange={setRefiNewYears} min={1} />
          </div>
          <NumberInput label="Estimated Closing Costs" prefix="$" value={refiCosts} onChange={setRefiCosts} min={0} />
        </>
      }
      results={
        <>
          <ResultHero
            label="Monthly Payment Difference"
            value={
              refiRes.monthlySavings >= 0
                ? isAr
                  ? `توفير ${fmtCurrency(refiRes.monthlySavings)}/شهر`
                  : `Save ${fmtCurrency(refiRes.monthlySavings)}/mo`
                : `+${fmtCurrency(Math.abs(refiRes.monthlySavings))}${isAr ? '/شهر' : '/mo'}`
            }
            accent={refiRes.lifetimeSavings > 0 ? 'green' : 'blue'}
            subtext={
              isAr
                ? `نقطة التعادل: ${
                    Number.isFinite(refiRes.breakEvenMonths)
                      ? `${refiRes.breakEvenMonths.toFixed(1)} شهراً`
                      : 'لا يحقق تعادلاً شهرياً'
                  } · صافي التوفير الإجمالي: ${fmtCurrency(refiRes.lifetimeSavings, 0)}`
                : `Break-Even Point: ${
                    Number.isFinite(refiRes.breakEvenMonths)
                      ? `${refiRes.breakEvenMonths.toFixed(1)} months`
                      : 'Does not break even monthly'
                  } · Net Lifetime Savings: ${fmtCurrency(refiRes.lifetimeSavings, 0)}`
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Current P&I Payment" value={fmtCurrency(refiRes.currentMonthlyPayment)} />
            <StatTile label="New P&I Payment" value={fmtCurrency(refiRes.newMonthlyPayment)} />
            <StatTile label="Current Remaining Interest" value={fmtCurrency(refiRes.currentTotalInterest, 0)} />
            <StatTile label="New Total Interest" value={fmtCurrency(refiRes.newTotalInterest, 0)} />
          </div>
          <ResultActions
            copyText={`Refinance Savings: ${fmtCurrency(refiRes.monthlySavings)}/mo | Break-Even: ${refiRes.breakEvenMonths.toFixed(1)} mos | Lifetime Net Savings: ${fmtCurrency(refiRes.lifetimeSavings, 0)}`}
          />
        </>
      }
    />
  );
}
