import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Megaphone,
  Plus,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import { getCalculatorUrl } from '../data/calculators/index.ts';
import { AdConfig, ArticleDef, CategorySlug } from '../types/calculator.ts';
import { SeoHead } from '../components/seo/SeoHead.tsx';

type AdminTab = 'ads' | 'calculators' | 'guides';

const SLOT_LABELS: {
  key: keyof AdConfig['slots'];
  titleEn: string;
  titleAr: string;
  placementEn: string;
  placementAr: string;
}[] = [
  {
    key: 'homepageBanner',
    titleEn: 'Homepage Top Banner',
    titleAr: 'بانر أعلى الصفحة الرئيسية',
    placementEn: '728×90 / Responsive above Popular Calculators',
    placementAr: '728×90 / متجاوب أعلى الحاسبات الشائعة',
  },
  {
    key: 'homepageInContent',
    titleEn: 'Homepage In-Content',
    titleAr: 'إعلان داخل الصفحة الرئيسية',
    placementEn: '728×90 / Responsive between Categories and Recent',
    placementAr: '728×90 / متجاوب بين الأقسام والمضافة حديثاً',
  },
  {
    key: 'categoryTop',
    titleEn: 'Category Top Banner',
    titleAr: 'بانر أعلى القسم',
    placementEn: '728×90 / Responsive on Category Archive pages',
    placementAr: '728×90 / متجاوب في صفحات الأقسام',
  },
  {
    key: 'calculatorTop',
    titleEn: 'Calculator Top Banner',
    titleAr: 'بانر أعلى الحاسبة',
    placementEn: '728×90 / Responsive above Calculator Workspace',
    placementAr: '728×90 / متجاوب أعلى مساحة الحاسبة',
  },
  {
    key: 'calculatorSidebar',
    titleEn: 'Calculator Desktop Sidebar',
    titleAr: 'الشريط الجانبي للحاسبة',
    placementEn: '300×250 Rectangle alongside calculator',
    placementAr: '300×250 مستطيل بجانب الحاسبة',
  },
  {
    key: 'calculatorInContent',
    titleEn: 'Calculator In-Content',
    titleAr: 'إعلان داخل صفحة الحاسبة',
    placementEn: '728×90 between Worked Example and Educational Content',
    placementAr: '728×90 بين المثال التطبيقي والمحتوى التعليمي',
  },
  {
    key: 'pageBottom',
    titleEn: 'Page Bottom Banner',
    titleAr: 'بانر أسفل الصفحة',
    placementEn: '728×90 / Responsive above Footer',
    placementAr: '728×90 / متجاوب أعلى التذييل',
  },
];

export function AdminPage() {
  const {
    lang,
    l,
    ui,
    categories,
    calculators,
    articles,
    adConfig,
    updateAdConfig,
    updateCalculatorMeta,
    addOrUpdateArticle,
    deleteCustomArticle,
    resetCmsDefaults,
  } = useAppContext();

  const isAr = lang === 'ar';

  const [tab, setTab] = useState<AdminTab>('ads');
  const [savedNotice, setSavedNotice] = useState('');

  // Ad Settings state
  const [adDraft, setAdDraft] = useState<AdConfig>(adConfig);

  // Calculators CMS state
  const [calcSearch, setCalcSearch] = useState('');
  const [selectedSlug, setSelectedSlug] = useState(calculators[0]?.slug || 'mortgage-calculator');

  const filteredCalcs = useMemo(() => {
    const q = calcSearch.trim().toLowerCase();
    if (!q) return calculators;
    return calculators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [calculators, calcSearch]);

  const selectedCalc = calculators.find((c) => c.slug === selectedSlug) || calculators[0];

  // Article editor state
  const [artTitle, setArtTitle] = useState('');
  const [artSlug, setArtSlug] = useState('');
  const [artCat, setArtCat] = useState<CategorySlug>('financial-calculators');
  const [artSummary, setArtSummary] = useState('');
  const [artHeading, setArtHeading] = useState(isAr ? 'المبادئ الأساسية' : 'Key Principles');
  const [artBody, setArtBody] = useState('');
  const [artRelated, setArtRelated] = useState('mortgage-calculator, compound-interest-calculator');

  const notify = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(''), 3000);
  };

  const handleSaveAds = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdConfig(adDraft);
    notify(isAr ? 'تم حفظ إعدادات AdSense والمواضع الإعلانية.' : 'AdSense & placement settings saved.');
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artSummary.trim() || !artBody.trim()) return;
    const slug =
      artSlug.trim() ||
      artTitle
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `guide-${Date.now()}`;
    const catObj = categories.find((c) => c.slug === artCat);
    const article: ArticleDef = {
      slug,
      title: artTitle.trim(),
      category: artCat,
      categoryLabel: catObj?.shortName || (isAr ? 'دليل' : 'Guide'),
      readTime: isAr ? '4 دقائق قراءة' : '4 min read',
      updatedAt: new Date().toISOString().slice(0, 10),
      summary: artSummary.trim(),
      sections: [{ heading: artHeading.trim() || (isAr ? 'نظرة عامة' : 'Overview'), body: artBody.trim() }],
      relatedCalculatorSlugs: artRelated
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    addOrUpdateArticle(article);
    setArtTitle('');
    setArtSlug('');
    setArtSummary('');
    setArtBody('');
    notify(isAr ? `تم نشر الدليل "${article.title}".` : `Published guide "${article.title}".`);
  };

  return (
    <>
      <SeoHead
        title={`${ui.footer.cmsSettings} | ${ui.brandName}`}
        description={
          isAr
            ? 'إدارة معرّف ناشر Google AdSense، مواضع الإعلانات، بيانات الحاسبات، والأدلة التعليمية.'
            : 'Configure Google AdSense publisher IDs, manage ad slots, edit calculator SEO metadata, and publish educational guides.'
        }
        canonicalPath="/admin/"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl border border-[#E2E8F0] p-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F172A] flex items-center gap-2.5">
              <Settings className="w-6 h-6 text-[#2563EB]" />
              <span>{isAr ? 'إدارة المحتوى والإعلانات' : 'Platform CMS & Ad Management'}</span>
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              {isAr
                ? 'إدارة مواضع إعلانات AdSense وبيانات الحاسبات والأدلة التعليمية محلياً في المتصفح.'
                : 'Manage AdSense slots, calculator metadata/visibility, and educational guides locally in your browser.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetCmsDefaults();
              notify(isAr ? 'تمت استعادة الإعدادات الافتراضية.' : 'Restored all platform defaults.');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#475569] self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#16A34A]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-3">
          <button
            type="button"
            onClick={() => setTab('ads')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'ads'
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>{isAr ? 'إعلانات AdSense والمواضع' : 'AdSense & Placements'}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('calculators')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'calculators'
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isAr ? `الحاسبات (${calculators.length})` : `Calculators (${calculators.length})`}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('guides')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'guides'
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {isAr ? `الأدلة التعليمية (${articles.length})` : `Educational Guides (${articles.length})`}
            </span>
          </button>
        </div>

        {/* TAB 1: ADSENSE & PLACEMENTS */}
        {tab === 'ads' && (
          <form onSubmit={handleSaveAds} className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F172A]">
                  {isAr ? 'التحكم العام بالإعلانات' : 'Global Ad Controls'}
                </h2>
                <label className="flex items-center justify-between gap-4 p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {isAr ? 'تفعيل حاويات الإعلانات' : 'Enable Ad Containers'}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {isAr
                        ? 'مفتاح التشغيل الرئيسي لجميع المساحات الإعلانية في الموقع.'
                        : 'Master switch for all advertising slots site-wide.'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={adDraft.enabled}
                    onChange={(e) => setAdDraft({ ...adDraft, enabled: e.target.checked })}
                    className="w-4 h-4 accent-[#2563EB]"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {isAr ? 'إظهار مواضع الانتظار' : 'Show Slot Placeholders'}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {isAr
                        ? 'عرض حاويات محجوزة هادئة عند عدم إدخال معرّف وحدة AdSense بعد.'
                        : 'Render subtle reserved containers when no AdSense Slot ID is configured yet.'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={adDraft.showSlotPlaceholders}
                    onChange={(e) => setAdDraft({ ...adDraft, showSlotPlaceholders: e.target.checked })}
                    className="w-4 h-4 accent-[#2563EB]"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F172A]">
                  {isAr ? 'بيانات Google AdSense' : 'Google AdSense Credentials'}
                </h2>
                <label className="block text-sm">
                  <span className="font-medium text-[#1E293B]">
                    {isAr ? 'معرّف الناشر (data-ad-client)' : 'Publisher ID (data-ad-client)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={adDraft.publisherId}
                    onChange={(e) => setAdDraft({ ...adDraft, publisherId: e.target.value })}
                    placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                    className="mt-1.5 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] font-mono-tabular text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                  />
                </label>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {isAr
                    ? 'ألصق معرّف الناشر ومعرّفات الوحدات الإعلانية أدناه بعد اعتماد نطاقك في AdSense.'
                    : 'Paste your verified AdSense Publisher ID and individual Ad Unit Slot IDs below. Leave blank until your domain is approved—no fake or placeholder ad networks are injected.'}
                </p>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-6">
              <h2 className="font-display text-lg font-bold text-[#0F172A] mb-4">
                {isAr ? 'معرّفات المساحات الإعلانية' : 'Slot Unit IDs'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SLOT_LABELS.map((slot) => (
                  <label key={slot.key} className="block rounded-lg border border-[#E2E8F0] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {isAr ? slot.titleAr : slot.titleEn}
                      </span>
                      <span dir="ltr" className="text-[11px] font-mono-tabular text-[#64748B]">
                        {slot.key}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 mb-2">
                      {isAr ? slot.placementAr : slot.placementEn}
                    </p>
                    <input
                      type="text"
                      dir="ltr"
                      value={adDraft.slots[slot.key]}
                      onChange={(e) =>
                        setAdDraft({
                          ...adDraft,
                          slots: { ...adDraft.slots, [slot.key]: e.target.value },
                        })
                      }
                      placeholder={
                        isAr ? 'معرّف الوحدة الاختياري (مثال: 1234567890)' : 'Optional Ad Unit Slot ID (e.g. 1234567890)'
                      }
                      className="w-full h-9 px-3 rounded-md border border-[#CBD5E1] font-mono-tabular text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
              >
                {isAr ? 'حفظ إعدادات الإعلانات' : 'Save Ad Settings'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CALCULATORS CMS */}
        {tab === 'calculators' && selectedCalc && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={calcSearch}
                  onChange={(e) => setCalcSearch(e.target.value)}
                  placeholder={isAr ? 'تصفية الحاسبات...' : 'Filter calculators...'}
                  className="w-full h-9 ps-9 pe-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                />
              </div>

              <div className="max-h-[480px] overflow-y-auto divide-y divide-[#F1F5F9]">
                {filteredCalcs.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setSelectedSlug(c.slug)}
                    className={`w-full text-start px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between gap-2 ${
                      c.slug === selectedCalc.slug ? 'bg-[#EFF6FF] text-[#2563EB]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-[#64748B] truncate">{c.category}</p>
                    </div>
                    <span className="text-[11px] font-medium text-[#64748B] shrink-0">
                      {c.published === false
                        ? isAr
                          ? 'مخفي'
                          : 'Hidden'
                        : c.popular
                        ? isAr
                          ? 'شائع'
                          : 'Popular'
                        : isAr
                        ? 'منشور'
                        : 'Live'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#0F172A]">{selectedCalc.name}</h2>
                  <p dir="ltr" className="text-xs font-mono-tabular text-[#64748B] text-start">
                    {getCalculatorUrl(selectedCalc, undefined, lang)}
                  </p>
                </div>
                <Link
                  to={getCalculatorUrl(selectedCalc, undefined, lang)}
                  className="text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
                >
                  {isAr ? 'فتح الصفحة' : 'Open Live Page'}
                </Link>
              </div>

              <div className="space-y-4">
                <label className="block text-sm">
                  <span className="font-medium text-[#1E293B]">
                    {isAr ? 'اسم العرض' : 'Display Name'}
                  </span>
                  <input
                    type="text"
                    value={selectedCalc.name}
                    onChange={(e) => updateCalculatorMeta(selectedCalc.slug, { name: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm"
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-[#1E293B]">
                    {isAr ? 'الوصف' : 'Description'}
                  </span>
                  <textarea
                    rows={2}
                    value={selectedCalc.description}
                    onChange={(e) => updateCalculatorMeta(selectedCalc.slug, { description: e.target.value })}
                    className="mt-1 w-full p-3 rounded-lg border border-[#CBD5E1] text-sm"
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-[#1E293B]">
                    {isAr ? 'عنوان SEO' : 'SEO Title'}
                  </span>
                  <input
                    type="text"
                    value={selectedCalc.seoTitle}
                    onChange={(e) => updateCalculatorMeta(selectedCalc.slug, { seoTitle: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm"
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-[#1E293B]">
                    {isAr ? 'وصف SEO التعريفي' : 'SEO Meta Description'}
                  </span>
                  <textarea
                    rows={2}
                    value={selectedCalc.seoDescription}
                    onChange={(e) => updateCalculatorMeta(selectedCalc.slug, { seoDescription: e.target.value })}
                    className="mt-1 w-full p-3 rounded-lg border border-[#CBD5E1] text-sm"
                  />
                </label>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="inline-flex items-center gap-2 text-sm text-[#1E293B]">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedCalc.popular)}
                      onChange={(e) => updateCalculatorMeta(selectedCalc.slug, { popular: e.target.checked })}
                      className="w-4 h-4 accent-[#2563EB]"
                    />
                    <span>{isAr ? 'إظهار في الأكثر استخداماً' : 'Show in Popular Grid'}</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-[#1E293B]">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedCalc.recentlyAdded)}
                      onChange={(e) =>
                        updateCalculatorMeta(selectedCalc.slug, { recentlyAdded: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#2563EB]"
                    />
                    <span>{isAr ? 'إظهار في المضافة حديثاً' : 'Show in Recently Added'}</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-[#1E293B]">
                    <input
                      type="checkbox"
                      checked={selectedCalc.published !== false}
                      onChange={(e) => updateCalculatorMeta(selectedCalc.slug, { published: e.target.checked })}
                      className="w-4 h-4 accent-[#2563EB]"
                    />
                    <span>{isAr ? 'منشورة' : 'Published'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EDUCATIONAL GUIDES */}
        {tab === 'guides' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form onSubmit={handleCreateArticle} className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#2563EB]" />
                <span>{isAr ? 'نشر دليل تعليمي جديد' : 'Publish New Educational Guide'}</span>
              </h2>

              <label className="block text-sm">
                <span className="font-medium text-[#1E293B]">
                  {isAr ? 'عنوان المقال' : 'Article Title'}
                </span>
                <input
                  type="text"
                  required
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  placeholder={
                    isAr
                      ? 'كيف توفر الدفعات الإضافية من فوائد الرهن العقاري'
                      : 'How Amortization Extra Payments Save Interest'
                  }
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm">
                  <span className="font-medium text-[#1E293B]">
                    {isAr ? 'الرابط المختصر Slug (اختياري)' : 'URL Slug (optional)'}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={artSlug}
                    onChange={(e) => setArtSlug(e.target.value)}
                    placeholder="auto-generated-from-title"
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm font-mono-tabular"
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-[#1E293B]">{isAr ? 'القسم' : 'Category'}</span>
                  <select
                    value={artCat}
                    onChange={(e) => setArtCat(e.target.value as CategorySlug)}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.shortName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-[#1E293B]">{isAr ? 'الملخص' : 'Summary'}</span>
                <textarea
                  rows={2}
                  required
                  value={artSummary}
                  onChange={(e) => setArtSummary(e.target.value)}
                  className="mt-1 w-full p-3 rounded-lg border border-[#CBD5E1] text-sm"
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-[#1E293B]">
                  {isAr ? 'عنوان الفقرة' : 'Section Heading'}
                </span>
                <input
                  type="text"
                  value={artHeading}
                  onChange={(e) => setArtHeading(e.target.value)}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm"
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-[#1E293B]">
                  {isAr ? 'محتوى المقال' : 'Article Content'}
                </span>
                <textarea
                  rows={4}
                  required
                  value={artBody}
                  onChange={(e) => setArtBody(e.target.value)}
                  className="mt-1 w-full p-3 rounded-lg border border-[#CBD5E1] text-sm"
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-[#1E293B]">
                  {isAr ? 'الحاسبات المرتبطة (مفصولة بفاصلة)' : 'Related Calculator Slugs (comma-separated)'}
                </span>
                <input
                  type="text"
                  dir="ltr"
                  value={artRelated}
                  onChange={(e) => setArtRelated(e.target.value)}
                  className="mt-1 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm font-mono-tabular"
                />
              </label>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
              >
                {isAr ? 'نشر الدليل' : 'Publish Guide'}
              </button>
            </form>

            <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                {isAr ? 'الأدلة المنشورة' : 'Published Guides'}
              </h2>
              <div className="divide-y divide-[#F1F5F9]">
                {articles.map((art) => (
                  <div key={art.slug} className="py-3 flex items-start justify-between gap-3">
                    <div>
                      <Link
                        to={l(`/guides/${art.slug}/`)}
                        className="text-sm font-semibold text-[#0F172A] hover:text-[#2563EB]"
                      >
                        {art.title}
                      </Link>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {art.categoryLabel} · {art.readTime} · {art.updatedAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        deleteCustomArticle(art.slug);
                        notify(
                          isAr
                            ? 'تم حذف التعديل المخصص (تبقى الأدلة الأساسية).'
                            : 'Removed custom guide override (built-in guides remain).'
                        );
                      }}
                      title={isAr ? 'حذف الدليل المخصص' : 'Delete custom guide'}
                      className="p-1.5 rounded-md text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
