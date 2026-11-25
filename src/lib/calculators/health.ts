export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBMI(weightKg: number, heightCm: number) {
  const hM = Math.max(0.5, heightCm / 100);
  const w = Math.max(10, weightKg);
  const bmi = w / (hM * hM);
  const bmiPrime = bmi / 25;

  let category = 'Normal weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else if (bmi < 35) category = 'Obesity Class I';
  else if (bmi < 40) category = 'Obesity Class II';
  else category = 'Obesity Class III';

  const healthyMinKg = 18.5 * hM * hM;
  const healthyMaxKg = 24.9 * hM * hM;

  return { bmi, bmiPrime, category, healthyMinKg, healthyMaxKg };
}

export function calculateBMR(
  sex: Sex,
  age: number,
  weightKg: number,
  heightCm: number,
  formula: 'mifflin' | 'harris' = 'mifflin'
) {
  const w = Math.max(20, weightKg);
  const h = Math.max(80, heightCm);
  const a = Math.max(10, Math.min(110, age));

  let bmr = 0;
  if (formula === 'harris') {
    bmr =
      sex === 'male'
        ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
        : 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
  } else {
    bmr = sex === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  }

  return {
    bmr,
    sedentary: bmr * ACTIVITY_MULTIPLIERS.sedentary,
    light: bmr * ACTIVITY_MULTIPLIERS.light,
    moderate: bmr * ACTIVITY_MULTIPLIERS.moderate,
    active: bmr * ACTIVITY_MULTIPLIERS.active,
    veryActive: bmr * ACTIVITY_MULTIPLIERS.very_active,
  };
}

export function calculateTDEE(
  sex: Sex,
  age: number,
  weightKg: number,
  heightCm: number,
  activity: ActivityLevel
) {
  const { bmr } = calculateBMR(sex, age, weightKg, heightCm, 'mifflin');
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];
  return {
    bmr,
    tdee,
    mildLoss: Math.max(1200, tdee - 250),
    weightLoss: Math.max(1200, tdee - 500),
    extremeLoss: Math.max(1200, tdee - 1000),
    mildGain: tdee + 250,
    weightGain: tdee + 500,
  };
}

export function calculateIdealWeight(sex: Sex, heightCm: number) {
  const inches = Math.max(48, heightCm / 2.54);
  const inchesOver60 = Math.max(0, inches - 60);

  const devine = (sex === 'male' ? 50 : 45.5) + 2.3 * inchesOver60;
  const robinson = (sex === 'male' ? 52 : 49) + (sex === 'male' ? 1.9 : 1.7) * inchesOver60;
  const miller = (sex === 'male' ? 56.2 : 53.1) + (sex === 'male' ? 1.41 : 1.36) * inchesOver60;
  const hamwi = (sex === 'male' ? 48 : 45.5) + (sex === 'male' ? 2.7 : 2.2) * inchesOver60;

  const hM = heightCm / 100;
  const bmiMin = 18.5 * hM * hM;
  const bmiMax = 24.9 * hM * hM;

  return { devine, robinson, miller, hamwi, bmiMin, bmiMax };
}

export function calculateBodyFatUSNavy(
  sex: Sex,
  heightCm: number,
  weightKg: number,
  neckCm: number,
  waistCm: number,
  hipCm = 95
) {
  const h = Math.max(100, heightCm);
  const neck = Math.max(20, neckCm);
  const waist = Math.max(40, waistCm);
  const hip = Math.max(50, hipCm);

  let bodyFatPercent = 0;
  if (sex === 'male') {
    const diff = Math.max(1, waist - neck);
    bodyFatPercent = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(h)) - 450;
  } else {
    const sum = Math.max(1, waist + hip - neck);
    bodyFatPercent = 495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.221 * Math.log10(h)) - 450;
  }

  bodyFatPercent = Math.max(2, Math.min(65, bodyFatPercent));
  const fatMassKg = weightKg * (bodyFatPercent / 100);
  const leanMassKg = Math.max(0, weightKg - fatMassKg);

  let category = 'Fitness';
  if (sex === 'male') {
    if (bodyFatPercent < 6) category = 'Essential Fat';
    else if (bodyFatPercent < 14) category = 'Athletes';
    else if (bodyFatPercent < 18) category = 'Fitness';
    else if (bodyFatPercent < 25) category = 'Acceptable';
    else category = 'Obesity';
  } else {
    if (bodyFatPercent < 14) category = 'Essential Fat';
    else if (bodyFatPercent < 21) category = 'Athletes';
    else if (bodyFatPercent < 25) category = 'Fitness';
    else if (bodyFatPercent < 32) category = 'Acceptable';
    else category = 'Obesity';
  }

  return { bodyFatPercent, fatMassKg, leanMassKg, category };
}

function addDaysUtc(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function calculatePregnancy(
  method: 'lmp' | 'conception' | 'due_date',
  dateStr: string,
  cycleLength = 28,
  referenceDateStr?: string
) {
  const cycleAdjustment = Math.max(20, Math.min(45, cycleLength)) - 28;
  let lmpDate = dateStr;
  if (method === 'conception') {
    lmpDate = addDaysUtc(dateStr, -14);
  } else if (method === 'due_date') {
    lmpDate = addDaysUtc(dateStr, -(280 + cycleAdjustment));
  }

  const dueDate = addDaysUtc(lmpDate, 280 + cycleAdjustment);
  const conceptionDate = addDaysUtc(lmpDate, 14 + cycleAdjustment);
  const endFirstTrimester = addDaysUtc(lmpDate, 84);
  const endSecondTrimester = addDaysUtc(lmpDate, 189);

  const todayStr = referenceDateStr || new Date().toISOString().slice(0, 10);
  const diffDays = Math.floor(
    (new Date(`${todayStr}T12:00:00Z`).getTime() - new Date(`${lmpDate}T12:00:00Z`).getTime()) /
      86400000
  );
  const gestationalDays = Math.max(0, Math.min(294, diffDays));
  const weeks = Math.floor(gestationalDays / 7);
  const days = gestationalDays % 7;
  const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
  const progressPercent = Math.min(100, Math.max(0, (gestationalDays / 280) * 100));

  return {
    lmpDate,
    conceptionDate,
    dueDate,
    endFirstTrimester,
    endSecondTrimester,
    gestationalWeeks: weeks,
    gestationalDaysRemainder: days,
    trimester,
    progressPercent,
  };
}

export function calculateOvulation(lmpDateStr: string, cycleLength = 28) {
  const len = Math.max(20, Math.min(45, Math.round(cycleLength)));
  const ovulationOffset = len - 14;
  const ovulationDate = addDaysUtc(lmpDateStr, ovulationOffset);
  const fertileStart = addDaysUtc(ovulationDate, -5);
  const fertileEnd = addDaysUtc(ovulationDate, 1);
  const nextPeriodDate = addDaysUtc(lmpDateStr, len);

  const forecast = [0, 1, 2].map((idx) => {
    const start = addDaysUtc(lmpDateStr, idx * len);
    const ov = addDaysUtc(start, ovulationOffset);
    return {
      cycle: idx + 1,
      periodStart: start,
      fertileStart: addDaysUtc(ov, -5),
      fertileEnd: addDaysUtc(ov, 1),
      ovulationDate: ov,
    };
  });

  return { ovulationDate, fertileStart, fertileEnd, nextPeriodDate, forecast };
}

export type MacroPreset = 'balanced' | 'low_carb' | 'high_protein' | 'keto';

export function calculateMacros(calories: number, preset: MacroPreset) {
  const kcal = Math.max(800, calories);
  const splits: Record<MacroPreset, { p: number; c: number; f: number }> = {
    balanced: { p: 0.25, c: 0.45, f: 0.30 },
    low_carb: { p: 0.35, c: 0.25, f: 0.40 },
    high_protein: { p: 0.40, c: 0.35, f: 0.25 },
    keto: { p: 0.25, c: 0.05, f: 0.70 },
  };
  const s = splits[preset];
  return {
    proteinGrams: (kcal * s.p) / 4,
    carbsGrams: (kcal * s.c) / 4,
    fatGrams: (kcal * s.f) / 9,
    proteinCalories: kcal * s.p,
    carbsCalories: kcal * s.c,
    fatCalories: kcal * s.f,
  };
}

export function calculateWaterIntake(
  weightKg: number,
  exerciseMinutesPerDay: number,
  climate: 'temperate' | 'warm' | 'hot'
) {
  const baseLiters = Math.max(20, weightKg) * 0.033;
  const exerciseLiters = (Math.max(0, exerciseMinutesPerDay) / 30) * 0.35;
  const climateBonus = climate === 'hot' ? 0.6 : climate === 'warm' ? 0.3 : 0;
  const totalLiters = baseLiters + exerciseLiters + climateBonus;
  const totalOunces = totalLiters * 33.814;
  const cups8oz = totalOunces / 8;
  return { totalLiters, totalOunces, cups8oz };
}

export function calculatePace(
  distanceKm: number,
  totalSeconds: number
) {
  const distKm = Math.max(0.01, distanceKm);
  const distMi = distKm / 1.609344;
  const sec = Math.max(1, totalSeconds);
  const secPerKm = sec / distKm;
  const secPerMi = sec / distMi;
  const speedKmh = distKm / (sec / 3600);
  const speedMph = distMi / (sec / 3600);

  return {
    secPerKm,
    secPerMi,
    speedKmh,
    speedMph,
    split5kSeconds: secPerKm * 5,
    split10kSeconds: secPerKm * 10,
    splitHalfMarathonSeconds: secPerKm * 21.0975,
    splitMarathonSeconds: secPerKm * 42.195,
  };
}

export function calculateHeartRateZones(age: number, restingHr = 65) {
  const a = Math.max(10, Math.min(100, age));
  const maxHrFox = 220 - a;
  const maxHrTanaka = Math.round(208 - 0.7 * a);
  const rhr = Math.max(35, Math.min(120, restingHr));
  const hrr = Math.max(20, maxHrTanaka - rhr);

  const zones = [
    { zone: 'Zone 1 (Recovery)', lowPct: 0.5, highPct: 0.6 },
    { zone: 'Zone 2 (Aerobic Base)', lowPct: 0.6, highPct: 0.7 },
    { zone: 'Zone 3 (Tempo)', lowPct: 0.7, highPct: 0.8 },
    { zone: 'Zone 4 (Lactate Threshold)', lowPct: 0.8, highPct: 0.9 },
    { zone: 'Zone 5 (VO2 Max)', lowPct: 0.9, highPct: 1.0 },
  ].map((z) => ({
    ...z,
    minBpm: Math.round(rhr + hrr * z.lowPct),
    maxBpm: Math.round(rhr + hrr * z.highPct),
  }));

  return { maxHrFox, maxHrTanaka, heartRateReserve: hrr, zones };
}

export function calculateWaistToHeightRatio(waistCm: number, heightCm: number) {
  const h = Math.max(80, heightCm);
  const w = Math.max(30, waistCm);
  const ratio = w / h;
  let classification = 'Healthy';
  if (ratio < 0.4) classification = 'Take Care (Underweight Range)';
  else if (ratio < 0.5) classification = 'Healthy';
  else if (ratio < 0.6) classification = 'Increased Central Risk';
  else classification = 'High Central Risk';

  return { ratio, classification, targetMaxWaistCm: h * 0.5 };
}

export function calculateSleepCycles(
  mode: 'wake_at' | 'sleep_at',
  timeHHMM: string,
  latencyMinutes = 15
) {
  const [hhStr, mmStr] = timeHHMM.split(':');
  const baseMinutes = (parseInt(hhStr || '7', 10) % 24) * 60 + (parseInt(mmStr || '0', 10) % 60);
  const latency = Math.max(0, Math.min(60, latencyMinutes));
  const cycleMinutes = 90;

  const formatTime = (mins: number) => {
    const normalized = ((mins % 1440) + 1440) % 1440;
    const h24 = Math.floor(normalized / 60);
    const m = normalized % 60;
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  return [6, 5, 4, 3].map((cycles) => {
    const sleepDuration = cycles * cycleMinutes;
    const targetMinutes =
      mode === 'wake_at'
        ? baseMinutes - sleepDuration - latency
        : baseMinutes + sleepDuration + latency;
    return {
      cycles,
      hoursSlept: sleepDuration / 60,
      timeFormatted: formatTime(targetMinutes),
      recommended: cycles === 5 || cycles === 6,
    };
  });
}
