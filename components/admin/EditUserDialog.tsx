import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Shield, Mail, User, Ban, CheckCircle } from 'lucide-react';
import { UserRank } from '../../types';
import { useTranslation } from '../../providers/I18nProvider';

// FIX: Defined the AdminUser interface with its properties.
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  rank: UserRank;
  role: 'ADMIN' | 'USER';
  status: 'Active' | 'Banned';
  joined: string;
  lastActive: string;
}
interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSave: (user: AdminUser) => void;
}
const RANKS: UserRank[] = ['Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'King'];

const EditUserDialog: React.FC<EditUserDialogProps> = ({ isOpen, onClose, user, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<AdminUser | null>(null);

  useEffect(() => { if (isOpen && user) { setFormData({ ...user }); } }, [isOpen, user]);

  if (!formData) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
              <h2 className="text-lg font-cinzel font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-anirias-crimson" /> {t('Admin.editUser')}
              </h2>
              <button onClick={onClose}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* ... (user identity) ... */}
              <div className="space-y-1">
                 <label className="...">{t('AuthModal.email')}</label>
                 <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="...">Rank</label>
                    <select value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value as UserRank})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors">
                       {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="...">Role</label>
                    <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as 'ADMIN' | 'USER'})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors">
                       <option value="USER">User</option>
                       <option value="ADMIN">Admin</option>
                    </select>
                 </div>
              </div>
              {/* ... (ban switch) ... */}
              <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-bold">
                   {t('DeleteAlert.cancel')}
                 </button>
                 <button type="submit" className="px-4 py-2 bg-anirias-crimson hover:bg-anirias-bright text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                   <Save className="w-4 h-4" /> {t('Admin.saveChanges')}
                 </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditUserDialog;