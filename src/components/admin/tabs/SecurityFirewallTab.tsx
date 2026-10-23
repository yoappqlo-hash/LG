import React, { useState } from 'react';
import { useServer } from '../../../context/ServerContext';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  X,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';

export const SecurityFirewallTab: React.FC = () => {
  const {
    lang,
    firewallRules,
    addFirewallRule,
    deleteFirewallRule,
    bannedIps,
    banIp,
    unbanIp,
    systemConfig,
    toggleDdosShield,
  } = useServer();

  const isAr = lang === 'ar';

  // Add Rule Modal State
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [rulePort, setRulePort] = useState<number>(8080);
  const [ruleProtocol, setRuleProtocol] = useState<'TCP' | 'UDP' | 'ANY'>('TCP');
  const [ruleAction, setRuleAction] = useState<'ALLOW' | 'DENY'>('ALLOW');
  const [ruleSource, setRuleSource] = useState('0.0.0.0/0 (Global)');
  const [ruleComment, setRuleComment] = useState('Custom API Ingress Gateway');

  // Ban IP modal state
  const [showBanModal, setShowBanModal] = useState(false);
  const [newBanIp, setNewBanIp] = useState('');
  const [newBanReason, setNewBanReason] = useState('Malicious traffic detection');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    addFirewallRule({
      port: Number(rulePort),
      protocol: ruleProtocol,
      direction: 'INBOUND',
      action: ruleAction,
      source: ruleSource,
      comment: ruleComment,
    });
    setShowAddRuleModal(false);
  };

  const handleCreateBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanIp) return;
    banIp(newBanIp, newBanReason);
    setNewBanIp('');
    setShowBanModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Security Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <h3 className="text-base font-semibold text-white">
            {isAr ? 'الجدار الناري وأمن الشبكة السحابية' : 'Network Firewall & DDoS Mitigation'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'تصفية حزم البيانات الصادرة والواردة، وحظر عناوين IP المشبوهة، والتصدي للهجمات الموزعة.'
              : 'Inbound packet filtering, automatic exploit blocking, and real-time IP blacklisting.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleDdosShield(!systemConfig.ddosShield)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-colors ${
              systemConfig.ddosShield
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>
              {isAr
                ? systemConfig.ddosShield
                  ? 'درع DDoS: مفعل'
                  : 'درع DDoS: معطل'
                : systemConfig.ddosShield
                ? 'DDoS Shield: Active'
                : 'DDoS Shield: Off'}
            </span>
          </button>
        </div>
      </div>

      {/* Firewall Rules Section */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-white">
              {isAr ? 'قواعد توجيه المنافذ (Firewall Port Rules)' : 'Firewall Port & Packet Rules'}
            </h4>
          </div>

          <button
            onClick={() => setShowAddRuleModal(true)}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة قاعدة جديدة' : 'Add Rule'}</span>
          </button>
        </div>

        {/* Rules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/80 font-mono">
                <th className="py-2.5 px-3 text-start">{isAr ? 'المنفذ' : 'Port'}</th>
                <th className="py-2.5 px-3 text-start">{isAr ? 'البروتوكول' : 'Protocol'}</th>
                <th className="py-2.5 px-3 text-start">{isAr ? 'الإجراء' : 'Action'}</th>
                <th className="py-2.5 px-3 text-start">{isAr ? 'المصدر' : 'Source'}</th>
                <th className="py-2.5 px-3 text-start">{isAr ? 'الوصف' : 'Description'}</th>
                <th className="py-2.5 px-3 text-end">{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {firewallRules.map((rule) => {
                const isAllow = rule.action === 'ALLOW';

                return (
                  <tr key={rule.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white tabular-nums">{rule.port}</td>
                    <td className="py-3 px-3 text-slate-300">{rule.protocol}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isAllow
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {rule.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{rule.source}</td>
                    <td className="py-3 px-3 text-slate-300 font-sans">{rule.comment}</td>
                    <td className="py-3 px-3 text-end">
                      <button
                        onClick={() => deleteFirewallRule(rule.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title={isAr ? 'حذف القاعدة' : 'Delete Rule'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Banned IPs Section */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-semibold text-white">
              {isAr ? 'القائمة السوداء لعناوين IP المحظورة' : 'Active IP Blacklist & Threat Quarantine'}
            </h4>
          </div>

          <button
            onClick={() => setShowBanModal(true)}
            className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAr ? 'حظر عنوان IP جديد' : 'Ban Suspicious IP'}</span>
          </button>
        </div>

        {bannedIps.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {isAr ? 'لا توجد عناوين IP محظورة حالياً.' : 'No banned IP addresses in blacklist.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 font-mono">
                  <th className="py-2.5 px-3 text-start">{isAr ? 'عنوان IP' : 'IP Address'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'سبب الحظر' : 'Ban Reason'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'محاولات الهجوم' : 'Attempts'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'تاريخ الحظر' : 'Timestamp'}</th>
                  <th className="py-2.5 px-3 text-end">{isAr ? 'فك الحظر' : 'Unban'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {bannedIps.map((ban) => (
                  <tr key={ban.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-rose-400">{ban.ip}</td>
                    <td className="py-3 px-3 text-slate-300 font-sans">{ban.reason}</td>
                    <td className="py-3 px-3 text-slate-400 tabular-nums">{ban.attempts}</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">{ban.bannedAt}</td>
                    <td className="py-3 px-3 text-end">
                      <button
                        onClick={() => unbanIp(ban.ip)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-700/60 rounded text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Unlock className="w-3 h-3" />
                        <span>{isAr ? 'فك الحظر' : 'Unban'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Rule Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                {isAr ? 'إضافة قاعدة جدار ناري جديدة' : 'Add Firewall Inbound Rule'}
              </h4>
              <button
                onClick={() => setShowAddRuleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'رقم المنفذ (Port Number)' : 'Port Number'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="65535"
                  value={rulePort}
                  onChange={(e) => setRulePort(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    {isAr ? 'البروتوكول' : 'Protocol'}
                  </label>
                  <select
                    value={ruleProtocol}
                    onChange={(e) => setRuleProtocol(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ANY">ANY (All)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    {isAr ? 'نوع الإجراء' : 'Policy Action'}
                  </label>
                  <select
                    value={ruleAction}
                    onChange={(e) => setRuleAction(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALLOW">ALLOW (سماح)</option>
                    <option value="DENY">DENY (حظر)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'نطاق المصدر IP / CIDR' : 'Source IP / CIDR'}
                </label>
                <input
                  type="text"
                  value={ruleSource}
                  onChange={(e) => setRuleSource(e.target.value)}
                  placeholder="0.0.0.0/0"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'وصف القاعدة' : 'Rule Description / Note'}
                </label>
                <input
                  type="text"
                  value={ruleComment}
                  onChange={(e) => setRuleComment(e.target.value)}
                  placeholder="e.g. Node API Gateway"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium"
                >
                  {isAr ? 'حفظ وتطبيق القاعدة' : 'Deploy Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ban IP Modal */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                {isAr ? 'حظر عنوان IP جديد في الجدار الناري' : 'Quarantine / Ban IP Address'}
              </h4>
              <button
                onClick={() => setShowBanModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBan} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'عنوان الآي بي المراد حظره' : 'Target IPv4 / IPv6'}
                </label>
                <input
                  type="text"
                  value={newBanIp}
                  onChange={(e) => setNewBanIp(e.target.value)}
                  placeholder="e.g. 198.51.100.42"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'سبب الحظر' : 'Ban Reason / Incident Note'}
                </label>
                <input
                  type="text"
                  value={newBanReason}
                  onChange={(e) => setNewBanReason(e.target.value)}
                  placeholder="e.g. Excessive login brute force"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBanModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium"
                >
                  {isAr ? 'حظر العنوان فوراً' : 'Enforce Ban Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
