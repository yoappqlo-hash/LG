import React from 'react';
import { useServer } from '../../context/ServerContext';
import { ShieldCheck, ArrowRight, ArrowLeft, Cpu, Activity, Server, Zap, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenAdminAuth: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAdminAuth }) => {
  const { lang, servers, isAuthenticated, setCurrentView } = useServer();
  const isAr = lang === 'ar';

  const totalCores = servers.reduce((acc, s) => acc + s.cores, 0);
  const totalRam = servers.reduce((acc, s) => acc + s.ramGb, 0);
  const runningServers = servers.filter((s) => s.status === 'running').length;

  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Quiet text kicker with typographic separator */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
            <span>{isAr ? 'البنية التحتية السحابية المتقدمة' : 'Next-Gen Enterprise Cloud Infrastructure'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'التحكم الإداري الحصري' : 'Dedicated Root Control Plane'}</span>
          </div>

          {/* Headline with text-wrap: balance */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
            {isAr
              ? 'إدارة متكاملة للسيرفرات السحابية مع لوحة تحكم حصرية للمشرفين'
              : 'Autonomous High-Performance Cloud Fleet with Dedicated Admin Control'}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {isAr
              ? 'منظومة سحابية فائقة القوة لإدارة العناقيد ومحركات قواعد البيانات، مزودة بصفحة خاصة ولوحة تحكم منفصلة للمشرف (Admin) تتيح التحكم الكامل بالسيرفرات، الجدار الناري، والطرفية الحية، وإدارة المحتوى.'
              : 'High-availability server infrastructure featuring an isolated, secure control plane for root administrators to manage clusters, hardware scaling, live terminal execution, and automated disaster recovery.'}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => setCurrentView('admin')}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-cyan-950/60 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'الدخول المباشر إلى لوحة التحكم' : 'Launch Admin Control Panel'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-cyan-950/60 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'دخول لوحة تحكم السيرفر (Admin Only)' : 'Enter Admin Control Panel'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            )}

            <a
              href="#servers"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-medium transition-colors"
            >
              {isAr ? 'استعراض مواصفات السيرفرات' : 'Explore Server Clusters'}
            </a>
          </div>

          {/* Live System Invariant Metrics Strip */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-start font-mono">
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">
                {isAr ? 'حالة العناقيد' : 'Cluster Nodes'}
              </span>
              <div className="flex items-baseline gap-1 text-base font-bold text-white tabular-nums">
                <span>{runningServers}</span>
                <span className="text-xs text-slate-500">/ {servers.length} Online</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">
                {isAr ? 'إجمالي الأنوية' : 'Compute Pool'}
              </span>
              <div className="text-base font-bold text-cyan-400 tabular-nums">
                {totalCores} <span className="text-xs text-slate-400 font-normal">vCPUs</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">
                {isAr ? 'الذاكرة العشوائية' : 'Active RAM'}
              </span>
              <div className="text-base font-bold text-purple-400 tabular-nums">
                {totalRam} <span className="text-xs text-slate-400 font-normal">GB DDR5</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">
                {isAr ? 'معدل الجاهزية SLA' : 'SLA Guarantee'}
              </span>
              <div className="text-base font-bold text-emerald-400 tabular-nums">
                99.99% <span className="text-xs text-slate-400 font-normal">Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
