"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Check, Calendar, Clock, MessageSquare, Mic, Star, Volume2, VolumeX } from 'lucide-react';
import { Anime, HeroSlide } from '../types';
import { useTranslation } from '../providers/I18nProvider';
import { usePlayerStore } from '../store/usePlayerStore';
import { toast } from 'sonner';

interface HeroProps {
  slides?: HeroSlide[]; 
  onPlay: (anime: Anime) => void;
}

const Hero: React.FC<HeroProps> = ({ slides = [], onPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();
  
  // Zustand Store Integration
  const { toggleWatchlist, isInWatchlist } = usePlayerStore();

  const activeSlides = slides.length > 0 
    ? slides.filter(s => s.isActive).sort((a, b) => a.order - b.order)
    : [];

  const currentSlide = activeSlides[currentIndex];
  const currentAnime = currentSlide?.anime;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 12000);
    
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.currentTime = 0; 
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log("Autoplay blocked/interrupted", e));
      }
    }
  }, [currentIndex, isMuted]);
  
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to detail page
    if (!currentAnime) return;
    
    const wasInList = isInWatchlist(currentAnime.id);
    toggleWatchlist(currentAnime);
    
    if (!wasInList) {
      toast.success(`"${currentAnime.title}" added to your list.`);
    } else {
      toast.info(`"${currentAnime.title}" removed from your list.`);
    }
  };


  if (!currentSlide || !currentAnime) return null;
  
  const isAdded = isInWatchlist(currentAnime.id);

  const nextIndex = (currentIndex + 1) % activeSlides.length;
  const nextSlide = activeSlides[nextIndex];

  const displayTitle = currentSlide.title || currentAnime.title;
  const displayDesc = currentSlide.description || currentAnime.description;
  const displayImage = currentSlide.posterUrl || currentAnime.coverUrl || currentAnime.imageUrl;

  return (
    <div className="relative w-full h-[550px] md:h-[650px] lg:h-[800px] bg-anirias-black overflow-hidden group">
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          {currentSlide.videoUrl ? (
            <video
              ref={videoRef}
              src={currentSlide.videoUrl}
              poster={displayImage}
              className="w-full h-full object-cover opacity-60"
              autoPlay
              loop
              muted={isMuted}
              playsInline
            />
          ) : (
            <img 
              src={displayImage} 
              alt={displayTitle} 
              className="w-full h-full object-cover opacity-60"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050505]/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 flex flex-col justify-center pt-12 md:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${currentSlide.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                <h2 className="text-anirias-crimson font-cinzel font-bold text-xl tracking-[0.2em] flex items-center gap-3 mb-2">
                   #{currentIndex + 1} {t('Hero.featured')}
                   <span className="h-[1px] w-12 bg-anirias-crimson/50"></span>
                </h2>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-cinzel font-black text-white leading-[0.95] uppercase drop-shadow-[0_0_25px_rgba(0,0,0,0.8)]">
                  {displayTitle}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-sm">HD</div>
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                    <MessageSquare className="w-3 h-3 fill-white" />
                    <span>SUB: {currentAnime.sub}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-anirias-crimson text-white text-xs font-bold px-2 py-0.5 rounded-sm shadow-glow">
                    <Mic className="w-3 h-3 fill-white" />
                    <span>DUB: {currentAnime.dub ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/10 text-anirias-accent text-xs font-bold px-2 py-0.5 rounded-sm">
                    <Star className="w-3 h-3 fill-current" />
                    <span>RATED {currentAnime.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300 text-xs ml-2 font-bold">
                    <Clock className="w-3 h-3" />
                    <span>{currentAnime.duration}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="w-3 h-3" />
                    <span>{currentAnime.year}</span>
                  </div>
                </div>

                <p className="text-gray-200/90 font-inter text-sm md:text-base leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-4 drop-shadow-md">
                  {displayDesc}
                </p>

                <div className="flex gap-2">
                  {currentAnime.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium border border-white/20 rounded-full text-gray-300 hover:text-white hover:border-anirias-crimson transition-colors cursor-default backdrop-blur-md bg-black/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    onClick={() => onPlay(currentAnime)}
                    className="group px-8 py-3.5 bg-anirias-crimson text-white rounded-lg font-bold text-sm uppercase tracking-wide flex items-center gap-2 hover:bg-anirias-bright hover:shadow-[0_0_20px_rgba(220,20,60,0.6)] hover:scale-105 transition-all duration-300"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    {t('Hero.watch')}
                  </button>
                  <button 
                    onClick={handleWatchlistToggle}
                    className={`px-4 py-3.5 backdrop-blur-sm border rounded-lg transition-all ${isAdded ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-anirias-crimson'}`}
                  >
                    <AnimatePresence mode="wait">
                      {isAdded ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Plus className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden lg:col-span-4 lg:flex flex-col justify-between py-12 pl-6 relative">
            
            {currentSlide.videoUrl && (
               <div className="absolute top-12 right-0">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white"
                  >
                     {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
               </div>
            )}

            <div className="flex-1"></div>

            {nextSlide && nextSlide.anime && (
               <div className="flex flex-col items-end text-right group/next cursor-pointer" onClick={() => setCurrentIndex(nextIndex)}>
                  <p className="text-xs font-bold text-anirias-crimson mb-2 uppercase tracking-widest">{t('Hero.upNext')}</p>
                  <div className="relative w-48 aspect-video rounded-lg overflow-hidden border border-white/20 group-hover/next:border-anirias-crimson transition-colors shadow-lg">
                     <img src={nextSlide.posterUrl || nextSlide.anime.coverUrl || nextSlide.anime.imageUrl} alt="" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/50 group-hover/next:bg-transparent transition-colors duration-300 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white opacity-50 group-hover/next:opacity-100 transition-opacity" />
                     </div>
                  </div>
                  <h4 className="text-white font-bold font-cinzel mt-2 truncate w-full">{nextSlide.title || nextSlide.anime.title}</h4>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
