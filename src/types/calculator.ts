export type Language = 'en' | 'ar';

export type CategorySlug =
  | 'financial-calculators'
  | 'health-calculators'
  | 'math-calculators'
  | 'conversion-calculators'
  | 'date-calculators'
  | 'everyday-calculators'
  | 'science-calculators';

export interface CategoryDef {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  disclaimer?: string;
}

export interface FormulaVariable {
  symbol: string;
  description: string;
}

export interface CalculatorExample {
  title: string;
  inputsSummary: string;
  calculation: string;
  resultSummary: string;
}

export interface CalculatorFAQ {
  question: string;
  answer: string;
}

export interface EducationalSection {
  heading: string;
  body: string;
}

export interface CalculatorDef {
  id: string;
  slug: string;
  category: CategorySlug;
  alsoInCategories?: CategorySlug[];
  name: string;
  shortName: string;
  description: string;
  keywords: string[];
  popular?: boolean;
  recentlyAdded?: boolean;
  publishedAt?: string;
  seoTitle: string;
  seoDescription: string;
  formulaText: string;
  formulaVariables: FormulaVariable[];
  steps: string[];
  example: CalculatorExample;
  faqs: CalculatorFAQ[];
  educationalSections: EducationalSection[];
  relatedSlugs: string[];
  published?: boolean;
}

export interface ArticleDef {
  slug: string;
  title: string;
  category: CategorySlug;
  categoryLabel: string;
  readTime: string;
  updatedAt: string;
  summary: string;
  sections: { heading: string; body: string }[];
  relatedCalculatorSlugs: string[];
}

export interface AdConfig {
  enabled: boolean;
  showSlotPlaceholders: boolean;
  provider: 'adsense' | 'custom';
  publisherId: string;
  slots: {
    homepageBanner: string;
    homepageInContent: string;
    categoryTop: string;
    calculatorTop: string;
    calculatorSidebar: string;
    calculatorInContent: string;
    pageBottom: string;
  };
}
