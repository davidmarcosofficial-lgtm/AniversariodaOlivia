import React, { useState } from 'react';
import { RSVP, AttendanceStatus, EventSettings } from '../types/database';
import { exportToPdf } from '../lib/exportPdf';
import { exportToExcel } from '../lib/exportExcel';
import { Edit2, FileSpreadsheet, FileText, Plus, Search, Trash2, X, Eye } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

interface AdminRSVPTableProps {
  rsvps: RSVP[];
  settings: EventSettings;
  onAddRsvp: (newRsvp: Omit<RSVP, 'id'>) => Promise<void>;
  onUpdateRsvp: (id: string, updated: Partial<RSVP>) => Promise<void>;
  onDeleteRsvp: (id: string) => Promise<void>;
}

export default function AdminRSVPTable({ rsvps, settings, onAddRsvp, onUpdateRsvp, onDeleteRsvp }: AdminRSVPTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modal Form Inputs state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<AttendanceStatus>('confirmed');
  const [formHasCompanions, setFormHasCompanions] = useState(false);
  const [formCompanionsCount, setFormCompanionsCount] = useState(0);
  const [formCompanionsNames, setFormCompanionsNames] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState('');

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

  // Handle companion count change
  const handleCompanionsCountChange = (count: number) => {
    setFormCompanionsCount(count);
    const updated = [...formCompanionsNames];
    if (count > updated.length) {
      while (updated.length < count) {
        updated.push('');
      }
    } else {
      updated.splice(count);
    }
    setFormCompanionsNames(updated);
  };

  const handleCompanionNameChange = (index: number, value: string) => {
    const updated = [...formCompanionsNames];
    updated[index] = value;
    setFormCompanionsNames(updated);
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormName('');
    setFormPhone('');
    setFormStatus('confirmed');
    setFormHasCompanions(false);
    setFormCompanionsCount(0);
    setFormCompanionsNames([]);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (r: RSVP) => {
    setEditingId(r.id);
    setFormName(r.guest_name);
    setFormPhone(r.phone || '');
    setFormStatus(r.attendance_status);
    setFormHasCompanions(r.has_companions);
    setFormCompanionsCount(r.companions_count || 0);
    setFormCompanionsNames(r.companions_names || []);
    setFormNotes(r.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Informe o nome do convidado!');
      return;
    }

    const payload = {
      guest_name: formName.trim(),
      phone: formPhone.trim(),
      attendance_status: formStatus,
      has_companions: formStatus === 'confirmed' && formHasCompanions,
      companions_count: formStatus === 'confirmed' ? formCompanionsCount : 0,
      companions_names: (formStatus === 'confirmed' && formHasCompanions) ? formCompanionsNames.filter(n => n.trim() !== '') : [],
      notes: formNotes.trim()
    };

    try {
      if (editingId) {
        await onUpdateRsvp(editingId, payload);
      } else {
        await onAddRsvp(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao gravar RSVP.');
    }
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Convidado',
      message: `Tem certeza que deseja remover o convidado "${name}" de forma definitiva? Esta ação é irreversível.`,
      onConfirm: async () => {
        try {
          await onDeleteRsvp(id);
        } catch (err) {
          console.error(err);
          alert('Erro ao excluir RSVP.');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Filter and search computation
  const filtered = rsvps.filter(r => {
    const matchesSearch = r.guest_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'all' || r.attendance_status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const grandTotalAllConfirmed = rsvps
    .filter(r => r.attendance_status === 'confirmed')
    .reduce((acc, r) => acc + 1 + (r.companions_count || 0), 0);

  return (
    <div className="space-y-6 select-none bg-white p-6 rounded-3xl border border-sage-light/40 shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-800">Lista de Convidados & Confirmados</h2>
          <p className="text-xs text-gray-400 mt-1">Busque, filtre, edite cadastros ou exporte os dados completos em PDF ou Excel.</p>
        </div>

        {/* Buttons panel matching Bento theme actions */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => exportToPdf(rsvps, settings)}
            title="Exportar em formato PDF"
            className="flex items-center gap-1.5 px-4 py-2 border border-sage-light/50 text-sage-green text-xs font-bold rounded-full cursor-pointer hover:bg-sage-light/20 transition-all active:scale-97"
          >
            <FileText size={14} />
            <span>PDF</span>
          </button>

          <button
            onClick={() => exportToExcel(rsvps, settings.birthday_name)}
            title="Exportar em formato Excel (.xlsx)"
            className="flex items-center gap-1.5 px-4 py-2 bg-sage-light/20 text-slate-800 text-xs font-bold rounded-full cursor-pointer hover:bg-sage-light/40 transition-all active:scale-97"
          >
            <FileSpreadsheet size={14} />
            <span>Excel</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-pink-soft hover:bg-pink-dark text-white text-xs font-bold rounded-full cursor-pointer transition-all active:scale-97 shadow-xs font-sans"
          >
            <Plus size={14} />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-gray-100 pb-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border rounded-xl border-sage-light/60 focus:outline-none focus:border-pink-soft font-medium bg-white"
          />
          <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
        </div>

        {/* Filter status dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 whitespace-nowrap">Filtrar:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border rounded-xl border-sage-light/60 text-xs font-semibold bg-white focus:outline-none focus:border-pink-soft cursor-pointer"
          >
            <option value="all">Todas as respostas</option>
            <option value="confirmed">Confirmaram (Vou)</option>
            <option value="maybe">Talvez / Dúvida</option>
            <option value="declined">Recusaram (Não vou)</option>
          </select>
        </div>

        {/* Badge sum */}
        <div className="flex items-center justify-end">
          <span className="text-[10px] sm:text-xs font-bold text-pink-dark bg-pink-soft/10 border border-pink-soft/30 px-3.5 py-1.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            Total Geral Presentes: <strong className="text-pink-dark font-sans">{grandTotalAllConfirmed}</strong> pessoas
          </span>
        </div>
      </div>

      {/* Main Table view */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100">
              <th className="py-3 px-4 text-left">Convidado</th>
              <th className="py-3 px-2">Telefone</th>
              <th className="py-3 px-2">Presença</th>
              <th className="py-3 px-2">Acomp.?</th>
              <th className="py-3 px-2">Qtd</th>
              <th className="py-3 px-3">Observações</th>
              <th className="py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-left font-bold text-amber-950">
                    <p>{item.guest_name}</p>
                    {item.companions_names && item.companions_names.length > 0 && (
                      <span className="text-[9px] text-[#8FA89B] tracking-wide block">
                        Acomps: {item.companions_names.join(', ')}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap text-gray-500">
                    {item.phone || '-'}
                  </td>
                  <td className="py-3 px-2">
                    {item.attendance_status === 'confirmed' && (
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Confirmou
                      </span>
                    )}
                    {item.attendance_status === 'maybe' && (
                      <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Talvez
                      </span>
                    )}
                    {item.attendance_status === 'declined' && (
                      <span className="bg-red-50 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Não vai
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">{item.has_companions ? 'Sim' : 'Não'}</td>
                  <td className="py-3 px-2 font-bold">{item.companions_count || 0}</td>
                  <td className="py-3 px-3 text-gray-400 font-normal truncate max-w-[150px]" title={item.notes}>
                    {item.notes || '-'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        title="Editar Resposta"
                        className="p-1 px-2 rounded-lg bg-gray-100 hover:bg-[#FAF0EE] hover:text-[#E66C86] cursor-pointer transition-colors text-gray-600"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.guest_name)}
                        title="Excluir Convidado"
                        className="p-1 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-800 cursor-pointer transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400 font-medium italic">
                  Nenhum registro corresponde aos filtros selecionados. 🍂
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD POPUP EDIT/CREATE FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSave}
            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 border-dashed border-[#8FA89B]/55"
          >
            {/* Header */}
            <div className="bg-[#FAF6F0] p-4 flex justify-between items-center border-b border-gray-100">
              <h3 className="font-extrabold text-amber-950 text-sm">
                {editingId ? 'Editar Detalhes do Convidado' : 'Inserir Convidado Manualmente'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Inputs Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-left">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Telefone WhatsApp</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Status de Presença</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as AttendanceStatus)}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none bg-white font-semibold"
                >
                  <option value="confirmed">Confirmado (Sim, vou)</option>
                  <option value="maybe">Talvez / Dúvida</option>
                  <option value="declined">Não vai</option>
                </select>
              </div>

              {formStatus === 'confirmed' && (
                <div className="bg-gray-50 p-4 rounded-2xl border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Levará Acompanhantes?</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setFormHasCompanions(true)}
                        className={`px-3 py-1 text-[10px] font-bold rounded cursor-pointer ${formHasCompanions ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormHasCompanions(false);
                          handleCompanionsCountChange(0);
                        }}
                        className={`px-3 py-1 text-[10px] font-bold rounded cursor-pointer ${!formHasCompanions ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                      >
                        Não
                      </button>
                    </div>
                  </div>

                  {formHasCompanions && (
                    <div className="space-y-3 pt-2.5 border-t border-dashed">
                      <div>
                        <span className="text-xs mr-2">Quantidade:</span>
                        <select
                          value={formCompanionsCount}
                          onChange={(e) => handleCompanionsCountChange(parseInt(e.target.value))}
                          className="px-2 py-1 text-xs border rounded cursor-pointer bg-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>

                      {formCompanionsNames.map((name, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <span className="text-[10px] font-bold bg-gray-200 w-5 h-5 rounded-full flex items-center justify-center">{index + 1}</span>
                          <input
                            type="text"
                            required
                            placeholder="Nome completo do acompanhante"
                            value={name}
                            onChange={(e) => handleCompanionNameChange(index, e.target.value)}
                            className="w-full px-3 py-1 text-xs border rounded-xl focus:outline-none bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Observações Privadas</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3.5 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-gray-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#E66C86] text-white text-xs font-bold rounded-xl cursor-pointer hover:brightness-105"
              >
                Confirmar e Gravar
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
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger={true}
      />
    </div>
  );
}
