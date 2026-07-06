'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Settings, Trash2, Plus, QrCode, X, Eye, CheckCircle, AlertTriangle, User } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function ServicesTab() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [sharingLink, setSharingLink] = useState('');
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // Confirmation modal state
  const [confirmAction, setConfirmAction] = useState<{ message: string; onConfirm: () => void } | null>(null);
  
  // Password auth state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Service Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('/telehealth.png');
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('idealik_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile
        const profileRes = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (profileRes.status === 401) {
          localStorage.removeItem('idealik_token');
          window.location.href = '/login';
          return;
        }
        
        const profileData = await profileRes.json();
        setName(profileData.name || '');
        setDescription(profileData.description || '');
        setBusinessName(profileData.businessName || '');
        setPhoneNumber(profileData.phoneNumber || profileData.phone || '');
        setEmail(profileData.email || '');
        setPhotoUrl(profileData.photoUrl || '');
        setSharingLink(`${window.location.origin}/booking/${profileData.phoneNumber || profileData.phone || ''}`);

        // Fetch services
        const servicesRes = await fetch('/api/practitioners/services', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      } catch (err: any) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInstantPhotoUpload = async (newPhotoDataUrl: string) => {
    setPhotoUrl(newPhotoDataUrl);
    const token = localStorage.getItem('idealik_token');
    if (!token) return;
    try {
      const res = await fetch('/api/practitioners/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name || 'Practitioner',
          businessName,
          phone: phoneNumber,
          email,
          description,
          photoUrl: newPhotoDataUrl
        })
      });
      if (res.ok) {
        showToast('Profile photo updated instantly!');
      } else {
        showToast('Failed to save photo instantly', 'error');
      }
    } catch(err) {
      showToast('Error uploading photo', 'error');
    }
  };

  const handleInitiateSaveProfile = () => {
    setPasswordConfirm('');
    setPasswordError('');
    setShowPasswordModal(true);
  };

  const handleConfirmSaveProfile = async () => {
    if (!passwordConfirm) {
      setPasswordError('Password is required to save changes.');
      return;
    }

    const token = localStorage.getItem('idealik_token');
    if (!token) return;

    setSaveLoading(true);
    setPasswordError('');
    try {
      const userStr = localStorage.getItem('idealik_user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const currentEmail = currentUser?.email || email;

      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, password: passwordConfirm })
      });
      if (!loginRes.ok) {
        throw new Error('Incorrect password');
      }

      const res = await fetch('/api/practitioners/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name || 'Practitioner',
          businessName,
          phone: phoneNumber,
          email,
          description,
          photoUrl
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save profile');
      }
      showToast('Profile updated successfully!');
      
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('idealik_user', JSON.stringify(updatedUser));
      setSharingLink(`${window.location.origin}/booking/${phoneNumber}`);
      setShowPasswordModal(false);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const resetModal = () => {
    setEditingServiceId(null);
    setNewTitle('');
    setNewDesc('');
    setNewPrice('');
    setNewImage('/telehealth.png');
    setModalError(null);
  };

  const handleEditClick = (svc: any) => {
    setEditingServiceId(svc.id);
    setNewTitle(svc.title);
    setNewDesc(svc.description || '');
    setNewPrice(svc.price);
    setNewImage(svc.photoUrl || '/telehealth.png');
    setShowAddModal(true);
  };

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('idealik_token');
    if (!token) return;

    setModalLoading(true);
    setModalError(null);
    try {
      const isEditing = editingServiceId !== null;
      const url = isEditing 
          ? `/api/practitioners/services/${editingServiceId}` 
          : '/api/practitioners/services';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          price: parseFloat(newPrice),
          photoUrl: newImage
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'add'} service`);
      }
      
      if (isEditing) {
        setServices(prev => prev.map(s => s.id === editingServiceId ? data : s));
      } else {
        setServices(prev => [...prev, data]);
      }
      
      setShowAddModal(false);
      resetModal();
    } catch (err: any) {
      setModalError(err.message || 'Failed to save service');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteService = (serviceId: number) => {
    setConfirmAction({
      message: 'Are you sure you want to delete this service? This action cannot be undone.',
      onConfirm: async () => {
        const token = localStorage.getItem('idealik_token');
        if (!token) return;
        try {
          const res = await fetch(`/api/practitioners/services/${serviceId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to delete service');
          }
          setServices(prev => prev.filter(svc => svc.id !== serviceId));
          showToast('Service deleted successfully!');
        } catch (err: any) {
          showToast(err.message || 'Failed to delete service', 'error');
        }
        setConfirmAction(null);
      }
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharingLink);
    showToast('Booking link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 bg-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in">
      {/* ── Left: Profile Settings ── */}
      <div className="card text-center" id="profile-sidebar">
        <h2 className="f-heading font-bold text-2xl mb-8" style={{ color: '#1A1C1C' }}>
          {t('profile.settings')}
        </h2>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center" style={{ border: '3px solid #C2A86F', background: photoUrl ? 'transparent' : '#F9F9F9' }}>
              {photoUrl ? (
                <Image src={photoUrl} alt="Avatar" width={128} height={128} className="w-full h-full object-cover" />
              ) : (
                <User className="w-14 h-14 text-primary/40" />
              )}
            </div>
          </div>
          <label className="btn-outline text-sm px-6 py-2.5 mt-2 cursor-pointer">
            {t('profile.uploadPhoto')}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleInstantPhotoUpload(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200 text-left">
            {error}
          </div>
        )}

        <div className="mb-6 text-left">
          <label className="block text-base f-heading font-semibold mb-3" style={{ color: '#1A1C1C' }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field input-no-icon text-base"
          />
        </div>

        <div className="mb-6 text-left">
          <label className="block text-base f-heading font-semibold mb-3" style={{ color: '#1A1C1C' }}>Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="input-field input-no-icon text-base"
          />
        </div>

        <div className="mb-6 text-left">
          <label className="block text-base f-heading font-semibold mb-3" style={{ color: '#1A1C1C' }}>Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-field input-no-icon text-base"
          />
        </div>

        <div className="mb-8 text-left">
          <label className="block text-base f-heading font-semibold mb-3" style={{ color: '#1A1C1C' }}>{t('profile.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="input-field input-no-icon resize-none text-base"
            style={{ paddingLeft: 16 }}
          />
        </div>

        <button
          onClick={handleInitiateSaveProfile}
          className="btn-gold w-full text-base py-3.5 mt-2"
          id="save-profile-btn"
          disabled={saveLoading}
        >
          {saveLoading ? 'Processing...' : t('profile.saveChanges')}
        </button>
      </div>

      {/* ── Center: Service Management ── */}
      <div className="card lg:col-span-2" id="service-management-card">
        <div className="flex items-center justify-between mb-8">
          <h2 className="f-heading font-bold text-2xl" style={{ color: '#1A1C1C' }}>{t('services.management')}</h2>
          <button
            onClick={() => { resetModal(); setShowAddModal(true); }}
            className="btn-gold text-sm px-6 py-3 gap-2"
            id="add-service-btn"
          >
            <Plus className="w-5 h-5" />
            {t('services.addNew')}
          </button>
        </div>

        <div className="space-y-5">
          {services.length === 0 ? (
            <div className="text-center py-10 text-text-light">
              No services added yet. Click "Add New" to get started.
            </div>
          ) : (
            services.map((svc) => (
              <div
                key={svc.id}
                className="flex gap-4 p-4 rounded-xl transition-all duration-200"
                style={{ background: '#F9F9F9', border: '1px solid #E8E8E8' }}
                id={`service-card-${svc.id}`}
              >
                <Image
                  src={svc.photoUrl || '/telehealth.png'}
                  alt={svc.title}
                  width={120}
                  height={90}
                  className="w-[120px] h-[90px] rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="f-heading font-bold text-sm mb-1" style={{ color: '#1A1C1C' }}>{svc.title}</h3>
                  <p className="text-xs leading-relaxed mt-1 mb-3" style={{ color: '#4C463A' }}>{svc.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs f-heading font-semibold" style={{ color: '#1A1C1C' }}>{t('services.price')}</span>
                    <span
                      className="px-3 py-1 rounded-md text-xs f-heading font-bold"
                      style={{ border: '1px solid #CFC5B6', color: '#1A1C1C', background: '#fff' }}
                    >
                      ${svc.price}
                    </span>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="flex flex-col items-center justify-center gap-3 flex-shrink-0 pl-2 border-l border-gray-200 ml-2">
                  <button 
                    onClick={() => handleEditClick(svc)} 
                    className="p-2.5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:text-primary transition-all shadow-sm cursor-pointer" 
                    title="Edit Service"
                    style={{ color: '#7E7669' }}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(svc.id)}
                    className="p-2.5 bg-white rounded-xl border border-gray-200 hover:border-red-500 hover:text-red-500 transition-all shadow-sm cursor-pointer"
                    title="Delete Service"
                    style={{ color: '#7E7669' }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Share Your Schedule ── */}
      <div className="card text-center" id="share-schedule-card">
        <h2 className="f-heading font-bold text-xl mb-6" style={{ color: '#1A1C1C' }}>
          {t('services.share')}
        </h2>

        <div className="flex justify-center mb-6">
          <div
            className="w-52 h-52 rounded-xl flex items-center justify-center bg-white p-4"
            style={{ border: '2px dashed #CFC5B6' }}
          >
            {phoneNumber ? (
              <QRCode 
                value={sharingLink} 
                size={160} 
                style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                level="H" 
                fgColor="#1A1C1C"
              />
            ) : (
              <QrCode className="w-36 h-36" style={{ color: '#CFC5B6' }} />
            )}
          </div>
        </div>

        <p className="text-sm f-heading font-semibold mb-2" style={{ color: '#1A1C1C' }}>{t('services.sharingLink')}</p>
        <div className="rounded-lg py-3 px-4 mb-6" style={{ background: '#F2F2F2' }}>
          <p className="text-xs f-heading break-all" style={{ color: '#4C463A' }}>{sharingLink}</p>
        </div>

        <div className="space-y-3">
          <a
            href={sharingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full"
            id="preview-page-btn"
          >
            <Eye className="w-5 h-5" />
            {t('services.previewPage')}
          </a>
          <button onClick={handleCopyLink} className="btn-gold w-full" id="copy-link-btn">{t('services.copyLink')}</button>
          <button onClick={() => window.print()} className="btn-gold w-full" id="print-qr-btn">Print QR code</button>
        </div>
      </div>

      {/* Add Service Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in animate-in">
          <div className="card w-full max-w-md animate-in relative" style={{ padding: '32px' }}>
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-text-light hover:text-text-main cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="f-heading font-bold text-xl mb-6 text-text-main text-center">
              {editingServiceId ? 'Edit Service' : t('services.addNew')}
            </h3>

            {modalError && (
              <div className="mb-4 p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmitService} className="space-y-4 text-left">
              <div>
                <label className="block text-xs f-heading font-semibold mb-2 text-text-main">Service Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="input-field input-no-icon text-sm h-[46px]"
                  placeholder="e.g. Telehealth Consultation (Optional)"
                />
              </div>

              <div>
                <label className="block text-xs f-heading font-semibold mb-2 text-text-main">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="input-field input-no-icon text-sm resize-none"
                  rows={3}
                  placeholder="Briefly describe the service (Optional)..."
                  style={{ paddingLeft: 16 }}
                />
              </div>

              <div>
                <label className="block text-xs f-heading font-semibold mb-2 text-text-main">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="input-field input-no-icon text-sm h-[46px]"
                  placeholder="e.g. 120.00"
                  required
                />
              </div>

              <div>
                <label className="block text-xs f-heading font-semibold mb-2 text-text-main">Service Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setNewImage('/telehealth.png');
                    }
                  }}
                  className="input-field input-no-icon text-sm h-[46px] w-full p-2 border rounded-xl"
                  style={{ background: '#fff' }}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetModal(); }}
                  className="btn-outline flex-1 py-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold flex-1 py-3 text-xs"
                  disabled={modalLoading}
                >
                  {modalLoading ? 'Saving...' : (editingServiceId ? 'Save Changes' : 'Add Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Password Confirmation Modal Dialog */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md animate-in relative" style={{ padding: '32px' }}>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-text-light hover:text-text-main transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="f-heading font-bold text-xl mb-4 text-text-main text-center">
              Confirm Password
            </h3>
            <p className="text-sm text-text-muted text-center mb-6">
              Please enter your password to authorize these profile changes.
            </p>

            {passwordError && (
              <div className="mb-6 p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200 text-center">
                {passwordError}
              </div>
            )}

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs f-heading font-semibold mb-2 text-text-main">Password</label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="input-field input-no-icon text-sm h-[46px]"
                  placeholder="Enter your password"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-outline flex-1 py-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSaveProfile}
                  className="btn-gold flex-1 py-3 text-xs"
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Verifying...' : 'Confirm'}
                </button>
              </div>
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
                  Delete
                </button>
              </div>
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
    </div>
  );
}
