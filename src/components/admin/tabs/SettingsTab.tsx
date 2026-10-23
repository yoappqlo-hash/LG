import React, { useState } from 'react';
import { useServer } from '../../../context/ServerContext';
import {
  Settings,
  AlertTriangle,
  ShieldAlert,
  Radio,
  Sliders,
  CheckCircle2,
  Lock,
  Zap,
  Server,
  RefreshCw,
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const {
    lang,
    systemConfig,
    toggleMaintenance,
    toggleLockdown,
    toggleAutoScaling,
    toggleDdosShield,
  } = useServer();

  const isAr = lang === 'ar';

  const [maintMsg, setMaintMsg] = useState(systemConfig.maintenanceMessage);
  const [maintMsgAr, setMaintMsgAr] = useState(systemConfig.maintenanceMessageAr);

  const handleUpdateMessage = () => {
    toggleMaintenance(systemConfig.maintenanceMode, maintMsg, maintMsgAr);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <h3 className="text-base font-semibold text-white">
            {isAr ? 'الإعدادات العامة وسياسات الطوارئ' : 'Global Infrastructure & Security Policies'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'التحكم بوضع الصيانة للزوار، وضع الإغلاق الأمني الشامل، والتوسع السحابي التلقائي.'
              : 'Maintenance broadcast gate, emergency infrastructure isolation, and autoscaling engine.'}
          </p>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Mode Card */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {isAr ? 'وضع الصيانة الشامل (Maintenance Mode)' : 'Global Maintenance Mode'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'يظهر شاشة صيانة لكافة زوار الموقع العام باستثناء المشرفين'
                    : 'Gates public traffic with an official maintenance announcement'}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleMaintenance(!systemConfig.maintenanceMode, maintMsg, maintMsgAr)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                systemConfig.maintenanceMode ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  systemConfig.maintenanceMode
                    ? isAr
                      ? '-translate-x-6'
                      : 'translate-x-6'
                    : isAr
                    ? '-translate-x-1'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                {isAr ? 'رسالة الصيانة للمستخدمين (عربي):' : 'Maintenance Message (Arabic):'}
              </label>
              <input
                type="text"
                value={maintMsgAr}
                onChange={(e) => setMaintMsgAr(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                {isAr ? 'رسالة الصيانة للمستخدمين (إنجليزي):' : 'Maintenance Message (English):'}
              </label>
              <input
                type="text"
                value={maintMsg}
                onChange={(e) => setMaintMsg(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleUpdateMessage}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              {isAr ? 'حفظ نص الرسالة' : 'Save Broadcast Text'}
            </button>
          </div>
        </div>

        {/* Emergency Lockdown Card */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {isAr ? 'الإغلاق الأمني الشامل (Panic Lockdown)' : 'Emergency Infrastructure Lockdown'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'عزل فوري لجميع المنافذ غير المشفرة وحظر أي اتصالات خارجية مشبوهة'
                    : 'Emergency isolation of exposed ports and non-authenticated routes'}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleLockdown(!systemConfig.lockdownActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                systemConfig.lockdownActive ? 'bg-rose-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  systemConfig.lockdownActive
                    ? isAr
                      ? '-translate-x-6'
                      : 'translate-x-6'
                    : isAr
                    ? '-translate-x-1'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 space-y-2">
            <p className="leading-relaxed">
              {isAr
                ? 'عند التفعيل، يتم فك ارتباط جميع بروتوكولات HTTP العادية وتحويل الجدار الناري إلى نمط الصمت التام (Drop Silent).'
                : 'When activated, non-SSL interfaces are severed and packet filters shift to stealth drop.'}
            </p>
            <div className="flex items-center gap-2 text-rose-400 font-mono text-[11px]">
              <Lock className="w-3.5 h-3.5" />
              <span>
                {systemConfig.lockdownActive
                  ? isAr
                    ? 'الحالة: السيرفرات في وضع العزل الأمني المشدد'
                    : 'STATUS: CLUSTER AIR-GAPPED & LOCKED'
                  : isAr
                  ? 'الحالة: الوضع الطبيعي'
                  : 'STATUS: NORMAL OPERATION'}
              </span>
            </div>
          </div>
        </div>

        {/* Cluster Autoscaling Card */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {isAr ? 'التوسع السحابي التلقائي (Autoscaling)' : 'Automated Elastic Autoscaling'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'زيادة موارد المعالجة تلقائياً عند تجاوز الاستهلاك 85%'
                    : 'Dynamically scale vCPU & RAM pools when cluster loads breach 85%'}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleAutoScaling(!systemConfig.autoScaling)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                systemConfig.autoScaling ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  systemConfig.autoScaling
                    ? isAr
                      ? '-translate-x-6'
                      : 'translate-x-6'
                    : isAr
                    ? '-translate-x-1'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div>
              <span className="text-slate-500 block text-[10px]">Scale Threshold:</span>
              <span className="text-white font-semibold">85% CPU / 5m</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Cool-down Period:</span>
              <span className="text-white font-semibold">300 Seconds</span>
            </div>
          </div>
        </div>

        {/* System & Hardware Environment */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isAr ? 'بيئة التشغيل والنواة' : 'Platform & Runtime Diagnostics'}
              </h4>
              <p className="text-xs text-slate-400">
                {isAr ? 'إصدار المنصة والشهادات الرقمية' : 'Kernel releases and cryptographic cipher suites'}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="flex justify-between">
              <span className="text-slate-500">Kernel Version:</span>
              <span className="text-white">Linux 6.8.0-45-generic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ApexCore Version:</span>
              <span className="text-cyan-400 font-bold">v5.14.0-Enterprise</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SSL Certificate:</span>
              <span className="text-emerald-400">Valid (Expires Nov 2027)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Time Synchronization:</span>
              <span className="text-white">NTP Synced (0.1ms offset)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
