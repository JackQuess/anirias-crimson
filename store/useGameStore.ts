
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type EvilPieceRank = 'Pawn' | 'Knight' | 'Rook' | 'Bishop' | 'Queen' | 'King';

interface GameState {
  xp: number;
  level: number;
  rank: EvilPieceRank;
  showLevelUp: boolean;
  lastRank: EvilPieceRank; // To track if rank changed specifically
  
  // Actions
  addXp: (amount: number) => void;
  closeLevelUp: () => void;
}

// Helper to determine Rank based on Level
const getRank = (level: number): EvilPieceRank => {
  if (level >= 50) return 'Queen'; // King is reserved for special status usually, but purely by level: Queen is highest standard
  if (level >= 30) return 'Bishop';
  if (level >= 20) return 'Rook';
  if (level >= 10) return 'Knight';
  return 'Pawn';
};

// Helper to calculate XP needed for NEXT level
export const getXpForNextLevel = (currentLevel: number) => {
  return currentLevel * 100;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      rank: 'Pawn',
      showLevelUp: false,
      lastRank: 'Pawn',

      addXp: (amount: number) => {
        const { xp, level, rank } = get();
        let currentXp = xp + amount;
        let currentLevel = level;
        let leveledUp = false;

        // XP Loop: Handle multiple level ups at once
        // Formula: Next Level Requirement = Current Level * 100
        while (true) {
          const xpNeeded = getXpForNextLevel(currentLevel);
          if (currentXp >= xpNeeded) {
            currentXp -= xpNeeded;
            currentLevel++;
            leveledUp = true;
          } else {
            break;
          }
        }

        if (leveledUp) {
          const newRank = getRank(currentLevel);
          set({
            xp: currentXp,
            level: currentLevel,
            rank: newRank,
            lastRank: rank, // Store old rank to compare in UI if needed
            showLevelUp: true
          });
        } else {
          set({ xp: currentXp });
        }
      },

      closeLevelUp: () => set({ showLevelUp: false }),
    }),
    {
      name: 'anirias-evil-pieces',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
