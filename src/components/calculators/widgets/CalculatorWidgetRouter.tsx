import { CategorySlug } from '../../../types/calculator.ts';
import { FinancialWidget } from './FinancialWidgets.tsx';
import { HealthWidget } from './HealthWidgets.tsx';
import { MathWidget } from './MathWidgets.tsx';
import { ConversionWidget } from './ConversionWidgets.tsx';
import { DateTimeWidget } from './DateTimeWidgets.tsx';
import { EverydayWidget } from './EverydayWidgets.tsx';
import { ScienceWidget } from './ScienceWidgets.tsx';
import { ZakatWidget } from './ZakatWidget.tsx';

export function CalculatorWidgetRouter({
  slug,
  category,
}: {
  slug: string;
  category: CategorySlug;
}) {
  // Handle shared cross-category or dedicated modular slugs cleanly
  if (slug === 'zakat-calculator') {
    return <ZakatWidget />;
  }
  if (slug === 'tip-calculator' || slug === 'discount-calculator' || slug === 'grade-calculator') {
    return <EverydayWidget slug={slug} />;
  }

  switch (category) {
    case 'financial-calculators':
      return <FinancialWidget slug={slug} />;
    case 'health-calculators':
      return <HealthWidget slug={slug} />;
    case 'math-calculators':
      return <MathWidget slug={slug} />;
    case 'conversion-calculators':
      return <ConversionWidget slug={slug} />;
    case 'date-calculators':
      return <DateTimeWidget slug={slug} />;
    case 'everyday-calculators':
      return <EverydayWidget slug={slug} />;
    case 'science-calculators':
      return <ScienceWidget slug={slug} />;
    default:
      return null;
  }
}
