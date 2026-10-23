import React from 'react';
import { useServer } from '../../context/ServerContext';
import { Server, Cpu, HardDrive, Activity, Globe, Check, Sliders } from 'lucide-react';

interface ServerCatalogProps {
  onOpenAdminAuth: () => void;
}

export const ServerCatalog: React.FC<ServerCatalogProps> = ({ onOpenAdminAuth }) => {
  const { lang, servers, isAuthenticated, setCurrentView, setAdminTab } = useServer();
  const isAr = lang === 'ar';

  const handleAdminAction = () => {
    if (isAuthenticated) {
      setAdminTab('servers');
      setCurrentView('admin');
    } else {
      onOpenAdminAuth();
    }
  };

  return (
    <section id="servers" className="py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>{isAr ? 'عناقيد الخوادم المتاحة' : 'High-Performance Fleet'}</span>
              <span aria-hidden="true">·</span>
              <span>{isAr ? 'تحديث حي من CMS' : 'Managed via Admin CMS'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isAr ? 'خوادم مخصصة وعناقيد سحابية فائقة السرعة' : 'Dedicated Cloud Nodes & Managed Shards'}
            </h2>
          </div>

          <button
            onClick={handleAdminAction}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAr ? 'تعديل السيرفرات في لوحة التحكم' : 'Configure Fleet in Admin'}</span>
          </button>
        </div>

        {/* Server Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servers.map((srv) => {
            const isOnline = srv.status === 'running';

            return (
              <div
                key={srv.id}
                className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all space-y-5"
              >
                <div>
                  {/* Status & Region */}
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="text-slate-400">{isAr ? srv.regionAr : srv.region}</span>
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        isOnline ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      ></span>
                      <span>{isOnline ? (isAr ? 'متصل' : 'Active') : isAr ? 'متوقف' : 'Offline'}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {isAr ? srv.nameAr : srv.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mb-4">{srv.ip}</p>

                  {/* Specifications */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                        <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        <span>{isAr ? 'المعالج' : 'Compute'}</span>
                      </span>
                      <span className="text-white font-bold tabular-nums">{srv.cores} vCPU</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isAr ? 'الذاكرة' : 'Memory'}</span>
                      </span>
                      <span className="text-white font-bold tabular-nums">{srv.ramGb} GB DDR5</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                        <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isAr ? 'التخزين' : 'NVMe Storage'}</span>
                      </span>
                      <span className="text-white font-bold tabular-nums">{srv.diskGb} GB</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'النطاق' : 'Bandwidth'}</span>
                      </span>
                      <span className="text-white font-bold tabular-nums">10 Gbps Uplink</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {isAr ? `جاهزية: ${srv.uptime}` : `SLA: ${srv.uptime}`}
                  </span>
                  <button
                    onClick={handleAdminAction}
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    {isAr ? 'إدارة السيرفر' : 'Administer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
