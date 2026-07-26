'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { LogOut, Menu, X, Bell } from 'lucide-react';

export default function Header() {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const isCustomerPage = pathname?.startsWith('/booking');
  const isHomePage = pathname === '/';

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([
    { id: 'default-1', titleKey: 'notifications.system', textKey: 'notifications.systemText', time: 'Just now', unread: false }
  ]);
  const hasUnread = notifications.some(n => n.unread);

  const playSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play prevented by browser', e));
    } catch (e) {}
  };

  const toggleNotifications = () => {
    if (!isNotificationsOpen && hasUnread) {
      playSound();
      // Mark as read after opening
      setTimeout(() => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      }, 2000);
    }
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('idealik_token'));

    if (pathname === '/') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, { rootMargin: '-30% 0px -70% 0px' }); // Trigger when section is in top 30%

      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => observer.observe(section));

      return () => {
        sections.forEach(section => observer.unobserve(section));
      };
    } else {
      setActiveSection('');
    }
  }, [pathname]);

  // --- Real-time Notifications Polling ---
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchNotifications = async () => {
      const token = localStorage.getItem('idealik_token');
      if (!token || isCustomerPage) return; // Only fetch for logged-in practitioners

      try {
        const res = await fetch('/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        // Sort by newest and pick top 10
        const sorted = data.sort((a: any, b: any) => b.id - a.id).slice(0, 10);
        const newUnreadCount = sorted.filter(b => b.bookingStatus === 'pending').length;

        setNotifications(prev => {
          const oldUnreadCount = prev.filter(n => n.unread).length;
          
          // Play sound if there's a NEW unread booking that wasn't there before
          // We only do this if it's not the initial load (prev length > 1)
          if (prev.length > 1 && newUnreadCount > oldUnreadCount) {
             playSound();
          }

          if (sorted.length === 0) {
            return [{ id: 'default-1', titleKey: 'notifications.system', textKey: 'notifications.systemText', time: 'Just now', unread: false }];
          }

          return sorted.map(b => {
            let titleKey = 'notifications.system';
            let unread = false;

            if (b.bookingStatus === 'pending') {
              titleKey = 'notifications.new';
              unread = true;
            } else if (b.bookingStatus === 'confirmed') {
              titleKey = 'schedule.confirmed';
            } else if (b.bookingStatus === 'declined') {
              titleKey = 'schedule.declineBtn';
            }

            const textStr = `${b.clientName} • ${b.slotDate} • ${b.slotTime}`;

            return {
              id: b.id,
              titleKey,
              textStr,
              textKey: '',
              time: '',
              unread
            };
          });
        });
      } catch (e) {
        // Silent catch for polling
      }
    };

    if (isLoggedIn && !isCustomerPage) {
      fetchNotifications();
      interval = setInterval(fetchNotifications, 10000); // Poll every 10s
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoggedIn, isCustomerPage]);

  const handleLogout = async () => {
    const token = localStorage.getItem('idealik_token');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (e) {
        // Ignore network errors on logout
      }
    }
    localStorage.removeItem('idealik_token');
    localStorage.removeItem('idealik_user');
    window.location.href = '/login';
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm" id="main-header">
      <div className="page-container flex items-center justify-between py-5">
        
        {/* Left: Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center" id="logo-link">
          <Image
            src="/logo-idealik.png"
            alt="idealik"
            width={160}
            height={52}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Center: Desktop Nav — only on homepage */}
        {isHomePage && (
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <Link href="/#home" className={`text-[15px] font-medium transition-colors ${activeSection === 'home' ? 'text-primary' : 'text-text-light hover:text-primary'}`}>{t('nav.home')}</Link>
            <Link href="/#about" className={`text-[15px] font-medium transition-colors ${activeSection === 'about' ? 'text-primary' : 'text-text-light hover:text-primary'}`}>{t('nav.aboutUs')}</Link>
            <Link href="/#terms" className={`text-[15px] font-medium transition-colors ${activeSection === 'terms' ? 'text-primary' : 'text-text-light hover:text-primary'}`}>{t('nav.termsConditions')}</Link>
            <Link href="/#privacy" className={`text-[15px] font-medium transition-colors ${activeSection === 'privacy' ? 'text-primary' : 'text-text-light hover:text-primary'}`}>{t('nav.privacyPolicy2')}</Link>
            <Link href="/#contact" className={`text-[15px] font-medium transition-colors ${activeSection === 'contact' ? 'text-primary' : 'text-text-light hover:text-primary'}`}>{t('nav.contactUs')}</Link>
          </nav>
        )}

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-4 flex-shrink-0">
          {isLoggedIn && !isCustomerPage && (
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl cursor-pointer transition-all duration-200 border"
              style={{ 
                color: '#ef4444', 
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                borderColor: 'rgba(239, 68, 68, 0.2)' 
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logOut')}
            </button>
          )}

          {/* Notifications Dropdown Container */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 relative text-text-main hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-surface-container"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-white border border-outline-variant/20 shadow-xl rounded-xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/30">
                  <h3 className="font-bold text-sm text-text-main">{t('notifications.title')}</h3>
                  <span className="text-xs bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full font-semibold">
                    {notifications.filter(n => n.unread).length} {t('notifications.newBadge')}
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-text-muted">{t('notifications.empty')}</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b border-outline-variant/5 hover:bg-surface-container/20 transition-colors cursor-pointer ${n.unread ? 'bg-primary/5' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm ${n.unread ? 'font-bold text-text-main' : 'font-semibold text-text-light'}`}>{t(n.titleKey)}</h4>
                          {n.time && <span className="text-[10px] text-text-muted whitespace-nowrap ml-2">{n.time}</span>}
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{n.textStr || t(n.textKey)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <LanguageSwitcher />

          {/* Mobile Hamburger Button — only on homepage */}
          {isHomePage && (
            <button 
              className="lg:hidden p-2 text-text-main hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown — only on homepage */}
      {isHomePage && isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-outline-variant/20 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link href="/#home" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium py-2 border-b border-outline-variant/10 ${activeSection === 'home' ? 'text-primary' : 'text-text-main hover:text-primary'}`}>{t('nav.home')}</Link>
          <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium py-2 border-b border-outline-variant/10 ${activeSection === 'about' ? 'text-primary' : 'text-text-main hover:text-primary'}`}>{t('nav.aboutUs')}</Link>
          <Link href="/#terms" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium py-2 border-b border-outline-variant/10 ${activeSection === 'terms' ? 'text-primary' : 'text-text-main hover:text-primary'}`}>{t('nav.termsConditions')}</Link>
          <Link href="/#privacy" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium py-2 border-b border-outline-variant/10 ${activeSection === 'privacy' ? 'text-primary' : 'text-text-main hover:text-primary'}`}>{t('nav.privacyPolicy2')}</Link>
          <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium py-2 border-b border-outline-variant/10 ${activeSection === 'contact' ? 'text-primary' : 'text-text-main hover:text-primary'}`}>{t('nav.contactUs')}</Link>
          {isLoggedIn && !isCustomerPage && (
            <div className="pt-4 border-t border-outline-variant/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-red-500 bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                {t('nav.logOut')}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="gold-line" />
    </header>
  );
}
