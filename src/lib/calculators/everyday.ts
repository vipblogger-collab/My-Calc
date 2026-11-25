export function calculateTip(billAmount: number, tipPercent: number, peopleCount: number) {
  const bill = Math.max(0, billAmount);
  const tipPct = Math.max(0, tipPercent);
  const people = Math.max(1, Math.round(peopleCount));
  const tipAmount = (bill * tipPct) / 100;
  const totalBill = bill + tipAmount;
  return {
    tipAmount,
    totalBill,
    tipPerPerson: tipAmount / people,
    totalPerPerson: totalBill / people,
  };
}

export function calculateDiscount(
  originalPrice: number,
  discountPercent: number,
  extraDiscountPercent = 0,
  taxPercent = 0
) {
  const price = Math.max(0, originalPrice);
  const d1 = Math.max(0, Math.min(100, discountPercent)) / 100;
  const d2 = Math.max(0, Math.min(100, extraDiscountPercent)) / 100;
  const tax = Math.max(0, taxPercent) / 100;

  const afterFirst = price * (1 - d1);
  const subtotal = afterFirst * (1 - d2);
  const totalSavings = price - subtotal;
  const effectiveDiscountPercent = price > 0 ? (totalSavings / price) * 100 : 0;
  const taxAmount = subtotal * tax;
  const finalPrice = subtotal + taxAmount;

  return { subtotal, totalSavings, effectiveDiscountPercent, taxAmount, finalPrice };
}

export function calculateSalesTax(
  mode: 'forward' | 'reverse',
  amount: number,
  taxRatePercent: number
) {
  const amt = Math.max(0, amount);
  const rate = Math.max(0, taxRatePercent) / 100;
  if (mode === 'forward') {
    const taxAmount = amt * rate;
    return { preTaxPrice: amt, taxAmount, totalPrice: amt + taxAmount };
  }
  const preTaxPrice = amt / (1 + rate);
  return { preTaxPrice, taxAmount: amt - preTaxPrice, totalPrice: amt };
}

export function calculateElectricityCost(
  watts: number,
  hoursPerDay: number,
  ratePerKwh: number,
  daysPerMonth = 30
) {
  const kwhPerDay = (Math.max(0, watts) * Math.max(0, hoursPerDay)) / 1000;
  const costPerDay = kwhPerDay * Math.max(0, ratePerKwh);
  const kwhPerMonth = kwhPerDay * daysPerMonth;
  const costPerMonth = costPerDay * daysPerMonth;
  const kwhPerYear = kwhPerDay * 365;
  const costPerYear = costPerDay * 365;
  return { kwhPerDay, costPerDay, kwhPerMonth, costPerMonth, kwhPerYear, costPerYear };
}

export function calculateFuelCost(
  distance: number,
  efficiency: number,
  fuelPricePerUnit: number,
  roundTrip = false
) {
  const dist = Math.max(0, distance) * (roundTrip ? 2 : 1);
  const eff = Math.max(0.1, efficiency);
  const fuelNeeded = dist / eff;
  const totalCost = fuelNeeded * Math.max(0, fuelPricePerUnit);
  const costPerDistanceUnit = dist > 0 ? totalCost / dist : 0;
  return { effectiveDistance: dist, fuelNeeded, totalCost, costPerDistanceUnit };
}

export const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  'D-': 0.7,
  F: 0.0,
};

export interface CourseEntry {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export function calculateGPA(
  courses: CourseEntry[],
  priorGpa = 0,
  priorCredits = 0
) {
  let semesterCredits = 0;
  let semesterPoints = 0;
  for (const c of courses) {
    const cr = Math.max(0, c.credits);
    const pts = GRADE_POINTS[c.grade] ?? 0;
    semesterCredits += cr;
    semesterPoints += cr * pts;
  }
  const semesterGpa = semesterCredits > 0 ? semesterPoints / semesterCredits : 0;
  const totalCredits = Math.max(0, priorCredits) + semesterCredits;
  const totalPoints = Math.max(0, priorGpa) * Math.max(0, priorCredits) + semesterPoints;
  const cumulativeGpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  return { semesterGpa, semesterCredits, semesterPoints, cumulativeGpa, totalCredits };
}

export interface GradeItem {
  id: string;
  name: string;
  scorePercent: number;
  weightPercent: number;
}

export function calculateWeightedGrade(items: GradeItem[], targetOverallPercent = 90) {
  let totalWeight = 0;
  let weightedSum = 0;
  for (const item of items) {
    const w = Math.max(0, item.weightPercent);
    const s = Math.max(0, item.scorePercent);
    totalWeight += w;
    weightedSum += s * w;
  }
  const currentAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const remainingWeight = Math.max(0, 100 - totalWeight);
  const neededOnRemaining =
    remainingWeight > 0 ? (targetOverallPercent * 100 - weightedSum) / remainingWeight : null;

  let letter = 'F';
  if (currentAverage >= 93) letter = 'A';
  else if (currentAverage >= 90) letter = 'A-';
  else if (currentAverage >= 87) letter = 'B+';
  else if (currentAverage >= 83) letter = 'B';
  else if (currentAverage >= 80) letter = 'B-';
  else if (currentAverage >= 77) letter = 'C+';
  else if (currentAverage >= 73) letter = 'C';
  else if (currentAverage >= 70) letter = 'C-';
  else if (currentAverage >= 60) letter = 'D';

  return { currentAverage, letter, totalWeight, remainingWeight, neededOnRemaining };
}

export function calculateSplitBill(
  subtotal: number,
  taxPercent: number,
  tipPercent: number,
  people: number,
  tipOnPreTax = true
) {
  const sub = Math.max(0, subtotal);
  const tax = sub * (Math.max(0, taxPercent) / 100);
  const tipBase = tipOnPreTax ? sub : sub + tax;
  const tip = tipBase * (Math.max(0, tipPercent) / 100);
  const total = sub + tax + tip;
  const count = Math.max(1, Math.round(people));
  return {
    tax,
    tip,
    total,
    perPersonTotal: total / count,
    perPersonTip: tip / count,
  };
}

export function calculateMovingCost(
  homeSize: 'studio' | '1br' | '2br' | '3br' | '4br',
  distanceMiles: number,
  serviceType: 'diy' | 'container' | 'full_service',
  packingService: boolean,
  specialtyItemsCount: number
) {
  const baseCostBySize: Record<string, number> = {
    studio: 450,
    '1br': 700,
    '2br': 1150,
    '3br': 1700,
    '4br': 2400,
  };
  const serviceMultiplier = serviceType === 'diy' ? 0.45 : serviceType === 'container' ? 0.78 : 1.0;
  const ratePerMile = serviceType === 'diy' ? 1.1 : serviceType === 'container' ? 1.85 : 2.6;

  const baseLabor = baseCostBySize[homeSize] * serviceMultiplier;
  const distanceCost = Math.max(0, distanceMiles) * ratePerMile;
  const packingCost = packingService ? baseCostBySize[homeSize] * 0.32 : 0;
  const specialtyCost = Math.max(0, specialtyItemsCount) * 175;
  const estimatedMid = baseLabor + distanceCost + packingCost + specialtyCost;

  return {
    baseLabor,
    distanceCost,
    packingCost,
    specialtyCost,
    estimatedLow: estimatedMid * 0.85,
    estimatedMid,
    estimatedHigh: estimatedMid * 1.2,
  };
}
