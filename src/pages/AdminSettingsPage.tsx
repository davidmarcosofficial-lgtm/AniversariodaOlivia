import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminSettingsForm from '../components/AdminSettingsForm';
import { db } from '../lib/supabase';
import { EventSettings } from '../types/database';

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await db.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (updated: Partial<EventSettings>) => {
    await db.updateSettings(updated);
    await fetchSettings();
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'settings') return;
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
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="settings" onTabChange={handleTabChange}>
      <AdminSettingsForm
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </AdminLayout>
  );
}
