'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Calendar,
  ChevronDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Settings,
  CalendarRange,
  Plus,
  X,
  AlertTriangle
} from 'lucide-react';

interface Appointment {
  id?: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'confirmed' | 'pending' | 'blocked';
  clientName?: string;
  email?: string;
  phone?: string;
  paymentMethod?: string;
  description?: string;
}

interface Exception {
  id?: number;
  date: string;
  time: string;
  reason: string;
}

interface RecurringLockin {
  id?: number;
  clientName: string;
  dayOfWeek: string;
  time: string;
}

const scheduleLangs = {
  EN: {
    title: 'Schedule',
    confirmed: 'Confirmed',
    pending: 'Pending (Needs Action)',
    available: 'Available',
    today: 'Today',
    clickInfo: 'Click on a pending appointment to review and confirm.',
    configBtn: 'Configure Settings',
    calendarBtn: 'View Calendar',
    modalTitle: 'Review Pending Appointment',
    modalDesc: 'Choose whether to confirm or decline this booking request.',
    confirmBtn: 'Confirm Appointment',
    declineBtn: 'Decline Request',
    cancel: 'Cancel',
    locked: 'Locked'
  },
  TR: {
    title: 'Program',
    confirmed: 'Onaylandı',
    pending: 'Bekliyor (İşlem Gerekli)',
    available: 'Müsait',
    today: 'Bugün',
    clickInfo: 'İncelemek ve onaylamak için bekleyen bir randevuya tıklayın.',
    configBtn: 'Ayarları Yapılandır',
    calendarBtn: 'Takvimi Görüntüle',
    modalTitle: 'Randevuyu İncele',
    modalDesc: 'Bu rezervasyon talebini onaylamayı veya reddetmeyi seçin.',
    confirmBtn: 'Randevuyu Onayla',
    declineBtn: 'Talebi Reddet',
    cancel: 'İptal',
    locked: 'Kilitli'
  },
  AR: {
    title: 'الجدول',
    confirmed: 'مؤكد',
    pending: 'معلق (مطلوب إجراء)',
    available: 'متاح',
    today: 'اليوم',
    clickInfo: 'انقر على موعد معلق للمراجعة والتأكيد.',
    configBtn: 'تهيئة الإعدادات',
    calendarBtn: 'عرض التقويم',
    modalTitle: 'مراجعة الموعد المعلق',
    modalDesc: 'اختر ما إذا كنت تريد تأكيد أو رفض طلب الحجز هذا.',
    confirmBtn: 'تأكيد الموعد',
    declineBtn: 'رفض الطلب',
    cancel: 'إلغاء',
    locked: 'مغلق'
  }
};

export default function ScheduleTab() {
  const { t, language } = useLanguage();
  const [showConfig, setShowConfig] = useState(false);
  const st = scheduleLangs[language as 'EN' | 'TR' | 'AR'] || scheduleLangs['EN'];

  // Configuration States
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(60); // 30, 45, 60, -1 (custom)
  const [customSlotDuration, setCustomSlotDuration] = useState(20);

  const [weekendDays, setWeekendDays] = useState<Record<string, boolean>>({
    monday: false, tuesday: false, wednesday: false, thursday: false,
    friday: false, saturday: true, sunday: true,
  });

  const toggleWeekend = (day: string) => {
    setWeekendDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  // Exceptions & Recurring
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [recurringLockins, setRecurringLockins] = useState<RecurringLockin[]>([]);
  const [confirmAction, setConfirmAction] = useState<{ message: string; onConfirm: () => void } | null>(null);
  
  const [newExcDate, setNewExcDate] = useState('');
  const [newExcTime, setNewExcTime] = useState('10:00');
  const [newExcReason, setNewExcReason] = useState('');

  const [newRecClient, setNewRecClient] = useState('');
  const [newRecDay, setNewRecDay] = useState('monday');
  const [newRecTime, setNewRecTime] = useState('10:00');

  const addException = async (dateOverride?: any, timeOverride?: any, reasonOverride?: any) => {
    // If called from onClick, dateOverride might be a MouseEvent object
    const isEvent = dateOverride && typeof dateOverride === 'object' && dateOverride.nativeEvent;
    
    const date = (!isEvent && typeof dateOverride === 'string') ? dateOverride : newExcDate;
    const time = (typeof timeOverride === 'string') ? timeOverride : newExcTime;
    const reason = (typeof reasonOverride === 'string') ? reasonOverride : (newExcReason || 'Unavailable');

    if (!date || !time) return;
    try {
      const token = localStorage.getItem('idealik_token') || localStorage.getItem('token');
      const res = await fetch('/api/bookings/exception-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ date, time, reason })
      });
      if (res.ok) {
        const data = await res.json();
        setExceptions(prev => [...prev, data]);
        if (!(!isEvent && typeof dateOverride === 'string')) { 
          setNewExcDate(''); 
          setNewExcReason(''); 
        }
      }
    } catch (err) { console.error("Failed to add exception", err); }
  };

  const removeException = async (id?: number, date?: string, time?: string) => {
    let excId = id;
    if (!excId && date && time) {
        const found = exceptions.find(e => e.date === date && e.time === time);
        if (found) excId = found.id;
    }
    if (!excId) return;
    try {
        const token = localStorage.getItem('idealik_token') || localStorage.getItem('token');
        await fetch(`/api/bookings/exception-slots/${excId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setExceptions(prev => prev.filter(e => e.id !== excId));
    } catch (err) { console.error(err); }
  };

  const addRecurring = async () => {
    if (newRecClient && newRecTime) {
      try {
        const token = localStorage.getItem('idealik_token') || localStorage.getItem('token');
        const res = await fetch('/api/bookings/recurring-lockins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ clientName: newRecClient, dayOfWeek: newRecDay, time: newRecTime })
        });
        if (res.ok) {
          const data = await res.json();
          setRecurringLockins(prev => [...prev, data]);
          setNewRecClient('');
        }
      } catch (err) { console.error("Failed to add recurring lockin", err); }
    }
  };

  const removeRecurring = async (id?: number) => {
    if (!id) return;
    try {
        const token = localStorage.getItem('idealik_token') || localStorage.getItem('token');
        await fetch(`/api/bookings/recurring-lockins/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setRecurringLockins(prev => prev.filter(r => r.id !== id));
    } catch (err) { console.error(err); }
  };

  const saveConfiguration = async () => {
    try {
        const token = localStorage.getItem('idealik_token') || localStorage.getItem('token');
        const weekendDaysStr = Object.keys(weekendDays).filter(d => weekendDays[d]).map(d => d.toUpperCase()).join(',');
        await fetch('/api/bookings/schedule-config', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                startTime: workStart,
                endTime: workEnd,
                slotDuration: slotDuration,
                customSlotDuration: customSlotDuration,
                weekendDays: weekendDaysStr
            })
        });
        setShowConfig(false);
    } catch (err) { console.error(err); }
  };

  // --- DYNAMIC 7-DAY LIFO LOGIC ---
  const daysOfWeek = useMemo(() => {
    const days = [];
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Start of today
    let count = 0;
    
    // We search ahead up to 30 days to find 7 valid working days
    while (count < 7 && days.length < 30) {
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      // If it's NOT a weekend blackout day, add it to our rolling window
      if (!weekendDays[dayName]) {
        // Format ISO date (YYYY-MM-DD) carefully avoiding timezone shift
        const offsetDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000));
        const isoDate = offsetDate.toISOString().split('T')[0];

        days.push({
          dateObj: new Date(currentDate),
          isoDate: isoDate,
          name: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
          date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDayName: dayName
        });
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  }, [weekendDays]);

  const timeSlots = useMemo(() => {
    const slots = [];
    const current = new Date(`2000-01-01T${workStart}:00`);
    const end = new Date(`2000-01-01T${workEnd}:00`);
    
    const effectiveDuration = slotDuration === -1 ? customSlotDuration : slotDuration;
    
    while (current < end) {
      const h = current.getHours().toString().padStart(2, '0');
      const m = current.getMinutes().toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
      current.setMinutes(current.getMinutes() + effectiveDuration);
    }
    return slots;
  }, [workStart, workEnd, slotDuration, customSlotDuration]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load config from backend on mount to sync work hours and weekend days
  useEffect(() => {
    const fetchConfigAndBookings = async () => {
      try {
        const token = localStorage.getItem('idealik_token') || localStorage.getItem('token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch schedule config to sync local state with backend
        const configRes = await fetch('/api/bookings/schedule-config', { headers });
        if (configRes.status === 401) {
          localStorage.removeItem('idealik_token');
          window.location.href = '/login';
          return;
        }
        if (configRes.ok) {
          const config = await configRes.json();
          // Sync work hours
          if (config.startTime) setWorkStart(config.startTime.substring(0, 5));
          if (config.endTime) setWorkEnd(config.endTime.substring(0, 5));
          if (config.slotDuration) setSlotDuration(Number(config.slotDuration));
          if (config.customSlotDuration) setCustomSlotDuration(Number(config.customSlotDuration));
          // Sync weekend days from backend (stored as "SATURDAY,SUNDAY")
          if (config.weekendDays) {
            const backendOff = config.weekendDays.toLowerCase().split(',').map((d: string) => d.trim());
            setWeekendDays(prev => {
              const next = { ...prev };
              Object.keys(next).forEach(day => { next[day] = backendOff.includes(day); });
              return next;
            });
          }
        }

        // Fetch bookings
        const bookingsRes = await fetch('/api/bookings', { headers });
        if (bookingsRes.status === 401) {
          localStorage.removeItem('idealik_token');
          window.location.href = '/login';
          return;
        }
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          const mappedAppointments = data.map((b: any) => ({
            id: b.id,
            date: b.slotDate,
            time: b.slotTime ? b.slotTime.substring(0, 5) : '', // normalize to HH:mm
            status: b.bookingStatus,
            clientName: b.clientName,
            email: b.clientEmail,
            phone: b.clientPhone,
            paymentMethod: b.paymentMethod,
            description: b.clientNotes
          }));
          // Only show non-declined appointments
          const finalAppointments = mappedAppointments.filter((a: any) => a.status !== 'declined');
          console.log("LOADED APPOINTMENTS IN SCHEDULE:", finalAppointments);
          setAppointments(finalAppointments);
        }

        // Fetch recurring lock-ins
        const recRes = await fetch('/api/bookings/recurring-lockins', { headers });
        if (recRes.ok) {
          const data = await recRes.json();
          setRecurringLockins(data);
        }

        // Fetch exception slots
        const excRes = await fetch('/api/bookings/exception-slots', { headers });
        if (excRes.ok) {
          const data = await excRes.json();
          setExceptions(data);
        }
      } catch (err) {
        console.error("Failed to fetch schedule config or bookings", err);
      }
    };
    fetchConfigAndBookings();
  }, []);

  const [activePending, setActivePending] = useState<{date: string, time: string, apt: Appointment} | null>(null);

  const handleApprove = async () => {
    if (!activePending || !activePending.apt.id) return;
    try {
      const token = localStorage.getItem('idealik_token') || localStorage.getItem('token');
      await fetch(`/api/bookings/${activePending.apt.id}/accept`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === activePending.apt.id
            ? { ...apt, status: 'confirmed' }
            : apt
        )
      );
      setActivePending(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async () => {
    if (!activePending || !activePending.apt.id) return;
    try {
      const token = localStorage.getItem('idealik_token') || localStorage.getItem('token');
      await fetch(`/api/bookings/${activePending.apt.id}/decline`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAppointments(prev =>
        prev.filter(apt => apt.id !== activePending.apt.id)
      );
      setActivePending(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getCellContent = (dateStr: string, dayName: string, timeStr: string) => {
    // Check custom exceptions
    const isException = exceptions.find(e => e.date === dateStr && e.time === timeStr);
    if (isException) return { type: 'exception', data: isException };

    // Check recurring lock-ins
    const isRecurring = recurringLockins.find(r => r.dayOfWeek === dayName && r.time === timeStr);
    if (isRecurring) return { type: 'recurring', data: isRecurring };

    // Check actual appointments
    const apt = appointments.find(a => a.date === dateStr && a.time === timeStr);
    if (apt) {
      if (apt.status === 'blocked') {
        return { type: 'exception', data: { date: apt.date, time: apt.time, reason: 'Unavailable' } };
      }
      return { type: 'appointment', data: apt };
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center gap-4">
          <h1 className="f-heading font-extrabold text-2xl text-text-main">
            {showConfig ? st.configBtn : st.title}
          </h1>
          {!showConfig && daysOfWeek.length > 0 && (
            <div className="flex items-center gap-2 bg-surface-container/50 px-3 py-1.5 rounded-lg border border-outline-variant/20">
              <button className="p-1 hover:text-primary transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-text-muted">
                {daysOfWeek[0].date} – {daysOfWeek[daysOfWeek.length-1].date}
              </span>
              <button className="p-1 hover:text-primary transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm"
          >
            {showConfig ? (
              <>
                <Calendar className="w-4 h-4" />
                {st.calendarBtn}
              </>
            ) : (
              <>
                <Settings className="w-4 h-4" />
                {st.configBtn}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {showConfig ? (
        /* Configuration View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* ── Standard Hours & Weekend ── */}
          <div className="card h-fit">
            <h2 className="f-heading font-bold text-xl mb-6 text-center text-text-main">
              {t('schedule.standardHours')}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm f-heading font-semibold mb-2 text-text-main">
                  {t('schedule.workDayStart')}
                </label>
                <div className="relative">
                  <select value={workStart} onChange={(e) => setWorkStart(e.target.value)} className="select-field text-sm h-[48px]">
                    {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-text-light" />
                </div>
              </div>
              <div>
                <label className="block text-sm f-heading font-semibold mb-2 text-text-main">
                  {t('schedule.workDayEnd')}
                </label>
                <div className="relative">
                  <select value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} className="select-field text-sm h-[48px]">
                    {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-text-light" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm f-heading font-semibold mb-2 text-text-main">
                {t('schedule.slotDuration')}
              </label>
              <div className="flex flex-col md:flex-row gap-3 md:gap-2">
                <div className="relative flex-1">
                  <select value={slotDuration} onChange={(e) => setSlotDuration(Number(e.target.value))} className="select-field text-sm h-[48px]">
                    <option value={30}>{t('schedule.30min')}</option>
                    <option value={45}>{t('schedule.45min')}</option>
                    <option value={60}>{t('schedule.60min')}</option>
                    <option value={-1}>{t('schedule.custom')}</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-text-light" />
                </div>
                {slotDuration === -1 && (
                  <div className="flex gap-2 flex-1">
                    {/* Hours Input */}
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        min="0" max="12" step="1"
                        value={Math.floor(customSlotDuration / 60)} 
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value));
                          setCustomSlotDuration(val * 60 + (customSlotDuration % 60));
                        }} 
                        className="input-field h-[48px] px-3 w-full pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-light pointer-events-none">h</span>
                    </div>
                    {/* Minutes Input */}
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        min="0" max="55" step="5"
                        value={customSlotDuration % 60} 
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value));
                          setCustomSlotDuration(Math.floor(customSlotDuration / 60) * 60 + val);
                        }} 
                        className="input-field h-[48px] px-3 w-full pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-light pointer-events-none">min</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <h3 className="f-heading font-semibold text-base mb-5 text-center text-text-main">
              {t('schedule.weekendSelection')}
            </h3>

            <div className="grid grid-cols-2 gap-3.5 mb-6">
              {[
                { key: 'monday', label: t('day.monday') },
                { key: 'tuesday', label: t('day.tuesday') },
                { key: 'wednesday', label: t('day.wednesday') },
                { key: 'thursday', label: t('day.thursday') },
                { key: 'friday', label: t('day.friday') },
                { key: 'saturday', label: t('day.saturday') },
                { key: 'sunday', label: t('day.sunday') },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all">
                  <span className="text-xs f-heading flex items-center gap-1.5 text-text-main">
                    {label}
                  </span>
                  <div className={`toggle-switch ${weekendDays[key] ? 'active' : ''}`} onClick={() => toggleWeekend(key)} />
                </div>
              ))}
            </div>

            <button onClick={saveConfiguration} className="btn-gold w-full text-sm py-3.5 mt-4">
              {t('schedule.saveConfig')}
            </button>
          </div>

          {/* ── Exceptions & Recurring ── */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="f-heading font-bold text-xl mb-6 text-center text-text-main">
                {t('schedule.recurring')}
              </h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <input type="text" placeholder={t('schedule.recurringClient')} value={newRecClient} onChange={e => setNewRecClient(e.target.value)} className="input-field input-no-icon text-xs h-[40px] px-2" />
                <select value={newRecDay} onChange={e => setNewRecDay(e.target.value)} className="select-field text-xs h-[40px] px-2 py-0">
                  <option value="monday">{t('day.mon')}</option>
                  <option value="tuesday">{t('day.tue')}</option>
                  <option value="wednesday">{t('day.wed')}</option>
                  <option value="thursday">{t('day.thu')}</option>
                  <option value="friday">{t('day.fri')}</option>
                  <option value="saturday">{t('day.sat')}</option>
                  <option value="sunday">{t('day.sun')}</option>
                </select>
                <div className="flex gap-2">
                  <input type="time" value={newRecTime} onChange={e => setNewRecTime(e.target.value)} className="input-field input-no-icon text-xs h-[40px] px-2 w-full" />
                  <button onClick={addRecurring} className="bg-primary text-white p-2 rounded-xl hover:bg-primary-dark"><Plus className="w-5 h-5"/></button>
                </div>
              </div>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {recurringLockins.map((rec, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-neutral-50 rounded-lg text-xs">
                    <span className="font-bold">{rec.clientName}</span>
                    <span>{t(`day.${rec.dayOfWeek.substring(0,3)}`)} @ {rec.time}</span>
                    <button onClick={() => removeRecurring(rec.id)} className="text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="f-heading font-bold text-xl mb-6 text-center text-text-main">
                {t('schedule.exception')}
              </h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <input type="date" value={newExcDate} onChange={e => setNewExcDate(e.target.value)} className="input-field input-no-icon text-xs h-[40px] px-2" />
                <input type="time" value={newExcTime} onChange={e => setNewExcTime(e.target.value)} className="input-field input-no-icon text-xs h-[40px] px-2" />
                <div className="flex gap-2">
                  <input type="text" placeholder={t('schedule.exceptionReason')} value={newExcReason} onChange={e => setNewExcReason(e.target.value)} className="input-field input-no-icon text-xs h-[40px] px-2 w-full" />
                  <button onClick={addException} className="bg-primary text-white p-2 rounded-xl hover:bg-primary-dark"><Plus className="w-5 h-5"/></button>
                </div>
              </div>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {exceptions.map((exc, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-neutral-50 rounded-lg text-xs">
                    <span className="font-bold">{exc.date}</span>
                    <span>{exc.time} - {exc.reason}</span>
                    <button onClick={() => removeException(exc.id)} className="text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Calendar Grid View (BUSINESS OWNER VIEW) */
        <div className="card animate-fade-in" style={{ padding: '36px 32px' }}>
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-surface-container">
            <div className="flex items-center gap-2 bg-primary/10 px-3.5 py-1.5 rounded-xl border border-primary/20">
              <Check className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs f-heading font-bold text-primary-dark">{st.confirmed}</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/20">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs f-heading font-bold text-amber-700">{st.pending}</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-100 px-3.5 py-1.5 rounded-xl border border-neutral-200">
              <span className="w-3.5 h-3.5 bg-neutral-300 rounded-sm"></span>
              <span className="text-xs f-heading font-bold text-neutral-600">{st.locked}</span>
            </div>
          </div>

          {/* Grid Scroll Area */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px] pb-4">
              {/* Day Headers row */}
              <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: `80px repeat(${daysOfWeek.length}, minmax(0, 1fr))` }}>
                <div className="text-center font-bold text-xs uppercase text-text-light flex items-center justify-center">
                  Time
                </div>
                {daysOfWeek.map((day, idx) => (
                  <div
                    key={idx}
                    className="text-center py-2.5 rounded-xl border border-outline-variant/20 flex flex-col justify-center bg-white shadow-sm"
                  >
                    <span className="text-[10px] font-bold uppercase text-text-light">{t(`day.${day.fullDayName.substring(0,3)}`)}</span>
                    <span className="text-xs font-black text-text-main mt-0.5">{day.date}</span>
                  </div>
                ))}
              </div>

              {/* Time Slots Rows */}
              <div className="space-y-3">
                {timeSlots.map((time, timeIdx) => (
                  <div key={time} className="grid gap-3 items-stretch" style={{ gridTemplateColumns: `80px repeat(${daysOfWeek.length}, minmax(0, 1fr))` }}>
                    {/* Time Label */}
                    <div className="flex items-center justify-center font-bold text-xs text-text-light select-none bg-surface-container/20 rounded-xl border border-transparent">
                      {time}
                    </div>

                    {/* Columns */}
                    {daysOfWeek.map((day, dayIdx) => {
                      const content = getCellContent(day.isoDate, day.fullDayName, time);
                      
                      if (content) {
                        if (content.type === 'appointment') {
                          const apt = content.data as Appointment;
                          if (apt.status === 'confirmed') {
                            return (
                              <div key={dayIdx} className="group relative bg-primary text-white rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 shadow-sm border border-primary-dark/10 transition-all duration-200 hover:scale-[1.02] cursor-pointer select-none overflow-hidden">
                                <div className="flex items-center gap-1 text-center group-hover:opacity-0 transition-opacity duration-200">
                                  <Check className="w-3.5 h-3.5 flex-shrink-0 text-white" />
                                  <span className="font-extrabold text-[11px] leading-tight truncate max-w-[80px] text-white">{apt.clientName || 'Client'}</span>
                                </div>
                                <span className="opacity-90 font-medium text-[9px] text-white/90 group-hover:opacity-0 transition-opacity duration-200">{time}</span>
                                
                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setConfirmAction({
                                         message: 'Cancel this confirmed booking? This action cannot be undone.',
                                         onConfirm: async () => {
                                           if (apt.id) {
                                             const token = localStorage.getItem('idealik_token') || localStorage.getItem('token');
                                             await fetch(`/api/bookings/${apt.id}/decline`, {
                                               method: 'PUT',
                                               headers: { 'Authorization': `Bearer ${token}` }
                                             });
                                           }
                                           setAppointments(prev => prev.filter(a => a.id !== apt.id));
                                           setConfirmAction(null);
                                         }
                                       });
                                     }}>
                                  <Trash2 className="w-4 h-4 text-white mb-1" />
                                  <span className="text-[9px] font-bold">Cancel</span>
                                </div>
                              </div>
                            );
                          } else {
                            // Pending State
                            return (
                              <div key={dayIdx} className="group relative bg-amber-500 text-white rounded-xl p-1 flex flex-col items-center justify-center shadow-sm border border-amber-600 transition-all duration-200 min-h-[50px] overflow-hidden">
                                <div className="flex flex-col items-center group-hover:opacity-0 transition-opacity duration-200">
                                  <Clock className="w-4 h-4 text-white mb-0.5 animate-pulse" />
                                  <span className="text-[9px] font-bold text-center leading-tight">Pending</span>
                                </div>
                                
                                {/* Inline Hover Actions for Pending */}
                                <div 
                                  className="absolute inset-0 bg-amber-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                  onClick={() => setActivePending({date: day.isoDate, time, apt})}
                                >
                                  <span className="text-[10px] font-bold text-white">Details</span>
                                </div>
                              </div>
                            );
                          }
                        } else if (content.type === 'exception') {
                           return (
                             <div key={dayIdx} className="group relative bg-neutral-200 text-neutral-500 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-inner border border-neutral-300 select-none text-[10px] font-bold text-center leading-tight overflow-hidden cursor-pointer"
                                  onClick={() => removeException((content.data as Exception).id, day.isoDate, time)}>
                               <span className="group-hover:opacity-0 transition-opacity duration-200">{(content.data as Exception).reason}</span>
                               <div className="absolute inset-0 bg-neutral-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <span className="text-[9px] font-bold text-neutral-600">Remove</span>
                               </div>
                             </div>
                           );
                        } else if (content.type === 'recurring') {
                           return (
                             <div key={dayIdx} className="bg-neutral-800 text-white rounded-xl p-2.5 flex flex-col items-center justify-center shadow-inner border border-neutral-900 select-none text-[10px] font-bold text-center leading-tight">
                               {(content.data as RecurringLockin).clientName} <br/> {st.locked}
                             </div>
                           );
                        }
                      }
                      
                      return (
                        <div key={dayIdx} className="group relative bg-surface-input border border-outline-variant/10 text-text-light/25 rounded-xl flex items-center justify-center text-xs font-bold min-h-[50px] select-none cursor-pointer overflow-hidden"
                             onClick={() => addException(day.isoDate, time, 'Unavailable')}>
                          <span className="group-hover:opacity-0 transition-opacity duration-200">—</span>
                          <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-[9px] font-bold text-neutral-600 px-1 text-center leading-tight">Mark<br/>Unavailable</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve/Decline Modal Dialog */}
      {activePending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-sm animate-in" style={{ padding: '32px' }}>
            <h3 className="f-heading font-extrabold text-lg mb-2 text-center text-text-main">
              {st.modalTitle}
            </h3>
            <p className="text-xs text-center mb-6 leading-relaxed text-text-light">
              {st.modalDesc}
              <br />
              <span className="font-bold text-primary mt-1 inline-block">
                {activePending.date} @ {activePending.time}
              </span>
            </p>

            {/* Display Booking Details for Pending Requests */}
            {activePending.apt && (
              <div className="bg-surface-container/20 border border-outline-variant/30 rounded-xl p-4 mb-6 text-left space-y-3 shadow-sm">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-semibold text-text-light">Name:</span>
                  <span className="text-sm font-bold text-text-main">{activePending.apt.clientName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-semibold text-text-light">Email:</span>
                  <span className="text-xs font-semibold text-text-main">{activePending.apt.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-semibold text-text-light">Phone:</span>
                  <span className="text-xs font-semibold text-text-main">{activePending.apt.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-semibold text-text-light">Payment:</span>
                  <span className="text-xs font-semibold text-text-main">{activePending.apt.paymentMethod || 'N/A'}</span>
                </div>
                {activePending.apt.description && (
                  <div className="pt-1">
                    <span className="text-xs font-semibold text-text-light block mb-1">Description:</span>
                    <p className="text-xs text-text-main leading-relaxed bg-white p-2 rounded-lg border border-outline-variant/20">
                      {activePending.apt.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleApprove}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-xl transition-all duration-200 text-sm cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {st.confirmBtn}
              </button>
              <button
                onClick={handleDecline}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl transition-all duration-200 text-sm cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {st.declineBtn}
              </button>
              <button
                onClick={() => setActivePending(null)}
                className="btn-outline w-full py-3 text-xs"
              >
                {st.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Custom Confirmation Modal ── */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-sm relative" style={{ padding: '32px' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(186, 26, 26, 0.1)' }}>
                <AlertTriangle className="w-7 h-7" style={{ color: '#BA1A1A' }} />
              </div>
              <h3 className="f-heading font-bold text-lg mb-3 text-text-main">Are you sure?</h3>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">{confirmAction.message}</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="btn-outline flex-1 py-3 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction.onConfirm}
                  className="flex-1 py-3 text-sm font-semibold rounded-xl text-white cursor-pointer transition-all duration-200"
                  style={{ background: '#BA1A1A' }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
