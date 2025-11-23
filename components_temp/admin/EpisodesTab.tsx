import React, { useState } from 'react';
import { Episode, Anime } from '../../types';
import { syncEpisodesAction } from '../../app/actions';
import { Plus, RefreshCw, Edit2, Trash2, Loader2, Link2, MonitorPlay, AlertCircle, Layers } from 'lucide-react';
import EpisodeEditModal from './EpisodeEditModal';
import BulkSeasonUpdateModal from './BulkSeasonUpdateModal';
import { useTranslation } from '../../providers/I18nProvider';

interface EpisodesTabProps {
  anime: Anime | null;
  episodes: Episode[];
  setEpisodes: React.Dispatch<React.SetStateAction<Episode[]>>;
}

const EpisodesTab: React.FC<EpisodesTabProps> = ({ anime, episodes, setEpisodes }) => {
  if (!anime) {
    return (
      <div className="text-center text-red-500 p-6">
        Cannot load episodes: Anime data is missing.
      </div>
    );
  }
  const { t } = useTranslation();
  // FIX: Added state for sync, modals, and editing.
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // FIX: Implemented sync handler.
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    const result = await syncEpisodesAction(anime?.id || "", anime?.title || "");
    if (result.success && result.episodes) {
      setEpisodes(result.episodes);
      setSyncMessage({ type: 'success', text: result.message || 'Sync successful!' });
    } else {
      setSyncMessage({ type: 'error', text: result.message || 'Sync failed.' });
    }
    setIsSyncing(false);
  };
  
  // FIX: Implemented modal handlers.
  const handleAdd = () => {
    setEditingEpisode(null);
    setIsEditOpen(true);
  };

  const handleEdit = (ep: Episode) => {
    setEditingEpisode(ep);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    setEpisodes(episodes.filter(e => e.id !== id));
  };
  
  const handleFormSubmit = (data: Episode) => {
    if (editingEpisode) { // Update existing
      setEpisodes(episodes.map(ep => ep.id === data.id ? data : ep));
    } else { // Add new
      setEpisodes([data, ...episodes]);
    }
  };

  const handleBulkUpdate = (start: number, end: number, season: number) => {
    setEpisodes(episodes.map(ep => {
      if (ep.number >= start && ep.number <= end) {
        return { ...ep, seasonNumber: season };
      }
      return ep;
    }));
  };

  const safeEpisodes = Array.isArray(episodes) ? episodes : [];
  return (
    <div className="space-y-6">
       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-sm text-gray-400">
             <span className="text-white font-bold">{episodes.length}</span> {t('Admin.episodes')} Found
          </div>
          <div className="flex flex-wrap gap-3">
             <button onClick={() => setIsBulkOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded text-[10px] font-bold uppercase tracking-wide hover:bg-white/20 transition-colors">
                <Layers className="w-3 h-3" /> Bulk Manage Seasons
             </button>
             <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold uppercase tracking-wide hover:bg-blue-500/20 disabled:opacity-50 transition-colors">
                {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                {isSyncing ? 'Syncing...' : 'Auto-Sync'}
             </button>
             <button onClick={handleAdd} className="flex items-center gap-2 px-3 py-1.5 bg-anirias-crimson/80 text-white rounded text-[10px] font-bold uppercase tracking-wide hover:bg-anirias-crimson transition-colors">
                <Plus className="w-3 h-3" /> Add Manual
             </button>
          </div>
       </div>
       {syncMessage && (
          <div className={`flex items-center gap-2 text-xs p-3 rounded-lg border ${syncMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
             <AlertCircle className="w-4 h-4" />
             {syncMessage.text}
          </div>
       )}
       <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                   <th className="px-4 py-3">#</th>
                   <th className="px-4 py-3">{t('EpisodeList.season')}</th>
                   <th className="px-4 py-3">{t('Admin.title')}</th>
                   <th className="px-4 py-3">Source</th>
                   <th className="px-4 py-3 text-right">{t('Admin.actions')}</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-xs">
                {safeEpisodes.sort((a,b) => a.number - b.number).map(ep => (
                  <tr key={ep.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-400">{ep.number}</td>
                    <td className="px-4 py-3 font-bold text-gray-300">S{ep.seasonNumber}</td>
                    <td className="px-4 py-3 text-white">{ep.title}</td>
                    <td className="px-4 py-3 text-gray-500">{ep.useManualSource ? <Link2 className="w-4 h-4 text-orange-400" /> : <MonitorPlay className="w-4 h-4 text-emerald-400" />}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(ep)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors mr-1"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete(ep.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"><Trash2 className="w-3 h-3" /></button>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
       <EpisodeEditModal 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingEpisode}
          animeId={anime?.id || ""}
       />
       <BulkSeasonUpdateModal
          isOpen={isBulkOpen}
          onClose={() => setIsBulkOpen(false)}
          episodes={episodes}
          onUpdate={handleBulkUpdate}
       />
    </div>
  );
};

export default EpisodesTab;
