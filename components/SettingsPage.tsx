"use client";
import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, Loader2 } from 'lucide-react';
import { useTranslation } from '../providers/I18nProvider';
import AvatarSelector from './AvatarSelector';
import { updateProfile } from '../app/actions/user';
import { toast } from 'sonner';

// Mock user data - in a real app, this would come from a session provider
const MOCK_USER = {
  name: 'Guest User',
  email: 'gremory-fan@anirias.com',
  image: 'https://picsum.photos/seed/rias-avatar/200/200',
};

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  // Form State
  const [displayName, setDisplayName] = useState(MOCK_USER.name);
  const [selectedAvatar, setSelectedAvatar] = useState(MOCK_USER.image);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateProfile({
        name: displayName,
        image: selectedAvatar,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4 md:px-8 font-inter">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-white tracking-wide">
            {t('SettingsPage.title')}
          </h1>
          <p className="text-gray-400 text-sm mt-2">{t('SettingsPage.subtitle')}</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* AVATAR SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-anirias-void border border-white/10 rounded-2xl p-8"
          >
            <AvatarSelector selectedAvatar={selectedAvatar} onSelect={setSelectedAvatar} />
          </motion.div>

          {/* PROFILE FORM SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-anirias-void border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-lg font-cinzel font-bold text-white mb-6">
              {t('SettingsPage.profileInfo')}
            </h3>
            <div className="space-y-6">
              {/* Display Name */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-anirias-crimson" />
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-anirias-crimson focus:bg-white/10 transition-all"
                />
                <label
                  htmlFor="displayName"
                  className="absolute left-12 top-[-0.5rem] bg-anirias-void px-1 text-xs text-gray-400"
                >
                  {t('SettingsPage.displayName')}
                </label>
              </div>

              {/* Email (Disabled) */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="email"
                  id="email"
                  value={MOCK_USER.email}
                  disabled
                  className="w-full bg-black/20 border border-white/5 rounded-lg py-3 pl-12 pr-4 text-gray-500 cursor-not-allowed"
                />
                <label
                  htmlFor="email"
                  className="absolute left-12 top-[-0.5rem] bg-anirias-void px-1 text-xs text-gray-600"
                >
                  {t('SettingsPage.email')}
                </label>
              </div>
            </div>
          </motion.div>

          {/* SAVE BUTTON */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <button
              type="submit"
              disabled={isPending}
              className="group px-8 py-3.5 bg-anirias-crimson text-white rounded-lg font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-anirias-bright hover:shadow-[0_0_20px_rgba(220,20,60,0.6)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isPending ? t('SettingsPage.saving') : t('SettingsPage.saveButton')}</span>
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
