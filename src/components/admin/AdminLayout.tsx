import React from 'react';
import { useServer, AdminTab } from '../../context/ServerContext';
import { OverviewTab } from './tabs/OverviewTab';
import { ServersTab } from './tabs/ServersTab';
import { ServerCmsTab } from './tabs/ServerCmsTab';
import { ServicesTab } from './tabs/ServicesTab';
import { SecurityFirewallTab } from './tabs/SecurityFirewallTab';
import { TerminalTab } from './tabs/TerminalTab';
import { BackupsTab } from './tabs/BackupsTab';
import { LogsTab } from './tabs/LogsTab';
import { UsersTab } from './tabs/UsersTab';
import { SettingsTab } from './tabs/SettingsTab';
import {
  LayoutDashboard,
  Server,
  FileText,
  Layers,
  ShieldCheck,
  Terminal,
  Camera,
  ScrollText,
  Users,
  Settings,
  LogOut,
  Globe,
  Lock,
  Radio,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    lang,
    toggleLang,
    adminTab,
    setAdminTab,
    currentUser,
    logout,
    setCurrentView,
    systemConfig,
    toggleLockdown,
    servers,
  } = useServer();

  const isAr = lang === 'ar';

  const runningServers = servers.filter((s) => s.status === 'running').length;

  const navItems: { id: AdminTab; label: string; labelAr: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', labelAr: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'servers', label: 'Server Fleet', labelAr: 'عناقيد السيرفرات', icon: Server },
    { id: 'cms', label: 'Server CMS', labelAr: 'إدارة المحتوى (CMS)', icon: FileText },
    { id: 'services', label: 'Services & Daemons', labelAr: 'خدمات النظام', icon: Layers },
    { id: 'firewall', label: 'Firewall & WAF', labelAr: 'الجدار الناري والأمان', icon: ShieldCheck },
    { id: 'terminal', label: 'Root Web Terminal', labelAr: 'طرفية الأوامر الحية', icon: Terminal },
    { id: 'backups', label: 'Snapshots & Backups', labelAr: 'النسخ الاحتياطي', icon: Camera },
    { id: 'logs', label: 'Audit Logs', labelAr: 'سجلات المراقبة', icon: ScrollText },
    { id: 'users', label: 'Admin Accounts', labelAr: 'المشرفين والصلاحيات', icon: Users },
    { id: 'settings', label: 'Settings & Lockdown', labelAr: 'الإعدادات والطوارئ', icon: Settings },
  ];

  const renderActiveTab = () => {
    switch (adminTab) {
      case 'overview':
        return <OverviewTab />;
      case 'servers':
        return <ServersTab />;
      case 'cms':
        return <ServerCmsTab />;
      case 'services':
        return <ServicesTab />;
      case 'firewall':
        return <SecurityFirewallTab />;
      case 'terminal':
        return <TerminalTab />;
      case 'backups':
        return <BackupsTab />;
      case 'logs':
        return <LogsTab />;
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/95 border-b md:border-b-0 md:border-e border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand & Security Status */}
          <div className="p-4 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-950/40">
                  APX
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white tracking-tight">ApexCore Console</h1>
                  <p className="text-[10px] text-cyan-400 font-mono">ROOT CONTROL // ISOLATED</p>
                </div>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{runningServers}/{servers.length}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{isAr ? item.labelAr : item.label}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px]">
                      {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Exit to Public */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
          {/* User badge */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.username || 'Root Admin'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {isAr ? currentUser?.roleAr || 'المشرف العام' : currentUser?.role || 'Super Admin'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
              title={isAr ? 'تسجيل الخروج وقفل اللوحة' : 'Logout & Lock Console'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick exit to public portal */}
          <button
            onClick={() => setCurrentView('public')}
            className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-slate-700/60"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isAr ? 'العودة للموقع العام للزوار' : 'View Public Platform'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract (1 row, contextual breadcrumb, actions, status) */}
        <header className="px-6 py-3.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between gap-4">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 truncate">
            <span>ApexCore</span>
            <span>/</span>
            <span>Cloud Infrastructure</span>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">
              {navItems.find((n) => n.id === adminTab)?.[isAr ? 'labelAr' : 'label']}
            </span>
          </div>

          {/* Actions on right */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Panic Lockdown Emergency Button */}
            <button
              onClick={() => toggleLockdown(!systemConfig.lockdownActive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border ${
                systemConfig.lockdownActive
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                  : 'bg-slate-900 text-rose-300 border-rose-900/40 hover:bg-rose-950/50'
              }`}
              title={isAr ? 'عزل الطوارئ الأمني' : 'Emergency Panic Lockdown'}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>
                {systemConfig.lockdownActive
                  ? isAr
                    ? 'الإغلاق الأمني مفعل!'
                    : 'LOCKDOWN ACTIVE'
                  : isAr
                  ? 'عزل الطوارئ'
                  : 'Panic Lockdown'}
              </span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </header>

        {/* Tab Viewport */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};
