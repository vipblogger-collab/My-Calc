import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Calculator, Globe, Menu, Search, X } from 'lucide-react';
import { GlobalSearch } from '../search/GlobalSearch.tsx';
import { useAppContext } from '../../context/AppContext.tsx';

export function Header() {
  const { toggleLang, ui } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const primaryNav = [
    { to: '/', label: ui.nav.home },
    { to: '/financial-calculators/', label: ui.nav.financial },
    { to: '/health-calculators/', label: ui.nav.health },
    { to: '/math-calculators/', label: ui.nav.math },
    { to: '/conversion-calculators/', label: ui.nav.conversions },
    { to: '/date-calculators/', label: ui.nav.dateTime },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-6">
        {/* Brand Zone */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[#0F172A] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg"
        >
          <span className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
            <Calculator className="w-4.5 h-4.5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">{ui.brandName}</span>
        </Link>

        {/* Primary Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6" aria-label="Main navigation">
          {primaryNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                  isActive
                    ? 'text-[#2563EB] border-[#2563EB]'
                    : 'text-[#475569] border-transparent hover:text-[#0F172A]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={ui.nav.switchLangAria}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:border-[#2563EB] hover:text-[#2563EB] text-sm font-semibold text-[#1E293B] transition-colors whitespace-nowrap shrink-0"
          >
            <Globe className="w-4 h-4 text-[#2563EB]" />
            <span>{ui.nav.switchLang}</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={ui.nav.toggleSearch}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-sm font-medium text-[#475569] transition-colors whitespace-nowrap shrink-0"
          >
            <Search className="w-4 h-4 text-[#64748B]" />
            <span className="hidden sm:inline">{ui.nav.search}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? ui.nav.closeMenu : ui.nav.openMenu}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
            <GlobalSearch
              size="md"
              autoFocus
              onSelect={() => setSearchOpen(false)}
              placeholder={ui.nav.searchHeaderPlaceholder}
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-1"
        >
          {primaryNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#1E293B] hover:bg-[#F8FAFC]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/everyday-calculators/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
          >
            {ui.nav.everyday}
          </NavLink>
          <NavLink
            to="/science-calculators/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
          >
            {ui.nav.science}
          </NavLink>
          <NavLink
            to="/guides/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
          >
            {ui.nav.guides}
          </NavLink>
        </nav>
      )}
    </header>
  );
}
