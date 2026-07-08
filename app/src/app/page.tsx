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
      <main className="flex-1 relative bg-bg-main overflow-x-hidden">
        {/* --- HOME SECTION --- */}
        <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32">
          <SparkleDecor />
          <div className="text-center px-6 relative z-10 animate-in max-w-4xl mx-auto">
            <h1
              className="f-heading font-extrabold leading-tight tracking-tight mb-6"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)', color: '#1A1C1C' }}
            >
              {t('landing.title')}
            </h1>
            <p
              className="f-heading mb-14 mx-auto max-w-2xl"
              style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#4C463A' }}
            >
              {t('landing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/login" className="btn-gold min-w-[220px] text-lg px-12 py-4 shadow-xl shadow-primary/20 hover:scale-105 transition-transform" id="cta-sign-in">
                {t('landing.signIn')}
              </Link>
              <Link href="/register" className="btn-outline min-w-[220px] text-lg px-12 py-4 bg-white hover:bg-neutral-50 transition-colors" id="cta-sign-up">
                {t('landing.signUp')}
              </Link>
            </div>
          </div>
        </section>

        {/* --- ABOUT US SECTION --- */}
        <section id="about" className="py-24 bg-white relative">
          <div className="page-container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="f-heading font-extrabold text-4xl mb-6" style={{ color: '#1A1C1C' }}>About Us</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#4C463A' }}>
                At iDAELİK, our mission is to seamlessly connect wellness and professional service practitioners with their clients. 
                We understand the unique challenges professionals face in managing their schedules while ensuring a top-tier customer experience.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: '#4C463A' }}>
                Built with simplicity and elegance in mind, our platform eliminates the friction of traditional booking systems. 
                We empower you with dynamic mobile-first scheduling, secure authentication, and instant notifications, allowing you to focus on what you do best: providing exceptional service.
              </p>
            </div>
          </div>
        </section>

        {/* --- TERMS AND CONDITIONS SECTION --- */}
        <section id="terms" className="py-24" style={{ background: '#F9F9F9' }}>
          <div className="page-container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-outline-variant/30">
              <h2 className="f-heading font-extrabold text-3xl mb-8" style={{ color: '#1A1C1C' }}>Terms & Conditions</h2>
              <div className="space-y-6 text-sm" style={{ color: '#4C463A' }}>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>1. Introduction</h3>
                  <p className="leading-relaxed">By accessing and using the iDAELİK platform, you accept and agree to be bound by the terms and provisions of this agreement. Any participation in this service will constitute acceptance of this agreement.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>2. Booking & Cancellations</h3>
                  <p className="leading-relaxed">Practitioners reserve the right to accept or decline any booking requests. Users must provide valid contact information (email and phone number) to successfully place a reservation. Cancellations must be communicated promptly.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>3. Privacy Policy</h3>
                  <p className="leading-relaxed">We value your privacy. Phone numbers and email addresses collected during the registration and booking processes are used strictly for authentication, notifications, and service fulfillment.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>4. Modifications</h3>
                  <p className="leading-relaxed">We reserve the right to modify these terms at any time. Your continued use of the platform following any changes indicates your acceptance of the new Terms and Conditions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CONTACT US SECTION --- */}
        <section id="contact" className="py-24 bg-white">
          <div className="page-container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="f-heading font-extrabold text-4xl mb-4" style={{ color: '#1A1C1C' }}>Contact Us</h2>
                <p className="text-lg" style={{ color: '#7E7669' }}>Have questions? We'd love to hear from you.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Contact Info */}
                <div className="bg-surface-container/20 p-8 rounded-3xl border border-outline-variant/30 h-full flex flex-col justify-center">
                  <h3 className="f-heading font-bold text-2xl mb-8" style={{ color: '#1A1C1C' }}>Get in Touch</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: '#1A1C1C' }}>Headquarters</h4>
                        <p className="text-sm leading-relaxed" style={{ color: '#7E7669' }}>123 Innovation Drive<br/>Tech District, Istanbul 34000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: '#1A1C1C' }}>Email Us</h4>
                        <p className="text-sm" style={{ color: '#7E7669' }}>support@idealik.com<br/>partners@idealik.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: '#1A1C1C' }}>Call Us</h4>
                        <p className="text-sm" style={{ color: '#7E7669' }}>+90 555 012 3456<br/>Mon-Fri, 9am-6pm</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="card p-8 shadow-xl border border-outline-variant/20">
                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Thank you for reaching out! We will get back to you soon.'); }}>
                    <div>
                      <label className="block text-xs f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>Full Name</label>
                      <input type="text" className="input-field input-no-icon w-full px-4" placeholder="Jane Doe" required />
                    </div>
                    <div>
                      <label className="block text-xs f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>Email Address</label>
                      <input type="email" className="input-field input-no-icon w-full px-4" placeholder="jane@example.com" required />
                    </div>
                    <div>
                      <label className="block text-xs f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>Message</label>
                      <textarea className="input-field input-no-icon w-full px-4 py-3 resize-none min-h-[120px]" placeholder="How can we help you?" required></textarea>
                    </div>
                    <button type="submit" className="btn-gold w-full py-4 mt-2">
                      Send Message
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
