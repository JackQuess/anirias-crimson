import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from '../providers/I18nProvider';

interface PreloaderProps {}

const Preloader: React.FC<PreloaderProps> = () => {
  const { t } = useTranslation();
  
  const containerVariants: Variants = {
    initial: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: { duration: 0.8, delay: 0.8, ease: "easeInOut" } 
    }
  };

  const curtainVariants: Variants = {
    initial: { scaleY: 1 },
    exit: { 
      scaleY: 0,
      transition: { duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }
    }
  };

  // ... (other variants remain the same)
  const circleVariants: Variants = { animate: { rotate: 360, transition: { duration: 20, repeat: Infinity, ease: "linear" } } };
  const reverseCircleVariants: Variants = { animate: { rotate: -360, transition: { duration: 15, repeat: Infinity, ease: "linear" } } };
  const pulseVariants: Variants = { animate: { scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } } };
  const textVariants: Variants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }, exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } } };

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      variants={containerVariants}
      initial="initial"
      exit="exit"
    >
      <motion.div 
        className="absolute inset-0 bg-[#050505] origin-top"
        variants={curtainVariants}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute inset-0 bg-anirias-crimson/10 rounded-full blur-[60px]"
          />

          <motion.svg 
            viewBox="0 0 100 100" 
            className="absolute w-full h-full overflow-visible"
            variants={circleVariants}
            animate="animate"
          >
            <defs>
              <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <text fill="#990011" fontSize="2.5" letterSpacing="3px" fontWeight="bold" opacity="0.8" className="uppercase font-cinzel">
              <textPath href="#circlePath" startOffset="0%">
                Power • Destruction • Elegance • Gremory • Power • Destruction • Elegance • Gremory •
              </textPath>
            </text>
          </motion.svg>

          <motion.div 
            className="absolute w-[70%] h-[70%] border border-anirias-crimson/30 rounded-full border-dashed"
            variants={reverseCircleVariants}
            animate="animate"
            style={{ borderSpacing: "10px" }}
          />

          <motion.div 
             className="absolute w-[40%] h-[40%] border border-anirias-bright/50 rotate-45"
             animate={{ rotate: [45, 225] }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
             className="absolute w-[40%] h-[40%] border border-anirias-crimson/50"
             animate={{ rotate: [0, -180] }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          <motion.div 
            className="relative z-20 flex flex-col items-center"
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
             <div className="text-6xl font-cinzel font-black text-white drop-shadow-[0_0_15px_rgba(220,20,60,0.8)] mb-2">
               A
             </div>
             <div className="flex items-center gap-2 tracking-[0.5em] text-[10px] text-anirias-crimson font-bold uppercase">
               {t('Preloader.systemLoading')}
             </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;