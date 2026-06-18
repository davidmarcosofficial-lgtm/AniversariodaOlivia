import React, { useState, useRef } from 'react';
import { EventSettings } from '../types/database';
import { db } from '../lib/supabase';
import { Image, MessageSquareCode, Plus, Send, Smile, Sparkle, X } from 'lucide-react';

interface WallComposerProps {
  settings: EventSettings;
  onPostCreated: () => void;
}

export default function WallComposer({ settings, onPostCreated }: WallComposerProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setSuccessMsg(null);

    try {
      let uploadedUrl = '';
      if (photoFile && settings.enable_photo_upload) {
        uploadedUrl = await db.uploadImage('wall-uploads', photoFile);
      }

      const approvalRequired = settings.wall_requires_approval;
      
      await db.createWallPost({
        author_name: name.trim(),
        message: message.trim(),
        photo_url: uploadedUrl || undefined,
        is_approved: !approvalRequired // If approval required is false, it is approved immediately
      });

      // Reset state
      setName('');
      setMessage('');
      setPhotoFile(null);
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (approvalRequired) {
        setSuccessMsg('Sua mensagem de carinho foi enviada e está na fila de moderação dos papais! 🥰');
      } else {
        setSuccessMsg('Sua mensagem de parabéns já está no mural! Muito obrigado pelo carinho! 💌🌿');
      }

      onPostCreated();
      
      // Auto-clear message
      setTimeout(() => {
        setSuccessMsg(null);
      }, 7000);

    } catch (err) {
      console.error('Error sending wall post:', err);
      alert('Não foi possível enviar sua mensagem. Recarregue a página e tente de novo.');
    } finally {
      setSubmitting(false);
    }
  };

  const textColor = settings.text_color || '#4A3B32';
  const buttonColor = settings.button_color || '#E66C86';

  return (
    <div className="bg-white/80 backdrop-blur-xs p-5 rounded-3xl border border-[#8FA89B]/30 shadow-xs max-w-xl mx-auto mb-8 select-none">
      <div className="flex items-center gap-2 mb-3 text-sm font-extrabold text-emerald-800 uppercase tracking-widest">
        <MessageSquareCode size={18} className="text-[#8FA89B]" />
        <span>Escrever no Mural</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Guest Name input */}
          <div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome (ex: Titia Joana) *"
              className="w-full px-4 py-2 text-xs border rounded-xl border-gray-200 focus:outline-none focus:border-[#E66C86] font-medium"
            />
          </div>

          {/* Photo attachment (conditional) */}
          {settings.enable_photo_upload && (
            <div className="flex items-center gap-1.5 justify-end">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {!photoPreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 border border-dashed rounded-xl border-gray-300 text-[10px] sm:text-xs font-bold text-gray-400 hover:text-emerald-700 hover:border-emerald-700 cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Image size={14} /> Anexar Foto
                </button>
              ) : (
                <div className="relative inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 p-1 px-2.5 rounded-lg text-xs font-bold">
                  <span className="truncate max-w-[80px]">Foto...</span>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-0.5 rounded-full hover:bg-emerald-200 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Input box */}
        <div>
          <textarea
            required
            rows={2.5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Escreva uma mensagem de carinho, parabéns ou votos doces para a ${settings.birthday_name || 'aniversariante'}... ♥ *`}
            className="w-full p-3 text-xs sm:text-sm border rounded-2xl border-gray-200 focus:outline-none focus:border-[#E66C86] font-medium placeholder-gray-400"
          />
        </div>

        {/* Photo Preview display (embedded) */}
        {photoPreview && (
          <div className="relative inline-block rounded-xl overflow-hidden border border-gray-100 shadow-xs max-h-32 mb-1">
            <img
              src={photoPreview}
              alt="Anexar visual"
              className="h-28 object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-black/80 cursor-pointer text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Action sending panel */}
        <div className="flex justify-between items-center pt-1">
          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-0.5">
            <Sparkle size={10} className="text-amber-400 animate-spin" />
            Campos com * são obrigatórios!
          </span>
          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="px-5 py-2 rounded-xl text-white font-bold text-xs select-none shadow hover:brightness-105 active:scale-97 cursor-pointer disabled:opacity-40 flex items-center gap-1.5 transition-all"
            style={{ backgroundColor: buttonColor }}
          >
            {submitting ? 'Enviando...' : (
              <>
                <span>Enviar Recado</span>
                <Send size={12} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success notification alert */}
      {successMsg && (
        <div className="mt-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-850 font-bold text-center leading-relaxed animate-in slide-in-from-bottom-2 duration-155">
          {successMsg}
        </div>
      )}
    </div>
  );
}
