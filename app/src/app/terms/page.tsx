'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage, Language } from '@/context/LanguageContext';

type TermsSection = {
  title: string;
  content: string;
};

type TermsTranslation = {
  back: string;
  title: string;
  subtitle: string;
  sections: TermsSection[];
};

const translations: Record<Language, TermsTranslation> = {
  EN: {
    back: '← Back to Home',
    title: 'Terms & Conditions',
    subtitle: 'Terms and Conditions – iDAELİK',
    sections: [
      {
        title: '1. Introduction',
        content: 'By using iDAELİK, you agree to these Terms and Conditions. If you do not agree, you should not use the platform.'
      },
      {
        title: '2. Services',
        content: 'iDAELİK provides an online booking and business management system that allows users to schedule appointments with registered business owners.'
      },
      {
        title: '3. User Accounts',
        content: 'Business owners may create accounts to manage their booking pages. Customers may book appointments without creating an account, using phone verification.'
      },
      {
        title: '4. Bookings',
        content: 'All bookings are subject to availability. Business owners have the right to accept or reject pending bookings where applicable.'
      },
      {
        title: '5. Payments',
        content: 'Payments may be made online or in cash, depending on the business settings. Online payments are processed securely through third-party providers. iDAELİK does not store payment card information.'
      },
      {
        title: '6. Cancellations',
        content: 'Business owners and customers may cancel bookings according to their own policies. Repeated no-shows may result in restrictions.'
      },
      {
        title: '7. Prohibited Use',
        content: 'Users must not misuse the platform, create fake bookings, or engage in fraudulent activity.'
      },
      {
        title: '8. Liability',
        content: 'iDAELİK is not responsible for service quality provided by business owners or disputes between users.'
      },
      {
        title: '9. Changes',
        content: 'We reserve the right to update these Terms at any time.'
      },
      {
        title: '10. Contact',
        content: 'For support, users may contact the iDAELİK support team.'
      }
    ]
  },
  TR: {
    back: '← Ana Sayfaya Dön',
    title: 'Şartlar ve Koşullar',
    subtitle: 'Şartlar ve Koşullar – iDAELİK',
    sections: [
      {
        title: '1. Giriş',
        content: "iDAELİK'i kullanarak bu Şartlar ve Koşulları kabul etmiş olursunuz. Kabul etmiyorsanız platformu kullanmamalısınız."
      },
      {
        title: '2. Hizmetler',
        content: 'iDAELİK, kullanıcıların kayıtlı işletme sahipleriyle randevu planlamasına olanak tanıyan çevrimiçi bir rezervasyon ve işletme yönetim sistemi sunar.'
      },
      {
        title: '3. Kullanıcı Hesapları',
        content: 'İşletme sahipleri rezervasyon sayfalarını yönetmek için hesap oluşturabilirler. Müşteriler, telefon doğrulaması kullanarak hesap oluşturmadan randevu alabilirler.'
      },
      {
        title: '4. Rezervasyonlar',
        content: 'Tüm rezervasyonlar müsaitlik durumuna bağlıdır. İşletme sahipleri, uygun olduğunda bekleyen rezervasyonları kabul etme veya reddetme hakkına sahiptir.'
      },
      {
        title: '5. Ödemeler',
        content: 'Ödemeler, işletme ayarlarına bağlı olarak çevrimiçi veya nakit olarak yapılabilir. Çevrimiçi ödemeler, üçüncü taraf sağlayıcılar aracılığıyla güvenli bir şekilde işlenir. iDAELİK ödeme kartı bilgilerini saklamaz.'
      },
      {
        title: '6. İptaller',
        content: 'İşletme sahipleri ve müşteriler, kendi politikalarına göre rezervasyonları iptal edebilirler. Tekrarlanan gelmeme durumları kısıtlamalara yol açabilir.'
      },
      {
        title: '7. Yasaklı Kullanım',
        content: 'Kullanıcılar platformu kötüye kullanmamalı, sahte rezervasyonlar oluşturmamalı veya dolandırıcılık faaliyetlerinde bulunmamalıdır.'
      },
      {
        title: '8. Sorumluluk',
        content: 'iDAELİK, işletme sahipleri tarafından sağlanan hizmet kalitesinden veya kullanıcılar arasındaki anlaşmazlıklardan sorumlu değildir.'
      },
      {
        title: '9. Değişiklikler',
        content: 'Bu Şartları istediğimiz zaman güncelleme hakkını saklı tutarız.'
      },
      {
        title: '10. İletişim',
        content: 'Destek için kullanıcılar iDAELİK destek ekibiyle iletişime geçebilirler.'
      }
    ]
  },
  AR: {
    back: '← العودة إلى الرئيسية',
    title: 'الشروط والأحكام',
    subtitle: 'الشروط والأحكام – iDAELİK',
    sections: [
      {
        title: '١. مقدمة',
        content: 'باستخدام iDAELİK، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق، فلا ينبغي لك استخدام المنصة.'
      },
      {
        title: '٢. الخدمات',
        content: 'توفر iDAELİK نظام حجز وإدارة أعمال عبر الإنترنت يتيح للمستخدمين جدولة المواعيد مع أصحاب الأعمال المسجلين.'
      },
      {
        title: '٣. حسابات المستخدمين',
        content: 'يجوز لأصحاب الأعمال إنشاء حسابات لإدارة صفحات الحجز الخاصة بهم. يمكن للعملاء حجز المواعيد دون إنشاء حساب، باستخدام التحقق من الهاتف.'
      },
      {
        title: '٤. الحجوزات',
        content: 'تخضع جميع الحجوزات للتوافر. يحق لأصحاب الأعمال قبول أو رفض الحجوزات المعلقة عند الاقتضاء.'
      },
      {
        title: '٥. المدفوعات',
        content: 'يمكن إجراء المدفوعات عبر الإنترنت أو نقدًا، اعتمادًا على إعدادات العمل. يتم معالجة المدفوعات عبر الإنترنت بشكل آمن من خلال مزودي خدمات الطرف الثالث. لا تقوم iDAELİK بتخزين معلومات بطاقة الدفع.'
      },
      {
        title: '٦. الإلغاءات',
        content: 'يجوز لأصحاب الأعمال والعملاء إلغاء الحجوزات وفقًا لسياساتهم الخاصة. قد يؤدي تكرار عدم الحضور إلى فرض قيود.'
      },
      {
        title: '٧. الاستخدام المحظور',
        content: 'يجب على المستخدمين عدم إساءة استخدام المنصة، أو إنشاء حجوزات وهمية، أو الانخراط في نشاط احتيالي.'
      },
      {
        title: '٨. المسؤولية',
        content: 'iDAELİK ليست مسؤولة عن جودة الخدمة المقدمة من أصحاب الأعمال أو النزاعات بين المستخدمين.'
      },
      {
        title: '٩. التغييرات',
        content: 'نحتفظ بالحق في تحديث هذه الشروط في أي وقت.'
      },
      {
        title: '١٠. الاتصال',
        content: 'للحصول على الدعم، يمكن للمستخدمين الاتصال بفريق دعم iDAELİK.'
      }
    ]
  },
};

export default function TermsPage() {
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
                <div key={idx} className="space-y-2">
                  <h3 className="f-heading font-bold text-lg" style={{ color: '#1A1C1C' }}>
                    {section.title}
                  </h3>
                  <p>{section.content}</p>
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
