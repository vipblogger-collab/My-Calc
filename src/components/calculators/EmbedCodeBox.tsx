import { useState } from 'react';
import { Check, ChevronDown, Code2, Copy } from 'lucide-react';
import { SITE_URL } from '../../config/site.ts';
import type { Language } from '../../types/calculator.ts';

export function EmbedCodeBox({
  calcName,
  canonicalPath,
  lang,
}: {
  calcName: string;
  canonicalPath: string;
  lang: Language;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isAr = lang === 'ar';

  const normalizedPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const fullCalcUrl = `${SITE_URL}/${lang}${normalizedPath}`;
  const embedSrc = `${fullCalcUrl}${fullCalcUrl.includes('?') ? '&' : '?'}embed=1`;

  const embedSnippet = `<iframe src="${embedSrc}" width="100%" height="680" style="border:1px solid #E2E8F0;border-radius:12px;" loading="lazy" title="${calcName.replace(/"/g, '&quot;')}"></iframe>\n<p style="font-size:12px;margin-top:6px;text-align:center;color:#64748B;">Powered by <a href="${fullCalcUrl}" target="_blank" rel="noopener">mysmartcalc.net</a></p>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard fallback not needed
    }
  };

  return (
    <div className="no-print">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#2563EB] hover:text-[#2563EB] px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-2xs transition-colors"
        >
          <Code2 className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{isAr ? 'أضف هذه الحاسبة لموقعك' : 'Add this calculator to your site'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div className="mt-3 rounded-xl border border-[#CBD5E1] bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                {isAr ? 'كود تضمين الحاسبة مجاناً (Iframe)' : 'Free Calculator Embed Code (Iframe)'}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {isAr
                  ? 'انسخ الكود التالي وألصقه في مقالات مدونتك أو موقعك الإخباري أو العقاري:'
                  : 'Copy and paste the HTML snippet below into your blog, news article, or real-estate website:'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-2 text-xs font-semibold transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>
                {copied
                  ? isAr
                    ? 'تم النسخ!'
                    : 'Copied!'
                  : isAr
                  ? 'نسخ الكود'
                  : 'Copy Code'}
              </span>
            </button>
          </div>

          <textarea
            readOnly
            dir="ltr"
            rows={4}
            value={embedSnippet}
            onClick={(e) => e.currentTarget.select()}
            aria-label={isAr ? 'كود تضمين الحاسبة' : 'Calculator embed HTML code'}
            className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 font-mono-tabular text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 resize-none"
          />

          <p className="text-[11px] text-[#64748B] text-center" dir="ltr">
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
      )}
    </div>
  );
}
