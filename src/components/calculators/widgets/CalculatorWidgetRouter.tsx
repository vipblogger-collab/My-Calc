import { CategorySlug } from '../../../types/calculator.ts';
import { useAppContext } from '../../../context/AppContext.tsx';
import { FinancialWidget } from './FinancialWidgets.tsx';
import { HealthWidget } from './HealthWidgets.tsx';
import { MathWidget } from './MathWidgets.tsx';
import { ConversionWidget } from './ConversionWidgets.tsx';
import { DateTimeWidget } from './DateTimeWidgets.tsx';
import { EverydayWidget } from './EverydayWidgets.tsx';
import { ScienceWidget } from './ScienceWidgets.tsx';
import { ZakatWidget } from './ZakatWidget.tsx';
import { VatWidget } from './VatWidget.tsx';

export function CalculatorWidgetRouter({
  slug,
  category,
}: {
  slug: string;
  category: CategorySlug;
}) {
  const { lang } = useAppContext();
  const widgetKey = `${lang}-${slug}`;

  // Handle shared cross-category or dedicated modular slugs cleanly
  if (slug === 'zakat-calculator') {
    return <ZakatWidget key={widgetKey} />;
  }
  if (slug === 'vat-calculator') {
    return <VatWidget key={widgetKey} />;
  }
  if (slug === 'tip-calculator' || slug === 'discount-calculator' || slug === 'grade-calculator') {
    return <EverydayWidget key={widgetKey} slug={slug} />;
  }

  switch (category) {
    case 'financial-calculators':
      return <FinancialWidget key={widgetKey} slug={slug} />;
    case 'health-calculators':
      return <HealthWidget key={widgetKey} slug={slug} />;
    case 'math-calculators':
      return <MathWidget key={widgetKey} slug={slug} />;
    case 'conversion-calculators':
      return <ConversionWidget key={widgetKey} slug={slug} />;
    case 'date-calculators':
      return <DateTimeWidget key={widgetKey} slug={slug} />;
    case 'everyday-calculators':
      return <EverydayWidget key={widgetKey} slug={slug} />;
    case 'science-calculators':
      return <ScienceWidget key={widgetKey} slug={slug} />;
    default:
      return null;
  }
}
