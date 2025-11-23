import React, { useState } from 'react';
import { Anime } from '../../types';
import { anilistApi } from '../../services/anilistApi';
import { importAnimeFromAniList } from '../../app/actions';
import { Search, DownloadCloud, Check, Loader2, Globe, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../providers/I18nProvider';

interface ImportAnimeProps {
  onImportSuccess?: (anime: Anime) => void;
}

const ImportAnime: React.FC<ImportAnimeProps> = ({ onImportSuccess }) => {
  const { t } = useTranslation();
  // FIX: Added state for search, loading, results, and notifications.
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // FIX: Implemented search handler.
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
        const results = await anilistApi.search(searchQuery);
        if (results.length === 0) {
          setError("No results found for your query.");
        }
        setSearchResults(results);
    } catch (err) {
        setError('Failed to fetch from AniList. The API might be down.');
        setSearchResults([]);
    } finally {
        setIsLoading(false);
    }
  };

  // FIX: Implemented import handler.
  const handleImport = async (anime: Anime) => {
    setImportingId(anime.id);
    const result = await importAnimeFromAniList(anime);
    setToast({ type: result.success ? 'success' : 'error', message: result.message });
    if (result.success && onImportSuccess) {
        onImportSuccess(anime);
    }
    setImportingId(null);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
       {/* Toast Notification */}
       <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-bold shadow-2xl ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
          >
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
       </AnimatePresence>
       
       <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-4">
          <div>
             <h2 className="text-2xl font-cinzel font-bold text-white flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-400" />
                {t('Admin.autoImportTitle')} <span className="text-gray-500 text-lg font-inter font-normal">via AniList</span>
             </h2>
             <p className="text-sm text-gray-500 mt-1">Search the global AniList database and import metadata instantly.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-colors">
             <DownloadCloud className="w-4 h-4" /> Bulk Import Trending
          </button>
       </div>
       <div className="max-w-2xl mx-auto w-full relative">
          <form onSubmit={handleSearch} className="relative group">
             <input 
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search anime by title (e.g. Solo Leveling)..."
               className="w-full bg-white/5 border-2 border-white/10 rounded-xl py-4 pl-6 pr-32 text-white placeholder-gray-500 focus:outline-none focus:border-anirias-crimson/50 focus:bg-white/10 transition-all shadow-inner"
             />
             <button type="submit" disabled={isLoading} className="absolute right-2 top-2 bottom-2 px-6 bg-anirias-crimson hover:bg-anirias-bright text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span className="hidden sm:inline">Search</span>
             </button>
          </form>
          {error && <p className="text-center text-red-500 text-sm mt-4">{error}</p>}
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {searchResults.map((anime, index) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-lg flex flex-col"
            >
              <div className="relative aspect-[2/3]">
                 <img src={anime.imageUrl} alt={anime.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                 <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 flex-1">{anime.title}</h3>
                 <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span>{anime.year}</span>
                    <span>•</span>
                    <span>{anime.type}</span>
                    <span className="ml-auto text-yellow-400 font-bold">{anime.rating} ★</span>
                 </div>
              </div>
              <button 
                onClick={() => handleImport(anime)} 
                disabled={importingId === anime.id}
                className="w-full bg-white/5 hover:bg-anirias-crimson text-white px-4 py-3 rounded-b-lg text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider disabled:bg-emerald-500/20 disabled:text-emerald-400"
              >
                 {importingId === anime.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <DownloadCloud className="w-4 h-4" />}
                 {importingId === anime.id ? 'Importing...' : 'Import'}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
       </div>
    </div>
  );
};

export default ImportAnime;
