"use client";
import React from 'react';
import { Activity, Server, Database, Terminal, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../../providers/I18nProvider';

const SystemHealth: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
       {/* Üst Durum Kartları */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex items-center gap-4">
             <div className="p-3 bg-green-500/10 rounded-full">
                <Activity className="w-6 h-6 text-green-500" />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">System Uptime</p>
                <h3 className="text-xl font-cinzel font-bold text-white">99.99%</h3>
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Operational
                </span>
             </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex items-center gap-4">
             <div className="p-3 bg-blue-500/10 rounded-full">
                <Database className="w-6 h-6 text-blue-500" />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Database Status</p>
                <h3 className="text-xl font-cinzel font-bold text-white">Supabase</h3>
                <span className="text-xs text-blue-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Connected (Pooler)
                </span>
             </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex items-center gap-4">
             <div className="p-3 bg-purple-500/10 rounded-full">
                <Server className="w-6 h-6 text-purple-500" />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deployment</p>
                <h3 className="text-xl font-cinzel font-bold text-white">Vercel</h3>
                <span className="text-xs text-purple-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Production Ready
                </span>
             </div>
          </div>
       </div>

       {/* Metrik Uyarısı (Mock Grafik Yerine) */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 bg-[#0a0a0a] border border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center">
             <div className="p-4 bg-yellow-500/10 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Gerçek Zamanlı Metrikler</h3>
             <p className="text-gray-400 max-w-lg mx-auto">
                CPU, RAM ve Latency (Gecikme) verilerini canlı olarak izlemek için Vercel Analytics veya Datadog entegrasyonu gereklidir. 
                Şu anki sunucu (Serverless) durumu stabildir.
             </p>
             <button className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-white transition-colors">
                Vercel Paneline Git ↗
             </button>
          </div>
       </div>

       {/* Log Terminali (Statik) */}
       <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-lg flex flex-col h-64">
          <div className="bg-white/5 border-b border-white/5 px-4 py-2 flex items-center gap-2">
             <Terminal className="w-4 h-4 text-gray-400" />
             <span className="text-xs font-mono text-gray-400">System Logs (Recent Activity)</span>
          </div>
          <div className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto space-y-1">
             <div className="text-green-500">[SYSTEM] Database connection established successfully via Prisma Client.</div>
             <div className="text-blue-400">[INFO] Next.js Server started on port 3000.</div>
             <div className="text-gray-500">[LOG] Auth adapter initialized. Providers: Google, Credentials.</div>
             <div className="text-gray-500">[LOG] Cron job registered: /api/cron/update-airing (0 0 * * *)</div>
             <div className="text-yellow-500 animate-pulse">[MONITOR] Waiting for incoming requests...</div>
          </div>
       </div>
    </div>
  );
};

export default SystemHealth;