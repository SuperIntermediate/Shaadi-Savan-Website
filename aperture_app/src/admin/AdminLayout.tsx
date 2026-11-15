import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clapperboard,
  Compass,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  Image,
  Key,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Quote,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Quick Change Password Modal State
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/hero', label: 'Hero Manager', icon: Clapperboard },
    { to: '/admin/philosophy', label: 'Philosophy & Photo', icon: Compass },
    { to: '/admin/media', label: 'Media Library', icon: Image },
    { to: '/admin/stories', label: 'Wedding Stories', icon: BookOpen },
    { to: '/admin/services', label: 'Services', icon: Sparkles },
    { to: '/admin/chapters', label: 'Wedding Chapters', icon: Calendar },
    { to: '/admin/films', label: 'Cinematic Films', icon: Film },
    { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
    { to: '/admin/consultations', label: 'Consultations & Bookings', icon: MapPin },
    { to: '/admin/enquiries', label: 'Client Enquiries', icon: Mail },
    { to: '/admin/settings', label: 'Website Settings', icon: Settings },
  ];

  // Password Policy Checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const isUnique = Boolean(newPassword && currentPassword && newPassword !== currentPassword);
  const isMatch = Boolean(newPassword && confirmPassword && newPassword === confirmPassword);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);

    if (!isMatch) {
      setPwdMessage({ type: 'error', text: 'New passwords do not match.' });
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
        text: 'New password does not meet security requirements.',
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
      setTimeout(() => {
        setIsPwdModalOpen(false);
        setPwdMessage(null);
      }, 1500);
    } catch (err: any) {
      setPwdMessage({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12100E] text-[#F3EBDD] flex">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#171512] border-b border-[#30251F] px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/Elegant_Gold_Shaadi-Savan_Emblem_d563beae.png"
            alt="Shaadi-Savan"
            className="h-8 w-auto"
          />
          <span className="font-serif-editorial text-[18px] text-[#C6A875]">Atelier Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#F3EBDD] hover:text-[#C6A875]"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 w-64 bg-[#171512] border-r border-[#30251F] flex flex-col justify-between z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="h-20 px-6 flex items-center gap-3 border-b border-[#30251F]">
            <img
              src="/assets/aistudio/Elegant_Gold_Shaadi-Savan_Emblem_d563beae.png"
              alt="Shaadi-Savan"
              className="h-9 w-auto brightness-110"
            />
            <div>
              <h1 className="font-serif-editorial text-[19px] font-medium tracking-wide text-[#F3EBDD] leading-tight">
                SHAADI-SAVAN
              </h1>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#C6A875]">
                Studio Admin CMS
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#30251F] text-[#C6A875] border border-[#754C3D]/60 shadow-inner'
                        : 'text-[#F3EBDD]/75 hover:bg-[#30251F]/40 hover:text-[#F3EBDD]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Actions Footer */}
        <div className="p-4 border-t border-[#30251F] space-y-2 bg-[#141210]">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-medium text-[#C6A875] hover:text-[#F3EBDD] bg-[#30251F]/40 hover:bg-[#30251F] rounded-md transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#C6A875] text-[#171512] font-bold text-[11px] flex items-center justify-center shrink-0">
                SS
              </div>
              <div className="truncate">
                <p className="text-[12px] font-medium text-[#F3EBDD] truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-[#74745C] truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsPwdModalOpen(true)}
                title="Change Master Password"
                className="p-1.5 text-[#C6A875] hover:text-[#F3EBDD] hover:bg-[#30251F] rounded transition-colors"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-[#F3EBDD]/60 hover:text-red-400 hover:bg-black/30 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>

      {/* Global Quick Change Password Modal */}
      {isPwdModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#171512] border border-[#754C3D] rounded-2xl w-full max-w-lg p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#30251F]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C6A875]/15 border border-[#C6A875]/40 flex items-center justify-center text-[#C6A875]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-xl text-[#F3EBDD] font-medium">
                    Change Master Password
                  </h3>
                  <p className="text-[11px] text-[#B9AD9A]">
                    Admin Only · Requires Unique Strong Key
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPwdModalOpen(false);
                  setPwdMessage(null);
                }}
                className="text-[#B9AD9A] hover:text-[#F3EBDD] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwdMessage && (
              <div
                className={`p-3 rounded-lg text-[12.5px] flex items-center justify-between ${
                  pwdMessage.type === 'success'
                    ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/70 border border-rose-800 text-rose-300'
                }`}
              >
                <span>{pwdMessage.text}</span>
                <button onClick={() => setPwdMessage(null)} className="text-sm font-bold opacity-75">
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#B9AD9A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-9 pr-9 py-2 rounded-lg outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B9AD9A] hover:text-[#F3EBDD]"
                  >
                    {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  New Unique Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#B9AD9A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create new password"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-9 pr-9 py-2 rounded-lg outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B9AD9A] hover:text-[#F3EBDD]"
                  >
                    {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#B9AD9A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-9 pr-9 py-2 rounded-lg outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B9AD9A] hover:text-[#F3EBDD]"
                  >
                    {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Live Checklist */}
              <div className="p-3 bg-[#12100E] border border-[#30251F] rounded-lg text-[11.5px] grid grid-cols-2 gap-1.5">
                <span className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                  <CheckCircle2 className={`w-3 h-3 ${hasMinLength ? 'text-emerald-400' : 'opacity-40'}`} />
                  ≥ 8 characters
                </span>
                <span className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                  <CheckCircle2 className={`w-3 h-3 ${hasUpper ? 'text-emerald-400' : 'opacity-40'}`} />
                  Uppercase (A-Z)
                </span>
                <span className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                  <CheckCircle2 className={`w-3 h-3 ${hasLower ? 'text-emerald-400' : 'opacity-40'}`} />
                  Lowercase (a-z)
                </span>
                <span className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                  <CheckCircle2 className={`w-3 h-3 ${hasNumber ? 'text-emerald-400' : 'opacity-40'}`} />
                  Number (0-9)
                </span>
                <span className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                  <CheckCircle2 className={`w-3 h-3 ${hasSpecial ? 'text-emerald-400' : 'opacity-40'}`} />
                  Special symbol
                </span>
                <span className={`flex items-center gap-1.5 ${isUnique ? 'text-emerald-400' : 'text-[#B9AD9A]'}`}>
                  <CheckCircle2 className={`w-3 h-3 ${isUnique ? 'text-emerald-400' : 'opacity-40'}`} />
                  Unique from current
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#30251F]">
                <button
                  type="button"
                  onClick={() => setIsPwdModalOpen(false)}
                  className="px-4 py-2 bg-[#30251F]/40 hover:bg-[#30251F] text-[#B9AD9A] text-[13px] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="px-5 py-2 bg-[#C6A875] hover:bg-[#d8bc8a] text-[#171512] font-semibold text-[13px] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{pwdLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
