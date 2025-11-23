import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, User, Dice5, Moon, MonitorPlay, Home, Compass } from 'lucide-react';
import { Anime, ViewState } from '../types';
import { useTranslation } from '../providers/I18nProvider';

interface CommandMenuProps {
  animeList: Anime[];
  onNavigate: (view: ViewState) => void;
  onAnimeSelect: (anime: Anime) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ animeList, onNavigate, onAnimeSelect, isOpen, setIsOpen }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setIsOpen]);

  const handleSelectAnime = (anime: Anime) => {
    onAnimeSelect(anime);
    setIsOpen(false);
  };

  const handleRandom = () => {
    const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];
    onAnimeSelect(randomAnime);
    setIsOpen(false);
  };

  const handleNavigation = (view: ViewState) => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <Command.Dialog 
      open={isOpen} 
      onOpenChange={setIsOpen}
      label="Global Command Menu"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-anirias-void border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5 transform transition-all">
        
        <div className="flex items-center border-b border-white/10 px-4 py-3 bg-white/5">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <Command.Input 
            placeholder={t('CommandMenu.placeholder')} 
            className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-500 text-sm font-inter"
          />
          <div className="flex items-center gap-1 text-[10px] text-gray-500 border border-white/10 rounded px-1.5 py-0.5">
            <span className="text-xs">ESC</span>
          </div>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
          <Command.Empty className="py-6 text-center text-sm text-gray-500">
             {t('CommandMenu.noResults')}
          </Command.Empty>

          <Command.Group heading={t('CommandMenu.quickActions')} className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 mt-2">
             <Item onSelect={() => handleNavigation(ViewState.HOME)}>
                <Home className="w-4 h-4 mr-3 text-gray-400" />
                {t('CommandMenu.goHome')}
             </Item>
             <Item onSelect={() => handleNavigation(ViewState.PROFILE)}>
                <User className="w-4 h-4 mr-3 text-gray-400" />
                {t('CommandMenu.goProfile')}
             </Item>
             <Item onSelect={() => handleNavigation(ViewState.CATALOG)}>
                <Compass className="w-4 h-4 mr-3 text-gray-400" />
                {t('CommandMenu.browseCatalog')}
             </Item>
             <Item onSelect={handleRandom}>
                <Dice5 className="w-4 h-4 mr-3 text-anirias-crimson" />
                <span className="text-white group-aria-selected:text-anirias-crimson">{t('CommandMenu.randomAnime')}</span>
             </Item>
          </Command.Group>

          <Command.Group heading={t('CommandMenu.animeDatabase')} className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 mt-4">
            {animeList.map((anime) => (
              <Command.Item
                key={anime.id}
                value={anime.title}
                onSelect={() => handleSelectAnime(anime)}
                className="group relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-300 cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-all duration-200 border-l-2 border-transparent aria-selected:border-anirias-crimson"
              >
                <div className="w-8 h-10 rounded bg-gray-800 overflow-hidden flex-shrink-0">
                   <img src={anime.imageUrl} alt="" className="w-full h-full object-cover opacity-70 group-aria-selected:opacity-100" />
                </div>
                
                <div className="flex flex-col">
                   <span className="font-bold font-cinzel">{anime.title}</span>
                   <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span>ANIME</span>
                      <span>•</span>
                      <span>{anime.year}</span>
                      <span className="ml-2 text-anirias-crimson">{anime.rating} ★</span>
                   </div>
                </div>

                <MonitorPlay className="ml-auto w-4 h-4 opacity-0 group-aria-selected:opacity-100 transition-opacity text-anirias-crimson" />
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading={t('CommandMenu.settings')} className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 mt-4">
             <Item onSelect={() => console.log('Toggle Theme')}>
                <Moon className="w-4 h-4 mr-3 text-purple-400" />
                <span>{t('CommandMenu.theme')}</span>
             </Item>
          </Command.Group>
        </Command.List>

        <div className="px-4 py-2 border-t border-white/5 bg-black/20 text-[10px] text-gray-600 flex justify-between">
           <span>Use arrow keys to navigate</span>
           <span>Enter to select</span>
        </div>
      </div>
    </Command.Dialog>
  );
};

const Item: React.FC<{ children: React.ReactNode; onSelect: () => void }> = ({ children, onSelect }) => {
  return (
    <Command.Item 
      onSelect={onSelect}
      className="group flex items-center px-3 py-3 rounded-lg text-sm text-gray-300 cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-all duration-200 border-l-2 border-transparent aria-selected:border-anirias-crimson"
    >
      {children}
    </Command.Item>
  )
}

export default CommandMenu;