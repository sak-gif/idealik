import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BookingNotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />
      <main className="flex-1 flex items-center justify-center relative px-4 py-16">
        <SparkleDecor />
        <div className="w-full max-w-[460px] relative z-10 animate-in text-center">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ border: '3px solid #CFC5B6', background: '#fff' }}>
              <AlertCircle className="w-12 h-12" style={{ color: '#CFC5B6' }} />
            </div>
          </div>
          <h1 className="f-heading font-bold text-center mb-2" style={{ fontSize: 26, color: '#1A1C1C' }}>
            Provider Not Found
          </h1>
          <p className="f-heading text-center mb-10" style={{ fontSize: 14, color: '#7E7669' }}>
            The booking profile you are looking for does not exist or requires a direct invite link. Please check the URL or scan the provider's QR code.
          </p>
          <Link href="/" className="btn-gold py-4 text-base w-full flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
