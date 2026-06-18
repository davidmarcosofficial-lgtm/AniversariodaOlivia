import React, { useState } from 'react';
import { EventSettings } from '../types/database';
import { Eye, Palette, Save, Sliders, Sparkles } from 'lucide-react';

interface AdminSettingsFormProps {
  settings: EventSettings;
  onSaveSettings: (updated: Partial<EventSettings>) => Promise<void>;
}

export default function AdminSettingsForm({ settings, onSaveSettings }: AdminSettingsFormProps) {
  // Input fields
  const [name, setName] = useState(settings.birthday_name || '');
  const [age, setAge] = useState(settings.birthday_age || '');
  const [heroTitle, setHeroTitle] = useState(settings.hero_title || '');
  const [inviteText, setInviteText] = useState(settings.invite_text || '');
  const [dateStr, setDateStr] = useState(settings.event_date || '');
  const [timeStr, setTimeStr] = useState(settings.event_time || '');
  const [weekday, setWeekday] = useState(settings.weekday || '');
  const [address, setAddress] = useState(settings.address || '');
  const [mapsUrl, setMapsUrl] = useState(settings.maps_url || '');
  const [giftUrl, setGiftUrl] = useState(settings.gift_url || '');

  // Theme Colors
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color || '#F4D9E1');
  const [secondaryColor, setSecondaryColor] = useState(settings.secondary_color || '#8FA89B');
  const [bgColor, setBgColor] = useState(settings.background_color || '#FAF6F0');
  const [buttonColor, setButtonColor] = useState(settings.button_color || '#E66C86');
  const [textColor, setTextColor] = useState(settings.text_color || '#4A3B32');

  // Interactive Feature Toggles
  const [enableWall, setEnableWall] = useState(settings.enable_wall ?? true);
  const [enableComments, setEnableComments] = useState(settings.enable_comments ?? true);
  const [enablePhotoUpload, setEnablePhotoUpload] = useState(settings.enable_photo_upload ?? true);

  const [loading, setLoading] = useState(false);

  // Colors palettes preset selectors
  const applyPreset = (pColor: string, sColor: string, bgCol: string, btnCol: string, txtCol: string) => {
    setPrimaryColor(pColor);
    setSecondaryColor(sColor);
    setBgColor(bgCol);
    setButtonColor(btnCol);
    setTextColor(txtCol);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSaveSettings({
        birthday_name: name,
        birthday_age: age,
        hero_title: heroTitle,
        invite_text: inviteText,
        event_date: dateStr,
        event_time: timeStr,
        weekday,
        address,
        maps_url: mapsUrl,
        gift_url: giftUrl,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        background_color: bgColor,
        button_color: buttonColor,
        text_color: textColor,
        enable_wall: enableWall,
        enable_comments: enableComments,
        enable_photo_upload: enablePhotoUpload
      });
      alert('Configurações salvas com sucesso! ✨ Elas já foram atualizadas no convite dos convidados.');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar as configurações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-sage-light/40 shadow-[0_4px_6px_rgba(0,0,0,0.02)] select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5 mb-5">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-800 flex items-center gap-2">
            <Sliders size={20} className="text-sage-green" />
            <span>Personalizar Convite Digital</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Atualize textos, datas, localizações, links e cores do convite de aniversário infantil de {settings.birthday_name || 'Melissa'}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* SECTION 1: TEXTS */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-serif text-slate-800 border-l-4 border-sage-green pl-2">
            1. Textos do Convite
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Nome da Aniversariante *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 border border-sage-light/60 rounded-xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Idade / Subtítulo *</label>
              <input
                type="text"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex. 1 aninho"
                className="w-full px-3 py-1.5 border border-sage-light/60 rounded-xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Frase Principal do Topo *</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3 py-1.5 border border-sage-light/60 rounded-xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Texto de Convite Principal *</label>
              <textarea
                required
                rows={2}
                value={inviteText}
                onChange={(e) => setInviteText(e.target.value)}
                className="w-full px-3 py-1.5 border border-sage-light/60 rounded-2xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800 resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DATE & TIME */}
        <div className="space-y-3.5 pt-2 border-t border-dashed border-gray-100">
          <h3 className="text-base font-bold font-serif text-slate-800 border-l-4 border-sage-green pl-2">
            2. Calendário e Horários da Festa
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Dia da Semana *</label>
              <input
                type="text"
                required
                value={weekday}
                onChange={(e) => setWeekday(e.target.value)}
                placeholder="Ex. Sábado"
                className="w-full px-3 py-1.5 border border-sage-light/60 rounded-xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Data *</label>
              <input
                type="text"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="Ex. 13.06"
                className="w-full px-3 py-1.5 border border-sage-light/60 rounded-xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Horário *</label>
              <input
                type="text"
                required
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                placeholder="Ex. 19:00"
                className="w-full px-3 py-1.5 border border-sage-light/60 rounded-xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: LOCATION & GIFTS */}
        <div className="space-y-3.5 pt-2 border-t border-dashed border-gray-100">
          <h3 className="text-base font-bold font-serif text-slate-800 border-l-4 border-sage-green pl-2">
            3. Endereço e Links Úteis
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Descrição do Endereço *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-1.5 border border-sage-light/60 rounded-xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Link do Google Maps *</label>
                <input
                  type="url"
                  required
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-1.5 border border-sage-light/60 rounded-xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Link de Sugestão de Presentes (Loja)</label>
                <input
                  type="url"
                  value={giftUrl}
                  onChange={(e) => setGiftUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 border border-sage-light/60 rounded-xl text-xs focus:outline-none focus:border-pink-soft bg-white text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: THEME DESIGN COLORS */}
        <div className="space-y-4 pt-2 border-t border-dashed border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="text-base font-bold font-serif text-slate-800 border-l-4 border-sage-green pl-2 flex items-center gap-1.5">
              <Palette size={14} />
              <span>4. Identidade Visual & Cores</span>
            </h3>

            {/* Presets selectors */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('#F4D9E1', '#8FA89B', '#FAF6F0', '#E66C86', '#4A3B32')}
                className="px-3.5 py-1.5 bg-pink-soft/10 text-[9.5px] text-pink-dark hover:bg-pink-soft/20 font-bold rounded-full border border-pink-soft/20 cursor-pointer transition-colors"
               >
                🌲 Bosque Encantado (Padrão)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('#DCE8E1', '#E8C5C8', '#FAF9F6', '#C66C7E', '#324037')}
                className="px-3.5 py-1.5 bg-sage-light/20 text-[9.5px] text-slate-700 hover:bg-sage-light/45 font-bold rounded-full border border-sage-light/45 cursor-pointer transition-colors"
              >
                🌿 Sálvia & Framboesa
              </button>
              <button
                type="button"
                onClick={() => applyPreset('#F6ECDC', '#BCCDC4', '#FAFAF6', '#D1A36B', '#47433B')}
                className="px-3.5 py-1.5 bg-amber-50 text-[9.5px] text-amber-900 hover:bg-amber-100 font-bold rounded-full border border-amber-200 cursor-pointer transition-colors"
              >
                🍂 Amêndoa Rústica
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1.5">
            {/* Primaria background */}
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase text-gray-400 mb-1.5">Rosa Primário</span>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 border-0 rounded cursor-pointer"
              />
              <span className="text-[10px] font-mono mt-1 font-bold text-gray-500 uppercase">{primaryColor}</span>
            </div>

            {/* Secundaria */}
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase text-gray-400 mb-1.5">Verde Secundário</span>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-10 border-0 rounded cursor-pointer"
              />
              <span className="text-[10px] font-mono mt-1 font-bold text-gray-500 uppercase">{secondaryColor}</span>
            </div>

            {/* Background */}
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase text-gray-400 mb-1.5">Fundo do Convite</span>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 border-0 rounded cursor-pointer"
              />
              <span className="text-[10px] font-mono mt-1 font-bold text-gray-500 uppercase">{bgColor}</span>
            </div>

            {/* Buttons */}
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase text-gray-400 mb-1.5">Botões Circulares</span>
              <input
                type="color"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                className="w-10 h-10 border-0 rounded cursor-pointer"
              />
              <span className="text-[10px] font-mono mt-1 font-bold text-gray-500 uppercase">{buttonColor}</span>
            </div>

            {/* Text Color */}
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center col-span-2 sm:col-span-1">
              <span className="text-[9px] font-bold uppercase text-gray-400 mb-1.5">Cor dos Textos</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 border-0 rounded cursor-pointer"
              />
              <span className="text-[10px] font-mono mt-1 font-bold text-gray-500 uppercase">{textColor}</span>
            </div>
          </div>
        </div>

        {/* SECTION 5: FUNCTIONS TOGGLES */}
        <div className="space-y-4 pt-2 border-t border-dashed border-gray-100">
          <h3 className="text-base font-bold font-serif text-slate-800 border-l-4 border-sage-green pl-2">
            5. Ativação de Funcionalidades Públicas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
            {/* Mural */}
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={enableWall}
                  onChange={(e) => setEnableWall(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-soft"></div>
              </div>
              <div className="text-[11px]">
                <strong className="block text-gray-700 font-sans">Mural de Carinho</strong>
                <span className="text-gray-400 font-medium">Habilitar recados e parabéns</span>
              </div>
            </label>

            {/* Comentarios */}
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={enableComments}
                  onChange={(e) => setEnableComments(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-soft"></div>
              </div>
              <div className="text-[11px]">
                <strong className="block text-gray-700 font-sans">Respostas / Comentários</strong>
                <span className="text-gray-400 font-medium">Permitir responder recados</span>
              </div>
            </label>

            {/* Envio fotos */}
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={enablePhotoUpload}
                  onChange={(e) => setEnablePhotoUpload(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-soft"></div>
              </div>
              <div className="text-[11px]">
                <strong className="block text-gray-700 font-sans">Upload de Fotos</strong>
                <span className="text-gray-400 font-medium">Anexar imagens nos recados</span>
              </div>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-2.5 bg-pink-soft hover:bg-pink-dark text-white rounded-full text-xs font-bold tracking-wide shadow-xs transition-all active:scale-97 cursor-pointer flex items-center gap-2 font-sans"
          >
            <Save size={14} />
            <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
