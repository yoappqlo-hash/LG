import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LuckyWheel } from '../components/LuckyWheel';
import { GiveawayItem } from '../types/app';
import {
  Sparkles,
  Trophy,
  Users,
  Clock,
  CheckCircle2,
  Gift,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Flame,
  Check,
  Coins,
  Ticket,
} from 'lucide-react';

export const GiveawaysPage: React.FC = () => {
  const {
    lang,
    giveaways,
    joinGiveaway,
    currentUser,
    loginWithGoogle,
    dailyRewards,
    claimDailyReward,
  } = useApp();
  const isAr = lang === 'ar';

  const [joinFeedback, setJoinFeedback] = useState<{ id: string; msg: string; success: boolean } | null>(null);
  const [dailyFeedback, setDailyFeedback] = useState<{ msg: string; success: boolean } | null>(null);

  const handleJoin = (giv: GiveawayItem) => {
    if (!currentUser) {
      loginWithGoogle();
      return;
    }

    const res = joinGiveaway(giv.id);
    setJoinFeedback({
      id: giv.id,
      msg: isAr ? res.messageAr : res.message,
      success: res.success,
    });

    setTimeout(() => setJoinFeedback(null), 4000);
  };

  const handleClaimDaily = (rewardId: string) => {
    if (!currentUser) {
      loginWithGoogle();
      return;
    }

    const res = claimDailyReward(rewardId);
    setDailyFeedback({
      msg: isAr ? res.messageAr : res.message,
      success: res.success,
    });

    setTimeout(() => setDailyFeedback(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12 relative z-10">
      {/* Header */}
      <div className="text-start space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
          <Sparkles className="w-4 h-4" />
          <span>{isAr ? 'المكافآت اليومية وعجلة الحظ والسحوبات' : 'Daily Rewards, Lucky Wheel & Raffles'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {isAr ? 'الجوائز اليومية وسحوبات الحسابات' : 'Mega Giveaways & Daily Rewards'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          {isAr
            ? 'سجل حضورك اليومي للحصول على تذاكر دوران ونقاط وألعاب مجانية، أو دور عجلة الحظ الكبرى للفوز بحسابات حصرية فورية.'
            : 'Check in daily to build your streak for free spin tickets and games, or spin the lucky wheel to win instant drops.'}
        </p>
      </div>

      {/* Daily Login Rewards Strip */}
      <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'سلسلة الحضور والجوائز اليومية (7 أيام)' : '7-Day Daily Streak Rewards'}
                </h3>
                {currentUser?.streakDays && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {currentUser.streakDays} {isAr ? 'أيام متتالية' : 'day streak'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAr ? 'سجل دخولك كل 24 ساعة لاستلام المكافأة المخصصة' : 'Check in every 24 hours to claim your daily tier'}
              </p>
            </div>
          </div>

          {dailyFeedback && (
            <div
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                dailyFeedback.success
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}
            >
              <span>{dailyFeedback.msg}</span>
            </div>
          )}
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {dailyRewards.map((reward, idx) => {
            const isToday = (currentUser?.streakDays || 0) % 7 === idx;
            const isCompleted = (currentUser?.streakDays || 0) > idx && !isToday;

            return (
              <div
                key={reward.id}
                className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                  isToday
                    ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10 scale-102'
                    : isCompleted
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-70'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    {isAr ? `اليوم ${reward.dayNumber}` : `Day ${reward.dayNumber}`}
                  </span>
                  <div className="w-9 h-9 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-lg my-1">
                    {reward.rewardType === 'tickets' ? '🎟️' : reward.rewardType === 'steam_key' ? '🔑' : reward.rewardType === 'nitro' ? '💎' : '🎁'}
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">
                    {isAr ? reward.nameAr : reward.name}
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono block mt-0.5">
                    {isAr ? reward.badgeAr : reward.badge}
                  </span>
                </div>

                <div className="mt-3">
                  {isCompleted ? (
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" />
                      {isAr ? 'تم الاستلام' : 'Claimed'}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimDaily(reward.id)}
                      className={`w-full py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all ${
                        isToday
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isToday ? (isAr ? 'استلم الآن!' : 'Claim Now') : (isAr ? 'استلام' : 'Claim')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lucky Wheel Feature */}
      <LuckyWheel />

      {/* Community Giveaways List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              {isAr ? 'السحوبات المجتمعية المفتوحة' : 'Active Community Raffles'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {giveaways.length} {isAr ? 'سحب متاح' : 'Active Raffles'}
          </span>
        </div>

        {giveaways.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
            <Trophy className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-semibold">
              {isAr ? 'لا توجد سحوبات نشطة حالياً. ترقب دروب الإدارة القادم!' : 'No raffles active right now.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giveaways.map((giv) => {
              const isJoined = Boolean(
                currentUser && (giv.participants.includes(currentUser.email) || giv.participants.includes(currentUser.displayName))
              );
              const isEnded = giv.status !== 'active';

              return (
                <div
                  key={giv.id}
                  className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-800/60">
                        {giv.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {giv.endsAt}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">
                        {isAr ? giv.titleAr : giv.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {isAr ? giv.descriptionAr : giv.description}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-purple-300">
                          {isAr ? giv.prizeAr : giv.prize}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {giv.totalWinners} {isAr ? 'فائز' : 'Winners'}
                      </span>
                    </div>

                    {giv.winners && giv.winners.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                        <span className="font-bold flex items-center gap-1 text-[11px]">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          {isAr ? 'الفائزون في السحب:' : 'Draw Winners:'}
                        </span>
                        <p className="font-mono text-[11px] truncate">
                          {giv.winners.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-mono">{giv.participants.length}</span>
                        <span>{isAr ? 'مشترك' : 'joined'}</span>
                      </div>
                    </div>

                    {joinFeedback?.id === giv.id && (
                      <p
                        className={`text-xs font-medium text-center ${
                          joinFeedback.success ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {joinFeedback.msg}
                      </p>
                    )}

                    <button
                      onClick={() => handleJoin(giv)}
                      disabled={isJoined || isEnded}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        isEnded
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : isJoined
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-900/30'
                      }`}
                    >
                      {isEnded ? (
                        <span>{isAr ? 'انتهى السحب' : 'Giveaway Concluded'}</span>
                      ) : isJoined ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{isAr ? 'أنت مشترك بالفعل!' : 'You are in!'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{isAr ? 'انضم للسحب مجاناً' : 'Enter Giveaway Free'}</span>
                        </>
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
