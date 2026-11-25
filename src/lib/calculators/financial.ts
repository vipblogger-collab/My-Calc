export interface AmortizationRow {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment?: number;
  balance: number;
  totalInterestPaid: number;
}

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  downPaymentIsPercent?: boolean;
  loanTermYears: number;
  interestRatePercent: number;
  propertyTaxAnnual?: number;
  homeInsuranceAnnual?: number;
  pmiAnnualPercent?: number;
  hoaMonthly?: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalLoanCost: number;
  totalPaymentsCount: number;
  schedule: AmortizationRow[];
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const homePrice = Math.max(0, input.homePrice);
  const downPaymentAmount = input.downPaymentIsPercent
    ? Math.min(homePrice, Math.max(0, (homePrice * input.downPayment) / 100))
    : Math.min(homePrice, Math.max(0, input.downPayment));
  const loanAmount = Math.max(0, homePrice - downPaymentAmount);
  const downPaymentPercent = homePrice > 0 ? (downPaymentAmount / homePrice) * 100 : 0;
  const n = Math.max(1, Math.round(input.loanTermYears * 12));
  const annualRate = Math.max(0, input.interestRatePercent);
  const r = annualRate / 100 / 12;

  let monthlyPI = 0;
  if (loanAmount > 0) {
    if (r === 0) {
      monthlyPI = loanAmount / n;
    } else {
      const factor = Math.pow(1 + r, n);
      monthlyPI = (loanAmount * (r * factor)) / (factor - 1);
    }
  }

  const monthlyPropertyTax = Math.max(0, input.propertyTaxAnnual || 0) / 12;
  const monthlyHomeInsurance = Math.max(0, input.homeInsuranceAnnual || 0) / 12;
  const pmiRate = Math.max(0, input.pmiAnnualPercent ?? (downPaymentPercent < 20 ? 0.5 : 0));
  const monthlyPMI = downPaymentPercent < 20 && loanAmount > 0 ? (loanAmount * (pmiRate / 100)) / 12 : 0;
  const monthlyHOA = Math.max(0, input.hoaMonthly || 0);

  const schedule: AmortizationRow[] = [];
  let balance = loanAmount;
  let totalInterestPaid = 0;

  for (let m = 1; m <= n && balance > 0.005; m++) {
    const interest = balance * r;
    let principal = monthlyPI - interest;
    if (principal > balance || m === n) {
      principal = balance;
    }
    const payment = principal + interest;
    balance = Math.max(0, balance - principal);
    totalInterestPaid += interest;
    schedule.push({
      month: m,
      year: Math.ceil(m / 12),
      payment,
      principal,
      interest,
      balance,
      totalInterestPaid,
    });
  }

  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + monthlyHOA;

  return {
    loanAmount,
    downPaymentAmount,
    downPaymentPercent,
    monthlyPrincipalAndInterest: monthlyPI,
    monthlyPropertyTax,
    monthlyHomeInsurance,
    monthlyPMI,
    monthlyHOA,
    totalMonthlyPayment,
    totalInterest: totalInterestPaid,
    totalLoanCost: loanAmount + totalInterestPaid,
    totalPaymentsCount: schedule.length,
    schedule,
  };
}

export type PaymentFrequency = 'monthly' | 'biweekly' | 'weekly';

export interface LoanInput {
  loanAmount: number;
  interestRatePercent: number;
  loanTermYears: number;
  frequency?: PaymentFrequency;
}

export interface LoanResult {
  periodicPayment: number;
  monthlyEquivalent: number;
  totalInterest: number;
  totalCost: number;
  periodsCount: number;
  schedule: AmortizationRow[];
}

export function calculateLoan(input: LoanInput): LoanResult {
  const principal = Math.max(0, input.loanAmount);
  const annualRate = Math.max(0, input.interestRatePercent) / 100;
  const years = Math.max(0.1, input.loanTermYears);
  const freq = input.frequency || 'monthly';
  const periodsPerYear = freq === 'weekly' ? 52 : freq === 'biweekly' ? 26 : 12;
  const totalPeriods = Math.max(1, Math.round(years * periodsPerYear));
  const r = annualRate / periodsPerYear;

  let periodicPayment = 0;
  if (principal > 0) {
    if (r === 0) {
      periodicPayment = principal / totalPeriods;
    } else {
      const f = Math.pow(1 + r, totalPeriods);
      periodicPayment = (principal * (r * f)) / (f - 1);
    }
  }

  let balance = principal;
  let totalInterest = 0;
  const schedule: AmortizationRow[] = [];
  for (let p = 1; p <= totalPeriods && balance > 0.005; p++) {
    const interest = balance * r;
    let princ = periodicPayment - interest;
    if (princ > balance || p === totalPeriods) {
      princ = balance;
    }
    const payment = princ + interest;
    balance = Math.max(0, balance - princ);
    totalInterest += interest;
    schedule.push({
      month: p,
      year: Math.ceil(p / periodsPerYear),
      payment,
      principal: princ,
      interest,
      balance,
      totalInterestPaid: totalInterest,
    });
  }

  const monthlyEquivalent = (periodicPayment * periodsPerYear) / 12;

  return {
    periodicPayment,
    monthlyEquivalent,
    totalInterest,
    totalCost: principal + totalInterest,
    periodsCount: schedule.length,
    schedule,
  };
}

export interface AutoLoanInput {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPercent: number;
  loanTermMonths: number;
  interestRatePercent: number;
  fees?: number;
}

export interface AutoLoanResult {
  taxAmount: number;
  totalLoanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  upfrontPayment: number;
  schedule: AmortizationRow[];
}

export function calculateAutoLoan(input: AutoLoanInput): AutoLoanResult {
  const price = Math.max(0, input.vehiclePrice);
  const down = Math.max(0, input.downPayment);
  const tradeIn = Math.max(0, input.tradeInValue);
  const fees = Math.max(0, input.fees || 0);
  const taxableAmount = Math.max(0, price - tradeIn);
  const taxAmount = taxableAmount * (Math.max(0, input.salesTaxPercent) / 100);
  const totalLoanAmount = Math.max(0, price - tradeIn - down + taxAmount + fees);
  const months = Math.max(1, Math.round(input.loanTermMonths));

  const loanRes = calculateLoan({
    loanAmount: totalLoanAmount,
    interestRatePercent: input.interestRatePercent,
    loanTermYears: months / 12,
    frequency: 'monthly',
  });

  return {
    taxAmount,
    totalLoanAmount,
    monthlyPayment: loanRes.periodicPayment,
    totalInterest: loanRes.totalInterest,
    totalCost: totalLoanAmount + loanRes.totalInterest + down + tradeIn,
    upfrontPayment: down + tradeIn,
    schedule: loanRes.schedule,
  };
}

export interface PersonalLoanInput {
  loanAmount: number;
  interestRatePercent: number;
  loanTermMonths: number;
  originationFeePercent: number;
}

export interface PersonalLoanResult {
  monthlyPayment: number;
  originationFeeAmount: number;
  netProceeds: number;
  totalInterest: number;
  totalCost: number;
  effectiveAprPercent: number;
  schedule: AmortizationRow[];
}

export function calculatePersonalLoan(input: PersonalLoanInput): PersonalLoanResult {
  const loanAmount = Math.max(0, input.loanAmount);
  const months = Math.max(1, Math.round(input.loanTermMonths));
  const feePct = Math.max(0, Math.min(50, input.originationFeePercent));
  const originationFeeAmount = (loanAmount * feePct) / 100;
  const netProceeds = Math.max(0, loanAmount - originationFeeAmount);

  const baseLoan = calculateLoan({
    loanAmount,
    interestRatePercent: input.interestRatePercent,
    loanTermYears: months / 12,
  });

  let effectiveAprPercent = input.interestRatePercent;
  if (netProceeds > 0 && baseLoan.periodicPayment > 0) {
    effectiveAprPercent = solveInterestRate(netProceeds, baseLoan.periodicPayment, months);
  }

  return {
    monthlyPayment: baseLoan.periodicPayment,
    originationFeeAmount,
    netProceeds,
    totalInterest: baseLoan.totalInterest,
    totalCost: loanAmount + baseLoan.totalInterest,
    effectiveAprPercent,
    schedule: baseLoan.schedule,
  };
}

export type CompoundingFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily';

export function getCompoundingPeriods(freq: CompoundingFrequency): number {
  switch (freq) {
    case 'annually':
      return 1;
    case 'semiannually':
      return 2;
    case 'quarterly':
      return 4;
    case 'daily':
      return 365;
    case 'monthly':
    default:
      return 12;
  }
}

export interface CompoundInterestInput {
  principal: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
  compoundingFrequency: CompoundingFrequency;
  taxRatePercent?: number;
}

export interface GrowthRow {
  year: number;
  startingBalance: number;
  contributions: number;
  interestEarned: number;
  endingBalance: number;
  totalPrincipalAndContributions: number;
  totalInterest: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalPrincipal: number;
  totalContributions: number;
  totalInterest: number;
  afterTaxValue: number;
  yearlySchedule: GrowthRow[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const principal = Math.max(0, input.principal);
  const monthlyContrib = Math.max(0, input.monthlyContribution);
  const annualRate = Math.max(0, input.annualRatePercent) / 100;
  const years = Math.max(1, Math.min(100, Math.round(input.years)));
  const n = getCompoundingPeriods(input.compoundingFrequency);
  const effectiveMonthlyRate = Math.pow(1 + annualRate / n, n / 12) - 1;

  let balance = principal;
  let totalContributions = 0;
  let totalInterest = 0;
  const yearlySchedule: GrowthRow[] = [];

  for (let y = 1; y <= years; y++) {
    const startBal = balance;
    let yearContrib = 0;
    let yearInterest = 0;

    for (let m = 1; m <= 12; m++) {
      const interest = balance * effectiveMonthlyRate;
      balance += interest + monthlyContrib;
      yearContrib += monthlyContrib;
      yearInterest += interest;
    }

    totalContributions += yearContrib;
    totalInterest += yearInterest;

    yearlySchedule.push({
      year: y,
      startingBalance: startBal,
      contributions: yearContrib,
      interestEarned: yearInterest,
      endingBalance: balance,
      totalPrincipalAndContributions: principal + totalContributions,
      totalInterest,
    });
  }

  const taxRate = Math.max(0, Math.min(100, input.taxRatePercent || 0)) / 100;
  const afterTaxValue = balance - totalInterest * taxRate;

  return {
    futureValue: balance,
    totalPrincipal: principal,
    totalContributions,
    totalInterest,
    afterTaxValue,
    yearlySchedule,
  };
}

export interface SimpleInterestInput {
  principal: number;
  annualRatePercent: number;
  timeValue: number;
  timeUnit: 'years' | 'months' | 'days';
}

export interface SimpleInterestResult {
  interestEarned: number;
  totalAmount: number;
  yearsEquivalent: number;
  yearlyBreakdown: { year: number; interest: number; total: number }[];
}

export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  const P = Math.max(0, input.principal);
  const r = Math.max(0, input.annualRatePercent) / 100;
  const yearsEquivalent =
    input.timeUnit === 'days'
      ? Math.max(0, input.timeValue) / 365
      : input.timeUnit === 'months'
      ? Math.max(0, input.timeValue) / 12
      : Math.max(0, input.timeValue);

  const interestEarned = P * r * yearsEquivalent;
  const totalAmount = P + interestEarned;
  const wholeYears = Math.max(1, Math.min(50, Math.ceil(yearsEquivalent)));
  const yearlyBreakdown: { year: number; interest: number; total: number }[] = [];

  for (let y = 1; y <= wholeYears; y++) {
    const t = Math.min(y, yearsEquivalent);
    const i = P * r * t;
    yearlyBreakdown.push({ year: y, interest: i, total: P + i });
  }

  return { interestEarned, totalAmount, yearsEquivalent, yearlyBreakdown };
}

export interface InvestmentInput {
  startingAmount: number;
  additionalContribution: number;
  contributionFrequency: 'monthly' | 'annually';
  annualReturnPercent: number;
  years: number;
  inflationRatePercent?: number;
}

export interface InvestmentResult {
  futureValue: number;
  inflationAdjustedValue: number;
  totalContributions: number;
  totalGain: number;
  yearlySchedule: GrowthRow[];
}

export function calculateInvestment(input: InvestmentInput): InvestmentResult {
  const monthlyEquivalent =
    input.contributionFrequency === 'annually'
      ? input.additionalContribution / 12
      : input.additionalContribution;

  const comp = calculateCompoundInterest({
    principal: input.startingAmount,
    monthlyContribution: monthlyEquivalent,
    annualRatePercent: input.annualReturnPercent,
    years: input.years,
    compoundingFrequency: 'monthly',
  });

  const inflation = Math.max(0, input.inflationRatePercent || 0) / 100;
  const inflationAdjustedValue = comp.futureValue / Math.pow(1 + inflation, Math.max(1, Math.round(input.years)));

  return {
    futureValue: comp.futureValue,
    inflationAdjustedValue,
    totalContributions: comp.totalPrincipal + comp.totalContributions,
    totalGain: comp.totalInterest,
    yearlySchedule: comp.yearlySchedule,
  };
}

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  preRetirementReturnPercent: number;
  postRetirementReturnPercent: number;
  desiredAnnualIncome: number;
  annualInflationPercent?: number;
}

export interface RetirementResult {
  yearsToRetirement: number;
  retirementYears: number;
  projectedNestEgg: number;
  requiredNestEgg: number;
  sustainableMonthlyIncome: number;
  surplusOrShortfall: number;
  projectionRows: { age: number; balance: number; phase: 'Accumulation' | 'Distribution' }[];
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const currentAge = Math.max(18, Math.min(90, Math.round(input.currentAge)));
  const retirementAge = Math.max(currentAge + 1, Math.min(95, Math.round(input.retirementAge)));
  const lifeExpectancy = Math.max(retirementAge + 1, Math.min(115, Math.round(input.lifeExpectancy)));
  const yearsToRetirement = retirementAge - currentAge;
  const retirementYears = lifeExpectancy - retirementAge;

  const acc = calculateCompoundInterest({
    principal: input.currentSavings,
    monthlyContribution: input.monthlyContribution,
    annualRatePercent: input.preRetirementReturnPercent,
    years: yearsToRetirement,
    compoundingFrequency: 'monthly',
  });

  const projectedNestEgg = acc.futureValue;
  const postR = Math.max(0, input.postRetirementReturnPercent) / 100 / 12;
  const retMonths = retirementYears * 12;

  let sustainableMonthlyIncome = 0;
  if (postR === 0) {
    sustainableMonthlyIncome = projectedNestEgg / retMonths;
  } else {
    sustainableMonthlyIncome = (projectedNestEgg * postR) / (1 - Math.pow(1 + postR, -retMonths));
  }

  const desiredMonthly = Math.max(0, input.desiredAnnualIncome) / 12;
  let requiredNestEgg = 0;
  if (postR === 0) {
    requiredNestEgg = desiredMonthly * retMonths;
  } else {
    requiredNestEgg = desiredMonthly * ((1 - Math.pow(1 + postR, -retMonths)) / postR);
  }

  const projectionRows: { age: number; balance: number; phase: 'Accumulation' | 'Distribution' }[] = [];
  acc.yearlySchedule.forEach((row) => {
    projectionRows.push({
      age: currentAge + row.year,
      balance: row.endingBalance,
      phase: 'Accumulation',
    });
  });

  let distBalance = projectedNestEgg;
  for (let y = 1; y <= retirementYears; y++) {
    for (let m = 1; m <= 12; m++) {
      distBalance = Math.max(0, distBalance * (1 + postR) - desiredMonthly);
    }
    projectionRows.push({
      age: retirementAge + y,
      balance: distBalance,
      phase: 'Distribution',
    });
  }

  return {
    yearsToRetirement,
    retirementYears,
    projectedNestEgg,
    requiredNestEgg,
    sustainableMonthlyIncome,
    surplusOrShortfall: projectedNestEgg - requiredNestEgg,
    projectionRows,
  };
}

export interface CreditCardPayoffInput {
  balance: number;
  aprPercent: number;
  monthlyPayment: number;
}

export interface CreditCardPayoffResult {
  monthsToPayoff: number;
  yearsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  isPaymentInsufficient: boolean;
  minimumRequiredPayment: number;
  schedule: AmortizationRow[];
}

export function calculateCreditCardPayoff(input: CreditCardPayoffInput): CreditCardPayoffResult {
  const balanceInit = Math.max(0, input.balance);
  const r = Math.max(0, input.aprPercent) / 100 / 12;
  const payment = Math.max(0, input.monthlyPayment);
  const firstMonthInterest = balanceInit * r;
  const minimumRequiredPayment = firstMonthInterest + Math.max(1, balanceInit * 0.01);

  if (balanceInit === 0) {
    return {
      monthsToPayoff: 0,
      yearsToPayoff: 0,
      totalInterest: 0,
      totalPaid: 0,
      isPaymentInsufficient: false,
      minimumRequiredPayment: 0,
      schedule: [],
    };
  }

  if (payment <= firstMonthInterest) {
    return {
      monthsToPayoff: Infinity,
      yearsToPayoff: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      isPaymentInsufficient: true,
      minimumRequiredPayment,
      schedule: [],
    };
  }

  let balance = balanceInit;
  let totalInterest = 0;
  let month = 0;
  const schedule: AmortizationRow[] = [];

  while (balance > 0.005 && month < 600) {
    month++;
    const interest = balance * r;
    const actualPayment = Math.min(payment, balance + interest);
    const principal = actualPayment - interest;
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    schedule.push({
      month,
      year: Math.ceil(month / 12),
      payment: actualPayment,
      principal,
      interest,
      balance,
      totalInterestPaid: totalInterest,
    });
  }

  return {
    monthsToPayoff: month,
    yearsToPayoff: month / 12,
    totalInterest,
    totalPaid: balanceInit + totalInterest,
    isPaymentInsufficient: false,
    minimumRequiredPayment,
    schedule,
  };
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  aprPercent: number;
  minPayment: number;
}

export interface DebtStrategyResult {
  strategy: 'avalanche' | 'snowball';
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  payoffOrder: { name: string; payoffMonth: number }[];
}

function simulateDebtStrategy(
  debts: DebtItem[],
  extraMonthly: number,
  strategy: 'avalanche' | 'snowball'
): DebtStrategyResult {
  const active = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d, paidOffMonth: 0 }));

  if (active.length === 0) {
    return { strategy, monthsToPayoff: 0, totalInterest: 0, totalPaid: 0, payoffOrder: [] };
  }

  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  while (active.some((d) => d.balance > 0.01) && month < 600) {
    month++;
    let availableExtra = Math.max(0, extraMonthly);

    // Accrue interest and pay minimums
    for (const d of active) {
      if (d.balance <= 0.01) continue;
      const interest = d.balance * (Math.max(0, d.aprPercent) / 100 / 12);
      d.balance += interest;
      totalInterest += interest;

      const minPay = Math.min(d.balance, Math.max(0, d.minPayment));
      d.balance -= minPay;
      totalPaid += minPay;
      if (d.minPayment > minPay) {
        availableExtra += d.minPayment - minPay;
      }
      if (d.balance <= 0.01) {
        d.balance = 0;
        if (d.paidOffMonth === 0) d.paidOffMonth = month;
      }
    }

    // Sort remaining debts by strategy
    const remaining = active
      .filter((d) => d.balance > 0.01)
      .sort((a, b) =>
        strategy === 'avalanche' ? b.aprPercent - a.aprPercent : a.balance - b.balance
      );

    for (const target of remaining) {
      if (availableExtra <= 0) break;
      const extraPay = Math.min(target.balance, availableExtra);
      target.balance -= extraPay;
      availableExtra -= extraPay;
      totalPaid += extraPay;
      if (target.balance <= 0.01) {
        target.balance = 0;
        if (target.paidOffMonth === 0) target.paidOffMonth = month;
      }
    }
  }

  return {
    strategy,
    monthsToPayoff: month,
    totalInterest,
    totalPaid,
    payoffOrder: active
      .slice()
      .sort((a, b) => a.paidOffMonth - b.paidOffMonth)
      .map((d) => ({ name: d.name, payoffMonth: d.paidOffMonth || month })),
  };
}

export function calculateDebtPayoff(debts: DebtItem[], extraMonthly: number) {
  const avalanche = simulateDebtStrategy(debts, extraMonthly, 'avalanche');
  const snowball = simulateDebtStrategy(debts, extraMonthly, 'snowball');
  return {
    avalanche,
    snowball,
    interestSavedWithAvalanche: Math.max(0, snowball.totalInterest - avalanche.totalInterest),
    monthsSavedWithAvalanche: Math.max(0, snowball.monthsToPayoff - avalanche.monthsToPayoff),
  };
}

export interface AmortizationInput {
  loanAmount: number;
  interestRatePercent: number;
  loanTermYears: number;
  extraMonthlyPayment?: number;
}

export interface AmortizationWithExtraResult {
  standardMonthlyPayment: number;
  standardTotalInterest: number;
  standardMonths: number;
  acceleratedTotalInterest: number;
  acceleratedMonths: number;
  interestSaved: number;
  monthsSaved: number;
  schedule: AmortizationRow[];
}

export function calculateAmortizationWithExtra(input: AmortizationInput): AmortizationWithExtraResult {
  const standard = calculateLoan({
    loanAmount: input.loanAmount,
    interestRatePercent: input.interestRatePercent,
    loanTermYears: input.loanTermYears,
  });

  const extra = Math.max(0, input.extraMonthlyPayment || 0);
  if (extra === 0) {
    return {
      standardMonthlyPayment: standard.periodicPayment,
      standardTotalInterest: standard.totalInterest,
      standardMonths: standard.periodsCount,
      acceleratedTotalInterest: standard.totalInterest,
      acceleratedMonths: standard.periodsCount,
      interestSaved: 0,
      monthsSaved: 0,
      schedule: standard.schedule,
    };
  }

  let balance = Math.max(0, input.loanAmount);
  const r = Math.max(0, input.interestRatePercent) / 100 / 12;
  let totalInterest = 0;
  let month = 0;
  const schedule: AmortizationRow[] = [];

  while (balance > 0.005 && month < 1200) {
    month++;
    const interest = balance * r;
    const basePrincipal = standard.periodicPayment - interest;
    let totalPrincipal = basePrincipal + extra;
    if (totalPrincipal > balance) {
      totalPrincipal = balance;
    }
    const payment = totalPrincipal + interest;
    balance = Math.max(0, balance - totalPrincipal);
    totalInterest += interest;
    schedule.push({
      month,
      year: Math.ceil(month / 12),
      payment,
      principal: totalPrincipal,
      interest,
      extraPayment: Math.max(0, totalPrincipal - basePrincipal),
      balance,
      totalInterestPaid: totalInterest,
    });
  }

  return {
    standardMonthlyPayment: standard.periodicPayment,
    standardTotalInterest: standard.totalInterest,
    standardMonths: standard.periodsCount,
    acceleratedTotalInterest: totalInterest,
    acceleratedMonths: month,
    interestSaved: Math.max(0, standard.totalInterest - totalInterest),
    monthsSaved: Math.max(0, standard.periodsCount - month),
    schedule,
  };
}

export function solveInterestRate(loanAmount: number, monthlyPayment: number, totalMonths: number): number {
  const P = Math.max(0, loanAmount);
  const M = Math.max(0, monthlyPayment);
  const n = Math.max(1, Math.round(totalMonths));
  if (P <= 0 || M * n <= P) return 0;

  let low = 0;
  let high = 2.0; // up to 200% monthly (2400% APR)
  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    const f = Math.pow(1 + mid, n);
    const calcM = mid === 0 ? P / n : (P * (mid * f)) / (f - 1);
    if (calcM > M) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return ((low + high) / 2) * 12 * 100;
}

export interface InflationResult {
  futureEquivalent: number;
  purchasingPowerOfOriginal: number;
  cumulativeInflationPercent: number;
  purchasingPowerLossPercent: number;
  yearlyRows: { year: number; futureCost: number; purchasingPower: number }[];
}

export function calculateInflation(amount: number, annualInflationPercent: number, years: number): InflationResult {
  const A = Math.max(0, amount);
  const rate = annualInflationPercent / 100;
  const yrs = Math.max(1, Math.min(100, Math.round(years)));
  const yearlyRows: { year: number; futureCost: number; purchasingPower: number }[] = [];

  for (let y = 1; y <= yrs; y++) {
    const factor = Math.pow(1 + rate, y);
    yearlyRows.push({
      year: y,
      futureCost: A * factor,
      purchasingPower: factor !== 0 ? A / factor : A,
    });
  }

  const finalFactor = Math.pow(1 + rate, yrs);
  const futureEquivalent = A * finalFactor;
  const purchasingPowerOfOriginal = finalFactor !== 0 ? A / finalFactor : A;
  const cumulativeInflationPercent = (finalFactor - 1) * 100;
  const purchasingPowerLossPercent = A > 0 ? ((A - purchasingPowerOfOriginal) / A) * 100 : 0;

  return {
    futureEquivalent,
    purchasingPowerOfOriginal,
    cumulativeInflationPercent,
    purchasingPowerLossPercent,
    yearlyRows,
  };
}

export type SalaryPeriod = 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annual';

export interface SalaryResult {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  semimonthly: number;
  monthly: number;
  annual: number;
}

export function calculateSalary(
  amount: number,
  period: SalaryPeriod,
  hoursPerWeek = 40,
  daysPerWeek = 5,
  weeksPerYear = 52
): SalaryResult {
  const val = Math.max(0, amount);
  const hpw = Math.max(1, hoursPerWeek);
  const dpw = Math.max(1, daysPerWeek);
  const wpy = Math.max(1, weeksPerYear);
  const totalHoursYear = hpw * wpy;
  const totalDaysYear = dpw * wpy;

  let annual = val;
  switch (period) {
    case 'hourly':
      annual = val * totalHoursYear;
      break;
    case 'daily':
      annual = val * totalDaysYear;
      break;
    case 'weekly':
      annual = val * wpy;
      break;
    case 'biweekly':
      annual = val * (wpy / 2);
      break;
    case 'semimonthly':
      annual = val * 24;
      break;
    case 'monthly':
      annual = val * 12;
      break;
    case 'annual':
    default:
      annual = val;
  }

  return {
    hourly: annual / totalHoursYear,
    daily: annual / totalDaysYear,
    weekly: annual / wpy,
    biweekly: annual / (wpy / 2),
    semimonthly: annual / 24,
    monthly: annual / 12,
    annual,
  };
}

export type FilingStatus = 'single' | 'married_joint' | 'head_of_household';

export interface IncomeTaxInput {
  grossIncome: number;
  filingStatus: FilingStatus;
  preTaxDeductions?: number;
  itemizedDeduction?: number;
  stateTaxRatePercent?: number;
}

export interface IncomeTaxResult {
  grossIncome: number;
  adjustedGrossIncome: number;
  deductionUsed: number;
  taxableIncome: number;
  federalTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  stateTax: number;
  totalTax: number;
  takeHomeAnnual: number;
  takeHomeMonthly: number;
  effectiveTaxRatePercent: number;
  marginalBracketPercent: number;
  bracketBreakdown: { rate: number; taxableInBracket: number; taxAmount: number }[];
}

const FEDERAL_BRACKETS_2025: Record<FilingStatus, { limit: number; rate: number }[]> = {
  single: [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  married_joint: [
    { limit: 23850, rate: 0.10 },
    { limit: 96950, rate: 0.12 },
    { limit: 206700, rate: 0.22 },
    { limit: 394600, rate: 0.24 },
    { limit: 501050, rate: 0.32 },
    { limit: 751600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { limit: 17000, rate: 0.10 },
    { limit: 64850, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250500, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15000,
  married_joint: 30000,
  head_of_household: 22500,
};

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const grossIncome = Math.max(0, input.grossIncome);
  const preTax = Math.min(grossIncome, Math.max(0, input.preTaxDeductions || 0));
  const adjustedGrossIncome = Math.max(0, grossIncome - preTax);
  const stdDed = STANDARD_DEDUCTION_2025[input.filingStatus];
  const deductionUsed = Math.max(stdDed, Math.max(0, input.itemizedDeduction || 0));
  const taxableIncome = Math.max(0, adjustedGrossIncome - deductionUsed);

  const brackets = FEDERAL_BRACKETS_2025[input.filingStatus];
  let prevLimit = 0;
  let federalTax = 0;
  let marginalBracketPercent = 10;
  const bracketBreakdown: { rate: number; taxableInBracket: number; taxAmount: number }[] = [];

  for (const b of brackets) {
    if (taxableIncome > prevLimit) {
      const slice = Math.min(taxableIncome, b.limit) - prevLimit;
      const taxInSlice = slice * b.rate;
      federalTax += taxInSlice;
      marginalBracketPercent = b.rate * 100;
      bracketBreakdown.push({
        rate: b.rate * 100,
        taxableInBracket: slice,
        taxAmount: taxInSlice,
      });
      prevLimit = b.limit;
    } else {
      break;
    }
  }

  const ssWageCap = 176100;
  const socialSecurityTax = Math.min(grossIncome, ssWageCap) * 0.062;
  const additionalMedicareThreshold = input.filingStatus === 'married_joint' ? 250000 : 200000;
  const medicareTax =
    grossIncome * 0.0145 + Math.max(0, grossIncome - additionalMedicareThreshold) * 0.009;
  const stateTax = taxableIncome * (Math.max(0, input.stateTaxRatePercent || 0) / 100);
  const totalTax = federalTax + socialSecurityTax + medicareTax + stateTax;
  const takeHomeAnnual = Math.max(0, grossIncome - preTax - totalTax);

  return {
    grossIncome,
    adjustedGrossIncome,
    deductionUsed,
    taxableIncome,
    federalTax,
    socialSecurityTax,
    medicareTax,
    stateTax,
    totalTax,
    takeHomeAnnual,
    takeHomeMonthly: takeHomeAnnual / 12,
    effectiveTaxRatePercent: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
    marginalBracketPercent: taxableIncome > 0 ? marginalBracketPercent : 0,
    bracketBreakdown,
  };
}

export interface BudgetInput {
  monthlyIncome: number;
  housing: number;
  utilities: number;
  food: number;
  transportation: number;
  healthcare: number;
  debtPayments: number;
  savingsAndInvesting: number;
  entertainmentAndOther: number;
}

export function calculateBudget(input: BudgetInput) {
  const income = Math.max(0, input.monthlyIncome);
  const needs =
    Math.max(0, input.housing) +
    Math.max(0, input.utilities) +
    Math.max(0, input.food) +
    Math.max(0, input.transportation) +
    Math.max(0, input.healthcare) +
    Math.max(0, input.debtPayments);
  const wants = Math.max(0, input.entertainmentAndOther);
  const savings = Math.max(0, input.savingsAndInvesting);
  const totalAllocated = needs + wants + savings;
  const unallocated = income - totalAllocated;

  return {
    income,
    needs,
    wants,
    savings,
    totalAllocated,
    unallocated,
    needsPercent: income > 0 ? (needs / income) * 100 : 0,
    wantsPercent: income > 0 ? (wants / income) * 100 : 0,
    savingsPercent: income > 0 ? (savings / income) * 100 : 0,
  };
}

export interface NetWorthInput {
  cashAndChecking: number;
  investments: number;
  retirementAccounts: number;
  realEstate: number;
  vehiclesAndOtherAssets: number;
  mortgageBalance: number;
  autoLoans: number;
  studentLoans: number;
  creditCardDebt: number;
  otherLiabilities: number;
}

export function calculateNetWorth(input: NetWorthInput) {
  const totalAssets =
    Math.max(0, input.cashAndChecking) +
    Math.max(0, input.investments) +
    Math.max(0, input.retirementAccounts) +
    Math.max(0, input.realEstate) +
    Math.max(0, input.vehiclesAndOtherAssets);

  const totalLiabilities =
    Math.max(0, input.mortgageBalance) +
    Math.max(0, input.autoLoans) +
    Math.max(0, input.studentLoans) +
    Math.max(0, input.creditCardDebt) +
    Math.max(0, input.otherLiabilities);

  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  return { totalAssets, totalLiabilities, netWorth, debtToAssetRatio };
}

export function calculateROI(initialInvestment: number, returnedAmount: number, years = 1) {
  const init = Math.max(0.01, initialInvestment);
  const ret = Math.max(0, returnedAmount);
  const yrs = Math.max(0.01, years);
  const netProfit = ret - init;
  const roiPercent = (netProfit / init) * 100;
  const annualizedRoiPercent = (Math.pow(ret / init, 1 / yrs) - 1) * 100;
  return { netProfit, roiPercent, annualizedRoiPercent };
}

export interface RefinanceInput {
  currentBalance: number;
  currentRatePercent: number;
  remainingYears: number;
  newRatePercent: number;
  newTermYears: number;
  closingCosts: number;
}

export function calculateMortgageRefinance(input: RefinanceInput) {
  const currentLoan = calculateLoan({
    loanAmount: input.currentBalance,
    interestRatePercent: input.currentRatePercent,
    loanTermYears: input.remainingYears,
  });

  const newLoan = calculateLoan({
    loanAmount: input.currentBalance,
    interestRatePercent: input.newRatePercent,
    loanTermYears: input.newTermYears,
  });

  const monthlySavings = currentLoan.periodicPayment - newLoan.periodicPayment;
  const closingCosts = Math.max(0, input.closingCosts);
  const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : Infinity;
  const lifetimeSavings = currentLoan.totalInterest - newLoan.totalInterest - closingCosts;

  return {
    currentMonthlyPayment: currentLoan.periodicPayment,
    newMonthlyPayment: newLoan.periodicPayment,
    monthlySavings,
    breakEvenMonths,
    currentTotalInterest: currentLoan.totalInterest,
    newTotalInterest: newLoan.totalInterest,
    lifetimeSavings,
  };
}
