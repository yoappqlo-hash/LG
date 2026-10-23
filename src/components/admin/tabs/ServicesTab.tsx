import React from 'react';
import { useServer } from '../../../context/ServerContext';
import {
  Layers,
  Power,
  RotateCw,
  Cpu,
  Database,
  Globe,
  Box,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const { lang, services, toggleService, restartService } = useServer();
  const isAr = lang === 'ar';

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'svc-nginx':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'svc-postgres':
        return <Database className="w-5 h-5 text-cyan-400" />;
      case 'svc-redis':
        return <Layers className="w-5 h-5 text-rose-400" />;
      case 'svc-docker':
        return <Box className="w-5 h-5 text-blue-400" />;
      case 'svc-sshd':
        return <Terminal className="w-5 h-5 text-purple-400" />;
      case 'svc-cron':
        return <Clock className="w-5 h-5 text-amber-400" />;
      default:
        return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Services Top Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <h3 className="text-base font-semibold text-white">
            {isAr ? 'محركات النظام والخدمات الخلفية (Daemons)' : 'System Services & Infrastructure Daemons'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'التحكم التشغيلي المباشر بخوادم الويب، وقواعد البيانات، ومحرك Docker، ومجدول المهام.'
              : 'Direct control over web servers, transactional databases, container runtimes, and scheduler workers.'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">{isAr ? 'حالة الخدمات:' : 'Active Daemons:'}</span>
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-bold">
            {services.filter((s) => s.status === 'active').length} / {services.length} ACTIVE
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc) => {
          const isActive = svc.status === 'active';
          const isRestarting = svc.status === 'restarting';

          return (
            <div
              key={svc.id}
              className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700/80 transition-all space-y-4"
            >
              {/* Top part */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                      {getServiceIcon(svc.id)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {isAr ? svc.nameAr : svc.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">Port: {svc.port}</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {isRestarting ? (
                      <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                        <RotateCw className="w-3 h-3 animate-spin" />
                        {isAr ? 'إعادة تشغيل...' : 'Restarting'}
                      </span>
                    ) : isActive ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isAr ? 'نشط' : 'Active'}
                      </span>
                    ) : (
                      <span className="text-xs text-rose-400 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {isAr ? 'معطل' : 'Stopped'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {isAr ? svc.descriptionAr : svc.description}
                </p>

                {/* Resource Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block text-[10px]">CPU Load:</span>
                    <span className="text-white font-semibold">{svc.cpuPercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Memory:</span>
                    <span className="text-white font-semibold">{svc.memoryMb} MB</span>
                  </div>
                </div>
              </div>

              {/* Bottom Control Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-mono">
                  {svc.autoRestart ? (isAr ? 'إعادة تشغيل تلقائي: نعم' : 'Auto-restart: ON') : ''}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restartService(svc.id)}
                    disabled={isRestarting || !isActive}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1 font-medium disabled:opacity-40"
                    title={isAr ? 'إعادة تحميل الخدمة' : 'Restart daemon'}
                  >
                    <RotateCw className={`w-3 h-3 ${isRestarting ? 'animate-spin' : ''}`} />
                    <span>{isAr ? 'إعادة تشغيل' : 'Restart'}</span>
                  </button>

                  <button
                    onClick={() => toggleService(svc.id)}
                    disabled={isRestarting}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium ${
                      isActive
                        ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>
                      {isActive
                        ? isAr
                          ? 'إيقاف'
                          : 'Stop'
                        : isAr
                        ? 'تشغيل'
                        : 'Start'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
