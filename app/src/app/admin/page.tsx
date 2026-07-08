'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SparkleDecor from '@/components/SparkleDecor';
import { User, Lock, Trash2, Users, EyeOff, Eye, CheckCircle, MessageSquare, Mail } from 'lucide-react';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: 'alert', title: '', message: '' });

  const showAlert = (title: string, message: string) => {
    setModal({ isOpen: true, type: 'alert', title, message });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModal({ isOpen: true, type: 'confirm', title, message, onConfirm });
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const [activeTab, setActiveTab] = useState<'users' | 'messages'>('users');
  const [practitioners, setPractitioners] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_idealik_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const fetchAdminData = async () => {
    try {
      const practitionersRes = await fetch('/api/admin/practitioners', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (practitionersRes.status === 401) {
        handleLogout();
        return;
      }
      if (practitionersRes.ok) setPractitioners(await practitionersRes.json());

      const messagesRes = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (messagesRes.ok) setMessages(await messagesRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      localStorage.setItem('admin_idealik_token', data.token);
      setToken(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePractitioner = (id: number) => {
    showConfirm(
      'Delete Practitioner',
      `Are you sure you want to delete practitioner #${id}? This action might fail if they have associated data.`,
      () => performDeletePractitioner(id)
    );
  };

  const performDeletePractitioner = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/practitioners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPractitioners(prev => prev.filter(p => p.id !== id));
        showAlert('Success', 'Practitioner deleted successfully.');
      } else {
        const data = await res.json();
        showAlert('Deletion Failed', data.message || 'Failed to delete practitioner.');
      }
    } catch (err) {
      console.error(err);
      showAlert('Error', 'An unexpected error occurred while deleting.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_idealik_token');
    setToken(null);
    setPractitioners([]);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
        <Header />
        <main className="flex-1 flex items-center justify-center relative px-4 py-16">
          <SparkleDecor />
          <div className="w-full max-w-[460px] relative z-10 animate-in card p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="f-heading font-extrabold text-2xl text-text-main mb-2">Platform Admin</h1>
              <p className="text-sm text-text-light">Sign in to manage idealik platform users</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200 text-center">
                  {error}
                </div>
              )}
              
              <div className="input-wrap">
                <User className="input-icon" />
                <input
                  type="text"
                  placeholder="Admin Username"
                  className="input-field"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrap">
                <Lock className="input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Password"
                  className="input-field"
                  style={{ paddingRight: 48 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: '#7E7669' }}
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button type="submit" className="btn-gold w-full py-4 text-base" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F9F9' }}>
      <Header />
      <main className="flex-1 relative py-10">
        <SparkleDecor />
        <div className="page-container relative z-10 animate-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
            <h1 className="f-heading font-extrabold text-2xl text-text-main flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-primary" />
              User Management Dashboard
            </h1>
            <button onClick={handleLogout} className="btn-outline text-xs px-4 py-2">
              Sign Out
            </button>
          </div>

          <div className="card p-6 min-h-[500px]">
            {/* Tabs */}
            <div className="flex border-b border-outline-variant/30 mb-6">
              <button
                className={`py-3 px-6 f-heading font-bold text-sm border-b-2 transition-colors ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text-main'}`}
                onClick={() => setActiveTab('users')}
              >
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Practitioners</div>
              </button>
              <button
                className={`py-3 px-6 f-heading font-bold text-sm border-b-2 transition-colors ${activeTab === 'messages' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text-main'}`}
                onClick={() => setActiveTab('messages')}
              >
                <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Contact Messages</div>
              </button>
            </div>

            {activeTab === 'users' ? (
              <div className="space-y-4 animate-fade-in">
                <h2 className="f-heading font-bold text-xl mb-4 text-text-main flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Registered Practitioners ({practitioners.length})
                </h2>
                {practitioners.length === 0 ? (
                  <p className="text-sm text-text-light text-center py-10">No practitioners found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/20">
                          <th className="py-3 px-4 text-xs font-extrabold text-text-light uppercase">ID</th>
                          <th className="py-3 px-4 text-xs font-extrabold text-text-light uppercase">Business Name</th>
                          <th className="py-3 px-4 text-xs font-extrabold text-text-light uppercase">Email</th>
                          <th className="py-3 px-4 text-xs font-extrabold text-text-light uppercase">Phone</th>
                          <th className="py-3 px-4 text-xs font-extrabold text-text-light uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {practitioners.map((p) => (
                          <tr key={p.id} className="border-b border-outline-variant/10 hover:bg-neutral-50 transition-colors">
                            <td className="py-3 px-4 text-sm font-bold text-text-main">#{p.id}</td>
                            <td className="py-3 px-4 text-sm text-text-main">{p.businessName || 'N/A'}</td>
                            <td className="py-3 px-4 text-sm text-text-light">{p.email}</td>
                            <td className="py-3 px-4 text-sm text-text-light">{p.phoneNumber || 'N/A'}</td>
                            <td className="py-3 px-4 text-sm text-right">
                              <button
                                onClick={() => confirmDeletePractitioner(p.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                                title="Delete Practitioner"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <h2 className="f-heading font-bold text-xl mb-4 text-text-main flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Contact Messages ({messages.length})
                </h2>
                {messages.length === 0 ? (
                  <p className="text-sm text-text-light text-center py-10">No messages found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="border border-outline-variant/30 rounded-xl p-5 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-text-main">{msg.fullName}</h3>
                            <a href={`mailto:${msg.email}`} className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline"><Mail className="w-3 h-3"/> {msg.email}</a>
                          </div>
                          <span className="text-[10px] text-text-light font-medium px-2 py-1 bg-surface-container rounded-md">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-text-light whitespace-pre-wrap bg-neutral-50 p-3 rounded-lg border border-neutral-100 mt-2">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />

      {/* Idealik Custom Prompt / Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in">
            <h3 className="f-heading text-xl font-bold text-text-main mb-2">
              {modal.title}
            </h3>
            <p className="text-text-light text-sm mb-6">
              {modal.message}
            </p>
            <div className="flex justify-end gap-3">
              {modal.type === 'confirm' && (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-bold text-text-light hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (modal.type === 'confirm' && modal.onConfirm) {
                    modal.onConfirm();
                  }
                  closeModal();
                }}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors ${
                  modal.type === 'confirm' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {modal.type === 'confirm' ? 'Delete' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
