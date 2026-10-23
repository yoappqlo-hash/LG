import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfileData, ChatMessage } from '../types/app';
import { UserProfileModal } from '../components/UserProfileModal';
import {
  MessageSquare,
  Send,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Sparkles,
  Users,
  AlertTriangle,
  Flame,
  Info,
  Lock,
  Smile,
  MapPin,
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const {
    lang,
    currentUser,
    loginWithGoogle,
    isOwnerAdmin,
    chatMessages,
    sendChatMessage,
    deleteChatMessage,
    toggleChatReaction,
    clearChat,
    visitorCount,
    getUserProfileByUid,
    userGeo,
  } = useApp();

  const isAr = lang === 'ar';
  const [inputText, setInputText] = useState('');
  const [lastNotice, setLastNotice] = useState<{ message: string; isWarning: boolean } | null>(null);
  const [selectedUserForModal, setSelectedUserForModal] = useState<UserProfileData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const res = sendChatMessage(inputText);
    setInputText('');

    if (res.wasFiltered) {
      setLastNotice({
        message: isAr ? res.messageAr : res.message,
        isWarning: true,
      });
      setTimeout(() => setLastNotice(null), 6000);
    } else {
      setLastNotice(null);
    }
  };

  const handleDeleteMessage = (msgId: string) => {
    const res = deleteChatMessage(msgId);
    if (!res.success) {
      setLastNotice({
        message: isAr ? res.messageAr : res.message,
        isWarning: true,
      });
      setTimeout(() => setLastNotice(null), 4000);
    }
  };

  // Open User Profile Card (Never exposes email!)
  const handleOpenUserProfile = (msg: ChatMessage) => {
    const existing = getUserProfileByUid(msg.uid);
    if (existing) {
      // Ensure email is never shown to external users
      setSelectedUserForModal({
        ...existing,
        country: existing.country || msg.country || userGeo?.countryAr,
        countryFlag: existing.countryFlag || msg.countryFlag || userGeo?.countryFlag,
        region: existing.region || msg.region || userGeo?.region,
      });
    } else {
      // Build safe public profile view
      setSelectedUserForModal({
        uid: msg.uid,
        email: '', // strictly empty
        displayName: msg.displayName,
        photoURL: msg.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.displayName}`,
        bio: isAr ? 'لاعب نشط في مجتمع ApexDrop' : 'Active gamer in ApexDrop community',
        points: 120,
        spinTickets: 2,
        claimedAccounts: [],
        role: msg.role,
        createdAt: '2026',
        country: msg.country || userGeo?.countryAr || 'المملكة العربية السعودية',
        countryFlag: msg.countryFlag || userGeo?.countryFlag || '🇸🇦',
        region: msg.region || userGeo?.region || 'الشرق الأوسط',
        city: userGeo?.city,
        streakDays: 3,
      });
    }
  };

  const reactionEmojis = ['🔥', '🎮', '❤️', '⚡', '👏'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 relative z-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              {isAr ? 'شات اللاعبين المباشر' : 'Live Community Hub'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {visitorCount.toLocaleString()} {isAr ? 'متصل الآن' : 'online'}
            </span>
            {userGeo && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 font-mono">
                <span>{userGeo.countryFlag}</span>
                <span>{userGeo.countryAr}</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isAr ? 'الشات العام ومجتمع اللاعبين' : 'Global Gamers Lounge'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {isAr
              ? 'تحدث مع اللاعبين وشارك تجاربك. اضغط على صورة أي لاعب لعرض ملفه ومنطقته (البريد محمي ومشفر تماماً).'
              : 'Chat with members. Click on any avatar to view player info and location (email is 100% private).'}
          </p>
        </div>

        {/* Admin Clear Chat Control */}
        {isOwnerAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm(isAr ? 'هل أنت متأكد من مسح جميع رسائل الشات كأدمن؟' : 'Purge all messages as admin?')) {
                  clearChat();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'تفريغ الشات بالكامل (أدمن)' : 'Purge Chat (Admin)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Safety & Anti-Profanity Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-4 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-white">
            {isAr ? 'حماية الشات وفحص الكلمات والمسبات' : 'Anti-Toxicity & Profanity Shield'}
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {isAr
              ? 'يتم فحص كل رسالة قبل نشرها تلقائياً. أي شتائم أو ألفاظ نابية يتم استبدالها فوراً بنجوم (***). يحق لكل لاعب حذف رسالته الخاصة فقط، بينما يحق للأدمن حذف أي رسالة.'
              : 'Messages are automatically scanned. Inappropriate language is censored. Members can only delete their own messages; admins can delete any message.'}
          </p>
        </div>
      </div>

      {/* Chat Messages Frame */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[580px] shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-500">
              <MessageSquare className="w-12 h-12 text-slate-600 stroke-[1.5]" />
              <p className="text-sm font-semibold text-white">
                {isAr ? 'الشات خالي من أي رسائل وهمية.' : 'Chat is clear of dummy messages.'}
              </p>
              <p className="text-xs text-slate-400">
                {isAr ? 'كن أول من يكتب رسالة حقيقية هنا الآن!' : 'Be the first to post a real message!'}
              </p>
            </div>
          ) : (
            chatMessages.map((msg) => {
              const isSenderMe = Boolean(currentUser && currentUser.uid === msg.uid);
              const isAdmin = msg.role === 'admin';
              const isVip = msg.role === 'vip';

              // User can delete ONLY if they are Admin OR they sent the message
              const canDeleteThisMessage = isOwnerAdmin || isSenderMe;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 group transition-opacity ${
                    isSenderMe ? (isAr ? 'flex-row' : 'flex-row-reverse') : ''
                  }`}
                >
                  {/* Clickable Avatar to view player profile & region */}
                  <button
                    onClick={() => handleOpenUserProfile(msg)}
                    className="relative shrink-0 hover:scale-105 transition-transform cursor-pointer"
                    title={isAr ? 'اضغط لعرض معلومات اللاعب ومنطقته' : 'Click to view player profile'}
                  >
                    <img
                      src={msg.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.displayName}`}
                      alt={msg.displayName}
                      className="w-9 h-9 rounded-full border-2 border-slate-700 bg-slate-800 object-cover mt-0.5 shadow-md hover:border-cyan-400 transition-colors"
                    />
                    {msg.countryFlag && (
                      <span className="absolute -bottom-1 -end-1 text-[11px] leading-none bg-slate-900 rounded-full px-0.5 border border-slate-700">
                        {msg.countryFlag}
                      </span>
                    )}
                  </button>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 space-y-1.5 shadow-md ${
                      isSenderMe
                        ? 'bg-gradient-to-br from-cyan-600/90 to-blue-700/90 text-white shadow-cyan-900/20'
                        : isAdmin
                        ? 'bg-gradient-to-br from-purple-950/80 to-slate-900/90 border border-purple-500/40 text-slate-100'
                        : isVip
                        ? 'bg-slate-800/90 border border-amber-500/30 text-slate-100'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-200'
                    }`}
                  >
                    {/* Meta Header */}
                    <div className="space-y-0.5 pb-1 border-b border-white/10">
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          onClick={() => handleOpenUserProfile(msg)}
                          className="font-bold truncate text-white hover:underline cursor-pointer"
                        >
                          {msg.displayName}
                        </button>

                        {isAdmin && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-500 text-[9px] font-black text-white shrink-0">
                            {isAr ? 'المالك 🛡️' : 'Admin'}
                          </span>
                        )}
                        {isVip && !isAdmin && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-[9px] font-black text-slate-950 shrink-0">
                            {isAr ? 'VIP ⭐' : 'VIP'}
                          </span>
                        )}

                        {/* Accurate Clock Time */}
                        <span className="text-[10px] opacity-65 font-mono ms-auto shrink-0">
                          {msg.timestamp}
                        </span>

                        {/* Delete Action (Restricted: ONLY admin or the person who sent it!) */}
                        {canDeleteThisMessage && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 p-1 rounded-md transition-opacity ms-1 hover:bg-rose-950/40"
                            title={
                              isOwnerAdmin && !isSenderMe
                                ? (isAr ? 'حذف الرسالة بصلاحية الأدمن' : 'Delete (Admin)')
                                : (isAr ? 'حذف رسالتك' : 'Delete your message')
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Country flag and Country name directly BELOW the sender name */}
                      {(msg.countryFlag || msg.country) && (
                        <div className="flex items-center gap-1.5 text-[10px] text-cyan-200/90 font-medium">
                          {msg.countryFlag && <span className="text-xs leading-none">{msg.countryFlag}</span>}
                          <span>{msg.country || (isAr ? 'الموقع غير محدد' : 'Unknown')}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>

                    {/* Filter notice tag if censored */}
                    {msg.wasFiltered && (
                      <div className="pt-0.5 flex items-center gap-1 text-[10px] text-amber-300/90 font-medium">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>{isAr ? 'تم حجب بعض الألفاظ تلقائياً' : 'Censored by filter'}</span>
                      </div>
                    )}

                    {/* Reactions Bar */}
                    <div className="flex items-center gap-1 pt-1 border-t border-white/10 mt-1">
                      {reactionEmojis.map((emoji) => {
                        const count = msg.reactions?.[emoji] || 0;
                        return (
                          <button
                            key={emoji}
                            onClick={() => toggleChatReaction(msg.id, emoji)}
                            className={`px-1.5 py-0.5 rounded-lg text-xs flex items-center gap-0.5 transition-all ${
                              count > 0
                                ? 'bg-white/20 text-white font-bold scale-105'
                                : 'opacity-50 hover:opacity-100 hover:bg-white/10'
                            }`}
                          >
                            <span>{emoji}</span>
                            {count > 0 && <span className="text-[10px]">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Filter Alert Toast */}
        {lastNotice && (
          <div
            className={`px-4 py-2 text-xs flex items-center gap-2 border-t ${
              lastNotice.isWarning
                ? 'bg-amber-950/60 border-amber-500/30 text-amber-300'
                : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] font-medium">{lastNotice.message}</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/70">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب رسالتك هنا... (يرجى الالتزام بالاحترام وتجنب المسبات)'
                  : 'Type your message... (strictly no profanity allowed)'
              }
              maxLength={280}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? 'إرسال' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* User Profile Card Modal (Strictly No Email Shown) */}
      {selectedUserForModal && (
        <UserProfileModal
          user={selectedUserForModal}
          onClose={() => setSelectedUserForModal(null)}
        />
      )}
    </div>
  );
};
