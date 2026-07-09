'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { t } = useLanguage();
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const savedEmail = sessionStorage.getItem('idealik_login_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    sessionStorage.setItem('idealik_login_email', e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('idealik_token', data.token);
      localStorage.setItem('idealik_user', JSON.stringify(data));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />
      <main className="flex-1 flex items-center justify-center relative px-4 py-16">
        <SparkleDecor />
        <div className="w-full max-w-[460px] relative z-10 animate-in">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  border: '3px solid #C2A86F',
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(194,168,111,0.15)',
                }}
              >
                <Image src="/icon.png" alt="idealik" width={64} height={64} className="w-16 h-16 object-contain" />
              </div>
              <svg className="sparkle-star" style={{ position: 'absolute', top: -8, right: -8, width: 16, height: 16, animationDelay: '0s' }} viewBox="0 0 24 24" fill="#C2A86F">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="f-heading font-bold text-center mb-2" style={{ fontSize: 26, color: '#1A1C1C' }}>
            {t('auth.welcomeBack')}
          </h1>
          <p className="f-heading text-center mb-10" style={{ fontSize: 14, color: '#7E7669' }}>
            {t('auth.signInSubtitle')}
          </p>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200">
                {error}
              </div>
            )}
            <div className="input-wrap">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder={t('auth.email')}
                className="input-field"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>

            <div className="input-wrap">
              <Lock className="input-icon" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder={t('auth.password')}
                className="input-field"
                style={{ paddingRight: 48 }}
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: '#7E7669' }}
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setRemember(!remember)}
                  className="w-[18px] h-[18px] rounded flex items-center justify-center transition-colors"
                  style={{
                    border: `2px solid ${remember ? '#C2A86F' : '#CFC5B6'}`,
                    background: remember ? '#C2A86F' : '#fff',
                  }}
                >
                  {remember && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </div>
                <span className="text-xs f-heading" style={{ color: '#4C463A' }}>{t('auth.rememberMe')}</span>
              </label>
              <Link href="/verify-email?action=forgot-password" className="text-xs f-heading transition-colors hover:underline" style={{ color: '#4C463A' }}>
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <button type="submit" className="btn-gold w-full py-4 text-base" id="sign-in-btn" disabled={loading}>
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>



            <p className="text-center text-sm f-heading" style={{ color: '#4C463A' }}>
              {t('auth.noAccount')}{' '}
              <Link href="/register" className="font-semibold hover:underline" style={{ color: '#C2A86F' }} id="go-to-register">{t('auth.signUp')}</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
