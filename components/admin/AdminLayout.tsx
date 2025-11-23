import React from 'react';
import { LayoutDashboard, Database, Users, Activity, Settings, LogOut, ExternalLink, DownloadCloud, Image } from 'lucide-react';
import { ViewState } from '../../types';
import NotificationDropdown from '../NotificationDropdown';
import { useTranslation } from '../../providers/I18nProvider';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentView, onNavigate }) => {
  const { t } = useTranslation();
  
  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: t('Admin.dashboard'), view: ViewState.ADMIN_DASHBOARD },
    { icon: Database, label: t('Admin.animeManagement'), view: ViewState.ADMIN_ANIME },
    { icon: Image, label: t('Admin.heroSlides'), view: ViewState.ADMIN_HERO },
    { icon: DownloadCloud, label: t('Admin.autoImport'), view: ViewState.ADMIN_IMPORT },
    { icon: Users, label: t('Admin.users'), view: ViewState.ADMIN_USERS }, 
    { icon: Activity, label: t('Admin.reports'), view: ViewState.ADMIN_REPORTS },
  ];

  const getBreadcrumb = () => {
    switch (currentView) {
      case ViewState.ADMIN_DASHBOARD: return t('Admin.dashboard');
      case ViewState.ADMIN_ANIME: return t('Admin.animeManagement');
      case ViewState.ADMIN_HERO: return t('Admin.heroSlides');
      case ViewState.ADMIN_IMPORT: return t('Admin.autoImportTitle');
      case ViewState.ADMIN_USERS: return t('Admin.userManagement');
      case ViewState.ADMIN_REPORTS: return t('Admin.reportsTitle');
      case ViewState.ADMIN_SYSTEM: return t('Admin.systemHealthTitle');
      case ViewState.ADMIN_SETTINGS: return t('Admin.settingsTitle');
      default: return t('Admin.system');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-inter flex">
      
      <aside className="w-64 fixed left-0 top-0 bottom-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-white/5 flex flex-col">
        
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <h1 className="text-xl font-cinzel font-bold text-white tracking-wider">
            ANI<span className="text-anirias-crimson">RIAS</span>
            <span className="ml-2 text-[10px] text-gray-500 bg-white/5 px-1 rounded border border-white/5 tracking-normal font-sans">ADMIN</span>
          </h1>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">{t('Admin.mainMenu')}</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => item.view && onNavigate(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === item.view
                  ? 'bg-anirias-crimson/10 text-anirias-crimson border border-anirias-crimson/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}

          <div className="px-3 mb-2 mt-8 text-xs font-bold text-gray-500 uppercase tracking-widest">{t('Admin.system')}</div>
          <button 
            onClick={() => onNavigate(ViewState.ADMIN_SYSTEM)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === ViewState.ADMIN_SYSTEM ? 'bg-anirias-crimson/10 text-anirias-crimson border border-anirias-crimson/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
             <Activity className="w-4 h-4" /> {t('Admin.systemHealth')}
          </button>
          <button 
            onClick={() => onNavigate(ViewState.ADMIN_SETTINGS)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === ViewState.ADMIN_SETTINGS ? 'bg-anirias-crimson/10 text-anirias-crimson border border-anirias-crimson/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
             <Settings className="w-4 h-4" /> {t('Admin.settings')}
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-anirias-crimson flex items-center justify-center font-bold text-xs">AD</div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-white truncate">Administrator</p>
                 <p className="text-xs text-gray-500">System Root</p>
              </div>
              <button className="text-gray-500 hover:text-white"><LogOut className="w-4 h-4" /></button>
           </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-w-0">
        
        <header className="h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 flex items-center justify-between px-8">
           <h2 className="text-sm font-medium text-gray-400">
             {t('Admin.controlCenter')} / <span className="text-white font-bold">{getBreadcrumb()}</span>
           </h2>

           <div className="flex items-center gap-4">
              <NotificationDropdown isAdminContext={true} />
              <button 
                onClick={() => onNavigate(ViewState.HOME)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-anirias-crimson hover:border-anirias-crimson transition-colors"
              >
                 <ExternalLink className="w-3 h-3" /> {t('Admin.liveSite')}
              </button>
           </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;