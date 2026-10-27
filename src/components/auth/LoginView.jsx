import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState('akhtar.ali@workpulse.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState('Operations & Growth Specialist');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    onLogin({
      name: 'Akhtar Ali',
      email: email.trim(),
      role: role,
      avatar: 'AA',
      organization: 'Time Global Tech Lead',
      loginTime: new Date().toISOString()
    });
  };

  const handleQuickLogin = (selectedRole = 'Operations & Growth Specialist') => {
    onLogin({
      name: 'Akhtar Ali',
      email: 'akhtar.ali@workpulse.io',
      role: selectedRole,
      avatar: 'AA',
      organization: 'Time Global Tech Lead',
      loginTime: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10 space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <BrandLogo size="lg" isOnline={true} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <span>WorkPulse</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Hub v2.4
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Social Media, Recruiting &amp; Client Deliverables Hub
            </p>
          </div>
        </div>

        {/* 1-Click Quick Demo Sign In */}
        <button
          onClick={() => handleQuickLogin('Operations & Growth Specialist')}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Zap className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
          <span>⚡ Instant Sign In as Akhtar Ali</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <div className="h-px bg-slate-800 flex-1" />
          <span>or sign in with credentials</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Credential Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="akhtar.ali@workpulse.io"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Remember this workstation</span>
            </label>
            <span className="text-blue-400 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow transition border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Sign In to Dashboard</span>
          </button>
        </form>

        {/* Security Footer */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Express API Synced</span>
          </span>
          <span>4 Client Portfolios</span>
        </div>
      </div>
    </div>
  );
}

