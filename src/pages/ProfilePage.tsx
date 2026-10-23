import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Ticket,
  Sparkles,
  Copy,
  Check,
  Eye,
  EyeOff,
  Edit2,
  Save,
  LogIn,
  Key,
  Calendar,
  Gift,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { lang, currentUser, loginWithGoogle, updateUserProfile, setCurrentPage } = useApp();
  const isAr = lang === 'ar';

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<{ [id: string]: boolean }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          {isAr ? 'الملف الشخصي للمستخدم' : 'User Profile & Inventory'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {isAr
            ? 'سجل دخولك بحساب جوجل للوصول إلى ملفك الشخصي الخاص وإدارة الحسابات التي استلمتها ورصيد تذاكر الدوران.'
            : 'Please sign in with Google to access your private profile, inventory of claimed account drops, and spin tickets.'}
        </p>
        <button
          onClick={loginWithGoogle}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition-colors inline-flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{isAr ? 'تسجيل الدخول عبر حساب جوجل' : 'Sign in with Google'}</span>
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ displayName, bio });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const copyCredentials = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {currentUser.displayName}
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mb-2">{currentUser.email}</p>
              <p className="text-xs text-slate-300 max-w-md">{currentUser.bio}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setDisplayName(currentUser.displayName);
              setBio(currentUser.bio);
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEditing ? (isAr ? 'إلغاء التعديل' : 'Cancel') : isAr ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-150"
          >
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isAr ? 'الاسم الظاهر (Display Name)' : 'Display Name'}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isAr ? 'النبذة التعريفية (Bio)' : 'Bio / Status'}
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isAr ? 'حفظ البيانات الشخصية' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {saveSuccess && (
          <p className="mt-3 text-xs text-emerald-400 font-medium">
            {isAr ? 'تم تحديث ملفك الشخصي بنجاح!' : 'Profile updated successfully!'}
          </p>
        )}
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">
              {isAr ? 'تذاكر دوران عجلة الحظ' : 'Spin Tickets Available'}
            </span>
            <span className="text-2xl font-black text-amber-400 tabular-nums">
              {currentUser.spinTickets}
            </span>
          </div>
          <button
            onClick={() => setCurrentPage('giveaways')}
            className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
            title="Spin Lucky Wheel"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">
              {isAr ? 'نقاط المكافآت التراكمية' : 'Reward Points'}
            </span>
            <span className="text-2xl font-black text-purple-400 tabular-nums">
              {currentUser.points} <span className="text-xs text-slate-500">PTS</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            ★
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">
              {isAr ? 'الحسابات المستلمة الخاصة بك' : 'Total Claimed Accounts'}
            </span>
            <span className="text-2xl font-black text-cyan-400 tabular-nums">
              {currentUser.claimedAccounts.length}
            </span>
          </div>
          <button
            onClick={() => setCurrentPage('accounts')}
            className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            title="Browse More Drops"
          >
            <Gift className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User's Claimed Accounts & Keys Inventory */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? 'خزينة حساباتي وأكواد التفعيل' : 'My Claimed Accounts & Licenses Vault'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'بيانات الحسابات والأكواد التي حصلت عليها. مرئية لك فقط ويمكنك نسخها في أي وقت.'
                : 'Private vault containing your claimed drops and keys. Visible solely to your account.'}
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('accounts')}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>{isAr ? 'استلام حساب جديد' : 'Claim More'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {currentUser.claimedAccounts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 font-mono space-y-3">
            <Gift className="w-8 h-8 text-slate-600 mx-auto" />
            <p>{isAr ? 'لم تقم باستلام أي حسابات حتى الآن.' : 'No accounts claimed yet.'}</p>
            <button
              onClick={() => setCurrentPage('accounts')}
              className="text-cyan-400 hover:underline"
            >
              {isAr ? 'تصفح الحسابات المتاحة للاستلام الآن' : 'Browse available drops now'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentUser.claimedAccounts.map((item) => {
              const isRevealed = revealedIds[item.id] || false;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                        {item.platform}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? item.titleAr : item.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono block">
                      {isAr ? `تاريخ الاستلام: ${item.claimedAt}` : `Claimed at: ${item.claimedAt}`}
                    </span>
                  </div>

                  {/* Credentials / Key box */}
                  <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                    <code className="text-xs font-mono text-cyan-300 truncate max-w-[200px]">
                      {isRevealed ? item.credentials : '••••••••••••••••••••'}
                    </code>

                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title={isRevealed ? 'Hide' : 'Reveal'}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => copyCredentials(item.id, item.credentials)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
                      title="Copy Credentials"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
