import React, { useState, useEffect } from 'react';
import { GalleryPhoto, EventSettings } from '../types/database';
import { db } from '../lib/supabase';
import { Camera, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { motion } from 'motion/react';

interface PhotoGalleryProps {
  settings: EventSettings;
}

export default function PhotoGallery({ settings }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const activePhotos = await db.getGalleryPhotos(true);
        setPhotos(activePhotos);
      } catch (err) {
        console.error('Error loading gallery photos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPhotos();
  }, []);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm opacity-60">
        Carregando galeria do bosque... ✨
      </div>
    );
  }

  if (photos.length === 0) {
    return null; // Don't show if empty
  }

  const textColor = settings.text_color || '#4A3B32';

  return (
    <div className="py-8 select-none" id="gallery-section">
      {/* Section Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 p-1 px-3 bg-[#8FA89B]/10 rounded-full text-xs font-bold uppercase tracking-wider mb-1" style={{ color: settings.secondary_color || '#8FA89B' }}>
          <Camera size={14} />
          <span>Galeria de Fotos</span>
        </div>
        <h3 className="text-2xl font-black" style={{ color: settings.button_color || '#E66C86' }}>
          Meus Momentos Doces
        </h3>
        <p className="text-xs italic max-w-xs mx-auto" style={{ color: textColor }}>
          Acompanhe um pouquinho da minha caminhada cheia de sorrisos!
        </p>
      </div>

      {/* Grid of Polaroid frames */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 justify-items-center">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => handleOpenLightbox(index)}
            className="w-full max-w-[280px] bg-white p-3 pb-5 rounded-md shadow-md rotate-[-1deg] hover:rotate-[1deg] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#E66C86]/5 group"
          >
            {/* Image display */}
            <div className="relative aspect-square overflow-hidden rounded bg-amber-50/20">
              <img
                src={photo.photo_url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1" style={{ color: textColor }}>
                  <Eye size={12} /> Espiar
                </span>
              </div>
            </div>

            {/* Polaroid styled caption bottom */}
            <div className="mt-3 text-center">
              <h4 className="text-xs font-bold line-clamp-1 italic text-amber-950 uppercase tracking-wide">
                🌸 {photo.title || 'Bosque Mágico'}
              </h4>
              {photo.description && (
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {photo.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX SLIDER MODAL */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between items-center p-4 animate-fade-in"
          onClick={handleCloseLightbox}
        >
          {/* Top panel */}
          <div className="w-full max-w-3xl flex justify-between items-center text-white/80 py-2">
            <span className="text-xs font-bold tracking-wider">
              REVER MOMENTO ({lightboxIndex + 1} de {photos.length})
            </span>
            <button 
              onClick={handleCloseLightbox}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Core Slider */}
          <div className="flex-1 w-full max-w-4xl flex items-center justify-between gap-2">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all shrink-0 hover:scale-105"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Active Photograph */}
            <div 
              className="max-h-[70vh] max-w-[80vw] flex flex-col justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[lightboxIndex].photo_url}
                alt={photos[lightboxIndex].title}
                className="max-h-[60vh] max-w-full rounded-2xl object-contain border-4 border-white/95 shadow-2xl"
                referrerPolicy="no-referrer"
              />
              
              <div className="text-center mt-4 text-white max-w-md">
                <h3 className="font-extrabold text-base sm:text-lg">
                  ✨ {photos[lightboxIndex].title} ✨
                </h3>
                {photos[lightboxIndex].description && (
                  <p className="text-xs text-white/70 mt-1">
                    {photos[lightboxIndex].description}
                  </p>
                )}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all shrink-0 hover:scale-105"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom spacer */}
          <div className="py-2 text-[10px] text-white/40 tracking-widest">
            CLIQUE FORA PARA FECHAR
          </div>
        </div>
      )}
    </div>
  );
}
