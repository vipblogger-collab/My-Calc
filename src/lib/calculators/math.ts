export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcmTwo(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a) * Math.round(b)) / gcd(a, b);
}

export function calculateGCFList(numbers: number[]) {
  const clean = numbers.map((n) => Math.abs(Math.round(n))).filter((n) => n > 0);
  if (clean.length === 0) return { gcf: 0, steps: [] as string[] };
  let current = clean[0];
  const steps: string[] = [];
  for (let i = 1; i < clean.length; i++) {
    const next = gcd(current, clean[i]);
    steps.push(`gcd(${current}, ${clean[i]}) = ${next}`);
    current = next;
  }
  return { gcf: current, steps };
}

export function calculateLCMList(numbers: number[]) {
  const clean = numbers.map((n) => Math.abs(Math.round(n))).filter((n) => n > 0);
  if (clean.length === 0) return { lcm: 0, gcf: 0 };
  let currentLcm = clean[0];
  let currentGcf = clean[0];
  for (let i = 1; i < clean.length; i++) {
    currentLcm = lcmTwo(currentLcm, clean[i]);
    currentGcf = gcd(currentGcf, clean[i]);
  }
  return { lcm: currentLcm, gcf: currentGcf };
}

export function calculateFraction(
  n1: number,
  d1: number,
  op: '+' | '-' | '*' | '/',
  n2: number,
  d2: number
) {
  if (d1 === 0 || d2 === 0) {
    throw new Error('Denominator cannot be zero.');
  }
  if (op === '/' && n2 === 0) {
    throw new Error('Cannot divide by a fraction with numerator 0.');
  }

  let rawNum = 0;
  let rawDen = 1;
  let stepDesc = '';

  switch (op) {
    case '+':
      rawNum = n1 * d2 + n2 * d1;
      rawDen = d1 * d2;
      stepDesc = `(${n1}×${d2} + ${n2}×${d1}) / (${d1}×${d2}) = ${rawNum}/${rawDen}`;
      break;
    case '-':
      rawNum = n1 * d2 - n2 * d1;
      rawDen = d1 * d2;
      stepDesc = `(${n1}×${d2} - ${n2}×${d1}) / (${d1}×${d2}) = ${rawNum}/${rawDen}`;
      break;
    case '*':
      rawNum = n1 * n2;
      rawDen = d1 * d2;
      stepDesc = `(${n1}×${n2}) / (${d1}×${d2}) = ${rawNum}/${rawDen}`;
      break;
    case '/':
      rawNum = n1 * d2;
      rawDen = d1 * n2;
      stepDesc = `(${n1}×${d2}) / (${d1}×${n2}) = ${rawNum}/${rawDen}`;
      break;
  }

  if (rawDen < 0) {
    rawNum = -rawNum;
    rawDen = -rawDen;
  }

  const divisor = rawNum === 0 ? 1 : gcd(rawNum, rawDen);
  const num = rawNum / divisor;
  const den = rawNum === 0 ? 1 : rawDen / divisor;
  const decimal = num / den;

  const whole = Math.trunc(num / den);
  const rem = Math.abs(num % den);
  const mixed =
    rem === 0
      ? `${whole}`
      : whole === 0
      ? `${num}/${den}`
      : `${whole} ${rem}/${den}`;

  return { numerator: num, denominator: den, decimal, mixed, stepDesc };
}

export function calculatePercentage(
  mode: 'percent_of' | 'what_percent' | 'percent_change',
  a: number,
  b: number
) {
  if (mode === 'percent_of') {
    const result = (a / 100) * b;
    return { result, formula: `(${a} / 100) × ${b} = ${result}` };
  }
  if (mode === 'what_percent') {
    if (b === 0) throw new Error('Base value cannot be zero.');
    const result = (a / b) * 100;
    return { result, formula: `(${a} / ${b}) × 100 = ${result}%` };
  }
  if (a === 0) throw new Error('Initial value cannot be zero for percentage change.');
  const result = ((b - a) / Math.abs(a)) * 100;
  return {
    result,
    formula: `((${b} - ${a}) / |${a}|) × 100 = ${result}%`,
  };
}

export function calculateQuadratic(a: number, b: number, c: number) {
  if (a === 0) {
    throw new Error('Coefficient "a" must be non-zero for a quadratic equation.');
  }
  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    return {
      discriminant,
      nature: 'Two Real Roots' as const,
      rootsFormatted: [`x₁ = ${Number(x1.toFixed(6))}`, `x₂ = ${Number(x2.toFixed(6))}`],
      realRoots: [x1, x2],
      vertexX,
      vertexY,
    };
  }
  if (discriminant === 0) {
    const x = -b / (2 * a);
    return {
      discriminant,
      nature: 'One Repeated Real Root' as const,
      rootsFormatted: [`x = ${Number(x.toFixed(6))}`],
      realRoots: [x],
      vertexX,
      vertexY,
    };
  }
  const realPart = -b / (2 * a);
  const imagPart = Math.sqrt(-discriminant) / (2 * a);
  return {
    discriminant,
    nature: 'Two Complex Conjugate Roots' as const,
    rootsFormatted: [
      `x₁ = ${Number(realPart.toFixed(4))} + ${Number(Math.abs(imagPart).toFixed(4))}i`,
      `x₂ = ${Number(realPart.toFixed(4))} - ${Number(Math.abs(imagPart).toFixed(4))}i`,
    ],
    realRoots: [] as number[],
    vertexX,
    vertexY,
  };
}

export function calculateStatistics(values: number[]) {
  if (values.length === 0) {
    throw new Error('Enter at least one valid number.');
  }
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / count;
  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  const medianOf = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
  };
  const median = medianOf(sorted);
  const lowerHalf = sorted.slice(0, Math.floor(count / 2));
  const upperHalf = sorted.slice(Math.ceil(count / 2));
  const q1 = lowerHalf.length > 0 ? medianOf(lowerHalf) : sorted[0];
  const q3 = upperHalf.length > 0 ? medianOf(upperHalf) : sorted[count - 1];
  const iqr = q3 - q1;

  const freq = new Map<number, number>();
  let maxFreq = 0;
  for (const v of sorted) {
    const next = (freq.get(v) || 0) + 1;
    freq.set(v, next);
    if (next > maxFreq) maxFreq = next;
  }
  const modes =
    maxFreq > 1 ? Array.from(freq.entries()).filter(([, f]) => f === maxFreq).map(([v]) => v) : [];

  const sqDiffSum = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const popVariance = sqDiffSum / count;
  const popStdDev = Math.sqrt(popVariance);
  const sampleVariance = count > 1 ? sqDiffSum / (count - 1) : 0;
  const sampleStdDev = Math.sqrt(sampleVariance);

  const allPositive = sorted.every((v) => v > 0);
  const geometricMean = allPositive
    ? Math.exp(sorted.reduce((acc, v) => acc + Math.log(v), 0) / count)
    : null;

  return {
    count,
    sum,
    mean,
    median,
    modes,
    min,
    max,
    range,
    q1,
    q3,
    iqr,
    popVariance,
    popStdDev,
    sampleVariance,
    sampleStdDev,
    geometricMean,
    sorted,
  };
}

export function analyzePrime(nInput: number) {
  const n = Math.round(nInput);
  if (n < 2) {
    return {
      n,
      isPrime: false,
      factors: [] as { prime: number; power: number }[],
      factorizationStr: n <= 1 ? 'Not applicable for integers < 2' : '',
      nextPrime: 2,
      prevPrime: null as number | null,
    };
  }

  const isPrimeNum = (k: number) => {
    if (k < 2) return false;
    if (k === 2 || k === 3) return true;
    if (k % 2 === 0 || k % 3 === 0) return false;
    for (let i = 5; i * i <= k; i += 6) {
      if (k % i === 0 || k % (i + 2) === 0) return false;
    }
    return true;
  };

  let temp = n;
  const factors: { prime: number; power: number }[] = [];
  for (let p = 2; p * p <= temp; p++) {
    if (temp % p === 0) {
      let power = 0;
      while (temp % p === 0) {
        temp /= p;
        power++;
      }
      factors.push({ prime: p, power });
    }
  }
  if (temp > 1) {
    factors.push({ prime: temp, power: 1 });
  }

  const isPrime = factors.length === 1 && factors[0].power === 1;
  const factorizationStr = factors
    .map((f) => (f.power > 1 ? `${f.prime}^${f.power}` : `${f.prime}`))
    .join(' × ');

  let nextPrime = n + 1;
  while (!isPrimeNum(nextPrime)) nextPrime++;

  let prevPrime: number | null = n > 2 ? n - 1 : null;
  while (prevPrime !== null && prevPrime >= 2 && !isPrimeNum(prevPrime)) {
    prevPrime--;
  }
  if (prevPrime !== null && prevPrime < 2) prevPrime = null;

  return { n, isPrime, factors, factorizationStr, nextPrime, prevPrime };
}

export function solveLinearAlgebra(a: number, b: number, c: number, d: number) {
  // ax + b = cx + d => (a - c)x = d - b
  const coeffX = a - c;
  const rhs = d - b;
  if (coeffX === 0) {
    if (rhs === 0) {
      return { status: 'infinite' as const, x: null, steps: [`${a}x + ${b} = ${c}x + ${d}`, '0 = 0 (Infinitely many solutions)'] };
    }
    return { status: 'none' as const, x: null, steps: [`${a}x + ${b} = ${c}x + ${d}`, `0 = ${rhs} (No solution)`] };
  }
  const x = rhs / coeffX;
  return {
    status: 'unique' as const,
    x,
    steps: [
      `Start: ${a}x + (${b}) = ${c}x + (${d})`,
      `Subtract ${c}x from both sides: ${coeffX}x + (${b}) = ${d}`,
      `Subtract ${b} from both sides: ${coeffX}x = ${rhs}`,
      `Divide by ${coeffX}: x = ${Number(x.toFixed(6))}`,
    ],
  };
}

export function calculateRatio(
  a: number | null,
  b: number | null,
  c: number | null,
  d: number | null
) {
  const nulls = [a, b, c, d].filter((v) => v === null || Number.isNaN(v)).length;
  if (nulls !== 1) {
    throw new Error('Leave exactly ONE of the four ratio fields blank to solve for it.');
  }
  if (a === null) {
    if (!d) throw new Error('D cannot be zero.');
    return { a: (b! * c!) / d, b: b!, c: c!, d: d! };
  }
  if (b === null) {
    if (!c) throw new Error('C cannot be zero.');
    return { a: a!, b: (a! * d!) / c, c: c!, d: d! };
  }
  if (c === null) {
    if (!b) throw new Error('B cannot be zero.');
    return { a: a!, b: b!, c: (a! * d!) / b, d: d! };
  }
  if (!a) throw new Error('A cannot be zero.');
  return { a: a!, b: b!, c: c!, d: (b! * c!) / a };
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires a non-negative integer.');
  if (n > 170) throw new Error('Overflow: n must be ≤ 170.');
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function calculateProbability(pA: number, pB: number, n: number, r: number) {
  const a = Math.max(0, Math.min(1, pA));
  const b = Math.max(0, Math.min(1, pB));
  const pNotA = 1 - a;
  const pAandB = a * b;
  const pAorB = a + b - pAandB;
  const pAxorB = a + b - 2 * pAandB;

  const nInt = Math.max(0, Math.min(170, Math.floor(n)));
  const rInt = Math.max(0, Math.min(nInt, Math.floor(r)));
  const nPr = factorial(nInt) / factorial(nInt - rInt);
  const nCr = nPr / factorial(rInt);

  return { pNotA, pAandB, pAorB, pAxorB, nPr, nCr };
}

export function roundNumber(
  value: number,
  decimals: number,
  mode: 'half_up' | 'half_even' | 'floor' | 'ceil'
): number {
  const factor = Math.pow(10, decimals);
  const scaled = value * factor;
  if (mode === 'floor') return Math.floor(scaled) / factor;
  if (mode === 'ceil') return Math.ceil(scaled) / factor;
  if (mode === 'half_even') {
    const fl = Math.floor(scaled);
    const diff = scaled - fl;
    if (Math.abs(diff - 0.5) < 1e-10) {
      return (fl % 2 === 0 ? fl : fl + 1) / factor;
    }
    return Math.round(scaled) / factor;
  }
  return Math.round(scaled + (scaled >= 0 ? 1e-12 : -1e-12)) / factor;
}

// Safe recursive-descent math expression evaluator (no eval/Function)
export function evaluateMathExpression(expr: string, angleMode: 'DEG' | 'RAD' = 'DEG'): number {
  const clean = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .trim();

  if (!clean) throw new Error('Empty expression');

  const tokens: string[] = [];
  let i = 0;
  while (i < clean.length) {
    const ch = clean[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let num = ch;
      i++;
      while (i < clean.length && /[0-9.eE]/.test(clean[i])) {
        if ((clean[i] === 'e' || clean[i] === 'E') && (clean[i + 1] === '+' || clean[i + 1] === '-')) {
          num += clean[i] + clean[i + 1];
          i += 2;
        } else {
          num += clean[i++];
        }
      }
      tokens.push(num);
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let id = ch;
      i++;
      while (i < clean.length && /[a-zA-Z0-9]/.test(clean[i])) id += clean[i++];
      tokens.push(id.toLowerCase());
      continue;
    }
    if ('+-*/^()%!'.includes(ch)) {
      tokens.push(ch);
      i++;
      continue;
    }
    throw new Error(`Unexpected character "${ch}"`);
  }

  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  const toRad = (v: number) => (angleMode === 'DEG' ? (v * Math.PI) / 180 : v);
  const fromRad = (v: number) => (angleMode === 'DEG' ? (v * 180) / Math.PI : v);

  function parseExpression(): number {
    let left = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm(): number {
    let left = parsePower();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = consume();
      const right = parsePower();
      if (op === '/') {
        if (right === 0) throw new Error('Division by zero');
        left /= right;
      } else if (op === '%') {
        left %= right;
      } else {
        left *= right;
      }
    }
    return left;
  }

  function parsePower(): number {
    const base = parseUnary();
    if (peek() === '^') {
      consume();
      const exp = parsePower();
      return Math.pow(base, exp);
    }
    return base;
  }

  function parseUnary(): number {
    if (peek() === '+') {
      consume();
      return parseUnary();
    }
    if (peek() === '-') {
      consume();
      return -parseUnary();
    }
    return parsePostfix();
  }

  function parsePostfix(): number {
    let val = parsePrimary();
    while (peek() === '!') {
      consume();
      val = factorial(val);
    }
    return val;
  }

  function parsePrimary(): number {
    const tok = peek();
    if (!tok) throw new Error('Unexpected end of expression');
    if (tok === '(') {
      consume();
      const val = parseExpression();
      if (consume() !== ')') throw new Error('Missing closing parenthesis');
      return val;
    }
    if (tok === 'pi') {
      consume();
      return Math.PI;
    }
    if (tok === 'e') {
      consume();
      return Math.E;
    }
    if (/^[0-9.]+([eE][+-]?[0-9]+)?$/.test(tok)) {
      consume();
      const num = Number(tok);
      if (Number.isNaN(num)) throw new Error(`Invalid number "${tok}"`);
      return num;
    }
    if (/^[a-z]+$/.test(tok)) {
      const fn = consume();
      if (consume() !== '(') throw new Error(`Expected "(" after ${fn}`);
      const arg = parseExpression();
      if (consume() !== ')') throw new Error(`Expected ")" after ${fn} argument`);
      switch (fn) {
        case 'sin':
          return Math.sin(toRad(arg));
        case 'cos':
          return Math.cos(toRad(arg));
        case 'tan':
          return Math.tan(toRad(arg));
        case 'asin':
          return fromRad(Math.asin(arg));
        case 'acos':
          return fromRad(Math.acos(arg));
        case 'atan':
          return fromRad(Math.atan(arg));
        case 'sqrt':
          if (arg < 0) throw new Error('Square root of negative number');
          return Math.sqrt(arg);
        case 'abs':
          return Math.abs(arg);
        case 'log':
          if (arg <= 0) throw new Error('Logarithm domain error');
          return Math.log10(arg);
        case 'ln':
          if (arg <= 0) throw new Error('Natural log domain error');
          return Math.log(arg);
        case 'exp':
          return Math.exp(arg);
        default:
          throw new Error(`Unknown function "${fn}"`);
      }
    }
    throw new Error(`Unexpected token "${tok}"`);
  }

  const result = parseExpression();
  if (pos < tokens.length) throw new Error(`Unexpected token "${tokens[pos]}"`);
  if (!Number.isFinite(result)) throw new Error('Result is undefined or infinite');
  return result;
}
