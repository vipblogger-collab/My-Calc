import type { ArticleDef } from '../types/calculator.ts';

export const ARTICLES: ArticleDef[] = [
  {
    slug: 'how-mortgage-amortization-works',
    title: 'How Mortgage Amortization Works: Principal, Interest, and Extra Payments',
    category: 'financial-calculators',
    categoryLabel: 'Financial Guides',
    readTime: '6 min read',
    updatedAt: '2026-10-15',
    summary:
      'Understand how fixed-rate mortgage payments shift from interest-heavy to principal-heavy over time, and how modest extra monthly payments shorten loan terms.',
    relatedCalculatorSlugs: ['mortgage-calculator', 'amortization-calculator', 'mortgage-refinance-calculator'],
    sections: [
      {
        heading: 'Why Early Payments Go Mostly Toward Interest',
        body: 'In a fixed-rate amortized loan, your monthly principal and interest payment stays constant, but interest is recalculated each month on the remaining balance. Because the balance is highest in year one, a larger portion of each early payment covers interest. Over time, as principal declines, more of the same monthly payment reduces the debt.',
      },
      {
        heading: 'Understanding Escrow: Taxes, Insurance, and PMI',
        body: 'Lenders frequently collect property taxes, homeowners insurance, and Private Mortgage Insurance (PMI) alongside principal and interest. When your down payment is below 20% on a conventional loan, PMI typically adds 0.5% to 1.5% of the loan amount annually until you reach 20% equity.',
      },
      {
        heading: 'How Extra Principal Payments Compound Savings',
        body: 'Paying even $100 to $200 extra toward principal each month directly lowers the balance on which future interest accrues. On a $350,000 30-year loan at 6.5%, an extra $200 per month can shave more than five years off the mortgage and save tens of thousands in lifetime interest.',
      },
    ],
  },
  {
    slug: 'compound-interest-and-time-value-of-money',
    title: 'The Power of Compound Interest and Regular Contributions',
    category: 'financial-calculators',
    categoryLabel: 'Investing Basics',
    readTime: '5 min read',
    updatedAt: '2026-10-10',
    summary:
      'Learn how compounding frequency, time horizon, and automated monthly contributions interact to accelerate long-term wealth building.',
    relatedCalculatorSlugs: ['compound-interest-calculator', 'investment-calculator', 'retirement-calculator'],
    sections: [
      {
        heading: 'Simple vs. Compound Growth',
        body: 'Simple interest applies only to your original deposit. Compound interest applies to both your original principal and the accumulated interest from prior periods, producing an exponential curve that steepens significantly after the first decade.',
      },
      {
        heading: 'Why Time Matters More Than Timing',
        body: 'Starting ten years earlier often outperforms contributing twice as much later in life because early dollars experience more compounding cycles. Consistent monthly contributions also smooth market volatility through dollar-cost averaging.',
      },
    ],
  },
  {
    slug: 'bmi-bmr-tdee-explained',
    title: 'BMI, BMR, and TDEE Explained: Choosing the Right Fitness Metric',
    category: 'health-calculators',
    categoryLabel: 'Health & Nutrition',
    readTime: '5 min read',
    updatedAt: '2026-09-28',
    summary:
      'Compare Body Mass Index, Basal Metabolic Rate, and Total Daily Energy Expenditure so you can interpret calorie targets accurately.',
    relatedCalculatorSlugs: ['bmi-calculator', 'bmr-calculator', 'tdee-calculator', 'calorie-calculator'],
    sections: [
      {
        heading: 'What BMI Measures—and What It Misses',
        body: 'BMI is a simple population-level screening ratio of weight to height squared. While useful for broad health trends, it cannot distinguish muscle mass from adipose tissue, which is why pairing BMI with waist-to-height ratio or U.S. Navy body fat estimates provides better context.',
      },
      {
        heading: 'Moving From BMR to TDEE',
        body: 'Your Basal Metabolic Rate (BMR) estimates the energy required solely to keep vital organs functioning at complete rest. Multiplying BMR by an activity factor yields your Total Daily Energy Expenditure (TDEE), which serves as the practical baseline for weight maintenance, fat loss, or muscle gain.',
      },
    ],
  },
  {
    slug: 'metric-vs-imperial-conversion-guide',
    title: 'Metric vs. Imperial Units: Accurate Conversion Factors for Work & Kitchen',
    category: 'conversion-calculators',
    categoryLabel: 'Reference Guides',
    readTime: '4 min read',
    updatedAt: '2026-09-14',
    summary:
      'A practical reference on international SI definitions, exact inch-to-millimeter standards, SI vs. binary data storage, and fuel economy conversions.',
    relatedCalculatorSlugs: ['length-converter', 'weight-converter', 'data-storage-converter', 'fuel-economy-converter'],
    sections: [
      {
        heading: 'Exact Legal Definitions',
        body: 'Since the 1959 International Yard and Pound Agreement, one inch is defined as exactly 25.4 millimeters and one avoirdupois pound as exactly 0.45359237 kilograms. Using exact standards avoids rounding drift across multi-step engineering calculations.',
      },
      {
        heading: 'Decimal vs. Binary Data Units',
        body: 'Storage manufacturers quote capacities in decimal gigabytes (1 GB = 1,000³ bytes), whereas operating systems often display binary gibibytes (1 GiB = 1,024³ bytes). That difference explains why a 1 TB drive displays around 931 GiB in desktop file managers.',
      },
    ],
  },
  {
    slug: 'business-days-leap-years-and-iso-weeks',
    title: 'Business Days, Leap Years, and ISO Week Numbers in Scheduling',
    category: 'date-calculators',
    categoryLabel: 'Date & Time',
    readTime: '4 min read',
    updatedAt: '2026-09-02',
    summary:
      'How Gregorian leap-year rules, federal holiday exclusions, and ISO-8601 week numbering prevent off-by-one errors in contracts and payroll.',
    relatedCalculatorSlugs: ['business-days-calculator', 'working-days-calculator', 'week-number-calculator', 'time-zone-converter'],
    sections: [
      {
        heading: 'The Gregorian Leap Year Rule',
        body: 'A year is a leap year if it is divisible by 4, except years divisible by 100 are excluded unless they are also divisible by 400. Thus 2000 was a leap year, while 1900 and 2100 are common 365-day years.',
      },
      {
        heading: 'How ISO-8601 Defines Week 1',
        body: 'Under ISO-8601, weeks run Monday through Sunday, and Week 1 of any year is the week containing the year’s first Thursday (equivalently, January 4). Late December days can therefore belong to Week 1 of the following ISO week-year.',
      },
    ],
  },
  {
    slug: 'ohms-law-and-energy-fundamentals',
    title: 'Ohm’s Law, Electrical Power, and Mechanical Energy Fundamentals',
    category: 'science-calculators',
    categoryLabel: 'Science & Engineering',
    readTime: '5 min read',
    updatedAt: '2026-08-21',
    summary:
      'Review the core relationships connecting voltage, current, resistance, power, and mechanical energy conservation in everyday engineering.',
    relatedCalculatorSlugs: ['ohms-law-calculator', 'voltage-calculator', 'power-calculator', 'kinetic-energy-calculator'],
    sections: [
      {
        heading: 'The Ohm’s Law Wheel',
        body: 'Knowing any two of Voltage (V), Current (I), Resistance (R), and Power (P) uniquely determines the remaining two in a linear DC circuit. Combining V = I·R with P = V·I yields P = I²R and P = V²/R for thermal dissipation analysis.',
      },
      {
        heading: 'Why Speed Dominates Kinetic Energy',
        body: 'Because kinetic energy scales with the square of velocity (KE = ½mv²), doubling an object’s speed quadruples its kinetic energy—and therefore quadruples braking work and impact energy.',
      },
    ],
  },
];
