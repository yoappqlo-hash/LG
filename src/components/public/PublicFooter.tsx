import React from 'react';
import { useServer } from '../../context/ServerContext';
import { ShieldCheck, Lock } from 'lucide-react';

interface PublicFooterProps {
  onOpenAdminAuth: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onOpenAdminAuth }) => {
  const { lang, isAuthenticated, setCurrentView } = useServer();
  const isAr = lang === 'ar';

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-cyan-600 flex items-center justify-center text-white font-black text-[10px]">
            APX
          </div>
          <span className="text-white font-semibold">
            {isAr ? 'سيرفرات أبيكس كلاود' : 'ApexCore Cloud Platform'}
          </span>
          <span className="text-slate-600">·</span>
          <span>© 2026 ApexCore Systems. All rights reserved.</span>
        </div>

        {/* Links & Dedicated Admin Access */}
        <div className="flex items-center gap-6">
          <span className="text-slate-500 font-mono">SOC 2 Type II · ISO 27001 Certified</span>
          
          {isAuthenticated ? (
            <button
              onClick={() => setCurrentView('admin')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'لوحة تحكم المشرف' : 'Admin Console'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminAuth}
              className="text-slate-400 hover:text-cyan-400 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAr ? 'بوابة إدارة السيرفر (Admin)' : 'Admin Portal Login'}</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
