
import { UserRank } from '../types';

// Configuration
const XP_BASE = 100; // XP required for level 1 -> 2
const XP_MULTIPLIER = 1.1; // Each level requires 10% more XP than previous

export interface RankInfo {
  name: UserRank;
  minLevel: number;
  color: string;
  hex: string;
  icon: string; // Just a placeholder description for now
}

export const RANKS: RankInfo[] = [
  { name: 'Pawn', minLevel: 1, color: 'text-orange-700', hex: '#cd7f32', icon: '♟' }, // Bronze
  { name: 'Knight', minLevel: 10, color: 'text-gray-300', hex: '#c0c0c0', icon: '♞' }, // Silver
  { name: 'Bishop', minLevel: 15, color: 'text-purple-400', hex: '#a855f7', icon: '♝' }, // Purple
  { name: 'Rook', minLevel: 20, color: 'text-emerald-400', hex: '#34d399', icon: '♜' }, // Emerald
  { name: 'Queen', minLevel: 30, color: 'text-yellow-400', hex: '#ffd700', icon: '♛' }, // Gold
  { name: 'King', minLevel: 50, color: 'text-anirias-crimson', hex: '#990011', icon: '♚' }, // Crimson/Diamond
];

export const calculateLevel = (totalXp: number): number => {
  // Simple linear calculation for demo purposes to ensure frequent updates
  // In a real RPG, this would be exponential: totalXp = level^2 * constant
  return Math.floor(totalXp / XP_BASE) + 1;
};

export const getRankForLevel = (level: number): RankInfo => {
  // Reverse search to find the highest matching rank
  return [...RANKS].reverse().find(r => level >= r.minLevel) || RANKS[0];
};

export const getLevelProgress = (totalXp: number) => {
  const currentLevel = calculateLevel(totalXp);
  const nextLevel = currentLevel + 1;
  
  const xpForCurrentLevel = (currentLevel - 1) * XP_BASE;
  const xpForNextLevel = currentLevel * XP_BASE;
  
  const xpInCurrentLevel = totalXp - xpForCurrentLevel;
  const xpRequiredForNext = xpForNextLevel - xpForCurrentLevel;
  
  const percentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNext) * 100));
  
  return {
    currentLevel,
    nextLevel,
    percentage,
    currentXp: totalXp,
    xpToNext: xpForNextLevel - totalXp
  };
};
