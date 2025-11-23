import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '../../providers/I18nProvider';

interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteAlert: React.FC<DeleteAlertProps> = ({ isOpen, onClose, onConfirm, title }) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-2xl"
          >
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0">
                   <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white">{t('DeleteAlert.title')}</h3>
                   <p className="text-sm text-gray-400">{t('DeleteAlert.subtitle')}</p>
                </div>
             </div>
             
             <p className="text-gray-300 text-sm mb-6 pl-16">
                {t('DeleteAlert.message', { title })}
             </p>

             <div className="flex justify-end gap-3">
                <button 
                  onClick={onClose} 
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-bold"
                >
                   {t('DeleteAlert.cancel')}
                </button>
                <button 
                  onClick={() => { onConfirm(); onClose(); }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all"
                >
                   {t('DeleteAlert.confirm')}
                </button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAlert;