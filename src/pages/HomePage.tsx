import React from 'react';
import { useApp } from '../context/AppContext';
import { LuckyWheel } from '../components/LuckyWheel';
import {
  Flame,
  Gift,
  Sparkles,
  Gamepad2,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Download,
  Copy,
  Zap,
  Trophy,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    lang,
    accounts,
    giveaways,
    games,
    setCurrentPage,
    claimAccount,
    visitorCount,
    siteSettings,
    currentUser,
    loginWithGoogle,
  } = useApp();

  const isAr = lang === 'ar';

  const featuredAccounts = accounts.filter((a) => a.featured).slice(0, 4);
  const activeGiveaways = giveaways.filter((g) => g.status === 'active').slice(0, 2);
  const topGames = games.slice(0, 3);

  const totalClaims = accounts.reduce((acc, a) => acc + (a.totalStock - a.remainingStock), 0);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-10 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-r from-cyan-600/15 via-purple-600/15 to-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center space-y-6">
          {/* Next Drop Countdown Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-md">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{isAr ? 'الدروب القادم بعد:' : 'Next Flash Drop in:'}</span>
            <span className="font-bold text-white tabular-nums">{siteSettings.nextDropCountdown}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight [text-wrap:balance]">
            {isAr ? (
              <>
                منصة <span className="text-cyan-400">توزيع الحسابات</span> والجوائز اليومية ومكتبة الألعاب
              </>
            ) : (
              <>
                The Ultimate <span className="text-cyan-400">Account Drops</span>, Giveaways & Game Hub
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'احصل على حسابات ستيم، إكس بوكس، دسكورد نيترو، ونتفلكس مجاناً وفورياً! شارك في السحوبات الكبرى، دور عجلة الحظ، وحمل أحدث الألعاب بأعلى سرعة.'
              : 'Claim verified Steam, Xbox, Discord Nitro, and streaming accounts instantly! Join weekly mega giveaways, spin for rewards, and download PC games.'}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage('accounts')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-950/60 transition-all flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>{isAr ? 'استعراض الحسابات المتاحة' : 'Browse Account Drops'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCurrentPage('giveaways')}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{isAr ? 'عجلة الحظ والسحوبات' : 'Lucky Wheel & Raffles'}</span>
            </button>
          </div>

          {/* Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-start font-mono max-w-4xl mx-auto">
            <div className="p-3.5 bg-slate-900/70 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">
                {isAr ? 'الزوار النشطين الآن' : 'Live Visitors'}
              </span>
              <div className="text-xl font-bold text-cyan-400 tabular-nums">
                {visitorCount.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/70 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">
                {isAr ? 'الحسابات الموزعة' : 'Accounts Claimed'}
              </span>
              <div className="text-xl font-bold text-emerald-400 tabular-nums">
                {(totalClaims + 840).toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/70 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">
                {isAr ? 'السحوبات النشطة' : 'Active Giveaways'}
              </span>
              <div className="text-xl font-bold text-purple-400 tabular-nums">
                {activeGiveaways.length} {isAr ? 'سحب جاري' : 'Running'}
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/70 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">
                {isAr ? 'الألعاب الجاهزة' : 'Games in Library'}
              </span>
              <div className="text-xl font-bold text-amber-400 tabular-nums">
                {games.length} {isAr ? 'لعبة بروابط سريعة' : 'High-Speed'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Lucky Wheel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <LuckyWheel />
      </section>

      {/* Featured Accounts Drop Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>{isAr ? 'أحدث دروبات الحسابات' : 'Featured Drops'}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isAr ? 'حسابات مميزة جاهزة للاستلام الفوري' : 'Hot Accounts Ready to Claim'}
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('accounts')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>{isAr ? 'عرض كافة الحسابات' : 'View All Drops'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredAccounts.map((acc) => {
            const hasStock = acc.remainingStock > 0;

            return (
              <div
                key={acc.id}
                className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {acc.platform}
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        hasStock ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {hasStock
                        ? isAr
                          ? `${acc.remainingStock} متبقي`
                          : `${acc.remainingStock} left`
                        : isAr
                        ? 'نفذت الكمية'
                        : 'Out of Stock'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    {isAr ? acc.titleAr : acc.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {isAr ? acc.instructionsAr : acc.instructions}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {isAr ? acc.badgeAr : acc.badge}
                  </span>

                  <button
                    onClick={() => {
                      if (!currentUser) {
                        loginWithGoogle();
                      } else {
                        claimAccount(acc.id);
                      }
                    }}
                    disabled={!hasStock}
                    className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 shadow-sm"
                  >
                    {isAr ? 'استلام الحساب' : 'Claim Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Giveaways Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'سحوبات كبرى جارية' : 'Ongoing Mega Giveaways'}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isAr ? 'سحوبات أسبوعية وجوائز عتادية واشتراكات' : 'Active Community Raffles'}
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('giveaways')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>{isAr ? 'كل السحوبات' : 'All Giveaways'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeGiveaways.map((giv) => (
            <div
              key={giv.id}
              className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-purple-400 font-bold">{giv.category}</span>
                  <span className="text-slate-400">{giv.participants.length} {isAr ? 'مشترك' : 'Joined'}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {isAr ? giv.titleAr : giv.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {isAr ? giv.descriptionAr : giv.description}
                </p>

                <div className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-xl text-xs text-purple-200 font-semibold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isAr ? giv.prizeAr : giv.prize}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {isAr ? `${giv.totalWinners} فائزين` : `${giv.totalWinners} Winners`}
                </span>
                <button
                  onClick={() => setCurrentPage('giveaways')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-purple-950/50"
                >
                  {isAr ? 'دخول السحب الآن' : 'Enter Giveaway'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Games Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'مكتبة تحميل الألعاب' : 'Direct Games Library'}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isAr ? 'ألعاب كمبيوتر بروابط مباشرة وسريعة' : 'Top Games & High-Speed Repacks'}
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('games')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>{isAr ? 'عرض كافة الألعاب' : 'View Library'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topGames.map((game) => (
            <div
              key={game.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400">{isAr ? game.genreAr : game.genre}</span>
                  <span className="text-slate-400">{game.size}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {isAr ? game.titleAr : game.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {isAr ? game.descriptionAr : game.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {game.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-mono font-bold">
                  ★ {game.rating} / 5.0
                </span>
                <button
                  onClick={() => setCurrentPage('games')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تفاصيل وروابط التحميل' : 'Download'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
