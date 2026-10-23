import React, { useState } from 'react';
import { useServer } from '../../context/ServerContext';
import { ShieldCheck, Lock, KeyRound, AlertTriangle, ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';

interface AdminAuthModalProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onCancel, onSuccess }) => {
  const { lang, login, authError, setAuthError } = useServer();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAr = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    setTimeout(() => {
      const ok = login(username, password);
      setIsSubmitting(false);
      if (ok) {
        onSuccess();
      }
    }, 400);
  };

  const handleQuickLogin = () => {
    setUsername('admin');
    setPassword('admin');
    setIsSubmitting(true);
    setTimeout(() => {
      const ok = login('admin', 'admin');
      setIsSubmitting(false);
      if (ok) {
        onSuccess();
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top security banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isAr ? 'بوابة دخول إدارة السيرفرات' : 'Server Admin Security Gateway'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                APEX-AUTH-GUARD // RESTRICTED ACCESS
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors text-xs flex items-center gap-1"
          >
            {isAr ? (
              <>
                <span>العودة</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Return</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Security Alert Notice */}
        <div className="px-6 pt-5">
          <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl flex items-start gap-3 text-xs text-cyan-200">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isAr
                ? 'هذه المنطقة مخصصة حصرياً لمدير النظام (Admin) للتحكم بكامل السيرفرات وقواعد البيانات والجدار الناري.'
                : 'This portal is strictly reserved for the root system administrator to control server infrastructure, databases, and firewall policies.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authError && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {isAr ? 'اسم المستخدم (Admin Username)' : 'Administrator Username'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                required
              />
              <span className="absolute end-3 top-3 text-[11px] text-slate-500 font-mono">
                root
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {isAr ? 'كلمة المرور / الرمز السري' : 'Password / Security PIN'}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                required
              />
              <KeyRound className="w-4 h-4 absolute end-3 top-3 text-slate-500" />
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{isAr ? 'جاري التحقق من الصلاحيات...' : 'Verifying Root Credentials...'}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAr ? 'تسجيل الدخول إلى لوحة التحكم' : 'Authenticate & Enter Console'}</span>
                </>
              )}
            </button>

            {/* Quick Demo One-Click Access Button */}
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 text-xs font-medium rounded-xl border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>
                {isAr
                  ? 'دخول تجريبي سريع بضغطة زر (Super Admin Root)'
                  : 'Quick 1-Click Root Admin Access (Demo)'}
              </span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              {isAr ? 'بيانات التجربة التلقائية: admin / admin' : 'Default Credentials: admin / admin'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
