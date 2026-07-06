'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'EN' | 'AR' | 'TR' | 'FR';

interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  FR: {
    // Basic French translations (falling back to English for missing)
    'nav.about': 'À propos de idealik',
    'nav.contact': 'Contacter le support',
    'nav.terms': 'Conditions d\'utilisation',
    'landing.title': 'Prise de rendez-vous intelligente pour les entreprises modernes',
    'auth.signIn': 'Se connecter',
    'booking.fullName': 'Nom complet',
    'booking.email': 'Adresse e-mail',
    'booking.phone': 'Numéro de téléphone',
    'booking.submit': 'Soumettre la réservation',
    'customer.bio': 'Médecin de premier recours et conseiller médical compatissant.',
    'services.price': 'Prix',
    'services.telehealth': 'Consultation en télésanté',
  },
  EN: {
    // Header / Nav
    'nav.about': 'About idealik',
    'nav.contact': 'Contact Support',
    'nav.terms': 'Terms of Service',
    'nav.aboutDesc': 'iDAELİK is a modern appointment and business management platform designed to help small and medium-sized businesses build their digital presence and manage bookings effortlessly.',
    'nav.contactDesc': 'Contact Us support',
    'nav.contactUrl': 'www.idealnowpaa.com',
    'nav.termsAgreement': 'Terms of Service agreement',
    'nav.privacyPolicy': 'Privacy Policy',

    // Landing / Main page
    'landing.title': 'Smart Appointment Booking for Modern Businesses',
    'landing.subtitle': 'iDAELİK allows you to create your own booking page, accept appointments online or in cash, and manage your schedule easily.',
    'landing.signIn': 'Sign In',
    'landing.signUp': 'Sign Up',

    // Auth
    'auth.welcomeBack': 'Welcome Back',
    'auth.signInSubtitle': 'Sign in to access your idealik dashboard',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.signIn': 'Sign In',
    'auth.or': 'or',
    'auth.signInGoogle': 'Sign in with Google',
    'auth.createAccount': 'Create Your Account',
    'auth.registerSubtitle': 'Join idealik and grow your business',
    'auth.businessName': 'Business Name',
    'auth.phoneNumber': 'Phone Number',
    'auth.confirmPassword': 'Confirm Password',
    'auth.agreeTerms': 'I agree to the',
    'auth.termsOfService': 'Terms of Service',
    'auth.and': 'and',
    'auth.privacyPolicy': 'Privacy Policy',
    'auth.createBtn': 'Create Account',
    'auth.signUpGoogle': 'Sign up with Google',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.signUp': 'Sign up',

    // Booking Form
    'booking.fullName': 'Full Name',
    'booking.email': 'Email Address',
    'booking.phone': 'Phone Number',
    'booking.notes': 'Additional Notes (optional)',
    'booking.submit': 'Submit Booking',
    'booking.cashPayment': 'Pay Cash on Arrival',
    'booking.modalTitle': 'Complete Your Booking',
    'booking.modalSubtitle': 'Please fill in your details to confirm your appointment.',
    'booking.success': 'Booking submitted successfully!',
    'booking.selectService': 'Please select a service first',
    'booking.selectSlot': 'Please select a time slot first',

    // Schedule Config
    'schedule.slotDuration': 'Session Duration',
    'schedule.30min': '30 minutes',
    'schedule.45min': '45 minutes',
    'schedule.60min': '60 minutes',
    'schedule.custom': 'Custom',
    'schedule.customMinutes': 'Minutes',
    'schedule.exception': 'Add Exception',
    'schedule.exceptionDate': 'Exception Date',
    'schedule.exceptionReason': 'Reason',
    'schedule.recurring': 'Recurring Lock-in',
    'schedule.recurringClient': 'Client Name',
    'schedule.recurringDay': 'Day of Week',
    'schedule.recurringTime': 'Time',
    'schedule.saveConfig': 'Save Configuration',

    // Dashboard tabs
    'dashboard.profile': 'PROFILE',
    'dashboard.schedule': 'SCHEDULE',
    'dashboard.services': 'SERVICES',

    // Profile
    'profile.settings': 'Profile Settings',
    'profile.uploadPhoto': 'Upload New Photo',
    'profile.name': 'Name',
    'profile.description': 'Description',
    'profile.saveChanges': 'Save Profile Changes',

    // Services
    'services.management': 'Service Management',
    'services.addNew': 'Add New Service',
    'services.telehealth': 'Tele-Health Consultation',
    'services.telehealthDesc': 'Initial or follow-up remote medical consultation. We review symptoms, order tests, and discuss treatment plans. Call to book your virtual slot.',
    'services.diagnostic': 'Diagnostic Screen',
    'services.diagnosticDesc': 'Comprehensive diagnostic blood work and screening panels. Get key health insights and a follow-up review. Lab access included.',
    'services.prescription': 'Prescription & Plan Review',
    'services.prescriptionDesc': 'Review and management of current medications and treatment plans. Get new prescriptions and health goal check-ins.',
    'services.price': 'Price',
    'services.share': 'Share Your Schedule',
    'services.sharingLink': 'Sharing link',
    'services.copyLink': 'Copy Link',
    'services.generateQR': 'Generate New QR Code',
    'services.previewPage': 'Preview Page',

    // Schedule
    'schedule.title': 'Schedule',
    'schedule.newConfig': 'New Schedule Configuration',
    'schedule.dateRange': 'Date Range',
    'schedule.startDate': 'Start Date',
    'schedule.endDate': 'End Date',
    'schedule.minMax': 'Min. 1 day, Max. 30 days',
    'schedule.standardHours': 'Standard Hours',
    'schedule.workDayStart': 'Work Day Start',
    'schedule.workDayEnd': 'Work Day End',
    'schedule.appliedNote': 'Applied to all non-weekend days',
    'schedule.weekendSelection': 'Weekend Selection',
    'schedule.publish': 'Publish',
    'schedule.generatePublish': 'Generate & Publish Schedule',
    'schedule.editDay': 'Edit Specific Day',
    'schedule.overrideDay': 'Override Specific Day',
    'schedule.customStart': 'Custom Start',
    'schedule.customEnd': 'Custom End',
    'schedule.status': 'Status',
    'schedule.date': 'Date',
    'schedule.type': 'Type',
    'schedule.hours': 'Hours',
    'schedule.available': 'Available Appointments',
    'schedule.confirmed': 'Confirmed Appointments',
    'schedule.pending': 'Pending Appointments',

    // Customer page
    'customer.bio': 'Compassionate Primary Care Physician and Medical Advisor.',
    'customer.bioFull': 'We provide personalized health assessments and comprehensive medical plans to optimize your well-being, both in-clinic and via secure tele-health.',

    // Payment
    'payment.title': 'Secure Your Booking with Payment',
    'payment.cash': 'Cash Payment',
    'payment.card': 'Card Payment',
    'payment.cashDesc': 'To pay with cash, please contact the practitioner directly at this phone number:',
    'payment.confirmReservation': 'Confirm Reservation',
    'payment.notAvailable': 'This payment method is not available yet.',
    'payment.futureIntegration': 'Future Integration',
    'payment.cardholderName': 'Cardholder Name',
    'payment.cardNumber': 'Card Number',
    'payment.expiry': 'Expiry',
    'payment.cvc': 'CVC',
    'payment.addCardPay': 'Add Card and Pay',

    // Days
    'day.mon': 'Mon',
    'day.tue': 'Tue',
    'day.wed': 'Wed',
    'day.thu': 'Thu',
    'day.fri': 'Fri',
    'day.sat': 'Sat',
    'day.sun': 'Sun',
    'day.off': 'Off',
    'day.thursday': 'Thur',
    'day.friday': 'Fri',
    'day.saturday': 'Saturday',
    'day.sunday': 'Sunday',
    'day.monday': 'Monday',
    'day.tuesday': 'Tuesday',
    'day.wednesday': 'Wednesday',
  },
  AR: {
    'nav.about': 'حول idealik',
    'nav.contact': 'تواصل مع الدعم',
    'nav.terms': 'شروط الخدمة',
    'nav.aboutDesc': 'إن iDAELİK عبارة عن منصة حديثة لإدارة المواعيد والأعمال مصممة لمساعدة الشركات الصغيرة والمتوسطة الحجم على بناء تواجدها الرقمي وإدارة الحجوزات دون عناء.',
    'nav.contactDesc': 'تواصل معنا للدعم',
    'nav.contactUrl': 'www.idealnowpaa.com',
    'nav.termsAgreement': 'اتفاقية شروط الخدمة',
    'nav.privacyPolicy': 'سياسة الخصوصية',

    'landing.title': 'حجز موعد ذكي للشركات الحديثة',
    'landing.subtitle': 'يسمح لك iDAELİK بإنشاء صفحة حجز خاصة بك، وقبول المواعيد عبر الإنترنت أو نقدًا، وإدارة جدولك بسهولة.',
    'landing.signIn': 'تسجيل الدخول',
    'landing.signUp': 'إنشاء حساب',

    'auth.welcomeBack': 'مرحبًا بعودتك',
    'auth.signInSubtitle': 'سجل الدخول للوصول إلى لوحة idealik الخاصة بك',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.rememberMe': 'تذكرني',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.signIn': 'تسجيل الدخول',
    'auth.or': 'أو',
    'auth.signInGoogle': 'تسجيل الدخول بحساب جوجل',
    'auth.createAccount': 'إنشاء حسابك',
    'auth.registerSubtitle': 'انضم إلى idealik وقم بتنمية أعمالك',
    'auth.businessName': 'اسم الشركة',
    'auth.phoneNumber': 'رقم الهاتف',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.agreeTerms': 'أوافق على',
    'auth.termsOfService': 'شروط الخدمة',
    'auth.and': 'و',
    'auth.privacyPolicy': 'سياسة الخصوصية',
    'auth.createBtn': 'إنشاء حساب',
    'auth.signUpGoogle': 'التسجيل بحساب جوجل',
    'auth.alreadyAccount': 'هل لديك حساب بالفعل؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.signUp': 'إنشاء حساب',

    'booking.fullName': 'الاسم الكامل',
    'booking.email': 'البريد الإلكتروني',
    'booking.phone': 'رقم الهاتف',
    'booking.notes': 'ملاحظات إضافية (اختياري)',
    'booking.submit': 'إرسال الحجز',
    'booking.cashPayment': 'الدفع نقدًا عند الوصول',
    'booking.modalTitle': 'أكمل حجزك',
    'booking.modalSubtitle': 'يرجى ملء بياناتك لتأكيد موعدك.',
    'booking.success': 'تم إرسال الحجز بنجاح!',
    'booking.selectService': 'يرجى اختيار خدمة أولاً',
    'booking.selectSlot': 'يرجى اختيار موعد أولاً',

    'schedule.slotDuration': 'مدة الجلسة',
    'schedule.30min': '30 دقيقة',
    'schedule.45min': '45 دقيقة',
    'schedule.60min': '60 دقيقة',
    'schedule.custom': 'مخصص',
    'schedule.customMinutes': 'دقائق',
    'schedule.exception': 'إضافة استثناء',
    'schedule.exceptionDate': 'تاريخ الاستثناء',
    'schedule.exceptionReason': 'السبب',
    'schedule.recurring': 'حجز متكرر',
    'schedule.recurringClient': 'اسم العميل',
    'schedule.recurringDay': 'يوم الأسبوع',
    'schedule.recurringTime': 'الوقت',
    'schedule.saveConfig': 'حفظ الإعدادات',

    'dashboard.profile': 'الملف الشخصي',
    'dashboard.schedule': 'الجدول',
    'dashboard.services': 'الخدمات',

    'profile.settings': 'إعدادات الملف الشخصي',
    'profile.uploadPhoto': 'تحميل صورة جديدة',
    'profile.name': 'الاسم',
    'profile.description': 'الوصف',
    'profile.saveChanges': 'حفظ تغييرات الملف الشخصي',

    'services.management': 'إدارة الخدمات',
    'services.addNew': 'إضافة خدمة جديدة',
    'services.telehealth': 'استشارة طبية عن بُعد',
    'services.telehealthDesc': 'استشارة طبية أولية أو متابعة عن بُعد. نراجع الأعراض، ونطلب الفحوصات، ونناقش خطط العلاج.',
    'services.diagnostic': 'فحص تشخيصي',
    'services.diagnosticDesc': 'تحاليل دم تشخيصية شاملة وفحوصات. احصل على رؤى صحية رئيسية ومراجعة متابعة.',
    'services.prescription': 'مراجعة الوصفات والخطط',
    'services.prescriptionDesc': 'مراجعة وإدارة الأدوية الحالية وخطط العلاج. احصل على وصفات جديدة ومتابعة أهداف صحية.',
    'services.price': 'السعر',
    'services.share': 'شارك جدولك',
    'services.sharingLink': 'رابط المشاركة',
    'services.copyLink': 'نسخ الرابط',
    'services.generateQR': 'إنشاء رمز QR جديد',
    'services.previewPage': 'معاينة الصفحة',

    'schedule.title': 'الجدول',
    'schedule.newConfig': 'تكوين جدول جديد',
    'schedule.dateRange': 'نطاق التاريخ',
    'schedule.startDate': 'تاريخ البدء',
    'schedule.endDate': 'تاريخ الانتهاء',
    'schedule.minMax': 'الحد الأدنى يوم واحد، الحد الأقصى 30 يومًا',
    'schedule.standardHours': 'ساعات العمل القياسية',
    'schedule.workDayStart': 'بداية يوم العمل',
    'schedule.workDayEnd': 'نهاية يوم العمل',
    'schedule.appliedNote': 'مطبق على جميع أيام العمل',
    'schedule.weekendSelection': 'اختيار عطلة نهاية الأسبوع',
    'schedule.publish': 'نشر',
    'schedule.generatePublish': 'إنشاء ونشر الجدول',
    'schedule.editDay': 'تعديل يوم محدد',
    'schedule.overrideDay': 'تجاوز يوم محدد',
    'schedule.customStart': 'بداية مخصصة',
    'schedule.customEnd': 'نهاية مخصصة',
    'schedule.status': 'الحالة',
    'schedule.date': 'التاريخ',
    'schedule.type': 'النوع',
    'schedule.hours': 'الساعات',
    'schedule.available': 'مواعيد متاحة',
    'schedule.confirmed': 'مواعيد مؤكدة',
    'schedule.pending': 'مواعيد معلقة',

    'customer.bio': 'طبيب رعاية أولية ومستشار طبي متعاطف.',
    'customer.bioFull': 'نقدم تقييمات صحية مخصصة وخطط طبية شاملة لتحسين صحتك، سواء في العيادة أو عن بُعد.',

    'payment.title': 'قم بتأمين حجزك بالدفع',
    'payment.cash': 'الدفع نقدًا',
    'payment.card': 'الدفع بالبطاقة',
    'payment.cashDesc': 'للدفع نقدًا، يرجى الاتصال بالممارس مباشرة على هذا الرقم:',
    'payment.confirmReservation': 'تأكيد الحجز',
    'payment.notAvailable': 'طريقة الدفع هذه غير متوفرة بعد.',
    'payment.futureIntegration': 'تكامل مستقبلي',
    'payment.cardholderName': 'اسم حامل البطاقة',
    'payment.cardNumber': 'رقم البطاقة',
    'payment.expiry': 'تاريخ الانتهاء',
    'payment.cvc': 'CVC',
    'payment.addCardPay': 'إضافة بطاقة والدفع',

    'day.mon': 'الإثنين',
    'day.tue': 'الثلاثاء',
    'day.wed': 'الأربعاء',
    'day.thu': 'الخميس',
    'day.fri': 'الجمعة',
    'day.sat': 'السبت',
    'day.sun': 'الأحد',
    'day.off': 'إيقاف',
    'day.thursday': 'الخميس',
    'day.friday': 'الجمعة',
    'day.saturday': 'السبت',
    'day.sunday': 'الأحد',
    'day.monday': 'الإثنين',
    'day.tuesday': 'الثلاثاء',
    'day.wednesday': 'الأربعاء',
  },
  TR: {
    'nav.about': 'idealik Hakkında',
    'nav.contact': 'Destek İletişim',
    'nav.terms': 'Hizmet Şartları',
    'nav.aboutDesc': 'iDAELİK, küçük ve orta ölçekli işletmelerin dijital varlıklarını oluşturmalarına ve rezervasyonları zahmetsizce yönetmelerine yardımcı olmak için tasarlanmış modern bir randevu ve işletme yönetim platformudur.',
    'nav.contactDesc': 'Destek için bize ulaşın',
    'nav.contactUrl': 'www.idealnowpaa.com',
    'nav.termsAgreement': 'Hizmet Şartları sözleşmesi',
    'nav.privacyPolicy': 'Gizlilik Politikası',

    'landing.title': 'Modern İşletmeler İçin Akıllı Randevu Rezervasyonu',
    'landing.subtitle': 'iDAELİK, kendi rezervasyon sayfanızı oluşturmanıza, randevuları çevrimiçi veya nakit olarak kabul etmenize ve programınızı kolayca yönetmenize olanak tanır.',
    'landing.signIn': 'Giriş Yap',
    'landing.signUp': 'Kayıt Ol',

    'auth.welcomeBack': 'Tekrar Hoşgeldiniz',
    'auth.signInSubtitle': 'idealik paneline erişmek için giriş yapın',
    'auth.email': 'E-posta',
    'auth.password': 'Şifre',
    'auth.rememberMe': 'Beni hatırla',
    'auth.forgotPassword': 'Şifremi Unuttum?',
    'auth.signIn': 'Giriş Yap',
    'auth.or': 'veya',
    'auth.signInGoogle': 'Google ile giriş yap',
    'auth.createAccount': 'Hesap Oluştur',
    'auth.registerSubtitle': "idealik'e katılın ve işletmenizi büyütün",
    'auth.businessName': 'İşletme Adı',
    'auth.phoneNumber': 'Telefon Numarası',
    'auth.confirmPassword': 'Şifreyi Onayla',
    'auth.agreeTerms': 'Kabul ediyorum:',
    'auth.termsOfService': 'Hizmet Şartları',
    'auth.and': 've',
    'auth.privacyPolicy': 'Gizlilik Politikası',
    'auth.createBtn': 'Hesap Oluştur',
    'auth.signUpGoogle': 'Google ile kayıt ol',
    'auth.alreadyAccount': 'Zaten hesabınız var mı?',
    'auth.noAccount': 'Hesabınız yok mu?',
    'auth.signUp': 'Kayıt ol',

    'booking.fullName': 'Tam Adı',
    'booking.email': 'E-posta Adresi',
    'booking.phone': 'Telefon Numarası',
    'booking.notes': 'Ek Notlar (isteğe bağlı)',
    'booking.submit': 'Rezervasyonu Gönder',
    'booking.cashPayment': 'Varışta Nakit Ödeme',
    'booking.modalTitle': 'Rezervasyonunuzu Tamamlayın',
    'booking.modalSubtitle': 'Randevunuzu onaylamak için bilgilerinizi doldurun.',
    'booking.success': 'Rezervasyon başarıyla gönderildi!',
    'booking.selectService': 'Lütfen önce bir hizmet seçin',
    'booking.selectSlot': 'Lütfen önce bir zaman dilimi seçin',

    'schedule.slotDuration': 'Seans Süresi',
    'schedule.30min': '30 dakika',
    'schedule.45min': '45 dakika',
    'schedule.60min': '60 dakika',
    'schedule.custom': 'Özel',
    'schedule.customMinutes': 'Dakika',
    'schedule.exception': 'İstisna Ekle',
    'schedule.exceptionDate': 'İstisna Tarihi',
    'schedule.exceptionReason': 'Sebep',
    'schedule.recurring': 'Tekrarlayan Kilit',
    'schedule.recurringClient': 'Müşteri Adı',
    'schedule.recurringDay': 'Haftanın Günü',
    'schedule.recurringTime': 'Zaman',
    'schedule.saveConfig': 'Ayarları Kaydet',

    'dashboard.profile': 'PROFİL',
    'dashboard.schedule': 'PROGRAM',
    'dashboard.services': 'HİZMETLER',

    'profile.settings': 'Profil Ayarları',
    'profile.uploadPhoto': 'Yeni Fotoğraf Yükle',
    'profile.name': 'İsim',
    'profile.description': 'Açıklama',
    'profile.saveChanges': 'Profil Değişikliklerini Kaydet',

    'services.management': 'Hizmet Yönetimi',
    'services.addNew': 'Yeni Hizmet Ekle',
    'services.telehealth': 'Tele-Sağlık Danışmanlığı',
    'services.telehealthDesc': 'İlk veya takip uzaktan tıbbi danışmanlık. Belirtileri gözden geçirir, testler isteriz ve tedavi planlarını tartışırız.',
    'services.diagnostic': 'Tanısal Tarama',
    'services.diagnosticDesc': 'Kapsamlı tanısal kan çalışması ve tarama panelleri. Önemli sağlık bilgileri ve takip incelemesi alın.',
    'services.prescription': 'Reçete ve Plan İnceleme',
    'services.prescriptionDesc': 'Mevcut ilaçların ve tedavi planlarının gözden geçirilmesi ve yönetimi. Yeni reçeteler ve sağlık hedef takibi.',
    'services.price': 'Fiyat',
    'services.share': 'Programınızı Paylaşın',
    'services.sharingLink': 'Paylaşım linki',
    'services.copyLink': 'Linki Kopyala',
    'services.generateQR': 'Yeni QR Kodu Oluştur',
    'services.previewPage': 'Sayfayı Önizle',

    'schedule.title': 'Program',
    'schedule.newConfig': 'Yeni Program Yapılandırması',
    'schedule.dateRange': 'Tarih Aralığı',
    'schedule.startDate': 'Başlangıç Tarihi',
    'schedule.endDate': 'Bitiş Tarihi',
    'schedule.minMax': 'Min. 1 gün, Maks. 30 gün',
    'schedule.standardHours': 'Standart Çalışma Saatleri',
    'schedule.workDayStart': 'İş Günü Başlangıcı',
    'schedule.workDayEnd': 'İş Günü Bitişi',
    'schedule.appliedNote': 'Tüm hafta içi günlerine uygulanır',
    'schedule.weekendSelection': 'Hafta Sonu Seçimi',
    'schedule.publish': 'Yayınla',
    'schedule.generatePublish': 'Program Oluştur ve Yayınla',
    'schedule.editDay': 'Belirli Günü Düzenle',
    'schedule.overrideDay': 'Belirli Günü Geçersiz Kıl',
    'schedule.customStart': 'Özel Başlangıç',
    'schedule.customEnd': 'Özel Bitiş',
    'schedule.status': 'Durum',
    'schedule.date': 'Tarih',
    'schedule.type': 'Tür',
    'schedule.hours': 'Saatler',
    'schedule.available': 'Müsait Randevular',
    'schedule.confirmed': 'Onaylanan Randevular',
    'schedule.pending': 'Bekleyen Randevular',

    'customer.bio': 'Şefkatli Birinci Basamak Hekimi ve Tıbbi Danışman.',
    'customer.bioFull': 'Kişiye özel sağlık değerlendirmeleri ve kapsamlı tıbbi planlar sunuyoruz.',

    'payment.title': 'Ödeme ile Rezervasyonunuzu Güvenceye Alın',
    'payment.cash': 'Nakit Ödeme',
    'payment.card': 'Kart Ödeme',
    'payment.cashDesc': 'Nakit ödeme yapmak için lütfen doğrudan bu numaradan uygulayıcıyla iletişime geçin:',
    'payment.confirmReservation': 'Rezervasyonu Onayla',
    'payment.notAvailable': 'Bu ödeme yöntemi henüz mevcut değil.',
    'payment.futureIntegration': 'Gelecek Entegrasyon',
    'payment.cardholderName': 'Kart Sahibinin Adı',
    'payment.cardNumber': 'Kart Numarası',
    'payment.expiry': 'Son Kullanma',
    'payment.cvc': 'CVC',
    'payment.addCardPay': 'Kart Ekle ve Öde',

    'day.mon': 'Pzt',
    'day.tue': 'Sal',
    'day.wed': 'Çar',
    'day.thu': 'Per',
    'day.fri': 'Cum',
    'day.sat': 'Cmt',
    'day.sun': 'Paz',
    'day.off': 'Kapalı',
    'day.thursday': 'Perşembe',
    'day.friday': 'Cuma',
    'day.saturday': 'Cumartesi',
    'day.sunday': 'Pazar',
    'day.monday': 'Pazartesi',
    'day.tuesday': 'Salı',
    'day.wednesday': 'Çarşamba',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  const dir = language === 'AR' ? 'rtl' : 'ltr';

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language.toLowerCase());
  }, [dir, language]);

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] || translations['EN'][key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
