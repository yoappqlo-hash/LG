import React from 'react';
import { useApp, AppPage } from '../context/AppContext';
import {
  Sparkles,
  Gift,
  Gamepad2,
  Users,
  Info,
  User,
  Globe,
  LogIn,
  LogOut,
  Flame,
  Ticket,
  MessageSquare,
  Settings,
  Sun,
  Moon,
  TreePine,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    lang,
    toggleLang,
    currentPage,
    setCurrentPage,
    currentUser,
    loginWithGoogle,
    logout,
    onlinePlayersCount,
    siteSettings,
    theme,
    setTheme,
    setShowSettingsModal,
  } = useApp();

  const isAr = lang === 'ar';

  const navLinks: { id: AppPage; label: string; labelAr: string; icon: any }[] = [
    { id: 'home', label: 'Home', labelAr: 'الرئيسية', icon: Flame },
    { id: 'accounts', label: 'Account Drops', labelAr: 'توزيع الحسابات', icon: Gift },
    { id: 'giveaways', label: 'Lucky Wheel & Daily', labelAr: 'الجوائز والسحوبات', icon: Sparkles },
    { id: 'games', label: 'Games Library', labelAr: 'تحميل الألعاب', icon: Gamepad2 },
    { id: 'chat', label: 'Gamers Chat', labelAr: 'الشات العام', icon: MessageSquare },
    { id: 'about', label: 'About Us', labelAr: 'من نحن', icon: Info },
  ];

  const cycleTheme = () => {
    if (theme === 'anime') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('natural');
    else setTheme('anime');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'dark':
        return <Moon className="w-3.5 h-3.5 text-cyan-400" />;
      case 'natural':
        return <TreePine className="w-3.5 h-3.5 text-emerald-400" />;
      case 'anime':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />;
    }
  };

  return (
    <>
      {/* Top flash announcement banner */}
      {siteSettings.announcementActive && (
        <div className="bg-gradient-to-r from-cyan-950 via-purple-950 to-cyan-950 border-b border-cyan-500/20 px-4 py-1.5 text-xs text-cyan-200 flex items-center justify-between overflow-hidden relative z-40">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
              <p className="truncate font-medium">
                {isAr ? siteSettings.announcementAr : siteSettings.announcement}
              </p>
            </div>
            {/* Real Live Players Online Indicator */}
            <div className="flex items-center gap-1.5 text-slate-200 font-mono shrink-0 ms-3 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 text-[10px] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Users className="w-3 h-3 text-emerald-400" />
              <span>
                {onlinePlayersCount} {isAr ? (onlinePlayersCount === 1 ? 'متصل حقيقي' : 'متصلين') : (onlinePlayersCount === 1 ? 'real player online' : 'players online')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 text-start group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Apex<span className="text-cyan-400">Drop</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-mono">
                {isAr ? 'منصة توزيع الحسابات والجوائز' : 'VIP Accounts & Drops'}
              </span>
            </div>
          </button>

          {/* Nav Links (Single-Line, clean unboxed style) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                  className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-cyan-400 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isAr ? link.labelAr : link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Theme Quick Toggle + Settings + Language + User Auth Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Theme Switcher */}
            <button
              onClick={cycleTheme}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-all flex items-center justify-center"
              title={
                isAr
                  ? `الوضع الحالي: ${theme} - اضغط للتبديل (أنمي / داكن / أبيض / طبيعي)`
                  : `Current theme: ${theme} - click to cycle`
              }
            >
              {getThemeIcon()}
            </button>

            {/* Site Settings Modal Trigger */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-all"
              title={isAr ? 'إعدادات وعدادات الموقع' : 'Site Settings'}
            >
              <Settings className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="hidden sm:flex px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono transition-colors items-center gap-1"
              title="Change Language / تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* User Profile or Google Sign In */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage('profile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                    currentPage === 'profile'
                      ? 'bg-cyan-600/20 border-cyan-500 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                  }`}
                >
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-5 h-5 rounded-full object-cover border border-cyan-400/50"
                  />
                  <span className="font-semibold max-w-[80px] truncate hidden md:inline">
                    {currentUser.displayName}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono ms-1">
                    <Ticket className="w-3 h-3" />
                    <span>{currentUser.spinTickets}</span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-xl transition-colors text-xs"
                  title={isAr ? 'تسجيل الخروج' : 'Sign Out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-950/50 flex items-center gap-1.5 transition-all whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'تسجيل الدخول بجوجل' : 'Sign in with Google'}</span>
                <span className="sm:hidden">{isAr ? 'دخول' : 'Login'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Strip (Bottom app bar style for handheld devices) */}
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/95 px-2 py-2 flex items-center justify-around text-[10px] font-medium text-slate-400">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;

            return (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
                  isActive ? 'text-cyan-400 font-bold' : 'hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{isAr ? link.labelAr : link.label}</span>
              </button>
            );
          })}
        </div>
      </header>
    </>
  );
};
