import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from '../components/AdminDashboard';
import { db } from '../lib/supabase';
import { RSVP, EventSettings } from '../types/database';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [rsvpsData, settingsData] = await Promise.all([
        db.getRSVPs(),
        db.getSettings()
      ]);
      setRsvps(rsvpsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#E66C86] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Carregando métricas...</p>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    if (tab === 'dashboard') return;
    navigate(`/admin/${tab}`);
  };

  return (
    <AdminLayout activeTab="dashboard" onTabChange={handleTabChange}>
      <AdminDashboard rsvps={rsvps} settings={settings} />
    </AdminLayout>
  );
}
