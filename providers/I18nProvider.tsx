"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';

type Locale = 'en' | 'tr';
type Translations = Record<string, any>;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: Translations;
  // FIX: Updated 't' function signature to accept an optional values object for interpolation.
  t: (key: string, values?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('tr'); // Default to Turkish
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    // Detect browser language or get from storage
    const savedLocale = localStorage.getItem('anirias-locale') as Locale;
    const browserLang = navigator.language.split('-')[0] as Locale;
    const initialLocale = savedLocale || (['en', 'tr'].includes(browserLang) ? browserLang : 'tr');
    setLocale(initialLocale);
  }, []);

  useEffect(() => {
    // Fetch translation file when locale changes
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/messages/${locale}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${locale}.json`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Translation loading error:", error);
        // Fallback to a default language if fetch fails
        if (locale !== 'en') {
          const fallbackResponse = await fetch('/messages/en.json');
          const data = await fallbackResponse.json();
          setTranslations(data);
        }
      }
    };

    fetchTranslations();
    localStorage.setItem('anirias-locale', locale);
  }, [locale]);

  // Translation function `t`
  // FIX: Implemented interpolation logic to replace placeholders like {count}.
  const t = (key: string, values?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // Return the key itself if not found
      }
    }
    
    if (typeof result === 'string' && values) {
      return result.replace(/\{(\w+)\}/g, (placeholder, key) => {
          return values[key] !== undefined ? String(values[key]) : placeholder;
      });
    }

    return typeof result === 'string' ? result : key;
  };

  const value = { locale, setLocale, translations, t };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Custom hook for changing language
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return { locale: context.locale, setLocale: context.setLocale };
};

// Custom hook for getting translation function
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return { t: context.t };
};