'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { LogOut, Menu, X } from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          <Link href="/#home" className="text-[15px] font-medium text-text-light hover:text-primary transition-colors">home</Link>
          <Link href="/#about" className="text-[15px] font-medium text-text-light hover:text-primary transition-colors">about us</Link>
          <Link href="/#terms" className="text-[15px] font-medium text-text-light hover:text-primary transition-colors">terms & conditions</Link>
          <Link href="/#contact" className="text-[15px] font-medium text-text-light hover:text-primary transition-colors">contact us</Link>
        </nav>

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
              Log Out
            </button>
          )}
          
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="lg:hidden p-2 text-text-main hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-outline-variant/20 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link href="/#home" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-text-main hover:text-primary py-2 border-b border-outline-variant/10">home</Link>
          <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-text-main hover:text-primary py-2 border-b border-outline-variant/10">about us</Link>
          <Link href="/#terms" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-text-main hover:text-primary py-2 border-b border-outline-variant/10">terms & conditions</Link>
          <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-text-main hover:text-primary py-2 border-b border-outline-variant/10">contact us</Link>
          
          <div className="flex items-center justify-between pt-4">
            <LanguageSwitcher />
            {isLoggedIn && !isCustomerPage && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-red-500 bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            )}
          </div>
        </div>
      )}

      <div className="gold-line" />
    </header>
  );
}
