import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import { getCalculatorUrl } from '../data/calculators/index.ts';
import { SeoHead } from '../components/seo/SeoHead.tsx';

export function GuidesPage() {
  const { slug } = useParams();
  const { articles, calculators, ui, lang, l } = useAppContext();

  if (slug) {
    const article = articles.find((a) => a.slug === slug);
    if (!article) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-[#0F172A]">{ui.guides.notFound}</h1>
          <Link to={l('/guides/')} className="mt-4 inline-block text-sm font-semibold text-[#2563EB] hover:underline">
            {ui.guides.browseAll}
          </Link>
        </div>
      );
    }

    const related = article.relatedCalculatorSlugs
      .map((s) => calculators.find((c) => c.slug === s))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

    return (
      <>
        <SeoHead
          title={`${article.title} | ${ui.brandName}`}
          description={article.summary}
          canonicalPath={`/guides/${article.slug}/`}
          schemas={[
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: article.title,
              description: article.summary,
              dateModified: article.updatedAt,
            },
          ]}
        />
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Link to={l('/')} className="hover:text-[#2563EB]">{ui.nav.home}</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            <Link to={l('/guides/')} className="hover:text-[#2563EB]">{ui.guides.guidesCrumb}</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            <span className="text-[#0F172A] font-medium truncate">{article.title}</span>
          </nav>

          <header className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8">
            <p className="text-xs text-[#64748B]">
              {article.categoryLabel} · {article.readTime} · {ui.guides.updated} {article.updatedAt}
            </p>
            <h1 className="mt-2 font-display text-2xl sm:text-4xl font-bold text-[#0F172A] leading-tight">
              {article.title}
            </h1>
            <p className="mt-3 text-base text-[#475569] leading-relaxed">{article.summary}</p>
          </header>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6">
            {article.sections.map((sec) => (
              <section key={sec.heading}>
                <h2 className="font-display text-xl font-bold text-[#0F172A]">{sec.heading}</h2>
                <p className="mt-2 text-sm sm:text-base text-[#475569] leading-relaxed">{sec.body}</p>
              </section>
            ))}
          </div>

          {related.length > 0 && (
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h2 className="font-display text-lg font-bold text-[#0F172A] mb-3">
                {ui.guides.tryRelated}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map((c) => (
                  <Link
                    key={c.slug}
                    to={getCalculatorUrl(c, undefined, lang)}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] p-3 transition-colors"
                  >
                    <p className="text-sm font-semibold text-[#0F172A]">{c.name}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{c.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </>
    );
  }

  return (
    <>
      <SeoHead
        title={`${ui.guides.title} | ${ui.brandName}`}
        description={ui.guides.subtitle}
        canonicalPath="/guides/"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0F172A]">{ui.guides.title}</h1>
          <p className="mt-2 text-base text-[#64748B]">{ui.guides.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((art) => (
            <Link
              key={art.slug}
              to={l(`/guides/${art.slug}/`)}
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:border-[#2563EB] transition-colors flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-[#64748B] mb-2">
                  {art.categoryLabel} · {art.readTime}
                </p>
                <h2 className="font-display text-lg font-bold text-[#0F172A] leading-snug">{art.title}</h2>
                <p className="mt-2 text-sm text-[#64748B] leading-relaxed">{art.summary}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
                {ui.guides.readFull} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
