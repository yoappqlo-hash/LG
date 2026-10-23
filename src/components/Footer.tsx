import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { lang, setCurrentPage } = useApp();
  const isAr = lang === 'ar';

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Rights */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-xs">
              ⚡
            </div>
            <div>
              <span className="text-white font-bold text-sm">
                Apex<span className="text-cyan-400">Drop</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'جميع الحقوق محفوظة © 2026. منصة توزيع الحسابات والجوائز والألعاب.'
                  : 'All rights reserved © 2026. Verified account drops & gaming community.'}
              </p>
            </div>
          </div>

          {/* Quick Page Links */}
          <div className="flex flex-wrap items-center gap-5 text-slate-400">
            <button
              onClick={() => setCurrentPage('home')}
              className="hover:text-cyan-400 transition-colors"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            <button
              onClick={() => setCurrentPage('accounts')}
              className="hover:text-cyan-400 transition-colors"
            >
              {isAr ? 'الحسابات' : 'Drops'}
            </button>
            <button
              onClick={() => setCurrentPage('giveaways')}
              className="hover:text-cyan-400 transition-colors"
            >
              {isAr ? 'السحوبات' : 'Giveaways'}
            </button>
            <button
              onClick={() => setCurrentPage('games')}
              className="hover:text-cyan-400 transition-colors"
            >
              {isAr ? 'تحميل الألعاب' : 'Games'}
            </button>
            <button
              onClick={() => setCurrentPage('chat')}
              className="hover:text-cyan-400 transition-colors"
            >
              {isAr ? 'الشات العام' : 'Chat'}
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className="hover:text-cyan-400 transition-colors"
            >
              {isAr ? 'من نحن' : 'About'}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <p>
            {isAr
              ? 'تنويه: الحسابات والألعاب مقدمة لأغراض ترويجية وتجريبية. تخضع جميع الأسماء لعلاماتها التجارية.'
              : 'Disclaimer: Account drops and software keys are distributed for promotional community usage.'}
          </p>
          <span>Encrypted SSL 256-Bit</span>
        </div>
      </div>
    </footer>
  );
};
