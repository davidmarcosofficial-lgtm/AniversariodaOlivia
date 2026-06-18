import { useEffect, useState } from 'react';
import InviteHero from '../components/InviteHero';
import ActionButtons from '../components/ActionButtons';
import RSVPForm from '../components/RSVPForm';
import PhotoGallery from '../components/PhotoGallery';
import WallComposer from '../components/WallComposer';
import WallPostCard from '../components/WallPostCard';
import GiftSuggestionsModal from '../components/GiftSuggestionsModal';
import { db } from '../lib/supabase';
import { EventSettings, WallPost } from '../types/database';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CuteRabbit, HandDrawnFlower, HandDrawnLeaf } from '../components/WoodlandAnimals';

export default function GuestHome() {
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isGiftsOpen, setIsGiftsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Create a stable local visitor token to prevent duplicate likes
  const [visitorToken, setVisitorToken] = useState('');

  useEffect(() => {
    let token = localStorage.getItem('bosque_visitor_token');
    if (!token) {
      token = 'visitor_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('bosque_visitor_token', token);
    }
    setVisitorToken(token);
  }, []);

  const loadData = async () => {
    try {
      const activeSettings = await db.getSettings();
      setSettings(activeSettings);

      if (activeSettings?.enable_wall) {
        const approvedPosts = await db.getWallPosts(false); // Only approved
        setPosts(approvedPosts);
      }
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center gap-3">
        <CuteRabbit size={80} className="animate-bounce" />
        <div className="w-8 h-8 border-4 border-[#E8C5C8] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-sage-green tracking-widest uppercase mt-2">Abrindo Bosque Encantado...</p>
      </div>
    );
  }

  // Dynamic Styles from loaded administrative settings
  const primaryBg = settings.primary_color || '#F4D9E1';
  const customBg = settings.background_color || '#FAF6F0';
  const textColor = settings.text_color || '#4A3B32';

  return (
    <div 
      className="min-h-screen font-sans transition-colors duration-300 pb-16 flex flex-col items-center px-4 md:px-0"
      style={{ backgroundColor: customBg }}
    >
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-b-[40px] border-x border-b border-[#FAF0EE] overflow-hidden">
        
        {/* Animated Woodland garlands header panel */}
        <div className="h-2 w-full flex" style={{ background: `linear-gradient(90deg, ${primaryBg} 0%, ${settings.secondary_color || '#8FA89B'} 50%, ${settings.button_color || '#E66C86'} 100%)` }} />

        {/* 1. HERO HEADER AREA */}
        <div className="p-4 sm:p-6 md:p-8">
          <InviteHero settings={settings} />

          {/* 2. CIRCULAR ACTION KEYS */}
          <ActionButtons 
            settings={settings}
            onOpenRsvp={() => setIsRsvpOpen(true)}
            onScrollToWall={() => scrollToSection('wall-anchor')}
            onOpenGifts={() => setIsGiftsOpen(true)}
          />
        </div>

        {/* 3. PHOTO GALLERY SLIDER */}
        <div className="px-4 sm:px-6 md:px-8 border-t border-dashed border-gray-100">
          <PhotoGallery settings={settings} />
        </div>

        {/* 4. MURAL SOCIAL WALL (Conditional checking) */}
        {settings.enable_wall && (
          <div 
            id="wall-anchor"
            className="px-4 sm:px-6 md:px-8 py-8 border-t border-dashed border-gray-100 bg-[#FAF6F0]/25 select-none text-center space-y-6"
          >
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 p-1 px-3 bg-rose-50 rounded-full text-xs font-bold uppercase tracking-wider mb-1" style={{ color: settings.button_color || '#E66C86' }}>
                <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
                <span>Mural de Recados</span>
              </div>
              <h3 className="text-2xl font-black text-amber-950">
                Deixe seu Carinho ♥
              </h3>
              <p className="text-xs italic max-w-xs mx-auto text-gray-500 leading-relaxed">
                Envie uma mensagem fofa para a aniversariante ou registre seus parabéns!
              </p>
            </div>

            {/* Composer */}
            <WallComposer settings={settings} onPostCreated={loadData} />

            {/* Posts feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <WallPostCard
                  key={post.id}
                  post={post}
                  settings={settings}
                  visitorToken={visitorToken}
                  onPostUpdated={loadData}
                />
              ))}

              {posts.length === 0 && (
                <div className="py-6 text-center text-xs text-gray-400 font-medium font-sans">
                  Seja o primeiro a deixar uma mensagem de carinho no bosque de {settings.birthday_name ? settings.birthday_name.split(' ')[0] : 'Melissa'}! ✨✉️
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. SEAMLESS SOCIAL FOOTER */}
        <footer className="py-10 bg-gray-50 border-t border-gray-100 text-center select-none space-y-3">
          <div className="flex justify-center items-center gap-2 text-rose-500">
            <Heart size={16} className="fill-rose-500 animate-pulse" />
            <span className="text-xs font-extrabold tracking-widest text-[#4A3B32] uppercase">{settings.birthday_name || 'Melissa'} faz {settings.birthday_age || '1 Aninho'}</span>
            <Heart size={16} className="fill-rose-500 animate-pulse" />
          </div>
          <div className="flex justify-center items-center gap-2 max-w-xs sm:max-w-sm md:max-w-md mx-auto px-4">
            <HandDrawnLeaf size={16} className="shrink-0" />
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium leading-relaxed italic">
              "O bosque está em festa, florescendo de amor e gratidão pela sua preciosa companhia nessa data tão mágica!"
            </p>
            <HandDrawnLeaf size={16} className="shrink-0 scale-x-[-1]" />
          </div>
        </footer>

      </div>

      {/* FLOATING ADMIN LINK KEY */}
      <div className="mt-8 select-none">
        <a 
          href="/admin" 
          className="text-[10px] text-gray-400 hover:text-sage-green font-bold transition-colors uppercase tracking-widest"
        >
          🔐 Área Administrativa dos Pais
        </a>
      </div>

      {/* RSVP POP-UP CONTROL MODAL */}
      {isRsvpOpen && (
        <RSVPForm
          settings={settings}
          onClose={() => setIsRsvpOpen(false)}
          onSuccessCreated={loadData}
        />
      )}

      {/* GIFT SUGGESTIONS MODAL */}
      <GiftSuggestionsModal
        isOpen={isGiftsOpen}
        onClose={() => setIsGiftsOpen(false)}
        settings={settings}
      />
    </div>
  );
}
