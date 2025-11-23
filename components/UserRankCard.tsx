
import React from 'react';
import { useGameStore, getXpForNextLevel } from '../store/useGameStore';
import { Crown, Shield, Sword, Ghost, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const UserRankCard: React.FC = () => {
  const { xp, level, rank } = useGameStore();
  
  const xpNeeded = getXpForNextLevel(level);
  const progressPercent = Math.min(100, Math.max(0, (xp / xpNeeded) * 100));

  // Rank Config (Icons & Colors)
  const getRankConfig = (r: string) => {
    switch (r) {
      case 'King': return { icon: Crown, color: 'text-anirias-crimson', bg: 'bg-anirias-crimson/20', label: 'King' };
      case 'Queen': return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/20', label: 'Queen' };
      case 'Bishop': return { icon: Ghost, color: 'text-purple-400', bg: 'bg-purple-400/20', label: 'Bishop' };
      case 'Rook': return { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/20', label: 'Rook' };
      case 'Knight': return { icon: Sword, color: 'text-blue-400', bg: 'bg-blue-400/20', label: 'Knight' };
      default: return { icon: Award, color: 'text-orange-400', bg: 'bg-orange-400/20', label: 'Pawn' };
    }
  };

  const config = getRankConfig(rank);
  const Icon = config.icon;

  return (
    <div className="relative w-full max-w-md bg-anirias-void border border-white/10 rounded-xl overflow-hidden p-6 group">
      {/* Glow Effect */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-40 ${config.color.replace('text-', 'bg-')}`} />

      <div className="relative z-10 flex items-center gap-5">
        
        {/* Avatar & Rank Icon */}
        <div className="relative">
           <div className="w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden">
             <img src="https://picsum.photos/seed/me/150/150" alt="User" className="w-full h-full object-cover" />
           </div>
           <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${config.bg} border border-white/10 flex items-center justify-center shadow-lg`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
           </div>
        </div>

        {/* Stats */}
        <div className="flex-1">
           <div className="flex justify-between items-end mb-1">
              <div>
                 <h3 className="text-white font-cinzel font-bold text-lg leading-none">Guest User</h3>
                 <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                    {config.label} Class
                 </span>
              </div>
              <div className="text-right">
                 <span className="block text-2xl font-cinzel font-black text-white leading-none">
                    {level}
                 </span>
                 <span className="text-[10px] text-gray-500 uppercase">Level</span>
              </div>
           </div>

           {/* XP Bar */}
           <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-anirias-crimson to-anirias-bright shadow-[0_0_10px_#DC143C]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
           </div>
           <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
              <span>{xp} XP</span>
              <span>{xpNeeded} XP</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserRankCard;
