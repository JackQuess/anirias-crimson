"use client";
import React, { useMemo, useState } from 'react';
import { Anime, Episode } from '../types';
import { Play, Calendar, Clock, Star, MonitorPlay, Languages, Film, Users, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EpisodeList from './EpisodeList';
import CommentSection from './CommentSection';
import AnimeInteractions from './AnimeInteractions';
import { useTranslation } from '../providers/I18nProvider';

interface AnimeDetailProps {
  anime: Anime;
  onPlay: (anime: Anime) => void;
  onBack: () => void; 
  isAuth?: boolean; 
  onLogin?: () => void;
}

const AnimeDetail: React.FC<AnimeDetailProps> = ({ anime, onPlay, onBack, isAuth, onLogin }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'episodes' | 'characters' | 'comments'>('episodes');

  const episodes: Episode[] = useMemo(() => {
    const count = anime.episodes || 12;
    return Array.from({ length: count }).map((_, i) => ({
      id: `ep-${anime.id}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      image: `https://picsum.photos/seed/${anime.id}ep${i}/300/200`,
      isFiller: i % 7 === 0, 
      seasonNumber: i < 12 ? 1 : i < 24 ? 2 : 3, 
      useManualSource: false
    }));
  }, [anime]);

  const handleEpisodePlay = (episode: Episode) => {
     onPlay(anime); 
  };

  return (
    <div className="min-h-screen relative w-full pt-24 pb-10">
      
      <div className="fixed inset-0 z-0">
        <img 
          src={anime.imageUrl} 
          alt="Background" 
          className="w-full h-full object-cover opacity-40 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-anirias-void/90 via-anirias-void/95 to-anirias-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-anirias-void via-anirias-void/80 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          <div className="lg:col-span-1 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full aspect-[2/3] rounded-xl overflow-hidden group"
            >
              <div className="absolute -inset-1 bg-anirias-crimson/40 blur-xl animate-pulse-slow" />
              <img 
                src={anime.imageUrl} 
                alt={anime.title} 
                className="relative w-full h-full object-cover rounded-xl shadow-2xl z-10 border border-white/10"
              />
              <div className="absolute top-2 left-2 z-20 bg-anirias-crimson text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                HD
              </div>
            </motion.div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onPlay(anime)}
                className="w-full bg-anirias-crimson hover:bg-anirias-bright text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,20,60,0.4)] transition-all hover:scale-[1.02]"
              >
                <Play className="w-5 h-5 fill-current" />
                {t('AnimeDetail.watchNow')}
              </button>
              
              <AnimeInteractions anime={anime} isAuth={isAuth} onLogin={onLogin} />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-6xl font-cinzel font-black text-white leading-tight mb-4">
                {anime.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-1 text-anirias-accent font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  {anime.rating}
                </div>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {anime.year || 2024}
                </div>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <div className="flex items-center gap-1">
                  <MonitorPlay className="w-4 h-4" />
                  ANIME
                </div>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {anime.duration}
                </div>
                <div className="ml-auto flex gap-2">
                   <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-sm">HD</span>
                   <span className="flex items-center gap-1 bg-anirias-crimson text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                     <Languages className="w-3 h-3" /> {anime.sub}
                   </span>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-6 md:p-8 shadow-xl">
                <h3 className="text-anirias-crimson font-cinzel font-bold text-lg mb-3">{t('AnimeDetail.synopsis')}</h3>
                <p className="text-gray-300 font-inter leading-relaxed text-sm md:text-base">
                  {anime.description}
                </p>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-sm">
                   <div>
                      <span className="text-gray-500 block text-xs mb-1">{t('AnimeDetail.type')}</span>
                      <span className="text-white font-medium">ANIME</span>
                   </div>
                   <div>
                      <span className="text-gray-500 block text-xs mb-1">{t('Catalog.status')}</span>
                      <span className="text-white font-medium">{anime.status}</span>
                   </div>
                   <div>
                      <span className="text-gray-500 block text-xs mb-1">{t('AnimeDetail.studio')}</span>
                      <span className="text-white font-medium hover:text-anirias-crimson cursor-pointer transition-colors">{anime.studio || "Gremory Ent."}</span>
                   </div>
                   <div>
                      <span className="text-gray-500 block text-xs mb-1">{t('Catalog.genre')}</span>
                      <span className="text-white font-medium flex flex-wrap gap-1">
                        {anime.tags.slice(0, 2).map((t, i) => (
                          <span key={i}>{t}{i < 1 && ','}</span>
                        ))}
                      </span>
                   </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-10">
               <div className="flex border-b border-white/10 mb-6">
                  <TabButton 
                    isActive={activeTab === 'episodes'} 
                    onClick={() => setActiveTab('episodes')} 
                    icon={Film} 
                    label={t('AnimeDetail.tabEpisodes')} 
                    count={episodes.length}
                  />
                  <TabButton 
                    isActive={activeTab === 'characters'} 
                    onClick={() => setActiveTab('characters')} 
                    icon={Users} 
                    label={t('AnimeDetail.tabCharacters')} 
                  />
                  <TabButton 
                    isActive={activeTab === 'comments'} 
                    onClick={() => setActiveTab('comments')} 
                    icon={MessageCircle} 
                    label={t('AnimeDetail.tabDiscussion')} 
                    count={124} 
                  />
               </div>

               <AnimatePresence mode="wait">
                  {activeTab === 'episodes' && (
                     <motion.div
                       key="episodes"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       transition={{ duration: 0.3 }}
                     >
                        <EpisodeList anime={anime} episodes={episodes} onPlay={handleEpisodePlay} />
                     </motion.div>
                  )}

                  {activeTab === 'characters' && (
                     <motion.div
                       key="characters"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       transition={{ duration: 0.3 }}
                     >
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                           {anime.characters?.map((char) => (
                             <div key={char.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-anirias-crimson transition-colors shadow-lg">
                                  <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="text-white font-bold text-sm line-clamp-1">{char.name}</h4>
                                <p className="text-anirias-crimson text-xs mb-2 font-bold">{char.role}</p>
                                <p className="text-gray-500 text-[10px] line-clamp-1 uppercase tracking-wide">CV: {char.voiceActor}</p>
                             </div>
                           ))}
                        </div>
                     </motion.div>
                  )}

                  {activeTab === 'comments' && (
                     <motion.div
                       key="comments"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       transition={{ duration: 0.3 }}
                     >
                        <CommentSection animeId={anime.id} isAuth={isAuth} onLogin={onLogin} />
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; icon: React.ElementType; label: string; count?: number }> = ({ isActive, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
      isActive 
        ? 'text-anirias-crimson border-anirias-crimson bg-gradient-to-t from-anirias-crimson/10 to-transparent' 
        : 'text-gray-500 border-transparent hover:text-white hover:border-white/20'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
    {count !== undefined && (
      <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-anirias-crimson text-white' : 'bg-white/10 text-gray-400'}`}>
        {count}
      </span>
    )}
  </button>
);

export default AnimeDetail;