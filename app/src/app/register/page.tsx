'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage } from '@/context/LanguageContext';
import { Building2, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const pendingData = sessionStorage.getItem('idealik_pending_registration');
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        if (parsed.businessName) setBusinessName(parsed.businessName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        // We typically do not restore password for security, but since the user requested the data to be filled:
        if (parsed.password) {
          setPassword(parsed.password);
          setConfirmPassword(parsed.password);
        }
      } catch (e) {
        console.error("Failed to restore registration data");
      }
    }
  }, []);

  const getPasswordStrength = (pw: string) => {
    if (!pw) return null;
    if (pw.length < 8) return { label: 'Too short (min 8)', color: '#ef4444', pct: '25%' };
    
    let strength = 0;
    if (/[a-z]/.test(pw)) strength++;
    if (/[A-Z]/.test(pw)) strength++;
    if (/\d/.test(pw)) strength++;
    if (/[^a-zA-Z\d]/.test(pw)) strength++;

    if (strength <= 1) return { label: 'Weak', color: '#ef4444', pct: '50%' };
    if (strength === 2) return { label: 'Good', color: '#eab308', pct: '75%' };
    return { label: 'Strong', color: '#22c55e', pct: '100%' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!agree) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (!phoneNumber) {
      setError('Phone number is required for verification');
      return;
    }

    setLoading(true);
    try {
      // Save registration data temporarily
      sessionStorage.setItem('idealik_pending_registration', JSON.stringify({
        businessName, email, phoneNumber, password
      }));

      // Redirect to SMS verification page with phone number
      window.location.href = `/verify-email?phone=${encodeURIComponent(phoneNumber)}&action=register`;
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />
      <main className="flex-1 flex items-center justify-center relative px-4 py-16">
        <SparkleDecor />
        <div className="card w-full max-w-[540px] relative z-10 animate-in" style={{ padding: '40px 36px' }}>
          {/* Title */}
          <h1 className="f-heading font-bold text-center mb-2" style={{ fontSize: 26, color: '#1A1C1C' }}>
            {t('auth.createAccount')}
          </h1>
          <p className="f-heading text-center mb-10" style={{ fontSize: 14, color: '#7E7669' }}>
            {t('auth.registerSubtitle')}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200">
                {error}
              </div>
            )}
            <div className="input-wrap">
              <Building2 className="input-icon" />
              <input
                type="text"
                placeholder={t('auth.businessName')}
                className="input-field"
                id="register-business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>

            <div className="input-wrap">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder={t('auth.email')}
                className="input-field"
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-wrap">
              <Phone className="input-icon" />
              <input
                type="tel"
                placeholder={t('auth.phoneNumber')}
                className="input-field"
                id="register-phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: '#7E7669' }}>
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {password && (
              <div className="px-1">
                <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                  <span style={{ color: '#7E7669' }}>Password Strength</span>
                  <span style={{ color: getPasswordStrength(password)?.color }}>{getPasswordStrength(password)?.label}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: getPasswordStrength(password)?.pct, 
                      backgroundColor: getPasswordStrength(password)?.color 
                    }} 
                  />
                </div>
              </div>
            )}

            <div className="input-wrap">
              <Lock className="input-icon" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder={t('auth.confirmPassword')}
                className="input-field"
                style={{ paddingRight: 48 }}
                id="register-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: '#7E7669' }}>
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setAgree(!agree)}
                className="w-[18px] h-[18px] mt-0.5 rounded flex-shrink-0 flex items-center justify-center transition-colors"
                style={{
                  border: `2px solid ${agree ? '#C2A86F' : '#CFC5B6'}`,
                  background: agree ? '#C2A86F' : '#fff',
                }}
              >
                {agree && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </div>
              <span className="text-xs f-heading leading-relaxed" style={{ color: '#4C463A' }}>
                {t('auth.agreeTerms')}{' '}
                <Link href="/terms" className="font-semibold hover:underline" style={{ color: '#C2A86F' }}>{t('auth.termsOfService')}</Link>
                {' '}{t('auth.and')}{' '}
                <Link href="/privacy" className="font-semibold hover:underline" style={{ color: '#C2A86F' }}>{t('auth.privacyPolicy')}</Link>
              </span>
            </label>

            <button type="submit" className="btn-gold w-full py-4 text-base" id="create-account-btn" disabled={loading}>
              {loading ? 'Creating Account...' : t('auth.createBtn')}
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
              id="google-sign-up"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t('auth.signUpGoogle')}
            </button>

            <p className="text-center text-sm f-heading" style={{ color: '#4C463A' }}>
              {t('auth.alreadyAccount')}{' '}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: '#C2A86F' }} id="go-to-login">{t('auth.signIn')}</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
