'use client';

import React, { useState } from 'react';
import { useI18n } from '../providers/I18nProvider';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useI18n();

  const changeLocale = (nextLocale: 'en' | 'tr') => {
    setLocale(nextLocale);
    setIsOpen(false);
  };

  const getFlagEmoji = (lang: string) => lang === 'tr' ? '🇹🇷' : '🇬🇧';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <Globe className="w-5 h-5 text-gray-300" />
        <span className="text-sm font-bold uppercase">{locale}</span>
        <span className="text-lg">{getFlagEmoji(locale)}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-36 bg-anirias-void border border-white/10 rounded-lg shadow-2xl p-2 z-50"
          >
            <button
              onClick={() => changeLocale('en')}
              disabled={locale === 'en'}
              className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 disabled:opacity-50 text-sm"
            >
              <span>English</span>
              <span>🇬🇧</span>
            </button>
            <button
              onClick={() => changeLocale('tr')}
              disabled={locale === 'tr'}
              className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 disabled:opacity-50 text-sm"
            >
              <span>Türkçe</span>
              <span>🇹🇷</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageToggle;
