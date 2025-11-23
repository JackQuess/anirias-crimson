import React, { useState } from 'react';
import { HeroSlide, Anime } from '../../types';
// FIX: Imported the 'X' icon from 'lucide-react'.
import { Plus, Save, Trash2, Image as ImageIcon, Film, Search, GripVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../providers/I18nProvider';

interface HeroManagerProps {
  animeList: Anime[];
  slides: HeroSlide[];
  setSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
}

const HeroManager: React.FC<HeroManagerProps> = ({ animeList, slides, setSlides }) => {
  const { t } = useTranslation();
  // FIX: Added state for editing modal and the slide being edited.
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide({ ...slide });
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (!editingSlide) return;
    setSlides(prev => prev.map(s => s.id === editingSlide.id ? editingSlide : s));
    setIsEditing(false);
    setEditingSlide(null);
  };
  
  const handleAddNew = () => {
    const newSlide: HeroSlide = {
        id: `slide-${Date.now()}`,
        animeId: '',
        order: slides.length + 1,
        isActive: true,
    };
    setSlides(prev => [...prev, newSlide]);
    handleEdit(newSlide);
  };

  const handleDelete = (id: string) => {
    setSlides(prev => prev.filter(s => s.id !== id));
  };
  
  const handleUpdateField = (field: keyof HeroSlide, value: any) => {
    if (editingSlide) {
      setEditingSlide({ ...editingSlide, [field]: value });
    }
  };

  const handleAnimeSelect = (anime: Anime) => {
    if (editingSlide) {
        setEditingSlide({ ...editingSlide, animeId: anime.id, anime: anime });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0a0a0a] border border-white/5 p-4 rounded-xl">
         <div>
            <h2 className="text-lg font-cinzel font-bold text-white">{t('Admin.heroSlides')}</h2>
            <p className="text-xs text-gray-500">Manage the featured content on the homepage.</p>
         </div>
         <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-anirias-crimson hover:bg-anirias-bright text-white rounded-lg text-sm font-bold transition-colors">
            <Plus className="w-4 h-4" /> New Slide
         </button>
      </div>
      
      <div className="space-y-3">
        {slides.sort((a,b) => a.order - b.order).map(slide => {
          const anime = slide.anime || animeList.find(a => a.id === slide.animeId);
          return (
            <div key={slide.id} className="flex items-center gap-4 bg-[#0a0a0a] border border-white/10 rounded-lg p-3">
                <GripVertical className="w-5 h-5 text-gray-500 cursor-grab"/>
                <img src={anime?.imageUrl} alt={anime?.title} className="w-12 h-16 object-cover rounded"/>
                <div className="flex-1">
                    <h3 className="font-bold text-white">{slide.title || anime?.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1">{slide.description || anime?.description}</p>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${slide.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  {slide.isActive ? 'Active' : 'Inactive'}
                </span>
                <div>
                    <button onClick={() => handleEdit(slide)} className="px-4 py-2 text-xs font-bold text-white bg-white/5 hover:bg-white/10 rounded-lg">Edit</button>
                    <button onClick={() => handleDelete(slide.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
         {isEditing && editingSlide && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl flex flex-col h-[70vh]"
               >
                 <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h3 className="text-lg font-cinzel font-bold text-white">Edit Hero Slide</h3>
                    <button onClick={() => setIsEditing(false)}><X className="w-5 h-5"/></button>
                 </div>
                 <div className="p-6 overflow-y-auto space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Linked Anime</label>
                      <div className="flex items-center gap-2 p-2 bg-black border border-white/10 rounded-lg">
                        {editingSlide.anime ? (
                          <>
                            <img src={editingSlide.anime.imageUrl} className="w-10 h-14 object-cover rounded"/>
                            <span className="font-bold">{editingSlide.anime.title}</span>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">No anime linked.</span>
                        )}
                        {/* A real implementation would have a search modal here */}
                        <select onChange={(e) => handleAnimeSelect(animeList.find(a => a.id === e.target.value)!)} className="ml-auto bg-white/10 p-2 rounded text-xs">
                           <option>Select Anime...</option>
                           {animeList.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Film className="w-3 h-3" /> Video URL</label>
                          <input value={editingSlide.videoUrl || ''} onChange={e => handleUpdateField('videoUrl', e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors" />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Poster URL</label>
                          <input value={editingSlide.posterUrl || ''} onChange={e => handleUpdateField('posterUrl', e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Title Override (Optional)</label>
                        <input value={editingSlide.title || ''} onChange={e => handleUpdateField('title', e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Description Override (Optional)</label>
                        <textarea value={editingSlide.description || ''} onChange={e => handleUpdateField('description', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors h-24 resize-none"></textarea>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Order</label>
                          <input value={editingSlide.order} onChange={e => handleUpdateField('order', Number(e.target.value))} type="number" className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors" />
                       </div>
                       <div className="flex items-center gap-2 pt-5">
                          <input type="checkbox" checked={editingSlide.isActive} onChange={e => handleUpdateField('isActive', e.target.checked)} id="isActiveCheck" className="accent-anirias-crimson w-4 h-4" />
                          <label htmlFor="isActiveCheck" className="text-sm font-bold text-white">Active</label>
                       </div>
                    </div>
                 </div>
                 <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-bold">{t('DeleteAlert.cancel')}</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-anirias-crimson hover:bg-anirias-bright text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50" disabled={!editingSlide.animeId}>
                       <Save className="w-4 h-4" /> {t('Admin.saveChanges')}
                    </button>
                 </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default HeroManager;