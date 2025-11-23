// components/admin/AnimeFormModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Anime, Episode } from '../../types';
import { X, Upload, Save, Layers, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EpisodesTab from './EpisodesTab';
import { useTranslation } from '../../providers/I18nProvider';

const animeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  posterUrl: z.string().url('Poster URL must be a valid URL'),
  bannerUrl: z
    .string()
    .url('Banner URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  trailerUrl: z
    .string()
    .url('Trailer URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  episodesCount: z.coerce.number().int().min(1, 'Episodes must be at least 1'),
  year: z.coerce.number().int().min(1900, 'Year must be valid'),
  status: z.enum(['ongoing', 'completed', 'upcoming']),
  genres: z.array(z.string()).min(1, 'Select at least one genre'),
  rating: z.coerce.number().min(0).max(10).optional(),
});

type AnimeFormValues = z.infer<typeof animeSchema>;

interface AnimeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Anime>) => void;
  initialData?: Anime | null;
}

const GENRES = [
  'Action',
  'Demons',
  'Magic',
  'Romance',
  'Horror',
  'Sci-Fi',
  'Isekai',
  'Mecha',
  'Slice of Life',
  'Comedy',
  'Drama',
  'Fantasy',
];

const AnimeFormModal: React.FC<AnimeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'general' | 'episodes'>('general');
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const getDefaultValues = (data?: Anime | null): AnimeFormValues => {
    const nowYear = new Date().getFullYear();

    return {
      title: data?.title ?? '',
      slug: (data as any)?.slug ?? '',
      description: data?.description ?? '',
      posterUrl: (data as any)?.posterUrl ?? '',
      bannerUrl: (data as any)?.bannerUrl ?? '',
      trailerUrl: (data as any)?.trailerUrl ?? '',
      episodesCount:
        (data as any)?.episodesCount ??
        (Array.isArray((data as any)?.episodes) ? (data as any)?.episodes.length : 12),
      year: (data as any)?.year ?? nowYear,
      status: ((data as any)?.status as 'ongoing' | 'completed' | 'upcoming') ?? 'ongoing',
      genres: ((data as any)?.genres as string[]) ?? [],
      rating: (data as any)?.rating ?? 8,
    };
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AnimeFormValues>({
    resolver: zodResolver(animeSchema),
    defaultValues: getDefaultValues(initialData ?? null),
  });

  const genres = watch('genres') || [];

  const toggleGenre = (genre: string) => {
    const current: string[] = genres || [];
    const exists = current.includes(genre);
    const next = exists ? current.filter((g) => g !== genre) : [...current, genre];

    setValue('genres', next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    reset(getDefaultValues(initialData ?? null));
    setEpisodes(Array.isArray(initialData?.episodes) ? initialData.episodes : []);
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (values: AnimeFormValues) => {
    const payload = {
      ...(values as any),
      episodes,
    } as Partial<Anime>;

    console.log('Anime form submitted:', payload);

    if (typeof window !== 'undefined') {
      window.alert(`${values.title} saved successfully.`);
    }

    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 shrink-0">
              <h2 className="text-lg font-cinzel font-bold text-white">
                {initialData ? 'Edit Grimoire Entry' : 'New Grimoire Entry'}
              </h2>
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-200 hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex border-b border-white/5 bg-black shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition ${
                  activeTab === 'general'
                    ? 'border-red-500 text-white bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>General Info</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('episodes')}
                disabled={!initialData}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition ${
                  activeTab === 'episodes'
                    ? 'border-red-500 text-white bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                } ${!initialData ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Film className="w-4 h-4" />
                <span>
                  {t('Admin.episodes')} {episodes.length > 0 ? `(${episodes.length})` : ''}
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-zinc-950">
              {activeTab === 'general' ? (
                <form
                  id="anime-form"
                  className="space-y-6"
                  onSubmit={handleSubmit(handleFormSubmit)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        {...register('title')}
                        className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
                        placeholder="Fullmetal Alchemist: Brotherhood"
                      />
                      {errors.title && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Slug
                      </label>
                      <input
                        type="text"
                        {...register('slug')}
                        className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
                        placeholder="fullmetal-alchemist-brotherhood"
                      />
                      {errors.slug && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.slug.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Poster URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          {...register('posterUrl')}
                          className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
                          placeholder="https://cdn.example.com/poster.jpg"
                        />
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                          <Upload className="w-4 h-4" />
                        </span>
                      </div>
                      {errors.posterUrl && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.posterUrl.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Banner URL
                      </label>
                      <input
                        type="text"
                        {...register('bannerUrl')}
                        className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
                        placeholder="https://cdn.example.com/banner.jpg"
                      />
                      {errors.bannerUrl && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.bannerUrl.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Trailer URL
                      </label>
                      <input
                        type="text"
                        {...register('trailerUrl')}
                        className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      {errors.trailerUrl && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.trailerUrl.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Episodes
                      </label>
                      <input
                        type="number"
                        {...register('episodesCount', { valueAsNumber: true })}
                        className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
                        placeholder="12"
                      />
                      {errors.episodesCount && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.episodesCount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        {...register('year', { valueAsNumber: true })}
                        className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
                        placeholder="2010"
                      />
                      {errors.year && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.year.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Status
                      </label>
                      <select
                        {...register('status')}
                        className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
                      >
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                      {errors.status && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.status.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Rating (0–10)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        max={10}
                        {...register('rating', { valueAsNumber: true })}
                        className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
                        placeholder="8.5"
                      />
                      {errors.rating && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.rating.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      className="w-full rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 px-3 py-2 text-sm min-h-[120px] focus:border-red-600 focus:outline-none"
                      placeholder="Write a detailed description of the anime..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-zinc-400">
                        Genres
                      </label>
                      {errors.genres && (
                        <p className="text-[11px] text-red-500">
                          {errors.genres.message as string}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {GENRES.map((genre) => {
                        const selected = genres.includes(genre);
                        return (
                          <button
                            type="button"
                            key={genre}
                            onClick={() => toggleGenre(genre)}
                            className={
                              'px-3 py-1 rounded-full text-xs font-medium border transition ' +
                              (selected
                                ? 'bg-red-600 text-white border-red-600'
                                : 'bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-red-600')
                            }
                          >
                            {genre}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </form>
              ) : (
                initialData && (
                  <EpisodesTab
                    anime={initialData}
                    episodes={episodes}
                    setEpisodes={setEpisodes}
                  />
                )
              )}
            </div>

            {activeTab === 'general' && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-white/5 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-md border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 transition"
                >
                  {t('DeleteAlert.cancel')}
                </button>
                <button
                  form="anime-form"
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 transition"
                >
                  <Save className="w-4 h-4" />
                  {initialData ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AnimeFormModal;