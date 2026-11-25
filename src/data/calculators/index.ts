import { CalculatorDef, CategorySlug } from '../../types/calculator.ts';
import { FINANCIAL_CALCULATORS } from './financial.ts';
import { HEALTH_CALCULATORS } from './health.ts';
import { MATH_CALCULATORS } from './math.ts';
import { CONVERSION_CALCULATORS } from './conversion.ts';
import { DATE_TIME_CALCULATORS } from './dateTime.ts';
import { EVERYDAY_CALCULATORS } from './everyday.ts';
import { SCIENCE_CALCULATORS } from './science.ts';
import { CALCULATOR_AR } from '../../i18n/calculatorAr.ts';

export const ALL_CALCULATORS: CalculatorDef[] = [
  ...FINANCIAL_CALCULATORS,
  ...HEALTH_CALCULATORS,
  ...MATH_CALCULATORS,
  ...CONVERSION_CALCULATORS,
  ...DATE_TIME_CALCULATORS,
  ...EVERYDAY_CALCULATORS,
  ...SCIENCE_CALCULATORS,
];

export function getCalculatorUrl(calc: CalculatorDef, overrideCategory?: CategorySlug): string {
  const cat = overrideCategory || calc.category;
  return `/${cat}/${calc.slug}/`;
}

export function getCalculatorBySlug(slug: string, list: CalculatorDef[] = ALL_CALCULATORS): CalculatorDef | undefined {
  return list.find((c) => c.slug === slug && c.published !== false);
}

export function getCalculatorsByCategory(
  category: CategorySlug,
  list: CalculatorDef[] = ALL_CALCULATORS
): CalculatorDef[] {
  return list.filter(
    (c) =>
      c.published !== false &&
      (c.category === category || (c.alsoInCategories && c.alsoInCategories.includes(category)))
  );
}

export function searchCalculators(query: string, list: CalculatorDef[] = ALL_CALCULATORS): CalculatorDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  return list
    .filter((c) => c.published !== false)
    .map((calc) => {
      const ar = CALCULATOR_AR[calc.slug];
      const name = calc.name.toLowerCase();
      const desc = calc.description.toLowerCase();
      const cat = calc.category.replace('-calculators', '').toLowerCase();
      const kw = calc.keywords.join(' ').toLowerCase();
      const arBlock = ar ? `${ar.name} ${ar.description} ${ar.keywords.join(' ')}`.toLowerCase() : '';
      const haystack = `${name} ${desc} ${cat} ${kw} ${arBlock}`;

      const matchesAll = terms.every((t) => haystack.includes(t));
      if (!matchesAll) return null;

      let score = 0;
      if (name === q || ar?.name.toLowerCase() === q) score += 100;
      else if (name.startsWith(q) || ar?.name.toLowerCase().startsWith(q)) score += 60;
      else if (name.includes(q) || ar?.name.toLowerCase().includes(q)) score += 40;
      if (kw.includes(q) || (ar && ar.keywords.join(' ').toLowerCase().includes(q))) score += 25;
      if (cat.includes(q)) score += 10;
      if (calc.popular) score += 5;

      return { calc, score };
    })
    .filter((item): item is { calc: CalculatorDef; score: number } => item !== null)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.calc);
}
