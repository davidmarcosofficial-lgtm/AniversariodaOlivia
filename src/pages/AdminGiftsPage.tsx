import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminGiftManager from '../components/AdminGiftManager';
import { db, isSupabaseConfigured } from '../lib/supabase';
import { GiftSuggestion } from '../types/database';

export default function AdminGiftsPage() {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState<GiftSuggestion[]>([]);
  const [isTableConfigured, setIsTableConfigured] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchGifts = async () => {
    try {
      const data = await db.getGiftSuggestions();
      setGifts(data);
      if (isSupabaseConfigured) {
        const exists = await db.checkGiftSuggestionsTableExists();
        setIsTableConfigured(exists);
      }
    } catch (err) {
      console.error('Error loading gift suggestions in admin page:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleAddGiftSubmit = async (newGift: Omit<GiftSuggestion, 'id' | 'created_at' | 'updated_at'>) => {
    await db.addGiftSuggestion(newGift);
    await fetchGifts();
  };

  const handleUpdateGiftSubmit = async (id: string, updated: Partial<GiftSuggestion>) => {
    await db.updateGiftSuggestion(id, updated);
    await fetchGifts();
  };

  const handleDeleteGiftSubmit = async (id: string) => {
    await db.deleteGiftSuggestion(id);
    await fetchGifts();
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'gifts') return;
    if (tab === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#E66C86] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 font-sans">Carregando sugestões...</p>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="gifts" onTabChange={handleTabChange}>
      <AdminGiftManager
        gifts={gifts}
        isSupabaseConfigured={isSupabaseConfigured}
        isTableConfigured={isTableConfigured}
        onAddGift={handleAddGiftSubmit}
        onUpdateGift={handleUpdateGiftSubmit}
        onDeleteGift={handleDeleteGiftSubmit}
      />
    </AdminLayout>
  );
}
