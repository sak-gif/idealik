import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "iDAELİK – Online Appointment & Business Booking System",
  description: "iDAELİK helps businesses create online booking pages, manage appointments, and accept client bookings instantly. Simple, fast, and powerful scheduling system.",
  keywords: "appointment scheduling software, booking system for small business, online booking platform, business appointment management tool, online randevu sistemi, işletme randevu yazılımı, kuaför randevu sistemi, müşteri randevu platformu, online rezervasyon sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
