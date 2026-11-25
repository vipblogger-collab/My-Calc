import {
  Landmark,
  HeartPulse,
  Sigma,
  ArrowLeftRight,
  CalendarClock,
  Sparkles,
  Atom,
  Calculator,
  Home,
  Car,
  Percent,
  Clock,
  Coins,
  Scale,
  Flame,
  Baby,
  TrendingUp,
  Ruler,
  Thermometer,
  Zap,
  Briefcase,
} from 'lucide-react';

export function CategoryIcon({
  iconName,
  className = 'w-5 h-5',
}: {
  iconName: string;
  className?: string;
}) {
  switch (iconName) {
    case 'Landmark':
      return <Landmark className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Sigma':
      return <Sigma className={className} />;
    case 'ArrowLeftRight':
      return <ArrowLeftRight className={className} />;
    case 'CalendarClock':
      return <CalendarClock className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    default:
      return <Calculator className={className} />;
  }
}

export function CalculatorIcon({
  slug,
  category,
  className = 'w-5 h-5',
}: {
  slug: string;
  category: string;
  className?: string;
}) {
  if (slug.includes('mortgage')) return <Home className={className} />;
  if (slug.includes('auto')) return <Car className={className} />;
  if (slug.includes('percentage') || slug.includes('discount') || slug.includes('tax'))
    return <Percent className={className} />;
  if (slug.includes('currency') || slug.includes('compound') || slug.includes('roi'))
    return <TrendingUp className={className} />;
  if (slug.includes('bmi') || slug.includes('weight')) return <Scale className={className} />;
  if (slug.includes('calorie') || slug.includes('bmr') || slug.includes('tdee'))
    return <Flame className={className} />;
  if (slug.includes('pregnancy') || slug.includes('due-date') || slug.includes('ovulation'))
    return <Baby className={className} />;
  if (slug.includes('length') || slug.includes('area')) return <Ruler className={className} />;
  if (slug.includes('temperature')) return <Thermometer className={className} />;
  if (slug.includes('ohm') || slug.includes('voltage') || slug.includes('electricity'))
    return <Zap className={className} />;
  if (slug.includes('time') || slug.includes('countdown') || slug.includes('age'))
    return <Clock className={className} />;
  if (slug.includes('end-of-service')) return <Briefcase className={className} />;
  if (slug.includes('tip') || slug.includes('split')) return <Coins className={className} />;

  switch (category) {
    case 'financial-calculators':
      return <Landmark className={className} />;
    case 'health-calculators':
      return <HeartPulse className={className} />;
    case 'math-calculators':
      return <Sigma className={className} />;
    case 'conversion-calculators':
      return <ArrowLeftRight className={className} />;
    case 'date-calculators':
      return <CalendarClock className={className} />;
    case 'everyday-calculators':
      return <Calculator className={className} />;
    case 'science-calculators':
      return <Atom className={className} />;
    default:
      return <Calculator className={className} />;
  }
}
