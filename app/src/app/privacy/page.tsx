'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    back: '← Back to Home',
    title: 'Privacy Policy',
    subtitle: 'Privacy Policy – iDAELİK',
    sections: [
      {
        title: '1. Information We Collect',
        content: 'We collect basic user information such as name, phone number, and booking details.'
      },
      {
        title: '2. How We Use Information',
        content: 'We use this information to:',
        bullets: [
          'Manage bookings',
          'Verify users via OTP',
          'Send notifications and reminders'
        ]
      },
      {
        title: '3. Data Sharing',
        content: 'We do not sell personal data. Data is only shared with the business owner relevant to the booking.'
      },
      {
        title: '4. Data Security',
        content: 'We use industry-standard security practices to protect user data.'
      },
      {
        title: '5. Cookies & Tracking',
        content: 'We may use cookies to improve user experience and platform performance.'
      },
      {
        title: '6. User Rights',
        content: 'We respect your rights. Users may request deletion of their data at any time.'
      },
      {
        title: '7. Contact',
        content: 'For privacy concerns, users can contact iDAELİK support.'
      }
    ]
  },
  TR: {
    back: '← Ana Sayfaya Dön',
    title: 'Gizlilik Politikası',
    subtitle: 'Gizlilik Politikası – iDAELİK',
    sections: [
      {
        title: '1. Topladığımız Bilgiler',
        content: 'İsim, telefon numarası ve rezervasyon detayları gibi temel kullanıcı bilgilerini topluyoruz.'
      },
      {
        title: '2. Bilgileri Nasıl Kullanıyoruz',
        content: 'Bu bilgileri şu amaçlarla kullanıyoruz:',
        bullets: [
          'Rezervasyonları yönetmek',
          'Kullanıcıları OTP (Tek Kullanımlık Şifre) ile doğrulamak',
          'Bildirimler ve hatırlatıcılar göndermek'
        ]
      },
      {
        title: '3. Veri Paylaşımı',
        content: 'Kişisel verileri satmıyoruz. Veriler yalnızca rezervasyonla ilgili işletme sahibiyle paylaşılır.'
      },
      {
        title: '4. Veri Güvenliği',
        content: 'Kullanıcı verilerini korumak için endüstri standardı güvenlik uygulamaları kullanıyoruz.'
      },
      {
        title: '5. Çerezler ve Takip',
        content: 'Kullanıcı deneyimini ve platform performansını iyileştirmek için çerezler kullanabiliriz.'
      },
      {
        title: '6. Kullanıcı Hakları',
        content: 'Kullanıcı haklarına saygı duyuyoruz. Kullanıcılar istedikleri zaman verilerinin silinmesini talep edebilirler.'
      },
      {
        title: '7. İletişim',
        content: 'Gizlilikle ilgili endişeleriniz için kullanıcılar iDAELİK desteğiyle iletişime geçebilirler.'
      }
    ]
  },
  AR: {
    back: '← العودة إلى الرئيسية',
    title: 'سياسة الخصوصية',
    subtitle: 'سياسة الخصوصية – iDAELİK',
    sections: [
      {
        title: '١. المعلومات التي نجمعها',
        content: 'نحن نجمع معلومات المستخدم الأساسية مثل الاسم ورقم الهاتف وتفاصيل الحجز.'
      },
      {
        title: '٢. كيف نستخدم المعلومات',
        content: 'نحن نستخدم هذه المعلومات من أجل:',
        bullets: [
          'إدارة الحجوزات',
          'التحقق من المستخدمين عبر رمز التحقق لمرة واحدة (OTP)',
          'إرسال الإشعارات والتذكيرات'
        ]
      },
      {
        title: '٣. مشاركة البيانات',
        content: 'نحن لا نبيع البيانات الشخصية. يتم مشاركة البيانات فقط مع صاحب العمل المعني بالحجز.',
      },
      {
        title: '٤. أمن البيانات',
        content: 'نحن نستخدم ممارسات أمنية قياسية في الصناعة لحماية بيانات المستخدم.',
      },
      {
        title: '٥. ملفات تعريف الارتباط والتتبع',
        content: 'قد نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وأداء المنصة.',
      },
      {
        title: '٦. حقوق المستخدم',
        content: 'نحن نحترم حقوقكم. يجوز للمستخدمين طلب حذف بياناتهم في أي وقت.',
      },
      {
        title: '٧. الاتصال',
        content: 'بخصوص مخاوف الخصوصية، يمكن للمستخدمين الاتصال بدعم iDAELİK.',
      }
    ]
  }
};

export default function PrivacyPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations['EN'];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />
      <main className="flex-1 py-16 px-4 relative overflow-hidden">
        <SparkleDecor />
        <div className="max-w-3xl mx-auto relative z-10 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold mb-6 hover:text-primary transition-colors"
            style={{ color: '#7E7669' }}
          >
            {t.back}
          </Link>
          <div className="card" style={{ padding: '48px 40px' }}>
            <h1
              className="f-heading font-extrabold mb-1"
              style={{ fontSize: 'clamp(28px, 4vw, 36px)', color: '#1A1C1C' }}
            >
              {t.title}
            </h1>
            <p className="text-xs f-heading font-semibold tracking-wider uppercase mb-2" style={{ color: '#C2A86F' }}>
              {t.subtitle}
            </p>
            <div className="gold-line my-6" />
            
            <div className="space-y-8 text-base leading-relaxed" style={{ color: '#4C463A' }}>
              {t.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="f-heading font-bold text-lg" style={{ color: '#1A1C1C' }}>
                    {section.title}
                  </h3>
                  <p>{section.content}</p>
                  {section.bullets && (
                    <ul className="list-disc pl-6 space-y-1.5" style={{ listStyleType: language === 'AR' ? 'disc' : 'disc' }}>
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
