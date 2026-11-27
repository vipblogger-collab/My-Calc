import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Mail, Map, ShieldAlert } from 'lucide-react';
import { getCalculatorUrl, getCalculatorsByCategory } from '../data/calculators/index.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { SeoHead } from '../components/seo/SeoHead.tsx';

export type LegalPageKind =
  | 'about-us'
  | 'contact-us'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'disclaimer'
  | 'cookie-policy'
  | 'sitemap';

export function LegalPages({ page }: { page: LegalPageKind }) {
  const { calculators, categories, articles, lang, ui, l } = useAppContext();
  const isAr = lang === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Calculator Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes('@') || !message.trim()) {
      setFormError(
        isAr
          ? 'يرجى إدخال الاسم وعنوان بريد إلكتروني صحيح والرسالة.'
          : 'Please provide your name, a valid email address, and a message.'
      );
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '8002c461-c0fd-435f-8576-61b3d8b13169',
          name: name.trim(),
          email: email.trim(),
          topic,
          subject: `[mysmartcalc.net] ${topic} - ${name.trim()}`,
          message: message.trim(),
        }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string };
      if (response.ok && result.success) {
        setSubmitted(true);
      } else {
        setFormError(
          result.message ||
            (isAr
              ? 'تعذر إرسال الرسالة حالياً. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة على support@mysmartcalc.net.'
              : 'Unable to send your message right now. Please try again or email support@mysmartcalc.net.')
        );
      }
    } catch {
      setFormError(
        isAr
          ? 'حدث خطأ في الاتصال بالشبكة أثناء الإرسال. يمكنك مراسلتنا مباشرة على support@mysmartcalc.net.'
          : 'Network error while sending your message. Please email us directly at support@mysmartcalc.net.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (page === 'sitemap') {
    const publishedCount = calculators.filter((c) => c.published !== false).length;
    return (
      <>
        <SeoHead
          title={`${ui.footer.htmlSitemap} | ${ui.brandName}`}
          description={
            isAr
              ? 'تصفح جميع أقسام الحاسبات والأدوات الفردية والأدلة التعليمية وصفحات السياسات في مكان واحد.'
              : 'Browse all mysmartcalc.net calculator categories, individual calculation tools, educational guides, and legal resources in one structured index.'
          }
          canonicalPath="/sitemap/"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B] mb-3">
              <Link to={l('/')} className="hover:text-[#2563EB]">
                {ui.nav.home}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              <span className="font-medium text-[#0F172A]">{ui.footer.htmlSitemap}</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#0F172A] flex items-center gap-2.5">
                  <Map className="w-7 h-7 text-[#2563EB]" />
                  <span>{ui.footer.htmlSitemap}</span>
                </h1>
                <p className="mt-1.5 text-sm text-[#64748B]">
                  {isAr
                    ? `دليل شامل يضم ${publishedCount} حاسبة عبر ${categories.length} أقسام رئيسية.`
                    : `Complete directory of ${publishedCount} calculators across ${categories.length} categories.`}
                </p>
              </div>
              <a
                href="/sitemap.xml"
                className="text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
              >
                {isAr ? 'عرض خريطة XML (/sitemap.xml)' : 'View XML Sitemap (/sitemap.xml)'}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const list = getCalculatorsByCategory(cat.slug, calculators);
              return (
                <section key={cat.slug} className="bg-white rounded-xl border border-[#E2E8F0] p-6">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
                    <Link
                      to={l(`/${cat.slug}/`)}
                      className="font-display text-lg font-bold text-[#0F172A] hover:text-[#2563EB]"
                    >
                      {cat.name}
                    </Link>
                    <span className="text-xs text-[#64748B] tabular-nums">{list.length}</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {list.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to={getCalculatorUrl(c, cat.slug, lang)}
                          className="text-[#475569] hover:text-[#2563EB] hover:underline"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h2 className="font-display text-lg font-bold text-[#0F172A] pb-3 border-b border-[#F1F5F9]">
                {ui.footer.guides}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {articles.map((art) => (
                  <li key={art.slug}>
                    <Link to={l(`/guides/${art.slug}/`)} className="text-[#475569] hover:text-[#2563EB] hover:underline">
                      {art.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h2 className="font-display text-lg font-bold text-[#0F172A] pb-3 border-b border-[#F1F5F9]">
                {ui.footer.companyHeading}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link to={l('/about-us/')} className="text-[#475569] hover:text-[#2563EB] hover:underline">
                    {ui.footer.aboutUs}
                  </Link>
                </li>
                <li>
                  <Link to={l('/contact-us/')} className="text-[#475569] hover:text-[#2563EB] hover:underline">
                    {ui.footer.contactUs}
                  </Link>
                </li>
                <li>
                  <Link to={l('/privacy-policy/')} className="text-[#475569] hover:text-[#2563EB] hover:underline">
                    {ui.footer.privacyPolicy}
                  </Link>
                </li>
                <li>
                  <Link to={l('/terms-of-service/')} className="text-[#475569] hover:text-[#2563EB] hover:underline">
                    {ui.footer.termsOfService}
                  </Link>
                </li>
                <li>
                  <Link to={l('/disclaimer/')} className="text-[#475569] hover:text-[#2563EB] hover:underline">
                    {ui.footer.disclaimer}
                  </Link>
                </li>
                <li>
                  <Link to={l('/cookie-policy/')} className="text-[#475569] hover:text-[#2563EB] hover:underline">
                    {ui.footer.cookiePolicy}
                  </Link>
                </li>
                <li>
                  <Link to={l('/admin/')} className="text-[#475569] hover:text-[#2563EB] hover:underline">
                    {ui.footer.cmsSettings}
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </>
    );
  }

  if (page === 'contact-us') {
    const topicLabels: Record<string, string> = isAr
      ? {
          'Calculator Feedback': 'ملاحظات حول الحاسبة',
          'New Tool Request': 'طلب أداة جديدة',
          'Formula Verification': 'التحقق من معادلة',
          'Advertising & Partnerships': 'الإعلانات والشراكات',
        }
      : {
          'Calculator Feedback': 'Calculator Feedback',
          'New Tool Request': 'New Tool Request',
          'Formula Verification': 'Formula Verification',
          'Advertising & Partnerships': 'Advertising & Partnerships',
        };

    return (
      <>
        <SeoHead
          title={`${ui.footer.contactUs} | ${ui.brandName}`}
          description={
            isAr
              ? 'أرسل ملاحظاتك أو اقترح حاسبة جديدة أو أبلغ عن مسألة حسابية.'
              : 'Send feedback, report a formula edge case, or request a new calculator on mysmartcalc.net.'
          }
          canonicalPath="/contact-us/"
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Link to={l('/')} className="hover:text-[#2563EB]">
              {ui.nav.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            <span className="font-medium text-[#0F172A]">{ui.footer.contactUs}</span>
          </nav>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-[#0F172A] flex items-center gap-2.5">
                <Mail className="w-6 h-6 text-[#2563EB]" />
                <span>{isAr ? `تواصل مع ${ui.brandName}` : `Contact ${ui.brandName}`}</span>
              </h1>
              <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
                {isAr
                  ? 'هل لديك اقتراح لحاسبة جديدة، أو استفسار حول معادلة، أو رغبة في مناقشة الشراكات؟ أرسل لنا رسالتك أدناه.'
                  : 'Have a suggestion for a new calculator, noticed a rounding question, or want to discuss partnerships? Send us a note below.'}
              </p>
            </div>

            {submitted ? (
              <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-6 space-y-3">
                <div className="flex items-center gap-2 text-[#16A34A] font-semibold text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isAr ? 'تم استلام الرسالة' : 'Message Received'}</span>
                </div>
                <p className="text-sm text-[#1E293B]">
                  {isAr
                    ? `شكراً لك، ${name}. تم تسجيل رسالتك بخصوص "${topicLabels[topic] || topic}" للمراجعة.`
                    : `Thank you, ${name}. Your ${topic.toLowerCase()} note has been recorded for review.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  {isAr ? 'إرسال رسالة أخرى' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {formError && (
                  <p className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2">
                    {formError}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-sm">
                    <span className="font-medium text-[#1E293B]">
                      {isAr ? 'الاسم الكامل' : 'Your Name'}
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isAr ? 'أحمد محمد' : 'Alex Rivera'}
                      className="mt-1.5 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-[#1E293B]">
                      {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                    </span>
                    <input
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="mt-1.5 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                    />
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="font-medium text-[#1E293B]">{isAr ? 'الموضوع' : 'Topic'}</span>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 rounded-lg border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                  >
                    {Object.entries(topicLabels).map(([val, lbl]) => (
                      <option key={val} value={val}>
                        {lbl}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="font-medium text-[#1E293B]">{isAr ? 'الرسالة' : 'Message'}</span>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isAr
                        ? 'شاركنا التفاصيل أو رابط الحاسبة أو القيم المدخلة...'
                        : 'Share details, calculator URL, or inputs...'
                    }
                    className="mt-1.5 w-full p-3 rounded-lg border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  {submitting
                    ? isAr
                      ? 'جاري الإرسال...'
                      : 'Sending...'
                    : isAr
                    ? 'إرسال الرسالة'
                    : 'Send Message'}
                </button>

                <p className="pt-2 text-xs text-[#64748B]">
                  {isAr ? 'أو يمكنك التواصل معنا مباشرة عبر البريد الإلكتروني: ' : 'Or reach us directly via email at '}
                  <a
                    href="mailto:support@mysmartcalc.net"
                    dir="ltr"
                    className="text-[#2563EB] hover:underline font-medium"
                  >
                    support@mysmartcalc.net
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </>
    );
  }

  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const contentMapEn: Record<
    Exclude<LegalPageKind, 'sitemap' | 'contact-us'>,
    {
      title: string;
      description: string;
      canonical: string;
      updated: string;
      sections: { heading: string; body: React.ReactNode }[];
    }
  > = {
    'about-us': {
      title: 'About Us',
      description: 'Learn how mysmartcalc.net builds fast, transparent, client-side online calculators with documented formulas.',
      canonical: '/about-us/',
      updated: todayDate,
      sections: [
        {
          heading: 'Our Mission',
          body: 'mysmartcalc.net provides free, reliable, and transparent online calculation tools across personal finance, health and fitness, mathematics, unit conversions, dates and time, everyday planning, and engineering science.',
        },
        {
          heading: 'Transparent Formulas & Client-Side Privacy',
          body: 'Every calculator executes directly in your browser using verified mathematical and domain standards—such as exact Gregorian calendar arithmetic, NIST/SI unit factors, standard loan amortization equations, and Mifflin-St Jeor metabolic formulas. Your numeric inputs are never sold or stored on remote servers.',
        },
        {
          heading: 'Built for Clarity',
          body: 'Alongside instant results and interactive charts, each tool documents the exact formula, variable definitions, worked examples, and frequently asked questions so you can verify every calculation step.',
        },
        {
          heading: 'Contact & Editorial Oversight',
          body: (
            <p>
              mysmartcalc.net is developed and maintained by an independent team dedicated to delivering accurate, easy-to-use calculation tools in both English and Arabic. We continuously review our formulas and guides to ensure clarity and reliability. For suggestions, corrections, or general inquiries, please contact us at{' '}
              <a
                href="mailto:support@mysmartcalc.net"
                className="text-[#2563EB] hover:underline font-medium"
              >
                support@mysmartcalc.net
              </a>{' '}
              or through our{' '}
              <Link to={l('/contact-us/')} className="text-[#2563EB] hover:underline font-medium">
                Contact Page
              </Link>
              .
            </p>
          ),
        },
      ],
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      description: 'How mysmartcalc.net handles browser storage, calculator inputs, analytics, and advertising privacy.',
      canonical: '/privacy-policy/',
      updated: todayDate,
      sections: [
        {
          heading: 'Calculator Input Privacy',
          body: 'All calculations—including financial figures, body measurements, dates, and equations—run locally in your web browser. mysmartcalc.net does not require registration and does not transmit your personal calculation inputs to a backend database.',
        },
        {
          heading: 'Local Browser Storage',
          body: 'If you bookmark calculators, view recent tools, or customize platform settings, those preferences are saved solely inside your browser’s localStorage and can be cleared anytime in your browser settings.',
        },
        {
          heading: 'Third-Party Feeds & Advertising',
          body: (
            <p>
              The Currency Converter retrieves public market exchange rates without sending any personal identifiers. We partner with third-party advertising networks, including Google AdSense, which may use cookies and web beacons to display relevant advertisements based on your visits to mysmartcalc.net and other websites. For more details on how Google manages data in its ad products, please review{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline font-medium"
              >
                Google’s Privacy &amp; Terms
              </a>
              .
            </p>
          ),
        },
        {
          heading: 'Log Files & Analytics',
          body: 'Like most standard websites, mysmartcalc.net and our hosting provider may collect non-personally identifiable log data (such as browser type, device type, referring pages, and approximate region) strictly to monitor site performance, security, and aggregated traffic trends.',
        },
        {
          heading: "Children's Information",
          body: 'mysmartcalc.net does not knowingly collect any Personal Identifiable Information from children under the age of 13.',
        },
        {
          heading: 'Your Consent & Contact',
          body: (
            <p>
              By using our website, you hereby consent to our Privacy Policy. If you have any questions regarding this policy, please contact us via our{' '}
              <Link to={l('/contact-us/')} className="text-[#2563EB] hover:underline font-medium">
                Contact Page
              </Link>{' '}
              or at{' '}
              <a
                href="mailto:support@mysmartcalc.net"
                className="text-[#2563EB] hover:underline font-medium"
              >
                support@mysmartcalc.net
              </a>
            </p>
          ),
        },
      ],
    },
    'terms-of-service': {
      title: 'Terms of Service',
      description: 'Terms governing use of mysmartcalc.net online calculators, formulas, and educational guides.',
      canonical: '/terms-of-service/',
      updated: todayDate,
      sections: [
        {
          heading: 'Acceptance of Terms',
          body: 'By accessing or using mysmartcalc.net, you agree to use these calculators and educational guides solely for lawful informational and planning purposes.',
        },
        {
          heading: 'Informational Nature & Accuracy',
          body: 'While we carefully test every formula and unit constant, mysmartcalc.net provides tools “as is” without warranties of uninterrupted availability or suitability for regulated filings, medical diagnosis, or binding contracts. Always double-check critical figures with qualified professionals.',
        },
        {
          heading: 'Intellectual Property',
          body: 'The mysmartcalc.net interface, educational guides, and curated tool documentation remain the property of mysmartcalc.net. You are welcome to print or export your own calculation results for personal or business reference.',
        },
        {
          heading: 'Limitation of Liability',
          body: 'In no event shall mysmartcalc.net or its team be liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, our calculators, exchange rate feeds, or educational content.',
        },
        {
          heading: 'Third-Party Links & Advertisements',
          body: 'mysmartcalc.net may display advertisements served by third-party networks (such as Google AdSense) and include links to external websites. We do not control or endorse the content, products, or privacy practices of any third-party sites.',
        },
        {
          heading: 'Changes to Terms & Contact',
          body: (
            <p>
              We reserve the right to update or modify these Terms of Service at any time without prior notice. If you have any questions about these terms, please contact us at{' '}
              <a
                href="mailto:support@mysmartcalc.net"
                className="text-[#2563EB] hover:underline font-medium"
              >
                support@mysmartcalc.net
              </a>
              .
            </p>
          ),
        },
      ],
    },
    disclaimer: {
      title: 'Disclaimer',
      description: 'Important financial, medical, tax, and exchange-rate disclaimers for mysmartcalc.net calculators.',
      canonical: '/disclaimer/',
      updated: todayDate,
      sections: [
        {
          heading: 'Financial & Tax Disclaimer',
          body: 'Mortgage, loan, investment, retirement, tax, and debt calculators generate illustrative estimates based on user-supplied assumptions. They do not constitute licensed financial, investment, legal, or tax advice. Actual lender APRs, closing costs, tax brackets, and market returns vary.',
        },
        {
          heading: 'Health & Medical Disclaimer',
          body: 'BMI, BMR, TDEE, body fat, pregnancy, ovulation, heart rate, and sleep calculators rely on standardized population equations (such as Mifflin-St Jeor, US Navy, and Naegele’s rule). They are not medical devices and do not substitute for consultation with a physician, registered dietitian, or obstetrician.',
        },
        {
          heading: 'Currency & External Rates Disclaimer',
          body: 'Live currency exchange rates represent indicative mid-market rates sourced from public market feeds and exclude bank spreads, card foreign-transaction fees, and settlement timing differences.',
        },
        {
          heading: 'General Accuracy & External Links',
          body: 'While we strive to keep all formulas, conversion factors, and educational guides on mysmartcalc.net accurate and up to date, we make no warranties regarding the completeness or reliability of any result. Any links to external websites or third-party advertisements are provided for convenience and do not imply endorsement.',
        },
        {
          heading: 'Questions & Feedback',
          body: (
            <p>
              If you spot a calculation discrepancy or have questions about this disclaimer, please contact us at{' '}
              <a
                href="mailto:support@mysmartcalc.net"
                className="text-[#2563EB] hover:underline font-medium"
              >
                support@mysmartcalc.net
              </a>
              .
            </p>
          ),
        },
      ],
    },
    'cookie-policy': {
      title: 'Cookie Policy',
      description: 'Information on essential browser storage and Google AdSense advertising cookies on mysmartcalc.net.',
      canonical: '/cookie-policy/',
      updated: todayDate,
      sections: [
        {
          heading: 'Essential Storage',
          body: 'mysmartcalc.net uses minimal browser storage (localStorage) strictly for functional preferences you choose—such as bookmarked calculators and recently viewed tools. No user-tracking login cookies are set by the core application.',
        },
        {
          heading: 'Advertising Cookies (Google AdSense)',
          body: (
            <>
              <p>
                Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to mysmartcalc.net or other websites. Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.
              </p>
              <p>
                Users may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://myadcenter.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  Google Ads Settings
                </a>{' '}
                or{' '}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  www.aboutads.info
                </a>
                .
              </p>
            </>
          ),
        },
        {
          heading: 'Managing Cookies',
          body: 'You can clear or block cookies and site storage at any time via your browser’s privacy preferences without losing access to mysmartcalc.net calculators.',
        },
      ],
    },
  };

  const contentMapAr: typeof contentMapEn = {
    'about-us': {
      title: 'من نحن',
      description: 'تعرّف على كيفية بناء mysmartcalc.net لحاسبات سريعة وشفافة تعمل في المتصفح مع توثيق المعادلات.',
      canonical: '/about-us/',
      updated: todayDate,
      sections: [
        {
          heading: 'رسالتنا',
          body: 'توفر منصة mysmartcalc.net أدوات حساب مجانية وموثوقة وشفافة عبر التمويل الشخصي، الصحة واللياقة، الرياضيات، تحويل الوحدات، التواريخ والوقت، التخطيط اليومي، والعلوم والهندسة.',
        },
        {
          heading: 'معادلات شفافة وخصوصية تامة',
          body: 'تعمل جميع الحاسبات مباشرة داخل متصفحك وفق معايير رياضية وعلمية موثقة — مثل حسابات التقويم الميلادي الدقيقة، وثوابت التحويل الدولية NIST/SI، ومعادلات إطفاء القروض القياسية، ومعادلة ميفلين-سانت جيور. لا يتم بيع أو تخزين مدخلاتك الرقمية على خوادم خارجية.',
        },
        {
          heading: 'مصممة للوضوح',
          body: 'إلى جانب النتائج الفورية والرسوم البيانية التفاعلية، توثق كل أداة الصيغة الرياضية وتعريف المتغيرات وأمثلة تطبيقية والأسئلة الشائعة لتتمكن من التحقق من كل خطوة.',
        },
        {
          heading: 'التواصل والإشراف التحريري',
          body: (
            <p>
              يتم تطوير وصيانة موقع mysmartcalc.net من قِبل فريق مستقل مكرّس لتقديم أدوات حسابية دقيقة وسهلة الاستخدام باللغتين العربية والإنجليزية. نراجع باستمرار معادلاتنا وأدلتنا لضمان الوضوح والموثوقية. للاقتراحات أو التصحيحات أو الاستفسارات العامة، يرجى التواصل معنا عبر{' '}
              <a
                href="mailto:support@mysmartcalc.net"
                dir="ltr"
                className="text-[#2563EB] hover:underline font-medium"
              >
                support@mysmartcalc.net
              </a>{' '}
              أو من خلال{' '}
              <Link to={l('/contact-us/')} className="text-[#2563EB] hover:underline font-medium">
                صفحة التواصل
              </Link>
              .
            </p>
          ),
        },
      ],
    },
    'privacy-policy': {
      title: 'سياسة الخصوصية',
      description: 'كيف تتعامل mysmartcalc.net مع تخزين المتصفح ومدخلات الحاسبة وخصوصية الإعلانات.',
      canonical: '/privacy-policy/',
      updated: todayDate,
      sections: [
        {
          heading: 'خصوصية مدخلات الحاسبة',
          body: 'تُجرى جميع الحسابات — بما فيها الأرقام المالية وقياسات الجسم والتواريخ والمعادلات — محلياً داخل متصفحك. لا تتطلب mysmartcalc.net تسجيلاً ولا ترسل مدخلاتك الشخصية إلى قواعد بيانات خلفية.',
        },
        {
          heading: 'التخزين المحلي للمتصفح',
          body: 'عند حفظ الحاسبات في المفضلة أو اختيار اللغة أو تخصيص إعدادات المنصة، تُحفظ هذه التفضيلات فقط داخل localStorage في متصفحك ويمكن مسحها في أي وقت.',
        },
        {
          heading: 'مصادر البيانات والإعلانات',
          body: (
            <p>
              يجلب محوّل العملات أسعار الصرف العامة في السوق دون إرسال أي معرّفات شخصية. كما نتعاون مع شبكات إعلانية خارجية، بما في ذلك Google AdSense، والتي قد تستخدم ملفات تعريف الارتباط وإشارات الويب لعرض إعلانات ملائمة بناءً على زياراتك لموقع mysmartcalc.net ومواقع أخرى. لمزيد من التفاصيل حول كيفية إدارة Google للبيانات في منتجاتها الإعلانية، يرجى الاطلاع على{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline font-medium"
              >
                سياسة الخصوصية والبنود في Google
              </a>
              .
            </p>
          ),
        },
        {
          heading: 'ملفات السجل والتحليلات',
          body: 'مثل معظم مواقع الويب القياسية، قد يقوم موقع mysmartcalc.net ومزود الاستضافة بجمع بيانات سجل غير شخصية (مثل نوع المتصفح ونوع الجهاز والصفحات المحيلة والمنطقة التقريبية) وذلك حصرياً لمراقبة أداء الموقع والأمان واتجاهات الزيارات الإجمالية.',
        },
        {
          heading: 'معلومات الأطفال',
          body: 'لا يجمع موقع mysmartcalc.net عن علم أي معلومات تعريف شخصية من الأطفال دون سن 13 عاماً.',
        },
        {
          heading: 'موافقتك والتواصل معنا',
          body: (
            <p>
              باستخدامك لموقعنا الإلكتروني، فإنك توافق بموجب ذلك على سياسة الخصوصية الخاصة بنا. إذا كانت لديك أي أسئلة بخصوص هذه السياسة، يرجى التواصل معنا عبر{' '}
              <Link to={l('/contact-us/')} className="text-[#2563EB] hover:underline font-medium">
                صفحة التواصل
              </Link>{' '}
              أو عبر البريد الإلكتروني{' '}
              <a
                href="mailto:support@mysmartcalc.net"
                className="text-[#2563EB] hover:underline font-medium"
                dir="ltr"
              >
                support@mysmartcalc.net
              </a>
            </p>
          ),
        },
      ],
    },
    'terms-of-service': {
      title: 'شروط الاستخدام',
      description: 'الشروط المنظمة لاستخدام حاسبات ومعادلات وأدلة mysmartcalc.net الإلكترونية.',
      canonical: '/terms-of-service/',
      updated: todayDate,
      sections: [
        {
          heading: 'قبول الشروط',
          body: 'بوصولك إلى mysmartcalc.net أو استخدامها، فإنك توافق على استخدام الحاسبات والأدلة التعليمية لأغراض المعلومات والتخطيط المشروعة فقط.',
        },
        {
          heading: 'الطابع الإرشادي والدقة',
          body: 'رغم اختبارنا الدقيق لكل معادلة وثابت تحويل، تُقدَّم الأدوات «كما هي» دون ضمانات لملاءمتها للإقرارات النظامية أو التشخيص الطبي أو العقود الملزمة. تحقق دائماً من الأرقام الحرجة مع المختصين المؤهلين.',
        },
        {
          heading: 'الملكية الفكرية',
          body: 'تظل واجهة mysmartcalc.net والأدلة التعليمية وتوثيق الأدوات مملوكة للمنصة، مع الترحيب بطباعة أو تصدير نتائج حساباتك للاستخدام الشخصي أو المهني.',
        },
        {
          heading: 'تحديد المسؤولية',
          body: 'لا يتحمل موقع mysmartcalc.net أو فريقه بأي حال من الأحوال أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام أو عدم القدرة على استخدام حاسباتنا أو بيانات أسعار الصرف أو المحتوى التعليمي.',
        },
        {
          heading: 'روابط الجهات الخارجية والإعلانات',
          body: 'قد يعرض موقع mysmartcalc.net إعلانات مقدمة من شبكات خارجية (مثل Google AdSense) ويتضمن روابط لمواقع إلكترونية خارجية. نحن لا نتحكم في محتوى أو منتجات أو ممارسات الخصوصية لأي مواقع تابعة لجهات خارجية ولا نصادق عليها.',
        },
        {
          heading: 'تعديل الشروط والتواصل',
          body: (
            <p>
              نحتفظ بالحق في تحديث أو تعديل شروط الاستخدام هذه في أي وقت دون إشعار مسبق. إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا عبر{' '}
              <a
                href="mailto:support@mysmartcalc.net"
                dir="ltr"
                className="text-[#2563EB] hover:underline font-medium"
              >
                support@mysmartcalc.net
              </a>
              .
            </p>
          ),
        },
      ],
    },
    disclaimer: {
      title: 'إخلاء المسؤولية',
      description: 'إفصاحات مهمة حول الحسابات المالية والطبية والضريبية وأسعار الصرف.',
      canonical: '/disclaimer/',
      updated: todayDate,
      sections: [
        {
          heading: 'إخلاء المسؤولية المالية والضريبية',
          body: 'تقدم حاسبات الرهن والقروض والاستثمار والتقاعد والضرائب تقديرات توضيحية بناءً على افتراضات المستخدم، ولا تمثل استشارة مالية أو استثمارية أو قانونية أو ضريبية مرخصة.',
        },
        {
          heading: 'إخلاء المسؤولية الصحية والطبية',
          body: 'تعتمد حاسبات كتلة الجسم والأيض والسعرات ونسبة الدهون والحمل والتبويض والنبض والنوم على معادلات إحصائية قياسية، وليست أجهزة طبية ولا تغني عن استشارة الطبيب أو أخصائي التغذية.',
        },
        {
          heading: 'إخلاء مسؤولية أسعار العملات',
          body: 'تعكس أسعار الصرف المباشرة متوسط السوق الإرشادي وقد تختلف عن الأسعار الفعلية للبنوك أو البطاقات المصرفية أو شركات الصرافة.',
        },
        {
          heading: 'الدقة العامة والروابط الخارجية',
          body: 'رغم سعينا الدائم للحفاظ على دقة وتحديث جميع المعادلات وعوامل التحويل والأدلة التعليمية على mysmartcalc.net، فإننا لا نقدم أي ضمانات بشأن اكتمال أو موثوقية أي نتيجة. يتم توفير أي روابط لمواقع خارجية أو إعلانات جهات خارجية لراحة المستخدم ولا تعني المصادقة عليها.',
        },
        {
          heading: 'الأسئلة والملاحظات',
          body: (
            <p>
              إذا لاحظت أي تباين في الحساب أو كانت لديك أسئلة حول إخلاء المسؤولية هذا، يرجى التواصل معنا عبر{' '}
              <a
                href="mailto:support@mysmartcalc.net"
                dir="ltr"
                className="text-[#2563EB] hover:underline font-medium"
              >
                support@mysmartcalc.net
              </a>
              .
            </p>
          ),
        },
      ],
    },
    'cookie-policy': {
      title: 'سياسة ملفات تعريف الارتباط',
      description: 'معلومات حول التخزين الأساسي في المتصفح وملفات تعريف الارتباط الإعلانية (Google AdSense).',
      canonical: '/cookie-policy/',
      updated: todayDate,
      sections: [
        {
          heading: 'التخزين الأساسي',
          body: 'تستخدم mysmartcalc.net تخزين المتصفح (localStorage) فقط لحفظ تفضيلاتك مثل اللغة المختارة والحاسبات المحفوظة وأحدث الأدوات، دون ملفات تتبع لتسجيل الدخول.',
        },
        {
          heading: 'ملفات تعريف الارتباط الإعلانية (Google AdSense)',
          body: (
            <>
              <p>
                تستخدم شركات الإعلان التابعة لجهات خارجية، بما في ذلك Google، ملفات تعريف الارتباط لعرض الإعلانات بناءً على زيارات المستخدم السابقة لموقع mysmartcalc.net أو مواقع الويب الأخرى. يتيح استخدام Google لملفات تعريف الارتباط الإعلانية لها ولشركائها عرض الإعلانات للمستخدمين بناءً على زيارتهم لموقعنا و/أو مواقع أخرى على الإنترنت.
              </p>
              <p>
                يمكن للمستخدمين تعطيل الإعلانات المخصصة عن طريق زيارة{' '}
                <a
                  href="https://myadcenter.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  إعدادات إعلانات Google
                </a>{' '}
                أو موقع{' '}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline font-medium"
                  dir="ltr"
                >
                  www.aboutads.info
                </a>
                .
              </p>
            </>
          ),
        },
        {
          heading: 'إدارة ملفات تعريف الارتباط',
          body: 'يمكنك مسح أو حظر ملفات تعريف الارتباط وبيانات المواقع في أي وقت من إعدادات الخصوصية في متصفحك دون فقدان إمكانية استخدام الحاسبات.',
        },
      ],
    },
  };

  const doc = (isAr ? contentMapAr : contentMapEn)[page];

  return (
    <>
      <SeoHead
        title={`${doc.title} | ${ui.brandName}`}
        description={doc.description}
        canonicalPath={doc.canonical}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <Link to={l('/')} className="hover:text-[#2563EB]">
            {ui.nav.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          <span className="font-medium text-[#0F172A]">{doc.title}</span>
        </nav>

        <article className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6">
          <header className="pb-4 border-b border-[#F1F5F9]">
            {page === 'disclaimer' && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>{isAr ? 'إفصاحات مهمة' : 'Important Disclosures'}</span>
              </div>
            )}
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">{doc.title}</h1>
            <p className="mt-1.5 text-xs text-[#64748B]">
              {isAr ? `آخر تحديث: ${doc.updated}` : `Last updated: ${doc.updated}`}
            </p>
          </header>

          <div className="space-y-6">
            {doc.sections.map((sec) => (
              <section key={sec.heading}>
                <h2 className="font-display text-xl font-bold text-[#0F172A]">{sec.heading}</h2>
                <div className="mt-2 space-y-2.5 text-sm sm:text-base text-[#475569] leading-relaxed">
                  {typeof sec.body === 'string'
                    ? sec.body.split('\n').map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
                    : sec.body}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
