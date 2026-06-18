import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminWallModeration from '../components/AdminWallModeration';
import { db } from '../lib/supabase';
import { WallPost, EventSettings } from '../types/database';

export default function AdminWallPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const allPosts = await db.getWallPosts(true); // Include unapproved
      const config = await db.getSettings();
      setPosts(allPosts);
      setSettings(config);
    } catch (err) {
      console.error('Error loading moderation wall data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdatePostStatus = async (id: string, is_approved: boolean) => {
    await db.updateWallPostStatus(id, is_approved);
    await loadData();
  };

  const handleDeletePost = async (id: string) => {
    await db.deleteWallPost(id);
    await loadData();
  };

  const handleUpdateCommentStatus = async (id: string, is_approved: boolean) => {
    await db.updateCommentStatus(id, is_approved);
    await loadData();
  };

  const handleDeleteComment = async (id: string) => {
    await db.deleteComment(id);
    await loadData();
  };

  const handleToggleWallRequiresApproval = async (checked: boolean) => {
    await db.updateSettings({ wall_requires_approval: checked });
    await loadData();
  };

  const handleRemovePostPhoto = async (id: string) => {
    await db.updateWallPost(id, { photo_url: '' });
    await loadData();
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'moderation') return;
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
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Carregando mensagens...</p>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="moderation" onTabChange={handleTabChange}>
      <AdminWallModeration
        posts={posts}
        settings={settings}
        onUpdatePostStatus={handleUpdatePostStatus}
        onDeletePost={handleDeletePost}
        onUpdateCommentStatus={handleUpdateCommentStatus}
        onDeleteComment={handleDeleteComment}
        onToggleWallRequiresApproval={handleToggleWallRequiresApproval}
        onRemovePostPhoto={handleRemovePostPhoto}
      />
    </AdminLayout>
  );
}
