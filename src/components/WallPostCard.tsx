import React, { useState } from 'react';
import { WallPost, EventSettings, WallComment } from '../types/database';
import { db } from '../lib/supabase';
import { formatDate, getWoodlandAvatar } from '../lib/utils';
import { Heart, Landmark, MessageSquare, Send, Sparkles, Smile, MessageCircle } from 'lucide-react';
import { WoodlandAvatar } from './WoodlandAnimals';

interface WallPostCardProps {
  key?: string;
  post: WallPost;
  settings: EventSettings;
  visitorToken: string;
  onPostUpdated: () => void;
}

export default function WallPostCard({ post, settings, visitorToken, onPostUpdated }: WallPostCardProps) {
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Reaction counters
  const heartCount = post.reactions?.heart || 0;
  const flowerCount = post.reactions?.flower || 0;
  const starCount = post.reactions?.star || 0;
  const careCount = post.reactions?.care || 0;

  const handleReact = async (reactionType: 'heart' | 'flower' | 'star' | 'care') => {
    try {
      await db.addReaction(post.id, reactionType, visitorToken);
      onPostUpdated();
    } catch (err) {
      console.error('Error reacting:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const requiresApproval = settings.wall_requires_approval;
      
      await db.createComment({
        post_id: post.id,
        author_name: commentName.trim(),
        comment: commentText.trim(),
        is_approved: !requiresApproval // Approved instantly if require_approval is false
      });

      setCommentText('');
      setCommentName('');
      onPostUpdated();

      if (requiresApproval) {
        alert('Seu comentário foi registrado e aparecerá assim que for aprovado pela ADM! 😉');
      } else {
        setShowComments(true);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Não foi possível registrar seu comentário.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const textColor = settings.text_color || '#4A3B32';
  const buttonColor = settings.button_color || '#E66C86';
  const avatarEmoji = getWoodlandAvatar(post.author_name);

  // Group approved comments
  const displayComments = post.comments?.filter(c => c.is_approved) || [];

  return (
    <div className="bg-white rounded-2xl border border-[#FAEFEC] shadow-xs p-4 sm:p-5 hover:shadow-md transition-all duration-300 flex gap-3 sm:gap-4 max-w-xl mx-auto text-left">
      {/* Participant Avatar */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#8FA89B]/10 bg-[#FAF6F0] flex items-center justify-center shrink-0 select-none overflow-hidden">
        <WoodlandAvatar type={avatarEmoji} size={44} />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Author details */}
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-xs sm:text-sm text-amber-950 truncate max-w-[160px] sm:max-w-[240px]">
            {post.author_name}
          </h4>
          <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium whitespace-nowrap">
            {post.created_at ? formatDate(post.created_at) : 'Agora'}
          </span>
        </div>

        {/* Post Message */}
        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium" style={{ color: '#' + textColor }}>
          {post.message}
        </p>

        {/* Post Photo Attachment */}
        {post.photo_url && (
          <div className="rounded-xl overflow-hidden bg-amber-50/10 border border-gray-100 max-h-56 mt-2 select-none">
            <img
              src={post.photo_url}
              alt="Anexo do Convidado"
              className="w-full h-auto max-h-56 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* SOCIAL INTERACTIONS BUTTONS PANEL */}
        <div className="border-t border-gray-100 pt-3 flex flex-wrap items-center justify-between gap-2.5 select-none text-[10px] sm:text-xs font-bold text-gray-500">
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Heart Reaction */}
            <button
              onClick={() => handleReact('heart')}
              className="px-2 py-1 bg-rose-50/70 hover:bg-rose-100/80 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <span className="text-sm">❤️</span>
              <span className="text-rose-900">{heartCount}</span>
            </button>

            {/* Flower Reaction */}
            <button
              onClick={() => handleReact('flower')}
              className="px-2 py-1 bg-emerald-50/70 hover:bg-emerald-100/80 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <span className="text-sm">🌸</span>
              <span className="text-emerald-900">{flowerCount}</span>
            </button>

            {/* Star Reaction */}
            <button
              onClick={() => handleReact('star')}
              className="px-2 py-1 bg-amber-50/70 hover:bg-amber-100/80 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <span className="text-sm">⭐</span>
              <span className="text-amber-900">{starCount}</span>
            </button>

            {/* Care Reaction */}
            <button
              onClick={() => handleReact('care')}
              className="px-2 py-1 bg-purple-50/70 hover:bg-purple-100/80 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <span className="text-sm">🤗</span>
              <span className="text-purple-900">{careCount}</span>
            </button>
          </div>

          {/* Comment/Replies count Toggle */}
          {settings.enable_comments && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-gray-400 hover:text-emerald-800 cursor-pointer transition-colors"
            >
              <MessageCircle size={15} />
              <span>{displayComments.length} Comentários</span>
            </button>
          )}
        </div>

        {/* COMMENTS/REPLIES REVEAL & COMPOSER CONTAINER */}
        {settings.enable_comments && showComments && (
          <div className="mt-4 pt-3 border-t border-dashed border-gray-100 space-y-3 animate-in slide-in-from-top-2 duration-150">
            {/* List and Display comments */}
            {displayComments.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {displayComments.map((comment) => (
                  <div key={comment.id} className="p-2 sm:p-2.5 rounded-xl bg-[#FAF6F0]/60 border border-[#FAF6F0] text-[11px] sm:text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-extrabold text-[#4A3B32]">{comment.author_name}</span>
                      <span className="text-[9px] text-gray-400">{comment.created_at ? formatDate(comment.created_at) : ''}</span>
                    </div>
                    <p className="font-medium text-gray-700 leading-relaxed">{comment.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Composer */}
            <form onSubmit={handleAddComment} className="flex flex-col gap-1.5 bg-gray-50/70 rounded-2xl p-2.5">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-1/3 px-2 py-1 rounded bg-white text-xs border border-gray-100 focus:outline-none focus:border-[#E18D9D]"
                />
                <input
                  type="text"
                  required
                  placeholder="Escreva um comentário..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-2/3 px-2.5 py-1 rounded bg-white text-xs border border-gray-100 focus:outline-none focus:border-[#E18D9D]"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentName.trim() || !commentText.trim()}
                  className="px-2 py-1 text-white text-[10px] uppercase font-bold rounded cursor-pointer disabled:opacity-40"
                  style={{ backgroundColor: buttonColor }}
                >
                  <Send size={10} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
