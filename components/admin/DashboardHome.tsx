import React from 'react';
import { Users, Play, Film, Server, ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../../providers/I18nProvider';

const DATA = Array.from({ length: 30 }).map((_, i) => ({
  name: `Jun ${i + 1}`,
  views: Math.floor(Math.random() * 5000) + 3000,
  subs: Math.floor(Math.random() * 200) + 50,
}));

const DashboardHome: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('Admin.totalUsers')} 
          value="12,450" 
          change="+12%" 
          icon={Users} 
          trend="up"
        />
        <StatCard 
          title={t('Admin.activeStreams')} 
          value="843" 
          change="+5%" 
          icon={Play} 
          trend="up"
          isLive
        />
        <StatCard 
          title={t('Admin.totalAnime')} 
          value="3,240" 
          change="+18" 
          icon={Film} 
          trend="neutral"
        />
        <StatCard 
          title={t('Admin.serverLoad')} 
          value="42%" 
          change="-2%" 
          icon={Server} 
          trend="down"
        />
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
           <div>
              <h3 className="text-lg font-cinzel font-bold text-white">{t('Admin.trafficOverview')}</h3>
              <p className="text-sm text-gray-500">Daily views over the last 30 days</p>
           </div>
           <select className="bg-white/5 border border-white/10 rounded px-3 py-1 text-xs text-gray-300 focus:outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
           </select>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#990011" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#990011" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <YAxis stroke="#666" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              <Area type="monotone" dataKey="views" stroke="#990011" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  isLive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend, isLive }) => {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors group relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
       <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
             <Icon className="w-5 h-5" />
          </div>
          {isLive && (
             <div className="flex items-center gap-2 bg-anirias-crimson/10 border border-anirias-crimson/30 rounded-full px-2 py-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-anirias-crimson opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-anirias-crimson"></span>
                </span>
                <span className="text-[10px] font-bold text-anirias-crimson uppercase">Live</span>
             </div>
          )}
       </div>
       <div className="relative z-10">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
          <div className="flex items-center gap-1 text-xs">
             {trend === 'up' && <ArrowUp className="w-3 h-3 text-emerald-500" />}
             {trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
             <span className={trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}>
                {change}
             </span>
             <span className="text-gray-600 ml-1">from last month</span>
          </div>
       </div>
    </div>
  );
};

export default DashboardHome;