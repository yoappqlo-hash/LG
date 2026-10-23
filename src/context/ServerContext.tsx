import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServerNode,
  ServiceDaemon,
  FirewallRule,
  BannedIp,
  AdminUser,
  LogEntry,
  BackupSnapshot,
  SystemConfig,
  AnnouncementItem,
  RunbookDoc,
  RolePermissions,
  ConfigTemplate,
} from '../types/server';
import {
  INITIAL_SERVERS,
  INITIAL_SERVICES,
  INITIAL_FIREWALL_RULES,
  INITIAL_BANNED_IPS,
  INITIAL_USERS,
  INITIAL_LOGS,
  INITIAL_BACKUPS,
  INITIAL_CONFIG,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_RUNBOOKS,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_CONFIG_TEMPLATES,
} from '../data/initialData';

export type AdminTab =
  | 'overview'
  | 'servers'
  | 'cms'
  | 'services'
  | 'firewall'
  | 'terminal'
  | 'backups'
  | 'logs'
  | 'users'
  | 'settings';

interface ServerContextType {
  // Navigation & Localization
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  toggleLang: () => void;
  currentView: 'public' | 'admin';
  setCurrentView: (view: 'public' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Auth
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  authError: string | null;
  setAuthError: (err: string | null) => void;

  // Server Fleet Controls & CMS
  servers: ServerNode[];
  startServer: (id: string) => void;
  stopServer: (id: string) => void;
  restartServer: (id: string) => void;
  updateServerSpecs: (id: string, cores: number, ramGb: number, diskGb: number) => void;
  updateServerInfo: (id: string, updates: Partial<ServerNode>) => void;
  addServerNode: (server: Omit<ServerNode, 'id'>) => void;
  deleteServerNode: (id: string) => void;

  // Services Controls
  services: ServiceDaemon[];
  toggleService: (id: string) => void;
  restartService: (id: string) => void;

  // Firewall & Security
  firewallRules: FirewallRule[];
  addFirewallRule: (rule: Omit<FirewallRule, 'id' | 'createdAt'>) => void;
  deleteFirewallRule: (id: string) => void;
  bannedIps: BannedIp[];
  banIp: (ip: string, reason: string) => void;
  unbanIp: (ip: string) => void;

  // Users & Access Management (RBAC)
  users: AdminUser[];
  addUser: (username: string, email: string, role: AdminUser['role'], roleAr: AdminUser['roleAr']) => void;
  updateUserRole: (id: string, role: AdminUser['role'], roleAr: AdminUser['roleAr']) => void;
  updateUserStatus: (id: string, status: AdminUser['status']) => void;
  deleteUser: (id: string) => void;
  toggleUser2FA: (id: string) => void;
  rolePermissions: RolePermissions[];
  updateRolePermission: (role: AdminUser['role'], permissionKey: keyof Omit<RolePermissions, 'role'>, value: boolean) => void;

  // CMS: Announcements
  announcements: AnnouncementItem[];
  addAnnouncement: (item: Omit<AnnouncementItem, 'id' | 'publishedAt'>) => void;
  updateAnnouncement: (id: string, updates: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePublishAnnouncement: (id: string) => void;

  // CMS: Operational Runbooks
  runbooks: RunbookDoc[];
  addRunbook: (item: Omit<RunbookDoc, 'id' | 'updatedAt'>) => void;
  updateRunbook: (id: string, updates: Partial<RunbookDoc>) => void;
  deleteRunbook: (id: string) => void;

  // CMS: Config Templates
  configTemplates: ConfigTemplate[];
  updateConfigTemplate: (id: string, content: string, version: string) => void;
  applyConfigTemplate: (id: string) => void;

  // Backups
  backups: BackupSnapshot[];
  createBackup: (name: string, serverId: string) => void;
  restoreBackup: (id: string) => void;
  deleteBackup: (id: string) => void;

  // Logs
  logs: LogEntry[];
  addLog: (level: LogEntry['level'], message: string, messageAr: string, source?: string) => void;
  clearLogs: () => void;

  // System Configuration & Emergency
  systemConfig: SystemConfig;
  toggleMaintenance: (enabled: boolean, message?: string, messageAr?: string) => void;
  toggleLockdown: (enabled: boolean) => void;
  toggleAutoScaling: (enabled: boolean) => void;
  toggleDdosShield: (enabled: boolean) => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Localization
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('apex_lang') as 'ar' | 'en') || 'ar';
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('apex_lang', next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // View state: 'public' vs 'admin'
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('apex_admin_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('apex_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Core Data loaded from localStorage or defaults
  const [servers, setServers] = useState<ServerNode[]>(() => {
    const saved = localStorage.getItem('apex_servers');
    return saved ? JSON.parse(saved) : INITIAL_SERVERS;
  });

  const [services, setServices] = useState<ServiceDaemon[]>(() => {
    const saved = localStorage.getItem('apex_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>(() => {
    const saved = localStorage.getItem('apex_fw_rules');
    return saved ? JSON.parse(saved) : INITIAL_FIREWALL_RULES;
  });

  const [bannedIps, setBannedIps] = useState<BannedIp[]>(() => {
    const saved = localStorage.getItem('apex_banned_ips');
    return saved ? JSON.parse(saved) : INITIAL_BANNED_IPS;
  });

  const [users, setUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('apex_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('apex_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [backups, setBackups] = useState<BackupSnapshot[]>(() => {
    const saved = localStorage.getItem('apex_backups');
    return saved ? JSON.parse(saved) : INITIAL_BACKUPS;
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('apex_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  // CMS Collections
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    const saved = localStorage.getItem('apex_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [runbooks, setRunbooks] = useState<RunbookDoc[]>(() => {
    const saved = localStorage.getItem('apex_runbooks');
    return saved ? JSON.parse(saved) : INITIAL_RUNBOOKS;
  });

  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>(() => {
    const saved = localStorage.getItem('apex_role_permissions');
    return saved ? JSON.parse(saved) : INITIAL_ROLE_PERMISSIONS;
  });

  const [configTemplates, setConfigTemplates] = useState<ConfigTemplate[]>(() => {
    const saved = localStorage.getItem('apex_config_templates');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG_TEMPLATES;
  });

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem('apex_servers', JSON.stringify(servers));
  }, [servers]);

  useEffect(() => {
    localStorage.setItem('apex_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('apex_fw_rules', JSON.stringify(firewallRules));
  }, [firewallRules]);

  useEffect(() => {
    localStorage.setItem('apex_banned_ips', JSON.stringify(bannedIps));
  }, [bannedIps]);

  useEffect(() => {
    localStorage.setItem('apex_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('apex_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('apex_backups', JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    localStorage.setItem('apex_config', JSON.stringify(systemConfig));
  }, [systemConfig]);

  useEffect(() => {
    localStorage.setItem('apex_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('apex_runbooks', JSON.stringify(runbooks));
  }, [runbooks]);

  useEffect(() => {
    localStorage.setItem('apex_role_permissions', JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  useEffect(() => {
    localStorage.setItem('apex_config_templates', JSON.stringify(configTemplates));
  }, [configTemplates]);

  // Subtle real-time telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setServers((prev) =>
        prev.map((s) => {
          if (s.status !== 'running') return s;
          const cpuDelta = (Math.random() - 0.5) * 4;
          const ramDelta = (Math.random() - 0.5) * 1.5;
          return {
            ...s,
            cpuUsage: Math.min(96, Math.max(8, Math.round(s.cpuUsage + cpuDelta))),
            ramUsage: Math.min(95, Math.max(15, Math.round(s.ramUsage + ramDelta))),
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Helper to add log
  const addLog = (
    level: LogEntry['level'],
    message: string,
    messageAr: string,
    source: string = 'ADMIN_CONSOLE'
  ) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      level,
      source,
      message,
      messageAr,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 100)]);
  };

  // Auth methods
  const login = (username: string, pass: string): boolean => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (
      (trimmedUser === 'admin' || trimmedUser === 'root' || trimmedUser === 'root_admin') &&
      (trimmedPass === 'admin' || trimmedPass === 'admin2026' || trimmedPass === 'root' || trimmedPass === '2026')
    ) {
      const adminObj = users[0] || INITIAL_USERS[0];
      setIsAuthenticated(true);
      setCurrentUser(adminObj);
      localStorage.setItem('apex_admin_auth', 'true');
      localStorage.setItem('apex_admin_user', JSON.stringify(adminObj));
      setAuthError(null);
      addLog(
        'security',
        `User "${adminObj.username}" successfully authenticated with root privileges.`,
        `تم تسجيل دخول المشرف "${adminObj.username}" بنجاح بصلاحيات الجذر الكاملة.`,
        'AUTH_GUARD'
      );
      return true;
    } else {
      setAuthError(
        lang === 'ar'
          ? 'بيانات الاعتماد غير صالحة. يرجى استخدام اسم المستخدم admin وكلمة المرور admin أو النقر على الدخول السريع.'
          : 'Invalid credentials. Please use username "admin" and password "admin" or click Quick Login.'
      );
      addLog(
        'warn',
        `Failed administrative login attempt for identity "${username}".`,
        `محاولة دخول إدارية فاشلة للهوية "${username}".`,
        'AUTH_GUARD'
      );
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('apex_admin_auth');
    localStorage.removeItem('apex_admin_user');
    setCurrentView('public');
    addLog(
      'info',
      'Administrative session terminated. Locked console interface.',
      'تم إنهاء الجلسة الإدارية وتأمين لوحة التحكم.',
      'AUTH_GUARD'
    );
  };

  // Server controls & CMS
  const startServer = (id: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'running', cpuUsage: 25, ramUsage: 35 } : s))
    );
    const target = servers.find((s) => s.id === id);
    addLog(
      'info',
      `Server node ${target?.name || id} initialized and operational.`,
      `تم تشغيل عقدة السيرفر ${target?.nameAr || id} وعادت للعمل بكفاءة.`
    );
  };

  const stopServer = (id: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'stopped', cpuUsage: 0, ramUsage: 0 } : s))
    );
    const target = servers.find((s) => s.id === id);
    addLog(
      'warn',
      `Server node ${target?.name || id} received graceful shutdown command.`,
      `تم إيقاف تشغيل عقدة السيرفر ${target?.nameAr || id} بنجاح.`
    );
  };

  const restartServer = (id: string) => {
    const target = servers.find((s) => s.id === id);
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'restarting' } : s))
    );
    addLog(
      'warn',
      `Reboot initiated for node ${target?.name || id}. Services resetting...`,
      `بدء إعادة تشغيل العقدة ${target?.nameAr || id}. تجري إعادة تهيئة الخدمات...`
    );

    setTimeout(() => {
      setServers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'running', cpuUsage: 28 } : s))
      );
      addLog(
        'info',
        `Node ${target?.name || id} restart cycle finished. Health checks OK.`,
        `اكتملت دورة إعادة تشغيل السيرفر ${target?.nameAr || id}. الحالة ممتازة.`
      );
    }, 2400);
  };

  const updateServerSpecs = (id: string, cores: number, ramGb: number, diskGb: number) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, cores, ramGb, diskGb } : s))
    );
    const target = servers.find((s) => s.id === id);
    addLog(
      'info',
      `Hardware resources reallocated for ${target?.name || id}: ${cores} vCPU, ${ramGb}GB RAM, ${diskGb}GB NVMe.`,
      `تمت ترقية موارد العتاد للسيرفر ${target?.nameAr || id}: ${cores} أنوية، ${ramGb} جيجابايت رام، ${diskGb} جيجابايت تخزين.`
    );
  };

  const updateServerInfo = (id: string, updates: Partial<ServerNode>) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    addLog(
      'info',
      `CMS: Server metadata updated for node ID: ${id}.`,
      `نظام إدارة المحتوى: تم تحديث بيانات ومعلومات السيرفر (${id}) بنجاح.`,
      'CMS_ENGINE'
    );
  };

  const addServerNode = (serverData: Omit<ServerNode, 'id'>) => {
    const newId = `srv-${Date.now()}`;
    const newNode: ServerNode = {
      ...serverData,
      id: newId,
    };
    setServers((prev) => [...prev, newNode]);
    addLog(
      'info',
      `CMS: New server node deployed: ${newNode.name} (${newNode.ip}).`,
      `نظام إدارة المحتوى: تم نشر وإضافة عقدة سيرفر جديدة: ${newNode.nameAr} (${newNode.ip}).`,
      'CMS_ENGINE'
    );
  };

  const deleteServerNode = (id: string) => {
    const target = servers.find((s) => s.id === id);
    setServers((prev) => prev.filter((s) => s.id !== id));
    addLog(
      'warn',
      `CMS: Server node decommissioned: ${target?.name || id}.`,
      `نظام إدارة المحتوى: تم حذف وإخراج عقدة السيرفر ${target?.nameAr || id} من المنظومة.`,
      'CMS_ENGINE'
    );
  };

  // Service controls
  const toggleService = (id: string) => {
    let nextStatus: 'active' | 'inactive' = 'active';
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          nextStatus = s.status === 'active' ? 'inactive' : 'active';
          return {
            ...s,
            status: nextStatus,
            cpuPercent: nextStatus === 'active' ? 4.2 : 0,
            memoryMb: nextStatus === 'active' ? s.memoryMb : 0,
          };
        }
        return s;
      })
    );
    const target = services.find((s) => s.id === id);
    addLog(
      nextStatus === 'active' ? 'info' : 'warn',
      `Daemon service [${target?.name || id}] state transitioned to ${nextStatus.toUpperCase()}.`,
      `تم تغيير حالة خدمة النظام [${target?.nameAr || id}] إلى ${nextStatus === 'active' ? 'مفعلة' : 'متوقفة'}.`
    );
  };

  const restartService = (id: string) => {
    const target = services.find((s) => s.id === id);
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'restarting' } : s))
    );
    addLog(
      'info',
      `Signal SIGHUP sent to daemon [${target?.name || id}]. Reloading configurations...`,
      `تم إرسال إشارة التحديث للخدمة [${target?.nameAr || id}]. جاري إعادة التحميل...`
    );

    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'active' } : s))
      );
      addLog(
        'info',
        `Daemon [${target?.name || id}] successfully reloaded and listening on port ${target?.port}.`,
        `اكتملت إعادة تشغيل الخدمة [${target?.nameAr || id}] وتستقبل الطلبات على المنفذ ${target?.port}.`
      );
    }, 1500);
  };

  // Firewall
  const addFirewallRule = (rule: Omit<FirewallRule, 'id' | 'createdAt'>) => {
    const nowStr = new Date().toISOString().split('T')[0];
    const newRule: FirewallRule = {
      ...rule,
      id: `fw-${Date.now()}`,
      createdAt: nowStr,
    };
    setFirewallRules((prev) => [newRule, ...prev]);
    addLog(
      'security',
      `Firewall rule applied: ${rule.action} ${rule.protocol} port ${rule.port} from ${rule.source}.`,
      `تم تطبيق قاعدة جدار ناري جديدة: ${rule.action === 'ALLOW' ? 'سماح' : 'حظر'} ${rule.protocol} للمنفذ ${rule.port} من ${rule.source}.`
    );
  };

  const deleteFirewallRule = (id: string) => {
    const target = firewallRules.find((r) => r.id === id);
    setFirewallRules((prev) => prev.filter((r) => r.id !== id));
    addLog(
      'warn',
      `Removed firewall rule for port ${target?.port} (${target?.protocol}).`,
      `تم حذف قاعدة الجدار الناري للمنفذ ${target?.port} (${target?.protocol}).`
    );
  };

  const banIp = (ip: string, reason: string) => {
    if (bannedIps.some((b) => b.ip === ip)) return;
    const nowStr = new Date().toLocaleString();
    const newBan: BannedIp = {
      id: `ban-${Date.now()}`,
      ip: ip.trim(),
      reason: reason.trim() || 'Manual administrator block',
      bannedAt: nowStr,
      attempts: 1,
    };
    setBannedIps((prev) => [newBan, ...prev]);
    addLog(
      'security',
      `IP Address ${ip} has been permanently blocked. Reason: ${reason}`,
      `تم حظر عنوان الآي بي ${ip} فوراً عبر الجدار الناري. السبب: ${reason}`
    );
  };

  const unbanIp = (ip: string) => {
    setBannedIps((prev) => prev.filter((b) => b.ip !== ip));
    addLog(
      'info',
      `IP Address ${ip} unblocked and removed from blacklist.`,
      `تم فك الحظر عن العنوان ${ip} وإزالته من القائمة السوداء.`
    );
  };

  // Users & RBAC
  const addUser = (
    username: string,
    email: string,
    role: AdminUser['role'],
    roleAr: AdminUser['roleAr']
  ) => {
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      email: email.trim(),
      role,
      roleAr,
      lastLogin: 'Never',
      twoFactorEnabled: true,
      status: 'active',
    };
    setUsers((prev) => [...prev, newUser]);
    addLog(
      'security',
      `New administrative account created: ${username} with role [${role}].`,
      `تم إنشاء حساب إداري جديد: ${username} بالرتبة [${roleAr}].`
    );
  };

  const updateUserRole = (id: string, role: AdminUser['role'], roleAr: AdminUser['roleAr']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role, roleAr } : u))
    );
    const target = users.find((u) => u.id === id);
    addLog(
      'security',
      `RBAC: Updated role permissions for user "${target?.username}" to [${role}].`,
      `إدارة الصلاحيات: تم تعديل رتبة المشرف "${target?.username}" إلى [${roleAr}].`,
      'RBAC_SYSTEM'
    );
  };

  const updateUserStatus = (id: string, status: AdminUser['status']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status } : u))
    );
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addLog(
      'warn',
      `Administrative privileges revoked for operator ${target?.username}.`,
      `تم إلغاء صلاحيات الوصول للمشغل ${target?.username}.`
    );
  };

  const toggleUser2FA = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, twoFactorEnabled: !u.twoFactorEnabled } : u))
    );
  };

  const updateRolePermission = (
    role: AdminUser['role'],
    permissionKey: keyof Omit<RolePermissions, 'role'>,
    value: boolean
  ) => {
    setRolePermissions((prev) =>
      prev.map((rp) => (rp.role === role ? { ...rp, [permissionKey]: value } : rp))
    );
    addLog(
      'security',
      `RBAC Matrix: Role "${role}" permission "${String(permissionKey)}" set to ${value}.`,
      `مصفوفة الصلاحيات: تم ضبط إذن "${String(permissionKey)}" للرتبة "${role}" إلى ${value ? 'مسموح' : 'ممنوع'}.`,
      'RBAC_SYSTEM'
    );
  };

  // CMS: Announcements
  const addAnnouncement = (item: Omit<AnnouncementItem, 'id' | 'publishedAt'>) => {
    const newItem: AnnouncementItem = {
      ...item,
      id: `ann-${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newItem, ...prev]);
    addLog(
      'info',
      `CMS: Published announcement: "${newItem.title}".`,
      `نظام المحتوى: تم نشر تنبيه جديد: "${newItem.titleAr}".`,
      'CMS_ANNOUNCER'
    );
  };

  const updateAnnouncement = (id: string, updates: Partial<AnnouncementItem>) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addLog(
      'info',
      `CMS: Deleted announcement archive (${id}).`,
      `نظام المحتوى: تم حذف الإعلان (${id}).`,
      'CMS_ANNOUNCER'
    );
  };

  const togglePublishAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, published: !a.published } : a))
    );
  };

  // CMS: Runbooks
  const addRunbook = (item: Omit<RunbookDoc, 'id' | 'updatedAt'>) => {
    const newDoc: RunbookDoc = {
      ...item,
      id: `rb-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setRunbooks((prev) => [newDoc, ...prev]);
    addLog(
      'info',
      `CMS: Created operational runbook: "${newDoc.title}".`,
      `نظام المحتوى: تم إنشاء دليل تشغيلي جديد: "${newDoc.titleAr}".`,
      'CMS_RUNBOOKS'
    );
  };

  const updateRunbook = (id: string, updates: Partial<RunbookDoc>) => {
    setRunbooks((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : r))
    );
  };

  const deleteRunbook = (id: string) => {
    setRunbooks((prev) => prev.filter((r) => r.id !== id));
  };

  // CMS: Config Templates
  const updateConfigTemplate = (id: string, content: string, version: string) => {
    const today = new Date().toISOString().split('T')[0];
    setConfigTemplates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content, version, lastUpdated: today } : c))
    );
    const target = configTemplates.find((c) => c.id === id);
    addLog(
      'info',
      `CMS: Configuration profile "${target?.name}" updated to version ${version}.`,
      `نظام المحتوى: تم تعديل ملف الإعدادات "${target?.name}" إلى الإصدار ${version}.`,
      'CMS_CONFIG'
    );
  };

  const applyConfigTemplate = (id: string) => {
    const target = configTemplates.find((c) => c.id === id);
    addLog(
      'warn',
      `CMS: Deployed config "${target?.name}" (${target?.filePath}) to all fleet clusters. Restarting daemon.`,
      `نظام المحتوى: تم نشر ملف الإعدادات "${target?.name}" (${target?.filePath}) على جميع السيرفرات وإعادة تحميل الخدمة بنجاح.`,
      'CMS_CONFIG'
    );
  };

  // Backups
  const createBackup = (name: string, serverId: string) => {
    const srv = servers.find((s) => s.id === serverId) || servers[0];
    const newSnapshot: BackupSnapshot = {
      id: `bsp-${Date.now()}`,
      name: name || `snapshot-${srv.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      serverId: srv.id,
      serverName: srv.name,
      sizeGb: Math.round((srv.diskUsage / 100) * srv.diskGb * 0.4 * 10) / 10,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'ready',
    };
    setBackups((prev) => [newSnapshot, ...prev]);
    addLog(
      'info',
      `Full snapshot archive "${newSnapshot.name}" captured for ${srv.name}.`,
      `تم أخذ نسخة احتياطية كاملة وموثقة "${newSnapshot.name}" لسيرفر ${srv.nameAr}.`
    );
  };

  const restoreBackup = (id: string) => {
    const target = backups.find((b) => b.id === id);
    setBackups((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'restoring' } : b))
    );
    addLog(
      'warn',
      `Initiated image restoration from snapshot: ${target?.name}.`,
      `بدء عملية استعادة النسخة الاحتياطية للسيرفر من: ${target?.name}.`
    );
    setTimeout(() => {
      setBackups((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'ready' } : b))
      );
      addLog(
        'info',
        `Snapshot ${target?.name} successfully deployed. Disk states verified.`,
        `اكتملت استعادة النسخة ${target?.name} بنجاح. حالة التخزين متطابقة وسليمة.`
      );
    }, 2200);
  };

  const deleteBackup = (id: string) => {
    const target = backups.find((b) => b.id === id);
    setBackups((prev) => prev.filter((b) => b.id !== id));
    addLog(
      'info',
      `Deleted snapshot archive: ${target?.name}. Storage space released.`,
      `تم حذف النسخة الاحتياطية: ${target?.name}. تم تحرير مساحة التخزين.`
    );
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Global Config
  const toggleMaintenance = (enabled: boolean, message?: string, messageAr?: string) => {
    setSystemConfig((prev) => ({
      ...prev,
      maintenanceMode: enabled,
      maintenanceMessage: message || prev.maintenanceMessage,
      maintenanceMessageAr: messageAr || prev.maintenanceMessageAr,
    }));
    addLog(
      enabled ? 'warn' : 'info',
      `Global Maintenance Mode ${enabled ? 'ACTIVATED. Public traffic gated.' : 'DEACTIVATED. Public traffic restored.'}`,
      `وضع الصيانة الشامل ${enabled ? 'تم تفعيله! تم حجب الزوار وتوجيههم لصفحة الصيانة.' : 'تم إيقافه وعادت الخدمة للعمل بشكل طبيعي للجميع.'}`
    );
  };

  const toggleLockdown = (enabled: boolean) => {
    setSystemConfig((prev) => ({ ...prev, lockdownActive: enabled }));
    addLog(
      'security',
      `Emergency Infrastructure Lockdown ${enabled ? 'ENGAGED. Non-admin traffic suspended.' : 'DISENGAGED. Standard routing resumed.'}`,
      `وضع الإغلاق الأمني الطارئ ${enabled ? 'تم تفعيله! تم عزل السيرفرات وإيقاف الاتصالات غير الإدارية.' : 'تم إلغاؤه وعادت حركة المرور الاعتيادية.'}`
    );
  };

  const toggleAutoScaling = (enabled: boolean) => {
    setSystemConfig((prev) => ({ ...prev, autoScaling: enabled }));
    addLog(
      'info',
      `Automated cluster autoscaling ${enabled ? 'enabled' : 'disabled'}.`,
      `التوسع التلقائي للعناقيد السحابية ${enabled ? 'مفعل' : 'معطل'}.`
    );
  };

  const toggleDdosShield = (enabled: boolean) => {
    setSystemConfig((prev) => ({ ...prev, ddosShield: enabled }));
    addLog(
      'security',
      `DDoS Anti-Flooding Mitigation Shield ${enabled ? 'Armed' : 'Disarmed'}.`,
      `درع الحماية من هجمات حجب الخدمة الموزعة DDoS ${enabled ? 'مفعل ويعمل بأقصى حساسية' : 'معطل'}.`
    );
  };

  return (
    <ServerContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        isAuthenticated,
        currentUser,
        login,
        logout,
        authError,
        setAuthError,
        servers,
        startServer,
        stopServer,
        restartServer,
        updateServerSpecs,
        updateServerInfo,
        addServerNode,
        deleteServerNode,
        services,
        toggleService,
        restartService,
        firewallRules,
        addFirewallRule,
        deleteFirewallRule,
        bannedIps,
        banIp,
        unbanIp,
        users,
        addUser,
        updateUserRole,
        updateUserStatus,
        deleteUser,
        toggleUser2FA,
        rolePermissions,
        updateRolePermission,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        togglePublishAnnouncement,
        runbooks,
        addRunbook,
        updateRunbook,
        deleteRunbook,
        configTemplates,
        updateConfigTemplate,
        applyConfigTemplate,
        backups,
        createBackup,
        restoreBackup,
        deleteBackup,
        logs,
        addLog,
        clearLogs,
        systemConfig,
        toggleMaintenance,
        toggleLockdown,
        toggleAutoScaling,
        toggleDdosShield,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};
