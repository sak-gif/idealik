'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ── Static JSON translations (loaded at build time) ────────────────────
import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';
import trMessages from '../../messages/tr.json';

export type Language = 'EN' | 'AR' | 'TR';

interface Translations {
  [key: string]: any;
}

const messages: Record<Language, Translations> = {
  EN: enMessages,
  AR: arMessages,
  TR: trMessages,
};

/**
 * Resolve a dotted key like "booking.fullName" from a nested JSON object.
 * Supports both nested and flat key formats for backwards compatibility.
 */
function resolveKey(obj: Translations, key: string): string | undefined {
  // First try nested resolution:  "booking.fullName" → obj.booking.fullName
  const parts = key.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  if (typeof current === 'string') return current;

  // Fallback: try flat key directly (for any legacy keys)
  if (typeof obj[key] === 'string') return obj[key];

  return undefined;
}

// ── Context ────────────────────────────────────────────────────────────

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Resolve a static translation key. Returns the key itself if not found. */
  t: (key: string) => string;
  /** Text direction for the current language */
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  const dir = language === 'AR' ? 'rtl' : 'ltr';

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Persist preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('idealik_lang', lang);
    }
  }, []);

  // Restore persisted language on mount
  useEffect(() => {
    const saved = localStorage.getItem('idealik_lang') as Language | null;
    if (saved && ['EN', 'AR', 'TR'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language.toLowerCase());
  }, [dir, language]);

  const t = useCallback(
    (key: string): string => {
      // 1. Try current language
      const value = resolveKey(messages[language], key);
      if (value) return value;

      // 2. Fallback to English
      const fallback = resolveKey(messages['EN'], key);
      if (fallback) return fallback;

      // 3. Return the raw key (never undefined)
      return key;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
