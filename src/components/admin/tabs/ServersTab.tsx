import React, { useState } from 'react';
import { useServer } from '../../../context/ServerContext';
import { ServerNode } from '../../../types/server';
import {
  Server,
  Power,
  RotateCw,
  Sliders,
  Camera,
  CheckCircle2,
  XCircle,
  Cpu,
  HardDrive,
  Activity,
  Globe,
  SlidersHorizontal,
  X,
  ShieldAlert,
} from 'lucide-react';

export const ServersTab: React.FC = () => {
  const {
    lang,
    servers,
    startServer,
    stopServer,
    restartServer,
    updateServerSpecs,
    createBackup,
  } = useServer();

  const isAr = lang === 'ar';

  const [selectedServerId, setSelectedServerId] = useState<string>(servers[0]?.id || '');
  const [scaleModalServer, setScaleModalServer] = useState<ServerNode | null>(null);
  const [editCores, setEditCores] = useState<number>(16);
  const [editRam, setEditRam] = useState<number>(64);
  const [editDisk, setEditDisk] = useState<number>(1000);

  const selectedServer = servers.find((s) => s.id === selectedServerId) || servers[0];

  const openScaleModal = (server: ServerNode) => {
    setScaleModalServer(server);
    setEditCores(server.cores);
    setEditRam(server.ramGb);
    setEditDisk(server.diskGb);
  };

  const handleApplySpecs = () => {
    if (scaleModalServer) {
      updateServerSpecs(scaleModalServer.id, editCores, editRam, editDisk);
      setScaleModalServer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with fleet summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <h3 className="text-base font-semibold text-white">
            {isAr ? 'إدارة السيرفرات والبنية السحابية' : 'Cloud Server Fleet Administration'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'التحكم الكامل بالطاقة، ترقية العتاد الفوري (CPU / RAM / Disk)، ومراقبة النطاق الترددي.'
              : 'Full power control, live hardware re-allocation (vCPU / RAM / Disk), and bandwidth auditing.'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">{isAr ? 'العقد المتاحة:' : 'Available Nodes:'}</span>
          <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md font-bold">
            {servers.length} ACTIVE
          </span>
        </div>
      </div>

      {/* Grid of Servers */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Server Selector Column */}
        <div className="lg:col-span-1 space-y-2.5">
          <p className="text-xs font-medium text-slate-400 px-1">
            {isAr ? 'اختر السيرفر للتحكم' : 'Select Server Node'}
          </p>
          {servers.map((s) => {
            const isSelected = s.id === selectedServer?.id;
            const isRunning = s.status === 'running';
            const isRestarting = s.status === 'restarting';

            return (
              <button
                key={s.id}
                onClick={() => setSelectedServerId(s.id)}
                className={`w-full text-start p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 text-white shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold truncate max-w-[170px]">
                    {isAr ? s.nameAr : s.name}
                  </span>
                  {isRestarting ? (
                    <RotateCw className="w-3 h-3 text-amber-400 animate-spin" />
                  ) : isRunning ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{s.ip}</span>
                  <span>{s.cores} vCPU · {s.ramGb}GB</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Server Detailed Control Panel */}
        {selectedServer && (
          <div className="lg:col-span-3 space-y-6">
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-6">
              {/* Server Primary Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {isAr ? selectedServer.nameAr : selectedServer.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        UUID: {selectedServer.id} · OS: {selectedServer.os}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Hardware Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => openScaleModal(selectedServer)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{isAr ? 'ترقية العتاد والموارد' : 'Scale Hardware Specs'}</span>
                  </button>

                  <button
                    onClick={() => createBackup(`snapshot-${selectedServer.id}`, selectedServer.id)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isAr ? 'أخذ لقطة فورية (Snapshot)' : 'Capture Snapshot'}</span>
                  </button>

                  {selectedServer.status === 'running' || selectedServer.status === 'restarting' ? (
                    <>
                      <button
                        onClick={() => restartServer(selectedServer.id)}
                        disabled={selectedServer.status === 'restarting'}
                        className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <RotateCw
                          className={`w-3.5 h-3.5 ${
                            selectedServer.status === 'restarting' ? 'animate-spin' : ''
                          }`}
                        />
                        <span>{isAr ? 'إعادة تشغيل' : 'Reboot Node'}</span>
                      </button>
                      <button
                        onClick={() => stopServer(selectedServer.id)}
                        className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إيقاف السيرفر' : 'Shut Down'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startServer(selectedServer.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تشغيل السيرفر الآن' : 'Power Up Server'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Hardware Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>{isAr ? 'أنوية المعالج' : 'vCPU Cores'}</span>
                  </div>
                  <p className="text-xl font-bold text-white font-mono tabular-nums">
                    {selectedServer.cores}
                    <span className="text-xs text-slate-400 font-normal ms-1">Cores</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isAr ? 'معمارية AMD EPYC 9654' : 'AMD EPYC 9654 Zen 4'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>{isAr ? 'الذاكرة العشوائية' : 'Memory (RAM)'}</span>
                  </div>
                  <p className="text-xl font-bold text-white font-mono tabular-nums">
                    {selectedServer.ramGb}
                    <span className="text-xs text-slate-400 font-normal ms-1">GB DDR5</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">ECC Registered 4800MHz</p>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? 'سعة التخزين' : 'NVMe Storage'}</span>
                  </div>
                  <p className="text-xl font-bold text-white font-mono tabular-nums">
                    {selectedServer.diskGb}
                    <span className="text-xs text-slate-400 font-normal ms-1">GB</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">PCIe 5.0 RAID-10 NVMe</p>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'استهلاك البيانات' : 'Bandwidth'}</span>
                  </div>
                  <p className="text-xl font-bold text-white font-mono tabular-nums">
                    {selectedServer.bandwidthGb}
                    <span className="text-xs text-slate-400 font-normal ms-1">GB</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">10 Gbps Redundant Uplink</p>
                </div>
              </div>

              {/* Technical Node Details */}
              <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-3">
                <h5 className="text-xs font-semibold text-slate-300">
                  {isAr ? 'معلومات الشبكة والتوزيع الجغرافي' : 'Network & Localization Details'}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block">IP Address (IPv4):</span>
                    <span className="text-white font-semibold">{selectedServer.ip}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location / Datacenter:</span>
                    <span className="text-white font-semibold">
                      {isAr ? selectedServer.regionAr : selectedServer.region}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">System Active Period:</span>
                    <span className="text-emerald-400 font-semibold">{selectedServer.activeSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hardware Scaling Modal */}
      {scaleModalServer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">
                    {isAr ? 'ترقية مواصفات العتاد فورياً' : 'Live Hardware Scaling'}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {isAr ? scaleModalServer.nameAr : scaleModalServer.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScaleModalServer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* CPU slider */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">
                    {isAr ? 'أنوية المعالج (vCPU Cores)' : 'vCPU Compute Cores'}
                  </span>
                  <span className="text-cyan-400 font-mono font-bold">{editCores} Cores</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="64"
                  step="2"
                  value={editCores}
                  onChange={(e) => setEditCores(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>2 Cores</span>
                  <span>16 Cores</span>
                  <span>32 Cores</span>
                  <span>64 Cores</span>
                </div>
              </div>

              {/* RAM slider */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">
                    {isAr ? 'الذاكرة العشوائية (RAM GB)' : 'Dedicated RAM (GB DDR5)'}
                  </span>
                  <span className="text-purple-400 font-mono font-bold">{editRam} GB</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="256"
                  step="8"
                  value={editRam}
                  onChange={(e) => setEditRam(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>8 GB</span>
                  <span>64 GB</span>
                  <span>128 GB</span>
                  <span>256 GB</span>
                </div>
              </div>

              {/* Disk slider */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">
                    {isAr ? 'سعة التخزين (NVMe SSD GB)' : 'High-Speed NVMe Storage (GB)'}
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">{editDisk} GB</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={editDisk}
                  onChange={(e) => setEditDisk(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>100 GB</span>
                  <span>1,000 GB</span>
                  <span>2,000 GB</span>
                  <span>4,000 GB</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setScaleModalServer(null)}
                className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleApplySpecs}
                className="px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors shadow-lg shadow-cyan-950/40"
              >
                {isAr ? 'تطبيق الترقية فوراً' : 'Apply Hardware Specs Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
