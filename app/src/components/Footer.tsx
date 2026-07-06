'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function SocialIcon({ d, label, id }: { d: string; label: string; id: string }) {
  return (
    <a
      href="#"
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
      style={{ background: '#1A1C1C' }}
      aria-label={label}
      id={id}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#705c2a')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#1A1C1C')}
    >
      <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
        <path d={d} />
      </svg>
    </a>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white" style={{ borderTop: '1px solid #E8E8E8' }} id="main-footer">
      <div className="page-container py-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
            <div>
              <Link href="/about" className="hover:text-primary transition-colors">
                <h4 className="f-heading font-bold text-sm mb-1" style={{ color: '#1A1C1C' }}>{t('nav.about')}</h4>
              </Link>
              <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: '#4C463A' }}>{t('nav.aboutDesc')}</p>
            </div>
            <div>
              <h4 className="f-heading font-bold text-sm mb-1" style={{ color: '#1A1C1C' }}>{t('nav.contact')}</h4>
              <p className="text-xs text-text-light mb-0.5">{t('nav.contactDesc')}</p>
              <p className="text-xs font-semibold">
                <a href="https://www.idealnowpaa.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" style={{ color: '#C2A86F' }}>
                  {t('nav.contactUrl')}
                </a>
              </p>
            </div>
            <div>
              <h4 className="f-heading font-bold text-sm mb-1" style={{ color: '#1A1C1C' }}>{t('nav.terms')}</h4>
              <p className="text-xs mb-1">
                <Link href="/terms" className="hover:text-primary transition-colors" style={{ color: '#4C463A' }}>
                  {t('nav.termsAgreement')}
                </Link>
              </p>
              <p className="text-xs">
                <Link href="/privacy" className="hover:text-primary transition-colors" style={{ color: '#4C463A' }}>
                  {t('nav.privacyPolicy')}
                </Link>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SocialIcon id="social-facebook" label="Facebook" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            <SocialIcon id="social-x" label="X" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            <SocialIcon id="social-instagram" label="Instagram" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
            <SocialIcon id="social-youtube" label="YouTube" d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
          </div>
        </div>
      </div>
    </footer>
  );
}
