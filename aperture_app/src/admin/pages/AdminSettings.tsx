import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Instagram,
  Key,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Share2,
  ShieldCheck,
  Sparkles,
  Upload,
  Youtube,
} from 'lucide-react';

interface SettingsData {
  brandName: string;
  tagline: string;
  logoUrl: string;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  instagramUrl: string;
  youtubeUrl: string;
  locations: string;
  bookingHeadline?: string;
  bookingDescription?: string;
  calendarStatus?: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
}

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    brandName: '',
    tagline: '',
    logoUrl: '',
    contactEmail: '',
    phone: '',
    whatsapp: '',
    instagramUrl: '',
    youtubeUrl: '',
    locations: '',
    bookingHeadline: '',
    bookingDescription: '',
    calendarStatus: '',
    seoTitle: '',
    seoDescription: '',
    ogImageUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await api.admin.getSettings();
        if (data) {
          setSettings(data);
        }
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to load settings' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.admin.updateSettings(settings);
      setMessage({ type: 'success', text: 'Brand settings & SEO saved successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', 'Brand Emblem');
    formData.append('category', 'Brand');

    try {
      const res = await api.admin.uploadMedia(formData);
      setSettings((prev) => ({ ...prev, logoUrl: res.mediaUrl }));
      setMessage({ type: 'success', text: 'Brand logo uploaded' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Upload failed' });
    }
  };

  // Password Validation Metrics
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const isUnique = Boolean(newPassword && currentPassword && newPassword !== currentPassword);
  const isMatch = Boolean(newPassword && confirmPassword && newPassword === confirmPassword);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);

    if (!isMatch) {
      setPwdMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (!isUnique) {
      setPwdMessage({
        type: 'error',
        text: 'The new password must be unique and cannot match your current password.',
      });
      return;
    }

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setPwdMessage({
        type: 'error',
        text: 'New password does not meet the security policy requirements.',
      });
      return;
    }

    try {
      setPwdLoading(true);
      const res = await api.auth.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPwdMessage({
        type: 'success',
        text: res.message || 'Master password updated successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdMessage({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#30251F]">
        <div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl text-[#F3EBDD] font-medium">
            Atelier Brand & Website Settings
          </h1>
          <p className="text-[13px] text-[#B9AD9A] mt-1">
            Global identity, studio coordinates, social channels, SEO metadata, and master security
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-[13px] flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-sm font-bold opacity-75 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#B9AD9A]">Loading atelier settings...</div>
      ) : (
        <>
          <form onSubmit={handleSave} className="space-y-8">
            {/* Identity & Emblem */}
            <div className="bg-[#171512] border border-[#30251F] rounded-xl p-6 space-y-5">
              <h2 className="font-serif-editorial text-xl text-[#F3EBDD] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C6A875]" />
                <span>Identity & Emblem</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={settings.brandName}
                    onChange={handleChange}
                    placeholder="SHAADI-SAVAN"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none tracking-wider font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Core Brand Statement / Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={settings.tagline}
                    onChange={handleChange}
                    placeholder="Every wedding has a story. Let yours live forever."
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Logo Emblem Uploader */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1.5">
                  Brand Emblem / Signature Logo
                </label>
                <div className="flex items-center gap-4 bg-[#12100E] p-3 rounded-lg border border-[#30251F]">
                  {settings.logoUrl && (
                    <img
                      src={settings.logoUrl}
                      alt="Emblem"
                      className="h-12 w-auto object-contain bg-black/40 p-1 rounded border border-[#30251F]"
                    />
                  )}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      name="logoUrl"
                      value={settings.logoUrl}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 text-[#F3EBDD] text-[12px] p-0 outline-none font-mono"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1 bg-[#30251F] text-[#F3EBDD] text-[11px] font-medium rounded cursor-pointer hover:bg-[#43332a] transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#C6A875]" />
                      <span>Upload New Emblem</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Studio Coordinates */}
            <div className="bg-[#171512] border border-[#30251F] rounded-xl p-6 space-y-5">
              <h2 className="font-serif-editorial text-xl text-[#F3EBDD] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C6A875]" />
                <span>Studio Coordinates & Contact</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Enquiry Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#B9AD9A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      placeholder="studio@shaadisavan.com"
                      className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-9 pr-3 py-2 rounded-lg outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Studio Phone Line
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#B9AD9A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="phone"
                      value={settings.phone}
                      onChange={handleChange}
                      placeholder="+91 98200 11223"
                      className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-9 pr-3 py-2 rounded-lg outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    WhatsApp Direct Number
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="whatsapp"
                      value={settings.whatsapp}
                      onChange={handleChange}
                      placeholder="+919820011223 (with country code)"
                      className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-9 pr-3 py-2 rounded-lg outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Studio Headquarters / Outposts
                  </label>
                  <input
                    type="text"
                    name="locations"
                    value={settings.locations}
                    onChange={handleChange}
                    placeholder="Colaba Atelier, Mumbai & Lake Pichola, Udaipur"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Consultations Calendar / Season Status
                  </label>
                  <input
                    type="text"
                    name="calendarStatus"
                    value={settings.calendarStatus || ''}
                    onChange={handleChange}
                    placeholder="2026 Season: Limited Fall & Winter dates available."
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Instagram Profile URL
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="instagramUrl"
                      value={settings.instagramUrl}
                      onChange={handleChange}
                      placeholder="https://instagram.com/shaadisavan"
                      className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-9 pr-3 py-2 rounded-lg outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    YouTube Channel URL
                  </label>
                  <div className="relative">
                    <Youtube className="w-4 h-4 text-red-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="youtubeUrl"
                      value={settings.youtubeUrl}
                      onChange={handleChange}
                      placeholder="https://youtube.com/@shaadisavan"
                      className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-9 pr-3 py-2 rounded-lg outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Engine Optimization */}
            <div className="bg-[#171512] border border-[#30251F] rounded-xl p-6 space-y-5">
              <h2 className="font-serif-editorial text-xl text-[#F3EBDD] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C6A875]" />
                <span>SEO & OpenGraph Share Cards</span>
              </h2>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Meta SEO Title
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={settings.seoTitle}
                  onChange={handleChange}
                  placeholder="Shaadi-Savan — Cinematic Wedding Photography & Films"
                  className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Meta SEO Description
                </label>
                <textarea
                  rows={3}
                  name="seoDescription"
                  value={settings.seoDescription}
                  onChange={handleChange}
                  placeholder="Documentary wedding photography and heirloom cinema capturing authentic Indian celebrations..."
                  className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none resize-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#C6A875] hover:bg-[#d8bc8a] text-[#171512] font-semibold text-[14px] rounded-lg transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Brand Settings'}</span>
              </button>
            </div>
          </form>

          {/* ============================================================== */}
          {/* Dedicated Admin Master Password & Security Panel */}
          {/* ============================================================== */}
          <div id="security" className="pt-6 border-t border-[#30251F]">
            <div className="bg-[#171512] border border-[#754C3D] rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#30251F]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C6A875]/15 border border-[#C6A875]/40 flex items-center justify-center text-[#C6A875]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif-editorial text-2xl text-[#F3EBDD] font-medium">
                      Admin Security & Master Password
                    </h2>
                    <p className="text-[12px] text-[#B9AD9A] mt-0.5">
                      Change the master sign-in password. Only accessible to authenticated administrators.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded bg-[#30251F] text-[#C6A875] text-[11px] font-mono border border-[#754C3D]/40">
                  Protected Endpoint
                </span>
              </div>

              {pwdMessage && (
                <div
                  className={`p-3.5 rounded-lg text-[13px] flex items-center justify-between ${
                    pwdMessage.type === 'success'
                      ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/70 border border-rose-800 text-rose-300'
                  }`}
                >
                  <span>{pwdMessage.text}</span>
                  <button
                    onClick={() => setPwdMessage(null)}
                    className="text-sm font-bold opacity-75 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1.5">
                    Current Master Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#B9AD9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter existing password"
                      className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-10 pr-10 py-2.5 rounded-lg outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B9AD9A] hover:text-[#F3EBDD]"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* New Password */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1.5">
                      New Unique Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-[#B9AD9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNew ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Create strong new password"
                        className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-10 pr-10 py-2.5 rounded-lg outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B9AD9A] hover:text-[#F3EBDD]"
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-[#B9AD9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-10 pr-10 py-2.5 rounded-lg outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B9AD9A] hover:text-[#F3EBDD]"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Policy & Uniqueness Checklist */}
                <div className="p-4 bg-[#12100E] border border-[#30251F] rounded-lg space-y-2">
                  <span className="text-[11px] font-mono text-[#C6A875] uppercase tracking-wider block">
                    Security Policy Checklist:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                    <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-400' : 'opacity-40'}`} />
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${hasUpper ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasUpper ? 'text-emerald-400' : 'opacity-40'}`} />
                      <span>At least 1 uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${hasLower ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasLower ? 'text-emerald-400' : 'opacity-40'}`} />
                      <span>At least 1 lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-400' : 'opacity-40'}`} />
                      <span>At least 1 number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${hasSpecial ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasSpecial ? 'text-emerald-400' : 'opacity-40'}`} />
                      <span>At least 1 special character (!@#$)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isUnique ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isUnique ? 'text-emerald-400' : 'opacity-40'}`} />
                      <span>Must be unique (different from current)</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="px-6 py-2.5 bg-[#C6A875] hover:bg-[#d8bc8a] text-[#171512] font-semibold text-[13px] rounded-lg transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    <Key className="w-4 h-4" />
                    <span>{pwdLoading ? 'Updating Master Password...' : 'Update Master Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
