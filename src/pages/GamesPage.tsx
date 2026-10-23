import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GameDownloadItem } from '../types/app';
import {
  Gamepad2,
  Download,
  Search,
  HardDrive,
  Cpu,
  Monitor,
  ExternalLink,
  Star,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';

export const GamesPage: React.FC = () => {
  const { lang, games } = useApp();
  const isAr = lang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameDownloadItem | null>(null);

  const filteredGames = games.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.titleAr.includes(searchQuery) ||
      g.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-start space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Gamepad2 className="w-4 h-4" />
          <span>{isAr ? 'مكتبة تحميل ألعاب الكمبيوتر' : 'PC Games Direct Vault'}</span>
        </div>
        <h1 className="text-3xl font-black text-white">
          {isAr ? 'تحميل ألعاب كاملة ومحدثة مع متطلبات التشغيل' : 'Download Full PC Games & Repacks'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          {isAr
            ? 'مكتبة ألعاب حصرية بروابط تحميل مباشرة وتورنت فائقة السرعة، مرفقة مع الوصف الكامل ومتطلبات تشغيل العتاد وكامل التحديثات.'
            : 'Explore full PC game repacks with multi-mirror direct CDN downloads, verified torrents, complete hardware requirements, and patches.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute start-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن اسم اللعبة أو التصنيف...' : 'Search games, titles, genres...'}
            className="w-full ps-9 pe-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span>{filteredGames.length} {isAr ? 'لعبة متوفرة' : 'Games available'}</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div>
              {/* Cover Image */}
              <div className="h-44 relative overflow-hidden bg-slate-950">
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback visual
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                <div className="absolute top-3 end-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-amber-400 font-mono text-xs font-bold border border-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{game.rating}</span>
                </div>

                <div className="absolute bottom-3 start-3">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-cyan-600/90 text-white font-mono font-semibold">
                    {isAr ? game.genreAr : game.genre}
                  </span>
                </div>
              </div>

              {/* Game Details */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-white leading-snug">
                  {isAr ? game.titleAr : game.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {isAr ? game.descriptionAr : game.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {game.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{game.size}</span>

              <button
                onClick={() => setSelectedGame(game)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-sm font-sans"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'المواصفات والتحميل' : 'Details & Download'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Game Download & Specs Modal */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 mb-1 block">
                  {isAr ? selectedGame.genreAr : selectedGame.genre} · {selectedGame.size}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isAr ? selectedGame.titleAr : selectedGame.title}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Build: {selectedGame.version}
                </p>
              </div>

              <button
                onClick={() => setSelectedGame(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <h4 className="font-bold text-white text-sm">
                {isAr ? 'عن اللعبة وقصتها:' : 'About the Game:'}
              </h4>
              <p>{isAr ? selectedGame.descriptionAr : selectedGame.description}</p>
            </div>

            {/* Hardware System Requirements Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'متطلبات تشغيل النظام (System Requirements)' : 'System Requirements'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Operating System:</span>
                  <span className="text-white font-semibold">{selectedGame.systemRequirements.os}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Processor (CPU):</span>
                  <span className="text-white font-semibold">{selectedGame.systemRequirements.cpu}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">System Memory (RAM):</span>
                  <span className="text-white font-semibold">{selectedGame.systemRequirements.ram}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Graphics Card (GPU):</span>
                  <span className="text-white font-semibold">{selectedGame.systemRequirements.gpu}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-500 block text-[10px]">Storage Space:</span>
                  <span className="text-emerald-400 font-semibold">{selectedGame.systemRequirements.storage}</span>
                </div>
              </div>
            </div>

            {/* Direct Download Mirrors */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-white text-sm">
                {isAr ? 'سيرفرات وروابط التحميل المباشرة:' : 'High-Speed Download Mirrors:'}
              </h4>

              <div className="space-y-2">
                <a
                  href={selectedGame.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-between shadow-lg shadow-cyan-950/40"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{isAr ? 'سيرفر التحميل المباشر 1 (سريع جداً CDN)' : 'Download Server 1 (High-Speed CDN)'}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {selectedGame.directMirrorUrl && (
                  <a
                    href={selectedGame.directMirrorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between border border-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-purple-400" />
                      <span>{isAr ? 'سيرفر التحميل البديل 2 (Direct Repack Mirror)' : 'Direct Repack Mirror 2'}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Close */}
            <div className="pt-2 text-end">
              <button
                onClick={() => setSelectedGame(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
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
