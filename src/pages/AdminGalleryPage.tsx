import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminGalleryManager from '../components/AdminGalleryManager';
import { db } from '../lib/supabase';
import { GalleryPhoto } from '../types/database';

export default function AdminGalleryPage() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const data = await db.getGalleryPhotos(false); // Include inactive photos as well so admin can manage them
      setPhotos(data);
    } catch (err) {
      console.error('Error loading gallery photos in page:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleAddPhoto = async (newPhoto: Omit<GalleryPhoto, 'id'>) => {
    await db.addGalleryPhoto(newPhoto);
    await fetchPhotos();
  };

  const handleUpdatePhoto = async (id: string, updated: Partial<GalleryPhoto>) => {
    await db.updateGalleryPhoto(id, updated);
    await fetchPhotos();
  };

  const handleDeletePhoto = async (id: string) => {
    await db.deleteGalleryPhoto(id);
    await fetchPhotos();
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'gallery') return;
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
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Carregando álbum de fotos...</p>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="gallery" onTabChange={handleTabChange}>
      <AdminGalleryManager
        photos={photos}
        onAddPhoto={handleAddPhoto}
        onUpdatePhoto={handleUpdatePhoto}
        onDeletePhoto={handleDeletePhoto}
      />
    </AdminLayout>
  );
}
