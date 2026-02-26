import { useState, useCallback } from 'react';
import { type Language, translations, type Translations } from '../i18n/translations';

const LANGUAGE_KEY = 'mediclear_language';

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored && ['en', 'hi', 'es', 'fr', 'ar', 'bn'].includes(stored)) {
      return stored as Language;
    }
  } catch {
    // ignore
  }
  return 'en';
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const t: Translations = translations[language];

  return { language, setLanguage, t };
}
