import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-fade-in">
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col p-6 animate-scale-up"
        id="custom-confirm-modal"
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2.5 rounded-full ${isDanger ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
            <AlertTriangle size={20} className={isDanger ? 'animate-pulse' : ''} />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm leading-tight">
            {title}
          </h3>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
          {message}
        </p>

        {/* Actions buttons */}
        <div className="flex justify-end gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-100 hover:bg-gray-50 rounded-xl text-slate-500 cursor-pointer transition-all active:scale-95"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`px-4 py-2 text-white rounded-xl cursor-pointer transition-all active:scale-95 ${
              isDanger ? 'bg-red-500 hover:bg-red-650 shadow-[0_4px_12px_rgba(239,68,68,0.15)](s)' : 'bg-amber-500 hover:bg-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.15)]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
