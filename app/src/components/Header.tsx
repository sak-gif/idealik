'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { LogOut } from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const isCustomerPage = pathname?.startsWith('/booking');

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('idealik_token'));
  }, []);

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
    <header className="w-full bg-white sticky top-0 z-50" id="main-header">
      <div className="page-container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center" id="logo-link">
          <Image
            src="/logo-idealik.png"
            alt="idealik"
            width={200}
            height={64}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-6">
          {isLoggedIn && !isCustomerPage && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm f-heading font-bold rounded-xl cursor-pointer transition-all duration-200 border"
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
              Log Out
            </button>
          )}
          <LanguageSwitcher />
        </div>
      </div>
      <div className="gold-line" />
    </header>
  );
}
