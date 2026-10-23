import React, { useState } from 'react';
import { useServer } from '../../../context/ServerContext';
import {
  Database,
  Camera,
  RotateCcw,
  Trash2,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
  FileArchive,
} from 'lucide-react';

export const BackupsTab: React.FC = () => {
  const { lang, backups, servers, createBackup, restoreBackup, deleteBackup } = useServer();
  const isAr = lang === 'ar';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [targetServerId, setTargetServerId] = useState(servers[0]?.id || '');

  const totalBackupSize = backups.reduce((acc, b) => acc + b.sizeGb, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createBackup(snapshotName, targetServerId);
    setSnapshotName('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <h3 className="text-base font-semibold text-white">
            {isAr ? 'النسخ الاحتياطي واللقطات الفورية (Snapshots)' : 'Automated Backups & Disaster Recovery'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'إنشاء لقطات عتادية متطابقة، واستعادة النسخ بنقرة واحدة، وتشفير البيانات في مراكز متعددة.'
              : 'Block-level disk snapshots, 1-click disaster rollback, and multi-region offsite replication.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            <span>{isAr ? 'إجمالي الأرشيف:' : 'Archived:'} </span>
            <span className="text-white font-bold">{Math.round(totalBackupSize * 10) / 10} GB</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'أخذ لقطة فورية الآن' : 'Create Snapshot'}</span>
          </button>
        </div>
      </div>

      {/* Backups List */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <FileArchive className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-semibold text-white">
            {isAr ? 'اللقطات المحفوظة الجاهزة للاستعادة' : 'Available Restorable Snapshot Archives'}
          </h4>
        </div>

        {backups.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {isAr ? 'لا توجد لقطات احتياطية حتى الآن.' : 'No backup snapshots found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 font-mono">
                  <th className="py-2.5 px-3 text-start">{isAr ? 'اسم النسخة' : 'Archive Name'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'السيرفر المصدر' : 'Target Node'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الحجم' : 'Size'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-2.5 px-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {backups.map((bsp) => {
                  const isRestoring = bsp.status === 'restoring';

                  return (
                    <tr key={bsp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[220px]">{bsp.name}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-sans">{bsp.serverName}</td>
                      <td className="py-3 px-3 text-slate-300 tabular-nums">{bsp.sizeGb} GB</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{bsp.createdAt}</td>
                      <td className="py-3 px-3">
                        {isRestoring ? (
                          <span className="text-amber-400 flex items-center gap-1 font-semibold">
                            <RotateCcw className="w-3 h-3 animate-spin" />
                            {isAr ? 'جاري الاستعادة...' : 'Restoring...'}
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isAr ? 'جاهزة' : 'Ready'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => restoreBackup(bsp.id)}
                            disabled={isRestoring}
                            className="px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40 rounded text-[11px] transition-colors inline-flex items-center gap-1 font-sans font-medium disabled:opacity-40"
                          >
                            <RotateCcw className={`w-3 h-3 ${isRestoring ? 'animate-spin' : ''}`} />
                            <span>{isAr ? 'استعادة السيرفر' : 'Restore'}</span>
                          </button>
                          <button
                            onClick={() => deleteBackup(bsp.id)}
                            disabled={isRestoring}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors disabled:opacity-40"
                            title={isAr ? 'حذف اللقطة' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Backup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                {isAr ? 'أخذ نسخة احتياطية فورية (Snapshot)' : 'Capture Disk Snapshot'}
              </h4>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'اختر السيرفر المستهدف' : 'Target Server Node'}
                </label>
                <select
                  value={targetServerId}
                  onChange={(e) => setTargetServerId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  {servers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {isAr ? s.nameAr : s.name} ({s.ip})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'تسمية النسخة الاحتياطية' : 'Snapshot Archive Label'}
                </label>
                <input
                  type="text"
                  value={snapshotName}
                  onChange={(e) => setSnapshotName(e.target.value)}
                  placeholder="e.g. pre-upgrade-safe-point"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium"
                >
                  {isAr ? 'بدء أخذ اللقطة' : 'Capture Snapshot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
