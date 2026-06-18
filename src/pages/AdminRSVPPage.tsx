import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminRSVPTable from '../components/AdminRSVPTable';
import { db } from '../lib/supabase';
import { RSVP, EventSettings } from '../types/database';

export default function AdminRSVPPage() {
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const submissions = await db.getRSVPs();
      const config = await db.getSettings();
      setRsvps(submissions);
      setSettings(config);
    } catch (err) {
      console.error('Error loading RSVP page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddRsvp = async (newRsvp: Omit<RSVP, 'id'>) => {
    await db.createRSVP(newRsvp);
    await loadData();
  };

  const handleUpdateRsvp = async (id: string, updated: Partial<RSVP>) => {
    await db.updateRSVP(id, updated);
    await loadData();
  };

  const handleDeleteRsvp = async (id: string) => {
    await db.deleteRSVP(id);
    await loadData();
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'rsvps') return;
    if (tab === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#E66C86] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Buscando convidados...</p>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="rsvps" onTabChange={handleTabChange}>
      <AdminRSVPTable
        rsvps={rsvps}
        settings={settings}
        onAddRsvp={handleAddRsvp}
        onUpdateRsvp={handleUpdateRsvp}
        onDeleteRsvp={handleDeleteRsvp}
      />
    </AdminLayout>
  );
}
