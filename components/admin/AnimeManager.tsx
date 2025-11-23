import React, { useState } from 'react';
import { Anime } from '../../types';
import { Edit2, Trash2, Plus, Search, Star, RefreshCw, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import AnimeFormModal from './AnimeFormModal';
import DeleteAlert from './DeleteAlert';
import { syncEpisodesAction } from '../../app/actions';
import { useTranslation } from '../../providers/I18nProvider';

interface AnimeManagerProps {
  animeList: Anime[];
}

const AnimeManager: React.FC<AnimeManagerProps> = ({ animeList }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [localAnimeList, setLocalAnimeList] = useState<Anime[]>(animeList);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<{ id: string, type: 'success' | 'error', text: string } | null>(null);

  const filteredList = localAnimeList.filter(anime => 
     anime.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedAnime(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (anime: Anime) => {
    setSelectedAnime(anime);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (anime: Anime) => {
    setSelectedAnime(anime);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: Partial<Anime>) => {
    if (selectedAnime) { // Editing
      setLocalAnimeList(prev => prev.map(a => a.id === selectedAnime.id ? {...a, ...data} as Anime : a));
    } else { // Creating
      const newAnime: Anime = {
        id: `new-anime-${Date.now()}`,
        description: '', tags: [], rating: 0, type: 'TV', sub: 0, duration: '', status: 'Airing', episodes: 0,
        ...data
      } as Anime;
      setLocalAnimeList(prev => [newAnime, ...prev]);
    }
    setIsFormOpen(false);
  };
  
  const confirmDelete = () => {
    if (selectedAnime) {
      setLocalAnimeList(prev => prev.filter(a => a.id !== selectedAnime.id));
      setIsDeleteOpen(false);
      setSelectedAnime(null);
    }
  };

  const handleSync = async (anime: Anime) => {
    setSyncingId(anime.id);
    setSyncMessage(null);
    const result = await syncEpisodesAction(anime.id, anime.title);
    
    if (result.success && result.episodes) {
      setSyncMessage({ id: anime.id, type: 'success', text: result.message || 'Sync Complete!' });
    } else {
      setSyncMessage({ id: anime.id, type: 'error', text: result.message || 'Sync Failed.' });
    }

    setSyncingId(null);
    setTimeout(() => setSyncMessage(null), 4000);
  };

  return (
    <div className="space-y-6 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-xl">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder={t('Admin.searchTitles')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors"
            />
         </div>
         <button 
           onClick={handleCreate}
           className="w-full md:w-auto bg-anirias-crimson hover:bg-anirias-bright text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
         >
            <Plus className="w-4 h-4" /> {t('Admin.addNewAnime')}
         </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-lg">
         <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1024px]">
               <thead className="bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                     <th className="px-6 py-4">{t('Admin.poster')}</th>
                     <th className="px-6 py-4">{t('Admin.title')}</th>
                     <th className="px-6 py-4">{t('Admin.status')}</th>
                     <th className="px-6 py-4">{t('Admin.episodes')}</th>
                     <th className="px-6 py-4">{t('Admin.rating')}</th>
                     <th className="px-6 py-4 text-right">{t('Admin.actions')}</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5 text-sm">
                  {filteredList.map(anime => (
                    <tr key={anime.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <img src={anime.imageUrl} alt={anime.title} className="w-12 h-16 object-cover rounded-md" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-white">{anime.title}</div>
                        <div className="text-xs text-gray-500">{anime.type} • {anime.year}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit ${
                          anime.status === 'Airing' ? 'bg-emerald-500/10 text-emerald-400' :
                          anime.status === 'Finished' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {anime.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-300">{anime.episodes}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold text-yellow-400">
                          <Star className="w-4 h-4 fill-current" /> {anime.rating}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end items-center gap-2">
                            {syncMessage && syncMessage.id === anime.id && (
                               <span className={`text-xs flex items-center gap-1 ${syncMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {syncMessage.type === 'success' ? <CheckCircle className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>}
                                  {syncMessage.text}
                               </span>
                            )}
                            <button 
                              onClick={() => handleSync(anime)}
                              disabled={syncingId === anime.id}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50"
                              title="Sync Episodes"
                            >
                               {syncingId === anime.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>}
                            </button>
                            <button onClick={() => handleEdit(anime)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                               <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteClick(anime)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
      
      <AnimeFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedAnime}
        onSubmit={handleFormSubmit}
      />
      <DeleteAlert 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={selectedAnime?.title || 'this item'}
      />
    </div>
  );
};

export default AnimeManager;