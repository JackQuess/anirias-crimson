import React, { useState } from 'react';
import { UserRank } from '../../types';
// FIX: Imported the 'User' icon from 'lucide-react'.
import { Search, Shield, Ban, CheckCircle, Crown, Hammer, Edit3, Users, User } from 'lucide-react';
import EditUserDialog, { AdminUser } from './EditUserDialog';
import { useTranslation } from '../../providers/I18nProvider';

// FIX: Added mock data as it was missing.
const MOCK_USERS: AdminUser[] = [
    { id: '1', username: 'RiasFan_22', email: 'rias@underworld.com', rank: 'Queen', role: 'ADMIN', status: 'Active', joined: '2023-01-15', lastActive: '2 hours ago' },
    { id: '2', username: 'VoidSlayer_X', email: 'void@abyss.net', rank: 'Knight', role: 'USER', status: 'Active', joined: '2023-05-20', lastActive: '1 day ago' },
    { id: '3', username: 'MechaPilot_01', email: 'gundam@space.io', rank: 'Pawn', role: 'USER', status: 'Banned', joined: '2024-02-10', lastActive: '1 week ago' },
    { id: '4', username: 'ShadowMonarch', email: 'sung@jinwoo.kr', rank: 'King', role: 'USER', status: 'Active', joined: '2022-11-30', lastActive: '5 hours ago' },
    { id: '5', username: 'MagicUser', email: 'megumin@crimson.jp', rank: 'Bishop', role: 'USER', status: 'Active', joined: '2024-03-01', lastActive: '2 days ago' },
];
const RANKS: UserRank[] = ['Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'King'];

const UsersManager: React.FC = () => {
  const { t } = useTranslation();
  // FIX: Added state for users, editing user, search, and filters.
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // FIX: Added handler to save user changes.
  const saveUserChanges = (updatedUser: AdminUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };
  
  return (
    <div className="space-y-6">
      
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-xl">
         <div className="flex items-center gap-2 mr-auto">
            <Users className="w-5 h-5 text-anirias-crimson" />
            <h2 className="text-lg font-cinzel font-bold text-white whitespace-nowrap">{t('Admin.userManagement')}</h2>
         </div>
         <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               <input type="text" placeholder={t('Admin.searchUsers')} className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors" />
            </div>
            <div className="flex gap-2">
               <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors">
                  <option value="All">{t('Admin.allRoles')}</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
               </select>
               <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-anirias-crimson transition-colors">
                  <option value="All">{t('Admin.allStatuses')}</option>
                  <option value="Active">Active</option>
                  <option value="Banned">Banned</option>
               </select>
            </div>
         </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-lg">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                     <th className="px-6 py-4">User</th>
                     <th className="px-6 py-4">Role</th>
                     <th className="px-6 py-4">Rank</th>
                     <th className="px-6 py-4">{t('Admin.status')}</th>
                     <th className="px-6 py-4">Joined / Last Active</th>
                     <th className="px-6 py-4 text-right">{t('Admin.actions')}</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5 text-sm">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-white">{user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">{user.role === 'ADMIN' ? <Shield className="w-4 h-4 text-yellow-400"/> : <User className="w-4 h-4 text-gray-500"/>}</td>
                      <td className="px-6 py-4 font-bold">{user.rank}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {user.status === 'Active' ? <CheckCircle className="w-3 h-3"/> : <Ban className="w-3 h-3"/>}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-300">{user.joined}</div>
                        <div className="text-xs text-gray-500">{user.lastActive}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setEditingUser(user)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Hammer className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
      <EditUserDialog 
        // FIX: Pass state variables to the dialog component.
        isOpen={!!editingUser} 
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={saveUserChanges}
      />
    </div>
  );
};

export default UsersManager;