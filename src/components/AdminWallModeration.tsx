import React, { useState } from 'react';
import { WallPost, EventSettings, WallComment } from '../types/database';
import { formatDate } from '../lib/utils';
import { AlertTriangle, Check, EyeOff, ShieldCheck, Trash2, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

interface AdminWallModerationProps {
  posts: WallPost[];
  settings: EventSettings;
  onUpdatePostStatus: (id: string, is_approved: boolean) => Promise<void>;
  onDeletePost: (id: string) => Promise<void>;
  onUpdateCommentStatus: (id: string, is_approved: boolean) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
  onToggleWallRequiresApproval: (checked: boolean) => Promise<void>;
  onRemovePostPhoto: (id: string) => Promise<void>;
}

export default function AdminWallModeration({
  posts,
  settings,
  onUpdatePostStatus,
  onDeletePost,
  onUpdateCommentStatus,
  onDeleteComment,
  onToggleWallRequiresApproval,
  onRemovePostPhoto
}: AdminWallModerationProps) {
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

  const handleToggleApprovalGate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onToggleWallRequiresApproval(e.target.checked);
  };

  const handleApprovePost = async (id: string) => {
    await onUpdatePostStatus(id, true);
  };

  const handleHidePost = async (id: string) => {
    await onUpdatePostStatus(id, false);
  };

  const handleDeletePost = (id: string, author: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Recado',
      message: `Tem certeza que deseja apagar o recado de "${author}"? Esta ação removerá o recado permanentemente.`,
      onConfirm: async () => {
        try {
          await onDeletePost(id);
        } catch (err) {
          console.error(err);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleApproveComment = async (id: string) => {
    await onUpdateCommentStatus(id, true);
  };

  const handleHideComment = async (id: string) => {
    await onUpdateCommentStatus(id, false);
  };

  const handleDeleteComment = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Comentário',
      message: 'Tem certeza que deseja apagar este comentário? Esta ação é permanente e irreversível.',
      onConfirm: async () => {
        try {
          await onDeleteComment(id);
        } catch (err) {
          console.error(err);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleRemovePhoto = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remover Foto do Post',
      message: 'Tem certeza de que deseja expurgar a foto anexada a este post, mantendo apenas o texto? Esta ação é irreversível.',
      onConfirm: async () => {
        try {
          await onRemovePostPhoto(id);
        } catch (err) {
          console.error(err);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };
  return (
    <div className="space-y-6 select-none bg-white p-6 rounded-3xl border border-sage-light/40 shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
      {/* Top Gatekeepers header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-800">Moderação de Mural & Parabéns</h2>
          <p className="text-xs text-gray-400 mt-1">Aprove ou censure mensagens, comente, delete abusos e determine se as mensagens requerem aprovação prévia.</p>
        </div>

        {/* Dynamic Gatekeeper toggle hook */}
        <div className="bg-sage-light/15 p-4 rounded-2xl border border-sage-light/40">
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-xs font-bold text-gray-600">Aprovação Prévia Ativa?</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.wall_requires_approval}
                onChange={handleToggleApprovalGate}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-305 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sage-green"></div>
            </div>
          </label>
          <span className="text-[9px] text-gray-400 font-medium block mt-1">
            {settings.wall_requires_approval 
              ? '🔒 Novas mensagens entram na fila ocultas.' 
              : '🔓 Novas mensagens entram públicas instantaneamente.'}
          </span>
        </div>
      </div>

      {/* List of Messages */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => {
            const hasUnapprovedComments = post.comments?.some(c => !c.is_approved);
            return (
              <div 
                key={post.id} 
                className={`p-6 rounded-2xl border transition-all ${
                  !post.is_approved 
                    ? 'bg-pink-soft/5 border-pink-soft/25' 
                    : 'bg-white border-sage-light/35 shadow-[0_2px_4px_rgba(0,0,0,0.01)]'
                }`}
              >
                {/* Message Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{post.author_name}</p>
                      <p className="text-[10px] text-gray-400">{post.created_at ? formatDate(post.created_at) : ''}</p>
                    </div>
                  </div>

                  {/* Status badge & post actions */}
                  <div className="flex items-center gap-2">
                    {!post.is_approved ? (
                      <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                        <AlertTriangle size={11} />
                        Pendente
                      </span>
                    ) : (
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck size={11} />
                        Visível
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      {!post.is_approved ? (
                        <button
                          onClick={() => handleApprovePost(post.id)}
                          className="p-1 px-3 bg-sage-green hover:bg-emerald-750 text-white rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center gap-0.5"
                        >
                          <Check size={11} /> Aprovar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleHidePost(post.id)}
                          className="p-1 px-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center gap-0.5"
                          title="Ocultar post"
                        >
                          <EyeOff size={11} /> Ocultar
                        </button>
                      )}

                      <button
                        onClick={() => handleDeletePost(post.id, post.author_name)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-all cursor-pointer"
                        title="Apagar recado"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message Content Body */}
                <div className="py-4 space-y-3 text-xs sm:text-sm font-medium text-gray-700">
                  <p className="italic leading-relaxed">"{post.message}"</p>

                  {/* Photo attachments */}
                  {post.photo_url && (
                    <div className="relative group max-w-xs mt-2 overflow-hidden rounded-xl border border-gray-100">
                      <img 
                        src={post.photo_url} 
                        alt="Anexada" 
                        className="max-h-36 object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(post.id)}
                        className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black/90 text-white p-1 rounded-full cursor-pointer transition-all text-[9px] font-bold flex items-center gap-0.5 pr-2"
                        title="Eliminar apenas a imagem"
                      >
                        <X size={11} /> Remover Foto
                      </button>
                    </div>
                  )}
                </div>

                {/* Comments listed internally */}
                {post.comments && post.comments.length > 0 && (
                  <div className="bg-sage-light/10 p-4 border border-sage-light/30 rounded-2xl space-y-2 mt-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8FA89B] block mb-2">Comentários:</span>

                    <div className="space-y-2.5">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex justify-between items-start gap-4 p-2.5 bg-white rounded-xl border border-gray-100 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-800">{comment.author_name}</span>
                              <span className="text-[9px] text-gray-400">{comment.created_at ? formatDate(comment.created_at) : ''}</span>
                              {!comment.is_approved && (
                                <span className="bg-amber-100 text-amber-800 text-[8px] font-bold uppercase rounded px-1">Pendente</span>
                              )}
                            </div>
                            <p className="text-gray-600 font-medium">{comment.comment}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!comment.is_approved ? (
                              <button
                                onClick={() => handleApproveComment(comment.id)}
                                className="p-0.5 px-2 bg-sage-green text-white text-[9px] font-bold rounded-full hover:bg-emerald-700 cursor-pointer"
                              >
                                Aprovar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleHideComment(comment.id)}
                                className="p-0.5 px-2 bg-gray-100 text-gray-600 text-[9px] font-bold rounded-full hover:bg-gray-200 cursor-pointer"
                                title="Ocultar comentário"
                              >
                                Ocultar
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded-full transition-colors cursor-pointer"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-xs text-gray-400 font-medium italic">
            Nenhuma mensagem postada no mural ainda. 🍂
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger={true}
      />
    </div>
  );
}
