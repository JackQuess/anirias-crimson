import React from 'react';
import { Anime } from '../types';
import { Play, Star, MonitorPlay, Film } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick }) => {
  const isMovie = anime.type === 'MOVIE';

  return (
    <div 
      onClick={() => onClick(anime)}
      className="group relative w-full aspect-[2/3] rounded-lg overflow-hidden cursor-pointer bg-anirias-void border border-white/5 hover:border-anirias-crimson/50 transition-colors duration-300"
    >
      {/* Image Layer */}
      <div className="absolute inset-0">
        <img 
          src={anime.imageUrl} 
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-50"
        />
      </div>

      {/* Dynamic Badge (Top Left) */}
      <div className="absolute top-0 left-0 m-2 z-20">
        <div className="flex items-center gap-1 bg-anirias-crimson/90 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-lg backdrop-blur-sm">
          {isMovie ? (
            <Film className="w-3 h-3" />
          ) : (
            <MonitorPlay className="w-3 h-3" />
          )}
          <span>{isMovie ? 'MOVIE' : `EP ${anime.episodes}`}</span>
        </div>
      </div>

      {/* Type/Rating Badge (Top Right) */}
      <div className="absolute top-0 right-0 m-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <div className="flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md border border-white/10">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            {anime.rating}
         </div>
      </div>

      {/* Hover Overlay with Play Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="w-12 h-12 rounded-full bg-anirias-crimson/80 flex items-center justify-center shadow-[0_0_20px_rgba(153,0,17,0.6)] backdrop-blur-sm scale-50 group-hover:scale-100 transition-transform duration-300">
          <Play className="w-5 h-5 text-white fill-current ml-1" />
        </div>
      </div>

      {/* Slide-up Metadata */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-20">
        <h3 className="text-white font-bold text-sm line-clamp-1 mb-1 group-hover:text-anirias-crimson transition-colors font-inter">
          {anime.title}
        </h3>
        
        <div className="flex flex-wrap gap-2 h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span>ANIME</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>{anime.duration}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {anime.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded text-gray-300 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;