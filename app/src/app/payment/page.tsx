'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage } from '@/context/LanguageContext';
import { Banknote, CreditCard } from 'lucide-react';

type PaymentMethod = 'cash' | 'card';

export default function PaymentPage() {
  const { t } = useLanguage();
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('cash');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />

      <main className="flex-1 relative">
        <SparkleDecor />
        <div className="page-container max-w-[1000px] py-14 relative z-10 animate-in">
          {/* Title */}
          <h1 className="f-heading font-extrabold text-3xl md:text-4xl text-center mb-12" style={{ color: '#1A1C1C' }}>
            {t('payment.title')}
          </h1>

          {/* Payment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ── Cash Payment ── */}
            <div
              className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                background: '#fff',
                border: activeMethod === 'cash' ? '2px solid #C2A86F' : '2px solid #CFC5B6',
                boxShadow: activeMethod === 'cash' ? '0 8px 30px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.06)'
              }}
              onClick={() => setActiveMethod('cash')}
              id="payment-cash-card"
            >
              {/* Tab Header */}
              <div
                className="py-5 text-center f-heading font-bold text-xl transition-colors"
                style={{
                  background: activeMethod === 'cash' ? '#C2A86F' : '#EEEEEE',
                  color: activeMethod === 'cash' ? '#fff' : '#7E7669'
                }}
              >
                {t('payment.cash')}
              </div>

              {/* Body */}
              <div className="p-10 text-center">
                <div className="flex justify-center mb-8">
                  <Banknote className="w-20 h-20" style={{ color: '#C2A86F' }} />
                </div>
                <p className="text-base f-heading leading-relaxed mb-6" style={{ color: '#4C463A' }}>
                  {t('payment.cashDesc')}
                </p>
                <p className="f-heading font-bold text-2xl mb-10" style={{ color: '#1A1C1C' }}>
                  +1 (555) 010-XXXX.
                </p>
                <button className="btn-gold w-full text-lg py-4" id="confirm-reservation-btn">
                  {t('payment.confirmReservation')}
                </button>
              </div>
            </div>

            {/* ── Card Payment ── */}
            <div
              className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                background: '#fff',
                border: activeMethod === 'card' ? '2px solid #C2A86F' : '2px solid #CFC5B6',
                boxShadow: activeMethod === 'card' ? '0 8px 30px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.06)'
              }}
              onClick={() => setActiveMethod('card')}
              id="payment-card-card"
            >
              {/* Tab Header */}
              <div
                className="py-5 text-center f-heading font-bold text-xl transition-colors"
                style={{
                  background: activeMethod === 'card' ? '#C2A86F' : '#EEEEEE',
                  color: activeMethod === 'card' ? '#fff' : '#7E7669'
                }}
              >
                {t('payment.card')}
              </div>

              {/* Body */}
              <div className="p-10">
                <div className="flex justify-center mb-5">
                  <CreditCard className="w-16 h-16" style={{ color: '#7E7669' }} />
                </div>
                <p className="text-base f-heading text-center mb-1" style={{ color: '#4C463A' }}>
                  {t('payment.notAvailable')}
                </p>
                <p className="text-xs f-heading text-right mb-8" style={{ color: '#7E7669' }}>
                  {t('payment.futureIntegration')}
                </p>

                {/* Card Form (disabled/faded) */}
                <div className="space-y-4 opacity-50 select-none pointer-events-none">
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder={t('payment.cardholderName')}
                      className="input-field input-no-icon"
                      disabled
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-xs f-heading font-bold" style={{ color: '#1A1C1C' }}>VISA</span>
                      <div className="w-8 h-5 rounded-sm" style={{ background: 'rgba(126, 118, 105, 0.3)' }} />
                      <div className="w-8 h-5 rounded-sm" style={{ background: '#EEEEEE' }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder={t('payment.cardNumber')}
                      className="col-span-1 input-field input-no-icon"
                      disabled
                    />
                    <input
                      type="text"
                      placeholder={t('payment.expiry')}
                      className="input-field input-no-icon"
                      disabled
                    />
                    <input
                      type="text"
                      placeholder={t('payment.cvc')}
                      className="input-field input-no-icon"
                      disabled
                    />
                  </div>

                  <button className="btn-disabled w-full py-4 text-lg" disabled>
                    {t('payment.addCardPay')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
