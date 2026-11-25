import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.tsx';

export function Footer() {
  const { categories, ui, l } = useAppContext();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-[#CBD5E1] border-t border-[#1E293B] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#1E293B]">
          <div>
            <Link to={l('/')} className="inline-flex items-center gap-2.5 text-white">
              <span className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">{ui.brandName}</span>
            </Link>
            <p className="mt-3 text-sm text-[#94A3B8] leading-relaxed">{ui.footer.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{ui.footer.categoriesHeading}</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={l(`/${cat.slug}/`)}
                    className="text-[#94A3B8] hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{ui.footer.resourcesHeading}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={l('/guides/')} className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.guides}
                </Link>
              </li>
              <li>
                <Link to={l('/sitemap/')} className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.htmlSitemap}
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.xmlSitemap}
                </a>
              </li>
              <li>
                <Link to={l('/admin/')} className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.cmsSettings}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{ui.footer.companyHeading}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={l('/about-us/')} className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link to={l('/contact-us/')} className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.contactUs}
                </Link>
              </li>
              <li>
                <Link to={l('/privacy-policy/')} className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link to={l('/terms-of-service/')} className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.termsOfService}
                </Link>
              </li>
              <li>
                <Link to={l('/disclaimer/')} className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.disclaimer}
                </Link>
              </li>
              <li>
                <Link to={l('/cookie-policy/')} className="text-[#94A3B8] hover:text-white transition-colors">
                  {ui.footer.cookiePolicy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>
            © {year} {ui.footer.copyrightSuffix}
          </p>
          <p>{ui.footer.noAccountNote}</p>
        </div>
      </div>
    </footer>
  );
}
