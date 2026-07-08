'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import GlobalLoader from '@/components/GlobalLoader';
import { useLanguage } from '@/context/LanguageContext';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Ban,
  ArrowLeft,
  Calendar,
  Shield,
  Plus,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

type SlotState = 'available' | 'booked' | 'pending' | 'unavailable';

interface Slot {
  dayIdx: number;
  timeIdx: number;
  status: SlotState;
}

const localLangs = {
  EN: {
    selectDateTime: 'Select Date & Time',
    available: 'Available',
    booked: 'Booked',
    pending: 'Pending',
    unavailable: 'Unavailable',
    safeSecure: 'Your booking is safe and secure.',
    confirmBtn: 'Confirm Reservation'
  },
  TR: {
    selectDateTime: 'Tarih ve Saat Seçin',
    available: 'Müsait',
    booked: 'Dolu',
    pending: 'Bekliyor',
    unavailable: 'Uygun Değil',
    safeSecure: 'Rezervasyonunuz güvenli ve emniyetlidir.',
    confirmBtn: 'Rezervasyonu Onayla'
  },
  AR: {
    selectDateTime: 'اختر التاريخ والوقت',
    available: 'متاح',
    booked: 'محجوز',
    pending: 'معلق',
    unavailable: 'غير متاح',
    safeSecure: 'حجزك آمن ومحمي.',
    confirmBtn: 'تأكيد الحجز'
  }
};

export default function BookingPage({ params }: { params: { phoneNumber: string } }) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { phoneNumber } = React.use(params as any) as any;
  
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{ dayIdx: number; timeIdx: number } | null>(null);

  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);

  useEffect(() => {
    if (!phoneNumber) return;
    
    fetch(`/api/practitioners/public/${phoneNumber}`)
      .then(res => {
        if (!res.ok) {
          router.push('/booking'); // Route to custom 404
        }
        return res.json();
      })
      .then(data => {
        if (data.id) {
          setProviderProfile(data);
        }
      })
      .catch(err => {
        console.error(err);
        router.push('/booking');
      })
      .finally(() => {
        setLoadingProvider(false);
      });
  }, [phoneNumber, router]);

  const loc = localLangs[language as 'EN' | 'TR' | 'AR'] || localLangs['EN'];

  const [daysOfWeek, setDaysOfWeek] = useState<{name: string, date: string, isoDate: string, fullDayName: string}[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [sessionDuration, setSessionDuration] = useState<string>('60 min');

  useEffect(() => {
    if (!providerProfile) return;

    setServices(providerProfile.services || []);

    // Fetch config & bookings & blocks
    Promise.all([
      fetch(`/api/bookings/schedule-config/${providerProfile.id}`).then(res => res.json()),
      fetch(`/api/bookings/public/bookings/${providerProfile.id}`).then(res => res.json()),
      fetch(`/api/bookings/public/exception-slots/${providerProfile.id}`).then(res => res.json()),
      fetch(`/api/bookings/public/recurring-lockins/${providerProfile.id}`).then(res => res.json())
    ]).then(([config, bookings, exceptions, recurring]) => {
      // Generate TimeSlots
      const start = config.startTime || '09:00';
      const end = config.endTime || '17:00';
      const duration = config.slotDuration || 60;
      setSessionDuration(config.sessionDuration || `${duration} min`);
      
      const newTimeSlots: string[] = [];
      const current = new Date(`2000-01-01T${start}:00`);
      const endObj = new Date(`2000-01-01T${end}:00`);
      
      while (current < endObj) {
        const h = current.getHours().toString().padStart(2, '0');
        const m = current.getMinutes().toString().padStart(2, '0');
        newTimeSlots.push(`${h}:${m}`);
        current.setMinutes(current.getMinutes() + duration);
      }
      setTimeSlots(newTimeSlots);

      // Generate DaysOfWeek
      const weekendDays = (config.weekendDays || '').toUpperCase().split(',').map((d: string) => d.trim());
      const days: {name: string, date: string, isoDate: string, fullDayName: string}[] = [];
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      let count = 0;
      
      while (count < 7 && days.length < 30) {
        const fullDayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        if (!weekendDays.includes(fullDayName.toUpperCase())) {
          const offsetDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000));
          const isoDate = offsetDate.toISOString().split('T')[0];
          days.push({
            name: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
            date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            isoDate: isoDate,
            fullDayName: fullDayName
          });
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setDaysOfWeek(days);

      // Map bookings to slots
      const newSlots: Slot[] = [];
      days.forEach((day, dIdx) => {
        newTimeSlots.forEach((time, tIdx) => {
          const isException = (exceptions || []).find((e: any) => e.date === day.isoDate && e.time === time);
          const isRecurring = (recurring || []).find((r: any) => r.dayOfWeek.toLowerCase() === day.fullDayName.toLowerCase() && r.time === time);
          const booking = bookings.find((b: any) => b.slotDate === day.isoDate && b.slotTime === time && b.status !== 'declined');
          
          if (isException || isRecurring) {
            newSlots.push({ dayIdx: dIdx, timeIdx: tIdx, status: 'unavailable' });
          } else if (booking) {
            newSlots.push({ dayIdx: dIdx, timeIdx: tIdx, status: booking.status === 'blocked' ? 'unavailable' : booking.status === 'confirmed' ? 'booked' : 'pending' });
          } else {
            newSlots.push({ dayIdx: dIdx, timeIdx: tIdx, status: 'available' });
          }
        });
      });
      setSlots(newSlots);
    }).catch(err => console.error("Error loading schedule", err));
  }, [providerProfile]);

  const handleSelectSlot = (dayIdx: number, timeIdx: number) => {
    setSelectedSlot(prev =>
      prev && prev.dayIdx === dayIdx && prev.timeIdx === timeIdx ? null : { dayIdx, timeIdx }
    );
  };

  // --- MODAL & BOOKING LOGIC ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', notes: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);



  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirmClick = () => {
    if (!selectedService) {
      showToast(t('booking.selectService'), 'error');
      return;
    }
    setShowModal(true);
  };

  const handleBookCash = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setFormError('Please fill in all required fields (Name, Email, Phone).');
      return;
    }


    
    if (!selectedSlot || !providerProfile) return;

    const dayObj = daysOfWeek[selectedSlot.dayIdx];
    const slotTime = timeSlots[selectedSlot.timeIdx];

    const bookingRequest = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
      serviceId: selectedService,
      slotDate: dayObj.isoDate,
      slotTime: slotTime,
      paymentMethod: 'cash',
      practitionerId: providerProfile.id
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingRequest)
      });
      if (res.ok) {
        setSlots(prev => prev.map(s => 
          s.dayIdx === selectedSlot.dayIdx && s.timeIdx === selectedSlot.timeIdx 
            ? { ...s, status: 'pending' } 
            : s
        ));
        showToast(t('booking.success'));
        setShowModal(false);
        setSelectedSlot(null);
      } else {
        const errorData = await res.json();
        setFormError(errorData.message || 'Failed to create booking.');
      }
    } catch (err) {
      console.error(err);
      setFormError('An error occurred. Please try again.');
    }
  };

  if (loadingProvider) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <GlobalLoader />
        </main>
        <Footer />
      </div>
    );
  }

  // Grid layout: ≤5 days fit on screen with no scroll; >5 days use fixed cols and scroll
  const gridNeedsScroll = daysOfWeek.length > 5;
  const gridColTemplate = gridNeedsScroll
    ? `minmax(36px,42px) repeat(${daysOfWeek.length}, 58px)`
    : `minmax(36px,1fr) repeat(${daysOfWeek.length}, minmax(0,1fr))`;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />

      <main className="flex-1 relative">
        <SparkleDecor />
        <div className="page-container py-10 relative z-10 animate-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ── Left: Provider Profile & Services (5 cols) ── */}
            <div className="lg:col-span-5 space-y-6">
              {/* Provider Profile */}
              <div className="text-center" id="provider-profile">
                <div className="relative inline-block mb-4">
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden mx-auto flex items-center justify-center" style={{ border: '3px solid #C2A86F', background: '#F9F9F9' }}>
                    {providerProfile?.photoUrl ? (
                      <Image src={providerProfile.photoUrl} alt={providerProfile?.businessName || "Provider"} width={120} height={120} className="w-full h-full object-cover animate-float" />
                    ) : (
                      <User className="w-16 h-16 text-primary/40 animate-float" />
                    )}
                  </div>
                  <svg className="sparkle-star" style={{ position: 'absolute', top: -8, right: 0, width: 16, height: 16 }} viewBox="0 0 24 24" fill="#C2A86F">
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
                  </svg>
                  <svg className="sparkle-star" style={{ position: 'absolute', bottom: -4, left: -16, width: 12, height: 12, animationDelay: '0.7s' }} viewBox="0 0 24 24" fill="#C2A86F">
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
                  </svg>
                </div>
                <h2 className="f-heading font-black text-2xl mb-1 text-text-main">{providerProfile?.businessName || t('customer.bio')}</h2>
                <p className="text-xs f-heading max-w-md mx-auto leading-relaxed text-text-light mb-2">{providerProfile?.description || t('customer.bioFull')}</p>
              </div>

              {/* Service Cards */}
              <div className="space-y-4" id="service-selection">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className="card flex items-start gap-4 cursor-pointer transition-all duration-200"
                    style={{
                      padding: '16px',
                      border: selectedService === svc.id ? '2px solid #C2A86F' : '2px solid transparent',
                      boxShadow: selectedService === svc.id ? '0 8px 30px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.06)'
                    }}
                    id={`booking-service-${svc.id}`}
                  >
                    <Image src={svc.photoUrl || '/telehealth.png'} alt={svc.title} width={100} height={80} className="w-[90px] h-[72px] rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="f-heading font-bold text-sm mb-1 text-text-main">{svc.title} - ${svc.price}</h3>
                      <p className="text-xs leading-relaxed text-text-muted">{svc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: User Booking Matrix (7 cols) ── */}
            <div className="lg:col-span-7 card p-4 md:p-8 min-w-0 overflow-hidden" id="schedule-matrix">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="f-heading font-extrabold text-xl md:text-2xl text-text-main">
                    {loc.selectDateTime}
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container/60 text-text-main border border-outline-variant/10">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              {/* Legend tags */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 py-4 mb-6 border-b border-surface-container">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </div>
                  <span className="text-[10px] md:text-xs f-heading font-bold text-text-muted">{loc.available}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="px-1.5 md:px-2 py-0.5 rounded bg-surface-container/80 text-text-light/50 border border-outline-variant/10 text-[9px] md:text-[10px] font-black uppercase tracking-wider select-none">
                    {loc.booked}
                  </div>
                  <span className="text-[10px] md:text-xs f-heading font-bold text-text-muted">{loc.booked}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="px-1.5 md:px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[9px] md:text-[10px] font-black uppercase tracking-wider select-none">
                    Pending
                  </div>
                  <span className="text-[10px] md:text-xs f-heading font-bold text-text-muted">{loc.pending}</span>
                </div>
              </div>


              {/* Responsive Mobile Grid Styles */}
              <style>{`
                @media (max-width: 767px) {
                  .mobile-dynamic-grid {
                    grid-template-columns: ${gridColTemplate} !important;
                  }
                }
              `}</style>

              {/* Time Grid Table */}
              {/* Mobile uses dynamic sizing. Desktop always uses min-w-[560px] and grid-cols-8 */}
              <div className="pb-2 overflow-x-auto">
                <div className={`md:min-w-[560px] ${gridNeedsScroll ? 'min-w-max' : 'min-w-full'}`}>
                  {/* Grid Headers */}
                  <div className="grid mobile-dynamic-grid md:grid-cols-8 gap-1.5 md:gap-2.5 mb-3 md:mb-4">
                    <div className="text-center font-bold text-[10px] md:text-xs uppercase text-text-light flex items-center justify-center">
                      Time
                    </div>
                    {daysOfWeek.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className="py-1.5 md:py-2 px-0.5 md:px-1 rounded-lg md:rounded-xl flex flex-col items-center justify-center bg-white"
                        style={{
                          border: '1px solid rgba(207, 197, 182, 0.3)',
                          color: '#1A1C1C'
                        }}
                      >
                        <span className="text-[10px] font-bold uppercase opacity-85 leading-none md:leading-normal">{t(`day.${day.name.toLowerCase()}`)}</span>
                        <span className="text-xs font-black mt-0.5 leading-none md:leading-normal">{day.date}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hour Rows */}
                  <div className="space-y-1.5 md:space-y-2.5">
                    {timeSlots.map((time, timeIdx) => (
                      <div
                        key={time}
                        className="grid mobile-dynamic-grid md:grid-cols-8 gap-1.5 md:gap-2.5 items-stretch"
                      >
                        {/* Time Label */}
                        <div className="flex items-center justify-center font-bold text-xs text-text-light select-none bg-surface-container/20 rounded-lg">
                          {time}
                        </div>

                        {/* Day Columns */}
                        {daysOfWeek.map((_, dayIdx) => {
                          const slot = slots.find(s => s.dayIdx === dayIdx && s.timeIdx === timeIdx);
                          const isSelected = selectedSlot?.dayIdx === dayIdx && selectedSlot?.timeIdx === timeIdx;
                          const isActiveColumn = dayIdx === activeDayIndex;

                          return (
                            <div
                              key={dayIdx}
                              className="w-full h-full min-h-[46px] rounded-xl p-1 flex items-center justify-center transition-all duration-200"
                              style={{
                                background: isActiveColumn ? 'rgba(194, 168, 111, 0.05)' : 'transparent',
                                border: isSelected ? '2px solid #C2A86F' : '2px solid transparent',
                                boxShadow: isSelected ? '0 0 0 3px rgba(194, 168, 111, 0.2)' : 'none'
                              }}
                            >
                              {slot ? (
                                slot.status === 'available' ? (
                                  <button
                                    onClick={() => handleSelectSlot(dayIdx, timeIdx)}
                                    className={`w-full h-full min-h-[38px] rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-95 duration-150 border ${isSelected
                                        ? 'bg-primary text-white border-primary-dark/20 shadow-md'
                                        : 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 shadow-sm'
                                      }`}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                ) : slot.status === 'booked' ? (
                                  <div className="w-full h-full min-h-[38px] rounded-lg bg-surface-container/70 border border-outline-variant/10 flex items-center justify-center text-text-light/40 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase select-none text-center px-0.5 leading-tight break-all md:break-words">
                                    Booked
                                  </div>
                                ) : slot.status === 'unavailable' ? (
                                  <div className="w-full h-full min-h-[38px] rounded-lg bg-neutral-200/80 border border-neutral-300/30 flex items-center justify-center text-neutral-400 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase select-none px-0.5 text-center leading-tight">
                                    <span className="hidden md:inline">{loc.unavailable}</span>
                                    <Ban className="w-4 h-4 md:hidden" />
                                  </div>
                                ) : (
                                  <div className="w-full h-full min-h-[38px] rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase select-none text-center px-0.5 leading-tight break-all md:break-words">
                                    Pending
                                  </div>
                                )
                              ) : (
                                <span className="text-text-light/25 font-bold text-xs select-none">—</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Book Button */}
              {selectedSlot && (
                <div className="mt-8 animate-fade-in">
                  <button onClick={handleConfirmClick} className="btn-gold w-full text-base py-4 shadow-md" id="proceed-booking">
                    {loc.confirmBtn}
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

      {/* Booking Intent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg relative animate-in" style={{ padding: '36px' }}>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-text-light hover:text-text-main transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="f-heading font-extrabold text-2xl text-center mb-2 text-text-main">
              {t('booking.modalTitle')}
            </h2>
            <p className="text-center text-sm text-text-light mb-8">
              {t('booking.modalSubtitle')}
            </p>

            {formError && (
              <div className="mb-6 p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200 text-center">
                {formError}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="input-wrap">
                <User className="input-icon" />
                <input
                  type="text"
                  placeholder={t('booking.fullName')}
                  className="input-field"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="input-wrap">
                <Mail className="input-icon" />
                <input
                  type="email"
                  placeholder={t('booking.email')}
                  className="input-field"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="input-wrap">
                <Phone className="input-icon" />
                <input
                  type="tel"
                  placeholder={t('booking.phone')}
                  className="input-field"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="input-wrap">
                <FileText className="input-icon" style={{ top: '24px' }} />
                <textarea
                  placeholder={t('booking.notes')}
                  className="input-field min-h-[100px] resize-y py-3"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBookCash}
                className="btn-gold flex-1 text-sm py-4 bg-amber-500 hover:bg-amber-600 shadow-md flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                {t('booking.cashPayment')}
              </button>
              <Link
                href="/payment"
                className="btn-gold flex-1 text-sm py-4 shadow-md flex items-center justify-center"
              >
                Card Payment
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Custom Toast Notification ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <div
            className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg f-heading font-semibold text-sm"
            style={{
              background: toast.type === 'success' ? '#1A1C1C' : '#BA1A1A',
              color: '#fff',
              minWidth: 280,
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#C2A86F' }} />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            )}
            {toast.message}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
