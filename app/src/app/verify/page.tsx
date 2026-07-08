'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import GlobalLoader from '@/components/GlobalLoader';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';

const verifyLangs = {
  EN: {
    titleRegister: 'Verify Your Account',
    titleForgot: 'Reset Your Password',
    subtitleRegister: 'We sent a 4-digit verification code to your email address. Enter it below to activate your account.',
    subtitleForgot: 'Enter the 4-digit code sent to your email to reset your password.',
    verifyBtn: 'Verify Code',
    resend: "Didn't receive a code?",
    resendBtn: 'Resend Code',
    backToLogin: 'Back to Sign In',
    success: 'Verification successful! Redirecting...',
    invalid: 'Invalid code. Please try again.',
  },
  TR: {
    titleRegister: 'Hesabınızı Doğrulayın',
    titleForgot: 'Şifrenizi Sıfırlayın',
    subtitleRegister: 'E-posta adresinize 4 haneli bir doğrulama kodu gönderdik. Hesabınızı etkinleştirmek için aşağıya girin.',
    subtitleForgot: 'Şifrenizi sıfırlamak için e-postanıza gönderilen 4 haneli kodu girin.',
    verifyBtn: 'Kodu Doğrula',
    resend: 'Kod almadınız mı?',
    resendBtn: 'Kodu Yeniden Gönder',
    backToLogin: 'Giriş Sayfasına Dön',
    success: 'Doğrulama başarılı! Yönlendiriliyor...',
    invalid: 'Geçersiz kod. Lütfen tekrar deneyin.',
  },
  AR: {
    titleRegister: 'تحقق من حسابك',
    titleForgot: 'إعادة تعيين كلمة المرور',
    subtitleRegister: 'لقد أرسلنا رمز تحقق مكون من 4 أرقام إلى بريدك الإلكتروني. أدخله أدناه لتفعيل حسابك.',
    subtitleForgot: 'أدخل الرمز المكون من 4 أرقام المرسل إلى بريدك الإلكتروني لإعادة تعيين كلمة المرور.',
    verifyBtn: 'تحقق من الرمز',
    resend: 'لم تستلم رمزًا؟',
    resendBtn: 'إعادة إرسال الرمز',
    backToLogin: 'العودة لتسجيل الدخول',
    success: 'تم التحقق بنجاح! جارٍ إعادة التوجيه...',
    invalid: 'رمز غير صالح. يرجى المحاولة مرة أخرى.',
  },
};

function VerifyPageContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'register'; // 'register' or 'forgot'
  const emailParam = searchParams.get('email');

  const vt = verifyLangs[language as 'EN' | 'TR' | 'AR'] || verifyLangs['EN'];

  // 4-digit code state
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expectedCode, setExpectedCode] = useState<string | null>(null);

  const sendVerificationCode = async (targetEmail: string) => {
    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (data.success) {
        setExpectedCode(data.code);
        setResendCooldown(30);
      } else {
        setError('Failed to send code. Try again later.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Failed to send code.');
    }
  };

  useEffect(() => {
    // Fire off email when component mounts if an email was passed in
    if (emailParam && !expectedCode && !loading && !success) {
      sendVerificationCode(emailParam);
    }
  }, [emailParam]);

  // Refs for auto-focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Only allow single numeric digit
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // On backspace, go to previous field
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < 4; i++) {
        newCode[i] = pasted[i] || '';
      }
      setCode(newCode);
      // Focus the last filled input or the next empty one
      const focusIdx = Math.min(pasted.length, 3);
      inputRefs.current[focusIdx]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      setError(vt.invalid);
      return;
    }

    if (expectedCode && fullCode !== expectedCode) {
      setError(vt.invalid);
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate verification (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo: accept any 4-digit code
    setSuccess(true);
    setLoading(false);

    // Redirect after success
    setTimeout(() => {
      if (mode === 'forgot') {
        window.location.href = '/login';
      } else {
        window.location.href = '/dashboard';
      }
    }, 2000);
  };

  const handleResend = () => {
    if (emailParam) {
      sendVerificationCode(emailParam);
    } else {
      setResendCooldown(30);
    }
    setError(null);
    setCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />

      <main className="flex-1 flex items-center justify-center relative px-4 py-16">
        <SparkleDecor />
        <div className="w-full max-w-[460px] relative z-10 animate-in">
          {/* Shield Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  border: '3px solid #C2A86F',
                  background: success ? 'rgba(194, 168, 111, 0.1)' : '#fff',
                  boxShadow: '0 4px 20px rgba(194,168,111,0.15)',
                  transition: 'all 0.3s ease',
                }}
              >
                <ShieldCheck
                  className="w-12 h-12 transition-colors"
                  style={{ color: success ? '#22c55e' : '#C2A86F' }}
                />
              </div>
              <svg className="sparkle-star" style={{ position: 'absolute', top: -8, right: -8, width: 16, height: 16, animationDelay: '0s' }} viewBox="0 0 24 24" fill="#C2A86F">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="f-heading font-bold text-center mb-2" style={{ fontSize: 26, color: '#1A1C1C' }}>
            {mode === 'forgot' ? vt.titleForgot : vt.titleRegister}
          </h1>
          <p className="f-heading text-center mb-10" style={{ fontSize: 14, color: '#7E7669' }}>
            {mode === 'forgot' ? vt.subtitleForgot : vt.subtitleRegister}
          </p>

          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl text-center text-sm font-bold bg-green-50 border border-green-200 text-green-700 animate-in">
              ✓ {vt.success}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* 4-Digit Code Input */}
          <div className="flex justify-center gap-4 mb-8" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={success}
                className="f-heading font-extrabold text-center transition-all duration-200 outline-none"
                style={{
                  width: 72,
                  height: 80,
                  fontSize: 32,
                  borderRadius: 16,
                  border: digit
                    ? '3px solid #C2A86F'
                    : error
                      ? '3px solid #ef4444'
                      : '3px solid #CFC5B6',
                  background: digit ? 'rgba(194, 168, 111, 0.05)' : '#F2F2F2',
                  color: '#1A1C1C',
                  boxShadow: digit ? '0 4px 12px rgba(194, 168, 111, 0.15)' : 'none',
                }}
                id={`verify-digit-${index}`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="btn-gold w-full py-4 text-base mb-6"
            disabled={loading || success || code.join('').length !== 4}
            id="verify-btn"
            style={{
              opacity: loading || success || code.join('').length !== 4 ? 0.6 : 1,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Verifying...
              </span>
            ) : success ? (
              '✓ Verified!'
            ) : (
              vt.verifyBtn
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center mb-6">
            <span className="text-sm f-heading" style={{ color: '#7E7669' }}>
              {vt.resend}{' '}
            </span>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || success}
              className="text-sm f-heading font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
              style={{
                color: resendCooldown > 0 ? '#999' : '#C2A86F',
                background: 'none',
                border: 'none',
              }}
              id="resend-code-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {resendCooldown > 0 ? `${vt.resendBtn} (${resendCooldown}s)` : vt.resendBtn}
            </button>
          </div>

          {/* Back to Login */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm f-heading font-semibold transition-colors hover:underline"
            style={{ color: '#4C463A' }}
            id="back-to-login"
          >
            <ArrowLeft className="w-4 h-4" />
            {vt.backToLogin}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-center items-center" style={{ background: '#F9F9F9' }}>
        <GlobalLoader />
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}
