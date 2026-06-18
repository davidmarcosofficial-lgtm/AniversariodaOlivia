import { BarChart3, Camera, FileSpreadsheet, LogOut, MessageSquareLock, Settings, Gift } from 'lucide-react';
import { CuteFox } from './WoodlandAnimals';

export type AdminTab = 'dashboard' | 'rsvps' | 'moderation' | 'gallery' | 'settings' | 'gifts';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  adminUsername: string;
  birthdayName?: string;
}

export default function AdminSidebar({ activeTab, onTabChange, onLogout, adminUsername, birthdayName }: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard' as AdminTab, label: 'Painel Geral', icon: BarChart3 },
    { id: 'rsvps' as AdminTab, label: 'Convidados & RSVP', icon: FileSpreadsheet },
    { id: 'moderation' as AdminTab, label: 'Moderação Mural', icon: MessageSquareLock },
    { id: 'gallery' as AdminTab, label: 'Álbum de Fotos', icon: Camera },
    { id: 'gifts' as AdminTab, label: 'Sugestões de Presente', icon: Gift },
    { id: 'settings' as AdminTab, label: 'Personalizar Design', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-100 p-5 flex flex-col justify-between shrink-0 select-none">
      <div className="space-y-6">
        {/* Brand visual header */}
        <div className="flex items-center gap-2 px-2 pb-4 border-b border-gray-100">
          <CuteFox size={36} />
          <div>
            <h1 className="text-sm font-bold font-serif text-slate-800 uppercase tracking-wider leading-none truncate max-w-[120px]" title={birthdayName || 'Melissa'}>
              {birthdayName || 'Melissa'}
            </h1>
            <span className="text-[10px] font-bold text-sage-green tracking-widest uppercase">Admin Panel</span>
          </div>
        </div>

        {/* User Info card */}
        <div className="p-3.5 bg-sage-light/15 border border-sage-light/40 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sage-light/30 flex items-center justify-center text-sm font-bold text-sage-green uppercase select-none">
            {adminUsername ? adminUsername.charAt(0) : 'M'}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-800 truncate leading-tight">
              {adminUsername || 'Admin'}
            </h3>
            <span className="text-[9px] font-bold text-sage-green uppercase tracking-widest">Master ADM</span>
          </div>
        </div>

        {/* Menu Navigation items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-pink-soft text-white shadow-[0_2px_4px_rgba(219,39,119,0.15)]'
                    : 'text-gray-500 hover:text-slate-800 hover:bg-sage-light/10'
                }`}
              >
                <IconComponent size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="pt-4 md:pt-0 mt-5 md:mt-0 border-t md:border-t-0 border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer select-none"
        >
          <LogOut size={15} />
          <span>Sair do Painel</span>
        </button>
      </div>
    </aside>
  );
}
