


export interface Character {
  id: string;
  name: string;
  role: 'Main' | 'Supporting';
  imageUrl: string;
  voiceActor?: string; // API might not always return this
}

export interface Anime {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  coverUrl?: string; // Banner image
  tags: string[]; // Mapped from 'genres'
  rating: number;
  episodes: number; // Total episodes
  type: 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL' | 'Unknown';
  status: 'Airing' | 'Finished' | 'Not yet aired';
  sub: number;
  dub?: number;
  duration: string;
  featured?: boolean;
  characters?: Character[];
  year?: number;
  studio?: string;
  season?: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  image?: string;
  isFiller?: boolean;
  providerId?: string; // ID used by the streaming provider (e.g. Gogoanime episode ID)
  // Source Management
  seasonNumber?: number;
  manualSourceUrl?: string;
  sourceType?: 'HLS' | 'MP4' | 'EMBED' | 'IFRAME';
  useManualSource?: boolean;
}

export interface HeroSlide {
  id: string;
  animeId: string;
  anime?: Anime; // Hydrated relation
  videoUrl?: string;
  posterUrl?: string;
  title?: string; // Override
  description?: string; // Override
  isActive: boolean;
  order: number;
}

export interface VideoSource {
  url: string;
  quality?: string; // "360p", "720p", "1080p", "default"
  isM3U8: boolean;
}

export interface AnimeSourceData {
  headers?: Record<string, string>;
  sources: VideoSource[];
  download?: string;
}

// FIX: Added WatchlistItem interface to be used across the application.
export interface WatchlistItem {
  id: string;
  title: string;
  imageUrl: string;
  type: string;
  rating: number;
  addedAt: number;
}

export type UserRank = 'Pawn' | 'Knight' | 'Bishop' | 'Rook' | 'Queen' | 'King';

export interface UserStats {
  xp: number;
  level: number;
  rank: UserRank;
  episodesWatched: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  rank: UserRank;
  content: string;
  timestamp: string;
  isSpoiler: boolean;
  reactions: {
    flame: number;
    heart: number;
    sword: number;
  };
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  RANK_UP = 'RANK_UP',
  ANIME_UPDATE = 'ANIME_UPDATE',
  ADMIN_ALERT = 'ADMIN_ALERT'
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string; // ISO String
}

export enum ViewState {
  HOME = 'HOME',
  DETAIL = 'DETAIL',
  WATCH = 'WATCH',
  CATALOG = 'CATALOG',
  SCHEDULE = 'SCHEDULE',
  PROFILE = 'PROFILE',
  MY_LIST = 'MY_LIST',
  FAVORITES = 'FAVORITES',
  SETTINGS = 'SETTINGS', // New View State
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_ANIME = 'ADMIN_ANIME',
  ADMIN_HERO = 'ADMIN_HERO', 
  ADMIN_IMPORT = 'ADMIN_IMPORT',
  ADMIN_USERS = 'ADMIN_USERS',
  ADMIN_REPORTS = 'ADMIN_REPORTS',
  ADMIN_SYSTEM = 'ADMIN_SYSTEM',
  ADMIN_SETTINGS = 'ADMIN_SETTINGS'
}