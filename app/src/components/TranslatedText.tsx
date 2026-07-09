'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslatedText } from '@/lib/translate';

interface TranslatedTextProps {
  text: string;
}

/**
 * A handy component for translating dynamic, user-generated text inline.
 * Automatically respects the current language from LanguageContext.
 * 
 * Example:
 *   <TranslatedText text={service.title} />
 */
export default function TranslatedText({ text }: TranslatedTextProps) {
  const { language } = useLanguage();
  const translated = useTranslatedText(text, language);
  
  return <>{translated}</>;
}
