import React, { useState } from 'react';
import { useServer } from '../../../context/ServerContext';
import { AdminUser } from '../../../types/server';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Trash2,
  Key,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
} from 'lucide-react';

export const UsersTab: React.FC = () => {
  const { lang, users, addUser, deleteUser, toggleUser2FA } = useServer();
  const isAr = lang === 'ar';

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminUser['role']>('DevOps Lead');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail) return;

    let roleAr: AdminUser['roleAr'] = 'مدير العمليات DevOps';
    if (newRole === 'Root Super Admin') roleAr = 'المشرف العام (Root)';
    if (newRole === 'Security Auditor') roleAr = 'مدقق الأمان';

    addUser(newUsername, newEmail, newRole, roleAr);
    setNewUsername('');
    setNewEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <h3 className="text-base font-semibold text-white">
            {isAr ? 'إدارة المشرفين وصلاحيات الوصول (IAM)' : 'Admin Accounts & RBAC Access Control'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'إدارة حسابات المشرفين، صلاحيات الجذر (Root)، وتأمين المصادقة الثنائية (2FA).'
              : 'Multi-role RBAC enforcement, session credentials, and hardware 2FA management.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{isAr ? 'إضافة مشرف جديد' : 'New Admin Operator'}</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-semibold text-white">
            {isAr ? 'حسابات المشرفين المعتمدين في النظام' : 'Authorized Administrator Profiles'}
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/80 font-mono">
                <th className="py-2.5 px-3 text-start">{isAr ? 'المستخدم' : 'Operator'}</th>
                <th className="py-2.5 px-3 text-start">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-2.5 px-3 text-start">{isAr ? 'الرتبة والصلاحية' : 'Role'}</th>
                <th className="py-2.5 px-3 text-start">{isAr ? 'المصادقة 2FA' : '2FA Status'}</th>
                <th className="py-2.5 px-3 text-start">{isAr ? 'آخر تسجيل دخول' : 'Last Active'}</th>
                <th className="py-2.5 px-3 text-end">{isAr ? 'الإجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {users.map((usr) => {
                const isRoot = usr.role === 'Root Super Admin';

                return (
                  <tr key={usr.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">
                        {usr.username[0].toUpperCase()}
                      </span>
                      <span>{usr.username}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{usr.email}</td>
                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isRoot
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isAr ? usr.roleAr : usr.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleUser2FA(usr.id)}
                        className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                          usr.twoFactorEnabled
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {usr.twoFactorEnabled
                          ? isAr
                            ? 'مفعل (Enforced)'
                            : 'Enforced'
                          : isAr
                          ? 'غير مفعل'
                          : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{usr.lastLogin}</td>
                    <td className="py-3 px-3 text-end">
                      {!isRoot && (
                        <button
                          onClick={() => deleteUser(usr.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                          title={isAr ? 'إلغاء الحساب' : 'Revoke Account'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                {isAr ? 'إضافة حساب مشرف جديد' : 'Provision New Administrator'}
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'اسم المستخدم' : 'Username'}
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. omar_sysadmin"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'البريد الإلكتروني المؤسسي' : 'Corporate Email'}
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="omar@apexcore.cloud"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'الرتبة والصلاحية (Role)' : 'Role & Permissions'}
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="DevOps Lead">DevOps Lead (مدير العمليات)</option>
                  <option value="Security Auditor">Security Auditor (مدقق الأمان)</option>
                  <option value="Root Super Admin">Root Super Admin (المشرف العام)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium"
                >
                  {isAr ? 'إنشاء وتفعيل الحساب' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
