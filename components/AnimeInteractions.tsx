"use client";
import React, { useState, useEffect, useTransition } from 'react';
import { Plus, Check, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Anime } from '../types';
import { toggleWatchlistAction, toggleFavoriteAction, getInteractionStatus } from '../app/actions/interactions';
import { useTranslation } from '../providers/I18nProvider';

interface AnimeInteractionsProps {
  anime: Anime;
  isAuth?: boolean;
  onLogin?: () => void;
}

const AnimeInteractions: React.FC<AnimeInteractionsProps> = ({ anime, isAuth = true, onLogin }) => {
  const { t } = useTranslation();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isAuth) {
        getInteractionStatus(anime.id).then(status => {
            setIsInWatchlist(status.isInWatchlist);
            setIsFavorite(status.isFavorite);
        });
    }
  }, [anime.id, isAuth]);

  const handleWatchlist = async () => {
    if (!isAuth) {
        toast.error(t('Interactions.loginRequired'));
        onLogin?.();
        return;
    }

    const previousState = isInWatchlist;
    setIsInWatchlist(!previousState);

    startTransition(async () => {
        const result = await toggleWatchlistAction(anime.id, previousState);
        if (!result.success) {
            setIsInWatchlist(previousState);
            toast.error("Failed to update watchlist");
        } else {
            toast.success(result.newState ? t('Interactions.watchlistAddSuccess') : t('Interactions.watchlistRemoveSuccess'));
        }
    });
  };

  const handleFavorite = async () => {
    if (!isAuth) {
        toast.error(t('Interactions.loginRequired'));
        onLogin?.();
        return;
    }
    const previousState = isFavorite;
    setIsFavorite(!previousState);
    startTransition(async () => {
        const result = await toggleFavoriteAction(anime.id, previousState);
        if (!result.success) {
            setIsFavorite(previousState);
            toast.error("Failed to update favorites");
        }
    });
  };

  const handleShare = async () => {
    const shareData = {
        title: `Watch ${anime.title} on Anirias`,
        text: `Check out ${anime.title}! It's amazing.`,
        url: window.location.href
    };
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {}
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleWatchlist}
          disabled={isPending}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all backdrop-blur-md border ${
             isInWatchlist 
               ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20' 
               : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:text-white'
          }`}
        >
           <AnimatePresence mode="wait" initial={false}>
              {isInWatchlist ? (
                 <motion.span key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> {t('Interactions.added')}
                 </motion.span>
              ) : (
                 <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> {t('Interactions.addToList')}
                 </motion.span>
              )}
           </AnimatePresence>
        </button>

        <button 
          onClick={handleFavorite}
          disabled={isPending}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all backdrop-blur-md border ${
             isFavorite 
               ? 'bg-anirias-crimson/10 border-anirias-crimson/50 text-anirias-crimson hover:bg-anirias-crimson/20' 
               : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:text-white'
          }`}
        >
           <motion.div animate={isFavorite ? { scale: [1, 1.4, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}>
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
           </motion.div>
        </button>

        <button 
          onClick={handleShare}
          className="col-span-2 bg-transparent hover:bg-white/5 text-gray-400 text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition-all border border-dashed border-white/10 hover:border-white/30"
        >
           <Share2 className="w-4 h-4" />
           {t('Interactions.share')}
        </button>

    </div>
  );
};

export default AnimeInteractions;