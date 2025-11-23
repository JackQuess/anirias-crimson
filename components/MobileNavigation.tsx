import React from 'react';
import { Home, Compass, Search, List, User } from 'lucide-react'; // Changed Heart to List
import { ViewState } from '../types';
import { useTranslation } from '../providers/I18nProvider';

interface MobileNavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentView, onNavigate }) => {
  const { t } = useTranslation();
  
  // Updated active state check logic
  const getIconColor = (view: ViewState) => 
    currentView === view ? "text-anirias-bright drop-shadow-[0_0_8px_rgba(220,20,60,0.8)]" : "text-gray-400";
  
  const getTextColor = (view: ViewState) =>
    currentView === view ? 'text-white' : 'text-gray-500';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-anirias-black/95 to-transparent pointer-events-none -z-10" />
      <div className="relative bg-anirias-black/85 backdrop-blur-xl border-t border-white/5 px-4 pt-2 pb-4 flex justify-between items-end h-[80px] shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        
        <button 
          onClick={() => onNavigate(ViewState.HOME)}
          className="flex-1 flex flex-col items-center gap-1 p-2 active:scale-95 transition-transform touch-manipulation"
        >
          <Home className={`w-6 h-6 transition-colors duration-300 ${getIconColor(ViewState.HOME)}`} />
          <span className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${getTextColor(ViewState.HOME)}`}>{t('MobileNav.home')}</span>
        </button>

        <button 
          onClick={() => onNavigate(ViewState.CATALOG)}
          className="flex-1 flex flex-col items-center gap-1 p-2 active:scale-95 transition-transform touch-manipulation"
        >
          <Compass className={`w-6 h-6 transition-colors duration-300 ${getIconColor(ViewState.CATALOG)}`} />
          <span className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${getTextColor(ViewState.CATALOG)}`}>{t('MobileNav.browse')}</span>
        </button>

        <div className="relative -top-6 px-2">
           <button 
             onClick={() => onNavigate(ViewState.CATALOG)}
             className="w-16 h-16 rounded-full bg-gradient-to-br from-anirias-bright to-anirias-crimson flex items-center justify-center shadow-[0_0_20px_rgba(220,20,60,0.6)] border-4 border-[#050505] active:scale-90 transition-transform duration-200 group"
           >
             <Search className="w-7 h-7 text-white stroke-[2.5]" />
             <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
           </button>
        </div>

        <button 
          onClick={() => onNavigate(ViewState.MY_LIST)} // FIX: Corrected navigation target
          className="flex-1 flex flex-col items-center gap-1 p-2 active:scale-95 transition-transform touch-manipulation"
        >
          <List className={`w-6 h-6 transition-colors duration-300 ${getIconColor(ViewState.MY_LIST)}`} /> {/* FIX: Changed icon */}
          <span className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${getTextColor(ViewState.MY_LIST)}`}>{t('MobileNav.list')}</span>
        </button>

        <button 
          onClick={() => onNavigate(ViewState.PROFILE)} // Correct
          className="flex-1 flex flex-col items-center gap-1 p-2 active:scale-95 transition-transform touch-manipulation"
        >
          <User className={`w-6 h-6 transition-colors duration-300 ${getIconColor(ViewState.PROFILE)}`} />
          <span className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${getTextColor(ViewState.PROFILE)}`}>{t('MobileNav.profile')}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;