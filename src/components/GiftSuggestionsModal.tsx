import React, { useEffect, useState } from 'react';
import { Gift, X, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { db } from '../lib/supabase';
import { GiftSuggestion, EventSettings } from '../types/database';
import { CuteFox, HandDrawnFlower, HandDrawnLeaf, HandDrawnSprout } from './WoodlandAnimals';

interface GiftSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EventSettings;
}

export default function GiftSuggestionsModal({ isOpen, onClose, settings }: GiftSuggestionsModalProps) {
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchSuggestions = async () => {
        try {
          const data = await db.getGiftSuggestions();
          setSuggestions(data);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchSuggestions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const btnBg = settings.button_color || '#E66C86';
  const secBg = settings.secondary_color || '#8FA89B';
  const textColor = settings.text_color || '#4A3B32';

  // Group suggestions by category
  const categories: Record<string, GiftSuggestion[]> = {};
  suggestions.forEach((item) => {
    const cat = item.category || 'Mimos Gerais';
    const catLower = cat.toLowerCase().trim();
    if (!categories[catLower]) {
      categories[catLower] = [];
    }
    categories[catLower].push(item);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-[#FAF1EE] animate-fade-in"
        id="gifts-modal-container"
      >
        {/* Top Header Panel */}
        <div 
          className="p-5 flex justify-between items-center text-white shrink-0 relative overflow-hidden" 
          style={{ backgroundColor: secBg }}
        >
          {/* Subtle background decoration */}
          <div className="absolute right-3 top-1 opacity-10">
            <CuteFox size={100} />
          </div>

          <div className="flex items-center gap-2.5 relative z-10">
            <Gift size={22} className="brightness-200 animate-bounce" />
            <div>
              <h3 className="font-bold text-base font-serif">Sugestões de Presentes</h3>
              <p className="text-[10px] text-white/85 font-medium">Mimos fofos para o nosso grande dia</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer relative z-10"
            aria-label="Fecar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-[#FAF6F0]/20">
          
          {/* Top Explanatory Banner */}
          <div className="p-4 bg-pink-soft/5 border border-pink-soft/25 rounded-2xl flex gap-3 items-start">
            <HandDrawnFlower size={20} className="mt-0.5 shrink-0" />
            <div className="text-[11px] leading-relaxed" style={{ color: textColor }}>
              <span className="font-bold block mb-0.5" style={{ color: settings.button_color || '#E05A77' }}>
                Querido convidado,
              </span>
              Preparamos este cantinho com algumas sugestões simples de lembrancinhas e mimos, pensadas com muito carinho para facilitar a escolha de quem deseja nos presentear. Sinta-se plenamente à vontade para escolher! 🌸✨
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-4 border-[#E66C86] border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Carregando sugestões...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(categories).map((catName) => (
                <div key={catName} className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 border-b border-dashed border-gray-100 pb-1.5">
                    <HandDrawnLeaf size={16} fill={secBg} />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-sans">
                      {catName}
                    </h4>
                  </div>

                  {/* Category items list */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {categories[catName].map((item) => (
                      <div 
                        key={item.id} 
                        className="p-3.5 bg-white border border-gray-100/85 rounded-2xl flex items-center justify-between shadow-xs hover:border-pink-soft/30 hover:shadow-sm transition-all"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-[#E66C86]/85 tracking-wider font-sans">Sugestão:</span>
                          <p className="text-xs font-bold text-slate-800 leading-snug">{item.name}</p>
                          {item.description && (
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-[9px] font-semibold text-gray-400">Descrição:</span>
                              <span className="text-[10px] font-medium text-gray-500 italic">{item.description}</span>
                            </div>
                          )}
                        </div>

                        {/* Hand-drawn element indicating checked or suggestion */}
                        <div className="w-8 h-8 rounded-full bg-sage-light/10 flex items-center justify-center text-sage-green shrink-0">
                          <HandDrawnSprout size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {suggestions.length === 0 && (
                <div className="py-10 text-center space-y-2">
                  <AlertCircle size={24} className="mx-auto text-gray-300" />
                  <p className="text-xs text-gray-400 font-medium font-sans">
                    Nenhuma sugestão cadastrada no momento. 🍃
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer info panel */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0 flex items-center justify-center gap-1.5 select-none">
          <Heart size={10} className="fill-red-400 text-red-400" />
          <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest font-sans">
            Com muito amor, mamãe e papai
          </span>
        </div>
      </div>
    </div>
  );
}
