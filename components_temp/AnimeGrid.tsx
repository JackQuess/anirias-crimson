import React from 'react';
import { Anime } from '../types';
import AnimeCard from './AnimeCard';
import { motion } from 'framer-motion';

interface AnimeGridProps {
  animeList: Anime[];
  onAnimeClick: (anime: Anime) => void;
  title?: string;
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ animeList, onAnimeClick, title = "Latest Episodes" }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
        <h2 className="text-2xl font-cinzel font-bold text-white tracking-wide">
          <span className="text-anirias-crimson mr-2">LATEST</span> UPDATES
        </h2>
        <button className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-widest">View All</button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {animeList.map((anime, index) => (
          <motion.div
            key={anime.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <AnimeCard anime={anime} onClick={onAnimeClick} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimeGrid;