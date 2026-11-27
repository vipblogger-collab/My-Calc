import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import {
  analyzePrime,
  calculateFraction,
  calculateGCFList,
  calculateLCMList,
  calculatePercentage,
  calculateProbability,
  calculateQuadratic,
  calculateRatio,
  calculateStatistics,
  evaluateMathExpression,
  roundNumber,
  solveLinearAlgebra,
} from '../../../lib/calculators/math.ts';
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

function parseNumberList(raw: string): number[] {
  return raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

function ScientificOrBasicWidget({ isScientific }: { isScientific: boolean }) {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const [expr, setExpr] = useState(isScientific ? 'sin(30) + sqrt(16) * 2' : '125 * 4 + 45');
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string>(() => {
    try {
      return String(
        Number(
          evaluateMathExpression(isScientific ? 'sin(30) + sqrt(16) * 2' : '125 * 4 + 45', 'DEG').toFixed(10)
        )
      );
    } catch {
      return '0';
    }
  });

  const evaluate = (inputExpr = expr) => {
    try {
      const val = evaluateMathExpression(inputExpr, angleMode);
      const formatted = Number(val.toPrecision(12)).toString();
      setLastResult(formatted);
      setError(null);
      setHistory((prev) => [{ expr: inputExpr, result: formatted }, ...prev.slice(0, 9)]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid expression');
    }
  };

  useEffect(() => {
    setError(null);
  }, [expr]);

  const appendToken = (tok: string) => {
    setExpr((prev) => (prev === '0' && /^[0-9]$/.test(tok) ? tok : `${prev}${tok}`));
  };

  const sciButtons = [
    ['sin(', 'cos(', 'tan(', '(', ')'],
    ['asin(', 'acos(', 'atan(', 'log(', 'ln('],
    ['sqrt(', '^', '!', 'pi', 'e'],
  ];

  const stdButtons = [
    ['7', '8', '9', '/', 'C'],
    ['4', '5', '6', '*', '⌫'],
    ['1', '2', '3', '-', '%'],
    ['0', '.', '(', ')', '+'],
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#64748B]">
            {isScientific
              ? isAr
                ? 'مقيّم التعبيرات العلمية'
                : 'Scientific Expression Evaluator'
              : isAr
              ? 'حاسبة العمليات الأربع والذاكرة'
              : 'Four-Function & Memory Keypad'}
          </span>
          {isScientific ? (
            <div className="inline-flex p-0.5 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0]" dir="ltr">
              {(['DEG', 'RAD'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAngleMode(m)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    angleMode === m ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#64748B]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs" dir="ltr">
              <span className="text-[#64748B] me-1">M: {memory}</span>
              {(['MC', 'MR', 'M+', 'M-'] as const).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => {
                    const cur = parseFloat(lastResult) || 0;
                    if (op === 'MC') setMemory(0);
                    if (op === 'MR') appendToken(String(memory));
                    if (op === 'M+') setMemory((m) => m + cur);
                    if (op === 'M-') setMemory((m) => m - cur);
                  }}
                  className="px-2 py-1 rounded border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] font-semibold text-[#1E293B]"
                >
                  {op}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#CBD5E1] bg-[#0F172A] p-4 text-right" dir="ltr">
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                evaluate();
              }
            }}
            aria-label="Calculator expression"
            className="w-full bg-transparent text-right font-mono-tabular text-sm text-[#94A3B8] focus:outline-none"
          />
          <p className="mt-1 font-mono-tabular text-3xl font-bold text-white truncate">
            {error ? (isAr ? 'خطأ' : 'Error') : lastResult}
          </p>
        </div>

        {error && <ErrorAlert message={error} />}

        {isScientific && (
          <div className="grid grid-cols-5 gap-2" dir="ltr">
            {sciButtons.flat().map((btn) => (
              <button
                key={btn}
                type="button"
                onClick={() => appendToken(btn)}
                className="h-10 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#2563EB] font-mono-tabular text-xs font-semibold text-[#1E293B] transition-colors"
              >
                {btn}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-5 gap-2" dir="ltr">
          {stdButtons.flat().map((btn) => (
            <button
              key={btn}
              type="button"
              onClick={() => {
                if (btn === 'C') {
                  setExpr('');
                  setLastResult('0');
                  setError(null);
                } else if (btn === '⌫') {
                  setExpr((p) => p.slice(0, -1));
                } else {
                  appendToken(btn);
                }
              }}
              className={`h-11 rounded-lg border font-mono-tabular text-sm font-semibold transition-colors ${
                btn === 'C'
                  ? 'border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]'
                  : ['/', '*', '-', '+', '%'].includes(btn)
                  ? 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE]'
                  : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => evaluate()}
          className="w-full h-11 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition-colors"
        >
          {isAr ? 'احسب (=)' : 'Evaluate (=)'}
        </button>
      </div>

      <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#0F172A]">
          {isAr ? 'سجل العمليات' : 'Calculation History'}
        </h3>
        {history.length === 0 ? (
          <p className="text-xs text-[#64748B]">
            {isAr
              ? 'اضغط على احسب (=) أو Enter لتسجيل العمليات هنا.'
              : 'Press Evaluate (=) or Enter to record calculations here.'}
          </p>
        ) : (
          <ul className="divide-y divide-[#F1F5F9] max-h-80 overflow-y-auto">
            {history.map((item, i) => (
              <li key={i} className="py-2.5">
                <button
                  type="button"
                  onClick={() => setExpr(item.expr)}
                  className="w-full text-start hover:bg-[#F8FAFC] rounded p-1 transition-colors"
                  dir="ltr"
                >
                  <p className="font-mono-tabular text-xs text-[#64748B] truncate">{item.expr}</p>
                  <p className="font-mono-tabular text-sm font-semibold text-[#0F172A]">= {item.result}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
        <ResultActions copyText={`${expr} = ${lastResult}`} />
      </div>
    </div>
  );
}

export function MathWidget({ slug }: { slug: string }) {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  // Percentage
  const [pctMode, setPctMode] = useState<'percent_of' | 'what_percent' | 'percent_change'>('percent_of');
  const [pctA, setPctA] = useState('15');
  const [pctB, setPctB] = useState('240');

  // Fraction
  const [n1, setN1] = useState('1');
  const [d1, setD1] = useState('3');
  const [fracOp, setFracOp] = useState<'+' | '-' | '*' | '/'>('+');
  const [n2, setN2] = useState('1');
  const [d2, setD2] = useState('6');

  // Algebra ax+b = cx+d
  const [algA, setAlgA] = useState('3');
  const [algB, setAlgB] = useState('5');
  const [algC, setAlgC] = useState('1');
  const [algD, setAlgD] = useState('13');

  // Dataset
  const [dataInput, setDataInput] = useState('12, 18, 24, 24, 30, 36, 42');
  const [intListInput, setIntListInput] = useState('48, 180, 72');

  // Ratio
  const [ratA, setRatA] = useState('16');
  const [ratB, setRatB] = useState('9');
  const [ratC, setRatC] = useState('1920');
  const [ratD, setRatD] = useState('');

  // Exponent & Root
  const [baseX, setBaseX] = useState('2');
  const [expN, setExpN] = useState('10');
  const [rootX, setRootX] = useState('72');
  const [rootDeg, setRootDeg] = useState('2');

  // Quadratic
  const [qa, setQa] = useState('1');
  const [qb, setQb] = useState('-5');
  const [qc, setQc] = useState('6');

  // Prime
  const [primeInput, setPrimeInput] = useState('360');

  // Probability
  const [pA, setPA] = useState('0.4');
  const [pB, setPB] = useState('0.25');
  const [combN, setCombN] = useState('52');
  const [combR, setCombR] = useState('5');

  // Rounding
  const [roundVal, setRoundVal] = useState('3.14159265');
  const [roundDec, setRoundDec] = useState('2');
  const [roundMode, setRoundMode] = useState<'half_up' | 'half_even' | 'floor' | 'ceil'>('half_up');

  // RNG
  const [rngMin, setRngMin] = useState('1');
  const [rngMax, setRngMax] = useState('100');
  const [rngCount, setRngCount] = useState('5');
  const [rngUnique, setRngUnique] = useState(true);
  const [rngSorted, setRngSorted] = useState(true);
  const [rngOutput, setRngOutput] = useState<number[]>([7, 23, 42, 68, 91]);
  const [rngError, setRngError] = useState<string | null>(null);

  if (slug === 'scientific-calculator') return <ScientificOrBasicWidget isScientific />;
  if (slug === 'basic-calculator') return <ScientificOrBasicWidget isScientific={false} />;

  if (slug === 'percentage-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof calculatePercentage> | null = null;
    try {
      res = calculatePercentage(pctMode, parseFloat(pctA) || 0, parseFloat(pctB) || 0);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid input';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Calculation Mode"
              value={pctMode}
              onChange={setPctMode}
              options={[
                { value: 'percent_of', label: 'X% of Y' },
                { value: 'what_percent', label: 'X is ?% of Y' },
                { value: 'percent_change', label: '% Change' },
              ]}
            />
            <NumberInput
              label={
                pctMode === 'percent_of'
                  ? 'Percentage (X)'
                  : pctMode === 'what_percent'
                  ? 'Part Value (X)'
                  : 'Initial Value (Old)'
              }
              suffix={pctMode === 'percent_of' ? '%' : undefined}
              value={pctA}
              onChange={setPctA}
            />
            <NumberInput
              label={
                pctMode === 'percent_of'
                  ? 'Base Value (Y)'
                  : pctMode === 'what_percent'
                  ? 'Whole Value (Y)'
                  : 'New Value'
              }
              value={pctB}
              onChange={setPctB}
            />
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid input'} />
          ) : (
            <>
              <ResultHero
                label="Result"
                value={`${fmtNum(res.result, 6)}${pctMode === 'percent_of' ? '' : '%'}`}
                subtext={res.formula}
              />
              <ResultActions copyText={res.formula} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'fraction-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof calculateFraction> | null = null;
    try {
      res = calculateFraction(
        parseInt(n1, 10) || 0,
        parseInt(d1, 10) || 0,
        fracOp,
        parseInt(n2, 10) || 0,
        parseInt(d2, 10) || 0
      );
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid fraction';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Numerator 1" value={n1} onChange={setN1} step={1} />
              <NumberInput label="Denominator 1" value={d1} onChange={setD1} step={1} />
            </div>
            <SegmentedControl
              label="Operation"
              value={fracOp}
              onChange={setFracOp}
              options={[
                { value: '+', label: 'Add (+)' },
                { value: '-', label: 'Sub (−)' },
                { value: '*', label: 'Mul (×)' },
                { value: '/', label: 'Div (÷)' },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Numerator 2" value={n2} onChange={setN2} step={1} />
              <NumberInput label="Denominator 2" value={d2} onChange={setD2} step={1} />
            </div>
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid fraction'} />
          ) : (
            <>
              <ResultHero
                label="Simplified Fraction"
                value={res.denominator === 1 ? `${res.numerator}` : `${res.numerator} / ${res.denominator}`}
                subtext={`${isAr ? 'الخطوة:' : 'Step:'} ${res.stepDesc}`}
              />
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Mixed Number" value={res.mixed} />
                <StatTile label="Decimal Value" value={fmtNum(res.decimal, 8)} />
              </div>
              <ResultActions copyText={`${n1}/${d1} ${fracOp} ${n2}/${d2} = ${res.numerator}/${res.denominator} (${res.decimal})`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'algebra-calculator') {
    const res = solveLinearAlgebra(
      parseFloat(algA) || 0,
      parseFloat(algB) || 0,
      parseFloat(algC) || 0,
      parseFloat(algD) || 0
    );
    return (
      <CalcSplitLayout
        inputs={
          <>
            <p className="text-xs text-[#64748B]">
              {isAr ? 'حل المعادلة الخطية:' : 'Solve linear equation:'} <span dir="ltr">ax + b = cx + d</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="a (Left x coeff)" value={algA} onChange={setAlgA} />
              <NumberInput label="b (Left constant)" value={algB} onChange={setAlgB} />
              <NumberInput label="c (Right x coeff)" value={algC} onChange={setAlgC} />
              <NumberInput label="d (Right constant)" value={algD} onChange={setAlgD} />
            </div>
          </>
        }
        results={
          <>
            <ResultHero
              label="Solution"
              value={
                res.status === 'unique'
                  ? `x = ${fmtNum(res.x!, 6)}`
                  : res.status === 'infinite'
                  ? isAr
                    ? 'جميع الأعداد الحقيقية (∞)'
                    : 'All Real Numbers (∞)'
                  : isAr
                  ? 'لا يوجد حل (∅)'
                  : 'No Solution (∅)'
              }
            />
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-1.5">
              <p className="text-xs font-semibold text-[#475569]">
                {isAr ? 'الحل خطوة بخطوة' : 'Step-by-Step Solution'}
              </p>
              {res.steps.map((s, idx) => (
                <p key={idx} className="font-mono-tabular text-xs text-[#0F172A]" dir="ltr">
                  {idx + 1}. {s}
                </p>
              ))}
            </div>
            <ResultActions copyText={res.steps.join(' -> ')} />
          </>
        }
      />
    );
  }

  if (slug === 'average-calculator' || slug === 'statistics-calculator') {
    const vals = parseNumberList(dataInput);
    let err: string | null = null;
    let res: ReturnType<typeof calculateStatistics> | null = null;
    try {
      res = calculateStatistics(vals);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Enter valid numbers';
    }
    return (
      <CalcSplitLayout
        inputs={
          <div>
            <FieldLabel label="Numbers Dataset" hint="Comma, space, or newline separated" />
            <textarea
              rows={5}
              dir="ltr"
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-3 text-sm font-mono-tabular text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25"
            />
          </div>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid dataset'} />
          ) : (
            <>
              <ResultHero
                label={slug === 'average-calculator' ? 'Arithmetic Mean (Average)' : 'Mean & Sample Std Dev'}
                value={
                  slug === 'average-calculator'
                    ? fmtNum(res.mean, 6)
                    : `x̄ = ${fmtNum(res.mean, 4)} · s = ${fmtNum(res.sampleStdDev, 4)}`
                }
                subtext={
                  isAr
                    ? `العدد: ${res.count} · المجموع: ${fmtNum(res.sum, 4)} · الوسيط: ${fmtNum(res.median, 4)}`
                    : `Count: ${res.count} · Sum: ${fmtNum(res.sum, 4)} · Median: ${fmtNum(res.median, 4)}`
                }
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <StatTile label="Median" value={fmtNum(res.median, 4)} />
                <StatTile label="Mode" value={res.modes.length ? res.modes.join(', ') : isAr ? 'لا يوجد' : 'None'} />
                <StatTile label="Range (Max−Min)" value={fmtNum(res.range, 4)} />
                <StatTile label="Sample Std Dev (s)" value={fmtNum(res.sampleStdDev, 4)} />
                <StatTile label="Pop. Std Dev (σ)" value={fmtNum(res.popStdDev, 4)} />
                <StatTile label="IQR (Q3 − Q1)" value={fmtNum(res.iqr, 4)} />
                <StatTile label="Min / Max" value={`${fmtNum(res.min, 3)} / ${fmtNum(res.max, 3)}`} />
                <StatTile label="Q1 / Q3" value={`${fmtNum(res.q1, 3)} / ${fmtNum(res.q3, 3)}`} />
                <StatTile
                  label="Geometric Mean"
                  value={res.geometricMean !== null ? fmtNum(res.geometricMean, 4) : isAr ? 'غير متاح (≤0)' : 'N/A (≤0)'}
                />
              </div>
              <ResultActions
                copyText={`Count=${res.count}, Mean=${res.mean.toFixed(4)}, Median=${res.median}, Sample SD=${res.sampleStdDev.toFixed(4)}`}
              />
            </>
          )
        }
      />
    );
  }

  if (slug === 'ratio-calculator') {
    const parseOpt = (s: string) => (s.trim() === '' ? null : parseFloat(s));
    let err: string | null = null;
    let res: ReturnType<typeof calculateRatio> | null = null;
    try {
      res = calculateRatio(parseOpt(ratA), parseOpt(ratB), parseOpt(ratC), parseOpt(ratD));
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid ratio';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <p className="text-xs text-[#64748B]">
              {isAr ? 'اترك حقلاً واحداً فقط فارغاً لحل التناسب A : B = C : D.' : 'Leave exactly ONE field blank to solve A : B = C : D.'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="A" value={ratA} onChange={setRatA} placeholder="?" />
              <NumberInput label="B" value={ratB} onChange={setRatB} placeholder="?" />
              <NumberInput label="C" value={ratC} onChange={setRatC} placeholder="?" />
              <NumberInput label="D" value={ratD} onChange={setRatD} placeholder="?" />
            </div>
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid ratio'} />
          ) : (
            <>
              <ResultHero
                label="Solved Proportion"
                value={`${fmtNum(res.a, 4)} : ${fmtNum(res.b, 4)} = ${fmtNum(res.c, 4)} : ${fmtNum(res.d, 4)}`}
              />
              <ResultActions copyText={`${res.a} : ${res.b} = ${res.c} : ${res.d}`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'exponent-calculator') {
    const x = parseFloat(baseX);
    const n = parseFloat(expN);
    const val = Math.pow(x, n);
    const valid = Number.isFinite(val);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Base (x)" value={baseX} onChange={setBaseX} />
            <NumberInput label="Exponent (n)" value={expN} onChange={setExpN} />
          </>
        }
        results={
          valid ? (
            <>
              <ResultHero
                label={`${x}^(${n}) equals`}
                value={Math.abs(val) >= 1e9 || (Math.abs(val) > 0 && Math.abs(val) < 1e-6) ? val.toExponential(6) : fmtNum(val, 8)}
                subtext={`${isAr ? 'الترميز العلمي:' : 'Scientific notation:'} ${val.toExponential(6)}`}
              />
              <ResultActions copyText={`${x}^${n} = ${val}`} />
            </>
          ) : (
            <ErrorAlert message="Result is undefined or exceeds numeric range." />
          )
        }
      />
    );
  }

  if (slug === 'square-root-calculator') {
    const x = parseFloat(rootX);
    const deg = Math.max(1, parseInt(rootDeg, 10) || 2);
    const invalidEvenNeg = deg % 2 === 0 && x < 0;
    const val = !invalidEvenNeg
      ? x < 0
        ? -Math.pow(-x, 1 / deg)
        : Math.pow(x, 1 / deg)
      : NaN;

    // Simplified square radical when deg=2 and positive integer
    let radical = '';
    if (deg === 2 && Number.isInteger(x) && x > 0) {
      let outside = 1;
      let inside = x;
      for (let f = 2; f * f <= inside; f++) {
        while (inside % (f * f) === 0) {
          outside *= f;
          inside /= f * f;
        }
      }
      radical = inside === 1 ? `${outside}` : outside === 1 ? `√${inside}` : `${outside}√${inside}`;
    }

    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Number (x)" value={rootX} onChange={setRootX} />
            <NumberInput label="Root Degree (n)" value={rootDeg} onChange={setRootDeg} min={1} max={20} step={1} />
          </>
        }
        results={
          invalidEvenNeg || !Number.isFinite(val) ? (
            <ErrorAlert message="Even roots of negative numbers are complex (non-real)." />
          ) : (
            <>
              <ResultHero
                label={
                  isAr
                    ? deg === 2
                      ? 'الجذر التربيعي الرئيسي'
                      : deg === 3
                      ? 'الجذر التكعيبي الرئيسي'
                      : `الجذر من الدرجة ${deg}`
                    : `Principal ${deg === 2 ? 'Square' : deg === 3 ? 'Cube' : `${deg}th`} Root`
                }
                value={fmtNum(val, 8)}
                subtext={radical ? `${isAr ? 'الجذر المبسط:' : 'Simplified radical:'} ${radical}` : undefined}
              />
              <ResultActions copyText={`${deg}th root of ${x} = ${val}${radical ? ` (${radical})` : ''}`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'quadratic-equation-calculator') {
    const a = parseFloat(qa) || 0;
    const b = parseFloat(qb) || 0;
    const c = parseFloat(qc) || 0;
    let err: string | null = null;
    let res: ReturnType<typeof calculateQuadratic> | null = null;
    try {
      res = calculateQuadratic(a, b, c);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid quadratic coefficients';
    }

    const plotData = (() => {
      if (!res) return [];
      const vx = res.vertexX;
      const span = Math.max(4, res.realRoots.length ? Math.abs(res.realRoots[0] - vx) * 2 + 2 : 5);
      const pts: { x: number; y: number }[] = [];
      for (let i = -20; i <= 20; i++) {
        const xVal = vx + (i / 20) * span;
        pts.push({
          x: Number(xVal.toFixed(2)),
          y: Number((a * xVal * xVal + b * xVal + c).toFixed(3)),
        });
      }
      return pts;
    })();

    return (
      <CalcSplitLayout
        inputs={
          <>
            <p className="text-xs text-[#64748B]">
              {isAr ? 'حل المعادلة:' : 'Solve'} <span dir="ltr">ax² + bx + c = 0</span>
            </p>
            <NumberInput label="Coefficient a" value={qa} onChange={setQa} />
            <NumberInput label="Coefficient b" value={qb} onChange={setQb} />
            <NumberInput label="Constant c" value={qc} onChange={setQc} />
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid coefficients'} />
          ) : (
            <>
              <ResultHero
                label={res.nature}
                value={res.rootsFormatted.join('   |   ')}
                subtext={
                  isAr
                    ? `المميز Δ = ${res.discriminant} · رأس القطع (${res.vertexX.toFixed(3)}, ${res.vertexY.toFixed(3)})`
                    : `Discriminant Δ = ${res.discriminant} · Vertex at (${res.vertexX.toFixed(3)}, ${res.vertexY.toFixed(3)})`
                }
              />
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={plotData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="x" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <ReferenceLine y={0} stroke="#64748B" strokeDasharray="2 2" />
                    <Tooltip />
                    <Line type="monotone" dataKey="y" stroke="#2563EB" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <ResultActions copyText={`${a}x² + ${b}x + ${c} = 0 => ${res.rootsFormatted.join(', ')}`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'prime-number-calculator') {
    const res = analyzePrime(parseFloat(primeInput) || 2);
    return (
      <CalcSplitLayout
        inputs={
          <NumberInput label="Integer to Analyze" value={primeInput} onChange={setPrimeInput} min={0} step={1} />
        }
        results={
          <>
            <ResultHero
              label={isAr ? `اختبار الأولية للعدد ${res.n}` : `Primality Test for ${res.n}`}
              value={
                res.isPrime
                  ? isAr
                    ? 'عدد أولي'
                    : 'Prime Number'
                  : isAr
                  ? 'عدد مركب / غير أولي'
                  : 'Composite / Not Prime'
              }
              accent={res.isPrime ? 'green' : 'blue'}
              subtext={`${isAr ? 'التحليل إلى عوامل أولية:' : 'Prime Factorization:'} ${res.factorizationStr}`}
            />
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Previous Prime" value={res.prevPrime ? String(res.prevPrime) : isAr ? 'لا يوجد' : 'None'} />
              <StatTile label="Next Prime" value={String(res.nextPrime)} />
            </div>
            <ResultActions copyText={`${res.n}: ${res.isPrime ? 'Prime' : 'Composite'} (${res.factorizationStr})`} />
          </>
        }
      />
    );
  }

  if (slug === 'gcf-calculator' || slug === 'lcm-calculator') {
    const nums = parseNumberList(intListInput);
    const gcfRes = calculateGCFList(nums);
    const lcmRes = calculateLCMList(nums);

    return (
      <CalcSplitLayout
        inputs={
          <div>
            <FieldLabel label="Integers (comma or space separated)" />
            <input
              type="text"
              dir="ltr"
              value={intListInput}
              onChange={(e) => setIntListInput(e.target.value)}
              className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm font-mono-tabular"
            />
          </div>
        }
        results={
          nums.length === 0 ? (
            <ErrorAlert message="Enter at least one positive integer." />
          ) : (
            <>
              <ResultHero
                label={slug === 'gcf-calculator' ? 'Greatest Common Factor (GCF)' : 'Least Common Multiple (LCM)'}
                value={fmtNum(slug === 'gcf-calculator' ? gcfRes.gcf : lcmRes.lcm, 0)}
                subtext={`GCF: ${fmtNum(gcfRes.gcf, 0)} · LCM: ${fmtNum(lcmRes.lcm, 0)}`}
              />
              {gcfRes.steps.length > 0 && (
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs font-mono-tabular space-y-1">
                  <p className="font-sans font-semibold text-[#475569]">
                    {isAr ? 'خطوات الخوارزمية الإقليدية' : 'Euclidean Reduction Steps'}
                  </p>
                  <div dir="ltr" className="space-y-1">
                    {gcfRes.steps.map((s, idx) => (
                      <p key={idx}>{s}</p>
                    ))}
                  </div>
                </div>
              )}
              <ResultActions copyText={`Numbers: ${nums.join(', ')} | GCF = ${gcfRes.gcf} | LCM = ${lcmRes.lcm}`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'probability-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof calculateProbability> | null = null;
    try {
      res = calculateProbability(
        parseFloat(pA) || 0,
        parseFloat(pB) || 0,
        parseInt(combN, 10) || 0,
        parseInt(combR, 10) || 0
      );
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid inputs';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="P(A) (0 to 1)" value={pA} onChange={setPA} min={0} max={1} step="0.01" />
              <NumberInput label="P(B) (0 to 1)" value={pB} onChange={setPB} min={0} max={1} step="0.01" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F1F5F9]">
              <NumberInput label="Total items (n)" value={combN} onChange={setCombN} min={0} max={170} step={1} />
              <NumberInput label="Chosen items (r)" value={combR} onChange={setCombR} min={0} max={170} step={1} />
            </div>
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid inputs'} />
          ) : (
            <>
              <ResultHero
                label="Independent Events & Combinatorics"
                value={`P(A ∩ B) = ${(res.pAandB * 100).toFixed(2)}%`}
                subtext={`P(A ∪ B) = ${(res.pAorB * 100).toFixed(2)}% · nCr = ${fmtNum(res.nCr, 0)}`}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <StatTile label="P(not A)" value={`${(res.pNotA * 100).toFixed(2)}%`} />
                <StatTile label="P(A or B)" value={`${(res.pAorB * 100).toFixed(2)}%`} />
                <StatTile label="P(A XOR B)" value={`${(res.pAxorB * 100).toFixed(2)}%`} />
                <StatTile label="Combinations (nCr)" value={fmtNum(res.nCr, 0)} />
                <StatTile label="Permutations (nPr)" value={fmtNum(res.nPr, 0)} />
              </div>
              <ResultActions copyText={`P(A∩B)=${res.pAandB}, P(A∪B)=${res.pAorB}, nCr=${res.nCr}, nPr=${res.nPr}`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'rounding-calculator') {
    const val = parseFloat(roundVal);
    const dec = parseInt(roundDec, 10) || 0;
    const valid = Number.isFinite(val);
    const rounded = valid ? roundNumber(val, dec, roundMode) : NaN;
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Number to Round" value={roundVal} onChange={setRoundVal} />
            <SelectInput
              label="Target Precision"
              value={roundDec}
              onChange={setRoundDec}
              options={[
                { value: '4', label: 'Ten-Thousandths (4 decimals)' },
                { value: '3', label: 'Thousandths (3 decimals)' },
                { value: '2', label: 'Hundredths (2 decimals)' },
                { value: '1', label: 'Tenths (1 decimal)' },
                { value: '0', label: 'Nearest Integer (0)' },
                { value: '-1', label: 'Nearest Ten (-1)' },
                { value: '-2', label: 'Nearest Hundred (-2)' },
              ]}
            />
            <SelectInput
              label="Rounding Mode"
              value={roundMode}
              onChange={(v) => setRoundMode(v as typeof roundMode)}
              options={[
                { value: 'half_up', label: 'Half-Up (Standard)' },
                { value: 'half_even', label: "Half-Even (Banker's)" },
                { value: 'floor', label: 'Floor (Toward −∞)' },
                { value: 'ceil', label: 'Ceiling (Toward +∞)' },
              ]}
            />
          </>
        }
        results={
          valid ? (
            <>
              <ResultHero label="Rounded Output" value={String(rounded)} />
              <ResultActions copyText={`Rounded ${val} (${roundMode}) = ${rounded}`} />
            </>
          ) : (
            <ErrorAlert message="Enter a valid number." />
          )
        }
      />
    );
  }

  // Random Number Generator
  const generateRandoms = () => {
    const min = Math.ceil(parseFloat(rngMin));
    const max = Math.floor(parseFloat(rngMax));
    const cnt = Math.max(1, Math.min(500, Math.floor(parseFloat(rngCount) || 1)));
    if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
      setRngError(isAr ? 'يجب أن يكون الحد الأدنى أقل من أو يساوي الحد الأقصى.' : 'Minimum must be less than or equal to Maximum.');
      return;
    }
    const span = max - min + 1;
    if (rngUnique && cnt > span) {
      setRngError(
        isAr
          ? `يوجد ${span} أعداد صحيحة فريدة فقط في النطاق [${min}, ${max}].`
          : `Only ${span} unique integers exist in [${min}, ${max}].`
      );
      return;
    }
    setRngError(null);

    const randInt = (lo: number, hi: number) => {
      const range = hi - lo + 1;
      const limit = Math.floor(0x100000000 / range) * range;
      const buf = new Uint32Array(1);
      let r = 0;
      do {
        crypto.getRandomValues(buf);
        r = buf[0];
      } while (r >= limit);
      return lo + (r % range);
    };

    const chosen: number[] = [];
    const seen = new Set<number>();
    while (chosen.length < cnt) {
      const n = randInt(min, max);
      if (rngUnique) {
        if (!seen.has(n)) {
          seen.add(n);
          chosen.push(n);
        }
      } else {
        chosen.push(n);
      }
    }
    if (rngSorted) chosen.sort((a, b) => a - b);
    setRngOutput(chosen);
  };

  return (
    <CalcSplitLayout
      inputs={
        <>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Minimum" value={rngMin} onChange={setRngMin} step={1} />
            <NumberInput label="Maximum" value={rngMax} onChange={setRngMax} step={1} />
          </div>
          <NumberInput label="How Many Numbers" value={rngCount} onChange={setRngCount} min={1} max={500} step={1} />
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-[#1E293B]">
              <input type="checkbox" checked={rngUnique} onChange={(e) => setRngUnique(e.target.checked)} />
              <span>{isAr ? 'أرقام فريدة فقط (بدون تكرار)' : 'Unique numbers only (no duplicates)'}</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-[#1E293B]">
              <input type="checkbox" checked={rngSorted} onChange={(e) => setRngSorted(e.target.checked)} />
              <span>{isAr ? 'ترتيب الناتج تصاعدياً' : 'Sort output ascending'}</span>
            </label>
          </div>
          <button
            type="button"
            onClick={generateRandoms}
            className="w-full h-10 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
          >
            {isAr ? 'توليد أرقام عشوائية' : 'Generate Random Numbers'}
          </button>
        </>
      }
      results={
        rngError ? (
          <ErrorAlert message={rngError} />
        ) : (
          <>
            <ResultHero
              label={isAr ? `تم توليد ${rngOutput.length} أرقام` : `Generated ${rngOutput.length} Number(s)`}
              value={rngOutput.join(', ')}
            />
            <ResultActions copyText={rngOutput.join(', ')} />
          </>
        )
      }
    />
  );
}
