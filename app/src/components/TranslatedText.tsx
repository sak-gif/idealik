'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslatedText } from '@/lib/translate';

interface TranslatedTextProps {
  en: string;
  ar?: string;
  tr?: string;
}

/**
 * A handy component for displaying dynamic translations from the database.
 * Automatically respects the current language from LanguageContext.
 * 
 * Example:
 *   <TranslatedText en={service.title} ar={service.titleAr} tr={service.titleTr} />
 */
export default function TranslatedText({ en, ar, tr }: TranslatedTextProps) {
  const { language } = useLanguage();
  
  if (language === 'AR' && ar) return <>{ar}</>;
  if (language === 'TR' && tr) return <>{tr}</>;
  
  return <>{en}</>;
}
