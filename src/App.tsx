/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AccountsPage } from './pages/AccountsPage';
import { GiveawaysPage } from './pages/GiveawaysPage';
import { GamesPage } from './pages/GamesPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChatPage } from './pages/ChatPage';
import { AdminPanel } from './pages/AdminPanel';
import { SecretAdminModal } from './components/admin/SecretAdminModal';
import { SettingsModal } from './components/SettingsModal';
import { AnimeBackground } from './components/AnimeBackground';

const MainAppContent: React.FC = () => {
  const {
    currentPage,
    isAdminUnlocked,
    showAdminAuthModal,
    setShowAdminAuthModal,
    showSettingsModal,
    siteSettings,
    theme,
    animeBackgroundEnabled,
  } = useApp();

  // If Maintenance mode is active and user is not admin
  if (siteSettings.maintenanceMode && !isAdminUnlocked && currentPage !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4 relative">
        <AnimeBackground theme={theme} enabled={animeBackgroundEnabled} />
        <div className="relative z-10 max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl font-bold">
            ⚡
          </div>
          <h1 className="text-2xl font-black text-white">ApexDrop Under Maintenance</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {siteSettings.dropNoticeAr || siteSettings.dropNotice}
          </p>
          <button
            onClick={() => setShowAdminAuthModal(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono mt-4 underline"
          >
            Owner / Admin Login
          </button>
        </div>
        {showAdminAuthModal && <SecretAdminModal />}
      </div>
    );
  }

  // If in isolated admin page
  if (currentPage === 'admin') {
    if (!isAdminUnlocked) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative">
          <AnimeBackground theme="dark" enabled={true} />
          <div className="relative z-10 w-full max-w-md">
            <SecretAdminModal />
          </div>
        </div>
      );
    }
    return <AdminPanel />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'accounts':
        return <AccountsPage />;
      case 'giveaways':
        return <GiveawaysPage />;
      case 'games':
        return <GamesPage />;
      case 'chat':
        return <ChatPage />;
      case 'about':
        return <AboutPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 relative selection:bg-cyan-500/30 selection:text-cyan-200 ${
        theme === 'light'
          ? 'bg-slate-100 text-slate-900'
          : theme === 'anime'
          ? 'bg-slate-950 text-slate-100'
          : theme === 'natural'
          ? 'bg-slate-950 text-emerald-100'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Animated Anime / Cyber / Natural Canvas Background */}
      <AnimeBackground theme={theme} enabled={animeBackgroundEnabled} />

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{renderCurrentPage()}</main>
        <Footer />
      </div>

      {/* Settings Modal (Theme, Anime Background, Audio, Admin Instructions) */}
      {showSettingsModal && <SettingsModal />}

      {/* Secret Admin Authentication Modal when summoned */}
      {showAdminAuthModal && <SecretAdminModal />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
