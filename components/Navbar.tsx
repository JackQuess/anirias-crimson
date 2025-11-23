"use client";


import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { ViewState } from '../types';
import NotificationDropdown from './NotificationDropdown';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '../providers/I18nProvider'; // New Import

interface NavbarProps {
  onLogoClick: () => void;
  onNavigate: (view: ViewState) => void;
  onOpenAuth: () => void;
  onOpenCommand?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogoClick, onNavigate, onOpenAuth, onOpenCommand }) => {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation(); // Use translation hook

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ label, view }: { label: string, view: ViewState }) => (
    <button 
      onClick={() => onNavigate(view)} 
      className="relative text-sm font-inter text-gray-300 hover:text-white uppercase tracking-widest transition-all group"
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-anirias-crimson group-hover:w-full transition-all duration-300"></span>
    </button>
  );

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b border-white/0 ${
        scrolled 
          ? 'bg-anirias-black/90 backdrop-blur-xl border-white/5 py-3 md:py-4 shadow-lg' 
          : 'bg-gradient-to-b from-black/80 to-transparent py-4 md:py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center relative">
        <div className="hidden md:flex justify-between w-full items-center">
            <div 
              onClick={onLogoClick} 
              className="cursor-pointer group relative"
            >
              <h1 className="text-3xl font-cinzel font-bold text-white tracking-wider group-hover:text-anirias-bright transition-colors duration-300">
                ANI<span className="text-anirias-crimson">RIAS</span>
              </h1>
            </div>

            <div className="flex space-x-8">
              <NavLink label={t('Navbar.home')} view={ViewState.HOME} />
              <NavLink label={t('Navbar.catalog')} view={ViewState.CATALOG} />
              <NavLink label={t('Navbar.schedule')} view={ViewState.SCHEDULE} />
              <NavLink label={t('Navbar.myList')} view={ViewState.PROFILE} />
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onOpenCommand ? onOpenCommand() : onNavigate(ViewState.CATALOG)} 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                title="Search (Ctrl+K)"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <NotificationDropdown />
              
              <LanguageToggle />

              <button 
                onClick={onOpenAuth}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-anirias-crimson to-black border border-white/20 flex items-center justify-center hover:border-anirias-bright transition-all"
              >
                <User className="w-4 h-4 text-white" />
              </button>
            </div>
        </div>

        <div className="flex md:hidden items-center w-full justify-between">
            <div className="w-8"></div>
            <div 
              onClick={onLogoClick}
              className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
            >
               <h1 className="text-2xl font-cinzel font-bold text-white tracking-widest drop-shadow-lg">
                A<span className="text-anirias-crimson">N</span>R
               </h1>
            </div>
            <div className="relative flex items-center gap-2">
               <NotificationDropdown />
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;