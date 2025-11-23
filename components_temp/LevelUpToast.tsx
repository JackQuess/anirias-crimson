import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Crown, Shield, Sword, Ghost, Award } from 'lucide-react';
import { useTranslation } from '../providers/I18nProvider';

const LevelUpToast: React.FC = () => {
  const { showLevelUp, rank, level, closeLevelUp } = useGameStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (showLevelUp) {
      const timer = setTimeout(() => {
        closeLevelUp();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, closeLevelUp]);

  const getRankConfig = (r: string) => {
    switch (r) {
      case 'King': return { icon: Crown, color: '#990011', name: 'KING' };
      case 'Queen': return { icon: Crown, color: '#ffd700', name: 'QUEEN' };
      case 'Bishop': return { icon: Ghost, color: '#a855f7', name: 'BISHOP' };
      case 'Rook': return { icon: Shield, color: '#34d399', name: 'ROOK' };
      case 'Knight': return { icon: Sword, color: '#60a5fa', name: 'KNIGHT' };
      default: return { icon: Award, color: '#fb923c', name: 'PAWN' };
    }
  };

  const config = getRankConfig(rank);
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div 
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 -z-10 opacity-30"
            >
               <div className="w-[600px] h-[600px] bg-gradient-to-t from-transparent via-white/10 to-transparent rounded-full blur-3xl" />
            </motion.div>

            <div 
               className="w-40 h-40 rounded-full bg-anirias-void border-4 border-white/20 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(0,0,0,0.5)] relative"
               style={{ boxShadow: `0 0 50px ${config.color}80` }}
            >
               <Icon className="w-20 h-20 text-white drop-shadow-lg" strokeWidth={1.5} />
               <div className="absolute -bottom-4 bg-white text-black font-black text-xl px-4 py-1 rounded-full border-4 border-anirias-void">
                  LVL {level}
               </div>
            </div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="text-center"
            >
               <h2 className="text-2xl font-cinzel font-bold text-gray-400 tracking-[0.3em] mb-2">
                  {t('LevelUpToast.promotedTo')}
               </h2>
               <h1 
                  className="text-6xl font-cinzel font-black text-white tracking-widest uppercase drop-shadow-xl"
                  style={{ color: config.color, textShadow: `0 0 20px ${config.color}66` }}
               >
                  {config.name}
               </h1>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpToast;