
import React, { useState } from 'react';
import { Anime } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, MonitorPlay } from 'lucide-react';

interface SchedulePageProps {
  animeList: Anime[];
  onAnimeClick: (anime: Anime) => void;
}

const DAYS = [
  { id: 'MON', label: 'Monday' },
  { id: 'TUE', label: 'Tuesday' },
  { id: 'WED', label: 'Wednesday' },
  { id: 'THU', label: 'Thursday' },
  { id: 'FRI', label: 'Friday' },
  { id: 'SAT', label: 'Saturday' },
  { id: 'SUN', label: 'Sunday' }
];

const SchedulePage: React.FC<SchedulePageProps> = ({ animeList, onAnimeClick }) => {
  // Get today's day abbreviation (e.g., 'MON')
  const todayIndex = new Date().getDay(); // 0 is Sunday
  const todayId = DAYS[todayIndex === 0 ? 6 : todayIndex - 1].id;

  const [selectedDay, setSelectedDay] = useState(todayId);

  // Mock Schedule Data Mapping
  // Since animeList doesn't have specific days, we'll hash the ID to assign a deterministic day
  const getScheduleForDay = (dayId: string) => {
    return animeList
      .filter((anime, index) => {
        const dayIndex = DAYS.findIndex(d => d.id === dayId);
        // Distribute anime across days based on ID hash/index
        return (index % 7) === dayIndex; 
      })
      .map((anime, index) => ({
        ...anime,
        // Mock time based on index
        airingTime: `${14 + (index % 10)}:${index % 2 === 0 ? '00' : '30'}`
      }))
      .sort((a, b) => a.airingTime.localeCompare(b.airingTime));
  };

  const scheduledAnime = getScheduleForDay(selectedDay);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4 md:px-8 font-inter">
      <div className="container mx-auto max-w-[1200px]">

        {/* HEADER */}
        <div className="text-center mb-10">
           <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-white tracking-wide mb-2">
             WEEKLY <span className="text-anirias-crimson">SCHEDULE</span>
           </h1>
           <p className="text-gray-400 text-sm">Stay updated with the latest air times. Timezone: Local</p>
        </div>

        {/* DAY TABS */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 border-b border-white/10 pb-6">
           {DAYS.map((day) => {
             const isSelected = selectedDay === day.id;
             const isToday = day.id === todayId;

             return (
               <button
                 key={day.id}
                 onClick={() => setSelectedDay(day.id)}
                 className={`relative px-4 py-3 md:px-6 md:py-4 rounded-xl transition-all duration-300 group ${
                   isSelected 
                     ? 'bg-anirias-crimson text-white shadow-[0_0_20px_rgba(153,0,17,0.4)]' 
                     : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                 }`}
               >
                 {/* Today Badge */}
                 {isToday && (
                    <span className="absolute -top-2 -right-1 text-[9px] font-bold bg-white text-black px-1.5 rounded-full shadow-lg z-10">
                       TODAY
                    </span>
                 )}
                 
                 <div className="text-xs md:text-sm font-bold tracking-widest">{day.id}</div>
                 <div className={`text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
                   {day.label}
                 </div>
               </button>
             );
           })}
        </div>

        {/* LIST */}
        <div className="space-y-2">
           <AnimatePresence mode="wait">
             <motion.div
               key={selectedDay}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
             >
               {scheduledAnime.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {scheduledAnime.map((anime) => (
                       <div 
                         key={anime.id}
                         onClick={() => onAnimeClick(anime)}
                         className="group flex items-center gap-4 md:gap-8 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
                       >
                          {/* Time */}
                          <div className="w-24 flex-shrink-0 text-right border-r border-white/10 pr-4 md:pr-8">
                             <span className="block text-xl md:text-2xl font-cinzel font-bold text-white group-hover:text-anirias-crimson transition-colors">
                               {anime.airingTime}
                             </span>
                             <span className="text-xs text-gray-500 font-medium">PM</span>
                          </div>

                          {/* Thumbnail */}
                          <div className="w-16 h-16 md:w-24 md:h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                             <img src={anime.coverUrl || anime.imageUrl} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                             <h3 className="text-white font-bold text-base md:text-lg truncate">{anime.title}</h3>
                             <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                <span className="bg-white/10 px-1.5 rounded text-[10px]">{anime.type}</span>
                                <span className="flex items-center gap-1">
                                   <MonitorPlay className="w-3 h-3" /> Ep {anime.episodes}
                                </span>
                             </div>
                          </div>

                          {/* Action */}
                          <div className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="px-4 py-2 rounded-lg border border-white/20 hover:bg-anirias-crimson hover:border-anirias-crimson text-sm font-bold transition-all">
                                Details
                             </button>
                          </div>

                       </div>
                    ))}
                  </div>
               ) : (
                  <div className="text-center py-20 text-gray-500">
                     <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>No broadcasts scheduled for this day.</p>
                  </div>
               )}
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default SchedulePage;
