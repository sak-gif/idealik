'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, ArrowRight, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import SparkleDecor from '@/components/SparkleDecor';
import { auth, setupRecaptcha, sendSmsOtp, verifySmsOtp, type ConfirmationResult } from '@/lib/firebase';
import { RecaptchaVerifier } from 'firebase/auth';

export default function VerifyPhonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'request' | 'verify'>('request');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

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

  // Format phone number to E.164 if it doesn't start with +
  const formatPhone = (p: string) => {
    const cleaned = p.trim();
    if (cleaned.startsWith('+')) return cleaned;
    // Default to +1 (US) if no country code; user should input with country code
    return `+${cleaned}`;
  };

  // Auto-fill phone if passed via URL
  useEffect(() => {
    const urlPhone = searchParams.get('phone');
    if (urlPhone) {
      setPhone(urlPhone);
    }
  }, [searchParams]);

  const handleSendOtp = async (targetPhone: string) => {
    if (!targetPhone) {
      setError('Please enter your phone number.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {

      // Setup reCAPTCHA
      const verifier = setupRecaptcha('send-otp-btn');
      recaptchaVerifierRef.current = verifier;

      // Send SMS OTP via Firebase
      const formattedPhone = formatPhone(targetPhone);
      const result = await sendSmsOtp(formattedPhone, verifier);
      confirmationResultRef.current = result;
      
      setSuccessMsg('Verification code sent! Please check your SMS.');
      setStep('verify');
    } catch (err: any) {
      console.error('SMS send error:', err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Please include country code (e.g. +1234567890).');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Failed to send verification code.');
      }
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
      // Verify SMS OTP via Firebase
      if (!confirmationResultRef.current) {
        throw new Error('No verification session found. Please resend the code.');
      }

      const isValid = await verifySmsOtp(confirmationResultRef.current, code);
      if (!isValid) {
        throw new Error('Invalid verification code. Please try again.');
      }

      // If forgot-password, call backend to reset password
      if (action === 'forgot-password') {
        const email = searchParams.get('email') || '';
        const res = await fetch('/api/auth/reset-password-by-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formatPhone(phone), newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Password reset failed.');
        
        setSuccessMsg('Password reset successfully! Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      // If registering, complete registration
      if (action === 'register') {
        setSuccessMsg('Phone verified successfully! Completing registration...');
        
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

      // Default redirect
      setSuccessMsg('Verified successfully! Redirecting...');
      setTimeout(() => router.push('/login'), 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last typed character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace auto-focuses previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return; // ensure it's only digits

    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];
    
    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });
    
    setOtp(newOtp);

    // Auto-focus the last populated input
    const nextIndex = Math.min(digits.length, 5);
    const nextInput = document.getElementById(`otp-${nextIndex === 6 ? 5 : nextIndex}`);
    nextInput?.focus();
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <SparkleDecor />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back Button */}
        <button 
          onClick={() => {
            if (step === 'verify' && !searchParams.get('phone')) {
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

        {/* Card */}
        <div className="card p-8 md:p-10 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] -z-10" />

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 mx-auto">
            {step === 'request' ? (
              <Phone className="w-7 h-7 text-primary-light" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-primary-light" />
            )}
          </div>

          <h1 className="text-3xl f-heading font-black text-text-main mb-2 text-center">
            {step === 'request' ? 'Verify Phone' : 'Enter Code'}
          </h1>
          <p className="text-sm text-text-muted mb-8 leading-relaxed text-center">
            {step === 'request' 
              ? 'Enter your phone number with country code to receive a secure 6-digit SMS verification code.'
              : `We sent a 6-digit verification code via SMS to ${phone}. Enter it below.`}
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  readOnly={!!searchParams.get('phone')}
                  className={`w-full bg-bg-main border border-outline-variant/30 rounded-xl px-4 py-3.5 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-muted/50 ${!!searchParams.get('phone') ? 'opacity-70 cursor-not-allowed' : ''}`}
                  placeholder="+1234567890"
                  required
                />
                <p className="text-xs text-text-muted mt-1.5">Include country code (e.g. +1 for US, +90 for TR)</p>
              </div>

              <button
                id="send-otp-btn"
                onClick={() => handleSendOtp(phone)}
                disabled={loading || !phone}
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
                  id="send-otp-btn-resend"
                  onClick={() => handleSendOtp(phone)}
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

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" />
    </div>
  );
}
