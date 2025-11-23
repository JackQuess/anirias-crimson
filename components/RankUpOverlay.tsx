
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRank } from '../types';
import { RANKS } from '../utils/gamification';

interface RankUpOverlayProps {
  newRank: UserRank | null;
  isOpen: boolean;
  onClose: () => void;
}

const RankUpOverlay: React.FC<RankUpOverlayProps> = ({ newRank, isOpen, onClose }) => {
  if (!newRank || !isOpen) return null;

  const rankInfo = RANKS.find(r => r.name === newRank) || RANKS[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        {/* BACKGROUND RAYS */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
        >
           <div className="w-[200vw] h-[200vw] bg-gradient-to-r from-transparent via-anirias-crimson/20 to-transparent" style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${rankInfo.hex}33 20deg, transparent 40deg)` }}></div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="relative z-10 flex flex-col items-center"
        >
           {/* TITLE */}
           <h2 className="text-4xl md:text-6xl font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase tracking-[0.2em] drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] mb-8">
             PROMOTION
           </h2>

           {/* RANK ICON / PIECE */}
           <div className="relative mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white/20 flex items-center justify-center bg-gradient-to-br from-black to-anirias-void shadow-[0_0_50px_${rankInfo.hex}]`}
                style={{ boxShadow: `0 0 50px ${rankInfo.hex}` }}
              >
                 <span className="text-6xl md:text-8xl">{rankInfo.icon}</span>
              </motion.div>
              {/* Sparkles */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-4 rounded-full border border-white/10 blur-md"
              />
           </div>

           {/* RANK NAME */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="text-center"
           >
             <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">You have achieved the rank of</p>
             <h3 className={`text-5xl font-cinzel font-bold ${rankInfo.color} drop-shadow-lg`}>
               {rankInfo.name}
             </h3>
           </motion.div>

           {/* CTA */}
           <motion.button
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8 }}
             onClick={onClose}
             className="mt-12 px-8 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 hover:scale-105 transition-all uppercase tracking-widest text-xs font-bold"
           >
             Claim Power
           </motion.button>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RankUpOverlay;
