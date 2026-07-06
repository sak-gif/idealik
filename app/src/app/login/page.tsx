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
              {loading ? 'Signing In...' : t('auth.signIn')}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: '#CFC5B6' }} />
              <span className="text-xs f-heading" style={{ color: '#7E7669' }}>{t('auth.or')}</span>
              <div className="flex-1 h-px" style={{ background: '#CFC5B6' }} />
            </div>

            <button
              type="button"
              className="w-full py-3.5 bg-white rounded-[10px] flex items-center justify-center gap-3 cursor-pointer f-heading text-sm transition-colors"
              style={{ border: '1.5px solid #CFC5B6', color: '#1A1C1C' }}
              id="google-sign-in"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t('auth.signInGoogle')}
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
