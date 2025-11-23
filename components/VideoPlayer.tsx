"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Anime, Episode } from '../types';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, ArrowLeft, SkipForward, MessageSquare, Server, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js';
import CommentSection from './CommentSection';
import { usePlayerShortcuts } from '../hooks/usePlayerShortcuts';
import PlayerOverlay, { OverlayType } from './PlayerOverlay';
import { useTranslation } from '../providers/I18nProvider';

interface VideoPlayerProps {
  anime: Anime;
  onBack: () => void;
}

const SERVERS = [
  { id: 'vidstream', name: 'Vidstreaming' },
  { id: 'megacloud', name: 'MegaCloud' },
  { id: 'streamsb', name: 'StreamSB' },
  { id: 'hydrax', name: 'HydraX' },
];

const TEST_HLS_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'; 

const generateEpisodes = (count: number): Episode[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `ep-${i + 1}`,
    number: i + 1,
    title: `Episode ${i + 1}`,
    duration: "24:00",
    thumbnail: "" 
  }));
};

interface QualityLevel {
  height: number;
  index: number;
  bitrate: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ anime, onBack }) => {
  const { t } = useTranslation();
  const episodeCount = anime.episodes > 0 ? anime.episodes : 24;
  const episodes = generateEpisodes(episodeCount);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(episodes[0]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentServer, setCurrentServer] = useState('vidstream');
  const [overlayState, setOverlayState] = useState<{ type: OverlayType, value?: string | number }>({ type: null });
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [qualities, setQualities] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);
  const [showSettings, setShowSettings] = useState(false);

  const triggerOverlay = (type: OverlayType, value?: string | number) => {
    setOverlayState({ type, value });
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => {
      setOverlayState({ type: null });
    }, 800);
  };

  const handleShortcutPlayPause = () => { /* ... */ };
  const handleShortcutSeek = (forward: boolean) => { /* ... */ };
  const handleShortcutVolume = (up: boolean) => { /* ... */ };
  const handleShortcutMute = () => { /* ... */ };
  const handleShortcutFullscreen = () => { /* ... */ };

  usePlayerShortcuts({
    onPlayPause: () => { if (videoRef.current) { isPlaying ? videoRef.current.pause() : videoRef.current.play(); triggerOverlay(isPlaying ? 'pause' : 'play'); } },
    onSeekForward: () => { if(videoRef.current) { videoRef.current.currentTime += 10; triggerOverlay('forward', '+10s'); } },
    onSeekBackward: () => { if(videoRef.current) { videoRef.current.currentTime -= 10; triggerOverlay('rewind', '-10s'); } },
    onVolumeUp: () => { if(videoRef.current) { const newVol = Math.min(1, videoRef.current.volume + 0.1); videoRef.current.volume = newVol; setVolume(newVol * 100); triggerOverlay('volume-up', `${Math.round(newVol*100)}%`); } },
    onVolumeDown: () => { if(videoRef.current) { const newVol = Math.max(0, videoRef.current.volume - 0.1); videoRef.current.volume = newVol; setVolume(newVol * 100); triggerOverlay('volume-down', `${Math.round(newVol*100)}%`); } },
    onToggleMute: () => { toggleMute(); triggerOverlay(isMuted ? 'unmute' : 'mute'); },
    onToggleFullscreen: () => { toggleFullscreen(); triggerOverlay('fullscreen'); }
  });

  useEffect(() => {
    // ... HLS setup logic
  }, [currentEpisode, currentServer]);

  useEffect(() => {
    // ... Video event listeners
  }, []);

  const togglePlay = () => { if (videoRef.current) { isPlaying ? videoRef.current.pause() : videoRef.current.play(); } };
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => { /* ... */ };
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => { /* ... */ };
  const toggleMute = () => { if(videoRef.current) { setIsMuted(!isMuted); videoRef.current.muted = !isMuted; } };
  const toggleFullscreen = () => { if(videoRef.current?.parentElement) { !document.fullscreenElement ? videoRef.current.parentElement.requestFullscreen() : document.exitFullscreen(); } };
  const handleQualityChange = (levelIndex: number) => { if (hlsRef.current) { hlsRef.current.currentLevel = levelIndex; setCurrentQuality(levelIndex); setShowSettings(false); } };
  const formatTime = (time: number) => { /* ... */ };
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-10 px-4 md:px-8 flex flex-col items-center relative font-inter">
      
      <div className="w-full max-w-[1600px] flex items-center gap-4 mb-6 z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-anirias-crimson transition-colors group px-4 py-2 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cinzel font-bold uppercase tracking-wider text-sm">{t('VideoPlayer.back')}</span>
        </button>
        <div className="h-4 w-[1px] bg-white/10"></div>
        <h2 className="text-gray-300 font-cinzel text-sm md:text-base tracking-wide">
          <span className="text-white font-bold">{anime.title}</span>
          <span className="mx-2 text-anirias-crimson">//</span>
          <span>Episode {currentEpisode.number}</span>
        </h2>
      </div>

      <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-4 gap-8 z-20">
        
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          <div className="relative group w-full">
            <div className="absolute -inset-[2px] bg-anirias-crimson/30 blur-2xl rounded-xl opacity-60 animate-pulse-slow pointer-events-none" />
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 z-10">
              <PlayerOverlay type={overlayState.type} value={overlayState.value} />
              <video 
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                onClick={togglePlay}
                poster={anime.coverUrl || anime.imageUrl}
                playsInline
                crossOrigin="anonymous"
              />
              {/* ... Overlays and Controls ... */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-20 pb-4 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end z-30">
                {/* ... Progress Bar ... */}
                <div className="flex items-center justify-between">
                  {/* ... Left Controls ... */}
                  <div className="flex items-center gap-5 text-gray-200 relative">
                    {/* ... Subtitles ... */}
                    <div className="relative">
                        <Settings 
                           className={`w-5 h-5 hover:text-white cursor-pointer transition-transform duration-500 ${showSettings ? 'rotate-90 text-white' : ''}`} 
                           onClick={() => setShowSettings(!showSettings)}
                        />
                        <AnimatePresence>
                          {showSettings && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-10 right-0 w-48 bg-anirias-black/95 border border-white/10 rounded-lg backdrop-blur-xl overflow-hidden shadow-2xl z-50"
                            >
                               <div className="p-3 border-b border-white/10">
                                  <h4 className="text-xs text-gray-500 font-bold uppercase">{t('VideoPlayer.quality')}</h4>
                               </div>
                               <div className="max-h-48 overflow-y-auto">
                                  <button onClick={() => handleQualityChange(-1)} className="w-full text-left px-4 py-2 text-sm hover:bg-anirias-crimson hover:text-white transition-colors flex justify-between items-center">
                                    <span>{t('VideoPlayer.auto')}</span>
                                    {currentQuality === -1 && <Check className="w-3 h-3" />}
                                  </button>
                                  {/* ... quality options ... */}
                               </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </div>
                    {/* ... Fullscreen ... */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-anirias-void/50 border border-white/5 p-4 rounded-xl backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
             <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wider">
                <Server className="w-4 h-4 text-anirias-crimson" />
                <span className="hidden sm:inline">{t('VideoPlayer.switchServer')}</span>
             </div>
             {/* ... Server buttons ... */}
          </div>

          <div className="mt-2">
             <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-white mb-2">{anime.title}</h1>
             <p className="text-gray-400 text-sm font-inter max-w-3xl">{anime.description}</p>
          </div>
          
          <CommentSection animeId={anime.id} isAuth={true} />

        </div>

        <div className="lg:col-span-1">
           <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-xl h-auto lg:h-[calc(100vh-140px)] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-white/10 bg-black/20">
                 <h3 className="text-anirias-crimson font-cinzel font-bold text-lg flex items-center justify-between">
                    {t('VideoPlayer.episodes')}
                    <span className="text-xs font-inter text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                       {episodes.length} {t('VideoPlayer.total')}
                    </span>
                 </h3>
                 <div className="mt-3">
                    <input type="text" placeholder={t('VideoPlayer.searchEpisode')} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-anirias-crimson/50 transition-colors" />
                 </div>
              </div>
              {/* ... Episode Grid ... */}
           </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;