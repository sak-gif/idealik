'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        <SparkleDecor />
        <div className="text-center px-6 py-24 relative z-10 animate-in max-w-3xl mx-auto">
          <h1
            className="f-heading font-extrabold leading-tight tracking-tight mb-6"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#1A1C1C' }}
          >
            {t('landing.title')}
          </h1>
          <p
            className="f-heading mb-14"
            style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', color: '#4C463A' }}
          >
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/login" className="btn-gold min-w-[220px] text-lg px-12 py-4" id="cta-sign-in">
              {t('landing.signIn')}
            </Link>
            <Link href="/register" className="btn-outline min-w-[220px] text-lg px-12 py-4" id="cta-sign-up">
              {t('landing.signUp')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
