import React from 'react';
import { useApp } from '../context/AppContext';
import { ThemeMode } from '../types/app';
import {
  X,
  Moon,
  Sun,
  Sparkles,
  TreePine,
  Volume2,
  VolumeX,
  Check,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    lang,
    toggleLang,
    theme,
    setTheme,
    animeBackgroundEnabled,
    setAnimeBackgroundEnabled,
    soundEnabled,
    setSoundEnabled,
    setShowSettingsModal,
  } = useApp();

  const isAr = lang === 'ar';

  const themeOptions: { id: ThemeMode; label: string; labelAr: string; icon: any; desc: string; descAr: string }[] = [
    {
      id: 'anime',
      label: 'Cyber Anime',
      labelAr: 'أنمي سايبر متحرك',
      icon: Sparkles,
      desc: 'Glowing sakura petals & neon cyber twilight',
      descAr: 'بتلات ساكورا متطايرة مع سماء نيون سايبربانك',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      labelAr: 'الوضع الداكن',
      icon: Moon,
      desc: 'Deep black and cyan gaming contrast',
      descAr: 'أسود عميق مع لمسات السيان الفخمة',
    },
    {
      id: 'light',
      label: 'White / Light',
      labelAr: 'الوضع الأبيض الفاتح',
      icon: Sun,
      desc: 'Clean, luminous pearl interface',
      descAr: 'واجهة بيضاء نقية ومريحة للعين',
    },
    {
      id: 'natural',
      label: 'Natural Aurora',
      labelAr: 'الوضع الطبيعي الهادئ',
      icon: TreePine,
      desc: 'Emerald & sapphire cosmic glow',
      descAr: 'أضواء الشفق القطبي مع لمسات زمردية',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              ⚙️
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'إعدادات وعدادات الموقع' : 'Site Preferences & Settings'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'تخصيص المظهر، الخلفية الأنمي والمؤثرات' : 'Customize theme, anime visuals & audio FX'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Theme Modes Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {isAr ? 'مظهر وخلفية الموقع (الثيم)' : 'Interface Theme Mode'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-start transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl mt-0.5 ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">
                          {isAr ? opt.labelAr : opt.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                        {isAr ? opt.descAr : opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Effects Switches */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {isAr ? 'المؤثرات التفاعلية والأنمي' : 'Visual & Audio Effects'}
            </label>
            <div className="space-y-2">
              {/* Anime Animated Canvas Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isAr ? 'خلفية الأنمي والبتلات المتحركة' : 'Animated Anime Canvas & Petals'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isAr ? 'بتلات ساكورا وشهب مضيئة في الخلفية' : 'Floating sakura embers & shooting stars'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setAnimeBackgroundEnabled(!animeBackgroundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    animeBackgroundEnabled ? 'bg-pink-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      animeBackgroundEnabled
                        ? isAr ? '-translate-x-6' : 'translate-x-6'
                        : isAr ? '-translate-x-0.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Effects Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isAr ? 'المؤثرات الصوتية التفاعلية' : 'Audio Sound Effects (Web Audio)'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isAr ? 'أصوات النقر والتدوير والفوز والشات' : 'Tactile clicks, wheel spins & reward chimes'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      soundEnabled
                        ? isAr ? '-translate-x-6' : 'translate-x-6'
                        : isAr ? '-translate-x-0.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    🌐
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isAr ? 'لغة الواجهة (العربية / English)' : 'Interface Language'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isAr ? 'التبديل بين العربية والإنجليزية' : 'Switch between Arabic and English'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleLang}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 text-xs font-bold hover:bg-slate-700"
                >
                  {isAr ? 'English' : 'العربية'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={() => setShowSettingsModal(false)}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
          >
            {isAr ? 'حفظ وإغلاق' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
