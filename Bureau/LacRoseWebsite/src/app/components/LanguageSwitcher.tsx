import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, Language } from '../i18n/translations';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === lang)!;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const select = (code: Language) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50 transition-all shadow-sm text-sm font-medium text-gray-700"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-xl leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 min-w-[160px] animate-fade-in"
          role="listbox"
        >
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={lang === l.code}
              onClick={() => select(l.code)}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors text-left ${
                lang === l.code
                  ? 'bg-gradient-to-r from-pink-50 to-orange-50 text-[#ff2d7a] font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl leading-none">{l.flag}</span>
              <span>{l.label}</span>
              {lang === l.code && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[#ff2d7a]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
