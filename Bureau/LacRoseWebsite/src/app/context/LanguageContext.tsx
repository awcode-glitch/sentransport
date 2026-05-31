import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import t, { Language, Translations, LANGUAGES } from '../i18n/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  tr: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('lac-rose-lang') as Language) || 'fr';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lac-rose-lang', newLang);
  };

  useEffect(() => {
    const dir = LANGUAGES.find(l => l.code === lang)?.dir ?? 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
}
