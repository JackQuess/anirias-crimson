import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Episode } from '../../types';
import { useTranslation } from '../../providers/I18nProvider';

// FIX: Defined the Zod schema for form validation.
const bulkSchema = z.object({
  startEpisode: z.number().min(1, 'Start episode must be at least 1.'),
  endEpisode: z.number().min(1, 'End episode must be at least 1.'),
  targetSeason: z.number().min(1, 'Season number must be at least 1.'),
}).refine(data => data.endEpisode >= data.startEpisode, {
  message: "End episode cannot be before start episode.",
  path: ["endEpisode"],
});

type BulkFormValues = z.infer<typeof bulkSchema>;
// FIX: Defined the component's props interface.
interface BulkSeasonUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  onUpdate: (start: number, end: number, season: number) => void;
}

const BulkSeasonUpdateModal: React.FC<BulkSeasonUpdateModalProps> = ({ isOpen, onClose, episodes, onUpdate }) => {
  const { t } = useTranslation();
  // FIX: Configured useForm with the Zod resolver.
  const { register, handleSubmit, formState: { errors } } = useForm<BulkFormValues>({ resolver: zodResolver(bulkSchema) });
  // FIX: Implemented the form submission handler.
  const onFormSubmit = (data: BulkFormValues) => {
    onUpdate(data.startEpisode, data.endEpisode, data.targetSeason);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
               <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-anirias-crimson" />
                  <h2 className="text-lg font-cinzel font-bold text-white">Bulk Season Editor</h2>
               </div>
               <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
               <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-400 mb-4">
                     Define a range of episodes to assign to a specific season number.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">From Episode</label>
                        <input type="number" {...register('startEpisode', { valueAsNumber: true })} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-anirias-crimson focus:outline-none" />
                        {errors.startEpisode && <p className="text-red-500 text-xs mt-1">{errors.startEpisode.message}</p>}
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">To Episode</label>
                        <input type="number" {...register('endEpisode', { valueAsNumber: true })} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-anirias-crimson focus:outline-none" />
                        {errors.endEpisode && <p className="text-red-500 text-xs mt-1">{errors.endEpisode.message}</p>}
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-400 uppercase">Assign to Season #</label>
                     <input type="number" {...register('targetSeason', { valueAsNumber: true })} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-anirias-crimson focus:outline-none" />
                     {errors.targetSeason && <p className="text-red-500 text-xs mt-1">{errors.targetSeason.message}</p>}
                  </div>
               </div>
               <div className="flex justify-end gap-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-bold">{t('DeleteAlert.cancel')}</button>
                  <button type="submit" className="px-4 py-2 bg-anirias-crimson hover:bg-anirias-bright text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                     <Save className="w-4 h-4" /> Apply Changes
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BulkSeasonUpdateModal;