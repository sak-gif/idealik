'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage } from '@/context/LanguageContext';
import { Building2, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const pendingData = sessionStorage.getItem('idealik_pending_registration');
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        if (parsed.businessName) setBusinessName(parsed.businessName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
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

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

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

    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to send SMS.');
      }
      
      setSuccessMsg('SMS verification code sent!');
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send SMS. Please check your phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      // 1. Verify SMS OTP via Backend
      const verifyRes = await fetch('/api/auth/verify-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp: code }),
      });
      
      if (!verifyRes.ok) {
        throw new Error('Invalid or expired SMS code.');
      }

      // 2. Register User
      setSuccessMsg('Phone verified successfully! Creating account...');
      
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          email,
          phoneNumber,
          password
        }),
      });
      let registerData: any = {};
      try {
        registerData = await registerRes.json();
      } catch (e) {
        // Response wasn't JSON
      }
      
      if (registerRes.ok) {
        localStorage.setItem('idealik_token', registerData.token);
        localStorage.setItem('idealik_user', JSON.stringify(registerData));
        sessionStorage.removeItem('idealik_pending_registration');
        setSuccessMsg('Account created! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        throw new Error(registerData?.message || registerData?.error || `Registration failed (${registerRes.status}).`);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];
    
    digits.forEach((digit, idx) => {
      if (idx < 6) newOtp[idx] = digit;
    });
    
    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, 5);
    const nextInput = document.getElementById(`otp-${nextIndex === 6 ? 5 : nextIndex}`);
    nextInput?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />
      <main className="flex-1 flex items-center justify-center relative px-4 py-16">
        <SparkleDecor />
        <div className="card w-full max-w-[540px] relative z-10 animate-in" style={{ padding: '40px 36px' }}>
          
          {step === 'details' ? (
            <>
              <h1 className="f-heading font-bold text-center mb-2" style={{ fontSize: 26, color: '#1A1C1C' }}>
                {t('auth.createAccount')}
              </h1>
              <p className="f-heading text-center mb-10" style={{ fontSize: 14, color: '#7E7669' }}>
                {t('auth.registerSubtitle')}
              </p>

              <form className="space-y-5" onSubmit={handleSendOtp}>
                {error && (
                  <div className="p-3 rounded-lg text-sm font-medium text-red-600 bg-red-50 border border-red-200">
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
                  {loading ? 'Sending Code...' : t('auth.createBtn')}
                </button>




                <p className="text-center text-sm f-heading" style={{ color: '#4C463A' }}>
                  {t('auth.alreadyAccount')}{' '}
                  <Link href="/login" className="font-semibold hover:underline" style={{ color: '#C2A86F' }} id="go-to-login">{t('auth.signIn')}</Link>
                </p>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <button 
                onClick={() => setStep('details')}
                className="flex items-center gap-2 text-text-light hover:text-text-main transition-colors mb-6 text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </button>

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border mx-auto" style={{ background: '#f8f4e6', borderColor: '#e6d5b3' }}>
                <ShieldCheck className="w-7 h-7" style={{ color: '#C2A86F' }} />
              </div>

              <h1 className="text-2xl f-heading font-black text-text-main mb-2 text-center">
                Verify Your Phone
              </h1>
              <p className="text-sm text-text-muted mb-8 leading-relaxed text-center">
                We sent a 6-digit verification code to <strong>{phoneNumber}</strong>. Enter it below to create your account.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl text-sm font-medium text-red-600 bg-red-50 border border-red-200">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="mb-6 p-4 rounded-xl text-sm font-medium text-green-700 bg-green-50 border border-green-200">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleVerifyOtpAndRegister} className="space-y-6">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-10 h-12 sm:w-12 sm:h-14 bg-white border rounded-xl text-center text-lg sm:text-xl font-bold focus:outline-none transition-all placeholder:text-text-muted/30"
                      style={{ borderColor: '#EBE4D8', color: '#1A1C1C' }}
                      required
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading || otp.join('').length < 6}
                    className="btn-gold w-full py-4 text-base font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Create Account'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSendOtp(e)}
                    disabled={loading}
                    className="w-full py-3 text-sm font-semibold transition-colors bg-transparent border-none"
                    style={{ color: '#7E7669' }}
                  >
                    Didn't receive a code? <span style={{ color: '#C2A86F' }} className="hover:underline">Resend</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
