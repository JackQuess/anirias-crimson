import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Episode } from '../../types';
import { X, Save, Link, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../providers/I18nProvider';

// Zod schema for validation, now includes manual source fields
const episodeSchema = z.object({
  number: z.number().min(0, 'Episode number cannot be negative.'),
  seasonNumber: z.number().min(1, 'Season number must be at least 1.'),
  title: z.string().min(1, 'Title is required.'),
  isFiller: z.boolean().optional(),
  useManualSource: z.boolean().optional(),
  sourceType: z.enum(['HLS', 'MP4', 'EMBED', 'IFRAME']).optional(),
  manualSourceUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type EpisodeFormValues = z.infer<typeof episodeSchema>;
interface EpisodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Episode) => void;
  initialData?: Episode | null;
  animeId: string;
}

const EpisodeEditModal: React.FC<EpisodeEditModalProps> = ({ isOpen, onClose, onSubmit, initialData, animeId }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
  });

  const useManual = watch('useManualSource');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ seasonNumber: 1, title: '', number: 0, isFiller: false, useManualSource: false, manualSourceUrl: '' });
      }
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = (data: EpisodeFormValues) => {
    const episodeData: Episode = {
      ...initialData,
      ...data,
      id: initialData?.id || `new-ep-${Date.now()}`,
    };
    onSubmit(episodeData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
              <h2 className="text-lg font-cinzel font-bold text-white">
                {initialData ? t('Admin.editEpisode') : t('Admin.addEpisode')}
              </h2>
              <button onClick={onClose}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">{t('EpisodeList.season')}</label>
                  <input type="number" {...register('seasonNumber', { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors" />
                  {errors.seasonNumber && <p className="text-red-500 text-xs mt-1">{errors.seasonNumber.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">{t('Admin.episodes')} #</label>
                  <input type="number" {...register('number', { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors" />
                  {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Episode Title</label>
                <input {...register('title')} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              {/* MANUAL SOURCE SECTION */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <PlayCircle className="w-4 h-4 text-anirias-crimson" />
                       <span className="text-sm font-bold text-white">Video Source</span>
                    </div>
                    
                    <label className="flex items-center cursor-pointer gap-2">
                       <span className="text-xs text-gray-400">Manual Override</span>
                       <div className="relative inline-flex items-center">
                          <input type="checkbox" className="sr-only peer" {...register('useManualSource')} />
                          <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-anirias-crimson"></div>
                       </div>
                    </label>
                 </div>

                 <AnimatePresence>
                    {useManual && (
                       <motion.div 
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         exit={{ opacity: 0, height: 0 }}
                         className="space-y-4 overflow-hidden pt-4 border-t border-white/5"
                       >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="col-span-1 space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                                <select 
                                  {...register('sourceType')}
                                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-anirias-crimson focus:outline-none"
                                >
                                   <option value="HLS">HLS (.m3u8)</option>
                                   <option value="MP4">MP4</option>
                                   <option value="EMBED">Embed</option>
                                   <option value="IFRAME">Iframe</option>
                                </select>
                             </div>
                             <div className="col-span-2 space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Source URL</label>
                                <div className="relative">
                                   <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                                   <input 
                                     {...register('manualSourceUrl')}
                                     className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 pl-8 text-white text-xs focus:border-anirias-crimson focus:outline-none"
                                     placeholder="https://..."
                                   />
                                   {errors.manualSourceUrl && <p className="text-red-500 text-xs mt-1">{errors.manualSourceUrl.message}</p>}
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-bold">
                  {t('DeleteAlert.cancel')}
                </button>
                <button type="submit" className="px-4 py-2 bg-anirias-crimson hover:bg-anirias-bright text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                  <Save className="w-4 h-4" /> {t('Admin.saveChanges')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EpisodeEditModal;
