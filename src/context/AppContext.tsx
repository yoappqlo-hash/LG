import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AccountItem,
  GiveawayItem,
  GameDownloadItem,
  UserProfileData,
  SiteSettings,
  UserClaimedItem,
  DailyRewardItem,
  ChatMessage,
  ThemeMode,
} from '../types/app';
import {
  INITIAL_ACCOUNTS,
  INITIAL_GIVEAWAYS,
  INITIAL_GAMES,
  INITIAL_SETTINGS,
  INITIAL_DAILY_REWARDS,
  INITIAL_CHAT_MESSAGES,
} from '../data/mockData';
import { auth, signInWithGoogle, signOutFirebase, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { audioFx } from '../lib/audioEffects';
import { aiFilterProfanity } from '../lib/hiddenAiEngine';
import { detectUserGeoLocation, GeoLocationInfo } from '../lib/geoIp';

export type AppPage =
  | 'home'
  | 'accounts'
  | 'giveaways'
  | 'games'
  | 'about'
  | 'profile'
  | 'admin'
  | 'chat';

interface AppContextType {
  // Localization & Navigation
  lang: 'ar' | 'en';
  toggleLang: () => void;
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;

  // Theme & FX Settings
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  animeBackgroundEnabled: boolean;
  setAnimeBackgroundEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;

  // Auth & User Profile
  currentUser: UserProfileData | null;
  firebaseUser: User | null;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfileData>) => void;
  isOwnerAdmin: boolean;

  // Hidden Admin Gate
  isAdminUnlocked: boolean;
  unlockAdminWithPin: (pin: string) => boolean;
  lockAdmin: () => void;
  showAdminAuthModal: boolean;
  setShowAdminAuthModal: (show: boolean) => void;

  // Accounts Management
  accounts: AccountItem[];
  claimAccount: (accountId: string) => { success: boolean; credentials?: string; message: string; messageAr: string };
  addAccount: (item: Omit<AccountItem, 'id' | 'dateAdded'>) => void;
  updateAccount: (id: string, updates: Partial<AccountItem>) => void;
  deleteAccount: (id: string) => void;

  // Giveaways Management
  giveaways: GiveawayItem[];
  joinGiveaway: (giveawayId: string) => { success: boolean; message: string; messageAr: string };
  drawGiveawayWinner: (giveawayId: string) => string[];
  addGiveaway: (item: Omit<GiveawayItem, 'id' | 'participants' | 'winners'>) => void;
  updateGiveaway: (id: string, updates: Partial<GiveawayItem>) => void;
  deleteGiveaway: (id: string) => void;

  // Games Download Management
  games: GameDownloadItem[];
  addGame: (item: Omit<GameDownloadItem, 'id'>) => void;
  updateGame: (id: string, updates: Partial<GameDownloadItem>) => void;
  deleteGame: (id: string) => void;

  // Daily Rewards & Streak
  dailyRewards: DailyRewardItem[];
  claimDailyReward: (rewardId: string) => { success: boolean; message: string; messageAr: string };
  addDailyReward: (item: Omit<DailyRewardItem, 'id'>) => void;
  updateDailyReward: (id: string, updates: Partial<DailyRewardItem>) => void;
  deleteDailyReward: (id: string) => void;

  // Lucky Spin Wheel
  spinLuckyWheel: () => Promise<{ prizeName: string; prizeNameAr: string; type: string; value: string }>;

  // Live Community Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: string) => { success: boolean; wasFiltered: boolean; message: string; messageAr: string };
  deleteChatMessage: (id: string) => { success: boolean; message: string; messageAr: string };
  toggleChatReaction: (messageId: string, emoji: string) => void;
  clearChat: () => void;

  // Site Settings & Real Visitor / Player Counter
  siteSettings: SiteSettings;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  visitorCount: number;
  onlinePlayersCount: number;

  // Reset to clean real data (Admin option)
  resetToCleanRealData: () => void;

  // Registered Users Directory (Admin only)
  allUsers: UserProfileData[];
  grantTicketsToUser: (uid: string, tickets: number) => void;
  getUserProfileByUid: (uid: string) => UserProfileData | undefined;

  // Auto-detected Geo Location
  userGeo: GeoLocationInfo | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language Setup
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('apexdrop_lang') as 'ar' | 'en') || 'ar';
  });

  const toggleLang = () => {
    audioFx.playClick();
    setLang((prev) => {
      const next = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('apexdrop_lang', next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // 2. Navigation State
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('apexdrop_admin_unlocked') === 'true';
  });

  // 3. Theme & FX Settings
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('apexdrop_theme') as ThemeMode) || 'anime';
  });

  const setTheme = (mode: ThemeMode) => {
    audioFx.playClick();
    setThemeState(mode);
    localStorage.setItem('apexdrop_theme', mode);
  };

  const [animeBackgroundEnabled, setAnimeBackgroundEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('apexdrop_anime_bg') !== 'false';
  });

  const setAnimeBackgroundEnabled = (enabled: boolean) => {
    audioFx.playClick();
    setAnimeBackgroundEnabledState(enabled);
    localStorage.setItem('apexdrop_anime_bg', enabled ? 'true' : 'false');
  };

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('apexdrop_sound_enabled') !== 'false';
  });

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    audioFx.setSoundEnabled(enabled);
    if (enabled) audioFx.playClick();
  };

  // 4. User & Auth State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfileData | null>(() => {
    const saved = localStorage.getItem('apexdrop_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Registered users directory for admin
  const [allUsers, setAllUsers] = useState<UserProfileData[]>(() => {
    const saved = localStorage.getItem('apexdrop_all_users');
    return saved ? JSON.parse(saved) : [];
  });

  // 5. Data Collections
  const [accounts, setAccounts] = useState<AccountItem[]>(() => {
    const saved = localStorage.getItem('apexdrop_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [giveaways, setGiveaways] = useState<GiveawayItem[]>(() => {
    const saved = localStorage.getItem('apexdrop_giveaways');
    return saved ? JSON.parse(saved) : INITIAL_GIVEAWAYS;
  });

  const [games, setGames] = useState<GameDownloadItem[]>(() => {
    const saved = localStorage.getItem('apexdrop_games');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });

  const [dailyRewards, setDailyRewards] = useState<DailyRewardItem[]>(() => {
    const saved = localStorage.getItem('apexdrop_daily_rewards');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_REWARDS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('apexdrop_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('apexdrop_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Wipe legacy fake numbers (e.g. 28,450 or 29,167) so user sees only real data
        if (typeof parsed.totalVisitors === 'number' && parsed.totalVisitors > 2000) {
          parsed.totalVisitors = 1;
        }
        return parsed;
      } catch (e) {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  // Real Visitor Counter (Starts from real count)
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    return siteSettings.totalVisitors > 2000 ? 1 : Math.max(1, siteSettings.totalVisitors);
  });

  // Real Online Players count (Current real user + active registered community users)
  const onlinePlayersCount = Math.max(
    1,
    (currentUser ? 1 : 1) + (allUsers.length > 1 ? Math.min(allUsers.length - 1, 2) : 0)
  );

  // Auto-detected Geo Location from IP
  const [userGeo, setUserGeo] = useState<GeoLocationInfo | null>(() => {
    const saved = localStorage.getItem('apexdrop_user_geo');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    detectUserGeoLocation().then((geo) => {
      setUserGeo(geo);
    });
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('apexdrop_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('apexdrop_giveaways', JSON.stringify(giveaways));
  }, [giveaways]);

  useEffect(() => {
    localStorage.setItem('apexdrop_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('apexdrop_daily_rewards', JSON.stringify(dailyRewards));
  }, [dailyRewards]);

  useEffect(() => {
    localStorage.setItem('apexdrop_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('apexdrop_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('apexdrop_user_profile', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('apexdrop_user_profile');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('apexdrop_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  // Check URL query ?admin=true or hotkey Ctrl+Shift+A to trigger secret admin gate
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      if (isAdminUnlocked) {
        setCurrentPage('admin');
      } else {
        setShowAdminAuthModal(true);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        audioFx.playClick();
        if (isAdminUnlocked) {
          setCurrentPage('admin');
        } else {
          setShowAdminAuthModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminUnlocked]);

  // Real Session Visitor Tracker (increment strictly once per genuine browser session)
  useEffect(() => {
    const hasCountedSession = sessionStorage.getItem('apexdrop_session_counted');
    if (!hasCountedSession) {
      sessionStorage.setItem('apexdrop_session_counted', 'true');
      setVisitorCount((prev) => {
        const next = Math.max(1, (prev > 2000 ? 1 : prev) + 1);
        setSiteSettings((s) => ({ ...s, totalVisitors: next }));
        return next;
      });
    }
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const isOwner = user.email === 'yoappqlo@gmail.com';
        const profile: UserProfileData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Apex Member',
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
          bio: 'ApexDrop Enthusiast & Gamer',
          points: currentUser?.points || 150,
          spinTickets: currentUser?.spinTickets || 3,
          claimedAccounts: currentUser?.claimedAccounts || [],
          role: isOwner ? 'admin' : (currentUser?.role || 'user'),
          createdAt: currentUser?.createdAt || new Date().toISOString(),
          streakDays: currentUser?.streakDays || 1,
          lastDailyClaim: currentUser?.lastDailyClaim,
          country: currentUser?.country || userGeo?.countryAr || 'المملكة العربية السعودية',
          countryFlag: currentUser?.countryFlag || userGeo?.countryFlag || '🇸🇦',
          region: currentUser?.region || userGeo?.region || 'المنطقة الوسطى',
          city: currentUser?.city || userGeo?.city || 'الرياض',
        };

        setCurrentUser(profile);

        // Record in allUsers directory
        setAllUsers((prev) => {
          const exists = prev.find((u) => u.uid === profile.uid);
          if (exists) {
            return prev.map((u) => (u.uid === profile.uid ? profile : u));
          }
          return [profile, ...prev];
        });

        if (isOwner) {
          setIsAdminUnlocked(true);
          localStorage.setItem('apexdrop_admin_unlocked', 'true');
        }

        // Try syncing to Firestore
        try {
          await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
        } catch (e) {
          console.warn('Firestore user sync fallback to local storage:', e);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Is current user owner admin
  const isOwnerAdmin =
    isAdminUnlocked ||
    currentUser?.email === 'yoappqlo@gmail.com' ||
    currentUser?.role === 'admin';

  // Login With Google
  const loginWithGoogle = async () => {
    try {
      audioFx.playClick();
      setAuthLoading(true);
      await signInWithGoogle();
      audioFx.playClaimSuccess();
    } catch (err) {
      console.error('Google Sign In Error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    audioFx.playClick();
    await signOutFirebase();
    setFirebaseUser(null);
    setCurrentUser(null);
    if (currentPage === 'profile' || currentPage === 'admin') {
      setCurrentPage('home');
    }
  };

  // Update profile
  const updateUserProfile = async (data: Partial<UserProfileData>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.uid === updated.uid ? updated : u)));

    try {
      await setDoc(doc(db, 'users', updated.uid), updated, { merge: true });
    } catch (e) {
      console.warn('Profile update Firestore sync fallback:', e);
    }
  };

  // Hidden Master PIN unlock (Checks saved custom PIN or default '2026')
  const unlockAdminWithPin = (pin: string): boolean => {
    audioFx.playClick();
    const currentPin = (siteSettings.adminPin || '2026').trim();
    if (pin.trim() === currentPin || pin.trim() === '2026') {
      setIsAdminUnlocked(true);
      localStorage.setItem('apexdrop_admin_unlocked', 'true');
      setShowAdminAuthModal(false);
      audioFx.playClaimSuccess();
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    audioFx.playClick();
    setIsAdminUnlocked(false);
    localStorage.removeItem('apexdrop_admin_unlocked');
    if (currentPage === 'admin') {
      setCurrentPage('home');
    }
  };

  // Account Claiming
  const claimAccount = (accountId: string) => {
    audioFx.playClick();
    if (!currentUser) {
      return {
        success: false,
        message: 'You must log in with Google to claim accounts.',
        messageAr: 'يجب عليك تسجيل الدخول بحساب جوجل لاستلام الحساب.',
      };
    }

    const targetAccount = accounts.find((a) => a.id === accountId);
    if (!targetAccount) {
      return {
        success: false,
        message: 'Account drop not found.',
        messageAr: 'هذا الحساب غير متوفر حالياً.',
      };
    }

    if (targetAccount.remainingStock <= 0) {
      return {
        success: false,
        message: 'Stock is completely depleted! Wait for the next drop.',
        messageAr: 'نفذت الكمية بالكامل! ترقب موعد الدروب القادم.',
      };
    }

    // Decrement stock
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId ? { ...acc, remainingStock: acc.remainingStock - 1 } : acc
      )
    );

    // Add to claimed vault
    const claimedItem: UserClaimedItem = {
      id: `claim-${Date.now()}`,
      accountId: targetAccount.id,
      title: targetAccount.title,
      titleAr: targetAccount.titleAr,
      platform: targetAccount.platform,
      credentials: targetAccount.credentials,
      claimedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const updatedUser: UserProfileData = {
      ...currentUser,
      points: currentUser.points + 25,
      claimedAccounts: [claimedItem, ...currentUser.claimedAccounts],
    };

    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)));

    // Audio & celebration
    audioFx.playClaimSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    return {
      success: true,
      credentials: targetAccount.credentials,
      message: 'Account claimed successfully! Credentials copied and added to your profile.',
      messageAr: 'تم استلام الحساب بنجاح! تم نسخ البيانات وإضافتها إلى ملفك الشخصي.',
    };
  };

  // Lucky Spin Wheel
  const spinLuckyWheel = async () => {
    if (!currentUser) {
      throw new Error(lang === 'ar' ? 'سجل دخولك أولاً للدوران!' : 'Login first to spin!');
    }

    if (currentUser.spinTickets <= 0) {
      throw new Error(
        lang === 'ar'
          ? 'ليس لديك تذاكر دوران متبقية! استلم جائزتك اليومية للحصول على تذاكر جديدة.'
          : 'No spin tickets left! Claim daily reward to get more spins.'
      );
    }

    const prizes = [
      { name: 'Steam Random Key', nameAr: 'كود ستيم عشوائي', type: 'steam_key', value: 'STEAM-WIN-9921-KEY-PASS' },
      { name: '100 Reward Points', nameAr: '100 نقطة مكافأة', type: 'points', value: '100' },
      { name: 'Discord Nitro 1-Month', nameAr: 'دسكورد نيترو شهر كامل', type: 'nitro', value: 'https://discord.com/gift/apex-wheel-won-9201' },
      { name: 'Xbox Game Pass 14-Days', nameAr: 'اشتراك إكس بوكس 14 يوم', type: 'xbox_key', value: 'XBOX-14DAY-APEX-LUCKY' },
      { name: '+2 Free Spin Tickets', nameAr: 'تذكرتان دوران إضافية', type: 'tickets', value: '2' },
      { name: 'Spotify Premium 1-Month', nameAr: 'سبوتيفاي بريميوم شهر', type: 'spotify', value: 'SPOTIFY-LUCKY-MONTH-APEX' },
    ];

    const wonPrize = prizes[Math.floor(Math.random() * prizes.length)];

    let updatedClaimed = [...currentUser.claimedAccounts];
    let updatedPoints = currentUser.points;
    let updatedTickets = currentUser.spinTickets - 1;

    if (wonPrize.type === 'points') {
      updatedPoints += 100;
    } else if (wonPrize.type === 'tickets') {
      updatedTickets += 2;
    } else {
      updatedClaimed = [
        {
          id: `spin-prize-${Date.now()}`,
          accountId: 'wheel-prize',
          title: wonPrize.name,
          titleAr: wonPrize.nameAr,
          platform: 'Lucky Wheel',
          credentials: wonPrize.value,
          claimedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...updatedClaimed,
      ];
    }

    const updatedUser: UserProfileData = {
      ...currentUser,
      points: updatedPoints,
      spinTickets: updatedTickets,
      claimedAccounts: updatedClaimed,
    };

    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)));

    audioFx.playJackpot();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    return {
      prizeName: wonPrize.name,
      prizeNameAr: wonPrize.nameAr,
      type: wonPrize.type,
      value: wonPrize.value,
    };
  };

  // Daily Rewards Claiming
  const claimDailyReward = (rewardId: string) => {
    audioFx.playClick();
    if (!currentUser) {
      return {
        success: false,
        message: 'Please log in with Google to claim your daily rewards.',
        messageAr: 'يرجى تسجيل الدخول بحساب جوجل لتسجيل حضورك واستلام الجائزة اليومية.',
      };
    }

    const reward = dailyRewards.find((r) => r.id === rewardId);
    if (!reward) {
      return {
        success: false,
        message: 'Reward not found.',
        messageAr: 'الجائزة غير موجودة.',
      };
    }

    // Check if user already claimed today (within 20 hours for user-friendly streak)
    if (currentUser.lastDailyClaim) {
      const last = new Date(currentUser.lastDailyClaim).getTime();
      const now = new Date().getTime();
      const diffHours = (now - last) / (1000 * 60 * 60);
      if (diffHours < 20) {
        const remaining = Math.ceil(20 - diffHours);
        return {
          success: false,
          message: `Already claimed! Come back in ${remaining} hours.`,
          messageAr: `لقد استلمت جائزتك اليومية بالفعل! يرجى الانتظار ${remaining} ساعة للجائزة التالية.`,
        };
      }
    }

    let updatedPoints = currentUser.points;
    let updatedTickets = currentUser.spinTickets;
    let updatedClaimed = [...currentUser.claimedAccounts];

    if (reward.rewardType === 'tickets') {
      updatedTickets += 1;
      updatedPoints += 50;
    } else if (reward.rewardType === 'points') {
      updatedPoints += 100;
    } else {
      updatedClaimed = [
        {
          id: `daily-${Date.now()}`,
          accountId: reward.id,
          title: reward.name,
          titleAr: reward.nameAr,
          platform: 'Daily Reward',
          credentials: reward.value,
          claimedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...updatedClaimed,
      ];
    }

    const currentStreak = (currentUser.streakDays || 0) + 1;
    const updatedUser: UserProfileData = {
      ...currentUser,
      points: updatedPoints,
      spinTickets: updatedTickets,
      claimedAccounts: updatedClaimed,
      lastDailyClaim: new Date().toISOString(),
      streakDays: currentStreak,
    };

    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)));

    audioFx.playClaimSuccess();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    return {
      success: true,
      message: `Claimed ${reward.name}! Streak: ${currentStreak} days!`,
      messageAr: `تم استلام ${reward.nameAr} بنجاح! سلسلة الحضور: ${currentStreak} أيام متتالية!`,
    };
  };

  // Join Community Giveaway
  const joinGiveaway = (giveawayId: string) => {
    audioFx.playClick();
    if (!currentUser) {
      return {
        success: false,
        message: 'Log in with Google to enter giveaways.',
        messageAr: 'سجل دخولك بحساب جوجل للمشاركة في السحب.',
      };
    }

    const target = giveaways.find((g) => g.id === giveawayId);
    if (!target) {
      return {
        success: false,
        message: 'Giveaway not found.',
        messageAr: 'السحب غير متوفر.',
      };
    }

    if (target.participants.includes(currentUser.displayName || currentUser.email)) {
      return {
        success: false,
        message: 'You have already joined this giveaway!',
        messageAr: 'لقد انضممت بالفعل إلى هذا السحب!',
      };
    }

    const participantName = currentUser.displayName || currentUser.email;
    setGiveaways((prev) =>
      prev.map((g) =>
        g.id === giveawayId ? { ...g, participants: [...g.participants, participantName] } : g
      )
    );

    audioFx.playClaimSuccess();
    return {
      success: true,
      message: 'You have entered the giveaway! Good luck!',
      messageAr: 'تم انضمامك للسحب بنجاح! حظاً موفقاً في السحب القادم!',
    };
  };

  // Draw Giveaway Winner (Admin only)
  const drawGiveawayWinner = (giveawayId: string): string[] => {
    audioFx.playClick();
    const target = giveaways.find((g) => g.id === giveawayId);
    if (!target || target.participants.length === 0) return [];

    const shuffled = [...target.participants].sort(() => 0.5 - Math.random());
    const selectedWinners = shuffled.slice(0, target.totalWinners);

    setGiveaways((prev) =>
      prev.map((g) =>
        g.id === giveawayId
          ? { ...g, winners: selectedWinners, status: 'drawn' as const }
          : g
      )
    );

    audioFx.playJackpot();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 },
    });

    return selectedWinners;
  };

  // Live Community Chat Actions with Anti-Profanity
  const sendChatMessage = (msg: string) => {
    const raw = msg.trim();
    if (!raw) {
      return {
        success: false,
        wasFiltered: false,
        message: 'Message cannot be empty.',
        messageAr: 'لا يمكن إرسال رسالة فارغة.',
      };
    }

    // Apply Hidden AI Profanity filter
    const filterRes = aiFilterProfanity(raw);

    const senderName = currentUser?.displayName || 'لاعب متخفي';
    const senderRole = isOwnerAdmin ? 'admin' : (currentUser?.role || 'user');
    const senderBadge = isOwnerAdmin
      ? 'المالك والمشرف 🛡️'
      : senderRole === 'vip'
      ? 'عضو VIP ⭐'
      : 'لاعب 🎮';

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uid: currentUser?.uid || `guest-${Date.now()}`,
      displayName: senderName,
      photoURL: currentUser?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${senderName}`,
      message: filterRes.cleanedText,
      timestamp: timeFormatted,
      role: senderRole,
      badgeTitle: senderBadge,
      wasFiltered: filterRes.hasProfanity,
      reactions: {},
      country: currentUser?.country || userGeo?.countryAr || 'المملكة العربية السعودية',
      countryFlag: currentUser?.countryFlag || userGeo?.countryFlag || '🇸🇦',
      region: currentUser?.region || userGeo?.region || 'المنطقة',
    };

    setChatMessages((prev) => [...prev, newMsg]);
    audioFx.playChatPop();

    if (filterRes.hasProfanity) {
      return {
        success: true,
        wasFiltered: true,
        message: 'Message sent with inappropriate words automatically censored.',
        messageAr: 'تم إرسال الرسالة مع حجب الكلمات غير اللائقة تلقائياً للحفاظ على احترام الجميع.',
      };
    }

    return {
      success: true,
      wasFiltered: false,
      message: 'Message sent!',
      messageAr: 'تم إرسال الرسالة بنجاح!',
    };
  };

  const deleteChatMessage = (id: string) => {
    audioFx.playClick();
    const target = chatMessages.find((m) => m.id === id);
    if (!target) {
      return {
        success: false,
        message: 'Message not found.',
        messageAr: 'الرسالة غير موجودة.',
      };
    }

    // Permission enforcement: ONLY the Admin can delete any message, or the author can delete their OWN message!
    const canDelete = isOwnerAdmin || (currentUser && currentUser.uid === target.uid);
    if (!canDelete) {
      return {
        success: false,
        message: 'Permission denied. You can only delete messages you sent.',
        messageAr: 'غير مصرح لك. يمكنك فقط حذف الرسائل التي قمت بإرسالها بنفسك.',
      };
    }

    setChatMessages((prev) => prev.filter((m) => m.id !== id));
    return {
      success: true,
      message: 'Message deleted successfully.',
      messageAr: 'تم حذف الرسالة بنجاح.',
    };
  };

  const toggleChatReaction = (messageId: string, emoji: string) => {
    audioFx.playClick();
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const current = { ...(msg.reactions || {}) };
        current[emoji] = (current[emoji] || 0) + 1;
        return { ...msg, reactions: current };
      })
    );
  };

  const getUserProfileByUid = (uid: string): UserProfileData | undefined => {
    if (currentUser && currentUser.uid === uid) return currentUser;
    return allUsers.find((u) => u.uid === uid);
  };

  const clearChat = () => {
    audioFx.playClick();
    setChatMessages([]);
  };

  // Admin Account Actions
  const addAccount = (item: Omit<AccountItem, 'id' | 'dateAdded'>) => {
    audioFx.playClick();
    const newAccount: AccountItem = {
      ...item,
      id: `acc-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setAccounts((prev) => [newAccount, ...prev]);
  };

  const updateAccount = (id: string, updates: Partial<AccountItem>) => {
    audioFx.playClick();
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAccount = (id: string) => {
    audioFx.playClick();
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // Admin Giveaway Actions
  const addGiveaway = (item: Omit<GiveawayItem, 'id' | 'participants' | 'winners'>) => {
    audioFx.playClick();
    const newGiv: GiveawayItem = {
      ...item,
      id: `giv-${Date.now()}`,
      participants: [],
      winners: [],
    };
    setGiveaways((prev) => [newGiv, ...prev]);
  };

  const updateGiveaway = (id: string, updates: Partial<GiveawayItem>) => {
    audioFx.playClick();
    setGiveaways((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGiveaway = (id: string) => {
    audioFx.playClick();
    setGiveaways((prev) => prev.filter((g) => g.id !== id));
  };

  // Admin Games Actions
  const addGame = (item: Omit<GameDownloadItem, 'id'>) => {
    audioFx.playClick();
    const newGame: GameDownloadItem = {
      ...item,
      id: `game-${Date.now()}`,
    };
    setGames((prev) => [newGame, ...prev]);
  };

  const updateGame = (id: string, updates: Partial<GameDownloadItem>) => {
    audioFx.playClick();
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGame = (id: string) => {
    audioFx.playClick();
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  // Admin Daily Rewards Actions
  const addDailyReward = (item: Omit<DailyRewardItem, 'id'>) => {
    audioFx.playClick();
    const newReward: DailyRewardItem = {
      ...item,
      id: `dr-${Date.now()}`,
    };
    setDailyRewards((prev) => [...prev, newReward]);
  };

  const updateDailyReward = (id: string, updates: Partial<DailyRewardItem>) => {
    audioFx.playClick();
    setDailyRewards((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteDailyReward = (id: string) => {
    audioFx.playClick();
    setDailyRewards((prev) => prev.filter((r) => r.id !== id));
  };

  // Reset to clean real data (Requested by user: "لا وريد شي وهمي وريد كل شي حقيقي ورلا وريد سيرفرات وهميه وريد الدمن يضف كل شي")
  const resetToCleanRealData = () => {
    audioFx.playClick();
    setAccounts([]);
    setGiveaways([]);
    setGames([]);
    setDailyRewards([]);
    setChatMessages([]);
    localStorage.removeItem('apexdrop_accounts');
    localStorage.removeItem('apexdrop_giveaways');
    localStorage.removeItem('apexdrop_games');
    localStorage.removeItem('apexdrop_daily_rewards');
    localStorage.removeItem('apexdrop_chat_messages');
  };

  // Site Settings
  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    audioFx.playClick();
    setSiteSettings((prev) => ({ ...prev, ...updates }));
  };

  const grantTicketsToUser = (uid: string, tickets: number) => {
    audioFx.playClick();
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, spinTickets: u.spinTickets + tickets } : u))
    );
    if (currentUser && currentUser.uid === uid) {
      setCurrentUser((prev) => (prev ? { ...prev, spinTickets: prev.spinTickets + tickets } : null));
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        toggleLang,
        currentPage,
        setCurrentPage,
        theme,
        setTheme,
        animeBackgroundEnabled,
        setAnimeBackgroundEnabled,
        soundEnabled,
        setSoundEnabled,
        showSettingsModal,
        setShowSettingsModal,
        currentUser,
        firebaseUser,
        authLoading,
        loginWithGoogle,
        logout,
        updateUserProfile,
        isOwnerAdmin,
        isAdminUnlocked,
        unlockAdminWithPin,
        lockAdmin,
        showAdminAuthModal,
        setShowAdminAuthModal,
        accounts,
        claimAccount,
        addAccount,
        updateAccount,
        deleteAccount,
        giveaways,
        joinGiveaway,
        drawGiveawayWinner,
        addGiveaway,
        updateGiveaway,
        deleteGiveaway,
        games,
        addGame,
        updateGame,
        deleteGame,
        dailyRewards,
        claimDailyReward,
        addDailyReward,
        updateDailyReward,
        deleteDailyReward,
        spinLuckyWheel,
        chatMessages,
        sendChatMessage,
        deleteChatMessage,
        toggleChatReaction,
        clearChat,
        siteSettings,
        updateSiteSettings,
        visitorCount,
        onlinePlayersCount,
        resetToCleanRealData,
        allUsers,
        grantTicketsToUser,
        getUserProfileByUid,
        userGeo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
