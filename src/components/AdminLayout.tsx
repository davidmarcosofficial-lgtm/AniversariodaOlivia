import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../lib/auth';
import AdminSidebar, { AdminTab } from './AdminSidebar';
import { Lock, Sparkles } from 'lucide-react';
import { db } from '../lib/supabase';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUsername, setAdminUsername] = useState('Admin');
  const [birthdayName, setBirthdayName] = useState('Melissa');

  useEffect(() => {
    // Check if user is authenticated session-level
    const authenticated = adminAuth.isAuthenticated();
    if (!authenticated) {
      navigate('/admin/login');
    } else {
      setAdminUsername(adminAuth.getUsername());
      setCheckingAuth(false);
      
      // Load birthday name for the sidebar
      db.getSettings().then(settings => {
        if (settings?.birthday_name) {
          setBirthdayName(settings.birthday_name.split(' ')[0]);
        }
      }).catch(err => {
        console.error('Error loading settings for sidebar header:', err);
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    adminAuth.logout();
    navigate('/admin/login');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 border-4 border-pink-soft border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Acessando painel seguro...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={handleLogout}
        adminUsername={adminUsername}
        birthdayName={birthdayName}
      />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar details */}
        <header className="bg-white border-b border-gray-100 h-14 px-6 flex justify-between items-center shrink-0 select-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            <Lock size={12} className="text-sage-green" />
            <span>Sessão de Administração Segura</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-pink-dark bg-pink-soft/10 border border-pink-soft/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
              <Sparkles size={12} className="text-pink-soft animate-pulse" />
              <span>Bosque Encantado Ativo</span>
            </span>
          </div>
        </header>

        {/* Dynamic Inner Panel View viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
