
import React from 'react';
import { Anime } from '../types';
import { motion } from 'framer-motion';
import { Clock, Play, MonitorPlay, Calendar } from 'lucide-react';

interface SimulcastPageProps {
  animeList: Anime[];
  onAnimeClick: (anime: Anime) => void;
}

const SimulcastPage: React.FC<SimulcastPageProps> = ({ animeList, onAnimeClick }) => {
  // Filter for "Airing" anime and mock a "Released X time ago"
  const simulcastList = animeList
    .filter(a => a.status === 'Airing')
    .slice(0, 10)
    .map((anime, index) => ({
      ...anime,
      // Mock release times for demo
      releasedTime: `${index + 1} hour${index === 0 ? '' : 's'} ago`,
      latestEpNumber: anime.episodes > 0 ? anime.episodes : 12
    }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4 md:px-8 font-inter">
      <div className="container mx-auto max-w-[1200px]">
        
        {/* HEADER */}
        <div className="mb-10 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-anirias-crimson opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-anirias-crimson"></span>
             </div>
             <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white tracking-wide">
               SIMULCAST <span className="text-gray-500 text-lg font-inter font-normal ml-2">// Fresh from Japan</span>
             </h1>
          </div>
          <p className="text-gray-400 text-sm">Catch the latest episodes within 24 hours of their original broadcast.</p>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {simulcastList.map((anime, index) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onAnimeClick(anime)}
              className="group relative flex gap-4 bg-[#0a0a0a] border border-white/10 hover:border-anirias-crimson/50 rounded-xl overflow-hidden p-4 cursor-pointer transition-all hover:bg-white/5"
            >
              {/* Horizontal Layout */}
              
              {/* Thumbnail */}
              <div className="relative w-32 sm:w-40 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                 <img src={anime.coverUrl || anime.imageUrl} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 
                 {/* Play Overlay */}
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-anirias-crimson flex items-center justify-center shadow-lg">
                       <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </div>
                 </div>
                 
                 {/* Time Badge */}
                 <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {anime.duration}
                 </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-anirias-crimson bg-anirias-crimson/10 px-2 py-0.5 rounded border border-anirias-crimson/20">
                       EP {anime.latestEpNumber}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                       <Calendar className="w-3 h-3" /> {anime.releasedTime}
                    </span>
                 </div>
                 
                 <h3 className="text-white font-cinzel font-bold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-anirias-bright transition-colors">
                    {anime.title}
                 </h3>
                 
                 <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                    {anime.description}
                 </p>

                 <div className="flex gap-2 mt-auto">
                    {anime.tags.slice(0, 2).map(tag => (
                       <span key={tag} className="text-[9px] text-gray-500 border border-white/5 px-1.5 rounded bg-white/5">
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

export default SimulcastPage;
