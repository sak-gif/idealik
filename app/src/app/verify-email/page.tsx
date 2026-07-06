'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import SparkleDecor from '@/components/SparkleDecor';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'request' | 'verify'>('request');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  useEffect(() => {
    const urlEmail = searchParams.get('email');
    if (urlEmail) {
      setEmail(urlEmail);
    }
  }, [searchParams]);

  const handleSendOtp = async (targetEmail: string) => {
    if (!targetEmail) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send verification code.');
      
      setSuccessMsg('Verification code sent! Please check your email.');
      setStep('verify');
    } catch (err: any) {
      console.error('Email send error:', err);
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    const action = searchParams.get('action');

    if (action === 'forgot-password') {
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      if (action === 'forgot-password') {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: code, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Password reset failed.');
        
        setSuccessMsg('Password reset successfully! Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      // Verify OTP standard
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      });
      const verifyData = await res.json();
      if (!res.ok) throw new Error(verifyData.message || 'Invalid verification code.');

      if (action === 'register') {
        setSuccessMsg('Email verified successfully! Completing registration...');
        
        const pendingData = sessionStorage.getItem('idealik_pending_registration');
        if (pendingData) {
          try {
            const registerRes = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: pendingData,
            });
            const registerData = await registerRes.json();
            if (registerRes.ok) {
              localStorage.setItem('idealik_token', registerData.token);
              localStorage.setItem('idealik_user', JSON.stringify(registerData));
              sessionStorage.removeItem('idealik_pending_registration');
              setSuccessMsg('Account created! Redirecting...');
              setTimeout(() => router.push('/dashboard'), 2000);
              return;
            } else {
              setError(registerData.message || 'Registration failed after verification.');
              setSuccessMsg('');
              return;
            }
          } catch (err) {
            setError('Error completing registration.');
            setSuccessMsg('');
            return;
          }
        }
      }

      setSuccessMsg('Verified successfully! Redirecting...');
      setTimeout(() => router.push('/login'), 2000);

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
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <SparkleDecor />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <button 
          onClick={() => {
            if (step === 'verify' && !searchParams.get('email')) {
              setStep('request');
            } else {
              router.back();
            }
          }}
          className="flex items-center gap-2 text-text-light hover:text-text-main transition-colors mb-8 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="card p-8 md:p-10 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] -z-10" />

          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 mx-auto">
            {step === 'request' ? (
              <Mail className="w-7 h-7 text-primary-light" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-primary-light" />
            )}
          </div>

          <h1 className="text-3xl f-heading font-black text-text-main mb-2 text-center">
            {step === 'request' ? 'Verify Email' : 'Enter Code'}
          </h1>
          <p className="text-sm text-text-muted mb-8 leading-relaxed text-center">
            {step === 'request' 
              ? 'Enter your email address to receive a secure 6-digit verification code.'
              : `We sent a 6-digit verification code to ${email}. Enter it below.`}
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20">
              {successMsg}
            </div>
          )}

          {step === 'request' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!!searchParams.get('email')}
                  className={`w-full bg-bg-main border border-outline-variant/30 rounded-xl px-4 py-3.5 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-muted/50 ${!!searchParams.get('email') ? 'opacity-70 cursor-not-allowed' : ''}`}
                  placeholder="hello@example.com"
                  required
                />
              </div>

              <button
                onClick={() => handleSendOtp(email)}
                disabled={loading || !email}
                className="w-full btn-gold py-4 rounded-xl font-bold flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
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
                    className="w-10 h-12 sm:w-12 sm:h-14 bg-bg-main border border-outline-variant/30 rounded-xl text-center text-lg sm:text-xl font-bold text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-muted/30"
                    required
                  />
                ))}
              </div>

              {searchParams.get('action') === 'forgot-password' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-bg-main border border-outline-variant/30 rounded-xl px-4 py-3 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  
                  {newPassword && (
                    <div className="px-1">
                      <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                        <span className="text-text-muted">Strength</span>
                        <span style={{ color: getPasswordStrength(newPassword)?.color }}>{getPasswordStrength(newPassword)?.label}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300 rounded-full"
                          style={{ 
                            width: getPasswordStrength(newPassword)?.pct, 
                            backgroundColor: getPasswordStrength(newPassword)?.color 
                          }} 
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-bg-main border border-outline-variant/30 rounded-xl px-4 py-3 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
                  className="w-full btn-gold py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : searchParams.get('action') === 'forgot-password' ? (
                    'Reset Password'
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSendOtp(email)}
                  disabled={loading}
                  className="w-full py-3 text-sm font-semibold text-text-light hover:text-primary transition-colors bg-transparent border-none"
                >
                  Didn't receive a code? Resend
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
