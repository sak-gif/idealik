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
    title: 'About iDAELİK',
    p1: 'iDAELİK is a modern appointment and business management platform designed to help small and medium-sized businesses build their digital presence and manage bookings effortlessly.',
    p2: 'We believe every business deserves an “ideal” system—simple, fast, and powerful. iDAELİK enables business owners to create their own online booking page within minutes, without technical knowledge.',
    p3: 'Our platform allows customers to book appointments instantly, while giving business owners full control over their schedules, availability, and client management.',
    p4: 'We focus on simplicity, speed, and reliability. Whether you are a barber, trainer, consultant, or service provider, iDAELİK helps you stay organized and grow your business.',
    p5: 'Our mission is to empower businesses to go beyond limits and operate more efficiently in the digital world.',
  },
  TR: {
    back: '← Ana Sayfaya Dön',
    title: 'iDAELİK Hakkında',
    p1: 'iDAELİK, küçük ve orta ölçekli işletmelerin dijital varlıklarını oluşturmalarına ve rezervasyonları zahmetsizce yönetmelerine yardımcı olmak için tasarlanmış modern bir randevu ve işletme yönetim platformudur.',
    p2: 'Her işletmenin "ideal" bir sistemi hak ettiğine inanıyoruz—basit, hızlı ve güçlü. iDAELİK, işletme sahiplerinin teknik bilgiye ihtiyaç duymadan birkaç dakika içinde kendi çevrimiçi rezervasyon sayfalarını oluşturmalarını sağlar.',
    p3: 'Platformumuz, müşterilerin anında randevu almasına olanak tanırken, işletme sahiplerine de programları, müsaitlik durumları ve müşteri yönetimleri üzerinde tam kontrol sağlar.',
    p4: 'Sadelik, hız ve güvenilirliğe odaklanıyoruz. Berber, eğitmen, danışman veya hizmet sağlayıcı olun, iDAELİK düzenli kalmanıza ve işletmenizi büyütmenize yardımcı olur.',
    p5: 'Misyonumuz, işletmelerin sınırların ötesine geçmelerini ve dijital dünyada daha verimli çalışabilmelerini sağlamaktır.',
  },
  AR: {
    back: '← العودة إلى الرئيسية',
    title: 'حول iDAELİK',
    p1: 'إن iDAELİK عبارة عن منصة حديثة لإدارة المواعيد والأعمال مصممة لمساعدة الشركات الصغيرة والمتوسطة الحجم على بناء تواجدها الرقمي وإدارة الحجوزات دون عناء.',
    p2: 'نحن نؤمن بأن كل عمل يستحق نظامًا "مثاليًا" — بسيطًا وسريعًا وقويًا. يتيح iDAELİK لأصحاب الأعمال إنشاء صفحة الحجز الخاصة بهم عبر الإنترنت في غضون دقائق، دون معرفة تقنية.',
    p3: 'تتيح منصتنا للعملاء حجز المواعيد على الفور، مع منح أصحاب الأعمال التحكم الكامل في جداولهم، وتوافرهم، وإدارة عملائهم.',
    p4: 'نحن نركز على البساطة والسرعة والموثوقية. سواء كنت حلاقًا أو مدربًا أو مستشارًا أو مقدم خدمة، فإن iDAELİK يساعدك على البقاء منظمًا وتنمية عملك.',
    p5: 'مهمتنا هي تمكين الشركات من الذهاب إلى ما هو أبعد من الحدود والعمل بكفاءة أكبر في العالم الرقمي.',
  }
};

export default function AboutPage() {
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
          <div className="card animate-fade-in" style={{ padding: '48px 40px' }}>
            <h1
              className="f-heading font-extrabold mb-2"
              style={{ fontSize: 'clamp(28px, 4vw, 36px)', color: '#1A1C1C' }}
            >
              {t.title}
            </h1>
            <div className="gold-line my-6" />
            <div className="space-y-6 text-base leading-relaxed" style={{ color: '#4C463A' }}>
              <p>{t.p1}</p>
              <p>{t.p2}</p>
              <p>{t.p3}</p>
              <p>{t.p4}</p>
              <p>{t.p5}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
