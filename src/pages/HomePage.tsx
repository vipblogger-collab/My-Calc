import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
  BookOpen,
} from 'lucide-react';
import { getCalculatorUrl } from '../data/calculators/index.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { GlobalSearch } from '../components/search/GlobalSearch.tsx';
import { AdSlot } from '../components/ads/AdSlot.tsx';
import { SeoHead } from '../components/seo/SeoHead.tsx';
import { CalculatorIcon, CategoryIcon } from '../components/ui/CategoryIcon.tsx';
import { SITE_URL } from '../config/site.ts';

const WHY_ICONS = [CheckCircle2, ShieldCheck, Zap, Smartphone, Clock, BookOpen];

export function HomePage() {
  const { calculators, categories, articles, bookmarks, recentSlugs, ui, lang, l } = useAppContext();

  const popularCalcs = calculators.filter((c) => c.popular && c.published !== false);
  const recentAdded = calculators.filter((c) => c.recentlyAdded && c.published !== false);
  const bookmarkedCalcs = bookmarks
    .map((s) => calculators.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const recentlyViewedCalcs = recentSlugs
    .map((s) => calculators.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 6);

  const origin = SITE_URL;

  return (
    <>
      <SeoHead
        title={ui.home.seoTitle}
        description={ui.home.seoDesc}
        canonicalPath="/"
        schemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: ui.brandName,
            url: `${origin}${l('/')}`,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${origin}${l('/')}?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: ui.brandName,
            url: origin,
          },
        ]}
      />

      {/* Section 1: Hero Section */}
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] text-balance">
              {ui.home.heroTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
              {ui.home.heroSubtitle}
            </p>

            <div className="mt-7 max-w-2xl mx-auto">
              <GlobalSearch size="lg" placeholder={ui.search.placeholder} />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#64748B]">
              <span>{ui.home.popularShortcuts}</span>
              {ui.home.shortcuts.map((s) => (
                <Link
                  key={s.to}
                  to={l(s.to)}
                  className="px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] font-medium text-[#1E293B] transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Homepage Banner Ad */}
        <AdSlot
          slotKey="homepageBanner"
          label={ui.ads.homepageBanner}
          sizeHint="728×90 / Responsive"
          minHeightClass="min-h-[76px]"
        />

        {/* Personalized Bookmarks / Recently Viewed Bar (only when user has activity) */}
        {(bookmarkedCalcs.length > 0 || recentlyViewedCalcs.length > 0) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bookmarkedCalcs.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-3">
                  <Bookmark className="w-4 h-4 text-[#2563EB]" />
                  <span>{ui.home.savedCalculators}</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {bookmarkedCalcs.map((c) => (
                    <Link
                      key={c.slug}
                      to={getCalculatorUrl(c, undefined, lang)}
                      className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] hover:text-[#2563EB] text-xs font-medium text-[#1E293B]"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {recentlyViewedCalcs.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-3">
                  <Clock className="w-4 h-4 text-[#64748B]" />
                  <span>{ui.home.recentlyViewed}</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {recentlyViewedCalcs.map((c) => (
                    <Link
                      key={c.slug}
                      to={getCalculatorUrl(c, undefined, lang)}
                      className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] hover:text-[#2563EB] text-xs font-medium text-[#1E293B]"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Section 2: Popular Calculators */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">{ui.home.popularTitle}</h2>
              <p className="text-sm text-[#64748B] mt-1">{ui.home.popularSubtitle}</p>
            </div>
            <Link
              to={l('/sitemap/')}
              className="text-sm font-medium text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
            >
              {ui.home.browseAllPrefix} {calculators.length} {ui.home.toolsUnit}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularCalcs.map((calc) => (
              <Link
                key={calc.slug}
                to={getCalculatorUrl(calc, undefined, lang)}
                className="group bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#2563EB] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                      <CalculatorIcon slug={calc.slug} category={calc.category} className="w-4.5 h-4.5" />
                    </span>
                    <h3 className="font-display text-base font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {calc.name}
                    </h3>
                  </div>
                  <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2">{calc.description}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
                  {ui.home.openCalculator}
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Calculator Categories */}
        <section>
          <div className="mb-5">
            <h2 className="font-display text-2xl font-bold text-[#0F172A]">{ui.home.categoriesTitle}</h2>
            <p className="text-sm text-[#64748B] mt-1">{ui.home.categoriesSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const catCalcs = calculators.filter(
                (c) =>
                  c.published !== false &&
                  (c.category === cat.slug || c.alsoInCategories?.includes(cat.slug))
              );
              return (
                <div
                  key={cat.slug}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] flex items-center justify-center shrink-0">
                          <CategoryIcon iconName={cat.iconName} className="w-5 h-5" />
                        </span>
                        <Link
                          to={l(`/${cat.slug}/`)}
                          className="font-display text-lg font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors"
                        >
                          {cat.name}
                        </Link>
                      </div>
                      <span className="text-xs font-medium text-[#64748B] tabular-nums shrink-0">
                        {catCalcs.length} {ui.home.toolsUnit}
                      </span>
                    </div>

                    <p className="text-sm text-[#64748B] leading-relaxed mb-4">{cat.description}</p>

                    <ul className="space-y-1.5 text-sm border-t border-[#F1F5F9] pt-3">
                      {catCalcs.slice(0, 5).map((c) => (
                        <li key={c.slug}>
                          <Link
                            to={getCalculatorUrl(c, cat.slug, lang)}
                            className="text-[#1E293B] hover:text-[#2563EB] hover:underline"
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={l(`/${cat.slug}/`)}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline"
                  >
                    <span>
                      {ui.home.viewAllPrefix} {cat.shortName}
                      {ui.home.calculatorsSuffix ? ` ${ui.home.calculatorsSuffix}` : ''}
                    </span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Homepage In-Content Ad */}
        <AdSlot
          slotKey="homepageInContent"
          label={ui.ads.homepageInContent}
          sizeHint="728×90 / Responsive"
          minHeightClass="min-h-[90px]"
        />

        {/* Section 4: Recently Added Calculators */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#2563EB]" />
            <h2 className="font-display text-2xl font-bold text-[#0F172A]">{ui.home.recentlyAddedTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAdded.map((calc) => (
              <Link
                key={calc.slug}
                to={getCalculatorUrl(calc, undefined, lang)}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#2563EB] transition-colors"
              >
                <p className="text-xs text-[#64748B] mb-1">
                  {categories.find((c) => c.slug === calc.category)?.shortName} · {ui.home.newRelease}
                </p>
                <h3 className="font-display text-base font-semibold text-[#0F172A]">{calc.name}</h3>
                <p className="text-sm text-[#64748B] mt-1.5">{calc.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5: Why Use Our Calculators? */}
        <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8">
          <div className="max-w-2xl mb-6">
            <h2 className="font-display text-2xl font-bold text-[#0F172A]">{ui.home.whyTitle}</h2>
            <p className="text-sm text-[#64748B] mt-1">{ui.home.whySubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ui.home.whyItems.map((item, idx) => {
              const Icon = WHY_ICONS[idx % WHY_ICONS.length];
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A]">{item.title}</h3>
                    <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Educational Content & Guides */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">{ui.home.guidesTitle}</h2>
              <p className="text-sm text-[#64748B] mt-1">{ui.home.guidesSubtitle}</p>
            </div>
            <Link to={l('/guides/')} className="text-sm font-medium text-[#2563EB] hover:underline whitespace-nowrap shrink-0">
              {ui.home.allGuides}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {articles.slice(0, 3).map((art) => (
              <Link
                key={art.slug}
                to={l(`/guides/${art.slug}/`)}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#2563EB] transition-colors flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-[#64748B] mb-2">
                    {art.categoryLabel} · {art.readTime}
                  </p>
                  <h3 className="font-display text-base font-bold text-[#0F172A] leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-sm text-[#64748B] mt-2 leading-relaxed">{art.summary}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
                  {ui.home.readGuide} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
