import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trophy, AlertTriangle, Info, MonitorPlay, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification, NotificationType } from '../types';
import { markNotificationsRead } from '../app/actions';
import { useTranslation } from '../providers/I18nProvider';

interface NotificationDropdownProps {
  isAdminContext?: boolean;
}

// FIX: Implemented mock data generation to resolve compilation error.
const generateMockNotifications = (isAdmin: boolean): Notification[] => {
  if (isAdmin) {
    return [
      { id: 'n1', userId: 'admin', title: 'New User Report', message: 'User "RiasFan_22" reported a comment on "Void Slayer".', type: NotificationType.ADMIN_ALERT, isRead: false, createdAt: '5m ago' },
      { id: 'n2', userId: 'admin', title: 'System Health OK', message: 'Weekly system diagnostics completed with no critical issues.', type: NotificationType.SYSTEM, isRead: true, createdAt: '2h ago' },
      { id: 'n3', userId: 'admin', title: 'New Anime Imported', message: '"Cyberpunk Exorcist" was successfully imported via AniList.', type: NotificationType.SYSTEM, isRead: true, createdAt: '1d ago' },
    ];
  }
  return [
    { id: 'n4', userId: 'user1', title: 'You ranked up!', message: 'Congratulations! You have been promoted to the rank of Knight.', type: NotificationType.RANK_UP, isRead: false, createdAt: '1h ago' },
    { id: 'n5', userId: 'user1', title: 'New Episode Alert', message: 'A new episode of "Crimson Strategy" has just been released.', type: NotificationType.ANIME_UPDATE, isRead: false, createdAt: '3h ago' },
    { id: 'n6', userId: 'user1', title: 'Welcome to Anirias!', message: 'Explore our vast library and start your journey.', type: NotificationType.SYSTEM, isRead: true, createdAt: '1d ago' },
  ];
};


const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isAdminContext = false }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setNotifications(generateMockNotifications(isAdminContext)); }, [isAdminContext]);
  // FIX: Implemented click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  // FIX: Implemented handler to mark all notifications as read
  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    // In a real app, this server action would update the DB
    // await markNotificationsRead(unreadIds); 
  };
  // FIX: Implemented handler to delete a single notification
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  // FIX: Implemented icon provider based on notification type
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM: return <Info className="w-4 h-4 text-blue-400" />;
      case NotificationType.RANK_UP: return <Trophy className="w-4 h-4 text-yellow-400" />;
      case NotificationType.ANIME_UPDATE: return <MonitorPlay className="w-4 h-4 text-emerald-400" />;
      case NotificationType.ADMIN_ALERT: return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-300 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-anirias-crimson text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-anirias-black"></span>}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 md:w-96 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
              <h3 className="text-sm font-cinzel font-bold text-white">
                Notifications {unreadCount > 0 && <span className="text-anirias-crimson">({unreadCount})</span>}
              </h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                   <div key={notif.id} className="group relative flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                      <div className="mt-1 w-5 h-5 flex-shrink-0">{getIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-xs font-bold text-white mb-1">{notif.title}</h4>
                         <p className="text-xs text-gray-400 leading-snug">{notif.message}</p>
                         <span className="text-[10px] text-gray-600 mt-2 block">{notif.createdAt}</span>
                      </div>
                      {!notif.isRead && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-anirias-crimson rounded-full"></div>}
                      <button onClick={() => handleDelete(notif.id)} className="absolute top-2 right-2 p-1 text-gray-600 hover:text-white bg-transparent hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <X className="w-3 h-3"/>
                      </button>
                   </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 text-xs">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-20"/>
                  You have no new notifications.
                </div>
              )}
            </div>
            <div className="px-4 py-2 bg-black/40 border-t border-white/5 text-center">
              <button className="text-[10px] text-gray-500 hover:text-white transition-colors">
                View All History
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
