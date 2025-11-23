

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Anime, WatchlistItem } from '../types';

// --- Types for State ---

export interface WatchProgress {
  animeId: string;
  animeTitle: string;
  animeImage: string;
  episodeId: string;
  episodeNumber: number;
  timestamp: number; 
  duration: number; 
  lastPlayedAt: number; 
}

export interface PlayerSettings {
  autoNext: boolean;
  autoPlay: boolean;
  defaultAudio: 'sub' | 'dub';
  showSkipIntro: boolean;
}

interface PlayerState {
  // Data
  history: Record<string, WatchProgress>;
  watchlist: WatchlistItem[];
  settings: PlayerSettings;

  // Actions
  updateProgress: (anime: Anime, episodeId: string, episodeNumber: number, time: number, duration: number) => void;
  removeFromHistory: (animeId: string) => void;
  
  addToWatchlist: (anime: Anime) => void;
  removeFromWatchlist: (animeId: string) => void;
  toggleWatchlist: (anime: Anime) => void;
  
  updateSettings: (settings: Partial<PlayerSettings>) => void;
  
  // Selectors
  isInWatchlist: (animeId: string) => boolean;
  getContinueWatching: () => WatchProgress[];
}

// --- Store Implementation ---

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      
      // Initial State
      history: {},
      watchlist: [],
      settings: {
        autoNext: true,
        autoPlay: false,
        defaultAudio: 'sub',
        showSkipIntro: true,
      },

      // --- History Actions ---

      updateProgress: (anime, episodeId, episodeNumber, time, duration) => {
        set((state) => ({
          history: {
            ...state.history,
            [anime.id]: {
              animeId: anime.id,
              animeTitle: anime.title,
              animeImage: anime.imageUrl,
              episodeId,
              episodeNumber,
              timestamp: time,
              duration,
              lastPlayedAt: Date.now(),
            },
          },
        }));
      },

      removeFromHistory: (animeId) => {
        set((state) => {
          const newHistory = { ...state.history };
          delete newHistory[animeId];
          return { history: newHistory };
        });
      },

      // --- Watchlist Actions ---

      addToWatchlist: (anime) => {
        const item: WatchlistItem = {
          id: anime.id,
          title: anime.title,
          imageUrl: anime.imageUrl,
          type: anime.type,
          rating: anime.rating,
          addedAt: Date.now(),
        };

        set((state) => {
          if (state.watchlist.some((i) => i.id === anime.id)) return state;
          return { watchlist: [item, ...state.watchlist] };
        });
      },

      removeFromWatchlist: (animeId) => {
        set((state) => ({
          watchlist: state.watchlist.filter((i) => i.id !== animeId),
        }));
      },

      toggleWatchlist: (anime) => {
        const { isInWatchlist, addToWatchlist, removeFromWatchlist } = get();
        if (isInWatchlist(anime.id)) {
          removeFromWatchlist(anime.id);
        } else {
          addToWatchlist(anime);
        }
      },

      // --- Settings Actions ---

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // --- Getters / Selectors ---

      isInWatchlist: (animeId) => {
        return get().watchlist.some((i) => i.id === animeId);
      },

      getContinueWatching: () => {
        const history = get().history;
        return Object.values(history).sort((a: WatchProgress, b: WatchProgress) => b.lastPlayedAt - a.lastPlayedAt);
      },
    }),
    {
      name: 'anirias-storage', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        history: state.history, 
        watchlist: state.watchlist,
        settings: state.settings
      }),
    }
  )
);
