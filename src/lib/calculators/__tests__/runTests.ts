import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateMortgage,
  calculateLoan,
  calculateCompoundInterest,
  calculateSimpleInterest,
  calculateCreditCardPayoff,
  calculateDebtPayoff,
  solveInterestRate,
  calculateSalary,
  calculateIncomeTax,
  calculateROI,
  calculateMortgageRefinance,
} from '../financial.ts';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateIdealWeight,
  calculateBodyFatUSNavy,
  calculatePregnancy,
  calculateMacros,
  calculatePace,
  calculateHeartRateZones,
} from '../health.ts';
import {
  calculateFraction,
  calculatePercentage,
  calculateQuadratic,
  calculateStatistics,
  analyzePrime,
  calculateGCFList,
  calculateLCMList,
  evaluateMathExpression,
  solveLinearAlgebra,
} from '../math.ts';
import {
  convertLinearUnit,
  convertTemperature,
  convertFuelEconomy,
  convertCurrencyAmount,
} from '../conversion.ts';
import {
  ACTIVE_WORLD_CURRENCY_CODES,
  buildCurrencyCatalog,
  formatCompactMoneyAxis,
  formatConvertedCurrency,
  formatMoney,
  getCurrencyName,
  getCurrencySymbol,
  safeFetchJson,
} from '../currencies.ts';
import {
  calculateAge,
  calculateBusinessDays,
  calculateIsoWeekNumber,
  isLeapYear,
  addSubtractCalendarDate,
} from '../dateTime.ts';
import {
  buildCountryCatalog,
  getCountryPublicHolidaysForRange,
  getCountryWeekendDays,
  loadDateHolidaysEngine,
} from '../countryHolidays.ts';
import {
  calculateTip,
  calculateDiscount,
  calculateSalesTax,
  calculateGPA,
  calculateWeightedGrade,
} from '../everyday.ts';
import {
  solveOhmsLaw,
  solveKineticEnergy,
  solveForce,
  calculateVoltageDivider,
} from '../science.ts';

const approx = (actual: number, expected: number, tol = 0.05) => {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `Expected ${actual} to be within ${tol} of ${expected}`
  );
};

test('Financial: Mortgage 30yr fixed P&I matches standard formula', () => {
  const res = calculateMortgage({
    homePrice: 400000,
    downPayment: 80000,
    loanTermYears: 30,
    interestRatePercent: 6.0,
    propertyTaxAnnual: 4800,
    homeInsuranceAnnual: 1200,
  });
  approx(res.loanAmount, 320000, 0.01);
  approx(res.monthlyPrincipalAndInterest, 1918.56, 0.05);
  approx(res.monthlyPMI, 0, 0.01);
  approx(res.totalMonthlyPayment, 1918.56 + 400 + 100, 0.1);
  assert.equal(res.schedule.length, 360);
  approx(res.schedule[359].balance, 0, 0.01);
});

test('Financial: 0% interest loan divides evenly with zero interest', () => {
  const res = calculateLoan({ loanAmount: 12000, interestRatePercent: 0, loanTermYears: 2 });
  approx(res.periodicPayment, 500, 0.01);
  approx(res.totalInterest, 0, 0.01);
});

test('Financial: Compound interest & Simple interest', () => {
  const ci = calculateCompoundInterest({
    principal: 10000,
    monthlyContribution: 0,
    annualRatePercent: 10,
    years: 1,
    compoundingFrequency: 'annually',
  });
  approx(ci.futureValue, 11000, 0.5);

  const si = calculateSimpleInterest({
    principal: 5000,
    annualRatePercent: 6,
    timeValue: 3,
    timeUnit: 'years',
  });
  approx(si.interestEarned, 900, 0.01);
  approx(si.totalAmount, 5900, 0.01);
});

test('Financial: Interest Rate Newton-Raphson solver inverts loan formula', () => {
  const rate = solveInterestRate(200000, 1199.10, 360);
  approx(rate, 6.0, 0.02);
});

test('Financial: Credit card insufficient payment flags warning', () => {
  const cc = calculateCreditCardPayoff({ balance: 5000, aprPercent: 24, monthlyPayment: 80 });
  assert.equal(cc.isPaymentInsufficient, true);
});

test('Financial: Debt Avalanche saves at least as much interest as Snowball', () => {
  const res = calculateDebtPayoff(
    [
      { id: '1', name: 'Card A', balance: 3000, aprPercent: 24, minPayment: 90 },
      { id: '2', name: 'Auto', balance: 6000, aprPercent: 5, minPayment: 150 },
    ],
    200
  );
  assert.ok(res.avalanche.totalInterest <= res.snowball.totalInterest);
});

test('Financial: Salary, Income Tax, ROI, Refinance', () => {
  const sal = calculateSalary(50, 'hourly', 40, 5, 52);
  approx(sal.annual, 104000, 0.01);
  const tax = calculateIncomeTax({ grossIncome: 100000, filingStatus: 'single', stateTaxRatePercent: 5 });
  assert.ok(tax.federalTax > 0 && tax.takeHomeAnnual < 100000);
  const roi = calculateROI(1000, 1440, 2);
  approx(roi.roiPercent, 44, 0.01);
  approx(roi.annualizedRoiPercent, 20, 0.01);
  const refi = calculateMortgageRefinance({
    currentBalance: 300000,
    currentRatePercent: 7.5,
    remainingYears: 25,
    newRatePercent: 6.0,
    newTermYears: 25,
    closingCosts: 4000,
  });
  assert.ok(refi.monthlySavings > 200);
});

test('Health: BMI, BMR, TDEE, Ideal Weight, Body Fat, Pregnancy, Macros, Pace, HR', () => {
  const bmi = calculateBMI(70, 175);
  approx(bmi.bmi, 22.86, 0.05);
  assert.equal(bmi.category, 'Normal weight');

  const bmr = calculateBMR('male', 30, 80, 180, 'mifflin');
  approx(bmr.bmr, 1780, 1);

  const tdee = calculateTDEE('male', 30, 80, 180, 'moderate');
  approx(tdee.tdee, 1780 * 1.55, 1);

  const iw = calculateIdealWeight('male', 180.34); // ~71 inches
  approx(iw.devine, 50 + 2.3 * 11, 0.5);

  const bf = calculateBodyFatUSNavy('male', 180, 80, 38, 85);
  assert.ok(bf.bodyFatPercent > 10 && bf.bodyFatPercent < 25);

  const preg = calculatePregnancy('lmp', '2026-01-01', 28, '2026-03-12');
  assert.equal(preg.dueDate, '2026-10-08');
  assert.equal(preg.gestationalWeeks, 10);

  const macros = calculateMacros(2000, 'balanced');
  approx(macros.proteinGrams, 125, 0.1);

  const pace = calculatePace(10, 3000); // 50 min 10K -> 300 s/km
  approx(pace.secPerKm, 300, 0.01);

  const hr = calculateHeartRateZones(30, 60);
  assert.equal(hr.maxHrFox, 190);
  assert.equal(hr.zones.length, 5);
});

test('Math: Fractions, Percentages, Quadratics, Statistics, Primes, GCF/LCM, Expressions', () => {
  const frac = calculateFraction(1, 3, '+', 1, 6);
  assert.equal(frac.numerator, 1);
  assert.equal(frac.denominator, 2);

  const pct = calculatePercentage('percent_change', 80, 100);
  approx(pct.result, 25, 0.01);

  const quad = calculateQuadratic(1, -5, 6);
  assert.deepEqual(quad.realRoots.sort((a, b) => a - b), [2, 3]);

  const stats = calculateStatistics([2, 4, 4, 4, 5, 5, 7, 9]);
  approx(stats.mean, 5, 0.01);
  approx(stats.popStdDev, 2, 0.01);

  const prime = analyzePrime(360);
  assert.equal(prime.isPrime, false);
  assert.equal(prime.factorizationStr, '2^3 × 3^2 × 5');
  assert.equal(analyzePrime(97).isPrime, true);

  assert.equal(calculateGCFList([48, 180]).gcf, 12);
  assert.equal(calculateLCMList([12, 18]).lcm, 36);

  approx(evaluateMathExpression('2 + 3 * 4^2 - sqrt(16)', 'DEG'), 46, 0.001);
  approx(evaluateMathExpression('sin(30) + cos(60)', 'DEG'), 1, 0.0001);

  const alg = solveLinearAlgebra(3, 5, 1, 13);
  approx(alg.x!, 4, 0.001);
});

test('Conversion: Length, Weight, Temperature, Fuel Economy inverse', () => {
  approx(convertLinearUnit('length-converter', 1, 'mi', 'km'), 1.609344, 0.0001);
  approx(convertLinearUnit('weight-converter', 1, 'lb', 'kg'), 0.45359237, 0.0001);
  approx(convertTemperature(100, 'C', 'F'), 212, 0.001);
  approx(convertTemperature(0, 'C', 'K'), 273.15, 0.001);
  approx(convertFuelEconomy(10, 'l100km', 'kml'), 10, 0.001);
  approx(convertFuelEconomy(5, 'l100km', 'kml'), 20, 0.001);

  assert.ok(ACTIVE_WORLD_CURRENCY_CODES.size >= 165);
  assert.ok(ACTIVE_WORLD_CURRENCY_CODES.has('KWD'));
  assert.ok(ACTIVE_WORLD_CURRENCY_CODES.has('SAR'));
  assert.ok(ACTIVE_WORLD_CURRENCY_CODES.has('KPW'));
  assert.ok(ACTIVE_WORLD_CURRENCY_CODES.has('XCG'));

  const catalogEn = buildCurrencyCatalog(Array.from(ACTIVE_WORLD_CURRENCY_CODES), 'en');
  const catalogAr = buildCurrencyCatalog(Array.from(ACTIVE_WORLD_CURRENCY_CODES), 'ar');
  assert.equal(catalogEn.length, ACTIVE_WORLD_CURRENCY_CODES.size);
  assert.equal(catalogAr.length, ACTIVE_WORLD_CURRENCY_CODES.size);
  assert.ok(getCurrencyName('KWD', 'ar').includes('كويتي'));
  assert.ok(getCurrencyName('JPY', 'en').toLowerCase().includes('yen'));

  const fx = convertCurrencyAmount(100, 'SAR', 'KWD', { USD: 1, SAR: 3.75, KWD: 0.31 });
  approx(fx.converted, 100 * (0.31 / 3.75), 0.001);
  assert.equal(formatConvertedCurrency(12.345, 'KWD'), '12.345');
  assert.equal(formatConvertedCurrency(0.000123, 'USD'), '0.000123');

  assert.equal(getCurrencySymbol('USD'), '$');
  assert.equal(getCurrencySymbol('EUR'), '€');
  assert.equal(getCurrencySymbol('GBP'), '£');
  assert.equal(getCurrencySymbol('CAD'), 'C$');
  assert.equal(getCurrencySymbol('KWD'), 'KWD');

  assert.equal(formatMoney(1234.5, 'USD'), '$1,234.50');
  assert.equal(formatMoney(1234.5, 'KWD'), 'KWD\u00a01,234.500');
  assert.equal(formatMoney(1234.5, 'JPY'), '¥1,235');
  assert.equal(formatMoney(1234.567, 'EUR', 2), '€1,234.57');

  assert.equal(formatCompactMoneyAxis(250000, 'USD'), '$250k');
  assert.equal(formatCompactMoneyAxis(1500000, 'EUR'), '€1.5M');
  assert.equal(formatCompactMoneyAxis(50000, 'KWD'), '50k KWD');
});

test('Conversion: safeFetchJson rejects non-JSON responses cleanly', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () =>
      new Response('The page could not be found', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    await assert.rejects(() => safeFetchJson('/api/exchange-rates'), /not valid JSON/);

    globalThis.fetch = async () =>
      new Response('The page could not be found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
    await assert.rejects(() => safeFetchJson('/api/exchange-rates'), /HTTP 404/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Date & Time: Leap years, Age, Business days, ISO weeks', () => {
  assert.equal(isLeapYear(2000), true);
  assert.equal(isLeapYear(1900), false);
  assert.equal(isLeapYear(2024), true);

  const age = calculateAge('2000-02-29', '2026-03-01');
  assert.equal(age.years, 26);

  const biz = calculateBusinessDays('2026-11-23', '2026-11-30', true, false);
  // Mon Nov 23..Sun Nov 29 -> Thu Nov 26 is Thanksgiving -> 4 business days
  assert.equal(biz.businessDays, 4);

  const iso = calculateIsoWeekNumber('2026-01-01');
  assert.equal(iso.weekNumber, 1);

  const added = addSubtractCalendarDate('2024-02-29', 'add', 1, 0, 0, 0);
  assert.equal(added.resultDate, '2025-03-01');
});

test('Date & Time: World country calendars, weekends, and public holidays', async () => {
  await loadDateHolidaysEngine();

  const countriesAr = buildCountryCatalog('ar');
  const countriesEn = buildCountryCatalog('en');
  assert.ok(countriesAr.length >= 230);
  assert.equal(countriesAr.length, countriesEn.length);
  assert.ok(countriesAr.some((c) => c.code === 'KW' && c.name.includes('الكويت')));
  assert.ok(countriesEn.some((c) => c.code === 'US'));

  assert.deepEqual(getCountryWeekendDays('KW'), [5, 6]); // Fri & Sat
  assert.deepEqual(getCountryWeekendDays('SA'), [5, 6]); // Fri & Sat
  assert.deepEqual(getCountryWeekendDays('EG'), [5, 6]); // Fri & Sat
  assert.deepEqual(getCountryWeekendDays('US'), [6, 0]); // Sat & Sun
  assert.deepEqual(getCountryWeekendDays('AE'), [6, 0]); // Sat & Sun
  assert.deepEqual(getCountryWeekendDays('IR'), [5]);    // Fri only
  assert.deepEqual(getCountryWeekendDays('AF'), [4, 5]); // Thu & Fri

  // Kuwait: Sun Feb 22 .. Sat Feb 28 2026 inclusive -> Fri/Sat (2 weekend days), Wed Feb 25 + Thu Feb 26 (2 holidays), 3 workdays
  const kwHolidays = getCountryPublicHolidaysForRange('KW', '2026-02-22', '2026-02-28', 'ar');
  const kwBiz = calculateBusinessDays('2026-02-22', '2026-02-28', true, true, {
    weekendDays: getCountryWeekendDays('KW'),
    holidays: kwHolidays,
  });
  assert.equal(kwBiz.totalDays, 7);
  assert.equal(kwBiz.weekendDays, 2);
  assert.equal(kwBiz.holidayDays, 2);
  assert.equal(kwBiz.businessDays, 3);
  assert.equal(kwBiz.matchedHolidays.length, 2);

  // Saudi Arabia Founding Day Feb 22 2026 (Sunday, workday in SA)
  const saHolidays = getCountryPublicHolidaysForRange('SA', '2026-02-20', '2026-02-26', 'ar');
  const saBiz = calculateBusinessDays('2026-02-20', '2026-02-26', true, true, {
    weekendDays: getCountryWeekendDays('SA'),
    holidays: saHolidays,
  });
  assert.equal(saBiz.weekendDays, 2); // Fri Feb 20 & Sat Feb 21
  assert.equal(saBiz.holidayDays, 1); // Sun Feb 22 Founding Day
  assert.equal(saBiz.businessDays, 4);

  // US Thanksgiving week via date-holidays
  const usHolidays = getCountryPublicHolidaysForRange('US', '2026-11-23', '2026-11-29', 'en');
  const usBiz = calculateBusinessDays('2026-11-23', '2026-11-29', true, true, {
    weekendDays: getCountryWeekendDays('US'),
    holidays: usHolidays,
  });
  assert.equal(usBiz.weekendDays, 2);
  assert.equal(usBiz.holidayDays, 1);
  assert.equal(usBiz.businessDays, 4);
});

test('Everyday & Science: Tip, Discount, Sales Tax, GPA, Ohm Law, KE, Voltage Divider', () => {
  const tip = calculateTip(100, 18, 4);
  approx(tip.totalPerPerson, 29.5, 0.01);

  const disc = calculateDiscount(100, 20, 10, 0);
  approx(disc.subtotal, 72, 0.01);

  const revTax = calculateSalesTax('reverse', 108, 8);
  approx(revTax.preTaxPrice, 100, 0.01);

  const gpa = calculateGPA([
    { id: '1', name: 'Math', credits: 4, grade: 'A' },
    { id: '2', name: 'History', credits: 3, grade: 'B' },
  ]);
  approx(gpa.semesterGpa, (16 + 9) / 7, 0.01);

  const wg = calculateWeightedGrade([
    { id: '1', name: 'Midterm', scorePercent: 85, weightPercent: 40 },
    { id: '2', name: 'HW', scorePercent: 95, weightPercent: 30 },
  ], 90);
  approx(wg.currentAverage, (85 * 40 + 95 * 30) / 70, 0.01);
  approx(wg.neededOnRemaining!, (9000 - (3400 + 2850)) / 30, 0.01);

  const ohm = solveOhmsLaw({ voltageV: 12, resistanceOhm: 4 });
  approx(ohm.currentA, 3, 0.001);
  approx(ohm.powerW, 36, 0.001);

  const ke = solveKineticEnergy('energy', 0, 10, 4);
  approx(ke.energyJ, 80, 0.001);

  const f = solveForce('force', 0, 10, 9.8);
  approx(f.forceN, 98, 0.001);

  const vd = calculateVoltageDivider(10, 1000, 1000);
  approx(vd.vOut, 5, 0.001);
});

test('Financial: End-of-Service Gratuity (Kuwait, UAE, Saudi Arabia)', async () => {
  const { calculateEndOfService } = await import('../financial.ts');

  // Kuwait: 6 yrs resignation @ 1000 KWD, 10 unused leave days
  // Tier1 = 5*15*(1000/26) = 2884.615; Tier2 = 1*1000 = 1000; Gross = 3884.615; Multiplier = 2/3 -> 2589.744
  const kwResign = calculateEndOfService({
    jurisdiction: 'kuwait',
    reason: 'resignation',
    monthlySalary: 1000,
    serviceYears: 6,
    serviceMonths: 0,
    unusedLeaveDays: 10,
  });
  approx(kwResign.gratuityAmount, (5 * 15 * (1000 / 26) + 1000) * (2 / 3), 0.01);
  approx(kwResign.leaveEncashment, 10 * (1000 / 26), 0.01);

  // Kuwait 18-month cap on long termination (25 years @ 1000 KWD -> 5*15/26 + 20 = 22.88 mos -> capped at 18 mos)
  const kwCap = calculateEndOfService({
    jurisdiction: 'kuwait',
    reason: 'termination',
    monthlySalary: 1000,
    serviceYears: 25,
  });
  assert.equal(kwCap.capApplied, true);
  approx(kwCap.gratuityAmount, 18000, 0.01);

  // UAE: 6 years @ 12000 AED basic -> 5*21*(400) + 1*30*(400) = 42000 + 12000 = 54000
  const uaeRes = calculateEndOfService({
    jurisdiction: 'uae',
    reason: 'resignation',
    monthlySalary: 12000,
    serviceYears: 6,
  });
  approx(uaeRes.gratuityAmount, 54000, 0.01);
  assert.equal(uaeRes.entitlementMultiplier, 1);

  // Saudi Arabia: 3 years resignation @ 9000 SAR -> 3 * 15 * (9000/30) = 13500; 1/3 multiplier = 4500
  const ksaResign = calculateEndOfService({
    jurisdiction: 'saudi',
    reason: 'resignation',
    monthlySalary: 9000,
    serviceYears: 3,
  });
  approx(ksaResign.gratuityAmount, 4500, 0.01);
});

test('Financial: Zakat Calculator (Cash, Gold & Silver at 2.5%)', async () => {
  const { calculateZakat, getGoldPricesByKarat } = await import('../zakat.ts');

  const prices = getGoldPricesByKarat(120);
  assert.equal(prices[24], 120);
  approx(prices[22], 110, 0.01);
  approx(prices[21], 105, 0.01);
  approx(prices[18], 90, 0.01);

  // Below gold Nisab (40g of 21K = 35g 24K < 85g) and below silver Nisab (500g < 595g)
  // Money Zakat = 10,000 * 2.5% = 250
  const belowMetals = calculateZakat({
    moneyAmount: 10000,
    goldItems: [{ id: 'g1', karat: 21, weightGrams: 40 }],
    silverWeightGrams: 500,
    gold24kPricePerGram: 120,
    silverPricePerGram: 1.5,
  });
  approx(belowMetals.moneyZakat, 250, 0.01);
  approx(belowMetals.goldPure24kGrams, 35, 0.001);
  assert.equal(belowMetals.goldMeetsNisab, false);
  assert.equal(belowMetals.goldZakat, 0);
  assert.equal(belowMetals.silverMeetsNisab, false);
  assert.equal(belowMetals.silverZakat, 0);
  approx(belowMetals.totalZakatDue, 250, 0.01);

  // Multi-karat gold meeting 85g 24K Nisab + silver meeting 595g Nisab:
  // 50g 24K (= 50g pure, val 6000) + 40g 21K (= 35g pure, val 4200) -> 85g pure, val 10200 -> Gold Zakat = 255
  // Silver: 600g * 1.5 = 900 -> Silver Zakat = 22.5
  // Money: 2000 -> Money Zakat = 50
  const aboveMetals = calculateZakat({
    moneyAmount: 2000,
    goldItems: [
      { id: 'g1', karat: 24, weightGrams: 50 },
      { id: 'g2', karat: 21, weightGrams: 40 },
    ],
    silverWeightGrams: 600,
    gold24kPricePerGram: 120,
    silverPricePerGram: 1.5,
  });
  approx(aboveMetals.goldPure24kGrams, 85, 0.001);
  approx(aboveMetals.goldEstimatedValue, 10200, 0.01);
  assert.equal(aboveMetals.goldMeetsNisab, true);
  approx(aboveMetals.goldZakat, 255, 0.01);
  assert.equal(aboveMetals.silverMeetsNisab, true);
  approx(aboveMetals.silverZakat, 22.5, 0.01);
  approx(aboveMetals.totalZakatDue, 327.5, 0.01);
});

test('Financial: VAT Calculator (World Country Rates, Add, Extract, Discount, Settlement)', async () => {
  const { calculateVatLine, calculateVatSettlement, getCountryVatInfo } = await import('../vat.ts');

  const sa = getCountryVatInfo('SA');
  assert.equal(sa.standardVatRate, 15);
  assert.equal(sa.currencyCode, 'SAR');
  assert.equal(sa.hasVat, true);

  const ae = getCountryVatInfo('AE');
  assert.equal(ae.standardVatRate, 5);
  assert.equal(ae.currencyCode, 'AED');

  const kw = getCountryVatInfo('KW');
  assert.equal(kw.standardVatRate, 0);
  assert.equal(kw.hasVat, false);

  const gb = getCountryVatInfo('GB');
  assert.equal(gb.standardVatRate, 20);
  assert.equal(gb.currencyCode, 'GBP');

  // Add 15% VAT with quantity and percentage discount: 2 * 500 = 1000, 10% discount -> net 900 -> VAT 135 -> Total 1035
  const added = calculateVatLine({
    mode: 'add',
    unitAmount: 500,
    quantity: 2,
    vatRatePercent: 15,
    discountType: 'percent',
    discountValue: 10,
  });
  approx(added.grossBeforeDiscount, 1000, 0.01);
  approx(added.discountAmount, 100, 0.01);
  approx(added.netAmount, 900, 0.01);
  approx(added.vatAmount, 135, 0.01);
  approx(added.totalAmount, 1035, 0.01);

  // Extract 15% VAT from 1150 -> Net 1000, VAT 150
  const extracted = calculateVatLine({
    mode: 'extract',
    unitAmount: 1150,
    quantity: 1,
    vatRatePercent: 15,
  });
  approx(extracted.netAmount, 1000, 0.01);
  approx(extracted.vatAmount, 150, 0.01);
  approx(extracted.totalAmount, 1150, 0.01);

  // Monthly settlement (inclusive): Sales 11,500 (VAT 1,500), Purchases 5,750 (VAT 750) -> Net Payable 750
  const settlePayable = calculateVatSettlement({
    salesAmount: 11500,
    purchasesAmount: 5750,
    vatRatePercent: 15,
    amountsIncludeVat: true,
  });
  approx(settlePayable.outputVat, 1500, 0.01);
  approx(settlePayable.inputVat, 750, 0.01);
  approx(settlePayable.netVatPayable, 750, 0.01);
  assert.equal(settlePayable.isRefundDue, false);

  // Monthly settlement refund case: Sales 2,300 (VAT 300), Purchases 5,750 (VAT 750) -> -450 refund
  const settleRefund = calculateVatSettlement({
    salesAmount: 2300,
    purchasesAmount: 5750,
    vatRatePercent: 15,
    amountsIncludeVat: true,
  });
  approx(settleRefund.netVatPayable, -450, 0.01);
  assert.equal(settleRefund.isRefundDue, true);
});

test('Date & Time: World Time Zones catalog covers all IANA zones and Arabic labels', async () => {
  const { getAllWorldTimeZoneIds, buildTimeZoneCatalog } = await import('../timeZones.ts');

  const ids = getAllWorldTimeZoneIds();
  assert.ok(ids.length >= 300, `Expected >= 300 IANA time zones, got ${ids.length}`);
  assert.ok(ids.includes('UTC'));
  assert.ok(ids.includes('Asia/Kuwait'));
  assert.ok(ids.includes('Asia/Riyadh'));
  assert.ok(ids.includes('America/New_York'));
  assert.ok(ids.includes('Europe/London'));

  const catalogAr = buildTimeZoneCatalog('ar');
  const catalogEn = buildTimeZoneCatalog('en');
  assert.equal(catalogAr.length, ids.length);
  assert.equal(catalogEn.length, ids.length);
  const kwAr = catalogAr.find((z) => z.value === 'Asia/Kuwait');
  assert.ok(kwAr && kwAr.displayLabel.includes('الكويت') && kwAr.offsetLabel.startsWith('UTC'));
});

test('SEO: robots.txt and bilingual XML sitemap include EN/AR home, calculators, and legal pages', async () => {
  const { ROBOTS_TXT_CONTENT, generateSitemapXml } = await import('../../../seo/sitemapXml.ts');

  assert.equal(
    ROBOTS_TXT_CONTENT.trim(),
    'User-agent: *\nAllow: /\nSitemap: https://www.mysmartcalc.net/sitemap.xml'
  );

  const xml = generateSitemapXml();
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('<loc>https://www.mysmartcalc.net/en/</loc>'));
  assert.ok(xml.includes('<loc>https://www.mysmartcalc.net/ar/</loc>'));
  assert.ok(xml.includes('<loc>https://www.mysmartcalc.net/en/financial-calculators/zakat-calculator/</loc>'));
  assert.ok(xml.includes('<loc>https://www.mysmartcalc.net/ar/financial-calculators/vat-calculator/</loc>'));
  assert.ok(xml.includes('<loc>https://www.mysmartcalc.net/en/privacy-policy/</loc>'));
  assert.ok(xml.includes('<loc>https://www.mysmartcalc.net/ar/terms-of-service/</loc>'));
});

test('i18n: All 100 calculators have Arabic names, How-to-Use steps, and FAQs', async () => {
  const { ALL_CALCULATORS } = await import('../../../data/calculators/index.ts');
  const { localizeCalculator } = await import('../../../i18n/calculatorAr.ts');

  const hasArabic = (text: string) => /[\u0600-\u06FF]/.test(text);
  for (const calc of ALL_CALCULATORS) {
    const ar = localizeCalculator(calc, 'ar');
    assert.ok(hasArabic(ar.name), `Missing Arabic name for ${calc.slug}`);
    assert.ok(ar.steps.length > 0, `Missing Arabic steps for ${calc.slug}`);
    assert.ok(ar.steps.every(hasArabic), `Untranslated Arabic step in ${calc.slug}`);
    assert.ok(ar.faqs.length > 0, `Missing Arabic FAQs for ${calc.slug}`);
    assert.ok(
      ar.faqs.every((f) => hasArabic(f.question) && hasArabic(f.answer)),
      `Untranslated Arabic FAQ in ${calc.slug}`
    );
  }
});






