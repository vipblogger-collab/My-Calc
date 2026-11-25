import { CategoryDef } from '../types/calculator.ts';

export const CATEGORIES: CategoryDef[] = [
  {
    slug: 'financial-calculators',
    name: 'Financial Calculators',
    shortName: 'Financial',
    description:
      'Plan mortgages, loans, investments, retirement savings, debt payoffs, taxes, and budgets with accurate amortization and compounding schedules.',
    iconName: 'Landmark',
    disclaimer:
      'Financial calculators provide general estimates for educational and planning purposes only and do not constitute professional financial, tax, or investment advice.',
  },
  {
    slug: 'health-calculators',
    name: 'Health and Fitness Calculators',
    shortName: 'Health & Fitness',
    description:
      'Estimate BMI, daily calorie needs, TDEE, macronutrients, body fat percentage, pregnancy milestones, running pace, and heart rate training zones.',
    iconName: 'HeartPulse',
    disclaimer:
      'Health and fitness calculators provide informational estimates based on established clinical equations and do not replace professional medical advice or diagnosis.',
  },
  {
    slug: 'math-calculators',
    name: 'Math Calculators',
    shortName: 'Math',
    description:
      'Solve percentages, fractions, algebraic equations, quadratics, statistics, primes, ratios, and scientific expressions with step-by-step breakdowns.',
    iconName: 'Sigma',
  },
  {
    slug: 'conversion-calculators',
    name: 'Conversion Calculators',
    shortName: 'Conversions',
    description:
      'Convert length, weight, temperature, volume, speed, data storage, energy, pressure, fuel economy, cooking units, and live world currencies.',
    iconName: 'ArrowLeftRight',
    disclaimer:
      'Currency exchange rates are fetched from public market feeds and may differ from actual bank, card, or broker transaction rates.',
  },
  {
    slug: 'date-calculators',
    name: 'Date and Time Calculators',
    shortName: 'Date & Time',
    description:
      'Calculate exact age, date differences, business and working days excluding holidays, countdowns, ISO week numbers, and global time zones.',
    iconName: 'CalendarClock',
  },
  {
    slug: 'everyday-calculators',
    name: 'Everyday Life Calculators',
    shortName: 'Everyday Life',
    description:
      'Handle tips, bill splitting, discounts, sales tax, electricity and fuel costs, GPA, weighted grades, wedding budgets, and moving estimates.',
    iconName: 'Sparkles',
  },
  {
    slug: 'science-calculators',
    name: 'Science and Engineering Calculators',
    shortName: 'Science & Engineering',
    description:
      'Compute kinematics, force, density, pressure, kinetic and potential energy, Ohm’s law, voltage division, and mechanical or electrical power.',
    iconName: 'Atom',
  },
];

export function getCategoryBySlug(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
