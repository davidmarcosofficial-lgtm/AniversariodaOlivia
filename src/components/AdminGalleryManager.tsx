import React, { useState, useRef } from 'react';
import { GalleryPhoto } from '../types/database';
import { db } from '../lib/supabase';
import { AreaChart, Camera, Check, Edit2, Image, Plus, Save, Trash2, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

interface AdminGalleryManagerProps {
  photos: GalleryPhoto[];
  onAddPhoto: (photo: Omit<GalleryPhoto, 'id'>) => Promise<void>;
  onUpdatePhoto: (id: string, updated: Partial<GalleryPhoto>) => Promise<void>;
  onDeletePhoto: (id: string) => Promise<void>;
}

export default function AdminGalleryManager({ photos, onAddPhoto, onUpdatePhoto, onDeletePhoto }: AdminGalleryManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Custom Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  
  // File upload state representation
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileToUpload(file);
      setUploadPreview(URL.createObjectURL(file));
      // Prefill title with filename minus ext
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      if (!title) setTitle(nameWithoutExt);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setSortOrder(photos.length + 1);
    setIsActive(true);
    setPhotoUrl('');
    setFileToUpload(null);
    setUploadPreview(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (p: GalleryPhoto) => {
    setEditingId(p.id);
    setTitle(p.title || '');
    setDescription(p.description || '');
    setSortOrder(p.sort_order || 1);
    setIsActive(p.is_active);
    setPhotoUrl(p.photo_url || '');
    setFileToUpload(null);
    setUploadPreview(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalUrl = photoUrl;

      // Execute actual file upload
      if (fileToUpload) {
        finalUrl = await db.uploadImage('birthday-gallery', fileToUpload);
      }

      if (!finalUrl) {
        alert('Por favor anexar uma imagem!');
        setUploading(false);
        return;
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        sort_order: parseInt(sortOrder.toString()) || 1,
        is_active: isActive,
        photo_url: finalUrl
      };

      if (editingId) {
        await onUpdatePhoto(editingId, payload);
      } else {
        await onAddPhoto(payload);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao gravar foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remover Foto',
      message: `Tem certeza que deseja demover a foto "${name}" do álbum? Esta ação é irreversível.`,
      onConfirm: async () => {
        try {
          await onDeletePhoto(id);
        } catch (err) {
          console.error(err);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleToggleActive = async (p: GalleryPhoto) => {
    await onUpdatePhoto(p.id, { is_active: !p.is_active });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-3xl border border-sage-light/40 shadow-[0_4px_6px_rgba(0,0,0,0.02)] select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-800 flex items-center gap-2">
            <Camera size={18} className="text-sage-green" />
            <span>Gerenciar Álbum de Fotos</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Carregue ou organize fotografias que os convidados poderão visualizar no convite digital público.</p>
        </div>

        <button
          onClick={handleOpenCreateForm}
          className="flex items-center gap-1.5 px-4.5 py-2 bg-pink-soft hover:bg-pink-dark text-white text-xs font-bold rounded-full cursor-pointer transition-all active:scale-97 shadow-xs font-sans"
        >
          <Plus size={14} />
          <span>Nova Foto</span>
        </button>
      </div>

      {/* Grid of gallery pictures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {photos.map((photo) => (
          <div key={photo.id} className="border border-sage-light/35 rounded-2xl overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow flex flex-col justify-between bg-white">
            {/* Image Preview */}
            <div className="relative aspect-video bg-gray-50 flex items-center justify-center">
              <img
                src={photo.photo_url}
                alt={photo.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Active Toggle ribbon */}
              <div className="absolute top-2.5 left-2.5">
                <button
                  type="button"
                  onClick={() => handleToggleActive(photo)}
                  className={`px-3 py-1 text-[9px] font-bold rounded-full cursor-pointer transition-all ${photo.is_active ? 'bg-sage-green text-white shadow-xs' : 'bg-gray-300 text-gray-700'}`}
                >
                  {photo.is_active ? 'Publicada' : 'Pausada'}
                </button>
              </div>
              <div className="absolute top-2.5 right-2 px-2 py-1 bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white rounded-lg select-none">
                Nº {photo.sort_order}
              </div>
            </div>

            {/* Photo description info */}
            <div className="p-4 space-y-1 text-left flex-1">
              <h4 className="text-xs font-bold text-slate-800 truncate">{photo.title || 'Foto do Álbum'}</h4>
              <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed" title={photo.description}>
                {photo.description || 'Nenhuma descrição fornecida.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="bg-gray-50/70 p-3 flex justify-end gap-1.5 border-t border-gray-100">
              <button
                onClick={() => handleOpenEditForm(photo)}
                className="p-1 px-3 bg-white border border-gray-200 hover:border-pink-soft hover:text-pink-dark rounded-full text-[10px] font-bold cursor-pointer flex items-center gap-0.5 transition-all text-gray-600"
              >
                <Edit2 size={10} /> Editar
              </button>
              <button
                onClick={() => handleDelete(photo.id, photo.title)}
                className="p-1 px-3 bg-red-50 text-red-650 hover:bg-red-100 rounded-full text-[10px] font-bold cursor-pointer flex items-center gap-0.5 transition-all"
              >
                <Trash2 size={10} /> Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE/EDIT ALONG INPUTS MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-dashed border-[#8FA89B]"
          >
            {/* Header */}
            <div className="bg-[#FAF6F0] p-4 flex justify-between items-center border-b">
              <h3 className="font-extrabold text-amber-955 text-sm">
                {editingId ? 'Editar Detalhes da Foto' : 'Adicionar Nova Foto ao álbum'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Inputs Body */}
            <div className="p-5 space-y-4 text-left max-h-[70vh] overflow-y-auto">
              {/* Visual uploader picker */}
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Upload de Imagem *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {!uploadPreview && !photoUrl ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-gray-300 hover:border-emerald-700 hover:bg-emerald-50/10 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer text-gray-400 hover:text-emerald-800 transition-colors"
                  >
                    <Image size={24} />
                    <span className="text-[11px] font-bold">Clique para selecionar imagem</span>
                  </button>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center aspect-video mb-1 group">
                    <img
                      src={uploadPreview || photoUrl}
                      alt="Preview"
                      className="max-h-36 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFileToUpload(null);
                        setUploadPreview(null);
                        setPhotoUrl('');
                      }}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {/* Fallback Manual URL Input */}
                <div className="mt-2.5">
                  <span className="text-[10px] font-bold text-gray-400 block mb-1">Ou cole uma URL direta da internet:</span>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://exemplo.com/bebe.jpg"
                    className="w-full px-3 py-1 border rounded-lg text-[10px] focus:outline-none"
                  />
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Título da Imagem *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex. 6 meses de pura gostosura"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:border-[#E18D9D]"
                />
              </div>

              {/* Description inputs */}
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Breve Comentário / Descrição</label>
                <textarea
                  rows={2}
                  value={description}
                  placeholder="Ex. Nesse dia fomos passear no parque das borboletas..."
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:border-[#E18D9D] resize-none"
                />
              </div>

              {/* Sort numbering and active checkpoint */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Ordem de Exibição *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:border-[#E18D9D]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs font-bold text-gray-600 cursor-pointer">Disponível no Convite</label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3.5 flex justify-end gap-2 border-t">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-gray-100 cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2 bg-[#E66C86] text-white text-xs font-bold rounded-xl cursor-pointer hover:brightness-105 disabled:opacity-50"
              >
                {uploading ? 'Aguarde...' : 'Salvar Foto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        confirmText="Remover"
        cancelText="Cancelar"
        isDanger={true}
      />
    </div>
  );
}
