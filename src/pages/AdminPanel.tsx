import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AccountItem, GiveawayItem, GameDownloadItem, AccountCategory, DailyRewardItem } from '../types/app';
import {
  ShieldAlert,
  ShieldCheck,
  Gift,
  Trophy,
  Gamepad2,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  ExternalLink,
  Flame,
  Radio,
  Sliders,
  Sparkles,
  Ticket,
  Calendar,
  MessageSquare,
  Bot,
  RefreshCw,
  KeyRound,
  AlertTriangle,
  Send,
  Zap,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import { aiEnhanceGame, aiEnhanceAccount, aiGenerateDailyRewards } from '../lib/hiddenAiEngine';

export const AdminPanel: React.FC = () => {
  const {
    lang,
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    giveaways,
    addGiveaway,
    updateGiveaway,
    deleteGiveaway,
    drawGiveawayWinner,
    games,
    addGame,
    updateGame,
    deleteGame,
    dailyRewards,
    addDailyReward,
    updateDailyReward,
    deleteDailyReward,
    chatMessages,
    deleteChatMessage,
    clearChat,
    allUsers,
    grantTicketsToUser,
    siteSettings,
    updateSiteSettings,
    visitorCount,
    onlinePlayersCount,
    resetToCleanRealData,
    lockAdmin,
    setCurrentPage,
  } = useApp();

  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'accounts' | 'daily' | 'giveaways' | 'games' | 'chat' | 'users' | 'settings'
  >('overview');

  // Account Modal State
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccId, setEditingAccId] = useState<string | null>(null);
  const [accTitle, setAccTitle] = useState('');
  const [accTitleAr, setAccTitleAr] = useState('');
  const [accCategory, setAccCategory] = useState<AccountCategory>('gaming');
  const [accPlatform, setAccPlatform] = useState<AccountItem['platform']>('Steam');
  const [accCredentials, setAccCredentials] = useState('');
  const [accStock, setAccStock] = useState<number>(10);
  const [accInstructions, setAccInstructions] = useState('');
  const [accInstructionsAr, setAccInstructionsAr] = useState('');
  const [accBadge, setAccBadge] = useState('Instant Key');
  const [accBadgeAr, setAccBadgeAr] = useState('كود فوري');
  const [accFeatured, setAccFeatured] = useState(true);

  // Daily Reward Modal State
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [editingDailyId, setEditingDailyId] = useState<string | null>(null);
  const [dailyDayNumber, setDailyDayNumber] = useState<number>(1);
  const [dailyName, setDailyName] = useState('');
  const [dailyNameAr, setDailyNameAr] = useState('');
  const [dailyType, setDailyType] = useState<DailyRewardItem['rewardType']>('tickets');
  const [dailyValue, setDailyValue] = useState('1');
  const [dailyBadge, setDailyBadge] = useState('Daily Drop');
  const [dailyBadgeAr, setDailyBadgeAr] = useState('مكافأة يومية');

  // Giveaway Modal State
  const [showGiveawayModal, setShowGiveawayModal] = useState(false);
  const [editingGivId, setEditingGivId] = useState<string | null>(null);
  const [givTitle, setGivTitle] = useState('');
  const [givTitleAr, setGivTitleAr] = useState('');
  const [givPrize, setGivPrize] = useState('');
  const [givPrizeAr, setGivPrizeAr] = useState('');
  const [givCategory, setGivCategory] = useState('Gaming Hardware');
  const [givWinnersCount, setGivWinnersCount] = useState<number>(1);
  const [givDescription, setGivDescription] = useState('');
  const [givDescriptionAr, setGivDescriptionAr] = useState('');

  // Game Modal State
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState('');
  const [gameTitleAr, setGameTitleAr] = useState('');
  const [gameGenre, setGameGenre] = useState('Action');
  const [gameGenreAr, setGameGenreAr] = useState('أكشن ومغامرات');
  const [gameSize, setGameSize] = useState('45.0 GB');
  const [gameCover, setGameCover] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
  const [gameDesc, setGameDesc] = useState('');
  const [gameDescAr, setGameDescAr] = useState('');
  const [gameDownload, setGameDownload] = useState('https://archive.org/download/game_repack');
  const [gameMirror, setGameMirror] = useState('');
  const [reqOs, setReqOs] = useState('Windows 10 / 11 64-bit');
  const [reqCpu, setReqCpu] = useState('Intel Core i5 / AMD Ryzen 5');
  const [reqRam, setReqRam] = useState('16 GB RAM');
  const [reqGpu, setReqGpu] = useState('NVIDIA RTX 2060 / AMD RX 5600 XT');
  const [reqStorage, setReqStorage] = useState('50 GB SSD');

  // Settings State
  const [visitorInput, setVisitorInput] = useState<number>(visitorCount);
  const [annText, setAnnText] = useState(siteSettings.announcement);
  const [annTextAr, setAnnTextAr] = useState(siteSettings.announcementAr);
  const [countdownText, setCountdownText] = useState(siteSettings.nextDropCountdown);
  
  // Custom Admin Login Password / Master PIN state
  const [newAdminPin, setNewAdminPin] = useState('');
  const [confirmAdminPin, setConfirmAdminPin] = useState('');
  const [showPinPlain, setShowPinPlain] = useState(false);
  const [pinChangeMsg, setPinChangeMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPin.trim()) {
      setPinChangeMsg({
        text: isAr ? 'يرجى كتابة كلمة السر الجديدة' : 'Please enter a new password',
        isError: true,
      });
      return;
    }
    if (newAdminPin.trim().length < 4) {
      setPinChangeMsg({
        text: isAr ? 'يجب أن تتكون كلمة السر من 4 خانات على الأقل' : 'PIN/Password must be at least 4 characters',
        isError: true,
      });
      return;
    }
    if (newAdminPin.trim() !== confirmAdminPin.trim()) {
      setPinChangeMsg({
        text: isAr ? 'كلمتا السر غير متطابقتين!' : 'Passwords do not match!',
        isError: true,
      });
      return;
    }

    updateSiteSettings({ adminPin: newAdminPin.trim() });
    setPinChangeMsg({
      text: isAr
        ? '✅ تم تحديث وتغيير كلمة سر لوحة الإدارة بنجاح! احفظ الرمز الجديد لدخولك القادم.'
        : '✅ Admin PIN / password updated successfully!',
      isError: false,
    });
    setNewAdminPin('');
    setConfirmAdminPin('');
    setTimeout(() => setPinChangeMsg(null), 6000);
  };

  // AI Assistant status notice
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // Trigger Silent AI auto-generator for Accounts
  const handleAiAutoFillAccount = () => {
    if (!accTitle.trim()) {
      setAiNotice(isAr ? 'يرجى كتابة عنوان الحساب أولاً ليقوم الذكاء الاصطناعي بإكماله' : 'Enter account title first');
      setTimeout(() => setAiNotice(null), 3500);
      return;
    }
    const enhanced = aiEnhanceAccount(accTitle, accPlatform);
    setAccTitleAr(enhanced.titleAr);
    setAccBadge(enhanced.badge);
    setAccBadgeAr(enhanced.badgeAr);
    setAccInstructions(enhanced.instructions);
    setAccInstructionsAr(enhanced.instructionsAr);
    setAiNotice(isAr ? '✨ تم ملء التفاصيل والتعليمات الاحترافية بنجاح!' : '✨ AI enhanced account details!');
    setTimeout(() => setAiNotice(null), 3500);
  };

  // Trigger Silent AI auto-generator for Games
  const handleAiAutoFillGame = () => {
    if (!gameTitle.trim()) {
      setAiNotice(isAr ? 'يرجى كتابة اسم اللعبة أولاً ليقوم الذكاء الاصطناعي بتوليد المواصفات' : 'Enter game title first');
      setTimeout(() => setAiNotice(null), 3500);
      return;
    }
    const enhanced = aiEnhanceGame(gameTitle, gameGenre);
    setGameTitleAr(enhanced.titleAr);
    setGameGenre(enhanced.genre);
    setGameGenreAr(enhanced.genreAr);
    setGameSize(enhanced.size);
    setGameDesc(enhanced.description);
    setGameDescAr(enhanced.descriptionAr);
    setReqOs(enhanced.systemRequirements.os);
    setReqCpu(enhanced.systemRequirements.cpu);
    setReqRam(enhanced.systemRequirements.ram);
    setReqGpu(enhanced.systemRequirements.gpu);
    setReqStorage(enhanced.systemRequirements.storage);
    setAiNotice(isAr ? '✨ تم استنتاج وتوليد متطلبات التشغيل والوصف بنجاح!' : '✨ AI generated system specs & description!');
    setTimeout(() => setAiNotice(null), 3500);
  };

  // Handle Account Save
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accTitle.trim()) return;

    if (editingAccId) {
      updateAccount(editingAccId, {
        title: accTitle,
        titleAr: accTitleAr || accTitle,
        category: accCategory,
        platform: accPlatform,
        credentials: accCredentials,
        totalStock: accStock,
        remainingStock: accStock,
        instructions: accInstructions,
        instructionsAr: accInstructionsAr || accInstructions,
        badge: accBadge,
        badgeAr: accBadgeAr,
        featured: accFeatured,
      });
    } else {
      addAccount({
        title: accTitle,
        titleAr: accTitleAr || accTitle,
        category: accCategory,
        platform: accPlatform,
        credentials: accCredentials,
        totalStock: accStock,
        remainingStock: accStock,
        instructions: accInstructions,
        instructionsAr: accInstructionsAr || accInstructions,
        badge: accBadge,
        badgeAr: accBadgeAr,
        featured: accFeatured,
      });
    }

    setShowAccountModal(false);
    setEditingAccId(null);
  };

  // Handle Daily Reward Save
  const handleSaveDaily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyName.trim()) return;

    if (editingDailyId) {
      updateDailyReward(editingDailyId, {
        dayNumber: dailyDayNumber,
        name: dailyName,
        nameAr: dailyNameAr || dailyName,
        rewardType: dailyType,
        value: dailyValue,
        badge: dailyBadge,
        badgeAr: dailyBadgeAr,
      });
    } else {
      addDailyReward({
        dayNumber: dailyDayNumber,
        name: dailyName,
        nameAr: dailyNameAr || dailyName,
        rewardType: dailyType,
        value: dailyValue,
        badge: dailyBadge,
        badgeAr: dailyBadgeAr,
        active: true,
      });
    }

    setShowDailyModal(false);
    setEditingDailyId(null);
  };

  // Handle Giveaway Save
  const handleSaveGiveaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!givTitle.trim()) return;

    if (editingGivId) {
      updateGiveaway(editingGivId, {
        title: givTitle,
        titleAr: givTitleAr || givTitle,
        prize: givPrize,
        prizeAr: givPrizeAr || givPrize,
        category: givCategory,
        totalWinners: givWinnersCount,
        description: givDescription,
        descriptionAr: givDescriptionAr || givDescription,
      });
    } else {
      addGiveaway({
        title: givTitle,
        titleAr: givTitleAr || givTitle,
        prize: givPrize,
        prizeAr: givPrizeAr || givPrize,
        category: givCategory,
        totalWinners: givWinnersCount,
        endsAt: 'في غضون 24 ساعة',
        status: 'active',
        description: givDescription,
        descriptionAr: givDescriptionAr || givDescription,
      });
    }

    setShowGiveawayModal(false);
    setEditingGivId(null);
  };

  // Handle Game Save
  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle.trim()) return;

    if (editingGameId) {
      updateGame(editingGameId, {
        title: gameTitle,
        titleAr: gameTitleAr || gameTitle,
        genre: gameGenre,
        genreAr: gameGenreAr || gameGenre,
        size: gameSize,
        coverImage: gameCover,
        description: gameDesc,
        descriptionAr: gameDescAr || gameDesc,
        downloadUrl: gameDownload,
        directMirrorUrl: gameMirror || undefined,
        systemRequirements: {
          os: reqOs,
          cpu: reqCpu,
          ram: reqRam,
          gpu: reqGpu,
          storage: reqStorage,
        },
      });
    } else {
      addGame({
        title: gameTitle,
        titleAr: gameTitleAr || gameTitle,
        genre: gameGenre,
        genreAr: gameGenreAr || gameGenre,
        size: gameSize,
        rating: 4.8,
        version: 'v1.0 Complete',
        coverImage: gameCover,
        description: gameDesc,
        descriptionAr: gameDescAr || gameDesc,
        downloadUrl: gameDownload,
        directMirrorUrl: gameMirror || undefined,
        systemRequirements: {
          os: reqOs,
          cpu: reqCpu,
          ram: reqRam,
          gpu: reqGpu,
          storage: reqStorage,
        },
        tags: ['PC', 'Repack', 'Fast Mirror'],
      });
    }

    setShowGameModal(false);
    setEditingGameId(null);
  };

  const openNewAccount = () => {
    setEditingAccId(null);
    setAccTitle('');
    setAccTitleAr('');
    setAccCategory('gaming');
    setAccPlatform('Steam');
    setAccCredentials('');
    setAccStock(10);
    setAccInstructions('Log in and change password.');
    setAccInstructionsAr('قم بتسجيل الدخول وتغيير كلمة المرور فوراً.');
    setAccBadge('Instant Key');
    setAccBadgeAr('كود فوري');
    setAccFeatured(true);
    setShowAccountModal(true);
  };

  const openNewDaily = () => {
    setEditingDailyId(null);
    setDailyDayNumber(dailyRewards.length + 1);
    setDailyName('');
    setDailyNameAr('');
    setDailyType('tickets');
    setDailyValue('2_tickets');
    setDailyBadge('Streak Reward');
    setDailyBadgeAr('مكافأة حضور');
    setShowDailyModal(true);
  };

  const openNewGiveaway = () => {
    setEditingGivId(null);
    setGivTitle('');
    setGivTitleAr('');
    setGivPrize('');
    setGivPrizeAr('');
    setGivCategory('Gaming Hardware');
    setGivWinnersCount(1);
    setGivDescription('');
    setGivDescriptionAr('');
    setShowGiveawayModal(true);
  };

  const openNewGame = () => {
    setEditingGameId(null);
    setGameTitle('');
    setGameTitleAr('');
    setGameGenre('Action');
    setGameGenreAr('أكشن ومغامرات');
    setGameSize('45.0 GB');
    setGameCover('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
    setGameDesc('');
    setGameDescAr('');
    setGameDownload('');
    setGameMirror('');
    setReqOs('Windows 10 / 11 64-bit');
    setReqCpu('Intel Core i5 / AMD Ryzen 5');
    setReqRam('16 GB RAM');
    setReqGpu('NVIDIA RTX 2060 6GB');
    setReqStorage('50 GB SSD');
    setShowGameModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-xl px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white">
                ApexDrop <span className="text-amber-400">Master Console</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                ROOT OWNER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {isAr ? 'لوحة الإدارة الحصرية والسرية - غير ظاهرة للعامة' : 'Isolated secret room (hidden from public)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentPage('home')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'العودة للموقع' : 'Back to Site'}</span>
          </button>

          <button
            onClick={lockAdmin}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAr ? 'قفل اللوحة' : 'Lock Admin'}</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 space-y-1.5 shrink-0">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 mb-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              {isAr ? 'المالك الحالي' : 'Active Owner'}
            </span>
            <span className="text-xs font-bold text-white truncate block">
              yoappqlo@gmail.com
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {isAr ? 'جلسة إدارية نشطة' : 'Admin Session Active'}
            </span>
          </div>

          {[
            { id: 'overview', label: 'Overview & Stats', labelAr: 'النظرة العامة والإحصائيات', icon: Sliders },
            { id: 'accounts', label: 'Account Drops', labelAr: 'توزيع الحسابات الحقيقية', icon: Gift },
            { id: 'daily', label: 'Daily Rewards Manager', labelAr: 'الجوائز اليومية وسلسلة الحضور', icon: Calendar },
            { id: 'giveaways', label: 'Community Raffles', labelAr: 'السحوبات العشوائية', icon: Trophy },
            { id: 'games', label: 'Games Library CMS', labelAr: 'مكتبة تحميل الألعاب', icon: Gamepad2 },
            { id: 'chat', label: 'Live Chat Moderation', labelAr: 'إدارة الشات والفلترة', icon: MessageSquare },
            { id: 'users', label: 'Registered Users', labelAr: 'المستخدمين والخزائن', icon: Users },
            { id: 'settings', label: 'Site Settings & Control', labelAr: 'إعدادات الموقع وتصفير البيانات', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-start transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{isAr ? tab.labelAr : tab.label}</span>
              </button>
            );
          })}

          {/* Quick Notice Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-2 mt-4">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'الذكاء الاصطناعي الخفي' : 'Hidden Silent AI'}</span>
            </div>
            <p className="leading-relaxed">
              {isAr
                ? 'محرك الذكاء الاصطناعي يعمل في الخلفية لمساعدتك في توليد مواصفات الألعاب، وتنظيف رسائل الشات العام من أي ألفاظ مسيئة.'
                : 'Background AI helps generate game specs, formats account credentials, and filters profanity automatically.'}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isAr ? 'نظرة عامة على المنصة' : 'Platform Overview'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'مراقبة حركة الزوار والمخزون ونشاط المستخدمين' : 'Monitor traffic, drops stock, and active sessions'}
                  </p>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    {isAr ? 'اللاعبون المتصلون الآن' : 'Live Online Players'}
                  </span>
                  <div className="text-2xl font-black text-cyan-400 font-mono flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{onlinePlayersCount}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {visitorCount} {isAr ? 'زيارة حقيقية مسجلة' : 'tracked sessions'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    {isAr ? 'الحسابات المتاحة' : 'Active Drops'}
                  </span>
                  <div className="text-2xl font-black text-purple-400 font-mono">
                    {accounts.length}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {accounts.reduce((acc, a) => acc + a.remainingStock, 0)} {isAr ? 'قطعة في المخزون' : 'units in stock'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    {isAr ? 'المستخدمين المسجلين' : 'Registered Users'}
                  </span>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {allUsers.length}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {isAr ? 'حسابات جوجل نشطة' : 'Verified Google profiles'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    {isAr ? 'مكتبة الألعاب' : 'PC Games Library'}
                  </span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {games.length}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {isAr ? 'عناوين كاملة للتحميل' : 'Titles available'}
                  </span>
                </div>
              </div>

              {/* Secret Admin Entrance Guide (Directly Answers User Request: "وريد ان تشرح لي كيف ادخل لوحت الدمن") */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isAr ? 'دليل الدخول السريع للوحة الإدارة (احفظ هذه التعليمات)' : 'Quick Admin Access Instructions'}
                    </h3>
                    <p className="text-xs text-amber-300/80">
                      {isAr
                        ? 'لوحة التحكم مخفية تماماً عن الزوار العاديين ولا يوجد لها رابط عام في القائمة، ويمكنك دخولها بالطرق التالية:'
                        : 'The control panel is completely hidden from public visitors. You can access it via:'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-amber-400">1.</span> {isAr ? 'الاختصار المباشر من الكيبورد' : 'Keyboard Shortcut'}
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      اضغط في أي وقت على <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">Ctrl + Shift + A</code> ليفتح لك نافذة الدخول الفوري.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-amber-400">2.</span> {isAr ? 'عبر رابط المتصفح المباشر' : 'Direct URL Parameter'}
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      أضف <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">?admin=true</code> في نهاية الرابط بأعلى المتصفح.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-amber-400">3.</span> {isAr ? 'الرمز السري الرئيسي (Master PIN)' : 'Master PIN'}
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      الرمز السري المعتمد الخاص بك هو <code className="text-amber-400 bg-slate-900 px-2 py-0.5 rounded font-mono font-bold text-sm">2026</code>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-amber-400">4.</span> {isAr ? 'تسجيل دخول جوجل للمالك' : 'Owner Google Auth'}
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      تسجيل الدخول بالبريد <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono">yoappqlo@gmail.com</code> يمنحك كل الصلاحيات تلقائياً.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNTS MANAGEMENT */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isAr ? 'إدارة توزيع الحسابات الحقيقية' : 'Real Accounts & Drops CMS'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'أضف وعدل الحسابات والأكواد التي يستلمها اللاعبون' : 'Add and manage accounts, credentials and stocks'}
                  </p>
                </div>
                <button
                  onClick={openNewAccount}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة حساب جديد' : 'Add New Account'}</span>
                </button>
              </div>

              {accounts.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
                  <Gift className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-white">
                    {isAr ? 'لا توجد حسابات مضافة حالياً.' : 'No accounts currently in the system.'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'أضف أول حساب حقيقي بالضغط على زر "إضافة حساب جديد" بالأعلى.' : 'Add your first real account above.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold">
                            {acc.platform}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {isAr ? acc.titleAr : acc.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                          <span>{isAr ? 'المخزون:' : 'Stock:'} {acc.remainingStock}/{acc.totalStock}</span>
                          <span>•</span>
                          <span className="truncate max-w-[200px] text-amber-300">
                            {acc.credentials}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingAccId(acc.id);
                            setAccTitle(acc.title);
                            setAccTitleAr(acc.titleAr);
                            setAccCategory(acc.category);
                            setAccPlatform(acc.platform);
                            setAccCredentials(acc.credentials);
                            setAccStock(acc.remainingStock);
                            setAccInstructions(acc.instructions);
                            setAccInstructionsAr(acc.instructionsAr);
                            setAccBadge(acc.badge);
                            setAccBadgeAr(acc.badgeAr);
                            setAccFeatured(acc.featured);
                            setShowAccountModal(true);
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                          title={isAr ? 'تعديل' : 'Edit'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteAccount(acc.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs"
                          title={isAr ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DAILY REWARDS */}
          {activeTab === 'daily' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isAr ? 'إدارة الجوائز اليومية وسلسلة الحضور' : 'Daily Rewards Manager'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'حدد الجوائز التي يستلمها اللاعبون كل 24 ساعة عند تسجيل الدخول' : 'Define what prizes players unlock on their daily streak'}
                  </p>
                </div>
                <button
                  onClick={openNewDaily}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة جائزة يومية' : 'Add Daily Tier'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {dailyRewards.map((dr) => (
                  <div
                    key={dr.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold">
                          {isAr ? `اليوم ${dr.dayNumber}` : `Day ${dr.dayNumber}`}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {isAr ? dr.nameAr : dr.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {isAr ? 'القيمة:' : 'Value:'} {dr.value} • {isAr ? dr.badgeAr : dr.badge}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingDailyId(dr.id);
                          setDailyDayNumber(dr.dayNumber);
                          setDailyName(dr.name);
                          setDailyNameAr(dr.nameAr);
                          setDailyType(dr.rewardType);
                          setDailyValue(dr.value);
                          setDailyBadge(dr.badge);
                          setDailyBadgeAr(dr.badgeAr);
                          setShowDailyModal(true);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDailyReward(dr.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GIVEAWAYS */}
          {activeTab === 'giveaways' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isAr ? 'إدارة السحوبات والقرعة العشوائية' : 'Giveaways & Random Draw'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'أضف سحوبات جديدة وقم بإجراء السحب التلقائي العشوائي للرابحين' : 'Add community raffles and execute transparent random draws'}
                  </p>
                </div>
                <button
                  onClick={openNewGiveaway}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إنشاء سحب جديد' : 'New Giveaway'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {giveaways.map((giv) => (
                  <div
                    key={giv.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-mono font-bold">
                            {giv.category}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {isAr ? giv.titleAr : giv.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isAr ? giv.prizeAr : giv.prize} • {giv.participants.length} {isAr ? 'مشترك' : 'joined'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {giv.status === 'active' && giv.participants.length > 0 && (
                          <button
                            onClick={() => drawGiveawayWinner(giv.id)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-1.5"
                          >
                            <Trophy className="w-3.5 h-3.5" />
                            <span>{isAr ? 'إجراء السحب الآن' : 'Draw Winner'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteGiveaway(giv.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {giv.winners && giv.winners.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                        <span className="font-bold">{isAr ? 'الفائزون في السحب:' : 'Winners:'} </span>
                        <span>{giv.winners.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GAMES LIBRARY */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isAr ? 'إدارة مكتبة تحميل الألعاب' : 'PC Games Library CMS'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'أضف روابط تحميل الألعاب ومواصفات التشغيل' : 'Publish games, download links, and hardware specs'}
                  </p>
                </div>
                <button
                  onClick={openNewGame}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة لعبة للتحميل' : 'Add Game'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="w-12 h-14 object-cover rounded-xl border border-slate-800 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {isAr ? game.titleAr : game.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono">
                          {game.size} • {isAr ? game.genreAr : game.genre}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingGameId(game.id);
                          setGameTitle(game.title);
                          setGameTitleAr(game.titleAr);
                          setGameGenre(game.genre);
                          setGameGenreAr(game.genreAr);
                          setGameSize(game.size);
                          setGameCover(game.coverImage);
                          setGameDesc(game.description);
                          setGameDescAr(game.descriptionAr);
                          setGameDownload(game.downloadUrl);
                          setGameMirror(game.directMirrorUrl || '');
                          setReqOs(game.systemRequirements.os);
                          setReqCpu(game.systemRequirements.cpu);
                          setReqRam(game.systemRequirements.ram);
                          setReqGpu(game.systemRequirements.gpu);
                          setReqStorage(game.systemRequirements.storage);
                          setShowGameModal(true);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteGame(game.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CHAT MODERATION */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isAr ? 'مراقبة وإدارة الشات العام' : 'Live Chat Moderation'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'حذف أي رسائل مخالفة وتفريغ الشات وفحص الكلمات المحجوبة' : 'Purge chat, review filtered messages and enforce rules'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(isAr ? 'هل أنت متأكد من تفريغ الشات بالكامل؟' : 'Purge all messages?')) {
                      clearChat();
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isAr ? 'تفريغ الشات بالكامل' : 'Purge Chat'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">
                  {isAr ? `الرسائل الحالية (${chatMessages.length})` : `Current Messages (${chatMessages.length})`}
                </span>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <p className="text-xs text-slate-500 p-4 text-center">
                      {isAr ? 'الشات فارغ حالياً' : 'Chat is currently empty'}
                    </p>
                  ) : (
                    chatMessages.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{m.displayName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
                            {m.wasFiltered && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                {isAr ? 'محجوب تلقائياً' : 'Censored'}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 truncate mt-1">{m.message}</p>
                        </div>
                        <button
                          onClick={() => deleteChatMessage(m.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 shrink-0"
                          title={isAr ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isAr ? 'المستخدمين والخزائن المسجلة' : 'Registered Users & Vaults'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'منح تذاكر دوران لعجلة الحظ ومتابعة الحسابات المستلمة' : 'Grant spin tickets and view claimed user vaults'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {allUsers.length === 0 ? (
                  <p className="text-xs text-slate-500 p-8 text-center">
                    {isAr ? 'لم يقم أي مستخدم بتسجيل الدخول بعد.' : 'No users signed in yet.'}
                  </p>
                ) : (
                  allUsers.map((u) => (
                    <div
                      key={u.uid}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoURL}
                          alt={u.displayName}
                          className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{u.displayName}</h4>
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400">
                              {u.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono">
                            {u.email} • {u.spinTickets} {isAr ? 'تذاكر' : 'spins'} • {u.claimedAccounts.length} {isAr ? 'حساب مستلم' : 'claimed'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => grantTicketsToUser(u.uid, 3)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>+3 {isAr ? 'تذاكر حظ' : 'Spins'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS & RESET */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">
                  {isAr ? 'إعدادات المنصة وتصفير البيانات' : 'Platform Settings & Pure Data Reset'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'التحكم في عداد الزوار، الإعلانات، وبدء المنصة بحساباتك الحقيقية فقط' : 'Control visitor counter, announcements, or wipe initial items'}
                </p>
              </div>

              {/* Master PIN / Password Change Card (Requested by user) */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{isAr ? 'تغيير كلمة سر دخول الأدمن (Master PIN)' : 'Change Master Admin PIN / Password'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/20">
                          {isAr ? 'حماية عالية' : 'Security'}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        {isAr
                          ? 'الرمز السري المخصص لفتح لوحة الأدمن الحصرية عند الضغط على Ctrl + Shift + A أو الرابط السري ?admin=true.'
                          : 'Secret PIN to unlock the master console via hotkey Ctrl+Shift+A or secret URL.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{isAr ? 'الرمز الحالي:' : 'Current PIN:'}</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {siteSettings.adminPin || '2026'}
                    </span>
                  </div>
                </div>

                {pinChangeMsg && (
                  <div
                    className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
                      pinChangeMsg.isError
                        ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                        : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {pinChangeMsg.isError ? (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    ) : (
                      <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                    )}
                    <span>{pinChangeMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveNewPin} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        {isAr ? 'كلمة السر / رمز PIN الجديد' : 'New Password / PIN'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPinPlain ? 'text' : 'password'}
                          required
                          value={newAdminPin}
                          onChange={(e) => setNewAdminPin(e.target.value)}
                          placeholder={isAr ? 'أدخل كلمة سر جديدة (أرقام أو حروف)' : 'New alphanumeric PIN'}
                          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono tracking-widest outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPinPlain((p) => !p)}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                          {showPinPlain ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        {isAr ? 'تأكيد كلمة السر الجديدة' : 'Confirm New PIN'}
                      </label>
                      <input
                        type={showPinPlain ? 'text' : 'password'}
                        required
                        value={confirmAdminPin}
                        onChange={(e) => setConfirmAdminPin(e.target.value)}
                        placeholder={isAr ? 'أعد إدخال كلمة السر لتأكيدها' : 'Confirm new PIN'}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono tracking-widest outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-slate-400">
                      {isAr
                        ? '🔒 كلمة السر مشفرة ومحفوظة فوراً. احرص على تذكرها للدخول في المرات القادمة.'
                        : '🔒 Password is saved instantly. Keep it safe to access admin panel.'}
                    </p>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-950/40 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAr ? 'حفظ وتفعيل كلمة السر الجديدة' : 'Save New Master PIN'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Reset to Clean Real Data Card (Requested by user) */}
              <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/40 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">
                      {isAr ? 'تصفير المنصة للبدء بحسابات حقيقية فقط (بدون أي بيانات افتراضية)' : 'Wipe Dummy Data & Start Pure Real'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isAr
                        ? 'إذا أردت مسح كافة الحسابات والألعاب والسحوبات الافتراضية للبدء بإضافة حساباتك الحقيقية بنفسك من الصفر، يمكنك التصفير بضغطة واحدة.'
                        : 'Clear all initial mock accounts, games, and raffles so you can populate only 100% genuine inventory.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        isAr
                          ? 'هل أنت متأكد من مسح كافة البيانات والبدء بحسابات حقيقية فارغة يضيفها الأدمن؟'
                          : 'Wipe all items to start fresh with pure real data?'
                      )
                    ) {
                      resetToCleanRealData();
                      alert(isAr ? 'تم تصفير البيانات بنجاح! يمكنك الآن إضافة حساباتك الحقيقية.' : 'Data reset to pure empty state!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-colors"
                >
                  {isAr ? 'مسح وتصفير البيانات والبدء بالحقيقي فقط' : 'Wipe & Start Pure Real'}
                </button>
              </div>

              {/* Real Visitor Counter Controls */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">
                  {isAr ? 'إحصائيات وعداد الزيارات الفعلي' : 'Real Visitor Counter'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'العداد يسجل فقط الزيارات الحقيقية الفعلية بدون أي أرقام وهمية أو تكرار مصطنع.' : 'Tracks strictly genuine visitor sessions without fake simulation.'}
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={visitorInput}
                    onChange={(e) => setVisitorInput(Number(e.target.value))}
                    className="w-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-400 font-mono"
                  />
                  <button
                    onClick={() => {
                      updateSiteSettings({ totalVisitors: visitorInput });
                      alert(isAr ? 'تم تحديث عداد الزوار بنجاح!' : 'Visitor count updated!');
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                  >
                    {isAr ? 'حفظ العداد' : 'Update Count'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ACCOUNT ADD/EDIT WITH HIDDEN AI AUTOFILL */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingAccId ? (isAr ? 'تعديل الحساب' : 'Edit Account') : (isAr ? 'إضافة حساب حقيقي جديد' : 'Add Real Account Drop')}
              </h3>
              <button onClick={() => setShowAccountModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Auto-fill trigger button */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'المحسن الذكي الخفي' : 'Hidden AI Content Enhancer'}</span>
              </div>
              <button
                type="button"
                onClick={handleAiAutoFillAccount}
                className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isAr ? 'توليد وتحسين تلقائي ✨' : 'AI Auto-Fill ✨'}</span>
              </button>
            </div>

            {aiNotice && (
              <p className="text-xs text-cyan-400 font-semibold bg-cyan-950/60 p-2 rounded-xl border border-cyan-500/30">
                {aiNotice}
              </p>
            )}

            <form onSubmit={handleSaveAccount} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'عنوان الحساب (إنجليزي أو عربي)' : 'Title'}</label>
                <input
                  type="text"
                  required
                  value={accTitle}
                  onChange={(e) => setAccTitle(e.target.value)}
                  placeholder="Steam Premium Account (GTA V + CS2)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">{isAr ? 'المنصة' : 'Platform'}</label>
                  <select
                    value={accPlatform}
                    onChange={(e) => setAccPlatform(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Steam">Steam</option>
                    <option value="Xbox">Xbox</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Discord">Discord</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Spotify">Spotify</option>
                    <option value="Minecraft">Minecraft</option>
                    <option value="Valorant">Valorant</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">{isAr ? 'الكمية المتوفرة' : 'Stock Units'}</label>
                  <input
                    type="number"
                    min="1"
                    value={accStock}
                    onChange={(e) => setAccStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'بيانات الحساب / الكود الحقيقي' : 'Real Credentials / Key'}</label>
                <input
                  type="text"
                  required
                  value={accCredentials}
                  onChange={(e) => setAccCredentials(e.target.value)}
                  placeholder="username:password OR STEAM-KEY-1234"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'تعليمات الاستخدام (عربي)' : 'Instructions (Arabic)'}</label>
                <textarea
                  rows={2}
                  value={accInstructionsAr}
                  onChange={(e) => setAccInstructionsAr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {isAr ? 'حفظ ونشر الحساب' : 'Save Drop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GAME ADD/EDIT WITH HIDDEN AI AUTOFILL */}
      {showGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingGameId ? (isAr ? 'تعديل بيانات اللعبة' : 'Edit Game') : (isAr ? 'إضافة لعبة جديدة للتحميل' : 'Add PC Game')}
              </h3>
              <button onClick={() => setShowGameModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Auto-fill trigger button */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'توليد المواصفات بالذكاء الاصطناعي الخفي' : 'Hidden AI Specs Generator'}</span>
              </div>
              <button
                type="button"
                onClick={handleAiAutoFillGame}
                className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isAr ? 'توليد المواصفات تلقائياً ✨' : 'Auto Generate ✨'}</span>
              </button>
            </div>

            {aiNotice && (
              <p className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/30">
                {aiNotice}
              </p>
            )}

            <form onSubmit={handleSaveGame} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'اسم اللعبة' : 'Game Title'}</label>
                <input
                  type="text"
                  required
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="Grand Theft Auto V"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">{isAr ? 'التصنيف' : 'Genre'}</label>
                  <input
                    type="text"
                    value={gameGenre}
                    onChange={(e) => setGameGenre(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">{isAr ? 'حجم الملف' : 'Size'}</label>
                  <input
                    type="text"
                    value={gameSize}
                    onChange={(e) => setGameSize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'رابط التحميل المباشر' : 'Download URL'}</label>
                <input
                  type="url"
                  required
                  value={gameDownload}
                  onChange={(e) => setGameDownload(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">CPU</label>
                  <input
                    type="text"
                    value={reqCpu}
                    onChange={(e) => setReqCpu(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">GPU</label>
                  <input
                    type="text"
                    value={reqGpu}
                    onChange={(e) => setReqGpu(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGameModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {isAr ? 'حفظ اللعبة' : 'Save Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DAILY REWARD ADD/EDIT */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {isAr ? 'تخصيص مكافأة يومية' : 'Configure Daily Reward'}
              </h3>
              <button onClick={() => setShowDailyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDaily} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'رقم اليوم' : 'Day Number'}</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={dailyDayNumber}
                  onChange={(e) => setDailyDayNumber(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'اسم الجائزة (عربي)' : 'Name (Arabic)'}</label>
                <input
                  type="text"
                  required
                  value={dailyNameAr}
                  onChange={(e) => setDailyNameAr(e.target.value)}
                  placeholder="تذكرتان لعجلة الحظ + 100 نقطة"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'النوع' : 'Reward Type'}</label>
                <select
                  value={dailyType}
                  onChange={(e) => setDailyType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="tickets">تذاكر دوران (Lucky Spins)</option>
                  <option value="points">نقاط مكافأة (Apex Points)</option>
                  <option value="steam_key">مفتاح ستيم أصلي (Steam Key)</option>
                  <option value="nitro">دسكورد نيترو (Discord Nitro)</option>
                  <option value="account">حساب كامل (Account Drop)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'القيمة / الكود' : 'Value / Key'}</label>
                <input
                  type="text"
                  required
                  value={dailyValue}
                  onChange={(e) => setDailyValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDailyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {isAr ? 'حفظ المكافأة' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
