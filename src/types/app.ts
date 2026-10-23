export type AccountCategory = 'gaming' | 'streaming' | 'nitro' | 'vpn' | 'software';

export interface AccountItem {
  id: string;
  title: string;
  titleAr: string;
  category: AccountCategory;
  platform: 'Steam' | 'Xbox' | 'PlayStation' | 'Epic Games' | 'Netflix' | 'Discord' | 'Spotify' | 'Minecraft' | 'Valorant' | 'Other';
  credentials: string; // login:pass, CD-Key, or license code
  totalStock: number;
  remainingStock: number;
  instructions: string;
  instructionsAr: string;
  badge: string;
  badgeAr: string;
  featured: boolean;
  dateAdded: string;
}

export interface GiveawayItem {
  id: string;
  title: string;
  titleAr: string;
  prize: string;
  prizeAr: string;
  category: string;
  totalWinners: number;
  participants: string[];
  winners: string[];
  endsAt: string;
  status: 'active' | 'drawn' | 'ended';
  description: string;
  descriptionAr: string;
}

export interface GameDownloadItem {
  id: string;
  title: string;
  titleAr: string;
  genre: string;
  genreAr: string;
  size: string;
  rating: number;
  version: string;
  coverImage: string;
  description: string;
  descriptionAr: string;
  downloadUrl: string;
  directMirrorUrl?: string;
  systemRequirements: {
    os: string;
    cpu: string;
    ram: string;
    gpu: string;
    storage: string;
  };
  tags: string[];
}

export interface DailyRewardItem {
  id: string;
  dayNumber: number;
  name: string;
  nameAr: string;
  rewardType: 'points' | 'tickets' | 'steam_key' | 'nitro' | 'account' | 'custom';
  value: string;
  badge: string;
  badgeAr: string;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  message: string;
  timestamp: string;
  role: 'admin' | 'vip' | 'user';
  badgeTitle?: string;
  wasFiltered?: boolean;
}

export interface UserClaimedItem {
  id: string;
  accountId: string;
  title: string;
  titleAr: string;
  platform: string;
  credentials: string;
  claimedAt: string;
}

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio: string;
  points: number;
  spinTickets: number;
  claimedAccounts: UserClaimedItem[];
  role: 'user' | 'vip' | 'admin';
  createdAt: string;
  lastDailyClaim?: string;
  streakDays?: number;
}

export type ThemeMode = 'dark' | 'light' | 'anime' | 'natural';

export interface SiteSettings {
  siteName: string;
  siteNameAr: string;
  announcement: string;
  announcementAr: string;
  announcementActive: boolean;
  totalVisitors: number;
  nextDropCountdown: string;
  maintenanceMode: boolean;
  dropNotice: string;
  dropNoticeAr: string;
  adminPin: string;
  theme: ThemeMode;
  animeBackgroundEnabled: boolean;
  soundEnabled: boolean;
  chatEnabled: boolean;
  aiSmartEnhancerEnabled: boolean;
}
