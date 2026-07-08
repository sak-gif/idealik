'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />
      <main className="flex-1 relative bg-bg-main overflow-x-hidden">
        {/* --- HOME SECTION --- */}
        <section id="home" className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-32 overflow-hidden bg-gradient-to-b from-white to-[#F9F9F9]">
          {/* Subtle Background Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-0 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1A1C1C]/5 rounded-full blur-3xl -z-0"></div>
          
          <SparkleDecor />
          
          <div className="page-container relative z-10 px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left animate-in" style={{ animationDelay: '0.1s' }}>
              
              <h1
                className="f-heading font-extrabold leading-tight tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#1A1C1C] to-[#4C463A]"
                style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
              >
                {t('landing.title')}
              </h1>
              
              <p
                className="f-heading mb-10 max-w-xl"
                style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: '#7E7669', lineHeight: '1.6' }}
              >
                {t('landing.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/login" className="btn-gold min-w-[200px] text-base px-8 py-4 shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group" id="cta-sign-in">
                  {t('landing.signIn')}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
                <Link href="/register" className="btn-outline min-w-[200px] text-base px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2" id="cta-sign-up">
                  {t('landing.signUp')}
                </Link>
              </div>
            </div>

            {/* Right Abstract Visuals */}
            <div className="relative hidden lg:flex items-center justify-center h-full animate-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-full max-w-[500px] aspect-square">
                {/* Main Dashboard Card Mockup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[80%] bg-white rounded-3xl shadow-2xl border border-outline-variant/30 p-6 flex flex-col gap-4 z-20 hover:-translate-y-6 transition-transform duration-500">
                  {/* Mock Header */}
                  <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <div className="w-24 h-3 bg-neutral-200 rounded-full mb-1"></div>
                        <div className="w-16 h-2 bg-neutral-100 rounded-full"></div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-100"></div>
                  </div>
                  {/* Mock Content rows */}
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="flex items-center justify-between p-3 rounded-xl bg-surface-container/30 border border-outline-variant/10">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                        <div>
                          <div className="w-20 h-2.5 bg-neutral-300 rounded-full mb-1.5"></div>
                          <div className="w-12 h-2 bg-neutral-200 rounded-full"></div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold">Confirmed</div>
                    </div>
                  ))}
                </div>

                {/* Floating Element 1 - Notification */}
                <div className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl border border-outline-variant/20 z-30 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A1C1C]">New Booking</div>
                      <div className="text-[10px] text-text-light">Just now</div>
                    </div>
                  </div>
                </div>

                {/* Floating Element 2 - Service */}
                <div className="absolute -left-12 bottom-24 bg-white p-3 rounded-2xl shadow-xl border border-outline-variant/20 z-30 animate-float" style={{ animationDelay: '1.2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200"></div>
                    <div>
                      <div className="text-xs font-bold text-[#1A1C1C] mb-1">Consultation</div>
                      <div className="text-xs font-extrabold text-primary">$120.00</div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[radial-gradient(#C2A86F_2px,transparent_2px)] [background-size:16px_16px] opacity-20 z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* --- ABOUT US SECTION --- */}
        <section id="about" className="py-24 bg-white relative">
          <div className="page-container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="f-heading font-extrabold text-4xl mb-6" style={{ color: '#1A1C1C' }}>About Us</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#4C463A' }}>
                At iDAELİK, our mission is to seamlessly connect wellness and professional service practitioners with their clients. 
                We understand the unique challenges professionals face in managing their schedules while ensuring a top-tier customer experience.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: '#4C463A' }}>
                Built with simplicity and elegance in mind, our platform eliminates the friction of traditional booking systems. 
                We empower you with dynamic mobile-first scheduling, secure authentication, and instant notifications, allowing you to focus on what you do best: providing exceptional service.
              </p>
            </div>
          </div>
        </section>

        {/* --- TERMS AND CONDITIONS SECTION --- */}
        <section id="terms" className="py-24" style={{ background: '#F9F9F9' }}>
          <div className="page-container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-outline-variant/30">
              <h2 className="f-heading font-extrabold text-3xl mb-8" style={{ color: '#1A1C1C' }}>Terms & Conditions</h2>
              <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#4C463A' }}>
                <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
                <p>Welcome to iDAELİK. By accessing or using our platform, you agree to be bound by these Terms & Conditions. Please read them carefully.</p>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>1. General Provisions</h3>
                  <p>1.1. iDAELİK operates as a software-as-a-service (SaaS) platform providing scheduling and booking solutions for independent professionals and their clients.</p>
                  <p>1.2. By registering an account or making a booking, you confirm that you are at least 18 years of age and capable of entering into a legally binding agreement.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>2. Practitioner Accounts & Responsibilities</h3>
                  <p>2.1. <strong>Accuracy of Information:</strong> Professionals utilizing our platform to offer services must ensure that all service details, availability, and pricing are accurate and up-to-date.</p>
                  <p>2.2. <strong>Service Fulfillment:</strong> iDAELİK provides the scheduling software but is not a party to the service agreement between the practitioner and the client. The practitioner holds sole responsibility for the quality, safety, and delivery of their services.</p>
                  <p>2.3. <strong>Account Security:</strong> You are responsible for safeguarding your login credentials. Any activity occurring under your account is your responsibility.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>3. Booking & Cancellations (Clients)</h3>
                  <p>3.1. <strong>Making Reservations:</strong> Clients must provide a valid email address and phone number for SMS authentication and notifications to finalize a booking.</p>
                  <p>3.2. <strong>Practitioner Discretion:</strong> Practitioners reserve the right to accept, decline, or reschedule any pending booking request based on their professional discretion and availability.</p>
                  <p>3.3. <strong>Cancellations:</strong> Clients must communicate cancellations directly with the respective practitioner within the timeframe established by that practitioner's individual policies.</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>4. Acceptable Use Policy</h3>
                  <p>4.1. You agree not to misuse the iDAELİK platform. This includes, but is not limited to: submitting false information, attempting to breach security measures (e.g., OTP bypassing), engaging in fraudulent bookings, or using the platform to transmit malicious code.</p>
                  <p>4.2. We reserve the right to suspend or terminate accounts that violate our acceptable use policy without prior notice.</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>5. Limitation of Liability</h3>
                  <p>5.1. iDAELİK is provided on an "as is" and "as available" basis. We do not warrant that the service will be uninterrupted, error-free, or completely secure.</p>
                  <p>5.2. In no event shall iDAELİK, its directors, employees, or partners be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the platform, including lost profits or loss of data.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>6. Modifications to Terms</h3>
                  <p>We reserve the right to modify these terms at any time. Significant changes will be communicated via email or platform notification. Continued use of the platform following modifications constitutes your acceptance of the revised Terms and Conditions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PRIVACY AND POLICY SECTION --- */}
        <section id="privacy" className="py-24 bg-white">
          <div className="page-container mx-auto px-6">
            <div className="max-w-4xl mx-auto p-10 md:p-14 border border-outline-variant/20 rounded-3xl bg-surface-container/5 shadow-sm">
              <h2 className="f-heading font-extrabold text-3xl mb-8" style={{ color: '#1A1C1C' }}>Privacy Policy</h2>
              <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#4C463A' }}>
                <p><strong>Effective Date: {new Date().toLocaleDateString()}</strong></p>
                <p>
                  At iDAELİK, safeguarding your privacy and protecting your personal data is our highest priority. This comprehensive Privacy Policy outlines our practices regarding the collection, use, processing, and disclosure of your information when you access or use our platform.
                </p>
                
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>1. Information We Collect</h3>
                  <p>1.1. <strong>Account Information:</strong> When a practitioner registers on iDAELİK, we collect their business name, full name, email address, phone number, and professional details (services, pricing, schedules).</p>
                  <p>1.2. <strong>Client Booking Data:</strong> When a client creates a booking, we collect their full name, email address, phone number, and any optional notes. This is necessary to confirm the appointment.</p>
                  <p>1.3. <strong>Authentication Data:</strong> We utilize Firebase Phone Authentication. Consequently, phone numbers and verification codes (OTPs) are securely processed to verify user identity and prevent fraud.</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>2. How We Use Your Information</h3>
                  <p>We use the collected information strictly for the following purposes:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>To facilitate and manage scheduling and bookings between clients and practitioners.</li>
                    <li>To deliver critical transactional communications, such as booking confirmations, cancellations, and OTP authentication SMS messages.</li>
                    <li>To provide customer support and respond to inquiries.</li>
                    <li>To maintain the security and integrity of our platform and prevent unauthorized access.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>3. Information Sharing & Disclosure</h3>
                  <p>3.1. <strong>Between Users:</strong> Client contact information and booking details are shared exclusively with the specific practitioner the client has booked with, to enable service delivery.</p>
                  <p>3.2. <strong>Third-Party Service Providers:</strong> We employ trusted third-party providers for hosting (Render, Aiven MySQL) and authentication/SMS services (Firebase, Twilio). These providers are bound by strict data processing agreements and are only permitted to use your data as necessary to provide these services to iDAELİK.</p>
                  <p>3.3. <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law, court order, or governmental request.</p>
                  <p className="mt-2 font-bold text-[#1A1C1C]">iDAELİK strictly does not sell, rent, or trade your personal data to marketing agencies or any external third parties.</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>4. Data Security & Retention</h3>
                  <p>4.1. <strong>Security Measures:</strong> We implement rigorous technical and organizational measures to protect your data. This includes secure HTTPS encryption, password hashing, and restricted database access.</p>
                  <p>4.2. <strong>Retention:</strong> We retain your personal data only for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements.</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1C1C' }}>5. Your Data Rights</h3>
                  <p>Depending on your location, you have the right to:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Access the personal data we hold about you.</li>
                    <li>Request corrections to inaccurate or incomplete data.</li>
                    <li>Request the deletion of your account and associated data ("Right to be Forgotten").</li>
                    <li>Opt-out of non-essential communications.</li>
                  </ul>
                  <p className="mt-2">To exercise these rights, practitioners may use their dashboard settings, and clients may contact us at privacy@idealik.com.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CONTACT US SECTION --- */}
        <section id="contact" className="py-24" style={{ background: '#F9F9F9' }}>
          <div className="page-container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="f-heading font-extrabold text-4xl mb-4" style={{ color: '#1A1C1C' }}>Contact Us</h2>
                <p className="text-lg" style={{ color: '#7E7669' }}>Have questions? We'd love to hear from you.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Contact Info */}
                <div className="bg-surface-container/20 p-8 rounded-3xl border border-outline-variant/30 h-full flex flex-col justify-center">
                  <h3 className="f-heading font-bold text-2xl mb-8" style={{ color: '#1A1C1C' }}>Get in Touch</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: '#1A1C1C' }}>Headquarters</h4>
                        <p className="text-sm leading-relaxed" style={{ color: '#7E7669' }}>123 Innovation Drive<br/>Tech District, Istanbul 34000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: '#1A1C1C' }}>Email Us</h4>
                        <p className="text-sm" style={{ color: '#7E7669' }}>support@idealik.com<br/>partners@idealik.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1" style={{ color: '#1A1C1C' }}>Call Us</h4>
                        <p className="text-sm" style={{ color: '#7E7669' }}>+90 555 012 3456<br/>Mon-Fri, 9am-6pm</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="card p-8 shadow-xl border border-outline-variant/20">
                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Thank you for reaching out! We will get back to you soon.'); }}>
                    <div>
                      <label className="block text-xs f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>Full Name</label>
                      <input type="text" className="input-field input-no-icon w-full px-4" placeholder="Jane Doe" required />
                    </div>
                    <div>
                      <label className="block text-xs f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>Email Address</label>
                      <input type="email" className="input-field input-no-icon w-full px-4" placeholder="jane@example.com" required />
                    </div>
                    <div>
                      <label className="block text-xs f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>Message</label>
                      <textarea className="input-field input-no-icon w-full px-4 py-3 resize-none min-h-[120px]" placeholder="How can we help you?" required></textarea>
                    </div>
                    <button type="submit" className="btn-gold w-full py-4 mt-2">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
