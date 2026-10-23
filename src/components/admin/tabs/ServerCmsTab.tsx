import React, { useState } from 'react';
import { useServer } from '../../../context/ServerContext';
import { ServerNode, AnnouncementItem, RunbookDoc, RolePermissions } from '../../../types/server';
import {
  FileText,
  Server,
  Bell,
  BookOpen,
  ShieldCheck,
  Code,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Pin,
  Send,
  Eye,
  Sliders,
  AlertTriangle,
  RotateCw,
  HardDrive,
  Cpu,
  Layers,
} from 'lucide-react';

export const ServerCmsTab: React.FC = () => {
  const {
    lang,
    servers,
    updateServerInfo,
    addServerNode,
    deleteServerNode,
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    togglePublishAnnouncement,
    runbooks,
    addRunbook,
    updateRunbook,
    deleteRunbook,
    rolePermissions,
    updateRolePermission,
    configTemplates,
    updateConfigTemplate,
    applyConfigTemplate,
  } = useServer();

  const isAr = lang === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<
    'servers' | 'announcements' | 'runbooks' | 'rbac' | 'configs'
  >('servers');

  // Edit Server Modal State
  const [editingServer, setEditingServer] = useState<ServerNode | null>(null);
  const [isNewServerModal, setIsNewServerModal] = useState(false);
  const [serverFormData, setServerFormData] = useState<Partial<ServerNode>>({});

  // Announcement Modal State
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [annTitle, setAnnTitle] = useState('');
  const [annTitleAr, setAnnTitleAr] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annContentAr, setAnnContentAr] = useState('');
  const [annType, setAnnType] = useState<AnnouncementItem['type']>('info');
  const [annPinned, setAnnPinned] = useState(false);

  // Runbook Modal State
  const [showRunbookModal, setShowRunbookModal] = useState(false);
  const [editingRunbookId, setEditingRunbookId] = useState<string | null>(null);
  const [rbTitle, setRbTitle] = useState('');
  const [rbTitleAr, setRbTitleAr] = useState('');
  const [rbCategory, setRbCategory] = useState<RunbookDoc['category']>('database');
  const [rbCategoryAr, setRbCategoryAr] = useState('قواعد البيانات');
  const [rbContent, setRbContent] = useState('');
  const [rbContentAr, setRbContentAr] = useState('');

  // Config Template Active
  const [selectedConfigId, setSelectedConfigId] = useState(configTemplates[0]?.id || '');
  const [configContent, setConfigContent] = useState(configTemplates[0]?.content || '');
  const [configVersion, setConfigVersion] = useState(configTemplates[0]?.version || 'v1.0.0');
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  // Handle Server Edit
  const openEditServer = (s: ServerNode) => {
    setEditingServer(s);
    setServerFormData({ ...s });
    setIsNewServerModal(false);
  };

  const openNewServer = () => {
    setEditingServer(null);
    setServerFormData({
      name: 'New Cloud Compute Shard',
      nameAr: 'عقدة سحابية جديدة',
      region: 'Dubai, UAE',
      regionAr: 'دبي، الإمارات',
      ip: '185.20.14.88',
      status: 'running',
      cpuUsage: 12,
      ramUsage: 25,
      diskUsage: 18,
      cores: 16,
      ramGb: 64,
      diskGb: 1000,
      uptime: '100%',
      activeSince: 'Today',
      bandwidthGb: 120.0,
      os: 'Ubuntu 24.04 LTS (Optimized)',
    });
    setIsNewServerModal(true);
  };

  const handleSaveServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewServerModal) {
      addServerNode(serverFormData as Omit<ServerNode, 'id'>);
    } else if (editingServer) {
      updateServerInfo(editingServer.id, serverFormData);
    }
    setEditingServer(null);
    setIsNewServerModal(false);
  };

  // Handle Announcement
  const openNewAnnouncement = () => {
    setEditingAnnId(null);
    setAnnTitle('');
    setAnnTitleAr('');
    setAnnContent('');
    setAnnContentAr('');
    setAnnType('info');
    setAnnPinned(false);
    setShowAnnModal(true);
  };

  const openEditAnnouncement = (a: AnnouncementItem) => {
    setEditingAnnId(a.id);
    setAnnTitle(a.title);
    setAnnTitleAr(a.titleAr);
    setAnnContent(a.content);
    setAnnContentAr(a.contentAr);
    setAnnType(a.type);
    setAnnPinned(a.pinned);
    setShowAnnModal(true);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnnId) {
      updateAnnouncement(editingAnnId, {
        title: annTitle,
        titleAr: annTitleAr,
        content: annContent,
        contentAr: annContentAr,
        type: annType,
        pinned: annPinned,
      });
    } else {
      addAnnouncement({
        title: annTitle,
        titleAr: annTitleAr,
        content: annContent,
        contentAr: annContentAr,
        type: annType,
        pinned: annPinned,
        published: true,
      });
    }
    setShowAnnModal(false);
  };

  // Handle Runbook
  const openNewRunbook = () => {
    setEditingRunbookId(null);
    setRbTitle('');
    setRbTitleAr('');
    setRbCategory('database');
    setRbCategoryAr('قواعد البيانات');
    setRbContent('');
    setRbContentAr('');
    setShowRunbookModal(true);
  };

  const openEditRunbook = (r: RunbookDoc) => {
    setEditingRunbookId(r.id);
    setRbTitle(r.title);
    setRbTitleAr(r.titleAr);
    setRbCategory(r.category);
    setRbCategoryAr(r.categoryAr);
    setRbContent(r.content);
    setRbContentAr(r.contentAr);
    setShowRunbookModal(true);
  };

  const handleSaveRunbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRunbookId) {
      updateRunbook(editingRunbookId, {
        title: rbTitle,
        titleAr: rbTitleAr,
        category: rbCategory,
        categoryAr: rbCategoryAr,
        content: rbContent,
        contentAr: rbContentAr,
      });
    } else {
      addRunbook({
        title: rbTitle,
        titleAr: rbTitleAr,
        category: rbCategory,
        categoryAr: rbCategoryAr,
        content: rbContent,
        contentAr: rbContentAr,
        author: 'root_admin',
      });
    }
    setShowRunbookModal(false);
  };

  // Config Template Select
  const handleSelectConfig = (id: string) => {
    setSelectedConfigId(id);
    const tmpl = configTemplates.find((c) => c.id === id);
    if (tmpl) {
      setConfigContent(tmpl.content);
      setConfigVersion(tmpl.version);
    }
  };

  const handleSaveConfig = () => {
    updateConfigTemplate(selectedConfigId, configContent, configVersion);
    setConfigSavedNotice(true);
    setTimeout(() => setConfigSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              {isAr ? 'نظام إدارة المحتوى السحابي (Server CMS)' : 'Server Administration CMS'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'تعديل بيانات السيرفرات، إدارة تنبيهات النظام، صياغة الأدلة التشغيلية، وضبط مصفوفة الصلاحيات.'
              : 'Directly edit server fleet metadata, broadcast operational announcements, maintain runbooks, and fine-tune RBAC.'}
          </p>
        </div>
      </div>

      {/* CMS Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('servers')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeSubTab === 'servers'
              ? 'bg-cyan-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>{isAr ? 'بيانات السيرفرات والمعروضات' : 'Server Nodes Catalog'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('announcements')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeSubTab === 'announcements'
              ? 'bg-cyan-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{isAr ? 'التنبيهات والإعلانات العامة' : 'System Announcements'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('runbooks')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeSubTab === 'runbooks'
              ? 'bg-cyan-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isAr ? 'الأدلة التشغيلية (Runbooks)' : 'Operational Runbooks'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rbac')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeSubTab === 'rbac'
              ? 'bg-cyan-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isAr ? 'مصفوفة الصلاحيات (RBAC)' : 'Role Permission Matrix'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('configs')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeSubTab === 'configs'
              ? 'bg-cyan-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>{isAr ? 'قوالب الإعدادات (Config Profiles)' : 'Config Templates'}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. SERVERS CATALOG CMS */}
      {/* ======================================================== */}
      {activeSubTab === 'servers' && (
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isAr ? 'تحديث وتخصيص بيانات السيرفرات' : 'Server Fleet Content & Metadata Editor'}
              </h4>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'تعديل التسميات الإنجليزية والعربية، العتاد المخصص، المناطق الجغرافية، وعناوين IP.'
                  : 'Update public server labels, hardware allocations, geographic availability, and IPs.'}
              </p>
            </div>

            <button
              onClick={openNewServer}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة عقدة سيرفر جديدة' : 'Add Server Node'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">{isAr ? s.nameAr : s.name}</h5>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {s.ip} · {isAr ? s.regionAr : s.region}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditServer(s)}
                      className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors text-xs"
                      title={isAr ? 'تعديل البيانات' : 'Edit Server Details'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {servers.length > 1 && (
                      <button
                        onClick={() => deleteServerNode(s.id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-colors text-xs"
                        title={isAr ? 'حذف السيرفر' : 'Decommission'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Cores:</span>
                    <span className="text-white font-semibold">{s.cores} vCPUs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">RAM:</span>
                    <span className="text-white font-semibold">{s.ramGb} GB</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">NVMe:</span>
                    <span className="text-white font-semibold">{s.diskGb} GB</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>OS: {s.os}</span>
                  <span className="font-mono text-cyan-400">{s.uptime} SLA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ANNOUNCEMENTS CMS */}
      {/* ======================================================== */}
      {activeSubTab === 'announcements' && (
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isAr ? 'إدارة تنبيهات النظام والإعلانات السحابية' : 'System Announcements & Public Notices'}
              </h4>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'نشر رسائل التحديث والصيانة والأمان لزوار المنصة والمشرفين.'
                  : 'Draft, publish, or pin maintenance notices and release bulletins.'}
              </p>
            </div>

            <button
              onClick={openNewAnnouncement}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إنشاء إعلان جديد' : 'New Announcement'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {ann.pinned && <Pin className="w-3.5 h-3.5 text-cyan-400 rotate-45 shrink-0" />}
                    <h5 className="text-sm font-semibold text-white">
                      {isAr ? ann.titleAr : ann.title}
                    </h5>
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                        ann.type === 'critical'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : ann.type === 'maintenance'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : ann.type === 'release'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}
                    >
                      {ann.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublishAnnouncement(ann.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                        ann.published
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {ann.published ? (isAr ? 'منشور' : 'Published') : isAr ? 'مسودة' : 'Draft'}
                    </button>
                    <button
                      onClick={() => openEditAnnouncement(ann)}
                      className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr ? ann.contentAr : ann.content}
                </p>

                <div className="text-[11px] text-slate-500 font-mono">
                  <span>{ann.publishedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. RUNBOOKS CMS */}
      {/* ======================================================== */}
      {activeSubTab === 'runbooks' && (
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isAr ? 'الأدلة التشغيلية واستجابة الطوارئ (Operational Runbooks)' : 'Operational Runbooks & SOPs'}
              </h4>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'توثيق إجراءات التحويل الطارئ لقواعد البيانات، وتجديد الشهادات، والتعافي من الكوارث.'
                  : 'Document failover steps, incident response protocols, and automated mitigation steps.'}
              </p>
            </div>

            <button
              onClick={openNewRunbook}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'دليل تشغيلي جديد' : 'New Runbook'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {runbooks.map((rb) => (
              <div
                key={rb.id}
                className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-medium">
                        {isAr ? rb.categoryAr : rb.category}
                      </span>
                      <h5 className="text-sm font-bold text-white">
                        {isAr ? rb.titleAr : rb.title}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Author: {rb.author} · Last Revision: {rb.updatedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditRunbook(rb)}
                      className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteRunbook(rb.id)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {isAr ? rb.contentAr : rb.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. RBAC PERMISSIONS MATRIX */}
      {/* ======================================================== */}
      {activeSubTab === 'rbac' && (
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h4 className="text-sm font-semibold text-white">
              {isAr ? 'مصفوفة ضبط صلاحيات الأدوار الإدارية (RBAC Matrix)' : 'Administrative Role Permission Matrix'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'تحديد الصلاحيات الدقيقة لكل رتبة إدارية (إعادة التشغيل، ترقية العتاد، الجدار الناري، الطرفية، وإدارة المحتوى).'
                : 'Configure granular administrative privileges for every role tier across the infrastructure.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 font-mono">
                  <th className="py-3 px-3 text-start">{isAr ? 'الرتبة الإدارية' : 'Admin Role'}</th>
                  <th className="py-3 px-2 text-center">{isAr ? 'إعادة التشغيل' : 'Reboot Node'}</th>
                  <th className="py-3 px-2 text-center">{isAr ? 'ترقية العتاد' : 'Scale Hardware'}</th>
                  <th className="py-3 px-2 text-center">{isAr ? 'الجدار الناري' : 'Firewall / WAF'}</th>
                  <th className="py-3 px-2 text-center">{isAr ? 'الطرفية CLI' : 'Terminal Access'}</th>
                  <th className="py-3 px-2 text-center">{isAr ? 'النسخ الاحتياطي' : 'Backups'}</th>
                  <th className="py-3 px-2 text-center">{isAr ? 'إدارة CMS' : 'CMS Content'}</th>
                  <th className="py-3 px-2 text-center">{isAr ? 'إدارة المشرفين' : 'IAM Users'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {rolePermissions.map((rp) => {
                  const isRoot = rp.role === 'Root Super Admin';

                  return (
                    <tr key={rp.role} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white font-sans">
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{rp.role}</span>
                        </span>
                      </td>

                      {(
                        [
                          'canRebootServers',
                          'canScaleHardware',
                          'canEditFirewall',
                          'canUseTerminal',
                          'canManageBackups',
                          'canEditCms',
                          'canManageUsers',
                        ] as const
                      ).map((key) => {
                        const val = rp[key];
                        return (
                          <td key={key} className="py-3 px-2 text-center">
                            <button
                              disabled={isRoot}
                              onClick={() => updateRolePermission(rp.role, key, !val)}
                              className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors ${
                                val
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700/60'
                              } ${isRoot ? 'cursor-not-allowed opacity-80' : 'hover:scale-105'}`}
                            >
                              {val ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. CONFIG PROFILES CMS */}
      {/* ======================================================== */}
      {activeSubTab === 'configs' && (
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isAr ? 'محرر ملفات التكوين والإعدادات السحابية' : 'Server Config Profiles & Environment Editor'}
              </h4>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'تعديل ملفات nginx.conf و postgresql.conf و redis.conf وتطبيقها فوراً على العناقيد.'
                  : 'Directly modify daemon configuration files and trigger instant fleet deployments.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveConfig}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{configSavedNotice ? (isAr ? 'تم الحفظ!' : 'Saved!') : isAr ? 'حفظ المسودة' : 'Save Draft'}</span>
              </button>
              <button
                onClick={() => applyConfigTemplate(selectedConfigId)}
                className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAr ? 'نشر على جميع السيرفرات' : 'Deploy to Fleet'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1 space-y-2">
              <span className="text-xs text-slate-400 font-medium px-1">
                {isAr ? 'اختر ملف التكوين' : 'Config Profile'}
              </span>
              {configTemplates.map((cfg) => {
                const isSelected = cfg.id === selectedConfigId;
                return (
                  <button
                    key={cfg.id}
                    onClick={() => handleSelectConfig(cfg.id)}
                    className={`w-full text-start p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">{cfg.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{cfg.filePath}</p>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
                      <span>{cfg.version}</span>
                      <span>{cfg.lastUpdated}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Version Tag:</span>
                <input
                  type="text"
                  value={configVersion}
                  onChange={(e) => setConfigVersion(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded text-cyan-400 text-xs w-28 focus:outline-none"
                />
              </div>

              <textarea
                value={configContent}
                onChange={(e) => setConfigContent(e.target.value)}
                rows={16}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Server Modal */}
      {(editingServer || isNewServerModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                {isNewServerModal
                  ? isAr
                    ? 'إضافة سيرفر سحابي جديد'
                    : 'Deploy New Server Node'
                  : isAr
                  ? 'تعديل بيانات السيرفر'
                  : 'Edit Server Metadata'}
              </h4>
              <button
                onClick={() => {
                  setEditingServer(null);
                  setIsNewServerModal(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveServer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    {isAr ? 'اسم السيرفر (إنجليزي)' : 'Node Name (EN)'}
                  </label>
                  <input
                    type="text"
                    value={serverFormData.name || ''}
                    onChange={(e) => setServerFormData({ ...serverFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    {isAr ? 'اسم السيرفر (عربي)' : 'Node Name (AR)'}
                  </label>
                  <input
                    type="text"
                    value={serverFormData.nameAr || ''}
                    onChange={(e) => setServerFormData({ ...serverFormData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    {isAr ? 'عنوان الآي بي (IPv4)' : 'Public IPv4'}
                  </label>
                  <input
                    type="text"
                    value={serverFormData.ip || ''}
                    onChange={(e) => setServerFormData({ ...serverFormData, ip: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    {isAr ? 'المنطقة الجغرافية' : 'Datacenter Region'}
                  </label>
                  <input
                    type="text"
                    value={serverFormData.region || ''}
                    onChange={(e) => setServerFormData({ ...serverFormData, region: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">vCPU Cores</label>
                  <input
                    type="number"
                    value={serverFormData.cores || 16}
                    onChange={(e) =>
                      setServerFormData({ ...serverFormData, cores: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">RAM (GB)</label>
                  <input
                    type="number"
                    value={serverFormData.ramGb || 64}
                    onChange={(e) =>
                      setServerFormData({ ...serverFormData, ramGb: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">NVMe (GB)</label>
                  <input
                    type="number"
                    value={serverFormData.diskGb || 1000}
                    onChange={(e) =>
                      setServerFormData({ ...serverFormData, diskGb: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingServer(null);
                    setIsNewServerModal(false);
                  }}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium"
                >
                  {isAr ? 'حفظ التغييرات' : 'Save Node Specs'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                {editingAnnId
                  ? isAr
                    ? 'تعديل الإعلان'
                    : 'Edit Announcement'
                  : isAr
                  ? 'إنشاء إعلان جديد'
                  : 'Create Announcement'}
              </h4>
              <button onClick={() => setShowAnnModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'عنوان الإعلان (عربي)' : 'Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={annTitleAr}
                  onChange={(e) => setAnnTitleAr(e.target.value)}
                  placeholder="مثال: اكتمال ترقية مركز بيانات الرياض"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'عنوان الإعلان (إنجليزي)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Storage upgrade completed"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'محتوى الإعلان (عربي)' : 'Content (Arabic)'}
                </label>
                <textarea
                  rows={3}
                  value={annContentAr}
                  onChange={(e) => setAnnContentAr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'محتوى الإعلان (إنجليزي)' : 'Content (English)'}
                </label>
                <textarea
                  rows={3}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    {isAr ? 'نوع الإعلان' : 'Notice Category'}
                  </label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="info">Info (إرشادي)</option>
                    <option value="maintenance">Maintenance (صيانة)</option>
                    <option value="critical">Critical Alert (حرج)</option>
                    <option value="release">Release (إصدار جديد)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="pinNotice"
                    checked={annPinned}
                    onChange={(e) => setAnnPinned(e.target.checked)}
                    className="rounded accent-cyan-500"
                  />
                  <label htmlFor="pinNotice" className="text-slate-300 cursor-pointer">
                    {isAr ? 'تثبيت في أعلى الموقع' : 'Pin to Top Banner'}
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium"
                >
                  {isAr ? 'نشر الإعلان' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Runbook Modal */}
      {showRunbookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                {editingRunbookId
                  ? isAr
                    ? 'تعديل الدليل التشغيلي'
                    : 'Edit Runbook'
                  : isAr
                  ? 'إنشاء دليل تشغيلي جديد'
                  : 'New Runbook Document'}
              </h4>
              <button
                onClick={() => setShowRunbookModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRunbook} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    {isAr ? 'عنوان الدليل (عربي)' : 'Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={rbTitleAr}
                    onChange={(e) => setRbTitleAr(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    {isAr ? 'عنوان الدليل (إنجليزي)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={rbTitle}
                    onChange={(e) => setRbTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'القسم / التصنيف' : 'Category'}
                </label>
                <select
                  value={rbCategory}
                  onChange={(e) => {
                    const cat = e.target.value as RunbookDoc['category'];
                    setRbCategory(cat);
                    setRbCategoryAr(
                      cat === 'database'
                        ? 'قواعد البيانات'
                        : cat === 'security'
                        ? 'الأمان'
                        : cat === 'disaster-recovery'
                        ? 'التعافي من الكوارث'
                        : 'الامتثال'
                    );
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="database">Database (قواعد البيانات)</option>
                  <option value="security">Security & DDoS (الأمان)</option>
                  <option value="disaster-recovery">Disaster Recovery (التعافي من الكوارث)</option>
                  <option value="compliance">Compliance & SSL (الامتثال)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'الخطوات والإجراءات (عربي)' : 'Procedure Steps (Arabic)'}
                </label>
                <textarea
                  rows={4}
                  value={rbContentAr}
                  onChange={(e) => setRbContentAr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  {isAr ? 'الخطوات والإجراءات (إنجليزي)' : 'Procedure Steps (English)'}
                </label>
                <textarea
                  rows={4}
                  value={rbContent}
                  onChange={(e) => setRbContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRunbookModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium"
                >
                  {isAr ? 'حفظ الدليل' : 'Save Runbook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
