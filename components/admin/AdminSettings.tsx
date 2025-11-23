import React, { useState } from 'react';
import { Globe, AlertTriangle, Megaphone, Save, CheckCircle, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../providers/I18nProvider';

const AdminSettings: React.FC = () => {
  const { t } = useTranslation();

  const [siteName, setSiteName] = useState("My Anime Site");
  const [seoDescription, setSeoDescription] = useState("High quality anime streaming platform.");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const payload = {
      siteName,
      seoDescription,
      maintenanceMode,
      announcementEnabled,
      announcementMessage,
    };

    console.log("Settings saved:", payload);
    setIsSaved(true);

    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-white">
            {t('Admin.settingsTitle')}
          </h2>
          <p className="text-sm text-gray-500">
            Manage global site settings, SEO, and access control.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
        >
          {isSaved ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaved ? "Saved!" : t('Admin.saveChanges')}
        </button>
      </div>

      <section className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-cinzel">
            General Information
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Site Name
            </label>
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:border-red-600 outline-none"
              placeholder="Enter site name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              SEO Description
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm min-h-[100px] focus:border-red-600 outline-none"
              placeholder="Short site description"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                Maintenance Mode
              </h3>
              <p className="text-sm text-gray-500">
                When active, the site will be inaccessible to all non-admin users.
              </p>
            </div>
          </div>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="hidden"
            />
            <div
              className={`w-12 h-6 rounded-full transition ${
                maintenanceMode ? "bg-red-600" : "bg-zinc-700"
              }`}
            >
              <div
                className={`h-6 w-6 bg-white rounded-full transition ${
                  maintenanceMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>
      </section>

      <section className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                Global Announcement
              </h3>
              <p className="text-sm text-gray-500">
                Display a banner message at the top of all pages.
              </p>
            </div>
          </div>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="hidden"
            />
            <div
              className={`w-12 h-6 rounded-full transition ${
                announcementEnabled ? "bg-red-600" : "bg-zinc-700"
              }`}
            >
              <div
                className={`h-6 w-6 bg-white rounded-full transition ${
                  announcementEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">
            Announcement Message
          </label>
          <input
            value={announcementMessage}
            onChange={(e) => setAnnouncementMessage(e.target.value)}
            disabled={!announcementEnabled}
            className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:border-red-600 outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            placeholder="Enter announcement message"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;