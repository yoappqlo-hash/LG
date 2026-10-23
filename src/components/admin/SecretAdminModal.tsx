import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, KeyRound, Lock, X, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const SecretAdminModal: React.FC = () => {
  const { lang, unlockAdminWithPin, setShowAdminAuthModal, siteSettings, currentUser } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAr = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = unlockAdminWithPin(pinInput);
    if (!ok) {
      setErrorMsg(
        isAr
          ? 'رمز الدخول غير صحيح! الدخول مقتصر على مالك الموقع فقط.'
          : 'Invalid access PIN! Restricted to the owner only.'
      );
    }
  };

  const handleQuickUnlock = () => {
    setPinInput(siteSettings.adminPin || '2026');
    unlockAdminWithPin(siteSettings.adminPin || '2026');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'منطقة المشرف السرية' : 'Restricted Master Console'}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                OWNER CONTROL // AIR-GAPPED PORTAL
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdminAuthModal(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Warning */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
            <p>
              {isAr
                ? 'هذه اللوحة منفصلة تماماً وغير معلنة لزوار الموقع. يرجى إدخال رمز الأمان السري للوصول للتحكم الكامل بالحسابات، السحوبات، مكتبة الألعاب، والمستخدمين.'
                : 'This control room is completely isolated and unlisted. Please enter the master PIN to manage account stocks, giveaways, downloads, and user records.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/50 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'رمز الأمان السري (Master PIN)' : 'Master Security PIN'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="••••"
                  maxLength={10}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-cyan-500"
                  autoFocus
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute end-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'التحقق وفتح لوحة الإدارة' : 'Verify & Launch Console'}</span>
              </button>

              {/* Quick Owner Demo Button */}
              <button
                type="button"
                onClick={handleQuickUnlock}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs rounded-xl border border-slate-700/80 transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAr ? 'دخول سريع للمالك (PIN: 2026)' : 'Quick Owner Access (PIN: 2026)'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
