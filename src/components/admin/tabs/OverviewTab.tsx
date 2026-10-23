import React from 'react';
import { useServer } from '../../../context/ServerContext';
import {
  Server,
  Cpu,
  HardDrive,
  ShieldAlert,
  Power,
  RotateCw,
  Activity,
  Terminal,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    lang,
    servers,
    services,
    firewallRules,
    bannedIps,
    restartServer,
    stopServer,
    startServer,
    setAdminTab,
    systemConfig,
  } = useServer();

  const isAr = lang === 'ar';

  const runningServers = servers.filter((s) => s.status === 'running').length;
  const totalCores = servers.reduce((acc, s) => acc + s.cores, 0);
  const totalRam = servers.reduce((acc, s) => acc + s.ramGb, 0);
  const activeServices = services.filter((s) => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Top Banner if maintenance or lockdown is active */}
      {systemConfig.maintenanceMode && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-200">
                {isAr ? 'وضع الصيانة الشامل مفعل حالياً' : 'Global Maintenance Mode Active'}
              </p>
              <p className="text-xs text-amber-300/80">
                {isAr ? systemConfig.maintenanceMessageAr : systemConfig.maintenanceMessage}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminTab('settings')}
            className="text-xs px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg border border-amber-500/30 transition-colors"
          >
            {isAr ? 'تعديل الإعدادات' : 'Configure'}
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">
              {isAr ? 'السيرفرات النشطة' : 'Active Server Nodes'}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                {runningServers}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ {servers.length}</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isAr ? 'جميع العناقيد مستقرة' : 'All clusters healthy'}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Server className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">
              {isAr ? 'إجمالي قدرة المعالجة' : 'Total Compute Capacity'}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                {totalCores}
              </span>
              <span className="text-xs text-slate-400">vCPUs</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono tabular-nums">
              {isAr ? `ذاكرة عشوائية: ${totalRam} جيجابايت` : `Total RAM: ${totalRam} GB DDR5`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">
              {isAr ? 'خدمات النظام المشغلة' : 'System Daemons'}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                {activeServices}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ {services.length}</span>
            </div>
            <p className="text-[11px] text-cyan-400 mt-1 font-mono">
              Nginx · Postgres · Redis · Docker
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">
              {isAr ? 'حماية الجدار الناري' : 'Firewall & Threat Shield'}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                {bannedIps.length}
              </span>
              <span className="text-xs text-rose-400 font-mono">
                {isAr ? 'عنوان محظور' : 'Banned IPs'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono tabular-nums">
              {isAr
                ? `${firewallRules.length} قواعد حماية نشطة`
                : `${firewallRules.length} Active packet rules`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Server Fleet Grid with Instant Controls */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              {isAr ? 'حالة السيرفرات والتحكم الفوري' : 'Live Fleet Status & Quick Actions'}
            </h3>
          </div>
          <button
            onClick={() => setAdminTab('servers')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>{isAr ? 'إدارة السيرفرات المتقدمة' : 'Detailed Fleet Management'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {servers.map((server) => {
            const isRunning = server.status === 'running';
            const isRestarting = server.status === 'restarting';

            return (
              <div
                key={server.id}
                className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-slate-700/80 transition-all space-y-4"
              >
                {/* Server Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">
                        {isAr ? server.nameAr : server.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>{server.ip}</span>
                      <span>·</span>
                      <span>{isAr ? server.regionAr : server.region}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {isRestarting ? (
                      <span className="text-amber-400 flex items-center gap-1 font-mono">
                        <RotateCw className="w-3 h-3 animate-spin" />
                        {isAr ? 'جاري إعادة التشغيل...' : 'Restarting...'}
                      </span>
                    ) : isRunning ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {isAr ? 'يعمل بكفاءة' : 'Online'}
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1 font-mono">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        {isAr ? 'متوقف' : 'Stopped'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Resource Meters */}
                <div className="space-y-2.5 pt-1">
                  {/* CPU Meter */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-slate-500" />
                        {isAr ? 'استهلاك المعالج' : 'CPU Utilization'}
                      </span>
                      <span className="text-white font-mono tabular-nums">
                        {server.cpuUsage}% ({server.cores} Cores)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          server.cpuUsage > 80
                            ? 'bg-rose-500'
                            : server.cpuUsage > 60
                            ? 'bg-amber-500'
                            : 'bg-cyan-500'
                        }`}
                        style={{ width: `${server.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* RAM Meter */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-slate-500" />
                        {isAr ? 'الذاكرة العشوائية' : 'RAM Memory'}
                      </span>
                      <span className="text-white font-mono tabular-nums">
                        {server.ramUsage}% ({server.ramGb} GB)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          server.ramUsage > 85 ? 'bg-rose-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${server.ramUsage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Storage Meter */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                        {isAr ? 'وحدة التخزين NVMe' : 'NVMe Storage'}
                      </span>
                      <span className="text-white font-mono tabular-nums">
                        {server.diskUsage}% ({server.diskGb} GB)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                        style={{ width: `${server.diskUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Instant Actions Bar */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400 font-mono text-[11px]">
                    <span>{isAr ? `التشغيل: ${server.uptime}` : `Uptime: ${server.uptime}`}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isRunning ? (
                      <>
                        <button
                          onClick={() => restartServer(server.id)}
                          disabled={isRestarting}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 font-medium disabled:opacity-50"
                          title={isAr ? 'إعادة تشغيل فورية' : 'Quick Reboot'}
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
                          <span>{isAr ? 'إعادة تشغيل' : 'Reboot'}</span>
                        </button>
                        <button
                          onClick={() => stopServer(server.id)}
                          disabled={isRestarting}
                          className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-lg transition-colors flex items-center gap-1.5 font-medium disabled:opacity-50"
                          title={isAr ? 'إيقاف السيرفر' : 'Power Off'}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إيقاف' : 'Stop'}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startServer(server.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 font-medium"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تشغيل السيرفر' : 'Power On'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launchpad to Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Launchpad 1: Terminal */}
        <div
          onClick={() => setAdminTab('terminal')}
          className="p-4 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-all group flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {isAr ? 'طرفية الأوامر الحية (Web Terminal)' : 'Live Web Shell Console'}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isAr
                ? 'تنفيذ أوامر Bash المباشرة، فحص العمليات، وإدارة الحاويات.'
                : 'Execute direct bash CLI commands, check active processes, and inspect containers.'}
            </p>
          </div>
        </div>

        {/* Launchpad 2: Firewall */}
        <div
          onClick={() => setAdminTab('firewall')}
          className="p-4 bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 rounded-xl cursor-pointer transition-all group flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors">
              {isAr ? 'الجدار الناري وحظر العناوين' : 'Firewall & IP Blacklist'}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isAr
                ? 'إدارة منافذ الشبكة، حظر عناوين IP المشبوهة، ودرع DDoS.'
                : 'Manage open ports, apply packet filter rules, and ban suspicious IPs.'}
            </p>
          </div>
        </div>

        {/* Launchpad 3: Services */}
        <div
          onClick={() => setAdminTab('services')}
          className="p-4 bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-xl cursor-pointer transition-all group flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
              {isAr ? 'إدارة محركات وقواعد البيانات' : 'Daemons & DB Engines'}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isAr
                ? 'التحكم بخوادم Nginx و Postgres و Redis و Docker.'
                : 'Direct control over Nginx proxy, PostgreSQL shards, and Redis cache.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
