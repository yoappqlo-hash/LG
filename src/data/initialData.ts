import { ServerNode, ServiceDaemon, FirewallRule, BannedIp, AdminUser, LogEntry, BackupSnapshot, SystemConfig } from '../types/server';

export const INITIAL_SERVERS: ServerNode[] = [
  {
    id: 'srv-us-east-1',
    name: 'Production Primary Cluster (US-East)',
    nameAr: 'عنقود الإنتاج الرئيسي (شرق أمريكا)',
    region: 'Virginia, US',
    regionAr: 'فرجينيا، الولايات المتحدة',
    ip: '192.241.140.22',
    status: 'running',
    cpuUsage: 38,
    ramUsage: 64,
    diskUsage: 52,
    cores: 16,
    ramGb: 64,
    diskGb: 1000,
    uptime: '99.98%',
    activeSince: '48 days',
    bandwidthGb: 1420.5,
    os: 'Ubuntu 24.04 LTS (Kernel 6.8)',
  },
  {
    id: 'srv-me-central-1',
    name: 'Riyadh Edge Node & Web Proxy',
    nameAr: 'عقدة حافة الرياض وبوابة الويب',
    region: 'Riyadh, Saudi Arabia',
    regionAr: 'الرياض، المملكة العربية السعودية',
    ip: '185.190.22.4',
    status: 'running',
    cpuUsage: 24,
    ramUsage: 41,
    diskUsage: 28,
    cores: 8,
    ramGb: 32,
    diskGb: 500,
    uptime: '100%',
    activeSince: '21 days',
    bandwidthGb: 2850.2,
    os: 'Debian 12 Bookworm (Hardened)',
  },
  {
    id: 'srv-eu-central-1',
    name: 'High-Availability Database Shard',
    nameAr: 'عقدة قواعد البيانات عالية التوفر (فرانكفورت)',
    region: 'Frankfurt, Germany',
    regionAr: 'فرانكفورت، ألمانيا',
    ip: '159.65.120.88',
    status: 'running',
    cpuUsage: 52,
    ramUsage: 81,
    diskUsage: 67,
    cores: 32,
    ramGb: 128,
    diskGb: 2048,
    uptime: '99.99%',
    activeSince: '124 days',
    bandwidthGb: 980.7,
    os: 'Rocky Linux 9 (Enterprise)',
  },
  {
    id: 'srv-ap-southeast-1',
    name: 'Async Workers & Compute Queue',
    nameAr: 'طابور المهام وخوادم المعالجة (سنغافورة)',
    region: 'Singapore, SG',
    regionAr: 'سنغافورة',
    ip: '128.199.202.15',
    status: 'running',
    cpuUsage: 68,
    ramUsage: 55,
    diskUsage: 44,
    cores: 24,
    ramGb: 96,
    diskGb: 1500,
    uptime: '99.94%',
    activeSince: '9 days',
    bandwidthGb: 710.4,
    os: 'Ubuntu 24.04 LTS',
  },
];

export const INITIAL_SERVICES: ServiceDaemon[] = [
  {
    id: 'svc-nginx',
    name: 'Nginx Reverse Proxy',
    nameAr: 'خادم الويب وموزع الأحمال Nginx',
    type: 'Web Server / SSL Termination',
    port: 443,
    status: 'active',
    memoryMb: 420,
    cpuPercent: 3.2,
    autoRestart: true,
    description: 'Handles incoming TLS connections, SSL handshake & load distribution.',
    descriptionAr: 'معالجة اتصالات التشفير الآمنة وتوزيع الأحمال على السيرفرات الداخلية.',
  },
  {
    id: 'svc-postgres',
    name: 'PostgreSQL v16.2 Main Engine',
    nameAr: 'محرك قواعد البيانات PostgreSQL v16',
    type: 'Relational Database',
    port: 5432,
    status: 'active',
    memoryMb: 8400,
    cpuPercent: 14.5,
    autoRestart: true,
    description: 'Main transactional cluster storage with WAL streaming replication.',
    descriptionAr: 'قاعدة البيانات التشغيلية الرئيسية مع نسخ متزامن وحماية من التوقف.',
  },
  {
    id: 'svc-redis',
    name: 'Redis In-Memory Key-Value',
    nameAr: 'ذاكرة التخزين المؤقت الفائقة Redis',
    type: 'Cache & Session Store',
    port: 6379,
    status: 'active',
    memoryMb: 2150,
    cpuPercent: 4.1,
    autoRestart: true,
    description: 'Ultra fast in-memory key-value cache and user session tokens.',
    descriptionAr: 'تخزين كاش الذاكرة المؤقتة وجلسات المستخدمين بسرعة فائقة.',
  },
  {
    id: 'svc-docker',
    name: 'Docker Daemon & Containerd',
    nameAr: 'محرك الحاويات Docker Daemon',
    type: 'Container Runtime',
    port: 2375,
    status: 'active',
    memoryMb: 3600,
    cpuPercent: 11.8,
    autoRestart: true,
    description: 'Runs 34 microservice containers across application clusters.',
    descriptionAr: 'تشغيل وإدارة 34 حاوية خدمات مصغرة عبر العناقيد السحابية.',
  },
  {
    id: 'svc-sshd',
    name: 'OpenSSH Secure Daemon',
    nameAr: 'بوابة الوصول الآمن SSH Daemon',
    type: 'Remote Management',
    port: 22,
    status: 'active',
    memoryMb: 85,
    cpuPercent: 0.2,
    autoRestart: true,
    description: 'Hardened cryptographic SSH shell for authenticated admins.',
    descriptionAr: 'خدمة الاتصال الطرفي المشفر بمفاتيح Ed25519 للمشرفين المعتمدين.',
  },
  {
    id: 'svc-cron',
    name: 'Cron Worker & Queue Scheduler',
    nameAr: 'مجدول المهام الآلية Cron & Workers',
    type: 'Background Tasks',
    port: 8089,
    status: 'active',
    memoryMb: 310,
    cpuPercent: 1.8,
    autoRestart: true,
    description: 'Automated nightly backups, log pruning, and metrics archiving.',
    descriptionAr: 'تنفيذ مهام النسخ الاحتياطي التلقائي وأرشفة السجلات ومراقبة الأداء.',
  },
];

export const INITIAL_FIREWALL_RULES: FirewallRule[] = [
  {
    id: 'fw-1',
    port: 443,
    protocol: 'TCP',
    direction: 'INBOUND',
    action: 'ALLOW',
    source: '0.0.0.0/0 (Global)',
    comment: 'HTTPS Secure Public Web Traffic',
    createdAt: '2026-01-10',
  },
  {
    id: 'fw-2',
    port: 80,
    protocol: 'TCP',
    direction: 'INBOUND',
    action: 'ALLOW',
    source: '0.0.0.0/0 (Global)',
    comment: 'HTTP Standard Port (Auto Redirect to HTTPS)',
    createdAt: '2026-01-10',
  },
  {
    id: 'fw-3',
    port: 22,
    protocol: 'TCP',
    direction: 'INBOUND',
    action: 'ALLOW',
    source: '10.0.0.0/8 (Admin VPN Only)',
    comment: 'SSH Remote Console - Restricted to Admin CIDR',
    createdAt: '2026-02-14',
  },
  {
    id: 'fw-4',
    port: 5432,
    protocol: 'TCP',
    direction: 'INBOUND',
    action: 'DENY',
    source: '0.0.0.0/0 (Public Internet)',
    comment: 'Isolate PostgreSQL from direct public access',
    createdAt: '2026-01-15',
  },
  {
    id: 'fw-5',
    port: 6379,
    protocol: 'TCP',
    direction: 'INBOUND',
    action: 'DENY',
    source: '0.0.0.0/0 (Public Internet)',
    comment: 'Block public exposure of Redis cache',
    createdAt: '2026-01-15',
  },
];

export const INITIAL_BANNED_IPS: BannedIp[] = [
  {
    id: 'ban-1',
    ip: '194.26.29.112',
    reason: 'SSH Dictionary brute-force attack on port 22',
    bannedAt: '2026-10-23 09:14',
    attempts: 142,
  },
  {
    id: 'ban-2',
    ip: '45.154.255.89',
    reason: 'Malicious SQL injection scanner on /api/v1/query',
    bannedAt: '2026-10-23 11:30',
    attempts: 88,
  },
  {
    id: 'ban-3',
    ip: '185.220.101.5',
    reason: 'High-frequency SYN Flood DDoS attempt',
    bannedAt: '2026-10-22 17:02',
    attempts: 4200,
  },
];

export const INITIAL_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    username: 'root_admin',
    email: 'admin@apexcore.cloud',
    role: 'Root Super Admin',
    roleAr: 'المشرف العام (Root)',
    lastLogin: 'Active Now',
    twoFactorEnabled: true,
    status: 'active',
  },
  {
    id: 'usr-2',
    username: 'tariq_devops',
    email: 'tariq.s@apexcore.cloud',
    role: 'DevOps Lead',
    roleAr: 'مدير العمليات DevOps',
    lastLogin: '2 hours ago',
    twoFactorEnabled: true,
    status: 'active',
  },
  {
    id: 'usr-3',
    username: 'sarah_secops',
    email: 'sarah.k@apexcore.cloud',
    role: 'Security Auditor',
    roleAr: 'مدقق الأمان',
    lastLogin: 'Yesterday 18:40',
    twoFactorEnabled: true,
    status: 'active',
  },
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '13:48:12',
    level: 'info',
    source: 'SYSTEM_DAEMON',
    message: 'Kernel sync completed. All node health checks passed with 0 errors.',
    messageAr: 'تمت مزامنة النواة بنجاح. جميع فحوصات سلامة العقد اجتازت بنسبة 100%.',
  },
  {
    id: 'log-2',
    timestamp: '13:45:05',
    level: 'security',
    source: 'FIREWALL_WAF',
    message: 'Blocked automated port scan from IP 194.26.29.112 on port 22.',
    messageAr: 'تم حظر فحص منافذ آلي غير مصرح من العنوان 194.26.29.112 على المنفذ 22.',
  },
  {
    id: 'log-3',
    timestamp: '13:30:00',
    level: 'info',
    source: 'CRON_WORKER',
    message: 'Automated snapshot backup created for cluster srv-me-central-1 (32.4 GB).',
    messageAr: 'تم إنشاء نسخة احتياطية فورية للعقدة srv-me-central-1 بحجم 32.4 جيجابايت.',
  },
  {
    id: 'log-4',
    timestamp: '13:12:44',
    level: 'warn',
    source: 'STORAGE_MONITOR',
    message: 'Disk volume /dev/nvme0n1 on Frankfurt node reached 67% capacity.',
    messageAr: 'وحدة التخزين /dev/nvme0n1 في عقدة فرانكفورت وصلت إلى 67% من السعة.',
  },
  {
    id: 'log-5',
    timestamp: '12:50:19',
    level: 'info',
    source: 'NGINX_PROXY',
    message: 'TLS certificates renewed successfully via Let\'s Encrypt ACME challenge.',
    messageAr: 'تم تجديد شهادات التشفير TLS بنجاح عبر تحدي ACME.',
  },
];

export const INITIAL_BACKUPS: BackupSnapshot[] = [
  {
    id: 'bsp-101',
    name: 'daily-full-snapshot-us-east-1',
    serverId: 'srv-us-east-1',
    serverName: 'Production Primary Cluster',
    sizeGb: 142.8,
    createdAt: '2026-10-23 04:00',
    status: 'ready',
  },
  {
    id: 'bsp-102',
    name: 'db-replica-frankfurt-pre-patch',
    serverId: 'srv-eu-central-1',
    serverName: 'High-Availability Database',
    sizeGb: 310.2,
    createdAt: '2026-10-22 22:30',
    status: 'ready',
  },
  {
    id: 'bsp-103',
    name: 'riyadh-edge-config-state',
    serverId: 'srv-me-central-1',
    serverName: 'Riyadh Edge Node',
    sizeGb: 32.4,
    createdAt: '2026-10-23 13:30',
    status: 'ready',
  },
];

export const INITIAL_CONFIG: SystemConfig = {
  maintenanceMode: false,
  maintenanceMessage: 'ApexCore Cloud is currently undergoing scheduled infrastructure optimization.',
  maintenanceMessageAr: 'تجري منصة أبيكس كلاود حالياً أعمال صيانة دورية مجدولة وتحديثات على البنية التحتية.',
  lockdownActive: false,
  autoScaling: true,
  ddosShield: true,
  auditLogging: true,
};

export const INITIAL_ANNOUNCEMENTS: import('../types/server').AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Riyadh Datacenter NVMe Gen5 Storage Upgrade Completed',
    titleAr: 'اكتمال ترقية مصفوفة تخزين NVMe الجيل الخامس في مركز بيانات الرياض',
    content: 'We have finished upgrading primary storage to PCI-e Gen5 NVMe with sustained 14,000 MB/s read throughput and 0.05ms average I/O latency.',
    contentAr: 'تم الانتهاء بنجاح من ترقية مصفوفات التخزين الرئيسية في مركز بيانات الرياض إلى أقراص NVMe فائقة السرعة مع سرعات قراءة تصل إلى 14,000 ميجابايت/ثانية.',
    type: 'release',
    published: true,
    publishedAt: '2026-10-22',
    pinned: true,
  },
  {
    id: 'ann-2',
    title: 'Scheduled PostgreSQL Engine Security Patch (v16.4)',
    titleAr: 'تحديث أمني مجدول لمحركات قواعد البيانات PostgreSQL v16.4',
    content: 'A non-disruptive rolling restart will occur on Sunday at 02:00 UTC across the Frankfurt cluster. No downtime expected due to multi-AZ streaming replication.',
    contentAr: 'سيتم تطبيق التحديث الأمني الدوري لقواعد البيانات يوم الأحد الساعة 02:00 صباحاً بتوقيت مكة دون انقطاع للخدمة بفضل النسخ المتزامن متعدد المناطق.',
    type: 'maintenance',
    published: true,
    publishedAt: '2026-10-21',
    pinned: false,
  },
  {
    id: 'ann-3',
    title: 'New DDoS Anti-Flooding Heuristics Deployed',
    titleAr: 'تفعيل خوارزميات الحماية الذكية من هجمات حجب الخدمة الموزعة',
    content: 'Edge gateway filters now drop Layer 7 volumetric attacks before touching backend microservices.',
    contentAr: 'تم تعزيز الجدار الناري على مستوى الحافة لتحييد هجمات الطبقة السابعة L7 فورياً وحماية الخدمات السحابية من أي تذبذب.',
    type: 'info',
    published: true,
    publishedAt: '2026-10-18',
    pinned: false,
  },
];

export const INITIAL_RUNBOOKS: import('../types/server').RunbookDoc[] = [
  {
    id: 'rb-1',
    title: 'PostgreSQL Primary Shard Failover Protocol',
    titleAr: 'دليل إجراءات التحويل الطارئ لقاعدة بيانات PostgreSQL الأساسية',
    category: 'database',
    categoryAr: 'قواعد البيانات',
    content: `1. Verify primary node connectivity via CLI: \`pg_isready -h 159.65.120.88 -p 5432\`
2. If unresponsive for > 45s, initiate standby promotion:
   \`repmgr standby promote -f /etc/repmgr.conf\`
3. Point HAProxy or Nginx upstream to promoted replica IP.
4. Notify DevOps on-call team and review WAL replication logs.`,
    contentAr: `1. التحقق من استجابة العقدة الرئيسية عبر الطرفية: \`pg_isready -h 159.65.120.88 -p 5432\`
2. في حال انقطاع الاستجابة لأكثر من 45 ثانية، ترقية النسخة الاحتياطية فوراً:
   \`repmgr standby promote -f /etc/repmgr.conf\`
3. تحويل مسار الطلبات في Nginx إلى العنوان البديل الجديد.
4. إشعار فريق العمليات ومراجعة سجلات مزامنة البيانات WAL.`,
    updatedAt: '2026-10-15',
    author: 'root_admin',
  },
  {
    id: 'rb-2',
    title: 'DDoS Mitigation & Emergency Traffic Shedding',
    titleAr: 'دليل إجراءات التصدي لهجمات DDoS وعزل حركة المرور الضارة',
    category: 'security',
    categoryAr: 'الأمان والشبكات',
    content: `1. Enable Panic Lockdown in Admin Settings.
2. Inspect Top Ingress IPs via Terminal: \`netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n\`
3. Add offender subnets to Quarantine Blacklist via Security & Firewall tab.
4. Verify Cloudflare/Edge rate-limiting thresholds.`,
    contentAr: `1. تفعيل وضع الإغلاق الأمني الطارئ في إعدادات لوحة التحكم.
2. فحص العناوين الأكثر إرسالاً للطلبات عبر الطرفية: \`netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n\`
3. إضافة النطاقات المخالفة إلى القائمة السوداء فوراً من قسم الجدار الناري.
4. التأكد من انخفاض الضغط على منافذ 443 واستقرار معدل المعالجة.`,
    updatedAt: '2026-10-18',
    author: 'sarah_secops',
  },
  {
    id: 'rb-3',
    title: 'Zero-Downtime SSL/TLS Certificate Rotation',
    titleAr: 'دليل تجديد شهادات التشفير الرقمية دون توقف للخدمة',
    category: 'compliance',
    categoryAr: 'الامتثال والتشفير',
    content: `1. Run dry-run certificate check: \`certbot renew --dry-run\`
2. Reload Nginx without disconnecting active client sockets:
   \`nginx -s reload\`
3. Validate cipher strength: verify TLS 1.3 curve X25519 handshake.`,
    contentAr: `1. فحص صلاحية الشهادات الرقمية عبر الأمر التجريبي: \`certbot renew --dry-run\`
2. إعادة تحميل خادم Nginx برفق دون قطع الجلسات النشطة:
   \`nginx -s reload\`
3. التأكد من تفعيل بروتوكول TLS 1.3 وأعلى معايير التشفير القياسية.`,
    updatedAt: '2026-10-20',
    author: 'tariq_devops',
  },
];

export const INITIAL_ROLE_PERMISSIONS: import('../types/server').RolePermissions[] = [
  {
    role: 'Root Super Admin',
    canRebootServers: true,
    canScaleHardware: true,
    canEditFirewall: true,
    canUseTerminal: true,
    canManageBackups: true,
    canEditCms: true,
    canManageUsers: true,
  },
  {
    role: 'DevOps Lead',
    canRebootServers: true,
    canScaleHardware: true,
    canEditFirewall: true,
    canUseTerminal: true,
    canManageBackups: true,
    canEditCms: false,
    canManageUsers: false,
  },
  {
    role: 'Security Auditor',
    canRebootServers: false,
    canScaleHardware: false,
    canEditFirewall: true,
    canUseTerminal: false,
    canManageBackups: false,
    canEditCms: true,
    canManageUsers: false,
  },
];

export const INITIAL_CONFIG_TEMPLATES: import('../types/server').ConfigTemplate[] = [
  {
    id: 'cfg-nginx',
    name: 'Nginx High-Throughput Edge Config',
    service: 'nginx',
    filePath: '/etc/nginx/nginx.conf',
    version: 'v2.4.1',
    lastUpdated: '2026-10-22',
    content: `user www-data;
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 8192;
    multi_accept on;
    use epoll;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # SSL Hardening
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}`,
  },
  {
    id: 'cfg-postgres',
    name: 'PostgreSQL Enterprise Tuning (64GB RAM)',
    service: 'postgresql',
    filePath: '/etc/postgresql/16/main/postgresql.conf',
    version: 'v16.2-prod',
    lastUpdated: '2026-10-19',
    content: `# Connectivity
max_connections = 300
superuser_reserved_connections = 5

# Memory Configuration for 64GB Node
shared_buffers = 16GB
effective_cache_size = 48GB
maintenance_work_mem = 2GB
work_mem = 64MB

# Write Ahead Log (WAL)
wal_level = replica
max_wal_size = 16GB
min_wal_size = 2GB
checkpoint_completion_target = 0.9
checkpoint_timeout = 15min

# Parallelism
max_worker_processes = 16
max_parallel_workers_per_gather = 4
max_parallel_workers = 16`,
  },
  {
    id: 'cfg-redis',
    name: 'Redis In-Memory LRU Eviction Policy',
    service: 'redis',
    filePath: '/etc/redis/redis.conf',
    version: 'v7.2.4',
    lastUpdated: '2026-10-14',
    content: `bind 127.0.0.1 ::1
protected-mode yes
port 6379
tcp-backlog 511
timeout 0
tcp-keepalive 300

# Memory Management
maxmemory 16gb
maxmemory-policy allkeys-lru
maxmemory-samples 7

# Persistence snapshotting
save 900 1
save 300 10
save 60 10000`,
  },
];

