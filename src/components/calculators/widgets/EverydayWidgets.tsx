import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  CourseEntry,
  GRADE_POINTS,
  GradeItem,
  calculateDiscount,
  calculateElectricityCost,
  calculateFuelCost,
  calculateGPA,
  calculateMovingCost,
  calculateSalesTax,
  calculateSplitBill,
  calculateTip,
  calculateWeightedGrade,
} from '../../../lib/calculators/everyday.ts';
import {
  CalcSplitLayout,
  CurrencySelector,
  ErrorAlert,
  FieldLabel,
  NumberInput,
  ResultHero,
  SegmentedControl,
  SelectInput,
  StatTile,
  fmtNum,
  useCurrencyFormat,
} from './FormPrimitives.tsx';
import { ResultActions } from '../ResultActions.tsx';
import { useAppContext } from '../../../context/AppContext.tsx';

const CHART_COLORS = ['#2563EB', '#0F172A', '#16A34A', '#D97706', '#0284C7', '#64748B', '#4F46E5'];

export function EverydayWidget({ slug }: { slug: string }) {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const { currencySymbol, fmtMoney } = useCurrencyFormat();
  // Tip & Split Bill
  const [bill, setBill] = useState('120');
  const [tipPct, setTipPct] = useState('18');
  const [people, setPeople] = useState('4');
  const [taxPct, setTaxPct] = useState('8.25');
  const [tipPreTax, setTipPreTax] = useState<'pre' | 'post'>('pre');

  // Discount
  const [origPrice, setOrigPrice] = useState('120');
  const [disc1, setDisc1] = useState('25');
  const [disc2, setDisc2] = useState('10');
  const [discTax, setDiscTax] = useState('0');

  // Sales Tax
  const [taxMode, setTaxMode] = useState<'forward' | 'reverse'>('forward');
  const [taxAmountIn, setTaxAmountIn] = useState('100');
  const [salesTaxRate, setSalesTaxRate] = useState('8.25');

  // Electricity
  const [watts, setWatts] = useState('1500');
  const [hoursDay, setHoursDay] = useState('4');
  const [kwhRate, setKwhRate] = useState('0.16');

  // Fuel Cost
  const [tripDist, setTripDist] = useState('420');
  const [fuelEff, setFuelEff] = useState('30');
  const [fuelPrice, setFuelPrice] = useState('3.65');
  const [roundTrip, setRoundTrip] = useState(false);

  // GPA
  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: '1', name: 'Calculus I', credits: 4, grade: 'A' },
    { id: '2', name: 'Physics', credits: 4, grade: 'B+' },
    { id: '3', name: 'Composition', credits: 3, grade: 'A-' },
    { id: '4', name: 'Economics', credits: 3, grade: 'B' },
  ]);
  const [priorGpa, setPriorGpa] = useState('0');
  const [priorCredits, setPriorCredits] = useState('0');

  // Grade
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([
    { id: '1', name: 'Homework & Labs', scorePercent: 94, weightPercent: 30 },
    { id: '2', name: 'Midterm Exam', scorePercent: 84, weightPercent: 40 },
  ]);
  const [targetGrade, setTargetGrade] = useState('90');

  // Wedding Budget
  const [weddingTotal, setWeddingTotal] = useState('35000');
  const [weddingGuests, setWeddingGuests] = useState('120');
  const [weddingSplits, setWeddingSplits] = useState({
    venueCatering: 45,
    photoVideo: 12,
    attireBeauty: 10,
    flowersDecor: 10,
    musicEntertainment: 8,
    stationeryFavors: 5,
    contingency: 10,
  });

  // Moving Cost
  const [moveSize, setMoveSize] = useState<'studio' | '1br' | '2br' | '3br' | '4br'>('2br');
  const [moveDistance, setMoveDistance] = useState('350');
  const [moveTier, setMoveTier] = useState<'diy' | 'container' | 'full_service'>('full_service');
  const [movePacking, setMovePacking] = useState(false);
  const [specialtyCount, setSpecialtyCount] = useState('0');

  if (slug === 'tip-calculator') {
    const res = calculateTip(parseFloat(bill) || 0, parseFloat(tipPct) || 0, parseFloat(people) || 1);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <CurrencySelector />
            <NumberInput label="Bill Amount" prefix={currencySymbol} value={bill} onChange={setBill} min={0} />
            <div>
              <FieldLabel label="Tip Percentage" />
              <div className="flex gap-1.5 mb-2">
                {['15', '18', '20', '25'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTipPct(p)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      tipPct === p
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#EFF6FF]'
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
              <NumberInput label="Custom Tip %" suffix="%" value={tipPct} onChange={setTipPct} min={0} />
            </div>
            <NumberInput label="Split Between (People)" value={people} onChange={setPeople} min={1} step={1} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Total Per Person"
              value={fmtMoney(res.totalPerPerson)}
              subtext={
                isAr
                  ? `إجمالي الفاتورة: ${fmtMoney(res.totalBill)} (الإكرامية: ${fmtMoney(res.tipAmount)})`
                  : `Total Bill: ${fmtMoney(res.totalBill)} (Tip: ${fmtMoney(res.tipAmount)})`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Tip Amount" value={fmtMoney(res.tipAmount)} />
              <StatTile label="Tip / Person" value={fmtMoney(res.tipPerPerson)} />
              <StatTile label="Total Bill" value={fmtMoney(res.totalBill)} />
            </div>
            <ResultActions
              copyText={`Bill: ${fmtMoney(parseFloat(bill) || 0)} | Tip (${tipPct}%): ${fmtMoney(res.tipAmount)} | Total: ${fmtMoney(res.totalBill)} | Per Person: ${fmtMoney(res.totalPerPerson)}`}
              onReset={() => {
                setBill('120');
                setTipPct('18');
                setPeople('4');
              }}
            />
          </>
        }
      />
    );
  }

  if (slug === 'split-bill-calculator') {
    const res = calculateSplitBill(
      parseFloat(bill) || 0,
      parseFloat(taxPct) || 0,
      parseFloat(tipPct) || 0,
      parseFloat(people) || 1,
      tipPreTax === 'pre'
    );
    return (
      <CalcSplitLayout
        inputs={
          <>
            <CurrencySelector />
            <NumberInput label="Pre-Tax Subtotal" prefix={currencySymbol} value={bill} onChange={setBill} min={0} />
            <NumberInput label="Sales Tax" suffix="%" value={taxPct} onChange={setTaxPct} min={0} />
            <NumberInput label="Tip Percentage" suffix="%" value={tipPct} onChange={setTipPct} min={0} />
            <SegmentedControl
              label="Calculate Tip On"
              value={tipPreTax}
              onChange={setTipPreTax}
              options={[
                { value: 'pre', label: 'Pre-Tax Subtotal' },
                { value: 'post', label: 'Post-Tax Total' },
              ]}
            />
            <NumberInput label="Number of People" value={people} onChange={setPeople} min={1} step={1} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Each Person Owes"
              value={fmtMoney(res.perPersonTotal)}
              subtext={
                isAr
                  ? `الإجمالي الكلي: ${fmtMoney(res.total)} · الضريبة: ${fmtMoney(res.tax)} · الإكرامية: ${fmtMoney(res.tip)}`
                  : `Grand Total: ${fmtMoney(res.total)} · Tax: ${fmtMoney(res.tax)} · Tip: ${fmtMoney(res.tip)}`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Tax Amount" value={fmtMoney(res.tax)} />
              <StatTile label="Total Tip" value={fmtMoney(res.tip)} />
              <StatTile label="Tip / Person" value={fmtMoney(res.perPersonTip)} />
            </div>
            <ResultActions
              copyText={`Subtotal: ${fmtMoney(parseFloat(bill) || 0)} | Tax: ${fmtMoney(res.tax)} | Tip: ${fmtMoney(res.tip)} | Total: ${fmtMoney(res.total)} | Per Person (${people}): ${fmtMoney(res.perPersonTotal)}`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'discount-calculator') {
    const res = calculateDiscount(
      parseFloat(origPrice) || 0,
      parseFloat(disc1) || 0,
      parseFloat(disc2) || 0,
      parseFloat(discTax) || 0
    );
    return (
      <CalcSplitLayout
        inputs={
          <>
            <CurrencySelector />
            <NumberInput label="Original Price" prefix={currencySymbol} value={origPrice} onChange={setOrigPrice} min={0} />
            <NumberInput label="Primary Discount" suffix="%" value={disc1} onChange={setDisc1} min={0} max={100} />
            <NumberInput label="Extra Stacked Coupon (Optional)" suffix="%" value={disc2} onChange={setDisc2} min={0} max={100} />
            <NumberInput label="Sales Tax (Optional)" suffix="%" value={discTax} onChange={setDiscTax} min={0} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Final Checkout Price"
              value={fmtMoney(res.finalPrice)}
              accent="green"
              subtext={
                isAr
                  ? `توفر ${fmtMoney(res.totalSavings)} (خصم فعلي ${res.effectiveDiscountPercent.toFixed(1)}%)`
                  : `You save ${fmtMoney(res.totalSavings)} (${res.effectiveDiscountPercent.toFixed(1)}% off)`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Sale Subtotal" value={fmtMoney(res.subtotal)} />
              <StatTile label="Total Savings" value={fmtMoney(res.totalSavings)} />
              <StatTile label="Sales Tax" value={fmtMoney(res.taxAmount)} />
            </div>
            <ResultActions
              copyText={`Original: ${fmtMoney(parseFloat(origPrice) || 0)} | Final: ${fmtMoney(res.finalPrice)} | Savings: ${fmtMoney(res.totalSavings)} (${res.effectiveDiscountPercent.toFixed(1)}%)`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'sales-tax-calculator') {
    const res = calculateSalesTax(taxMode, parseFloat(taxAmountIn) || 0, parseFloat(salesTaxRate) || 0);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <CurrencySelector />
            <SegmentedControl
              label="Calculation Direction"
              value={taxMode}
              onChange={setTaxMode}
              options={[
                { value: 'forward', label: 'Add Tax to Net' },
                { value: 'reverse', label: 'Extract Tax from Total' },
              ]}
            />
            <NumberInput
              label={taxMode === 'forward' ? 'Pre-Tax Price' : 'Tax-Inclusive Total'}
              prefix={currencySymbol}
              value={taxAmountIn}
              onChange={setTaxAmountIn}
              min={0}
            />
            <NumberInput label="Sales Tax / VAT Rate" suffix="%" value={salesTaxRate} onChange={setSalesTaxRate} min={0} />
          </>
        }
        results={
          <>
            <ResultHero
              label={taxMode === 'forward' ? 'Total After Tax' : 'Extracted Pre-Tax Price'}
              value={fmtMoney(taxMode === 'forward' ? res.totalPrice : res.preTaxPrice)}
              subtext={`${isAr ? 'قيمة ضريبة المبيعات:' : 'Sales tax amount:'} ${fmtMoney(res.taxAmount)}`}
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Pre-Tax Net" value={fmtMoney(res.preTaxPrice)} />
              <StatTile label="Tax Amount" value={fmtMoney(res.taxAmount)} />
              <StatTile label="Gross Total" value={fmtMoney(res.totalPrice)} />
            </div>
            <ResultActions
              copyText={`Pre-Tax: ${fmtMoney(res.preTaxPrice)} | Tax (${salesTaxRate}%): ${fmtMoney(res.taxAmount)} | Total: ${fmtMoney(res.totalPrice)}`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'electricity-cost-calculator') {
    const res = calculateElectricityCost(
      parseFloat(watts) || 0,
      parseFloat(hoursDay) || 0,
      parseFloat(kwhRate) || 0
    );
    return (
      <CalcSplitLayout
        inputs={
          <>
            <CurrencySelector />
            <div>
              <FieldLabel label="Common Appliance Presets" />
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: isAr ? 'مصباح LED (10 واط)' : 'LED Bulb (10W)', w: '10' },
                  { label: isAr ? 'حاسوب محمول (65 واط)' : 'Laptop (65W)', w: '65' },
                  { label: isAr ? 'حاسوب ألعاب (450 واط)' : 'Gaming PC (450W)', w: '450' },
                  { label: isAr ? 'مدفأة كهربائية (1500 واط)' : 'Space Heater (1500W)', w: '1500' },
                ].map((p) => (
                  <button
                    key={p.w}
                    type="button"
                    onClick={() => setWatts(p.w)}
                    className="px-2.5 py-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] text-xs font-medium text-[#475569]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <NumberInput label="Power Consumption" suffix="W" value={watts} onChange={setWatts} min={0} />
            <NumberInput label="Usage per Day" suffix="hrs" value={hoursDay} onChange={setHoursDay} min={0} max={24} />
            <NumberInput label="Electricity Rate" prefix={currencySymbol} suffix="/kWh" value={kwhRate} onChange={setKwhRate} min={0} step="0.01" />
          </>
        }
        results={
          <>
            <ResultHero
              label="Estimated Monthly Electricity Cost (30 Days)"
              value={fmtMoney(res.costPerMonth)}
              subtext={
                isAr
                  ? `${fmtNum(res.kwhPerMonth, 2)} كيلوواط ساعة/شهر · ${fmtMoney(res.costPerYear)} سنوياً`
                  : `${fmtNum(res.kwhPerMonth, 2)} kWh/month · ${fmtMoney(res.costPerYear)} per year`
              }
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatTile label="Daily Usage" value={`${fmtNum(res.kwhPerDay, 2)} kWh`} />
              <StatTile label="Daily Cost" value={fmtMoney(res.costPerDay)} />
              <StatTile label="Annual Usage" value={`${fmtNum(res.kwhPerYear, 1)} kWh`} />
            </div>
            <ResultActions
              copyText={`Electricity Cost (${watts}W, ${hoursDay}h/day @ ${currencySymbol}${kwhRate}/kWh): ${fmtMoney(res.costPerDay)}/day, ${fmtMoney(res.costPerMonth)}/mo, ${fmtMoney(res.costPerYear)}/yr`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'fuel-cost-calculator') {
    const res = calculateFuelCost(
      parseFloat(tripDist) || 0,
      parseFloat(fuelEff) || 1,
      parseFloat(fuelPrice) || 0,
      roundTrip
    );
    return (
      <CalcSplitLayout
        inputs={
          <>
            <CurrencySelector />
            <NumberInput label="One-Way Trip Distance" suffix="mi / km" value={tripDist} onChange={setTripDist} min={0} />
            <NumberInput label="Fuel Efficiency" suffix="MPG / km·L⁻¹" value={fuelEff} onChange={setFuelEff} min={0.1} />
            <NumberInput label="Fuel Price" prefix={currencySymbol} suffix="/ unit" value={fuelPrice} onChange={setFuelPrice} min={0} step="0.01" />
            <label className="flex items-center gap-2 text-sm text-[#1E293B]">
              <input
                type="checkbox"
                checked={roundTrip}
                onChange={(e) => setRoundTrip(e.target.checked)}
              />
              <span>{isAr ? 'رحلة ذهاب وعودة (×2 المسافة)' : 'Round-trip (×2 distance)'}</span>
            </label>
          </>
        }
        results={
          <>
            <ResultHero
              label="Estimated Trip Fuel Cost"
              value={fmtMoney(res.totalCost)}
              subtext={
                isAr
                  ? `يتطلب ${fmtNum(res.fuelNeeded, 2)} غالون/لتر لمسافة ${fmtNum(res.effectiveDistance, 1)} وحدة مسافة`
                  : `Requires ${fmtNum(res.fuelNeeded, 2)} gallons/liters over ${fmtNum(res.effectiveDistance, 1)} distance units`
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Fuel Volume Needed" value={fmtNum(res.fuelNeeded, 2)} />
              <StatTile label="Fuel Cost per Distance Unit" value={fmtMoney(res.costPerDistanceUnit, 3)} />
            </div>
            <ResultActions
              copyText={`Trip Fuel Cost: ${fmtMoney(res.totalCost)} (${fmtNum(res.fuelNeeded, 2)} units for ${res.effectiveDistance} distance)`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'gpa-calculator') {
    const res = calculateGPA(courses, parseFloat(priorGpa) || 0, parseFloat(priorCredits) || 0);
    const gradeOpts = Object.keys(GRADE_POINTS).map((g) => ({
      value: g,
      label: `${g} (${GRADE_POINTS[g].toFixed(1)})`,
    }));

    return (
      <CalcSplitLayout
        inputs={
          <>
            <div className="space-y-2.5">
              <FieldLabel label="Current Semester Courses" />
              {courses.map((c, idx) => (
                <div key={c.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) =>
                      setCourses((prev) =>
                        prev.map((row) => (row.id === c.id ? { ...row, name: e.target.value } : row))
                      )
                    }
                    placeholder={isAr ? `المقرر ${idx + 1}` : `Course ${idx + 1}`}
                    className="col-span-5 h-9 rounded-lg border border-[#CBD5E1] px-2.5 text-xs"
                  />
                  <input
                    type="number"
                    dir="ltr"
                    value={c.credits}
                    min={0}
                    max={12}
                    onChange={(e) =>
                      setCourses((prev) =>
                        prev.map((row) =>
                          row.id === c.id ? { ...row, credits: parseFloat(e.target.value) || 0 } : row
                        )
                      )
                    }
                    className="col-span-3 h-9 rounded-lg border border-[#CBD5E1] px-2 text-xs tabular-nums"
                    aria-label="Credits"
                  />
                  <select
                    value={c.grade}
                    dir="ltr"
                    onChange={(e) =>
                      setCourses((prev) =>
                        prev.map((row) => (row.id === c.id ? { ...row, grade: e.target.value } : row))
                      )
                    }
                    className="col-span-3 h-9 rounded-lg border border-[#CBD5E1] px-1.5 text-xs bg-white"
                    aria-label="Letter grade"
                  >
                    {gradeOpts.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setCourses((prev) => prev.filter((row) => row.id !== c.id))}
                    disabled={courses.length <= 1}
                    aria-label="Remove course"
                    className="col-span-1 flex justify-center text-[#94A3B8] hover:text-[#DC2626] disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCourses((prev) => [
                    ...prev,
                    {
                      id: String(Date.now()),
                      name: isAr ? `المقرر ${prev.length + 1}` : `Course ${prev.length + 1}`,
                      credits: 3,
                      grade: 'A',
                    },
                  ])
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة مقرر' : 'Add Course'}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F1F5F9]">
              <NumberInput label="Prior GPA (Optional)" value={priorGpa} onChange={setPriorGpa} min={0} max={4} step="0.01" />
              <NumberInput label="Prior Credits" value={priorCredits} onChange={setPriorCredits} min={0} />
            </div>
          </>
        }
        results={
          <>
            <ResultHero
              label="Semester GPA"
              value={res.semesterGpa.toFixed(3)}
              subtext={
                isAr
                  ? `المعدل التراكمي: ${res.cumulativeGpa.toFixed(3)} عبر ${res.totalCredits} ساعة معتمدة`
                  : `Cumulative GPA: ${res.cumulativeGpa.toFixed(3)} across ${res.totalCredits} total credits`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Semester Credits" value={`${res.semesterCredits}`} />
              <StatTile label="Quality Points" value={res.semesterPoints.toFixed(2)} />
              <StatTile label="Cumulative GPA" value={res.cumulativeGpa.toFixed(3)} />
            </div>
            <ResultActions
              copyText={`Semester GPA: ${res.semesterGpa.toFixed(3)} (${res.semesterCredits} credits) | Cumulative GPA: ${res.cumulativeGpa.toFixed(3)}`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'grade-calculator') {
    const res = calculateWeightedGrade(gradeItems, parseFloat(targetGrade) || 90);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <div className="space-y-2.5">
              <FieldLabel label="Completed Assignments / Exams" hint="Score % · Weight %" />
              {gradeItems.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      setGradeItems((prev) =>
                        prev.map((r) => (r.id === item.id ? { ...r, name: e.target.value } : r))
                      )
                    }
                    placeholder={isAr ? `تقييم ${idx + 1}` : `Category ${idx + 1}`}
                    className="col-span-5 h-9 rounded-lg border border-[#CBD5E1] px-2.5 text-xs"
                  />
                  <input
                    type="number"
                    dir="ltr"
                    value={item.scorePercent}
                    onChange={(e) =>
                      setGradeItems((prev) =>
                        prev.map((r) =>
                          r.id === item.id ? { ...r, scorePercent: parseFloat(e.target.value) || 0 } : r
                        )
                      )
                    }
                    className="col-span-3 h-9 rounded-lg border border-[#CBD5E1] px-2 text-xs tabular-nums"
                    aria-label="Score percent"
                  />
                  <input
                    type="number"
                    dir="ltr"
                    value={item.weightPercent}
                    onChange={(e) =>
                      setGradeItems((prev) =>
                        prev.map((r) =>
                          r.id === item.id ? { ...r, weightPercent: parseFloat(e.target.value) || 0 } : r
                        )
                      )
                    }
                    className="col-span-3 h-9 rounded-lg border border-[#CBD5E1] px-2 text-xs tabular-nums"
                    aria-label="Weight percent"
                  />
                  <button
                    type="button"
                    onClick={() => setGradeItems((prev) => prev.filter((r) => r.id !== item.id))}
                    disabled={gradeItems.length <= 1}
                    aria-label="Remove item"
                    className="col-span-1 flex justify-center text-[#94A3B8] hover:text-[#DC2626] disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setGradeItems((prev) => [
                    ...prev,
                    {
                      id: String(Date.now()),
                      name: isAr ? `اختبار ${prev.length + 1}` : `Exam ${prev.length + 1}`,
                      scorePercent: 88,
                      weightPercent: 10,
                    },
                  ])
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة صف تقييم' : 'Add Assessment Row'}</span>
              </button>
            </div>
            <NumberInput label="Target Final Course Grade" suffix="%" value={targetGrade} onChange={setTargetGrade} min={0} max={100} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Current Weighted Average"
              value={`${res.currentAverage.toFixed(2)}% (${res.letter})`}
              subtext={
                res.neededOnRemaining !== null
                  ? isAr
                    ? `تحتاج إلى ${res.neededOnRemaining.toFixed(2)}% في الوزن المتبقي (${res.remainingWeight}%) للوصول إلى ${targetGrade}%`
                    : `Need ${res.neededOnRemaining.toFixed(2)}% on remaining ${res.remainingWeight}% weight to reach ${targetGrade}%`
                  : isAr
                  ? `تم احتساب كامل وزن المادة (${res.totalWeight}%)`
                  : `All ${res.totalWeight}% of course weight accounted for`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Completed Weight" value={`${res.totalWeight.toFixed(1)}%`} />
              <StatTile label="Remaining Weight" value={`${res.remainingWeight.toFixed(1)}%`} />
              <StatTile
                label="Needed on Final"
                value={res.neededOnRemaining !== null ? `${res.neededOnRemaining.toFixed(2)}%` : '—'}
              />
            </div>
            <ResultActions
              copyText={`Current Grade: ${res.currentAverage.toFixed(2)}% (${res.letter})${res.neededOnRemaining !== null ? ` | Needed on remaining ${res.remainingWeight}%: ${res.neededOnRemaining.toFixed(2)}%` : ''}`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'wedding-budget-calculator') {
    const budget = Math.max(0, parseFloat(weddingTotal) || 0);
    const guests = Math.max(1, parseInt(weddingGuests, 10) || 1);
    const totalPct = Object.values(weddingSplits).reduce((a, b) => a + b, 0);

    const rows = [
      { key: 'venueCatering', name: isAr ? 'القاعة والضيافة' : 'Venue & Catering', pct: weddingSplits.venueCatering },
      { key: 'photoVideo', name: isAr ? 'التصوير والفيديو' : 'Photography & Video', pct: weddingSplits.photoVideo },
      { key: 'attireBeauty', name: isAr ? 'الأزياء والتجميل' : 'Attire & Beauty', pct: weddingSplits.attireBeauty },
      { key: 'flowersDecor', name: isAr ? 'الزهور والديكور' : 'Flowers & Decor', pct: weddingSplits.flowersDecor },
      { key: 'musicEntertainment', name: isAr ? 'الموسيقى والترفيه' : 'Music & DJ', pct: weddingSplits.musicEntertainment },
      { key: 'stationeryFavors', name: isAr ? 'الدعوات والهدايا' : 'Invitations & Favors', pct: weddingSplits.stationeryFavors },
      { key: 'contingency', name: isAr ? 'احتياطي الطوارئ' : 'Contingency Buffer', pct: weddingSplits.contingency },
    ].map((r) => ({ ...r, amount: (budget * r.pct) / 100 }));

    return (
      <CalcSplitLayout
        inputs={
          <>
            <CurrencySelector />
            <NumberInput label="Total Wedding Budget" prefix={currencySymbol} value={weddingTotal} onChange={setWeddingTotal} min={0} />
            <NumberInput label="Estimated Guest Count" value={weddingGuests} onChange={setWeddingGuests} min={1} step={1} />
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#1E293B]">
                  {isAr ? 'نسب توزيع الفئات' : 'Category Percentages'}
                </span>
                <span className={totalPct === 100 ? 'text-[#16A34A] font-semibold' : 'text-[#D97706] font-semibold'}>
                  {isAr ? `الإجمالي: ${totalPct}%` : `Total: ${totalPct}%`}
                </span>
              </div>
              {rows.map((r) => (
                <div key={r.key} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#475569] truncate">{r.name}</span>
                  <div className="flex items-center gap-1.5" dir="ltr">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={r.pct}
                      onChange={(e) =>
                        setWeddingSplits((prev) => ({
                          ...prev,
                          [r.key]: Math.max(0, parseFloat(e.target.value) || 0),
                        }))
                      }
                      className="w-16 h-8 rounded border border-[#CBD5E1] px-2 text-right tabular-nums"
                    />
                    <span className="text-[#64748B]">%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        }
        results={
          <>
            <ResultHero
              label="Cost Per Guest"
              value={fmtMoney(budget / guests)}
              subtext={
                isAr
                  ? `إجمالي الميزانية: ${fmtMoney(budget)} لعدد ${guests} ضيفاً`
                  : `Total Budget: ${fmtMoney(budget)} across ${guests} guests`
              }
            />
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={rows} dataKey="amount" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                    {rows.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtMoney(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="divide-y divide-[#F1F5F9] text-sm">
              {rows.map((r, i) => (
                <div key={r.key} className="py-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#1E293B]">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    {r.name} ({r.pct}%)
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#0F172A]">
                    {fmtMoney(r.amount)}
                  </span>
                </div>
              ))}
            </div>
            <ResultActions
              copyText={`Wedding Budget ${fmtMoney(budget)} (${guests} guests, ${fmtMoney(budget / guests)}/guest)`}
            />
          </>
        }
      />
    );
  }

  // Moving Cost Calculator
  const resMove = calculateMovingCost(
    moveSize,
    parseFloat(moveDistance) || 0,
    moveTier,
    movePacking,
    parseInt(specialtyCount, 10) || 0
  );

  return (
    <CalcSplitLayout
      inputs={
        <>
          <CurrencySelector />
          <SelectInput
            label="Home Size"
            value={moveSize}
            onChange={(v) => setMoveSize(v as typeof moveSize)}
            options={[
              { value: 'studio', label: 'Studio Apartment' },
              { value: '1br', label: '1 Bedroom' },
              { value: '2br', label: '2 Bedrooms' },
              { value: '3br', label: '3 Bedrooms' },
              { value: '4br', label: '4+ Bedrooms' },
            ]}
          />
          <NumberInput label="Move Distance" suffix="miles" value={moveDistance} onChange={setMoveDistance} min={0} />
          <SelectInput
            label="Service Level"
            value={moveTier}
            onChange={(v) => setMoveTier(v as typeof moveTier)}
            options={[
              { value: 'diy', label: 'DIY Rental Truck' },
              { value: 'container', label: 'Portable Moving Container' },
              { value: 'full_service', label: 'Full-Service Movers' },
            ]}
          />
          <NumberInput label="Specialty Items (Piano, Safe)" value={specialtyCount} onChange={setSpecialtyCount} min={0} step={1} />
          <label className="flex items-center gap-2 text-sm text-[#1E293B]">
            <input type="checkbox" checked={movePacking} onChange={(e) => setMovePacking(e.target.checked)} />
            <span>{isAr ? 'تضمين خدمات التغليف الاحترافي' : 'Include professional packing services'}</span>
          </label>
        </>
      }
      results={
        <>
          <ResultHero
            label="Estimated Moving Cost Range"
            value={`${fmtMoney(resMove.estimatedLow, 0)} – ${fmtMoney(resMove.estimatedHigh, 0)}`}
            subtext={`${isAr ? 'متوسط التقدير:' : 'Midpoint estimate:'} ${fmtMoney(resMove.estimatedMid, 0)}`}
          />
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Base Labor / Truck" value={fmtMoney(resMove.baseLabor, 0)} />
            <StatTile label="Distance Charge" value={fmtMoney(resMove.distanceCost, 0)} />
            <StatTile label="Packing Services" value={fmtMoney(resMove.packingCost, 0)} />
            <StatTile label="Specialty Handling" value={fmtMoney(resMove.specialtyCost, 0)} />
          </div>
          <ResultActions
            copyText={`Moving Estimate (${moveSize}, ${moveDistance} mi, ${moveTier}): ${fmtMoney(resMove.estimatedLow, 0)} - ${fmtMoney(resMove.estimatedHigh, 0)}`}
          />
        </>
      }
    />
  );
}
