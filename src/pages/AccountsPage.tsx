import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AccountCategory, AccountItem } from '../types/app';
import {
  Gift,
  Search,
  Filter,
  Check,
  Copy,
  Sparkles,
  Lock,
  ExternalLink,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const AccountsPage: React.FC = () => {
  const {
    lang,
    accounts,
    claimAccount,
    currentUser,
    loginWithGoogle,
    setCurrentPage,
  } = useApp();

  const isAr = lang === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimModalData, setClaimModalData] = useState<{
    account: AccountItem;
    credentials?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [claimNotice, setClaimNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Drops', labelAr: 'كافة الحسابات' },
    { id: 'gaming', label: 'Gaming (Steam/Xbox/PSN)', labelAr: 'ألعاب وستيم' },
    { id: 'streaming', label: 'Streaming (Netflix/Spotify)', labelAr: 'بث وموسيقى' },
    { id: 'nitro', label: 'Discord Nitro', labelAr: 'دسكورد نيترو' },
    { id: 'vpn', label: 'VPN & Security', labelAr: 'برامج وVPN' },
  ];

  const platforms = ['all', 'Steam', 'Xbox', 'PlayStation', 'Discord', 'Netflix', 'Spotify', 'Minecraft', 'Valorant'];

  const filteredAccounts = accounts.filter((acc) => {
    const matchesCat = selectedCategory === 'all' || acc.category === selectedCategory;
    const matchesPlat = selectedPlatform === 'all' || acc.platform === selectedPlatform;
    const matchesSearch =
      searchQuery === '' ||
      acc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.titleAr.includes(searchQuery) ||
      acc.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesPlat && matchesSearch;
  });

  const handleClaim = (acc: AccountItem) => {
    if (!currentUser) {
      loginWithGoogle();
      return;
    }

    const res = claimAccount(acc.id);
    if (res.success && res.credentials) {
      setClaimModalData({ account: acc, credentials: res.credentials });
      setClaimNotice(null);
    } else {
      setClaimNotice(isAr ? res.messageAr : res.message);
      setTimeout(() => setClaimNotice(null), 4000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-start space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Gift className="w-4 h-4" />
          <span>{isAr ? 'التوزيع الفوري والدروبات المجانية' : 'Instant Verified Drops'}</span>
        </div>
        <h1 className="text-3xl font-black text-white">
          {isAr ? 'توزيع حسابات الألعاب والخدمات المدفوعة' : 'Accounts & Premium Licenses Drops'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          {isAr
            ? 'اختر الحساب المطلوب واضغط استلام فوري. تحفظ جميع الحسابات المستلمة في ملفك الشخصي لتتمكن من الرجوع إليها في أي وقت.'
            : 'Select any active drop to claim verified login credentials or product keys. All claims are stored in your profile.'}
        </p>
      </div>

      {claimNotice && (
        <div className="p-3.5 bg-rose-950/50 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium">
          {claimNotice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute start-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث باسم اللعبة أو المنصة...' : 'Search accounts, games, platform...'}
              className="w-full ps-9 pe-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Platform Pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {platforms.map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                  selectedPlatform === plat
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {plat === 'all' ? (isAr ? 'الكل' : 'All') : plat}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isAr ? cat.labelAr : cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Grid */}
      {filteredAccounts.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs font-mono bg-slate-900/40 border border-slate-800 rounded-2xl">
          {isAr ? 'لا توجد حسابات مطابقة للبحث حالياً.' : 'No account drops match current filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((acc) => {
            const hasStock = acc.remainingStock > 0;
            const stockPercent = Math.round((acc.remainingStock / acc.totalStock) * 100);

            return (
              <div
                key={acc.id}
                className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                      {acc.platform}
                    </span>
                    <span className="text-[11px] text-slate-400">{acc.dateAdded}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {isAr ? acc.titleAr : acc.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {isAr ? acc.instructionsAr : acc.instructions}
                  </p>

                  {/* Stock bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{isAr ? 'الكمية المتوفرة:' : 'Available Stock:'}</span>
                      <span className={hasStock ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {acc.remainingStock} / {acc.totalStock}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          hasStock ? 'bg-cyan-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${stockPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {isAr ? acc.badgeAr : acc.badge}
                  </span>

                  <button
                    onClick={() => handleClaim(acc)}
                    disabled={!hasStock}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-40 shadow-sm"
                  >
                    {isAr ? 'استلام الحساب' : 'Claim Drop'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Claim Success Modal */}
      {claimModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{isAr ? 'تم استلام الحساب بنجاح!' : 'Account Claimed Successfully!'}</span>
            </div>

            <p className="text-xs text-slate-300">
              {isAr ? claimModalData.account.titleAr : claimModalData.account.title}
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-mono block">
                {isAr ? 'بيانات تسجيل الدخول / الكود:' : 'Credentials / Activation Code:'}
              </span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs text-cyan-300 font-mono select-all break-all">
                  {claimModalData.credentials}
                </code>
                <button
                  onClick={() => copyToClipboard(claimModalData.credentials || '')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg shrink-0 transition-colors"
                  title="Copy"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isAr ? claimModalData.account.instructionsAr : claimModalData.account.instructions}
            </p>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setClaimModalData(null);
                  setCurrentPage('profile');
                }}
                className="text-xs text-cyan-400 hover:underline"
              >
                {isAr ? 'عرض في ملفي الشخصي' : 'Go to Profile'}
              </button>

              <button
                onClick={() => setClaimModalData(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
