export type ServerStatus = 'running' | 'stopped' | 'restarting' | 'maintenance';

export interface ServerNode {
  id: string;
  name: string;
  nameAr: string;
  region: string;
  regionAr: string;
  ip: string;
  status: ServerStatus;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  cores: number;
  ramGb: number;
  diskGb: number;
  uptime: string;
  activeSince: string;
  bandwidthGb: number;
  os: string;
}

export interface ServiceDaemon {
  id: string;
  name: string;
  nameAr: string;
  type: string;
  port: number;
  status: 'active' | 'inactive' | 'restarting';
  memoryMb: number;
  cpuPercent: number;
  autoRestart: boolean;
  description: string;
  descriptionAr: string;
}

export interface FirewallRule {
  id: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'ANY';
  direction: 'INBOUND' | 'OUTBOUND';
  action: 'ALLOW' | 'DENY';
  source: string;
  comment: string;
  createdAt: string;
}

export interface BannedIp {
  id: string;
  ip: string;
  reason: string;
  bannedAt: string;
  attempts: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'Root Super Admin' | 'DevOps Lead' | 'Security Auditor';
  roleAr: 'المشرف العام (Root)' | 'مدير العمليات DevOps' | 'مدقق الأمان';
  lastLogin: string;
  twoFactorEnabled: boolean;
  status: 'active' | 'suspended';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  source: string;
  message: string;
  messageAr: string;
}

export interface BackupSnapshot {
  id: string;
  name: string;
  serverId: string;
  serverName: string;
  sizeGb: number;
  createdAt: string;
  status: 'ready' | 'creating' | 'restoring';
}

export interface SystemConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceMessageAr: string;
  lockdownActive: boolean;
  autoScaling: boolean;
  ddosShield: boolean;
  auditLogging: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  type: 'info' | 'maintenance' | 'critical' | 'release';
  published: boolean;
  publishedAt: string;
  pinned: boolean;
}

export interface RunbookDoc {
  id: string;
  title: string;
  titleAr: string;
  category: 'disaster-recovery' | 'networking' | 'database' | 'security' | 'compliance';
  categoryAr: string;
  content: string;
  contentAr: string;
  updatedAt: string;
  author: string;
}

export interface RolePermissions {
  role: AdminUser['role'];
  canRebootServers: boolean;
  canScaleHardware: boolean;
  canEditFirewall: boolean;
  canUseTerminal: boolean;
  canManageBackups: boolean;
  canEditCms: boolean;
  canManageUsers: boolean;
}

export interface ConfigTemplate {
  id: string;
  name: string;
  service: string;
  filePath: string;
  content: string;
  lastUpdated: string;
  version: string;
}

