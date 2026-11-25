import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, Search } from 'lucide-react';
import { getCalculatorUrl, getCalculatorsByCategory } from '../data/calculators/index.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { AdSlot } from '../components/ads/AdSlot.tsx';
import { SeoHead } from '../components/seo/SeoHead.tsx';
import { CalculatorIcon, CategoryIcon } from '../components/ui/CategoryIcon.tsx';

export function CategoryPage({ forcedCategory }: { forcedCategory?: string }) {
  const params = useParams();
  const categorySlug = forcedCategory || params.category || '';
  const { calculators, categories, ui } = useAppContext();
  const category = categories.find((c) => c.slug === categorySlug);
  const [filterText, setFilterText] = useState('');

  const categoryCalcs = useMemo(() => {
    if (!category) return [];
    const list = getCalculatorsByCategory(category.slug, calculators);
    const q = filterText.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [category, calculators, filterText]);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-[#0F172A]">{ui.category.notFoundTitle}</h1>
        <p className="text-sm text-[#64748B] mt-2">{ui.category.notFoundBody}</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-[#2563EB] hover:underline">
          {ui.category.returnHome}
        </Link>
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <>
      <SeoHead
        title={`${category.name} – ${ui.category.freeOnlineTools} | ${ui.brandName}`}
        description={category.description}
        canonicalPath={`/${category.slug}/`}
        schemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: ui.nav.home, item: `${origin}/` },
              { '@type': 'ListItem', position: 2, name: category.name, item: `${origin}/${category.slug}/` },
            ],
          },
        ]}
      />

      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B] mb-4">
            <Link to="/" className="hover:text-[#2563EB]">
              {ui.nav.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            <span className="font-medium text-[#0F172A]">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <CategoryIcon iconName={category.iconName} className="w-6 h-6" />
              </span>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A]">
                  {category.name}
                </h1>
                <p className="mt-1.5 text-sm sm:text-base text-[#64748B] max-w-2xl">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder={`${ui.category.filterPrefix} ${category.shortName} ${ui.category.toolsSuffix}`}
                className="w-full h-10 ps-9 pe-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AdSlot
          slotKey="categoryTop"
          label={`${category.shortName} – ${ui.ads.categoryBanner}`}
          sizeHint="728×90 / Responsive"
          minHeightClass="min-h-[76px]"
        />

        {categoryCalcs.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center">
            <p className="text-sm font-medium text-[#0F172A]">
              {ui.category.noMatch} “{filterText}” {ui.category.inWord} {category.name}.
            </p>
            <button
              type="button"
              onClick={() => setFilterText('')}
              className="mt-3 text-xs font-semibold text-[#2563EB] hover:underline"
            >
              {ui.category.showAllPrefix} {category.shortName}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryCalcs.map((calc) => (
              <Link
                key={calc.slug}
                to={getCalculatorUrl(calc, category.slug)}
                className="group bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#2563EB] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                      <CalculatorIcon slug={calc.slug} category={calc.category} className="w-4.5 h-4.5" />
                    </span>
                    <h2 className="font-display text-base font-semibold text-[#0F172A] group-hover:text-[#2563EB]">
                      {calc.name}
                    </h2>
                  </div>
                  <p className="text-sm text-[#64748B] leading-relaxed">{calc.description}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
                  {ui.category.launchCalculator} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </Link>
            ))}
          </div>
        )}

        {category.disclaimer && (
          <div className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-4 text-xs text-[#64748B] leading-relaxed">
            <strong className="text-[#1E293B]">{ui.category.importantNotice}</strong> {category.disclaimer}
          </div>
        )}

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
