import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.token) {
        login(res.token, res.admin);
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12100E] text-[#F3EBDD] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C6A875]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[440px] bg-[#171512] border border-[#754C3D]/40 p-8 sm:p-10 rounded-2xl shadow-2xl z-10">
        <div className="text-center mb-8">
          <img
            src="/assets/aistudio/Elegant_Gold_Shaadi-Savan_Emblem_d563beae.png"
            alt="Shaadi-Savan"
            className="h-12 w-auto mx-auto mb-4 brightness-125"
          />
          <h1 className="font-serif-editorial text-[28px] font-medium tracking-wide text-[#F3EBDD]">
            Shaadi-Savan
          </h1>
          <p className="text-[12px] tracking-[0.1em] uppercase text-[#C6A875] mt-1">
            Private Atelier CMS Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-950/60 border border-red-800/60 text-red-200 text-[13px] rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#C6A875] mb-2">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shaadisavan.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/50 border border-[#754C3D]/50 text-white placeholder-neutral-600 focus:border-[#C6A875] focus:outline-none text-[14px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#C6A875] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/50 border border-[#754C3D]/50 text-white placeholder-neutral-600 focus:border-[#C6A875] focus:outline-none text-[14px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#30251F]/30 border border-[#754C3D]/30 rounded-lg text-[11px] text-[#B9AD9A]/80 flex items-center justify-between">
            <span>Restricted studio access.</span>
            <span className="font-mono text-[#C6A875]">TLS 256-Bit Encrypted</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[14px] hover:bg-[#D5B988] transition-colors cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#30251F] text-center text-[12px] text-neutral-500">
          <p>© 2026 Shaadi-Savan Atelier. Protected Portal.</p>
        </div>
      </div>
    </div>
  );
};
