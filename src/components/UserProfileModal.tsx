import React from 'react';
import { useApp } from '../context/AppContext';
import { UserProfileData } from '../types/app';
import {
  X,
  ShieldCheck,
  Trophy,
  Calendar,
  Flame,
  Gift,
  Coins,
  MapPin,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface UserProfileModalProps {
  user: UserProfileData | null;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  const { lang, isOwnerAdmin } = useApp();
  const isAr = lang === 'ar';

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.email === 'yoappqlo@gmail.com';
  const isVip = user.role === 'vip';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Top Decorative Banner */}
        <div className="h-28 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <button
            onClick={onClose}
            className="absolute top-3 end-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar & Header */}
        <div className="px-6 pb-6 pt-0 relative space-y-4">
          <div className="flex items-end justify-between -mt-12">
            <div className="relative">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-20 h-20 rounded-2xl border-4 border-slate-900 bg-slate-800 object-cover shadow-xl"
              />
              <span className="absolute bottom-1 end-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            {/* Role Badge */}
            <div>
              {isAdmin ? (
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isAr ? 'المالك والمشرف 🛡️' : 'Admin'}</span>
                </span>
              ) : isVip ? (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'عضو VIP ⭐' : 'VIP Member'}</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1 shadow-md">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAr ? 'لاعب نشط 🎮' : 'Gamer'}</span>
                </span>
              )}
            </div>
          </div>

          {/* User Name & Region (No Email for Privacy!) */}
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>{user.displayName}</span>
              {isAdmin && <span className="text-purple-400 text-sm">✓</span>}
            </h3>

            {/* Region / Country with Flag automatically detected from IP */}
            <div className="flex items-center gap-2 text-xs text-cyan-300 mt-1 font-medium bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/20 w-fit">
              <span className="text-base leading-none">{user.countryFlag || '🌐'}</span>
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                {user.country || (isAr ? 'الشرق الأوسط' : 'Middle East')}
                {user.city ? ` - ${user.city}` : ''}
              </span>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 leading-relaxed">
              "{user.bio}"
            </p>
          )}

          {/* Player Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
              <div className="flex items-center justify-center text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white block">
                {user.streakDays || 1} {isAr ? 'أيام' : 'days'}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {isAr ? 'حضور يومي' : 'Streak'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
              <div className="flex items-center justify-center text-yellow-400">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white block">
                {user.points || 0}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {isAr ? 'نقاط مكافأة' : 'Points'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
              <div className="flex items-center justify-center text-emerald-400">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white block">
                {user.claimedAccounts ? user.claimedAccounts.length : 0}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {isAr ? 'غنائم مستلمة' : 'Claimed'}
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-800/80">
            🔒 {isAr ? 'بيانات البريد الإلكتروني مشفرة ومحمية لحفظ الخصوصية' : 'Email address is private and encrypted'}
          </div>
        </div>
      </div>
    </div>
  );
};
