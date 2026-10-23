import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Ticket, Trophy, Gift, ArrowRight, ArrowLeft } from 'lucide-react';

export const LuckyWheel: React.FC = () => {
  const { lang, currentUser, spinLuckyWheel, loginWithGoogle, setCurrentPage } = useApp();
  const isAr = lang === 'ar';

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonResult, setWonResult] = useState<{
    prizeName: string;
    prizeNameAr: string;
    type: string;
    value: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const segments = [
    { label: 'Steam Key', labelAr: 'كود ستيم', color: '#0284c7' },
    { label: '100 Points', labelAr: '100 نقطة', color: '#8b5cf6' },
    { label: 'Discord Nitro', labelAr: 'دسكورد نيترو', color: '#6366f1' },
    { label: 'Xbox Pass', labelAr: 'إكس بوكس', color: '#10b981' },
    { label: '+2 Tickets', labelAr: 'تذكرتان +2', color: '#f59e0b' },
    { label: 'Spotify 1M', labelAr: 'سبوتيفاي', color: '#ec4899' },
  ];

  const handleSpin = async () => {
    if (!currentUser) {
      loginWithGoogle();
      return;
    }

    if (currentUser.spinTickets <= 0) {
      setErrorMsg(
        isAr
          ? 'لا توجد تذاكر دوران متبقية لديك! يمكنك كسب المزيد من خلال النقاط أو الهدايا اليومية.'
          : 'You are out of spin tickets! Earn more via points or daily claim.'
      );
      return;
    }

    setErrorMsg(null);
    setWonResult(null);
    setIsSpinning(true);

    // Random rotations (5 to 8 full spins + segment offset)
    const extraDegrees = Math.floor(Math.random() * 360);
    const newRotation = rotation + 1800 + extraDegrees;
    setRotation(newRotation);

    try {
      const result = await spinLuckyWheel();
      setTimeout(() => {
        setIsSpinning(false);
        setWonResult(result);
      }, 3500);
    } catch (err: any) {
      setIsSpinning(false);
      setErrorMsg(err.message || 'Spin failed');
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-20 -end-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -start-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
        {/* Left / Info side */}
        <div className="space-y-5 text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'عجلة الحظ اليومية المجانية' : 'Free Daily Lucky Wheel'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {isAr
              ? 'دور العجلة واربح حسابات بريميوم وأكواد فورية!'
              : 'Spin the Wheel to Win Premium Accounts & Game Keys!'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isAr
              ? 'كل عضو يحصل على تذاكر دوران مجانية. الجوائز تودع مباشرة في ملفك الشخصي فور فوزك ويمكنك نسخ المفاتيح فوراً!'
              : 'Every registered member gets free spin tickets. Winnings are deposited immediately into your private profile inventory!'}
          </p>

          {/* User Tickets balance */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">
                  {isAr ? 'رصيد تذاكر الدوران' : 'Your Spin Tickets'}
                </span>
                <span className="text-lg font-black text-white font-mono tabular-nums">
                  {currentUser ? currentUser.spinTickets : 0} {isAr ? 'تذكرة' : 'Tickets'}
                </span>
              </div>
            </div>

            {!currentUser && (
              <button
                onClick={loginWithGoogle}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-xl transition-colors shadow-sm"
              >
                {isAr ? 'سجل للمطالبة بـ 3 تذاكر' : 'Login for 3 Free Spins'}
              </button>
            )}
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl">
              {errorMsg}
            </p>
          )}

          {wonResult && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-2 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Trophy className="w-4 h-4" />
                <span>
                  {isAr ? `مبروك! لقد ربحت: ${wonResult.prizeNameAr}` : `Congratulations! Won: ${wonResult.prizeName}`}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {wonResult.value}
              </p>
              <button
                onClick={() => setCurrentPage('profile')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>{isAr ? 'عرض الجائزة في ملفك الشخصي' : 'View in your inventory'}</span>
                {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Right / Wheel side */}
        <div className="flex flex-col items-center justify-center relative">
          {/* Wheel Pointer Arrow */}
          <div className="w-0 h-0 border-x-8 border-x-transparent border-t-[18px] border-t-amber-400 z-20 mb-[-10px] drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]"></div>

          {/* Rotating wheel container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Outer neon ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-700 shadow-[0_0_25px_rgba(6,182,212,0.25)] pointer-events-none"></div>

            <div
              className="w-full h-full rounded-full overflow-hidden transition-transform ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: isSpinning ? '3.5s' : '0s',
                transitionTimingFunction: 'cubic-bezier(0.15, 0.95, 0.35, 1)',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {segments.map((seg, idx) => {
                  const angle = 360 / segments.length;
                  const startAngle = idx * angle;
                  const endAngle = (idx + 1) * angle;

                  const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  // Text position
                  const textAngle = startAngle + angle / 2;
                  const textRad = (Math.PI * (textAngle - 90)) / 180;
                  const tx = 50 + 32 * Math.cos(textRad);
                  const ty = 50 + 32 * Math.sin(textRad);

                  return (
                    <g key={idx}>
                      <path d={pathData} fill={seg.color} stroke="#0f172a" strokeWidth="0.8" />
                      <text
                        x={tx}
                        y={ty}
                        fill="#ffffff"
                        fontSize="3.8"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                      >
                        {isAr ? seg.labelAr : seg.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Center Spin Trigger Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="absolute z-10 w-16 h-16 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 font-black text-xs shadow-xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5 mb-0.5 text-amber-400" />
              <span>{isSpinning ? '...' : isAr ? 'تدوير' : 'SPIN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
