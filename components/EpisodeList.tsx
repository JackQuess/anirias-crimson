import React, { useState, useMemo, useEffect } from 'react';
import { Episode, Anime } from '../types';
import { Play, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../providers/I18nProvider';

interface EpisodeListProps {
  anime: Anime;
  episodes: Episode[];
  onPlay: (episode: Episode) => void;
}

const ITEMS_PER_PAGE = 50;

const EpisodeList: React.FC<EpisodeListProps> = ({ anime, episodes, onPlay }) => {
  const { t } = useTranslation();
  const [activeSeason, setActiveSeason] = useState<number>(1);
  const [page, setPage] = useState<number>(0);

  const seasonGroups = useMemo(() => {
    const groups: Record<number, Episode[]> = {};
    episodes.forEach(ep => {
      const s = ep.seasonNumber || 1;
      if (!groups[s]) groups[s] = [];
      groups[s].push(ep);
    });
    return groups;
  }, [episodes]);

  const availableSeasons = Object.keys(seasonGroups).map(Number).sort((a, b) => a - b);
  
  useEffect(() => {
    if (availableSeasons.length > 0 && !seasonGroups[activeSeason]) {
      setActiveSeason(availableSeasons[0]);
    }
  }, [availableSeasons, activeSeason, seasonGroups]);

  const currentSeasonEpisodes = seasonGroups[activeSeason] || [];
  const totalPages = Math.ceil(currentSeasonEpisodes.length / ITEMS_PER_PAGE);
  
  const visibleEpisodes = currentSeasonEpisodes.slice(
    page * ITEMS_PER_PAGE, 
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full font-inter">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-cinzel font-bold text-xl flex items-center">
           <span className="w-1 h-6 bg-anirias-crimson mr-3 rounded-full"></span>
           {t('EpisodeList.title')}
        </h3>
        <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">
           {episodes.length} {t('EpisodeList.total')}
        </span>
      </div>

      {availableSeasons.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar">
           {availableSeasons.map(season => (
             <button
               key={season}
               onClick={() => { setActiveSeason(season); setPage(0); }}
               className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                 activeSeason === season 
                   ? 'bg-anirias-crimson text-white border-anirias-crimson shadow-[0_0_10px_#990011]' 
                   : 'bg-transparent text-gray-400 border-white/10 hover:text-white hover:bg-white/5'
               }`}
             >
                {t('EpisodeList.season')} {season}
             </button>
           ))}
        </div>
      )}

      <div className="bg-white/5 border border-white/5 rounded-xl p-4 md:p-6">
         
         {visibleEpisodes.length > 0 ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {visibleEpisodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => onPlay(ep)}
                  className="group relative flex flex-col text-left bg-black/40 hover:bg-anirias-crimson/10 border border-white/5 hover:border-anirias-crimson/50 rounded-lg overflow-hidden transition-all duration-300"
                >
                   <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
                      {ep.image ? (
                        <img src={ep.image} alt={ep.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                           <Layers className="w-8 h-8" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
                         <Play className="w-8 h-8 text-white fill-white drop-shadow-lg" />
                      </div>

                      <div className="absolute bottom-1 left-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                         EP {ep.number}
                      </div>
                   </div>

                   <div className="p-3">
                      <h4 className="text-xs font-bold text-gray-300 group-hover:text-white truncate transition-colors">
                         {ep.title}
                      </h4>
                      {ep.isFiller && (
                         <span className="text-[9px] text-orange-400 uppercase tracking-wider font-bold mt-1 block">
                            {t('EpisodeList.filler')}
                         </span>
                      )}
                   </div>
                </button>
              ))}
           </div>
         ) : (
           <div className="py-10 text-center text-gray-500 text-sm">
              {t('EpisodeList.noEpisodes')}
           </div>
         )}

         {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 pt-4 border-t border-white/5">
               {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                       page === i 
                         ? 'bg-white text-black' 
                         : 'bg-black border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                     {i * ITEMS_PER_PAGE + 1}-{Math.min((i + 1) * ITEMS_PER_PAGE, currentSeasonEpisodes.length)}
                  </button>
               ))}
            </div>
         )}

      </div>
    </div>
  );
};

export default EpisodeList;