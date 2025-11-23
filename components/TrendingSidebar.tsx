
import React from 'react';
import { Anime, ViewState } from '../types';
import { Star, Eye, ChevronRight } from 'lucide-react';
import { useTranslation } from '../providers/I18nProvider';

interface TrendingSidebarProps {
  animeList: Anime[];
  onAnimeClick: (anime: Anime) => void;
  onNavigate: (view: ViewState) => void; // Added for navigation
}

const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ animeList, onAnimeClick, onNavigate }) => {
  const { t } = useTranslation();
  const sortedList = [...animeList].sort((a, b) => b.rating - a.rating).slice(0, 10);

  return (
    <div className="bg-anirias-void/50 backdrop-blur-md border border-white/5 rounded-xl p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-cinzel font-bold text-xl text-white flex items-center">
          <span className="text-anirias-crimson mr-2">{t('TrendingSidebar.title')}</span>
        </h3>
        <span className="text-xs text-gray-500 border border-white/10 px-2 py-1 rounded cursor-pointer hover:text-white hover:border-anirias-crimson transition-colors">
          {t('TrendingSidebar.weekly')}
        </span>
      </div>

      <div className="space-y-4">
        {sortedList.map((anime, index) => {
          const rank = index + 1;
          const isTopRank = rank === 1;

          return (
            <div 
              key={anime.id} 
              onClick={() => onAnimeClick(anime)}
              className={`group cursor-pointer relative ${isTopRank ? 'mb-6' : ''}`}
            >
              {isTopRank ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-anirias-crimson/30 group-hover:border-anirias-crimson transition-colors">
                   <img src={anime.imageUrl} alt={anime.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                   <div className="absolute top-0 left-0 w-10 h-10 bg-anirias-crimson flex items-center justify-center rounded-br-lg shadow-[0_0_15px_rgba(153,0,17,0.8)] z-10">
                      <span className="font-cinzel font-black text-xl text-white">1</span>
                   </div>
                   <div className="absolute bottom-0 left-0 p-3 w-full">
                      <h4 className="text-white font-bold truncate mb-1">{anime.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                         <div className="flex items-center gap-1"><Eye className="w-3 h-3" /> 1.2M</div>
                         <div className="flex items-center gap-1 text-anirias-accent"><Star className="w-3 h-3 fill-current" /> {anime.rating}</div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
                   <div className={`font-cinzel font-black text-xl w-8 text-center flex-shrink-0 ${
                     rank <= 3 ? 'text-anirias-crimson drop-shadow-[0_0_5px_rgba(153,0,17,0.5)]' : 'text-gray-600'
                   }`}>
                     {rank}
                   </div>
                   <div className="w-12 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                      <img src={anime.imageUrl} alt={anime.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-gray-300 text-sm font-medium truncate group-hover:text-white transition-colors">{anime.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                           <Star className="w-3 h-3 fill-gray-600" /> {anime.rating}
                        </span>
                        <div className="flex gap-1">
                           <span className="px-1 py-[1px] bg-white/10 text-[9px] rounded text-gray-400">ANIME</span>
                           {anime.episodes > 0 && <span className="px-1 py-[1px] bg-anirias-crimson/20 text-anirias-bright text-[9px] rounded">EP {anime.episodes}</span>}
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button 
        onClick={() => onNavigate(ViewState.CATALOG)}
        className="w-full mt-4 py-3 text-xs font-bold text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        {t('TrendingSidebar.leaderboard')} <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};

export default TrendingSidebar;
