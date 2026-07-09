'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [contactForm, setContactForm] = useState({ fullName: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactStatus('success');
        setContactForm({ fullName: '', email: '', message: '' });
        setTimeout(() => setContactStatus('idle'), 5000);
      } else {
        setContactStatus('error');
      }
    } catch (err) {
      setContactStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />
      <main className="flex-1 relative bg-bg-main overflow-x-hidden">
        {/* --- HOME SECTION --- */}
        <section id="home" className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-32 overflow-hidden bg-gradient-to-b from-white to-[#F9F9F9]">
          {/* Subtle Background Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-0 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1A1C1C]/5 rounded-full blur-3xl -z-0"></div>
          
          <SparkleDecor />
          
          <div className="page-container relative z-10 px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left animate-in" style={{ animationDelay: '0.1s' }}>
              
              <h1
                className="f-heading font-extrabold leading-tight tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#1A1C1C] to-[#4C463A]"
                style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
              >
                {t('landing.title')}
              </h1>
              
              <p
                className="f-heading mb-10 max-w-xl"
                style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: '#7E7669', lineHeight: '1.6' }}
              >
                {t('landing.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/login" className="btn-gold min-w-[200px] text-base px-8 py-4 shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group" id="cta-sign-in">
                  {t('landing.signIn')}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
                <Link href="/register" className="btn-outline min-w-[200px] text-base px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2" id="cta-sign-up">
                  {t('landing.signUp')}
                </Link>
              </div>
            </div>

            {/* Right Abstract Visuals */}
            <div className="relative hidden lg:flex items-center justify-center h-full animate-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-full max-w-[500px] aspect-square">
                {/* Main Dashboard Card Mockup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[80%] bg-white rounded-3xl shadow-2xl border border-outline-variant/30 p-6 flex flex-col gap-4 z-20 hover:-translate-y-6 transition-transform duration-500">
                  {/* Mock Header */}
                  <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <div className="w-24 h-3 bg-neutral-200 rounded-full mb-1"></div>
                        <div className="w-16 h-2 bg-neutral-100 rounded-full"></div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-100"></div>
                  </div>
                  {/* Mock Content rows */}
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="flex items-center justify-between p-3 rounded-xl bg-surface-container/30 border border-outline-variant/10">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                        <div>
                          <div className="w-20 h-2.5 bg-neutral-300 rounded-full mb-1.5"></div>
                          <div className="w-12 h-2 bg-neutral-200 rounded-full"></div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold">Confirmed</div>
                    </div>
                  ))}
                </div>

                {/* Floating Element 1 - Notification */}
                <div className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl border border-outline-variant/20 z-30 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A1C1C]">New Booking</div>
                      <div className="text-[10px] text-text-light">Just now</div>
                    </div>
                  </div>
                </div>

                {/* Floating Element 2 - Service */}
                <div className="absolute -left-12 bottom-24 bg-white p-3 rounded-2xl shadow-xl border border-outline-variant/20 z-30 animate-float" style={{ animationDelay: '1.2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200"></div>
                    <div>
                      <div className="text-xs font-bold text-[#1A1C1C] mb-1">Consultation</div>
                      <div className="text-xs font-extrabold text-primary">$120.00</div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[radial-gradient(#C2A86F_2px,transparent_2px)] [background-size:16px_16px] opacity-20 z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* --- ABOUT US SECTION --- */}
        <section id="about" className="py-24 bg-white relative">
          <div className="page-container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="f-heading font-extrabold text-4xl mb-6" style={{ color: '#1A1C1C' }}>{t('landing.aboutTitle')}</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#4C463A' }}>{t('landing.aboutP1')}</p>
              <p className="text-lg leading-relaxed" style={{ color: '#4C463A' }}>{t('landing.aboutP2')}</p>
            </div>
          </div>
        </section>

        {/* --- TERMS AND CONDITIONS SECTION --- */}
        <section id="terms" className="py-24" style={{ background: '#F9F9F9' }}>
          <div className="page-container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-outline-variant/30">
              <h2 className="f-heading font-extrabold text-3xl mb-8" style={{ color: '#1A1C1C' }}>{t('nav.termsConditions')}</h2>
              <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#4C463A' }}>
                <p><strong>{t('landing.lastUpdated')}: {new Date().toLocaleDateString()}</strong></p>
                <p>{t('landing.termsIntro')}</p>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>1. {t('landing.termsS1Title')}</h3>
                  <p>{t('landing.termsS1P1')}</p>
                  <p>{t('landing.termsS1P2')}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>2. {t('landing.termsS2Title')}</h3>
                  <p><strong>{t('landing.termsS2Bold1')}</strong> {t('landing.termsS2P1')}</p>
                  <p><strong>{t('landing.termsS2Bold2')}</strong> {t('landing.termsS2P2')}</p>
                  <p><strong>{t('landing.termsS2Bold3')}</strong> {t('landing.termsS2P3')}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>3. {t('landing.termsS3Title')}</h3>
                  <p><strong>{t('landing.termsS3Bold1')}</strong> {t('landing.termsS3P1')}</p>
                  <p><strong>{t('landing.termsS3Bold2')}</strong> {t('landing.termsS3P2')}</p>
                  <p><strong>{t('landing.termsS3Bold3')}</strong> {t('landing.termsS3P3')}</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>4. {t('landing.termsS4Title')}</h3>
                  <p>{t('landing.termsS4P1')}</p>
                  <p>{t('landing.termsS4P2')}</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>5. {t('landing.termsS5Title')}</h3>
                  <p>{t('landing.termsS5P1')}</p>
                  <p>{t('landing.termsS5P2')}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>6. {t('landing.termsS6Title')}</h3>
                  <p>{t('landing.termsS6P1')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PRIVACY AND POLICY SECTION --- */}
        <section id="privacy" className="py-24 bg-white">
          <div className="page-container mx-auto px-6">
            <div className="max-w-4xl mx-auto p-10 md:p-14 border border-outline-variant/20 rounded-3xl bg-surface-container/5 shadow-sm">
              <h2 className="f-heading font-extrabold text-3xl mb-8" style={{ color: '#1A1C1C' }}>{t('nav.privacyPolicy2')}</h2>
              <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#4C463A' }}>
                <p><strong>{t('landing.effectiveDate')}: {new Date().toLocaleDateString()}</strong></p>
                <p>{t('landing.privacyIntro')}</p>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>1. {t('landing.privacyS1Title')}</h3>
                  <p><strong>{t('landing.privacyS1Bold1')}</strong> {t('landing.privacyS1P1')}</p>
                  <p><strong>{t('landing.privacyS1Bold2')}</strong> {t('landing.privacyS1P2')}</p>
                  <p><strong>{t('landing.privacyS1Bold3')}</strong> {t('landing.privacyS1P3')}</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>2. {t('landing.privacyS2Title')}</h3>
                  <p>{t('landing.privacyS2P1')}</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>{t('landing.privacyS2L1')}</li>
                    <li>{t('landing.privacyS2L2')}</li>
                    <li>{t('landing.privacyS2L3')}</li>
                    <li>{t('landing.privacyS2L4')}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>3. {t('landing.privacyS3Title')}</h3>
                  <p>3.1. <strong>{t('landing.privacyS3Bold1')}</strong> {t('landing.privacyS3P1')}</p>
                  <p>3.2. <strong>{t('landing.privacyS3Bold2')}</strong> {t('landing.privacyS3P2')}</p>
                  <p>3.3. <strong>{t('landing.privacyS3Bold3')}</strong> {t('landing.privacyS3P3')}</p>
                  <p className="mt-2 font-bold text-[#1A1C1C]">{t('landing.privacyS3Note')}</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>4. {t('landing.privacyS4Title')}</h3>
                  <p>4.1. <strong>{t('landing.privacyS4Bold1')}</strong> {t('landing.privacyS4P1')}</p>
                  <p>4.2. <strong>{t('landing.privacyS4Bold2')}</strong> {t('landing.privacyS4P2')}</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>5. {t('landing.privacyS5Title')}</h3>
                  <p>{t('landing.privacyS5P1')}</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>{t('landing.privacyS5L1')}</li>
                    <li>{t('landing.privacyS5L2')}</li>
                    <li>{t('landing.privacyS5L3')}</li>
                    <li>{t('landing.privacyS5L4')}</li>
                  </ul>
                  <p className="mt-2">{t('landing.privacyS5Footer')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CONTACT US SECTION --- */}
        <section id="contact" className="py-24" style={{ background: '#F9F9F9' }}>
          <div className="page-container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="f-heading font-extrabold text-4xl mb-4" style={{ color: '#1A1C1C' }}>{t('landing.contactTitle')}</h2>
                <p className="text-lg" style={{ color: '#7E7669' }}>{t('landing.contactSubtitle')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Contact Info */}
                <div className="bg-surface-container/20 p-8 rounded-3xl border border-outline-variant/30 h-full flex flex-col justify-center">
                  <h3 className="f-heading font-bold text-2xl mb-8" style={{ color: '#1A1C1C' }}>{t('landing.getInTouch')}</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: '#1A1C1C' }}>{t('landing.headquarters')}</h4>
                        <p className="text-sm leading-relaxed" style={{ color: '#7E7669' }} dangerouslySetInnerHTML={{ __html: t('landing.headquartersAddr').replace(/\n/g, '<br/>') }}></p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: '#1A1C1C' }}>{t('landing.emailUs')}</h4>
                        <p className="text-sm" style={{ color: '#7E7669' }}>support@idealik.com<br/>partners@idealik.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: '#1A1C1C' }}>{t('landing.callUs')}</h4>
                        <p className="text-sm" style={{ color: '#7E7669' }}>+90 555 012 3456<br/>{t('landing.callHours')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="card p-8 shadow-xl border border-outline-variant/20 relative overflow-hidden">
                  {contactStatus === 'success' && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="f-heading font-extrabold text-2xl text-text-main mb-2">{t('landing.messageSent')}</h3>
                      <p className="text-text-light text-sm">{t('landing.messageSentDesc')}</p>
                      <button onClick={() => setContactStatus('idle')} className="mt-6 px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-text-main font-bold rounded-lg transition-colors">{t('landing.close')}</button>
                    </div>
                  )}
                  
                  <form className="space-y-5" onSubmit={handleContactSubmit}>
                    {contactStatus === 'error' && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 text-center">
                        {t('landing.messageError')}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>{t('landing.fullName')}</label>
                      <input type="text" className="input-field input-no-icon w-full px-4" placeholder="Jane Doe" required value={contactForm.fullName} onChange={e => setContactForm({...contactForm, fullName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>{t('landing.emailAddress')}</label>
                      <input type="email" className="input-field input-no-icon w-full px-4" placeholder="jane@example.com" required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>{t('landing.message')}</label>
                      <textarea className="input-field input-no-icon w-full px-4 py-3 resize-none min-h-[120px]" placeholder="How can we help you?" required value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})}></textarea>
                    </div>
                    <button type="submit" disabled={contactStatus === 'loading'} className="btn-gold w-full py-4 mt-2 disabled:opacity-70">
                      {contactStatus === 'loading' ? t('landing.sending') : t('landing.sendMessage')}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
