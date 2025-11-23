import React from 'react';
import { Anime } from '../types';
import { Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../providers/I18nProvider';

interface RecentEpisodesProps {
  animeList: Anime[];
  onPlay: (anime: Anime) => void;
}

const RecentEpisodes: React.FC<RecentEpisodesProps> = ({ animeList, onPlay }) => {
  const { t } = useTranslation();
  
  const recentReleases = animeList
    .filter(a => a.status === 'Airing' || a.year === new Date().getFullYear())
    .slice(0, 8)
    .map((anime, i) => ({
      ...anime,
      latestEpisode: anime.episodes > 0 ? anime.episodes : 1,
      releasedTime: `${Math.floor(Math.random() * 12) + 1}h ago`
    }))
    .sort((a, b) => parseInt(a.releasedTime) - parseInt(b.releasedTime));

  return (
    <div className="w-full py-8 border-b border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex items-center gap-3 mb-6">
           <div className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-anirias-crimson opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-anirias-crimson"></span>
           </div>
           <h2 className="text-xl md:text-2xl font-cinzel font-bold text-white tracking-wide">
             <span className="text-anirias-crimson">{t('RecentEpisodes.title')}</span>
           </h2>
           <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
           {recentReleases.map((anime, index) => (
             <motion.div
               key={anime.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.05 }}
               onClick={() => onPlay(anime)}
               className="group flex gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-anirias-crimson/30 cursor-pointer transition-all duration-300"
             >
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-black">
                   <img 
                     src={anime.coverUrl || anime.imageUrl} 
                     alt={anime.title} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                   />
                   <div className="absolute bottom-1 right-1 bg-anirias-crimson/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md">
                      EP {anime.latestEpisode}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <Play className="w-6 h-6 text-white fill-white drop-shadow-lg" />
                   </div>
                </div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                   <h4 className="text-sm font-bold text-white truncate group-hover:text-anirias-crimson transition-colors mb-1">
                      {anime.title}
                   </h4>
                   
                   <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                         <Clock className="w-3 h-3" /> {anime.releasedTime}
                      </span>
                   </div>

                   <div className="flex gap-2 mt-auto">
                      {anime.tags.slice(0, 1).map(tag => (
                         <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-gray-500 border border-white/5">
                            {tag}
                         </span>
                      ))}
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default RecentEpisodes;