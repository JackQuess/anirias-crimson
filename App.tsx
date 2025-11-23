import React, { useState, useEffect } from 'react';
import { ViewState, Anime, Character, HeroSlide } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnimeGrid from './components/AnimeGrid';
import VideoPlayer from './components/VideoPlayer';
import TrendingSidebar from './components/TrendingSidebar';
import AnimeDetail from './components/AnimeDetail';
import MobileNavigation from './components/MobileNavigation';
import Catalog from './components/Catalog';
import SchedulePage from './components/SchedulePage'; 
import AuthModal from './components/AuthModal';
import Preloader from './components/Preloader';
import Profile from './components/Profile';
import MyListPage from './components/MyListPage';
import FavoritesPage from './components/FavoritesPage';
import SettingsPage from './components/SettingsPage';
import CommandMenu from './components/CommandMenu';
import LevelUpToast from './components/LevelUpToast'; 
import RecentEpisodes from './components/RecentEpisodes';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/useGameStore'; 
import { I18nProvider } from './providers/I18nProvider';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import DashboardHome from './components/admin/DashboardHome';
import AnimeManager from './components/admin/AnimeManager';
import ImportAnime from './components/admin/ImportAnime'; 
import UsersManager from './components/admin/UsersManager';
import ReportsList from './components/admin/ReportsList';
import SystemHealth from './components/admin/SystemHealth';
import AdminSettings from './components/admin/AdminSettings';
import HeroManager from './components/admin/HeroManager'; 

// Mock Data Generation
const generateMockCharacters = (): Character[] => {
  return [
    { id: 'c1', name: 'Rias Gremory', role: 'Main', voiceActor: 'Yōko Hikasa', imageUrl: 'https://picsum.photos/seed/rias/200/200' },
    { id: 'c2', name: 'Issei Hyoudou', role: 'Main', voiceActor: 'Yuki Kaji', imageUrl: 'https://picsum.photos/seed/issei/200/200' },
    { id: 'c3', name: 'Akeno Himejima', role: 'Supporting', voiceActor: 'Shizuka Itō', imageUrl: 'https://picsum.photos/seed/akeno/200/200' },
    { id: 'c4', name: 'Koneko Toujou', role: 'Supporting', voiceActor: 'Ayana Taketatsu', imageUrl: 'https://picsum.photos/seed/koneko/200/200' },
    { id: 'c5', name: 'Kiba Yuuto', role: 'Supporting', voiceActor: 'Kenji Nojima', imageUrl: 'https://picsum.photos/seed/kiba/200/200' },
    { id: 'c6', name: 'Asia Argento', role: 'Supporting', voiceActor: 'Azumi Asakura', imageUrl: 'https://picsum.photos/seed/asia/200/200' },
  ];
};

const generateMockAnime = (count: number): Anime[] => {
  const genres = ["Action", "Demons", "Magic", "Romance", "Horror", "Sci-Fi", "Isekai", "Mecha"];
  const studios = ["TNK", "Passione", "Madhouse", "MAPPA", "Ufotable"];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `anime-${i}`,
    title: [
      "Crimson Strategy: King's Pawn", "Void Slayer", "Mecha Archangel", "School of Shadows", 
      "The Last Dragon King", "Cyberpunk Exorcist", "Vampire Princess", "Dungeon Reset"
    ][i % 8] + (i > 7 ? ` ${i}` : ''),
    description: "In a world where magic determines social standing, one boy devoid of mana discovers an ancient anti-magic grimoire. He must fight through the ranks of the academy to prove that strength comes from the heart, not just the bloodline.",
    imageUrl: `https://picsum.photos/seed/anirias${i}/600/900`,
    tags: [genres[i % genres.length], genres[(i + 1) % genres.length]],
    rating: Number((8 + Math.random() * 2).toFixed(1)),
    episodes: Math.floor(Math.random() * 24) + 1,
    type: Math.random() > 0.8 ? 'MOVIE' : 'TV',
    status: Math.random() > 0.5 ? 'Airing' : 'Finished',
    sub: Math.floor(Math.random() * 1000),
    dub: Math.floor(Math.random() * 500),
    duration: "24m",
    year: 2020 + Math.floor(Math.random() * 5),
    studio: studios[i % studios.length],
    characters: generateMockCharacters()
  }));
};

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Dynamic Data
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]); 

  // Game Store for XP
  const { addXp } = useGameStore();

  // Initialize Data
  useEffect(() => {
    // Simulate fetching initial data
    const generatedList = generateMockAnime(32);
    setAnimeList(generatedList);
    
    // MOCK HERO SLIDES with Video
    const mockSlides: HeroSlide[] = [
      {
        id: 'slide-1',
        animeId: generatedList[0].id,
        order: 1,
        isActive: true,
        anime: generatedList[0], // hydrated
        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 
        title: "CRIMSON AWAKENING",
        description: "Witness the rise of the Gremory clan in glorious high definition. The battle for the underworld begins now."
      },
      {
        id: 'slide-2',
        animeId: generatedList[1].id,
        order: 2,
        isActive: true,
        anime: generatedList[1],
        title: "VOID WALKER",
        description: "Step into the abyss. A psychological thriller that challenges the very nature of existence."
      }
    ];
    // FIX: Corrected typo from 'hydratedSlides' to 'mockSlides'.
    setHeroSlides(mockSlides);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // --- EVENT HANDLERS ---

  const handleViewDetails = (anime: Anime) => {
    setSelectedAnime(anime);
    setCurrentView(ViewState.DETAIL);
    window.scrollTo(0, 0);
  };

  const handleWatch = (anime: Anime) => {
    setSelectedAnime(anime);
    setCurrentView(ViewState.WATCH);
    window.scrollTo(0, 0);
    addXp(50); 
  };

  const goHome = () => {
    setCurrentView(ViewState.HOME);
    window.scrollTo(0, 0);
  };

  const navigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  }

  // Callback for when Admin imports a new anime
  const handleImportSuccess = (newAnime: Anime) => {
    setAnimeList(prev => [newAnime, ...prev]);
    setCurrentView(ViewState.ADMIN_ANIME);
  };
  
  // Callback for successful login
  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    setCurrentView(ViewState.PROFILE);
  };

  // Check if current view is an Admin View
  const isAdminView = Object.values(ViewState).some(v => v.startsWith('ADMIN_') && v === currentView);


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative font-inter selection:bg-anirias-crimson selection:text-white">
      
      {/* PRELOADER */}
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* LEVEL UP TOAST (Global Overlay) */}
          <LevelUpToast />
          
          {/* COMMAND PALETTE */}
          <CommandMenu 
            isOpen={isCommandOpen}
            setIsOpen={setIsCommandOpen}
            animeList={animeList}
            onNavigate={setCurrentView}
            onAnimeSelect={handleViewDetails}
          />

          {/* RENDER ADMIN LAYOUT IF ADMIN VIEW */}
          {isAdminView ? (
            <AdminLayout currentView={currentView} onNavigate={setCurrentView}>
               {currentView === ViewState.ADMIN_DASHBOARD && <DashboardHome />}
               {currentView === ViewState.ADMIN_ANIME && <AnimeManager animeList={animeList} />}
               {currentView === ViewState.ADMIN_HERO && (
                  <HeroManager animeList={animeList} slides={heroSlides} setSlides={setHeroSlides} />
               )}
               {currentView === ViewState.ADMIN_IMPORT && (
                 <ImportAnime onImportSuccess={handleImportSuccess} />
               )}
               {currentView === ViewState.ADMIN_USERS && <UsersManager />}
               {currentView === ViewState.ADMIN_REPORTS && <ReportsList />}
               {currentView === ViewState.ADMIN_SYSTEM && <SystemHealth />}
               {currentView === ViewState.ADMIN_SETTINGS && <AdminSettings />}
            </AdminLayout>
          ) : (
            // NORMAL USER LAYOUT
            <>
              <Navbar 
                onLogoClick={goHome} 
                onNavigate={setCurrentView} 
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenCommand={() => setIsCommandOpen(true)}
              />
              
              <main className="relative z-10 pb-20 md:pb-0">
                <AnimatePresence mode="wait">
                  
                  {/* HOME VIEW */}
                  {currentView === ViewState.HOME && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Hero slides={heroSlides} onPlay={handleViewDetails} />
                      
                      <RecentEpisodes animeList={animeList} onPlay={handleWatch} />

                      <div className="container mx-auto px-4 md:px-6 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                          <div className="lg:col-span-3">
                            <AnimeGrid animeList={animeList.slice(0, 12)} onAnimeClick={handleViewDetails} />
                          </div>
                          <div className="lg:col-span-1 hidden lg:block">
                            <div className="sticky top-24">
                                <TrendingSidebar animeList={animeList} onAnimeClick={handleViewDetails} onNavigate={navigate} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* CATALOG VIEW */}
                  {currentView === ViewState.CATALOG && (
                    <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Catalog animeList={animeList} onAnimeClick={handleViewDetails} />
                    </motion.div>
                  )}

                  {/* SCHEDULE VIEW */}
                  {currentView === ViewState.SCHEDULE && (
                    <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SchedulePage animeList={animeList} onAnimeClick={handleViewDetails} />
                    </motion.div>
                  )}

                  {/* DETAIL VIEW */}
                  {currentView === ViewState.DETAIL && selectedAnime && (
                    <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <AnimeDetail 
                          anime={selectedAnime} 
                          onPlay={() => handleWatch(selectedAnime)}
                          onBack={goHome}
                      />
                    </motion.div>
                  )}

                  {/* WATCH VIEW */}
                  {currentView === ViewState.WATCH && selectedAnime && (
                    <motion.div key="watch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <VideoPlayer anime={selectedAnime} onBack={() => handleViewDetails(selectedAnime)} />
                    </motion.div>
                  )}

                  {/* PROFILE VIEW */}
                  {currentView === ViewState.PROFILE && (
                    <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Profile onNavigate={navigate} onAnimeClick={handleViewDetails} />
                    </motion.div>
                  )}

                  {/* MY LIST VIEW */}
                  {currentView === ViewState.MY_LIST && (
                    <motion.div key="my-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <MyListPage onAnimeClick={handleViewDetails} onNavigate={navigate} />
                    </motion.div>
                  )}

                  {/* FAVORITES VIEW */}
                  {currentView === ViewState.FAVORITES && (
                    <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FavoritesPage onAnimeClick={handleViewDetails} onNavigate={navigate} />
                    </motion.div>
                  )}

                  {/* SETTINGS VIEW */}
                  {currentView === ViewState.SETTINGS && (
                    <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <SettingsPage />
                    </motion.div>
                  )}

                </AnimatePresence>
              </main>

              <MobileNavigation currentView={currentView} onNavigate={setCurrentView} />
              <AuthModal 
                isOpen={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
                onLoginSuccess={handleLoginSuccess}
              />

              <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-anirias-crimson/5 blur-[180px] rounded-full" />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}

export default App;