/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { CalculatorPage } from './pages/CalculatorPage.tsx';
import { GuidesPage } from './pages/GuidesPage.tsx';
import { LegalPages } from './pages/LegalPages.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { isSupportedLanguage, localizePath } from './i18n/routing.ts';

function NotFoundPage() {
  const { ui, l } = useAppContext();
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-[#0F172A]">{ui.notFound.title}</h1>
      <p className="mt-2 text-sm text-[#64748B]">{ui.notFound.body}</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <Link
          to={l('/')}
          className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8]"
        >
          {ui.notFound.goHome}
        </Link>
        <Link
          to={l('/sitemap/')}
          className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm font-semibold text-[#1E293B] hover:border-[#2563EB]"
        >
          {ui.notFound.viewSitemap}
        </Link>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { lang } = useAppContext();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryLang = params.get('lang');
  const targetLang = isSupportedLanguage(queryLang) ? queryLang : lang;
  return <Navigate to={localizePath('/', targetLang)} replace />;
}

function LocalizedAppShell() {
  const { lang: langParam } = useParams();
  const location = useLocation();
  const { lang, setLang } = useAppContext();

  const validLang = isSupportedLanguage(langParam);

  useEffect(() => {
    if (validLang && langParam !== lang) {
      setLang(langParam);
    }
  }, [validLang, langParam, lang, setLang]);

  if (!validLang) {
    const params = new URLSearchParams(location.search);
    const queryLang = params.get('lang');
    const targetLang = isSupportedLanguage(queryLang) ? queryLang : lang;
    return <Navigate to={localizePath(location.pathname, targetLang)} replace />;
  }

  const isEmbed = new URLSearchParams(location.search).get('embed') === '1';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
      {!isEmbed && <Header />}
      <main className="flex-1">
        <Routes>
          <Route index element={<HomePage />} />

          {/* Guides & Editorial Content */}
          <Route path="guides" element={<GuidesPage />} />
          <Route path="guides/:slug" element={<GuidesPage />} />

          {/* CMS / Ad Settings */}
          <Route path="admin" element={<AdminPage />} />

          {/* Legal & Platform Pages */}
          <Route path="about-us" element={<LegalPages page="about-us" />} />
          <Route path="contact-us" element={<LegalPages page="contact-us" />} />
          <Route path="privacy-policy" element={<LegalPages page="privacy-policy" />} />
          <Route path="terms-of-service" element={<LegalPages page="terms-of-service" />} />
          <Route path="disclaimer" element={<LegalPages page="disclaimer" />} />
          <Route path="cookie-policy" element={<LegalPages page="cookie-policy" />} />
          <Route path="sitemap" element={<LegalPages page="sitemap" />} />

          {/* Dynamic Category & Calculator Routes */}
          <Route path=":category" element={<CategoryPage />} />
          <Route path=":category/:slug" element={<CalculatorPage />} />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isEmbed && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/:lang/*" element={<LocalizedAppShell />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
