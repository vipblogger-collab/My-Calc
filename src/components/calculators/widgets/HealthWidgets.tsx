import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  ActivityLevel,
  MacroPreset,
  Sex,
  calculateBMI,
  calculateBMR,
  calculateBodyFatUSNavy,
  calculateHeartRateZones,
  calculateIdealWeight,
  calculateMacros,
  calculateOvulation,
  calculatePace,
  calculatePregnancy,
  calculateSleepCycles,
  calculateTDEE,
  calculateWaistToHeightRatio,
  calculateWaterIntake,
} from '../../../lib/calculators/health.ts';
import {
  CalcSplitLayout,
  ErrorAlert,
  FieldLabel,
  NumberInput,
  ResultHero,
  SegmentedControl,
  SelectInput,
  StatTile,
  fmtNum,
} from './FormPrimitives.tsx';
import { ResultActions } from '../ResultActions.tsx';
import { useAppContext } from '../../../context/AppContext.tsx';

function formatDurationHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
}

export function HealthWidget({ slug }: { slug: string }) {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const [unitSys, setUnitSys] = useState<'imperial' | 'metric'>('imperial');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('30');
  const [heightCm, setHeightCm] = useState('175');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [weightKg, setWeightKg] = useState('72');
  const [weightLbs, setWeightLbs] = useState('160');

  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [bmrFormula, setBmrFormula] = useState<'mifflin' | 'harris'>('mifflin');
  const [calGoal, setCalGoal] = useState('loss');

  // Body fat & WHtR
  const [neckCm, setNeckCm] = useState('38');
  const [waistCm, setWaistCm] = useState('84');
  const [hipCm, setHipCm] = useState('96');

  // Pregnancy / Ovulation
  const [pregMethod, setPregMethod] = useState<'lmp' | 'conception' | 'due_date'>('lmp');
  const [pregDate, setPregDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 70);
    return d.toISOString().slice(0, 10);
  });
  const [cycleLen, setCycleLen] = useState('28');

  // Macros
  const [macroCal, setMacroCal] = useState('2200');
  const [macroPreset, setMacroPreset] = useState<MacroPreset>('high_protein');

  // Water
  const [exerciseMin, setExerciseMin] = useState('45');
  const [climate, setClimate] = useState<'temperate' | 'warm' | 'hot'>('temperate');

  // Pace
  const [paceDist, setPaceDist] = useState('10');
  const [paceDistUnit, setPaceDistUnit] = useState<'km' | 'mi'>('km');
  const [paceHrs, setPaceHrs] = useState('0');
  const [paceMins, setPaceMins] = useState('48');
  const [paceSecs, setPaceSecs] = useState('30');

  // Heart rate
  const [restingHr, setRestingHr] = useState('62');

  // Sleep
  const [sleepMode, setSleepMode] = useState<'wake_at' | 'sleep_at'>('wake_at');
  const [sleepTime, setSleepTime] = useState('06:30');
  const [latency, setLatency] = useState('15');

  const resolvedHeightCm =
    unitSys === 'metric'
      ? Math.max(80, parseFloat(heightCm) || 175)
      : Math.max(80, ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 2.54);

  const resolvedWeightKg =
    unitSys === 'metric'
      ? Math.max(20, parseFloat(weightKg) || 70)
      : Math.max(20, (parseFloat(weightLbs) || 154) * 0.45359237);

  const sharedBodyInputs = (includeSexAge = true) => (
    <>
      <SegmentedControl
        label="Units"
        value={unitSys}
        onChange={setUnitSys}
        options={[
          { value: 'imperial', label: 'Imperial (ft/in, lbs)' },
          { value: 'metric', label: 'Metric (cm, kg)' },
        ]}
      />
      {includeSexAge && (
        <div className="grid grid-cols-2 gap-3">
          <SegmentedControl
            label="Sex"
            value={sex}
            onChange={setSex}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
          />
          <NumberInput label="Age" suffix="yrs" value={age} onChange={setAge} min={10} max={100} />
        </div>
      )}
      {unitSys === 'metric' ? (
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Height" suffix="cm" value={heightCm} onChange={setHeightCm} min={80} max={250} />
          <NumberInput label="Weight" suffix="kg" value={weightKg} onChange={setWeightKg} min={20} max={350} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <NumberInput label="Height (ft)" value={heightFt} onChange={setHeightFt} min={3} max={8} />
          <NumberInput label="Height (in)" value={heightIn} onChange={setHeightIn} min={0} max={11.9} />
          <NumberInput label="Weight (lbs)" value={weightLbs} onChange={setWeightLbs} min={45} max={750} />
        </div>
      )}
    </>
  );

  if (slug === 'bmi-calculator') {
    const res = calculateBMI(resolvedWeightKg, resolvedHeightCm);
    const minDisp =
      unitSys === 'imperial' ? `${fmtNum(res.healthyMinKg * 2.20462, 1)} lbs` : `${fmtNum(res.healthyMinKg, 1)} kg`;
    const maxDisp =
      unitSys === 'imperial' ? `${fmtNum(res.healthyMaxKg * 2.20462, 1)} lbs` : `${fmtNum(res.healthyMaxKg, 1)} kg`;
    const markerPct = Math.min(100, Math.max(0, ((res.bmi - 15) / 25) * 100));

    return (
      <CalcSplitLayout
        inputs={sharedBodyInputs(false)}
        results={
          <>
            <ResultHero
              label="Body Mass Index (BMI)"
              value={`${res.bmi.toFixed(1)} kg/m²`}
              subtext={
                isAr
                  ? `التصنيف: ${res.category} · مؤشر BMI Prime: ${res.bmiPrime.toFixed(2)}`
                  : `Category: ${res.category} · BMI Prime: ${res.bmiPrime.toFixed(2)}`
              }
              accent={res.category === 'Normal weight' ? 'green' : 'blue'}
            />
            <div dir="ltr">
              <div className="flex justify-between text-[11px] text-[#64748B] mb-1">
                <span>{isAr ? 'نحافة (<18.5)' : 'Underweight (<18.5)'}</span>
                <span>{isAr ? 'طبيعي (18.5–24.9)' : 'Normal (18.5–24.9)'}</span>
                <span>{isAr ? 'زيادة وزن (25–29.9)' : 'Overweight (25–29.9)'}</span>
                <span>{isAr ? 'سمنة (30+)' : 'Obese (30+)'}</span>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden flex bg-[#E2E8F0]">
                <div className="w-[14%] bg-[#38BDF8]" />
                <div className="w-[26%] bg-[#22C55E]" />
                <div className="w-[20%] bg-[#F59E0B]" />
                <div className="w-[40%] bg-[#EF4444]" />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-[#0F172A]"
                  style={{ left: `${markerPct}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Healthy Weight Range" value={`${minDisp} – ${maxDisp}`} />
              <StatTile label="BMI Prime (Target ≤ 1.0)" value={res.bmiPrime.toFixed(2)} />
            </div>
            <ResultActions
              copyText={`BMI: ${res.bmi.toFixed(1)} (${res.category}) | Healthy weight range: ${minDisp} – ${maxDisp}`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'bmr-calculator') {
    const res = calculateBMR(sex, parseFloat(age) || 30, resolvedWeightKg, resolvedHeightCm, bmrFormula);
    return (
      <CalcSplitLayout
        inputs={
          <>
            {sharedBodyInputs(true)}
            <SegmentedControl
              label="Equation"
              value={bmrFormula}
              onChange={setBmrFormula}
              options={[
                { value: 'mifflin', label: 'Mifflin-St Jeor' },
                { value: 'harris', label: 'Harris-Benedict' },
              ]}
            />
          </>
        }
        results={
          <>
            <ResultHero
              label="Basal Metabolic Rate (BMR)"
              value={`${fmtNum(res.bmr, 0)} kcal/day`}
              subtext={
                isAr
                  ? 'السعرات الحرارية التي يحرقها الجسم يومياً أثناء الراحة التامة'
                  : 'Calories burned daily at complete physical and digestive rest'
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <StatTile label="Sedentary (×1.2)" value={`${fmtNum(res.sedentary, 0)} kcal/day`} />
              <StatTile label="Light Exercise (×1.375)" value={`${fmtNum(res.light, 0)} kcal/day`} />
              <StatTile label="Moderate Exercise (×1.55)" value={`${fmtNum(res.moderate, 0)} kcal/day`} />
              <StatTile label="Very Active (×1.725)" value={`${fmtNum(res.active, 0)} kcal/day`} />
            </div>
            <ResultActions copyText={`BMR (${bmrFormula}): ${Math.round(res.bmr)} kcal/day`} />
          </>
        }
      />
    );
  }

  if (slug === 'tdee-calculator' || slug === 'calorie-calculator') {
    const res = calculateTDEE(sex, parseFloat(age) || 30, resolvedWeightKg, resolvedHeightCm, activity);
    const goalTarget =
      calGoal === 'mild_loss'
        ? res.mildLoss
        : calGoal === 'loss'
        ? res.weightLoss
        : calGoal === 'gain'
        ? res.weightGain
        : res.tdee;

    return (
      <CalcSplitLayout
        inputs={
          <>
            {sharedBodyInputs(true)}
            <SelectInput
              label="Weekly Activity Level"
              value={activity}
              onChange={(v) => setActivity(v as ActivityLevel)}
              options={[
                { value: 'sedentary', label: 'Sedentary (desk job, little exercise)' },
                { value: 'light', label: 'Light (1–3 days/week)' },
                { value: 'moderate', label: 'Moderate (3–5 days/week)' },
                { value: 'active', label: 'Active (6–7 days/week)' },
                { value: 'very_active', label: 'Very Active (athlete / physical job)' },
              ]}
            />
            {slug === 'calorie-calculator' && (
              <SelectInput
                label="Weight Goal"
                value={calGoal}
                onChange={setCalGoal}
                options={[
                  { value: 'maintain', label: 'Maintain Weight' },
                  { value: 'mild_loss', label: 'Mild Weight Loss (~0.5 lb/wk)' },
                  { value: 'loss', label: 'Weight Loss (~1 lb/wk)' },
                  { value: 'gain', label: 'Lean Weight Gain (+500 kcal)' },
                ]}
              />
            )}
          </>
        }
        results={
          <>
            <ResultHero
              label={slug === 'tdee-calculator' ? 'Maintenance TDEE' : 'Recommended Daily Calorie Target'}
              value={`${fmtNum(slug === 'tdee-calculator' ? res.tdee : goalTarget, 0)} kcal/day`}
              subtext={
                isAr
                  ? `الأيض الأساسي BMR: ${fmtNum(res.bmr, 0)} سعرة/يوم · سعرات الثبات TDEE: ${fmtNum(res.tdee, 0)} سعرة/يوم`
                  : `Resting BMR: ${fmtNum(res.bmr, 0)} kcal/day · Maintenance TDEE: ${fmtNum(res.tdee, 0)} kcal/day`
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Mild Loss (-250 kcal)" value={`${fmtNum(res.mildLoss, 0)} kcal`} />
              <StatTile label="Fat Loss (-500 kcal)" value={`${fmtNum(res.weightLoss, 0)} kcal`} />
              <StatTile label="Mild Gain (+250 kcal)" value={`${fmtNum(res.mildGain, 0)} kcal`} />
              <StatTile label="Weight Gain (+500 kcal)" value={`${fmtNum(res.weightGain, 0)} kcal`} />
            </div>
            <ResultActions
              copyText={`BMR: ${Math.round(res.bmr)} kcal | TDEE: ${Math.round(res.tdee)} kcal | Weight Loss (-1 lb/wk): ${Math.round(res.weightLoss)} kcal`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'ideal-weight-calculator') {
    const res = calculateIdealWeight(sex, resolvedHeightCm);
    const fmtW = (kg: number) =>
      unitSys === 'imperial' ? `${fmtNum(kg * 2.20462, 1)} lbs` : `${fmtNum(kg, 1)} kg`;

    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Units"
              value={unitSys}
              onChange={setUnitSys}
              options={[
                { value: 'imperial', label: 'Imperial (ft/in)' },
                { value: 'metric', label: 'Metric (cm)' },
              ]}
            />
            <SegmentedControl
              label="Sex"
              value={sex}
              onChange={setSex}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
            {unitSys === 'metric' ? (
              <NumberInput label="Height" suffix="cm" value={heightCm} onChange={setHeightCm} min={100} max={240} />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <NumberInput label="Height (ft)" value={heightFt} onChange={setHeightFt} min={4} max={8} />
                <NumberInput label="Height (in)" value={heightIn} onChange={setHeightIn} min={0} max={11.9} />
              </div>
            )}
          </>
        }
        results={
          <>
            <ResultHero
              label="Healthy BMI Weight Band (18.5–24.9)"
              value={`${fmtW(res.bmiMin)} – ${fmtW(res.bmiMax)}`}
              subtext={`${isAr ? 'تقدير معادلة ديفاين:' : 'Devine Formula Estimate:'} ${fmtW(res.devine)}`}
            />
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Devine (1974)" value={fmtW(res.devine)} />
              <StatTile label="Robinson (1983)" value={fmtW(res.robinson)} />
              <StatTile label="Miller (1983)" value={fmtW(res.miller)} />
              <StatTile label="Hamwi (1964)" value={fmtW(res.hamwi)} />
            </div>
            <ResultActions copyText={`Healthy Range: ${fmtW(res.bmiMin)} – ${fmtW(res.bmiMax)} | Devine: ${fmtW(res.devine)}`} />
          </>
        }
      />
    );
  }

  if (slug === 'body-fat-calculator') {
    const res = calculateBodyFatUSNavy(
      sex,
      resolvedHeightCm,
      resolvedWeightKg,
      parseFloat(neckCm) || 38,
      parseFloat(waistCm) || 84,
      parseFloat(hipCm) || 96
    );
    return (
      <CalcSplitLayout
        inputs={
          <>
            {sharedBodyInputs(true)}
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Neck Circumference" suffix="cm" value={neckCm} onChange={setNeckCm} min={20} />
              <NumberInput label="Waist Circumference" suffix="cm" value={waistCm} onChange={setWaistCm} min={40} />
            </div>
            {sex === 'female' && (
              <NumberInput label="Hip Circumference" suffix="cm" value={hipCm} onChange={setHipCm} min={50} />
            )}
          </>
        }
        results={
          <>
            <ResultHero
              label="Estimated Body Fat Percentage (U.S. Navy)"
              value={`${res.bodyFatPercent.toFixed(1)}%`}
              subtext={`${isAr ? 'تصنيف ACE:' : 'ACE Category:'} ${res.category}`}
            />
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Fat Mass" value={`${res.fatMassKg.toFixed(1)} kg (${(res.fatMassKg * 2.20462).toFixed(1)} lbs)`} />
              <StatTile label="Lean Body Mass" value={`${res.leanMassKg.toFixed(1)} kg (${(res.leanMassKg * 2.20462).toFixed(1)} lbs)`} />
            </div>
            <ResultActions copyText={`Body Fat: ${res.bodyFatPercent.toFixed(1)}% (${res.category}) | Lean Mass: ${res.leanMassKg.toFixed(1)} kg`} />
          </>
        }
      />
    );
  }

  if (slug === 'pregnancy-calculator' || slug === 'due-date-calculator') {
    const res = calculatePregnancy(
      slug === 'due-date-calculator' ? 'lmp' : pregMethod,
      pregDate,
      parseInt(cycleLen, 10) || 28
    );
    return (
      <CalcSplitLayout
        inputs={
          <>
            {slug === 'pregnancy-calculator' && (
              <SelectInput
                label="Calculation Method"
                value={pregMethod}
                onChange={(v) => setPregMethod(v as typeof pregMethod)}
                options={[
                  { value: 'lmp', label: 'First Day of Last Period' },
                  { value: 'conception', label: 'Conception Date' },
                  { value: 'due_date', label: 'Known Estimated Due Date' },
                ]}
              />
            )}
            <div>
              <FieldLabel
                label={
                  pregMethod === 'conception'
                    ? 'Conception Date'
                    : pregMethod === 'due_date'
                    ? 'Estimated Due Date'
                    : 'First Day of Last Menstrual Period'
                }
              />
              <input
                type="date"
                dir="ltr"
                value={pregDate}
                onChange={(e) => setPregDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm tabular-nums"
              />
            </div>
            <NumberInput label="Average Cycle Length" suffix="days" value={cycleLen} onChange={setCycleLen} min={20} max={45} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Estimated Due Date (40 Weeks)"
              value={res.dueDate}
              subtext={
                isAr
                  ? `عمر الحمل الحالي: ${res.gestationalWeeks} أسبوعاً و ${res.gestationalDaysRemainder} يوماً · الثلث ${res.trimester}`
                  : `Current Gestational Age: ${res.gestationalWeeks} weeks, ${res.gestationalDaysRemainder} days · Trimester ${res.trimester}`
              }
            />
            <div>
              <div className="flex justify-between text-xs text-[#64748B] mb-1">
                <span>{isAr ? `التقدم (${res.progressPercent.toFixed(0)}%)` : `Progress (${res.progressPercent.toFixed(0)}%)`}</span>
                <span>{isAr ? '40 أسبوعاً' : '40 Weeks'}</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div className="h-full bg-[#2563EB]" style={{ width: `${res.progressPercent}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Estimated Conception" value={res.conceptionDate} />
              <StatTile label="End of 1st Trimester (12w)" value={res.endFirstTrimester} />
              <StatTile label="End of 2nd Trimester (27w)" value={res.endSecondTrimester} />
              <StatTile label="LMP Reference Date" value={res.lmpDate} />
            </div>
            <ResultActions copyText={`Estimated Due Date: ${res.dueDate} | Gestational Age: ${res.gestationalWeeks}w ${res.gestationalDaysRemainder}d`} />
          </>
        }
      />
    );
  }

  if (slug === 'ovulation-calculator') {
    const res = calculateOvulation(pregDate, parseInt(cycleLen, 10) || 28);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <div>
              <FieldLabel label="First Day of Last Period" />
              <input
                type="date"
                dir="ltr"
                value={pregDate}
                onChange={(e) => setPregDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm tabular-nums"
              />
            </div>
            <NumberInput label="Average Cycle Length" suffix="days" value={cycleLen} onChange={setCycleLen} min={20} max={45} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Estimated Next Ovulation Date"
              value={res.ovulationDate}
              subtext={
                isAr
                  ? `فترة الخصوبة: ${res.fertileStart} إلى ${res.fertileEnd} · الدورة القادمة: ${res.nextPeriodDate}`
                  : `Fertile Window: ${res.fertileStart} to ${res.fertileEnd} · Next Period: ${res.nextPeriodDate}`
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="border-b border-[#E2E8F0] text-[#64748B]">
                  <tr>
                    <th className="py-2">{isAr ? 'الدورة' : 'Cycle'}</th>
                    <th className="py-2">{isAr ? 'بداية الدورة' : 'Period Start'}</th>
                    <th className="py-2">{isAr ? 'فترة الخصوبة' : 'Fertile Window'}</th>
                    <th className="py-2">{isAr ? 'التبويض' : 'Ovulation'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] font-mono-tabular">
                  {res.forecast.map((row) => (
                    <tr key={row.cycle}>
                      <td className="py-2 font-sans text-[#475569]">
                        {isAr ? `الدورة ${row.cycle}` : `Cycle ${row.cycle}`}
                      </td>
                      <td className="py-2">{row.periodStart}</td>
                      <td className="py-2">{row.fertileStart} – {row.fertileEnd}</td>
                      <td className="py-2 font-semibold text-[#2563EB]">{row.ovulationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ResultActions copyText={`Ovulation Date: ${res.ovulationDate} | Fertile Window: ${res.fertileStart} – ${res.fertileEnd}`} />
          </>
        }
      />
    );
  }

  if (slug === 'macro-calculator') {
    const res = calculateMacros(parseFloat(macroCal) || 2000, macroPreset);
    const chartData = [
      { name: 'Protein', value: Math.round(res.proteinCalories), color: '#2563EB' },
      { name: 'Carbs', value: Math.round(res.carbsCalories), color: '#16A34A' },
      { name: 'Fat', value: Math.round(res.fatCalories), color: '#D97706' },
    ];
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Daily Calorie Target" suffix="kcal" value={macroCal} onChange={setMacroCal} min={800} />
            <SelectInput
              label="Macronutrient Split Preset"
              value={macroPreset}
              onChange={(v) => setMacroPreset(v as MacroPreset)}
              options={[
                { value: 'balanced', label: 'Balanced (25% P / 45% C / 30% F)' },
                { value: 'high_protein', label: 'High Protein (40% P / 35% C / 25% F)' },
                { value: 'low_carb', label: 'Low Carb (35% P / 25% C / 40% F)' },
                { value: 'keto', label: 'Ketogenic (25% P / 5% C / 70% F)' },
              ]}
            />
          </>
        }
        results={
          <>
            <ResultHero
              label="Daily Macronutrient Targets"
              value={`${Math.round(res.proteinGrams)}g P · ${Math.round(res.carbsGrams)}g C · ${Math.round(res.fatGrams)}g F`}
              subtext={isAr ? `الإجمالي: ${macroCal} سعرة/يوم` : `Total: ${macroCal} kcal/day`}
            />
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                    {chartData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v} kcal`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Protein" value={`${Math.round(res.proteinGrams)} g`} />
              <StatTile label="Carbs" value={`${Math.round(res.carbsGrams)} g`} />
              <StatTile label="Dietary Fat" value={`${Math.round(res.fatGrams)} g`} />
            </div>
            <ResultActions
              copyText={`Macros (${macroCal} kcal, ${macroPreset}): ${Math.round(res.proteinGrams)}g Protein, ${Math.round(res.carbsGrams)}g Carbs, ${Math.round(res.fatGrams)}g Fat`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'water-intake-calculator') {
    const res = calculateWaterIntake(resolvedWeightKg, parseFloat(exerciseMin) || 0, climate);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Weight Units"
              value={unitSys}
              onChange={setUnitSys}
              options={[
                { value: 'imperial', label: 'Pounds (lbs)' },
                { value: 'metric', label: 'Kilograms (kg)' },
              ]}
            />
            {unitSys === 'imperial' ? (
              <NumberInput label="Body Weight" suffix="lbs" value={weightLbs} onChange={setWeightLbs} min={40} />
            ) : (
              <NumberInput label="Body Weight" suffix="kg" value={weightKg} onChange={setWeightKg} min={20} />
            )}
            <NumberInput label="Daily Exercise" suffix="min" value={exerciseMin} onChange={setExerciseMin} min={0} />
            <SelectInput
              label="Local Climate"
              value={climate}
              onChange={(v) => setClimate(v as typeof climate)}
              options={[
                { value: 'temperate', label: 'Temperate' },
                { value: 'warm', label: 'Warm' },
                { value: 'hot', label: 'Hot / Humid' },
              ]}
            />
          </>
        }
        results={
          <>
            <ResultHero
              label="Recommended Daily Fluid Intake"
              value={isAr ? `${res.totalLiters.toFixed(2)} لتر` : `${res.totalLiters.toFixed(2)} Liters`}
              subtext={
                isAr
                  ? `${Math.round(res.totalOunces)} أونصة سائلة · ~${res.cups8oz.toFixed(1)} أكواب (8 أونصة)`
                  : `${Math.round(res.totalOunces)} fl oz · ~${res.cups8oz.toFixed(1)} glasses (8 oz)`
              }
            />
            <ResultActions copyText={`Daily Water Target: ${res.totalLiters.toFixed(2)} L (${Math.round(res.totalOunces)} fl oz)`} />
          </>
        }
      />
    );
  }

  if (slug === 'pace-calculator') {
    const distKm = (parseFloat(paceDist) || 1) * (paceDistUnit === 'mi' ? 1.609344 : 1);
    const totalSec =
      (parseFloat(paceHrs) || 0) * 3600 +
      (parseFloat(paceMins) || 0) * 60 +
      (parseFloat(paceSecs) || 0);
    if (totalSec <= 0 || distKm <= 0) {
      return <ErrorAlert message="Distance and elapsed time must both be greater than zero." />;
    }
    const res = calculatePace(distKm, totalSec);

    return (
      <CalcSplitLayout
        inputs={
          <>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: isAr ? '5 كم' : '5K', d: '5', u: 'km' as const },
                { label: isAr ? '10 كم' : '10K', d: '10', u: 'km' as const },
                { label: isAr ? 'نصف ماراثون' : 'Half Marathon', d: '21.0975', u: 'km' as const },
                { label: isAr ? 'ماراثون' : 'Marathon', d: '42.195', u: 'km' as const },
              ].map((p) => (
                <button
                  key={p.d}
                  type="button"
                  onClick={() => {
                    setPaceDist(p.d);
                    setPaceDistUnit(p.u);
                  }}
                  className="px-2.5 py-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] text-xs font-medium text-[#475569]"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <NumberInput label="Distance" value={paceDist} onChange={setPaceDist} min={0.01} />
              </div>
              <SelectInput
                label="Unit"
                value={paceDistUnit}
                onChange={(v) => setPaceDistUnit(v as 'km' | 'mi')}
                options={[
                  { value: 'km', label: 'km' },
                  { value: 'mi', label: 'miles' },
                ]}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <NumberInput label="Hours" value={paceHrs} onChange={setPaceHrs} min={0} step={1} />
              <NumberInput label="Minutes" value={paceMins} onChange={setPaceMins} min={0} max={59} step={1} />
              <NumberInput label="Seconds" value={paceSecs} onChange={setPaceSecs} min={0} max={59} step={1} />
            </div>
          </>
        }
        results={
          <>
            <ResultHero
              label="Average Running Pace"
              value={`${formatDurationHMS(res.secPerKm)} /km`}
              subtext={`${formatDurationHMS(res.secPerMi)} /mile · ${res.speedKmh.toFixed(2)} km/h (${res.speedMph.toFixed(2)} mph)`}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <StatTile label="5K Finish" value={formatDurationHMS(res.split5kSeconds)} />
              <StatTile label="10K Finish" value={formatDurationHMS(res.split10kSeconds)} />
              <StatTile label="Half Marathon" value={formatDurationHMS(res.splitHalfMarathonSeconds)} />
              <StatTile label="Marathon" value={formatDurationHMS(res.splitMarathonSeconds)} />
            </div>
            <ResultActions
              copyText={`Pace: ${formatDurationHMS(res.secPerKm)}/km (${formatDurationHMS(res.secPerMi)}/mi) | Speed: ${res.speedKmh.toFixed(2)} km/h`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'heart-rate-calculator') {
    const res = calculateHeartRateZones(parseFloat(age) || 30, parseFloat(restingHr) || 62);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Age" suffix="yrs" value={age} onChange={setAge} min={10} max={100} />
            <NumberInput label="Resting Heart Rate" suffix="BPM" value={restingHr} onChange={setRestingHr} min={35} max={120} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Estimated Maximum Heart Rate (Tanaka)"
              value={`${res.maxHrTanaka} BPM`}
              subtext={
                isAr
                  ? `معادلة فوكس (220−العمر): ${res.maxHrFox} نبضة/د · احتياطي النبض: ${res.heartRateReserve} نبضة/د`
                  : `Fox (220−age): ${res.maxHrFox} BPM · Heart Rate Reserve: ${res.heartRateReserve} BPM`
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="border-b border-[#E2E8F0] text-[#64748B]">
                  <tr>
                    <th className="py-2">{isAr ? 'نطاق التدريب' : 'Training Zone'}</th>
                    <th className="py-2">% HRR</th>
                    <th className="py-2 text-end">{isAr ? 'النبض المستهدف' : 'Target BPM'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {res.zones.map((z) => (
                    <tr key={z.zone}>
                      <td className="py-2 font-medium text-[#1E293B]">{z.zone}</td>
                      <td className="py-2 text-[#64748B]" dir="ltr">
                        {Math.round(z.lowPct * 100)}–{Math.round(z.highPct * 100)}%
                      </td>
                      <td className="py-2 text-end font-mono-tabular font-semibold text-[#0F172A]" dir="ltr">
                        {z.minBpm}–{z.maxBpm} BPM
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ResultActions
              copyText={`Max HR: ${res.maxHrTanaka} BPM | Zone 2: ${res.zones[1].minBpm}-${res.zones[1].maxBpm} BPM`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'waist-to-height-ratio-calculator') {
    const res = calculateWaistToHeightRatio(parseFloat(waistCm) || 82, resolvedHeightCm);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Waist Circumference" suffix="cm" value={waistCm} onChange={setWaistCm} min={30} />
            <NumberInput label="Height" suffix="cm" value={heightCm} onChange={setHeightCm} min={80} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Waist-to-Height Ratio (WHtR)"
              value={res.ratio.toFixed(3)}
              accent={res.classification === 'Healthy' ? 'green' : 'blue'}
              subtext={
                isAr
                  ? `${res.classification} · أقصى محيط خصر مستهدف (<0.50): ${res.targetMaxWaistCm.toFixed(1)} سم`
                  : `${res.classification} · Target max waist (<0.50): ${res.targetMaxWaistCm.toFixed(1)} cm`
              }
            />
            <ResultActions copyText={`WHtR: ${res.ratio.toFixed(3)} (${res.classification})`} />
          </>
        }
      />
    );
  }

  // Sleep Calculator
  const cycles = calculateSleepCycles(sleepMode, sleepTime, parseFloat(latency) || 15);
  return (
    <CalcSplitLayout
      inputs={
        <>
          <SegmentedControl
            label="I Want To Calculate"
            value={sleepMode}
            onChange={setSleepMode}
            options={[
              { value: 'wake_at', label: 'When to Go to Bed' },
              { value: 'sleep_at', label: 'When to Wake Up' },
            ]}
          />
          <div>
            <FieldLabel label={sleepMode === 'wake_at' ? 'Desired Wake-Up Time' : 'Bedtime'} />
            <input
              type="time"
              dir="ltr"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm tabular-nums"
            />
          </div>
          <NumberInput label="Time to Fall Asleep" suffix="min" value={latency} onChange={setLatency} min={0} max={60} />
        </>
      }
      results={
        <>
          <ResultHero
            label={sleepMode === 'wake_at' ? 'Optimal Bedtimes (5–6 Cycles)' : 'Optimal Wake-Up Times'}
            value={isAr ? `${cycles[1].timeFormatted} أو ${cycles[0].timeFormatted}` : `${cycles[1].timeFormatted} or ${cycles[0].timeFormatted}`}
            subtext={
              isAr
                ? `متوافق مع دورات النوم (90 دقيقة) مع احتساب ${latency} دقيقة للاستغراق في النوم`
                : `Aligned with 90-minute sleep cycles plus ${latency} min fall-asleep latency`
            }
          />
          <div className="grid grid-cols-2 gap-3">
            {cycles.map((c) => (
              <div
                key={c.cycles}
                className={`rounded-lg border p-3 ${
                  c.recommended ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
                }`}
              >
                <p className="text-xs text-[#64748B]">
                  {isAr
                    ? `${c.cycles} دورات · ${c.hoursSlept} ساعة ${c.recommended ? '(موصى به)' : ''}`
                    : `${c.cycles} Cycles · ${c.hoursSlept} hrs ${c.recommended ? '(Recommended)' : ''}`}
                </p>
                <p className="mt-0.5 font-mono-tabular text-lg font-bold text-[#0F172A]" dir="ltr">
                  {c.timeFormatted}
                </p>
              </div>
            ))}
          </div>
          <ResultActions
            copyText={`Optimal ${sleepMode === 'wake_at' ? 'bedtimes' : 'wake times'}: ${cycles.map((c) => `${c.timeFormatted} (${c.hoursSlept}h)`).join(', ')}`}
          />
        </>
      }
    />
  );
}
