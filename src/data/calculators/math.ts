import { CalculatorDef } from '../../types/calculator.ts';

export const MATH_CALCULATORS: CalculatorDef[] = [
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    category: 'math-calculators',
    name: 'Percentage Calculator',
    shortName: 'Percentage',
    description: 'Solve X% of Y, what percent X is of Y, and percentage increase or decrease instantaneously.',
    keywords: ['percentage', 'percent change', 'percent increase', 'percent decrease'],
    popular: true,
    seoTitle: 'Percentage Calculator – Percent Of, Ratio & Percent Change | CalcAxis',
    seoDescription: 'Calculate percentages, percentage change, increase, and decrease with clear step-by-step formulas.',
    formulaText: 'X% of Y = (X ÷ 100) × Y  |  % Change = ((New − Old) ÷ |Old|) × 100',
    formulaVariables: [
      { symbol: 'X', description: 'Percentage value or part' },
      { symbol: 'Y', description: 'Base whole amount' },
    ],
    steps: [
      'Select which percentage problem you want to solve.',
      'Enter the two known numbers.',
      'View the exact answer and step-by-step arithmetic.',
    ],
    example: {
      title: 'Price Increase from $80 to $100',
      inputsSummary: 'Old Value: 80 · New Value: 100',
      calculation: '((100 − 80) ÷ 80) × 100 = 25%',
      resultSummary: 'A 25% increase.',
    },
    faqs: [
      {
        question: 'Why isn’t a 20% increase followed by a 20% decrease back to the original number?',
        answer: 'Because the 20% decrease applies to the larger post-increase base (100 → 120 → 96).',
      },
      {
        question: 'How do I convert a decimal to a percentage?',
        answer: 'Multiply the decimal by 100 (e.g., 0.175 × 100 = 17.5%).',
      },
      {
        question: 'Can percentage change exceed 100%?',
        answer: 'Yes—doubling from 50 to 100 is a 100% increase, and tripling to 150 is a 200% increase.',
      },
    ],
    educationalSections: [
      {
        heading: 'Percentage Points vs. Percent Change',
        body: 'An interest rate rising from 4% to 5% is a 1 percentage point increase, which represents a 25% relative increase.',
      },
    ],
    relatedSlugs: ['discount-calculator', 'ratio-calculator', 'fraction-calculator'],
  },
  {
    id: 'fraction-calculator',
    slug: 'fraction-calculator',
    category: 'math-calculators',
    name: 'Fraction Calculator',
    shortName: 'Fraction',
    description: 'Add, subtract, multiply, and divide fractions with simplified results, mixed numbers, and decimals.',
    keywords: ['fraction', 'mixed number', 'simplify fraction', 'lcd'],
    seoTitle: 'Fraction Calculator – Add, Subtract, Multiply & Simplify | CalcAxis',
    seoDescription: 'Perform exact arithmetic on fractions with automatic GCD simplification, mixed numbers, decimal equivalents, and steps.',
    formulaText: 'a/b + c/d = (ad + bc) / bd   (reduced by gcd)',
    formulaVariables: [
      { symbol: 'a, c', description: 'Numerators' },
      { symbol: 'b, d', description: 'Non-zero denominators' },
    ],
    steps: [
      'Enter the numerator and denominator of the first fraction.',
      'Choose +, −, ×, or ÷ and enter the second fraction.',
      'Read the reduced fraction, mixed number, decimal, and reduction steps.',
    ],
    example: {
      title: '1/3 + 1/6',
      inputsSummary: 'Fraction 1: 1/3 · Operator: + · Fraction 2: 1/6',
      calculation: '(1×6 + 1×3) / (3×6) = 9/18 → divide by gcd(9,18)=9 → 1/2',
      resultSummary: '1/2 (0.5).',
    },
    faqs: [
      {
        question: 'How does division of fractions work?',
        answer: 'Multiply the first fraction by the reciprocal of the second: (a/b) ÷ (c/d) = (a×d) / (b×c).',
      },
      {
        question: 'How are fractions simplified?',
        answer: 'Both numerator and denominator are divided by their Greatest Common Divisor (GCD).',
      },
      {
        question: 'What if the numerator is larger than the denominator?',
        answer: 'That improper fraction is also displayed as a mixed number (e.g., 7/4 = 1 3/4).',
      },
    ],
    educationalSections: [
      {
        heading: 'Finding Common Denominators',
        body: 'Adding or subtracting fractions requires a common denominator so parts represent equal slices of a whole.',
      },
    ],
    relatedSlugs: ['gcf-calculator', 'lcm-calculator', 'ratio-calculator', 'percentage-calculator'],
  },
  {
    id: 'scientific-calculator',
    slug: 'scientific-calculator',
    category: 'math-calculators',
    name: 'Scientific Calculator',
    shortName: 'Scientific',
    description: 'Interactive scientific keypad and expression evaluator with trigonometry, logs, powers, and history.',
    keywords: ['scientific calculator', 'sin', 'cos', 'log', 'factorial', 'exponent'],
    seoTitle: 'Scientific Calculator – Trig, Logarithms, Powers & History | CalcAxis',
    seoDescription: 'Free online scientific calculator supporting DEG/RAD trigonometry, logarithms, roots, factorials, parentheses, and keyboard entry.',
    formulaText: 'PEMDAS / BODMAS order of operations with DEG or RAD mode',
    formulaVariables: [
      { symbol: 'DEG / RAD', description: 'Angle unit for sin, cos, tan, asin, acos, atan' },
      { symbol: 'ln / log', description: 'Base-e natural log and base-10 common log' },
    ],
    steps: [
      'Click keypad buttons or type math expressions directly.',
      'Toggle DEG or RAD for trigonometric calculations.',
      'Press = or Enter to evaluate and log results in your history tape.',
    ],
    example: {
      title: 'Evaluate 2 + 3 × 4² − sqrt(16)',
      inputsSummary: 'Expression: 2 + 3 * 4^2 - sqrt(16)',
      calculation: '2 + 3 × 16 − 4 = 2 + 48 − 4',
      resultSummary: '46',
    },
    faqs: [
      {
        question: 'Can I use my keyboard?',
        answer: 'Yes—type numbers, +, -, *, /, ^, parentheses, and function names like sin(30) or sqrt(25), then press Enter.',
      },
      {
        question: 'What is the difference between log and ln?',
        answer: 'log(x) computes the base-10 logarithm while ln(x) computes the natural logarithm (base e ≈ 2.71828).',
      },
      {
        question: 'What does 5! mean?',
        answer: 'The factorial 5! = 5 × 4 × 3 × 2 × 1 = 120.',
      },
    ],
    educationalSections: [
      {
        heading: 'Angle Modes in Trigonometry',
        body: 'Always double-check whether your problem specifies degrees (e.g., 30°) or radians (e.g., π/6) before calling trigonometric functions.',
      },
    ],
    relatedSlugs: ['basic-calculator', 'exponent-calculator', 'square-root-calculator', 'quadratic-equation-calculator'],
  },
  {
    id: 'basic-calculator',
    slug: 'basic-calculator',
    category: 'math-calculators',
    name: 'Basic Calculator',
    shortName: 'Basic',
    description: 'Clean everyday four-function calculator with percentage, sign toggle, memory keys, and tape.',
    keywords: ['basic calculator', 'arithmetic', 'memory', 'four function'],
    seoTitle: 'Basic Calculator – Everyday Arithmetic & Memory Keys | CalcAxis',
    seoDescription: 'Fast, clean online basic calculator with +, −, ×, ÷, %, M+/M−/MR/MC memory buttons, keyboard support, and history.',
    formulaText: 'Standard left-to-right / operator precedence arithmetic',
    formulaVariables: [
      { symbol: 'M+ / M−', description: 'Add or subtract current value from memory register' },
      { symbol: 'MR / MC', description: 'Recall or clear stored memory value' },
    ],
    steps: [
      'Click buttons or use your number pad to enter figures.',
      'Use M+ / M− / MR to store intermediate subtotals.',
      'Click any previous tape entry to reuse its result.',
    ],
    example: {
      title: 'Subtotal Plus 8.5% Tax',
      inputsSummary: '245 + 245 * 0.085',
      calculation: '245 + 20.825',
      resultSummary: '265.825',
    },
    faqs: [
      {
        question: 'Is keyboard input supported?',
        answer: 'Yes—digits, operators (+, -, *, /), Enter, Backspace, and Escape all work seamlessly.',
      },
      {
        question: 'How do memory keys help?',
        answer: 'Memory keys let you accumulate totals across separate calculations without writing numbers down.',
      },
      {
        question: 'Can I copy the result?',
        answer: 'Use the Copy Results button to copy the current value and calculation tape to your clipboard.',
      },
    ],
    educationalSections: [
      {
        heading: 'Fast Everyday Arithmetic',
        body: 'For advanced trigonometry, logarithms, or nested parentheses, switch anytime to the Scientific Calculator.',
      },
    ],
    relatedSlugs: ['scientific-calculator', 'percentage-calculator', 'tip-calculator'],
  },
  {
    id: 'algebra-calculator',
    slug: 'algebra-calculator',
    category: 'math-calculators',
    name: 'Algebra Calculator',
    shortName: 'Algebra',
    description: 'Solve linear equations of the form ax + b = cx + d with clear step-by-step algebraic isolation.',
    keywords: ['algebra', 'linear equation', 'solve for x', 'steps'],
    seoTitle: 'Algebra Calculator – Linear Equation Solver with Steps | CalcAxis',
    seoDescription: 'Solve linear equations ax + b = cx + d step by step, handling unique, infinite, and no-solution cases.',
    formulaText: 'ax + b = cx + d  ⟹  x = (d − b) / (a − c)',
    formulaVariables: [
      { symbol: 'a, c', description: 'Coefficients of x on left and right sides' },
      { symbol: 'b, d', description: 'Constant terms on left and right sides' },
    ],
    steps: [
      'Enter coefficients a, b, c, and d from your equation ax + b = cx + d.',
      'Review each algebraic isolation step and final solution for x.',
    ],
    example: {
      title: 'Solve 3x + 5 = x + 13',
      inputsSummary: 'a = 3, b = 5, c = 1, d = 13',
      calculation: '2x + 5 = 13 → 2x = 8 → x = 4',
      resultSummary: 'x = 4',
    },
    faqs: [
      {
        question: 'What if a equals c?',
        answer: 'The x terms cancel out. If b equals d, every real number is a solution (identity); if b ≠ d, there is no solution (contradiction).',
      },
      {
        question: 'How do I solve ax² + bx + c = 0?',
        answer: 'Use our dedicated Quadratic Equation Calculator for second-degree polynomials.',
      },
      {
        question: 'Are negative coefficients allowed?',
        answer: 'Yes—enter negative numbers directly for any coefficient or constant.',
      },
    ],
    educationalSections: [
      {
        heading: 'Balancing Equations',
        body: 'Every valid algebraic step performs the exact same operation on both sides of the equals sign to preserve equality.',
      },
    ],
    relatedSlugs: ['quadratic-equation-calculator', 'ratio-calculator', 'fraction-calculator'],
  },
  {
    id: 'average-calculator',
    slug: 'average-calculator',
    category: 'math-calculators',
    name: 'Average Calculator',
    shortName: 'Average',
    description: 'Compute arithmetic mean, median, mode, geometric mean, range, and sorted dataset from any list.',
    keywords: ['average', 'mean', 'median', 'mode', 'geometric mean'],
    seoTitle: 'Average Calculator – Mean, Median, Mode & Range | CalcAxis',
    seoDescription: 'Enter comma or space-separated numbers to calculate mean, median, mode, geometric mean, sum, and sorted values.',
    formulaText: 'Mean = (Σ xᵢ) ÷ n',
    formulaVariables: [
      { symbol: 'xᵢ', description: 'Each individual value in the dataset' },
      { symbol: 'n', description: 'Total count of numbers' },
    ],
    steps: [
      'Paste or type numbers separated by commas, spaces, or line breaks.',
      'Instantly view mean, median, mode, sum, count, min, max, and range.',
    ],
    example: {
      title: 'Test Scores: 78, 85, 92, 85, 95',
      inputsSummary: '78, 85, 92, 85, 95',
      calculation: 'Sum = 435, Count = 5, Mean = 435 / 5 = 87',
      resultSummary: 'Mean: 87, Median: 85, Mode: 85, Range: 17.',
    },
    faqs: [
      {
        question: 'When should I use median instead of mean?',
        answer: 'Median resists extreme outliers—making it more representative for incomes, home prices, or skewed datasets.',
      },
      {
        question: 'What if no number repeats?',
        answer: 'If every value appears once, the dataset has no mode.',
      },
      {
        question: 'When is geometric mean defined?',
        answer: 'Geometric mean applies only when all numbers in the dataset are strictly positive.',
      },
    ],
    educationalSections: [
      {
        heading: 'Measures of Central Tendency',
        body: 'Viewing mean, median, and mode together reveals whether a distribution is symmetric or skewed.',
      },
    ],
    relatedSlugs: ['statistics-calculator', 'grade-calculator', 'gpa-calculator'],
  },
  {
    id: 'ratio-calculator',
    slug: 'ratio-calculator',
    category: 'math-calculators',
    name: 'Ratio Calculator',
    shortName: 'Ratio',
    description: 'Solve proportions A : B = C : D when one value is unknown, and simplify ratios automatically.',
    keywords: ['ratio', 'proportion', 'aspect ratio', 'scale'],
    seoTitle: 'Ratio Calculator – Proportion Solver & Aspect Ratio Scaler | CalcAxis',
    seoDescription: 'Solve A : B = C : D proportions by leaving any one field blank, or simplify whole-number ratios instantly.',
    formulaText: 'A / B = C / D  ⟹  A·D = B·C',
    formulaVariables: [
      { symbol: 'A, B, C, D', description: 'Four terms of a proportional relationship' },
    ],
    steps: [
      'Enter three of the four values in A : B = C : D and leave the unknown box empty.',
      'View the solved proportion and simplified integer ratio.',
    ],
    example: {
      title: 'Scale 16:9 Screen to 1920px Width',
      inputsSummary: 'A = 16, B = 9, C = 1920, D = ?',
      calculation: 'D = (9 × 1920) ÷ 16 = 1080',
      resultSummary: 'D = 1080 (1920 : 1080).',
    },
    faqs: [
      {
        question: 'How do I scale a recipe or image aspect ratio?',
        answer: 'Enter the original ratio in A and B, put your new width or batch size in C, and leave D blank.',
      },
      {
        question: 'Can I use decimals in ratios?',
        answer: 'Yes, decimals and integers both work in the proportion solver.',
      },
      {
        question: 'How are whole-number ratios simplified?',
        answer: 'Both sides are divided by their Greatest Common Factor (GCF).',
      },
    ],
    educationalSections: [
      {
        heading: 'Cross-Multiplication Explained',
        body: 'Because A/B = C/D, cross-multiplying yields A×D = B×C, isolating any single missing term in one division.',
      },
    ],
    relatedSlugs: ['fraction-calculator', 'percentage-calculator', 'gcf-calculator'],
  },
  {
    id: 'exponent-calculator',
    slug: 'exponent-calculator',
    category: 'math-calculators',
    name: 'Exponent Calculator',
    shortName: 'Exponent',
    description: 'Compute xⁿ for positive, negative, zero, and fractional exponents with scientific notation.',
    keywords: ['exponent', 'power', 'scientific notation', 'x^n'],
    seoTitle: 'Exponent Calculator – Powers & Scientific Notation | CalcAxis',
    seoDescription: 'Calculate x raised to the power n for integer, negative, and decimal exponents with step-by-step exponent laws.',
    formulaText: 'xⁿ = x · x · … · x  (n times)   |   x⁻ⁿ = 1 / xⁿ',
    formulaVariables: [
      { symbol: 'x', description: 'Base number' },
      { symbol: 'n', description: 'Exponent / power' },
    ],
    steps: [
      'Enter the base value x.',
      'Enter any exponent n (positive, negative, zero, or fractional).',
      'Inspect standard decimal output and scientific notation.',
    ],
    example: {
      title: 'Calculate 2⁻¹⁰ and 5⁴',
      inputsSummary: 'Base: 2 · Exponent: -10',
      calculation: '2⁻¹⁰ = 1 / 2¹⁰ = 1 / 1024',
      resultSummary: '0.0009765625 (9.7656 × 10⁻⁴).',
    },
    faqs: [
      {
        question: 'What is any non-zero number raised to the power 0?',
        answer: 'By exponent laws, x⁰ = 1 for every non-zero number x.',
      },
      {
        question: 'What does a fractional exponent like x^0.5 mean?',
        answer: 'x^(1/2) is the square root √x, and x^(1/3) is the cube root ∛x.',
      },
      {
        question: 'Why does 0⁻² show an error?',
        answer: 'Negative exponents imply dividing by 0, which is undefined.',
      },
    ],
    educationalSections: [
      {
        heading: 'Core Laws of Exponents',
        body: 'Key identities include xᵃ·xᵇ = xᵃ⁺ᵇ, (xᵃ)ᵇ = xᵃᵇ, and x⁻ᵃ = 1/xᵃ.',
      },
    ],
    relatedSlugs: ['square-root-calculator', 'scientific-calculator', 'compound-interest-calculator'],
  },
  {
    id: 'square-root-calculator',
    slug: 'square-root-calculator',
    category: 'math-calculators',
    name: 'Square Root Calculator',
    shortName: 'Square Root',
    description: 'Calculate square roots and nth roots with simplified radical form for integers.',
    keywords: ['square root', 'nth root', 'radical', 'cube root'],
    seoTitle: 'Square Root & Nth Root Calculator – Radical Simplifier | CalcAxis',
    seoDescription: 'Calculate square roots, cube roots, and nth roots with exact decimal precision and simplified radical form.',
    formulaText: 'ⁿ√x = x^(1/n)',
    formulaVariables: [
      { symbol: 'x', description: 'Radicand (number under the root)' },
      { symbol: 'n', description: 'Root index (2 for square root, 3 for cube root)' },
    ],
    steps: [
      'Enter the number x.',
      'Keep root degree n = 2 for square root, or set 3, 4, etc. for nth roots.',
      'Review principal root, ± roots (for even indices), and simplified radical form.',
    ],
    example: {
      title: 'Square Root of 72',
      inputsSummary: 'x = 72 · Root degree n = 2',
      calculation: '√72 = √(36 × 2) = 6√2',
      resultSummary: '8.485281 (Exact simplified radical: 6√2).',
    },
    faqs: [
      {
        question: 'Why are there two square roots for positive numbers?',
        answer: 'Both (+a)² and (−a)² equal +a², though the √ symbol refers to the positive principal root.',
      },
      {
        question: 'Can you take the cube root of a negative number?',
        answer: 'Yes—odd roots of negative numbers are real (e.g., ∛(−27) = −3), while even roots of negatives are complex.',
      },
      {
        question: 'How is simplified radical form computed?',
        answer: 'The largest perfect n-th power factor is pulled outside the radical sign.',
      },
    ],
    educationalSections: [
      {
        heading: 'Perfect Squares & Irrational Roots',
        body: 'Square roots of non-square integers like √2 or √3 are irrational numbers whose decimal digits never repeat or terminate.',
      },
    ],
    relatedSlugs: ['exponent-calculator', 'quadratic-equation-calculator', 'scientific-calculator'],
  },
  {
    id: 'quadratic-equation-calculator',
    slug: 'quadratic-equation-calculator',
    category: 'math-calculators',
    name: 'Quadratic Equation Calculator',
    shortName: 'Quadratic',
    description: 'Solve ax² + bx + c = 0 for real or complex roots, discriminant, vertex, and parabola plot.',
    keywords: ['quadratic formula', 'parabola', 'discriminant', 'vertex', 'roots'],
    seoTitle: 'Quadratic Equation Calculator – Roots, Vertex & Graph | CalcAxis',
    seoDescription: 'Solve any quadratic equation ax² + bx + c = 0 with discriminant analysis, real or complex roots, vertex, and parabola chart.',
    formulaText: 'x = [ −b ± √(b² − 4ac) ] / 2a',
    formulaVariables: [
      { symbol: 'a, b, c', description: 'Quadratic, linear, and constant coefficients (a ≠ 0)' },
      { symbol: 'Δ = b² − 4ac', description: 'Discriminant determining number of real roots' },
    ],
    steps: [
      'Enter coefficients a, b, and c from ax² + bx + c = 0.',
      'Review discriminant Δ, real or complex roots, vertex coordinates, and parabola plot.',
    ],
    example: {
      title: 'Solve x² − 5x + 6 = 0',
      inputsSummary: 'a = 1, b = −5, c = 6',
      calculation: 'Δ = 25 − 24 = 1; x = (5 ± 1) / 2',
      resultSummary: 'Roots are x₁ = 3 and x₂ = 2; vertex at (2.5, −0.25).',
    },
    faqs: [
      {
        question: 'What does a negative discriminant mean?',
        answer: 'When b² − 4ac < 0, the parabola does not cross the x-axis and has two complex conjugate roots involving i.',
      },
      {
        question: 'How is the parabola vertex found?',
        answer: 'The axis of symmetry lies at x = −b / (2a), and evaluating f(x) gives the minimum or maximum y-value.',
      },
      {
        question: 'What if a = 0?',
        answer: 'When a = 0 the equation is linear (bx + c = 0), not quadratic.',
      },
    ],
    educationalSections: [
      {
        heading: 'Geometric Meaning of Quadratic Roots',
        body: 'Real roots represent the x-intercepts where the parabola y = ax² + bx + c crosses the horizontal axis.',
      },
    ],
    relatedSlugs: ['algebra-calculator', 'square-root-calculator', 'scientific-calculator'],
  },
  {
    id: 'prime-number-calculator',
    slug: 'prime-number-calculator',
    category: 'math-calculators',
    name: 'Prime Number Calculator',
    shortName: 'Prime Number',
    description: 'Test primality, compute prime factorization, find nearest primes, and list primes in a range.',
    keywords: ['prime number', 'prime factorization', 'is prime', 'factors'],
    seoTitle: 'Prime Number Calculator – Primality Check & Factorization | CalcAxis',
    seoDescription: 'Check if a number is prime, compute its complete prime factorization, and find neighboring prime numbers.',
    formulaText: 'n = p₁^a₁ · p₂^a₂ · … · pₖ^aₖ  (Fundamental Theorem of Arithmetic)',
    formulaVariables: [
      { symbol: 'n', description: 'Positive integer ≥ 2' },
      { symbol: 'pᵢ', description: 'Unique prime factors' },
    ],
    steps: [
      'Enter any positive integer to test whether it is prime or composite.',
      'View its prime factorization, previous prime, and next prime.',
    ],
    example: {
      title: 'Prime Factorization of 360',
      inputsSummary: 'Number: 360',
      calculation: '360 = 2 × 2 × 2 × 3 × 3 × 5',
      resultSummary: 'Composite: 2³ × 3² × 5. Nearest primes are 359 and 367.',
    },
    faqs: [
      {
        question: 'Is 1 a prime number?',
        answer: 'No. By definition, a prime number is an integer greater than 1 with exactly two positive divisors: 1 and itself.',
      },
      {
        question: 'What is the only even prime number?',
        answer: '2 is the smallest and only even prime; every larger even integer is divisible by 2.',
      },
      {
        question: 'Why do primes matter in technology?',
        answer: 'Large prime numbers form the mathematical backbone of RSA encryption and modern cybersecurity.',
      },
    ],
    educationalSections: [
      {
        heading: 'Trial Division up to √n',
        body: 'If a composite integer n has a factor, at least one factor must be less than or equal to √n, allowing rapid factorization.',
      },
    ],
    relatedSlugs: ['gcf-calculator', 'lcm-calculator', 'fraction-calculator'],
  },
  {
    id: 'gcf-calculator',
    slug: 'gcf-calculator',
    category: 'math-calculators',
    name: 'GCF Calculator',
    shortName: 'GCF',
    description: 'Find the Greatest Common Factor (GCD) of two or more integers with Euclidean algorithm steps.',
    keywords: ['gcf', 'gcd', 'greatest common factor', 'greatest common divisor'],
    seoTitle: 'GCF Calculator – Greatest Common Factor with Steps | CalcAxis',
    seoDescription: 'Calculate the Greatest Common Factor (GCF / GCD) of two or more whole numbers using the Euclidean algorithm.',
    formulaText: 'gcd(a, b) = gcd(b, a mod b)',
    formulaVariables: [
      { symbol: 'a, b', description: 'Positive integers' },
    ],
    steps: [
      'Enter two or more integers separated by commas or spaces.',
      'View the Greatest Common Factor and pairwise Euclidean reduction steps.',
    ],
    example: {
      title: 'GCF of 48, 180, and 72',
      inputsSummary: 'Numbers: 48, 180, 72',
      calculation: 'gcd(48, 180) = 12; gcd(12, 72) = 12',
      resultSummary: 'GCF is 12.',
    },
    faqs: [
      {
        question: 'Are GCF and GCD the same thing?',
        answer: 'Yes—Greatest Common Factor (GCF) and Greatest Common Divisor (GCD) are two names for the largest positive integer dividing all inputs evenly.',
      },
      {
        question: 'What does GCF = 1 mean?',
        answer: 'The numbers are coprime (relatively prime), sharing no common factor greater than 1.',
      },
      {
        question: 'Where is GCF used?',
        answer: 'GCF simplifies fractions to lowest terms and factors algebraic expressions.',
      },
    ],
    educationalSections: [
      {
        heading: 'Euclid’s Algorithm',
        body: 'Devised over two millennia ago, repeated remainder reduction finds the GCF without needing full prime factorization.',
      },
    ],
    relatedSlugs: ['lcm-calculator', 'fraction-calculator', 'prime-number-calculator'],
  },
  {
    id: 'lcm-calculator',
    slug: 'lcm-calculator',
    category: 'math-calculators',
    name: 'LCM Calculator',
    shortName: 'LCM',
    description: 'Compute the Least Common Multiple of two or more integers alongside their GCF.',
    keywords: ['lcm', 'least common multiple', 'common denominator'],
    seoTitle: 'LCM Calculator – Least Common Multiple of Multiple Numbers | CalcAxis',
    seoDescription: 'Find the Least Common Multiple (LCM) and Greatest Common Factor (GCF) of any list of positive integers.',
    formulaText: 'lcm(a, b) = |a · b| / gcd(a, b)',
    formulaVariables: [
      { symbol: 'a, b', description: 'Non-zero integers' },
    ],
    steps: [
      'Enter two or more positive integers separated by commas.',
      'Review both the Least Common Multiple (LCM) and GCF.',
    ],
    example: {
      title: 'LCM of 12, 18, and 30',
      inputsSummary: 'Numbers: 12, 18, 30',
      calculation: 'lcm(12, 18) = 36; lcm(36, 30) = 180',
      resultSummary: 'LCM is 180 and GCF is 6.',
    },
    faqs: [
      {
        question: 'Why is LCM helpful for fractions?',
        answer: 'The Least Common Multiple of two denominators is their Lowest Common Denominator (LCD).',
      },
      {
        question: 'Can LCM ever be smaller than the largest input?',
        answer: 'No—the LCM is always at least as large as the largest integer in the list.',
      },
      {
        question: 'How do LCM and GCF relate for two numbers?',
        answer: 'For any two positive integers a and b, LCM(a,b) × GCF(a,b) = a × b.',
      },
    ],
    educationalSections: [
      {
        heading: 'Cycles and Synchronization',
        body: 'LCM solves scheduling problems such as finding when two repeating events of different intervals align again.',
      },
    ],
    relatedSlugs: ['gcf-calculator', 'fraction-calculator', 'prime-number-calculator'],
  },
  {
    id: 'probability-calculator',
    slug: 'probability-calculator',
    category: 'math-calculators',
    name: 'Probability Calculator',
    shortName: 'Probability',
    description: 'Calculate independent event intersections, unions, complements, permutations (nPr), and combinations (nCr).',
    keywords: ['probability', 'combinations', 'permutations', 'ncr', 'npr'],
    seoTitle: 'Probability Calculator – Events, Permutations & Combinations | CalcAxis',
    seoDescription: 'Calculate P(A and B), P(A or B), P(not A), permutations nPr, and combinations nCr accurately.',
    formulaText: 'P(A ∪ B) = P(A) + P(B) − P(A)·P(B)  |  nCr = n! / (r!(n−r)!)',
    formulaVariables: [
      { symbol: 'P(A), P(B)', description: 'Probabilities between 0 and 1' },
      { symbol: 'n, r', description: 'Total items and chosen items for combinatorics' },
    ],
    steps: [
      'Enter probabilities P(A) and P(B) as decimals between 0 and 1.',
      'Enter n and r values to also evaluate permutations (order matters) and combinations (order ignored).',
    ],
    example: {
      title: 'Independent Events & 5-Card Hand from 52',
      inputsSummary: 'P(A)=0.4, P(B)=0.25 · n=52, r=5',
      calculation: 'P(A∩B) = 0.10; P(A∪B) = 0.55; 52C5 = 2,598,960',
      resultSummary: 'Both occurring: 10%; either occurring: 55%; 5-card combinations: 2,598,960.',
    },
    faqs: [
      {
        question: 'When do I use nPr vs. nCr?',
        answer: 'Use Permutations (nPr) when order matters (like race podiums or PIN codes) and Combinations (nCr) when order does not matter (like lottery tickets or committees).',
      },
      {
        question: 'What does independent events mean?',
        answer: 'Two events are independent when the outcome of A does not change the probability of B.',
      },
      {
        question: 'Why must probabilities be between 0 and 1?',
        answer: '0 represents an impossible event (0%) and 1 represents a certain event (100%).',
      },
    ],
    educationalSections: [
      {
        heading: 'Avoiding Double Counting in Unions',
        body: 'Adding P(A) + P(B) counts the overlap P(A ∩ B) twice, which is why the intersection must be subtracted once.',
      },
    ],
    relatedSlugs: ['statistics-calculator', 'random-number-generator', 'average-calculator'],
  },
  {
    id: 'statistics-calculator',
    slug: 'statistics-calculator',
    category: 'math-calculators',
    name: 'Statistics Calculator',
    shortName: 'Statistics',
    description: 'Compute descriptive statistics: sample & population standard deviation, variance, quartiles, IQR, and mean.',
    keywords: ['statistics', 'standard deviation', 'variance', 'quartiles', 'iqr'],
    seoTitle: 'Statistics Calculator – Std Dev, Variance, Quartiles & Mean | CalcAxis',
    seoDescription: 'Calculate sample and population standard deviation, variance, mean, median, quartiles Q1/Q3, IQR, and range.',
    formulaText: 's = √[ Σ(xᵢ − x̄)² / (n − 1) ]   |   σ = √[ Σ(xᵢ − μ)² / n ]',
    formulaVariables: [
      { symbol: 's', description: 'Sample standard deviation (Bessel’s n−1 correction)' },
      { symbol: 'σ', description: 'Population standard deviation (divides by n)' },
    ],
    steps: [
      'Enter or paste numeric observations separated by commas, spaces, or newlines.',
      'Inspect central tendency, dispersion (std dev & variance), and five-number summary.',
    ],
    example: {
      title: 'Sample: 2, 4, 4, 4, 5, 5, 7, 9',
      inputsSummary: '2, 4, 4, 4, 5, 5, 7, 9',
      calculation: 'Mean = 5; Σ(x − 5)² = 32; σ = √(32/8) = 2',
      resultSummary: 'Mean: 5, Population Std Dev: 2, Sample Std Dev: 2.138, IQR: 2.',
    },
    faqs: [
      {
        question: 'Should I report sample or population standard deviation?',
        answer: 'Use Sample (n − 1) when your dataset is a subset drawn from a larger population; use Population (n) when you have every single member.',
      },
      {
        question: 'What is IQR (Interquartile Range)?',
        answer: 'IQR = Q3 − Q1 measures the spread of the middle 50% of values and is robust against outliers.',
      },
      {
        question: 'What does variance measure?',
        answer: 'Variance is the squared standard deviation, expressing average squared distance from the mean.',
      },
    ],
    educationalSections: [
      {
        heading: 'The Five-Number Summary',
        body: 'Minimum, Q1, Median, Q3, and Maximum summarize any distribution’s center, spread, and skewness cleanly.',
      },
    ],
    relatedSlugs: ['average-calculator', 'probability-calculator', 'random-number-generator'],
  },
  {
    id: 'rounding-calculator',
    slug: 'rounding-calculator',
    category: 'math-calculators',
    name: 'Rounding Calculator',
    shortName: 'Rounding',
    description: 'Round numbers to any decimal place or power of ten using Half-Up, Half-Even (Banker’s), Floor, or Ceil.',
    keywords: ['rounding', 'decimal places', 'bankers rounding', 'round'],
    seoTitle: 'Rounding Calculator – Decimal Places & Banker’s Rounding | CalcAxis',
    seoDescription: 'Round any number to nearest integer, tenths, hundredths, thousands, or custom decimals with selectable rounding modes.',
    formulaText: 'Modes: Half-Up | Half-Even (Banker’s) | Floor | Ceiling',
    formulaVariables: [
      { symbol: 'Half-Up', description: 'Standard school rounding (0.5 rounds away from zero)' },
      { symbol: 'Half-Even', description: 'Statistical/financial rounding (0.5 rounds to nearest even digit)' },
    ],
    steps: [
      'Enter the number you wish to round.',
      'Choose target precision (e.g., 2 decimals, nearest integer, nearest 100) and rounding method.',
    ],
    example: {
      title: 'Round 2.5 and 3.5 with Banker’s Rounding',
      inputsSummary: 'Values: 2.5 and 3.5 · Nearest Integer · Mode: Half-Even',
      calculation: '2.5 rounds to even 2; 3.5 rounds to even 4',
      resultSummary: 'Half-Even eliminates upward rounding bias over large datasets.',
    },
    faqs: [
      {
        question: 'Why do banks and IEEE-754 floating point use Half-Even?',
        answer: 'Always rounding .5 upward introduces systematic upward bias in sums; rounding to the nearest even digit balances halves evenly.',
      },
      {
        question: 'What does precision -1 or -2 mean?',
        answer: 'Negative decimal precision rounds to powers of ten: -1 rounds to nearest 10, -2 to nearest 100.',
      },
      {
        question: 'How do Floor and Ceiling differ for negative numbers?',
        answer: 'Floor moves toward −∞ (−2.3 → −3), whereas Ceiling moves toward +∞ (−2.3 → −2).',
      },
    ],
    educationalSections: [
      {
        heading: 'Avoiding Intermediate Rounding Errors',
        body: 'In multi-step engineering or financial work, retain full precision during intermediate steps and round only the final displayed figure.',
      },
    ],
    relatedSlugs: ['basic-calculator', 'scientific-calculator', 'percentage-calculator'],
  },
  {
    id: 'random-number-generator',
    slug: 'random-number-generator',
    category: 'math-calculators',
    name: 'Random Number Generator',
    shortName: 'Random Number',
    description: 'Generate cryptographically uniform random integers within any range with duplicate and sort controls.',
    keywords: ['random number', 'rng', 'dice', 'lottery', 'sample'],
    seoTitle: 'Random Number Generator – Uniform Integers & Unique Sampling | CalcAxis',
    seoDescription: 'Generate fair random numbers between any minimum and maximum using Web Crypto randomness with optional unique draws.',
    formulaText: 'Uniform Integer ∈ [Min, Max] via rejection-free crypto random',
    formulaVariables: [
      { symbol: 'Min / Max', description: 'Inclusive integer boundaries' },
      { symbol: 'Count', description: 'How many random integers to generate' },
    ],
    steps: [
      'Set lower bound (Min), upper bound (Max), and quantity of numbers.',
      'Toggle whether duplicates are allowed and whether output should be sorted.',
      'Click Generate to produce a fresh set of random integers.',
    ],
    example: {
      title: '6 Unique Numbers Between 1 and 49',
      inputsSummary: 'Min: 1 · Max: 49 · Count: 6 · Unique: Yes · Sorted: Yes',
      calculation: 'Fisher-Yates / rejection sampling ensures equal probability per integer',
      resultSummary: 'Outputs 6 distinct integers in ascending order.',
    },
    faqs: [
      {
        question: 'How does this generator avoid modulo bias?',
        answer: 'It uses `window.crypto.getRandomValues` with rejection sampling so every integer in [Min, Max] has an identical probability.',
      },
      {
        question: 'Why can’t Count exceed (Max − Min + 1) when duplicates are off?',
        answer: 'Because there are only (Max − Min + 1) distinct integers available in the interval.',
      },
      {
        question: 'Can I simulate dice rolls?',
        answer: 'Yes—set Min = 1, Max = 6, Allow Duplicates = Yes, and Count = number of dice.',
      },
    ],
    educationalSections: [
      {
        heading: 'Cryptographic vs. Standard Math.random()',
        body: 'Browser `crypto.getRandomValues` draws entropy from the operating system CSPRNG, offering stronger unpredictability than standard pseudo-random generators.',
      },
    ],
    relatedSlugs: ['probability-calculator', 'statistics-calculator', 'average-calculator'],
  },
];
