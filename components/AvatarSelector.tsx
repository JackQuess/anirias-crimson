import React from 'react';
import { motion } from 'framer-motion';
import { PEERAGE_AVATARS } from '../constants/avatars';
import { Check } from 'lucide-react';
import { useTranslation } from '../providers/I18nProvider';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (imageUrl: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-cinzel font-bold text-white mb-4">
        {t('SettingsPage.chooseAvatar')}
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {PEERAGE_AVATARS.map((avatar) => {
          const isSelected = avatar.imageUrl === selectedAvatar;
          return (
            <motion.button
              key={avatar.name}
              type="button"
              onClick={() => onSelect(avatar.imageUrl)}
              className="relative aspect-square rounded-full focus:outline-none group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={avatar.imageUrl}
                alt={avatar.name}
                className={`w-full h-full object-cover rounded-full transition-all duration-300 border-4 ${
                  isSelected
                    ? 'border-anirias-crimson'
                    : 'border-white/10 group-hover:border-white/30'
                }`}
              />
              {/* Glowing Ring for selected */}
              {isSelected && (
                <div className="absolute -inset-1 rounded-full ring-2 ring-anirias-crimson ring-offset-2 ring-offset-anirias-void animate-pulse-slow shadow-[0_0_20px_#990011]" />
              )}
              {/* Checkmark overlay for selected */}
              {isSelected && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarSelector;
