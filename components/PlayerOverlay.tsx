
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, FastForward, Rewind, Maximize, Minimize } from 'lucide-react';

export type OverlayType = 
  | 'play' 
  | 'pause' 
  | 'forward' 
  | 'rewind' 
  | 'volume-up' 
  | 'volume-down' 
  | 'mute' 
  | 'unmute' 
  | 'fullscreen'
  | null;

interface PlayerOverlayProps {
  type: OverlayType;
  value?: string | number; // e.g., "80%" or "10s"
}

const PlayerOverlay: React.FC<PlayerOverlayProps> = ({ type, value }) => {
  
  const getIcon = () => {
    switch (type) {
      case 'play': return <Play className="w-16 h-16 fill-white" />;
      case 'pause': return <Pause className="w-16 h-16 fill-white" />;
      case 'forward': return <FastForward className="w-16 h-16" />;
      case 'rewind': return <Rewind className="w-16 h-16" />;
      case 'volume-up': 
      case 'volume-down': return <Volume2 className="w-16 h-16" />;
      case 'mute': return <VolumeX className="w-16 h-16" />;
      case 'unmute': return <Volume2 className="w-16 h-16" />;
      case 'fullscreen': return <Maximize className="w-16 h-16" />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {type && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <motion.div
            key={type + (value || '')} // Remount animation on value change for snapping effect
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center justify-center"
          >
            {/* Icon Container with Glassmorphism */}
            <div className="bg-black/60 backdrop-blur-md p-6 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-2">
               {getIcon()}
            </div>
            
            {/* Value Text (e.g. "80%" or "+10s") */}
            {value && (
               <motion.span 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-2xl font-cinzel font-bold text-white drop-shadow-md"
               >
                 {value}
               </motion.span>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlayerOverlay;
