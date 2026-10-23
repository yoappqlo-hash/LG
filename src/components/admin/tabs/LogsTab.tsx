import React, { useState } from 'react';
import { useServer } from '../../../context/ServerContext';
import {
  FileText,
  Search,
  Download,
  Trash2,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export const LogsTab: React.FC = () => {
  const { lang, logs, clearLogs } = useServer();
  const isAr = lang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'security'>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSeverity = severityFilter === 'all' || log.level === severityFilter;
    const matchesSearch =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.messageAr.includes(searchQuery) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const downloadLogs = () => {
    const textContent = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.source}]: ${l.message} | ${l.messageAr}`
      )
      .join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apexcore-server-audit-${new Date().toISOString().split('T')[0]}.log`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'security':
        return (
          <span className="text-purple-400 font-bold flex items-center gap-1 font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            SECURITY
          </span>
        );
      case 'error':
        return (
          <span className="text-rose-400 font-bold flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            ERROR
          </span>
        );
      case 'warn':
        return (
          <span className="text-amber-400 font-bold flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            WARN
          </span>
        );
      case 'info':
      default:
        return (
          <span className="text-cyan-400 font-bold flex items-center gap-1 font-mono">
            <Info className="w-3.5 h-3.5" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <h3 className="text-base font-semibold text-white">
            {isAr ? 'سجلات النظام والمراقبة الحية (Audit Logs)' : 'Live System & Security Audit Logs'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'تتبع كامل الأحداث، محاولات الدخول، استجابات النواة، وإشارات الجدار الناري.'
              : 'Immutable event stream, authentication attempts, kernel probes, and packet drops.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadLogs}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'تحميل ملف السجلات (.log)' : 'Export .log'}</span>
          </button>
          <button
            onClick={clearLogs}
            className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'مسح السجلات' : 'Clear Logs'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute start-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في السجلات والرسائل والمصادر...' : 'Search logs, messages, sources...'}
            className="w-full ps-9 pe-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800/80 text-xs font-mono">
          {(['all', 'info', 'warn', 'error', 'security'] as const).map((sev) => {
            const isActive = severityFilter === sev;
            return (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono">
            {isAr ? 'لا توجد سجلات تطابق الفلتر الحالي.' : 'No audit entries match current filter.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 font-mono text-start">
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الوقت' : 'Time'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'المستوى' : 'Level'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'المصدر' : 'Source'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'تفاصيل السجل' : 'Audit Message'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 tabular-nums whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{getLevelBadge(log.level)}</td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      [{log.source}]
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-sans leading-relaxed">
                      {isAr ? log.messageAr : log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
