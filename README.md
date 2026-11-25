# CalcAxis — All-in-One Online Calculator Platform

CalcAxis is a responsive, SEO-ready online calculator hub built with **React 19**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Express**. It provides **97 unique calculators** (100 category listings across 7 categories), live currency exchange rates, interactive charts, formula breakdowns, print/PDF & CSV exports, dynamic XML/HTML sitemaps, and a configurable AdSense/CMS dashboard.

## Categories Included

- **Financial Calculators** (`/financial-calculators/`): Mortgage, Loan, Auto Loan, Personal Loan, Compound Interest, Simple Interest, Savings, Investment, Retirement, Credit Card Payoff, Debt Payoff (Avalanche vs Snowball), Amortization Schedule, Interest Rate Solver, Inflation, Salary, 2025 US Federal Income Tax, 50/30/20 Budget, Net Worth, ROI & CAGR, Mortgage Refinance Break-Even.
- **Health & Fitness Calculators** (`/health-calculators/`): BMI, BMR, TDEE, Calorie, Ideal Weight (4 clinical formulas), US Navy Body Fat, Pregnancy, Due Date, Ovulation, Macro, Water Intake, Running Pace & Race Splits, Heart Rate Zones (Karvonen), Waist-to-Height Ratio, Sleep Cycle.
- **Math Calculators** (`/math-calculators/`): Percentage, Fraction, Scientific Expression Evaluator, Algebra Linear Solver, Average & Statistics, Ratio, Quadratic Equation, Prime Factorization, GCF/LCM, Probability & Combinatorics, Rounding, plus Tip, Discount, and Grade tools.
- **Conversion Calculators** (`/conversion-calculators/`): Length, Weight, Temperature, Volume, Area, Speed, Time, Data Storage (SI & IEC), Energy, Pressure, Power, Currency (live rates via `/api/exchange-rates`), Fuel Economy, Angle, Cooking Measurements.
- **Date & Time Calculators** (`/date-calculators/`): Age, Date Difference, Days Between Dates, Time Duration, Business Days (US federal holiday aware), Live Countdown, Working Days Add/Subtract, Date Add/Subtract, ISO-8601 Week Number, DST-Aware Time Zone Converter.
- **Everyday Life Calculators** (`/everyday-calculators/`): Tip, Discount, Sales Tax, Electricity Cost, Fuel Cost, GPA, Weighted Grade, Split Bill, Wedding Budget, Moving Cost.
- **Science & Engineering Calculators** (`/science-calculators/`): Acceleration, Speed/Distance/Time, Force, Density, Pressure, Kinetic Energy, Potential Energy, Ohm's Law Solver, Voltage Divider, Power.

## Local Development

```bash
npm install
npm run dev
```

The Express + Vite dev server runs on **http://localhost:3000** by default.

## Automated Unit Tests

```bash
npm test
```

Runs the calculation engine verification suite (`src/lib/calculators/__tests__/runTests.ts`) covering mortgage amortization, compound interest, credit card payoff, BMI/BMR/TDEE, math expression parsing, fractions/quadratics, unit conversions, date/business days, tip/GPA, and Ohm's law.

## Production Build & Start

```bash
npm run build
npm start
```

## Environment Variables (`.env.example`)

- `PORT` (optional, defaults to `3000`)
- `APP_URL` (optional public base URL used for canonical `<loc>` entries in `/sitemap.xml` and `/robots.txt`)

## AdSense & Content Management

Visit **`/admin/`** in the app to configure your Google AdSense Publisher ID (`ca-pub-...`), individual ad slot unit IDs, toggle placeholder containers, edit calculator SEO titles/descriptions, or publish new educational guides.
