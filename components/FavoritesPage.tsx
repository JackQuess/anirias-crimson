import React, { useMemo } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Anime, ViewState, WatchlistItem } from '../types';
import AnimeCard from './AnimeCard';
import { motion } from 'framer-motion';
import { Heart, Compass } from 'lucide-react';
import { useTranslation } from '../providers/I18nProvider';

interface FavoritesPageProps {
  onAnimeClick: (anime: Anime) => void;
  onNavigate: (view: ViewState) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onAnimeClick, onNavigate }) => {
  const { t } = useTranslation();
  // In a real app, this would be a separate 'favorites' list in the store.
  // For this demo, we'll reuse the watchlist and slice it to simulate a different list.
  const watchlist = usePlayerStore((state) => state.watchlist);
  const favorites = useMemo(() => watchlist.slice(0, 3), [watchlist]);

  const animeListFromFavorites: Anime[] = useMemo(() => favorites.map(item => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    type: item.type as any,
    rating: item.rating,
    description: '',
    tags: [],
    episodes: 0,
    status: 'Finished',
    sub: 0,
    duration: '',
  })), [favorites]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4 md:px-8 font-inter">
      <div className="container mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6"
        >
          <div className="p-3 bg-pink-500/10 rounded-lg text-pink-500">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white tracking-wide">
              {t('Favorites.title')}
            </h1>
            <p className="text-gray-400 text-sm">{t('Favorites.subtitle')}</p>
          </div>
        </motion.div>

        {animeListFromFavorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {animeListFromFavorites.map((anime, index) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <AnimeCard anime={anime} onClick={onAnimeClick} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="w-full h-96 flex flex-col items-center justify-center text-center text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Heart className="w-16 h-16 mb-6 opacity-20" />
            <h3 className="text-xl font-bold text-white mb-2">{t('Favorites.emptyTitle')}</h3>
            <p className="max-w-xs mb-6 text-sm">{t('Favorites.emptyMessage')}</p>
            <button
              onClick={() => onNavigate(ViewState.CATALOG)}
              className="flex items-center gap-2 px-6 py-3 bg-anirias-crimson text-white rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-anirias-bright hover:shadow-[0_0_20px_rgba(220,20,60,0.6)] transition-all"
            >
              <Compass className="w-4 h-4" />
              {t('MyList.browseButton')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;