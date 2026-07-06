'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'TR', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'AR', name: 'العربية', flag: '🇸🇦' },
    { code: 'EN', name: 'English', flag: '🇬🇧' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative flex items-center f-label" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm"
        style={{ 
          borderColor: isOpen ? 'rgba(194, 168, 111, 0.4)' : 'transparent',
          background: isOpen ? 'rgba(194, 168, 111, 0.05)' : '#F9F9F9',
        }}
        aria-label="Select language"
      >
        <Globe 
          className="w-5 h-5 transition-colors duration-200" 
          style={{ color: isOpen ? '#C2A86F' : '#7E7669' }} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-40 z-[100] animate-in fade-in duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer text-left"
              style={{ color: language === lang.code ? '#C2A86F' : '#1A1C1C' }}
            >
              <span className="text-xl leading-none">{lang.flag}</span>
              <span className="font-bold text-sm tracking-wide">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
