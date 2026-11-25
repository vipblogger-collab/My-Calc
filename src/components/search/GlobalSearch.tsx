import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.tsx';
import { getCalculatorUrl, searchCalculators } from '../../data/calculators/index.ts';
import { CalculatorIcon } from '../ui/CategoryIcon.tsx';

interface GlobalSearchProps {
  placeholder?: string;
  size?: 'lg' | 'md';
  autoFocus?: boolean;
  onSelect?: () => void;
}

export function GlobalSearch({
  placeholder,
  size = 'lg',
  autoFocus = false,
  onSelect,
}: GlobalSearchProps) {
  const { calculators, categories, ui } = useAppContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchCalculators(query, calculators).slice(0, 8), [query, calculators]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const goToCalc = (slug: string) => {
    const match = results.find((c) => c.slug === slug);
    if (!match) return;
    setOpen(false);
    setQuery('');
    onSelect?.();
    navigate(getCalculatorUrl(match));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && query.trim()) setOpen(true);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      goToCalc(results[activeIndex].slug);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search
          className={`absolute start-4 text-[#64748B] pointer-events-none ${
            size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
          }`}
        />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || ui.search.placeholder}
          aria-label={ui.search.ariaLabel}
          className={`w-full bg-white border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-shadow ${
            size === 'lg'
              ? 'h-13 ps-12 pe-11 rounded-xl text-base shadow-sm'
              : 'h-10 ps-10 pe-9 rounded-lg text-sm'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            aria-label={ui.search.clearAria}
            className="absolute end-3 p-1 text-[#64748B] hover:text-[#0F172A] rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && query.trim().length > 0 && (
        <div
          role="listbox"
          className="absolute z-50 start-0 end-0 mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden"
        >
          {results.length > 0 ? (
            <ul className="divide-y divide-[#F1F5F9] max-h-96 overflow-y-auto">
              {results.map((calc, idx) => {
                const cat = categories.find((c) => c.slug === calc.category);
                const isActive = idx === activeIndex;
                return (
                  <li key={calc.slug}>
                    <button
                      type="button"
                      onClick={() => goToCalc(calc.slug)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full text-start px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                        isActive ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                          <CalculatorIcon slug={calc.slug} category={calc.category} className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0F172A] truncate">{calc.name}</p>
                          <p className="text-xs text-[#64748B] truncate">
                            {cat?.shortName} · {calc.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#94A3B8] shrink-0 rtl:rotate-180" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-6 text-center">
              <p className="text-sm font-medium text-[#0F172A]">
                {ui.search.noResultsFor} “{query}”
              </p>
              <p className="text-xs text-[#64748B] mt-1">{ui.search.trySearching}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
