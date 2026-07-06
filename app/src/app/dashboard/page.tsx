'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage } from '@/context/LanguageContext';
import ScheduleTab from './ScheduleTab';
import ServicesTab from './ServicesTab';

type TabType = 'schedule' | 'services';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('services');

  useEffect(() => {
    const token = localStorage.getItem('idealik_token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'schedule', label: t('dashboard.schedule') },
    { key: 'services', label: t('dashboard.services') },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />

      {/* Tab Navigation */}
      <nav className="w-full bg-white shadow-sm" style={{ borderBottom: '1px solid #E8E8E8' }} id="dashboard-tabs">
        <div className="page-container flex justify-center gap-16">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="py-6 px-4 text-center f-heading font-extrabold text-xl tracking-[0.1em] uppercase cursor-pointer transition-all duration-300"
              style={{
                color: activeTab === tab.key ? '#C2A86F' : '#7E7669',
                borderBottom: activeTab === tab.key ? '4px solid #C2A86F' : '4px solid transparent',
              }}
              id={`tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 relative">
        <SparkleDecor />
        <div className="page-container py-8 relative z-10">
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'services' && <ServicesTab />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
