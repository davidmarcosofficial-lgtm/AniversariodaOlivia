import React, { useState } from 'react';
import { Gift, Plus, Trash2, Edit2, Save, X, Tag, Info, AlertTriangle, Sparkles, FolderPlus } from 'lucide-react';
import { GiftSuggestion } from '../types/database';
import ConfirmModal from './ConfirmModal';

interface AdminGiftManagerProps {
  gifts: GiftSuggestion[];
  isSupabaseConfigured?: boolean;
  isTableConfigured?: boolean;
  onAddGift: (gift: Omit<GiftSuggestion, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateGift: (id: string, updated: Partial<GiftSuggestion>) => Promise<void>;
  onDeleteGift: (id: string) => Promise<void>;
}

export default function AdminGiftManager({ 
  gifts, 
  isSupabaseConfigured = false, 
  isTableConfigured = true, 
  onAddGift, 
  onUpdateGift, 
  onDeleteGift 
}: AdminGiftManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Form values (Add New)
  const [newCategory, setNewCategory] = useState('mimos para a bebê');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Form values (Editing)
  const [editCategory, setEditCategory] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Categories suggestions list
  const activeCategories = Array.from(new Set(gifts.map(g => g.category.trim()))).filter(Boolean);
  const defaultCategories = ['mimos para a bebê', 'mimos para a mamãe', 'mimos gerais'];
  const allSuggestedCategories = Array.from(new Set([...defaultCategories, ...activeCategories]));

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setIsSubmitting(true);
      const finalCategory = showCustomCategory ? customCategory.trim() : newCategory;
      if (!finalCategory.trim()) {
        alert('Por favor, informe uma categoria.');
        return;
      }

      await onAddGift({
        category: finalCategory.toLowerCase(),
        name: newName.trim(),
        description: newDescription.trim()
      });

      // Reset form fields
      setNewName('');
      setNewDescription('');
      setCustomCategory('');
      setShowCustomCategory(false);
    } catch (err) {
      console.error('Error adding gift suggestion:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (gift: GiftSuggestion) => {
    setEditingId(gift.id);
    setEditCategory(gift.category);
    setEditName(gift.name);
    setEditDescription(gift.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateSubmit = async (id: string) => {
    if (!editName.trim()) return;

    try {
      setIsSubmitting(true);
      await onUpdateGift(id, {
        category: editCategory.toLowerCase().trim(),
        name: editName.trim(),
        description: editDescription.trim()
      });
      setEditingId(null);
    } catch (err) {
      console.error('Error updating suggestion:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    // Find the gift item
    const item = gifts.find(g => g.id === id);
    const itemName = item ? item.name : 'este item';

    setConfirmModal({
      isOpen: true,
      title: 'Excluir Sugestão',
      message: `Tem certeza que deseja excluir a sugestão "${itemName}" da lista? Esta ação é irreversível.`,
      onConfirm: async () => {
        try {
          await onDeleteGift(id);
        } catch (err) {
          console.error('Error deleting suggestion:', err);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  return (
    <div className="space-y-6 select-none" id="admin-gift-suggestions">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="text-pink-soft" size={24} />
            <h2 className="text-xl font-black text-slate-800">Sugestões de Presente</h2>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Gerencie as categorias, itens sugeridos e descrições exibidas aos convidados no convite digital.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-pink-soft/5 border border-pink-soft/10 text-pink-dark rounded-full text-xs font-bold font-sans">
          <Sparkles size={14} className="text-pink-soft animate-pulse" />
          <span>{gifts.length} {gifts.length === 1 ? 'Sugestão' : 'Sugestões'} Ativas</span>
        </div>
      </div>

      {/* Supabase Table Setup Warning Alert Box */}
      {isSupabaseConfigured && !isTableConfigured && (
        <div className="bg-[#FAF3F0] border-2 border-dashed border-[#F4D9E1] rounded-3xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-[#E05A77] shrink-0 mt-0.5 animate-pulse" size={20} />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800">
                A tabela <code className="bg-[#FAF0ED] px-1.5 py-0.5 rounded-md font-mono text-xs text-[#E05A77]">gift_suggestions</code> não foi detectada no Supabase
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                O aplicativo está utilizando o modo de **armazenamento temporário (Local Storage)** no seu navegador para manter a fofura funcionando! 
                Para que os itens cadastrados sejam carregados de forma definitiva na nuvem por todos os convidados, rode o script SQL abaixo no **SQL Editor** do painel do seu projeto Supabase:
              </p>
            </div>
          </div>

          <div className="relative bg-[#2D2A2E] rounded-2xl overflow-hidden shadow-xs">
            <div className="px-4 py-2 bg-[#221F22] border-b border-[#343134] flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400">SUPABASE_MIGRATION.SQL</span>
              <button
                onClick={() => {
                  const sql = `CREATE TABLE public.gift_suggestions (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.gift_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público de leitura" ON public.gift_suggestions
    FOR SELECT USING (true);

CREATE POLICY "Moderação total de presentes" ON public.gift_suggestions
    FOR ALL USING (true) WITH CHECK (true);`;
                  navigator.clipboard.writeText(sql);
                  alert('Comando SQL copiado com sucesso! 🎉 No painel do seu Supabase, crie uma nova query no "SQL Editor", cole este código e clique em "Run".');
                }}
                className="px-2.5 py-1 hover:bg-slate-700/50 bg-[#2d2a2e]/60 text-stone-200 text-[10px] rounded-md font-bold transition-all cursor-pointer"
              >
                Copiar SQL
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-[10px] text-emerald-400 font-mono leading-relaxed select-all">
{`CREATE TABLE public.gift_suggestions (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.gift_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público de leitura" ON public.gift_suggestions
    FOR SELECT USING (true);

CREATE POLICY "Moderação total de presentes" ON public.gift_suggestions
    FOR ALL USING (true) WITH CHECK (true);`}
            </pre>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Create Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 h-fit space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FolderPlus size={16} className="text-sage-green" />
              <span>Nova Sugestão</span>
            </h3>
            <p className="text-[11px] text-gray-400 font-medium">Cadastre um novo item ou categoria fofa na lista.</p>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider flex items-center gap-1">
                <Tag size={12} />
                <span>Categoria</span>
              </label>

              {!showCustomCategory ? (
                <div className="flex gap-2">
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setShowCustomCategory(true);
                      } else {
                        setNewCategory(e.target.value);
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 bg-[#FAF9F6] border border-gray-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-pink-soft/40 focus:ring-1 focus:ring-pink-soft/10 transition-all cursor-pointer"
                  >
                    {allSuggestedCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">📝 Criar nova categoria...</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ex: mimos para papai, etc."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-[#FAF9F6] border border-gray-100 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-soft/40 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(false)}
                    className="px-3 py-2.0 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-400 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Gift Name / Suggestion */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider flex items-center gap-1">
                <Gift size={12} />
                <span>Sugestão / Mimo</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Frauda (qualquer marca), Brinquedos, etc."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-gray-100 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-soft/40 transition-all font-sans"
              />
            </div>

            {/* Description / Size / Specs */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider flex items-center gap-1">
                <Info size={12} />
                <span>Descrição / Tamanho / Obs</span>
              </label>
              <input
                type="text"
                placeholder="Ex: G, M, 1 ano+, Algodão"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-gray-100 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-soft/40 transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newName.trim()}
              className="w-full py-3 bg-pink-soft hover:bg-pink-dark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(230,108,134,0.15)] hover:shadow-[0_6px_16px_rgba(230,108,134,0.25)] select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus size={15} />
              <span>Adicionar à Lista</span>
            </button>
          </form>
        </div>

        {/* Right Side: List viewport */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
              Lista de Sugestões Atuantes
            </h3>
            <p className="text-[11px] text-gray-400 font-medium">Veja todos os mimos cadastrados e mude-os conforme desejado.</p>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {gifts.map((item) => (
              <div 
                key={item.id} 
                className="p-4 border border-gray-100 rounded-2xl bg-[#CCDCDB]/5 hover:bg-[#CCDCDB]/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                {editingId === item.id ? (
                  /* Edit Mode Inputs Form */
                  <div className="flex-1 w-full space-y-3 font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-gray-400 leading-none">Categoria:</span>
                        <input
                          type="text"
                          required
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-gray-400 leading-none">Item / Mimo:</span>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-gray-400 leading-none">Descrição / Observação:</span>
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-slate-600 focus:outline-none"
                      />
                    </div>

                    {/* Check actions in Edit mode */}
                    <div className="flex gap-2 pt-1 font-sans">
                      <button
                        onClick={() => handleUpdateSubmit(item.id)}
                        disabled={isSubmitting || !editName.trim()}
                        className="px-3 py-1.5 bg-sage-green hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Save size={12} />
                        <span>Salvar</span>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <X size={12} />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Display Mode */
                  <>
                    <div className="space-y-1">
                      {/* Badge category */}
                      <span className="inline-block text-[9px] font-extrabold uppercase tracking-widest text-[#8FA89B] bg-sage-light/10 border border-sage-light/20 px-2.5 py-0.5 rounded-md font-sans">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                      {item.description && (
                        <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1 italic">
                          <span className="not-italic text-gray-400 font-semibold uppercase text-[8px] tracking-wide">Descrição:</span>
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Action button triggers list */}
                    <div className="flex items-center gap-1 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1 px-2.5 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-100/60 rounded-xl text-[10px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                        title="Editar Sugestão"
                      >
                        <Edit2 size={12} />
                        <span>Editar</span>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="p-1 px-2.5 hover:bg-red-50 border border-gray-100 hover:border-red-100/60 rounded-xl text-[10px] font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                        title="Deletar"
                      >
                        <Trash2 size={12} />
                        <span>Deletar</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {gifts.length === 0 && (
              <div className="py-12 text-center text-xs text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 select-none">
                <AlertTriangle size={24} className="text-amber-400 animate-pulse" />
                <p>Nenhuma sugestão cadastrada ainda. Use o formulário à esquerda para criar!</p>
              </div>
            )}
          </div>
        </div>
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
