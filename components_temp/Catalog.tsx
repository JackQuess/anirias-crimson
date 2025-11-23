import React, { useState, useEffect } from 'react';
import { Anime } from '../types';
import AnimeCard from './AnimeCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../providers/I18nProvider';

interface CatalogProps {
  animeList: Anime[];
  onAnimeClick: (anime: Anime) => void;
}

const GENRES = ["All", "Action", "Demons", "Magic", "Romance", "Horror", "Sci-Fi", "Isekai", "Mecha"];
const STATUS_OPTIONS = ["All", "Airing", "Finished"];


const Catalog: React.FC<CatalogProps> = ({ animeList, onAnimeClick }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredList, setFilteredList] = useState<Anime[]>(animeList);

  const SORT_OPTIONS = [
    { id: 'popular', label: t('Catalog.sortOrder') }, // Assuming this needs translation, let's adjust keys
    { id: 'newest', label: t('Catalog.sortOrder') },
    { id: 'rated', label: t('Catalog.sortOrder') }
  ];


  useEffect(() => {
    setIsSearching(true);
    
    const timer = setTimeout(() => {
      let result = [...animeList];

      if (searchQuery) {
        result = result.filter(anime => 
          anime.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedGenre !== 'All') {
        result = result.filter(anime => anime.tags.includes(selectedGenre));
      }

      if (selectedStatus !== 'All') {
        result = result.filter(anime => anime.status === selectedStatus);
      }

      if (sortBy === 'popular') {
        result.sort((a, b) => b.rating - a.rating); 
      } else if (sortBy === 'newest') {
        result.sort((a, b) => (b.year || 0) - (a.year || 0));
      } else if (sortBy === 'rated') {
        result.sort((a, b) => b.rating - a.rating);
      }

      setFilteredList(result);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, selectedStatus, sortBy, animeList]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4 md:px-8 font-inter">
      <div className="container mx-auto max-w-[1600px]">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-white mb-6 tracking-wide flex items-center gap-3">
            <span className="text-anirias-crimson">{t('Catalog.title')}</span>
          </h1>

          <div className="relative max-w-2xl">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
             </div>
             <input 
               type="text"
               placeholder={t('Catalog.searchPlaceholder')}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-anirias-crimson/50 focus:bg-white/10 transition-all shadow-inner"
             />
             <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                {isSearching && (
                   <Loader2 className="h-5 w-5 text-anirias-crimson animate-spin" />
                )}
             </div>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          
          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
               <Filter className="w-3 h-3" /> {t('Catalog.genre')}
             </div>
             <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                      selectedGenre === genre 
                        ? 'bg-anirias-crimson text-white shadow-[0_0_10px_#990011] scale-105 border border-anirias-bright' 
                        : 'bg-transparent border border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {genre === 'All' ? t('Admin.allRoles') : genre} 
                  </button>
                ))}
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  <SlidersHorizontal className="w-3 h-3" /> {t('Catalog.status')}
                </div>
                <div className="flex flex-wrap gap-2">
                   {STATUS_OPTIONS.map(status => (
                     <button
                       key={status}
                       onClick={() => setSelectedStatus(status)}
                       className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                         selectedStatus === status 
                           ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.4)] scale-105' 
                           : 'bg-transparent border border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                       }`}
                     >
                       {status === 'All' ? t('Admin.allRoles') : status}
                     </button>
                   ))}
                </div>
             </div>

             <div className="flex flex-col gap-2 ml-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 md:justify-end">
                  <ArrowUpDown className="w-3 h-3" /> {t('Catalog.sortOrder')}
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                   {SORT_OPTIONS.map(opt => (
                     <button
                       key={opt.id}
                       onClick={() => setSortBy(opt.id)}
                       className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                         sortBy === opt.id 
                           ? 'bg-white/10 border border-anirias-crimson text-anirias-crimson' 
                           : 'bg-transparent border border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                       }`}
                     >
                       {opt.label}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
           <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">
                 {t('Catalog.showingResults', { count: filteredList.length })}
              </span>
           </div>

           {filteredList.length > 0 ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
               <AnimatePresence mode="popLayout">
                 {filteredList.map((anime, idx) => (
                   <motion.div
                     key={anime.id}
                     layout
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ duration: 0.3 }}
                   >
                     <AnimeCard anime={anime} onClick={onAnimeClick} />
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
           ) : (
             <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>{t('Catalog.noResults')}</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedGenre('All'); setSelectedStatus('All');}}
                  className="mt-4 text-anirias-crimson hover:text-white text-sm underline"
                >
                  {t('Catalog.clearFilters')}
                </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Catalog;