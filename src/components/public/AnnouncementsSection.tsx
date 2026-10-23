import React from 'react';
import { useServer } from '../../context/ServerContext';
import { Bell, Pin, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const AnnouncementsSection: React.FC = () => {
  const { lang, announcements, isAuthenticated, setCurrentView, setAdminTab } = useServer();
  const isAr = lang === 'ar';

  const publishedNotices = announcements.filter((a) => a.published);

  if (publishedNotices.length === 0) return null;

  return (
    <section id="announcements" className="py-16 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>{isAr ? 'مركز النشرات والإعلانات' : 'Infrastructure Bulletin'}</span>
              <span aria-hidden="true">·</span>
              <span>{isAr ? 'نظام CMS للإدارة' : 'CMS Powered'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isAr ? 'تنبيهات النظام والتحديثات التشغيلية' : 'Platform Announcements & Upgrades'}
            </h2>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => {
                setAdminTab('cms');
                setCurrentView('admin');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>{isAr ? 'إدارة الإعلانات في لوحة التحكم' : 'Manage Notices in CMS'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedNotices.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                ann.pinned
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                      ann.type === 'critical'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : ann.type === 'maintenance'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : ann.type === 'release'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    {ann.type}
                  </span>
                  {ann.pinned && (
                    <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                      <Pin className="w-3 h-3 rotate-45" />
                      <span>{isAr ? 'مثبت' : 'Pinned'}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                  {isAr ? ann.titleAr : ann.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr ? ann.contentAr : ann.content}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-800/80">
                <span>{ann.publishedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
