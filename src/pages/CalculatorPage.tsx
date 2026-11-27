import { useEffect, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Bookmark, ChevronRight, HelpCircle, Info } from 'lucide-react';
import { getCalculatorBySlug, getCalculatorUrl, getCalculatorsByCategory } from '../data/calculators/index.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { CalculatorWidgetRouter } from '../components/calculators/widgets/CalculatorWidgetRouter.tsx';
import { EmbedCodeBox } from '../components/calculators/EmbedCodeBox.tsx';
import { AdSlot } from '../components/ads/AdSlot.tsx';
import { SeoHead } from '../components/seo/SeoHead.tsx';
import { CategorySlug } from '../types/calculator.ts';
import { SITE_URL } from '../config/site.ts';

export function CalculatorPage({ forcedCategory }: { forcedCategory?: CategorySlug }) {
  const params = useParams();
  const location = useLocation();
  const isEmbed = new URLSearchParams(location.search).get('embed') === '1';
  const categorySlug = (forcedCategory || params.category || '') as CategorySlug;
  const calcSlug = params.slug || '';

  const { calculators, categories, isBookmarked, toggleBookmark, recordRecentView, recentSlugs, ui, lang, l } =
    useAppContext();
  const calc = useMemo(() => getCalculatorBySlug(calcSlug, calculators), [calcSlug, calculators]);
  const activeCategory =
    categories.find((c) => c.slug === categorySlug) ||
    (calc ? categories.find((c) => c.slug === calc.category) : undefined);

  const relatedCalcs = useMemo(() => {
    if (!calc || !activeCategory) return [];
    const explicit = calc.relatedSlugs
      .map((s) => calculators.find((c) => c.slug === s))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    if (explicit.length >= 3) return explicit;
    const sameCat = getCalculatorsByCategory(activeCategory.slug, calculators).filter(
      (c) => c.slug !== calc.slug && !explicit.some((e) => e.slug === c.slug)
    );
    return [...explicit, ...sameCat].slice(0, 5);
  }, [calc, calculators, activeCategory]);

  useEffect(() => {
    if (calc) {
      recordRecentView(calc.slug);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calc?.slug, location.pathname]);

  if (!calc || !activeCategory) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-[#0F172A]">{ui.calculator.notFoundTitle}</h1>
        <p className="text-sm text-[#64748B] mt-2">{ui.calculator.notFoundBody}</p>
        <Link to={l('/')} className="mt-4 inline-block text-sm font-semibold text-[#2563EB] hover:underline">
          {ui.calculator.backHome}
        </Link>
      </div>
    );
  }

  const saved = isBookmarked(calc.slug);

  const recentOthers = recentSlugs
    .filter((s) => s !== calc.slug)
    .map((s) => calculators.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 5);

  const origin = SITE_URL;
  const canonicalPath = getCalculatorUrl(calc, activeCategory.slug);

  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: calc.name,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description: calc.seoDescription,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: ui.nav.home, item: `${origin}${l('/')}` },
        { '@type': 'ListItem', position: 2, name: activeCategory.name, item: `${origin}${l(`/${activeCategory.slug}/`)}` },
        { '@type': 'ListItem', position: 3, name: calc.name, item: `${origin}${l(canonicalPath)}` },
      ],
    },
  ];

  if (calc.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: calc.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  const domainDisclaimer =
    calc.category === 'financial-calculators'
      ? ui.calculator.financialDisclaimer
      : calc.category === 'health-calculators'
      ? ui.calculator.healthDisclaimer
      : calc.slug === 'currency-converter'
      ? ui.calculator.currencyDisclaimer
      : null;

  if (isEmbed) {
    const fullCalcUrl = `${origin}/${lang}${canonicalPath}`;
    return (
      <>
        <SeoHead
          title={calc.seoTitle}
          description={calc.seoDescription}
          canonicalPath={canonicalPath}
          schemas={schemas}
        />
        <div className="max-w-4xl mx-auto px-3 sm:px-5 py-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-display text-lg sm:text-xl font-bold text-[#0F172A]">
              {calc.name}
            </h1>
            <a
              href={fullCalcUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#2563EB] hover:underline shrink-0"
            >
              mysmartcalc.net
            </a>
          </div>
          <section aria-label={calc.name}>
            <CalculatorWidgetRouter key={`${lang}-${calc.slug}`} slug={calc.slug} category={calc.category} />
          </section>
          <p className="text-[11px] text-[#64748B] text-center pt-1" dir="ltr">
            Powered by{' '}
            <a
              href={fullCalcUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563EB] font-medium hover:underline"
            >
              mysmartcalc.net
            </a>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <SeoHead
        title={calc.seoTitle}
        description={calc.seoDescription}
        canonicalPath={canonicalPath}
        schemas={schemas}
      />

      {/* A, B, C: Breadcrumb, Title, Intro */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[#64748B] mb-3">
            <Link to={l('/')} className="hover:text-[#2563EB]">
              {ui.nav.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            <Link to={l(`/${activeCategory.slug}/`)} className="hover:text-[#2563EB]">
              {activeCategory.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            <span className="font-medium text-[#0F172A]">{calc.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
                {calc.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#64748B] leading-relaxed">
                {calc.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleBookmark(calc.slug)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 no-print ${
                saved
                  ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                  : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#2563EB]' : ''}`} />
              <span>{saved ? ui.calculator.bookmarked : ui.calculator.bookmark}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Top Calculator Ad */}
        <AdSlot
          slotKey="calculatorTop"
          label={ui.ads.calculatorTop}
          sizeHint="728×90 / Responsive"
          minHeightClass="min-h-[76px]"
        />

        {/* D & E: Interactive Calculator Input & Results + Desktop Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-9 space-y-8">
            <section aria-label={calc.name} className="space-y-3">
              <CalculatorWidgetRouter key={`${lang}-${calc.slug}`} slug={calc.slug} category={calc.category} />
              <EmbedCodeBox calcName={calc.name} canonicalPath={canonicalPath} lang={lang} />
            </section>

            {domainDisclaimer && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-xs text-[#64748B]">
                <Info className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
                <p>{domainDisclaimer}</p>
              </div>
            )}

            {/* F: Calculation Formula */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#0F172A]">
                {ui.calculator.formulaHeading}
              </h2>
              <div
                dir="ltr"
                className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 font-mono-tabular text-sm font-medium text-[#0F172A] overflow-x-auto text-left"
              >
                {calc.formulaText}
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {calc.formulaVariables.map((v) => (
                  <div key={v.symbol} className="flex items-baseline gap-2">
                    <dt dir="ltr" className="font-mono-tabular font-semibold text-[#2563EB] shrink-0">
                      {v.symbol}:
                    </dt>
                    <dd className="text-[#475569]">{v.description}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* G & H: How to Use & Example Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3">
                <h2 className="font-display text-lg font-bold text-[#0F172A]">
                  {ui.calculator.howToUseHeading}
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-[#475569] leading-relaxed">
                  {calc.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </section>

              <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3">
                <h2 className="font-display text-lg font-bold text-[#0F172A]">
                  {ui.calculator.exampleHeading}
                </h2>
                <p className="text-sm font-semibold text-[#0F172A]">{calc.example.title}</p>
                <p className="text-xs text-[#64748B]">{calc.example.inputsSummary}</p>
                <div
                  dir="ltr"
                  className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 font-mono-tabular text-xs text-[#1E293B] text-left"
                >
                  {calc.example.calculation}
                </div>
                <p className="text-sm font-medium text-[#16A34A]">{calc.example.resultSummary}</p>
              </section>
            </div>

            {/* In-Content Ad */}
            <AdSlot
              slotKey="calculatorInContent"
              label={ui.ads.calculatorInContent}
              sizeHint="728×90 / Responsive"
              minHeightClass="min-h-[90px]"
            />

            {/* K: Educational Content */}
            {calc.educationalSections.length > 0 && (
              <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
                {calc.educationalSections.map((sec) => (
                  <div key={sec.heading}>
                    <h2 className="font-display text-xl font-bold text-[#0F172A]">{sec.heading}</h2>
                    <p className="mt-2 text-sm text-[#475569] leading-relaxed">{sec.body}</p>
                  </div>
                ))}
              </section>
            )}

            {/* I: Frequently Asked Questions */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-[#0F172A]">
                <HelpCircle className="w-5 h-5 text-[#2563EB]" />
                <span>{ui.calculator.faqHeading}</span>
              </h2>
              <div className="divide-y divide-[#F1F5F9]">
                {calc.faqs.map((faq) => (
                  <div key={faq.question} className="py-3.5 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-[#0F172A]">{faq.question}</h3>
                    <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* J: Related Calculators */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h2 className="font-display text-lg font-bold text-[#0F172A] mb-4">
                {ui.calculator.relatedHeading}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedCalcs.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={getCalculatorUrl(rel, undefined, lang)}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] hover:bg-[#EFF6FF] p-3 transition-colors"
                  >
                    <p className="text-sm font-semibold text-[#0F172A]">{rel.name}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{rel.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Desktop Sidebar */}
          <aside className="xl:col-span-3 space-y-6 no-print">
            <AdSlot
              slotKey="calculatorSidebar"
              label={ui.ads.calculatorSidebar}
              sizeHint="300×250"
              minHeightClass="min-h-[250px]"
            />

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <h3 className="text-sm font-bold text-[#0F172A] mb-3">
                {ui.calculator.moreIn} {activeCategory.shortName}
              </h3>
              <ul className="space-y-2 text-sm">
                {getCalculatorsByCategory(activeCategory.slug, calculators)
                  .slice(0, 10)
                  .map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={getCalculatorUrl(item, activeCategory.slug, lang)}
                        className={`block py-0.5 transition-colors ${
                          item.slug === calc.slug
                            ? 'font-semibold text-[#2563EB]'
                            : 'text-[#475569] hover:text-[#2563EB]'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {recentOthers.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <h3 className="text-sm font-bold text-[#0F172A] mb-3">{ui.calculator.recentlyViewed}</h3>
                <ul className="space-y-2 text-sm">
                  {recentOthers.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={getCalculatorUrl(item, undefined, lang)}
                        className="text-[#475569] hover:text-[#2563EB] block py-0.5"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Bottom Ad */}
        <AdSlot
          slotKey="pageBottom"
          label={ui.ads.pageBottom}
          sizeHint="728×90 / Responsive"
          minHeightClass="min-h-[76px]"
        />
      </div>
    </>
  );
}
