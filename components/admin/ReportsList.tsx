import React, { useState } from 'react';
import { AlertTriangle, MessageSquare, PlayCircle, CheckCircle, XCircle, Trash2, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../providers/I18nProvider';

// FIX: Defined the Report interface and added mock data to resolve errors.
interface Report {
  id: string;
  type: 'comment' | 'episode' | 'user';
  targetId: string;
  targetContent: string;
  reporter: { name: string; id: string };
  reason: string;
  timestamp: string;
}
const MOCK_REPORTS: Report[] = [
  { id: 'rep1', type: 'comment', targetId: 'c123', targetContent: "This anime is terrible, you should all...", reporter: { name: 'RiasFan_22', id: 'u1' }, reason: 'Spam / Offensive Language', timestamp: '2 hours ago' },
  { id: 'rep2', type: 'episode', targetId: 'ep456', targetContent: 'Episode 12 - "The Final Battle"', reporter: { name: 'VoidSlayer_X', id: 'u2' }, reason: 'Video quality is poor', timestamp: '1 day ago' },
  { id: 'rep3', type: 'user', targetId: 'u789', targetContent: 'SpamBot9000', reporter: { name: 'ShadowMonarch', id: 'u4' }, reason: 'Spamming links in comments', timestamp: '3 days ago' },
];

const ReportsList: React.FC = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  // FIX: Implemented a basic handler to allow component functionality.
  const handleAction = (id: string, action: 'resolve' | 'ignore' | 'delete') => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/5 p-4 rounded-xl">
         <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
            <AlertTriangle className="w-5 h-5" />
         </div>
         <div>
            <h2 className="text-lg font-cinzel font-bold text-white">{t('Admin.reportsTitle')}</h2>
            <p className="text-xs text-gray-500">Review and manage content flagged by the community.</p>
         </div>
         <div className="ml-auto bg-white/5 px-3 py-1 rounded text-xs font-bold text-gray-400">
            {reports.length} Pending
         </div>
      </div>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {reports.length > 0 ? (
            reports.map((report) => (
              <motion.div key={report.id} className="bg-[#0a0a0a] border border-white/5 rounded-xl flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                   <div className="flex items-start justify-between mb-3">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">{report.type} Report</span>
                         </div>
                         <h3 className="text-white font-bold text-base line-clamp-1">"{report.targetContent}"</h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0 ml-4">
                         <Clock className="w-3 h-3" /> {report.timestamp}
                      </div>
                   </div>
                   <div className="text-sm text-gray-400 border-l-2 border-white/10 pl-3">
                      <p><strong className="text-gray-200">Reason:</strong> {report.reason}</p>
                      <p className="flex items-center gap-2"><strong className="text-gray-200">Reporter:</strong> <User className="w-3 h-3"/> {report.reporter.name}</p>
                   </div>
                </div>
                {/* ... (card structure) ... */}
                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-white/5 p-4 md:p-6">
                   <button onClick={() => handleAction(report.id, 'resolve')} className="flex w-full items-center justify-center md:justify-start gap-2 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors">
                      <CheckCircle className="w-4 h-4" /> Resolve
                   </button>
                   <button onClick={() => handleAction(report.id, 'ignore')} className="flex w-full items-center justify-center md:justify-start gap-2 px-3 py-2 text-xs font-bold text-gray-400 hover:bg-white/10 rounded-md transition-colors">
                      <XCircle className="w-4 h-4" /> Ignore
                   </button>
                   <button onClick={() => handleAction(report.id, 'delete')} className="flex w-full items-center justify-center md:justify-start gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                   </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">
               <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500/50" />
               <h3 className="text-white font-bold text-lg">All Clear!</h3>
               <p>There are no pending reports at this time.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportsList;