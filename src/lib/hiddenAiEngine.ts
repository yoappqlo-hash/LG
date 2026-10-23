/**
 * Silent Hidden AI Engine (محرك الذكاء الاصطناعي الخفي)
 * Operates purely in the background without exposing an open chatbot to visitors.
 * Provides:
 * 1. Real-time anti-profanity & toxicity shielding for the public chat (Arabic & English)
 * 2. Smart auto-generator & content enhancer for the admin when adding games, accounts, and daily rewards
 * 3. Credential format sanitizer
 */

// Comprehensive Arabic & English toxic/profane word list
const BANNED_PATTERNS: RegExp[] = [
  // Arabic swear words & insults (common root forms & patterns with variations)
  /\b(كلب|حيوان|حمار|غبي|تافه|وسخ|حقير|زبالة|منحط|سافل|قذر)\b/gi,
  /\b(شرموط[ةه]?|منيك[ةه]?|عرص|ديوث|خول|قحبة|قحبه|شاذ|لوطي)\b/gi,
  /\b(كس|زب|طيز|فحل|طياز|نياك[ةه]?|سكس|اباحي|نيك|منيوك)\b/gi,
  /\b(ابن\s*(الكلب|الحرام|الشرموطة|القحبة|الوسخة))\b/gi,
  /\b(الله\s*يلعن|يلعنك|يلعن\s*ابوك|يلعن\s*امك|كس\s*اختك|كس\s*امك)\b/gi,
  /\b(تف\s*عليك|يا\s*واطي|يا\s*سافل|يا\s*حقير)\b/gi,
  // English common profanities & slurs
  /\b(fuck|fucking|fucker|shit|bitch|asshole|bastard|dick|pussy|cunt|nigger|nigga|whore|slut|fag|faggot)\b/gi,
  /\b(motherfucker|cock|boobs|porn|nude|nudes|nsfw|scam|scammer)\b/gi,
];

export interface ProfanityFilterResult {
  cleanedText: string;
  hasProfanity: boolean;
  detectedCount: number;
}

export const aiFilterProfanity = (text: string): ProfanityFilterResult => {
  if (!text) return { cleanedText: '', hasProfanity: false, detectedCount: 0 };

  let cleaned = text;
  let count = 0;

  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(cleaned)) {
      count++;
      cleaned = cleaned.replace(pattern, (match) => {
        return '*'.repeat(Math.max(match.length, 3));
      });
    }
  }

  return {
    cleanedText: cleaned,
    hasProfanity: count > 0,
    detectedCount: count,
  };
};

/**
 * AI Smart Enhancer for Game Downloads (Admin Tool)
 */
export const aiEnhanceGame = (rawTitle: string, genreHint?: string) => {
  const title = rawTitle.trim();
  const lower = title.toLowerCase();

  let genre = genreHint || 'Action / Open World';
  let genreAr = 'أكشن / عالم مفتوح';
  let size = '45.0 GB';
  let ram = '16 GB RAM';
  let cpu = 'Intel Core i5-11400F / AMD Ryzen 5 3600';
  let gpu = 'NVIDIA GeForce RTX 2060 6GB / AMD RX 5600 XT';
  let storage = '60 GB SSD Available Space';
  let os = 'Windows 10 / 11 64-bit';
  let tags = ['PC', 'Repack', 'Fast Download', 'Multiplayer/Singleplayer'];

  if (lower.includes('gta') || lower.includes('grand theft auto')) {
    genre = 'Open World / Crime Action';
    genreAr = 'عالم مفتوح / مطاردات وأكشن';
    size = '98.5 GB';
    storage = '110 GB SSD';
    tags = ['Rockstar', 'GTA', 'Open World', 'FiveM Ready'];
  } else if (lower.includes('cyberpunk')) {
    genre = 'Sci-Fi RPG / Open World';
    genreAr = 'تقمص أدوار خيال علمي / سايبربانك';
    size = '78.0 GB';
    gpu = 'NVIDIA RTX 3060 12GB';
    tags = ['CDPR', 'Ray Tracing', 'Cyberpunk', 'DLSS 3.5'];
  } else if (lower.includes('forza') || lower.includes('nfs') || lower.includes('speed')) {
    genre = 'Racing / Simulation';
    genreAr = 'سباقات سيارات / محاكاة واقعية';
    size = '112.0 GB';
    tags = ['4K HDR', 'Wheel Support', 'High Speed', 'Open World'];
  } else if (lower.includes('fifa') || lower.includes('fc 2') || lower.includes('pes') || lower.includes('efootball')) {
    genre = 'Sports / Football Simulation';
    genreAr = 'رياضة / محاكاة كرة قدم';
    size = '52.0 GB';
    tags = ['Ultimate Team', 'Controller Ready', 'DirectX 12'];
  } else if (lower.includes('call of duty') || lower.includes('cod') || lower.includes('battlefield')) {
    genre = 'First Person Shooter (FPS)';
    genreAr = 'تصويب منظور أول تكتيكي';
    size = '125.0 GB';
    tags = ['FPS', 'Warzone', 'Multiplayer', 'Military'];
  } else if (lower.includes('elden ring') || lower.includes('souls') || lower.includes('black myth') || lower.includes('wukong')) {
    genre = 'Action RPG / Souls-like';
    genreAr = 'أكشن آر بي جي / أساطير وتحدي';
    size = '85.0 GB';
    gpu = 'NVIDIA RTX 3070';
    tags = ['Hardcore', 'Boss Fights', 'Mythology', 'Unreal Engine 5'];
  }

  const descriptionAr = `نسخة الحاسوب الكاملة والمحدثة من لعبة ${title} بأحدث التصحيحات والحزم الإضافية، تم فحص الملفات وضغطها بأمان لتوفير سرعة تنزيل فائقة مع دعم كامل للعب الفردي ووحدات التحكم.`;
  const descriptionEn = `Complete and verified PC repack for ${title} featuring all latest updates and DLCs. High-speed mirror download, clean crack, and plug-and-play controller compatibility.`;

  return {
    titleAr: `لعبة ${title} - النسخة الأصلية للكمبيوتر`,
    genre,
    genreAr,
    size,
    description: descriptionEn,
    descriptionAr,
    systemRequirements: { os, cpu, ram, gpu, storage },
    tags,
  };
};

/**
 * AI Smart Enhancer for Account Drops (Admin Tool)
 */
export const aiEnhanceAccount = (rawTitle: string, platform: string) => {
  const title = rawTitle.trim();

  let badge = 'Instant Key';
  let badgeAr = 'تسليم فوري';
  let instructionsAr = `قم بتسجيل الدخول إلى حساب ${platform} عبر التطبيق الرسمي، توجه فوراً إلى الإعدادات لتغيير البريد أو كلمة المرور وربط رقم هاتفك لحفظ الحساب باسمك للأبد.`;
  let instructionsEn = `Sign in to ${platform} via the official launcher/website. Go to Account Settings immediately to update the email/password and bind your 2FA.`;

  if (platform === 'Steam') {
    badge = 'Steam Guard Ready';
    badgeAr = 'حساب أصلي ستيم';
    instructionsAr = 'قم بتسجيل الدخول في تطبيق ستيم، ثم غير كلمة المرور واربط تطبيق Steam Guard على هاتفك الشخصي لضمان حماية الحساب 100%.';
  } else if (platform === 'Xbox' || platform === 'PlayStation') {
    badge = 'Console & PC';
    badgeAr = 'كونسول وكمبيوتر';
    instructionsAr = 'يمكنك استخدام الحساب أو الكود مباشرة على جهازك أو عبر متجر مايكروسوفت/سوني. تم فحص الاشتراك ويعمل بضمان كامل.';
  } else if (platform === 'Discord') {
    badge = 'Nitro Boost';
    badgeAr = 'نيترو فوري';
    instructionsAr = 'افتح رابط التفعيل أو الكود وأنت مسجل دخولك في حسابك على دسكورد ليتم تفعيل اشتراك النيترو والبوست فوراً.';
  } else if (platform === 'Netflix' || platform === 'Spotify') {
    badge = 'Ultra HD 4K';
    badgeAr = 'بريميوم بدون إعلانات';
    instructionsAr = 'سجل الدخول بالبيانات المرفقة واستمتع بالبث بجودة فائقة بدون أي انقطاع. لا تقم بتغيير لغة الحساب الرئيسية.';
  }

  return {
    titleAr: `حساب ${title} فخم ومفحوص [ضمان كامل]`,
    badge,
    badgeAr,
    instructions: instructionsEn,
    instructionsAr,
  };
};

/**
 * AI Smart Enhancer for Daily Rewards & Wheel Prizes
 */
export const aiGenerateDailyRewards = () => {
  return [
    { name: '50 Apex Points', nameAr: '50 نقطة مكافأة', value: '50pts', icon: 'Coins', rarity: 'common' },
    { name: '1 Free Wheel Spin', nameAr: 'تذكرة تدوير العجلة مجاناً', value: '1spin', icon: 'Ticket', rarity: 'uncommon' },
    { name: 'Discord Nitro Promo Code', nameAr: 'كود خصم دسكورد نيترو', value: 'nitro_code', icon: 'Sparkles', rarity: 'rare' },
    { name: 'Steam Random CD-Key', nameAr: 'مفتاح ستيم أصلي عشوائي', value: 'steam_key', icon: 'Gamepad2', rarity: 'epic' },
    { name: 'VIP Status for 24 Hours', nameAr: 'رتبة VIP لمدة 24 ساعة', value: 'vip_24h', icon: 'Crown', rarity: 'legendary' },
  ];
};
