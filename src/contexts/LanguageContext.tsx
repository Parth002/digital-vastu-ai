
import React, { createContext, useState, useCallback, useMemo } from 'react';
import enData from '../i18n/en.json';
import hiData from '../i18n/hi.json';

type Language = 'en' | 'hi';
type Translations = Record<string, string>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<Language, Translations>>({ en: enData, hi: hiData });

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = translations[language]?.[key] || translations['en']?.[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  }, [language, translations]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
