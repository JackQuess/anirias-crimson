import React, { useMemo } from 'react';
// FIX: Imported WatchProgress to correctly type the history items.
import { usePlayerStore, WatchProgress } from '../store/usePlayerStore';
import { useGameStore } from '../store/useGameStore';
import { Trophy, Clock, MonitorPlay, Settings, Zap, LayoutDashboard, List, Heart, ChevronRight } from 'lucide-react';
import UserRankCard from './UserRankCard';
import { Anime, ViewState } from '../types';
import { useTranslation } from '../providers/I18nProvider';

interface ProfileProps {
  onNavigate: (view: ViewState) => void;
  onAnimeClick: (anime: Anime) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, onAnimeClick }) => {
  const { t } = useTranslation();
  
  const historyObj = usePlayerStore((state) => state.history);
  const watchlist = usePlayerStore((state) => state.watchlist);
  
  const history = useMemo(() => {
    // FIX: Added explicit types for 'a' and 'b' to allow sorting by 'lastPlayedAt'.
    return Object.values(historyObj).sort((a: WatchProgress, b: WatchProgress) => b.lastPlayedAt - a.lastPlayedAt);
  }, [historyObj]);
  
  const { addXp } = useGameStore();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4 md:px-8 font-inter">
      <div className="container mx-auto max-w-[1200px]">
        
        <div className="flex flex-col md:flex-row gap-6 items-start mb-10">
           <UserRankCard />

           <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-6">
              <div className="flex justify-between items-start">
                 <h3 className="text-lg font-cinzel font-bold text-white mb-2">{t('Profile.trainingGrounds')}</h3>
                 <button 
                   onClick={() => onNavigate(ViewState.ADMIN_DASHBOARD)}
                   className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded text-[10px] font-bold uppercase tracking-wide hover:bg-white/20 transition-colors"
                 >
                    <LayoutDashboard className="w-3 h-3" /> {t('Admin.controlCenter')}
                 </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">{t('Profile.description')}</p>
              <button 
                onClick={() => addXp(50)}
                className="flex items-center gap-2 px-4 py-2 bg-anirias-crimson/20 text-anirias-crimson border border-anirias-crimson/50 rounded-lg hover:bg-anirias-crimson hover:text-white transition-all font-bold text-xs uppercase"
              >
                 <Zap className="w-4 h-4" /> {t('Profile.gainXp', { amount: 50 })}
              </button>
           </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <button
              onClick={() => onNavigate(ViewState.MY_LIST)}
              className="group bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-6 flex justify-between items-center hover:border-anirias-crimson transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-anirias-crimson/10 rounded-lg text-anirias-crimson">
                  <List className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-cinzel font-bold text-white text-left">{t('Profile.myList')}</p>
                  <p className="text-gray-400 text-xs text-left">{t('Profile.myListSubtitle', { count: watchlist.length })}</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate(ViewState.FAVORITES)}
              className="group bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-6 flex justify-between items-center hover:border-pink-500 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500/10 rounded-lg text-pink-500">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-cinzel font-bold text-white text-left">{t('Profile.myFavorites')}</p>
                  <p className="text-gray-400 text-xs text-left">{t('Profile.myFavoritesSubtitle')}</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
            </button>
        </div>


        <div className="mb-12">
           <h2 className="text-xl font-cinzel font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-anirias-crimson" /> {t('Profile.history')}
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* FIX: Explicitly typing 'item' to WatchProgress to resolve property access errors. */}
              {history.slice(0, 3).map((item: WatchProgress) => (
                 <div key={item.animeId} className="flex gap-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg p-3 transition-colors cursor-pointer">
                    <div className="w-20 aspect-video bg-black rounded overflow-hidden flex-shrink-0">
                       <img src={item.animeImage} alt={item.animeTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                       <h4 className="text-white font-bold text-sm truncate">{item.animeTitle}</h4>
                       <p className="text-gray-400 text-xs">Episode {item.episodeNumber}</p>
                       <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div style={{ width: `${(item.timestamp / item.duration) * 100}%` }} className="h-full bg-anirias-crimson"></div>
                       </div>
                    </div>
                 </div>
              ))}
              {history.length === 0 && (
                 <p className="text-gray-500 text-sm">{t('Profile.noHistory')}</p>
              )}
           </div>
        </div>

        <div className="flex justify-center">
           <button 
             onClick={() => onNavigate(ViewState.SETTINGS)}
             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors border border-white/10 px-6 py-3 rounded-lg hover:bg-white/5"
           >
              <Settings className="w-4 h-4" /> {t('Profile.settings')}
           </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;