import React, { useState } from 'react';
import { useServer } from '../../context/ServerContext';
import { signInWithGoogle, signOutFirebase } from '../../lib/firebase';
import { ShieldCheck, Globe, LogIn, UserCheck, AlertTriangle } from 'lucide-react';

interface PublicHeaderProps {
  onOpenAdminAuth: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onOpenAdminAuth }) => {
  const { lang, toggleLang, isAuthenticated, setCurrentView, systemConfig } = useServer();
  const isAr = lang === 'ar';

  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      const user = await signInWithGoogle();
      setGoogleUser(user);
    } catch (err) {
      console.warn('Google sign in canceled or failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await signOutFirebase();
    setGoogleUser(null);
  };

  return (
    <>
      {/* Maintenance alert bar if active */}
      {systemConfig.maintenanceMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-200 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isAr ? systemConfig.maintenanceMessageAr : systemConfig.maintenanceMessage}
          </span>
        </div>
      )}

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single text element) */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-black text-xs">
              APX
            </span>
            <span>{isAr ? 'سيرفرات أبيكس كلاود' : 'ApexCore Cloud'}</span>
          </a>

          {/* Zone 2: 4 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a
              href="#servers"
              className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'عناقيد السيرفرات' : 'Server Fleet'}
            </a>
            <a
              href="#network"
              className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'مراكز البيانات العالمية' : 'Datacenters'}
            </a>
            <a
              href="#announcements"
              className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'تنبيهات النظام (CMS)' : 'System Notices'}
            </a>
            <a
              href="#security"
              className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'الأمان والامتثال' : 'Enterprise Security'}
            </a>
          </nav>

          {/* Zone 3: 1 primary action + Language Switcher + Auth */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Google Auth user or login button */}
            {googleUser ? (
              <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                  {googleUser.displayName?.[0] || 'U'}
                </span>
                <span className="text-white truncate max-w-[100px] hidden sm:inline">
                  {googleUser.displayName}
                </span>
                <button
                  onClick={handleGoogleLogout}
                  className="text-slate-400 hover:text-rose-400 text-[11px] ms-1"
                >
                  {isAr ? 'خروج' : 'Sign out'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium transition-colors"
                title={isAr ? 'تسجيل الدخول عبر حساب جوجل (Firebase)' : 'Sign In with Google Auth'}
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAr ? 'دخول بجوجل' : 'Google Auth'}</span>
              </button>
            )}

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-mono transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
            </button>

            {/* Dedicated Admin Portal Access Button */}
            {isAuthenticated ? (
              <button
                onClick={() => setCurrentView('admin')}
                className="px-3.5 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'لوحة التحكم (نشطة)' : 'Admin Console'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                className="px-3.5 py-2 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-semibold shadow-md shadow-cyan-950/40"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'دخول لوحة تحكم السيرفر (Admin)' : 'Admin Server Portal'}</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
