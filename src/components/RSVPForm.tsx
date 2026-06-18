import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '../lib/supabase';
import { AttendanceStatus, EventSettings } from '../types/database';
import { CheckCircle2, UserPlus, Users2, X } from 'lucide-react';
import { CuteFox, HandDrawnLeaf } from './WoodlandAnimals';

// Define RSVP form validation schema using Zod
const rsvpSchema = z.object({
  guest_name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  phone: z.string(),
  attendance_status: z.enum(['confirmed', 'declined', 'maybe']),
  has_companions: z.boolean(),
  companions_count: z.number(),
  companions_names: z.array(z.string()),
  notes: z.string(),
});

type RSVPFormValues = z.infer<typeof rsvpSchema>;

interface RSVPFormProps {
  settings: EventSettings;
  onClose: () => void;
  onSuccessCreated?: () => void;
}

export default function RSVPForm({ settings, onClose, onSuccessCreated }: RSVPFormProps) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guest_name: '',
      phone: '',
      attendance_status: 'confirmed',
      has_companions: false,
      companions_count: 1,
      companions_names: [],
      notes: ''
    }
  });

  const attendanceStatusValue = watch('attendance_status');
  const hasCompanionsValue = watch('has_companions');
  const companionsCountValue = watch('companions_count') || 1;

  // Watch count and update names array fields
  useEffect(() => {
    if (!hasCompanionsValue || attendanceStatusValue !== 'confirmed') {
      setValue('companions_count', 0);
      setValue('companions_names', []);
    } else {
      // If companion list is toggled true, make sure count is at least 1
      if (companionsCountValue < 1) {
        setValue('companions_count', 1);
      }
    }
  }, [hasCompanionsValue, attendanceStatusValue, setValue]);

  const onSubmit = async (values: RSVPFormValues) => {
    setLoading(true);
    try {
      // Clean companions names array if they aren't going or don't have companions
      let safeCompanionsNames: string[] = [];
      if (values.attendance_status === 'confirmed' && values.has_companions) {
        // Only slice from form values up to the registered companion count to ensure integrity
        const rawNames = values.companions_names || [];
        const count = parseInt(values.companions_count.toString()) || 1;
        safeCompanionsNames = Array.from({ length: count }).map((_, idx) => rawNames[idx] || 'Acompanhante Sem Nome');
      }

      await db.createRSVP({
        guest_name: values.guest_name,
        phone: values.phone || '',
        attendance_status: values.attendance_status as AttendanceStatus,
        has_companions: values.attendance_status === 'confirmed' && values.has_companions,
        companions_count: values.attendance_status === 'confirmed' && values.has_companions ? parseInt(values.companions_count.toString()) : 0,
        companions_names: safeCompanionsNames,
        notes: values.notes || ''
      });

      setSuccess(true);
      if (onSuccessCreated) {
        onSuccessCreated();
      }
    } catch (err) {
      console.error('Error recording RSVP:', err);
      alert('Não foi possível registrar sua presença. Por favor tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const buttonColor = settings.button_color || '#E66C86';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-4 border-[#8FA89B]/30"
        style={{ color: settings.text_color }}
      >
        {/* Top Header */}
        <div className="p-5 flex justify-between items-center text-white" style={{ backgroundColor: settings.secondary_color || '#8FA89B' }}>
          <div className="flex items-center gap-2">
            <HandDrawnLeaf size={22} className="brightness-200" stroke="#FFFFFF" />
            <h3 className="font-bold text-lg">Confirmar Presença</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/40 cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        {!success ? (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Guest Name input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                {...register('guest_name')}
                placeholder="Ex. Marina da Silva"
                className="w-full px-4 py-2 text-sm border-2 rounded-2xl border-[#8FA89B]/30 focus:border-[#E66C86] focus:outline-none bg-amber-50/10 placeholder-gray-400"
              />
              {errors.guest_name && (
                <p className="text-red-500 text-xs mt-1 font-semibold">{errors.guest_name.message}</p>
              )}
            </div>

            {/* Phone/WhatsApp input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Telefone ou WhatsApp <span className="text-gray-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="Ex. (11) 98765-4321"
                className="w-full px-4 py-2 text-sm border-2 rounded-2xl border-[#8FA89B]/30 focus:border-[#E66C86] focus:outline-none bg-amber-50/10 placeholder-gray-400"
              />
            </div>

            {/* Attendance radio buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Você vai comparecer? *
              </label>
              <div className="grid grid-cols-1 gap-2">
                <label className="flex items-center gap-3 p-3 border-2 rounded-2xl border-[#8FA89B]/20 bg-[#FAF6F0]/20 cursor-pointer hover:border-[#E66C86]/50 transition-colors">
                  <input
                    type="radio"
                    value="confirmed"
                    {...register('attendance_status')}
                    className="accent-[#E66C86] w-4 h-4 cursor-pointer"
                  />
                  <div className="text-sm">
                    <span className="font-bold block">Sim, com certeza vou! ✨</span>
                    <span className="text-xs opacity-75">Mal posso esperar pela festa.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-2xl border-[#8FA89B]/20 bg-[#FAF6F0]/20 cursor-pointer hover:border-[#E66C86]/50 transition-colors">
                  <input
                    type="radio"
                    value="maybe"
                    {...register('attendance_status')}
                    className="accent-[#E66C86] w-4 h-4 cursor-pointer"
                  />
                  <div className="text-sm">
                    <span className="font-bold block font-sans">Ainda não consigo confirmar 🍂</span>
                    <span className="text-xs opacity-75">Vou verificar e respondo em breve.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-2xl border-[#8FA89B]/20 bg-[#FAF6F0]/20 cursor-pointer hover:border-[#E66C86]/50 transition-colors">
                  <input
                    type="radio"
                    value="declined"
                    {...register('attendance_status')}
                    className="accent-[#E66C86] w-4 h-4 cursor-pointer"
                  />
                  <div className="text-sm">
                    <span className="font-bold block">Infelizmente não poderei ir 😢</span>
                    <span className="text-xs opacity-75">Fica para a próxima aventura do bosque.</span>
                  </div>
                </label>
              </div>
              {errors.attendance_status && (
                <p className="text-red-500 text-xs mt-1 font-semibold">{errors.attendance_status.message}</p>
              )}
            </div>

            {/* Companion section (Only visible if attendance confirmed) */}
            {attendanceStatusValue === 'confirmed' && (
              <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#8FA89B]/30 space-y-3 animate-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                    <Users2 size={16} className="text-[#8FA89B]" />
                    <span>Leva acompanhantes?</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setValue('has_companions', true)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${hasCompanionsValue ? 'text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      style={hasCompanionsValue ? { backgroundColor: buttonColor } : undefined}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('has_companions', false)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${!hasCompanionsValue ? 'text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      style={!hasCompanionsValue ? { backgroundColor: buttonColor } : undefined}
                    >
                      Não
                    </button>
                  </div>
                </div>

                {hasCompanionsValue && (
                  <div className="space-y-3 animate-in slide-in-from-top-1 duration-150 pt-2 border-t border-dashed border-[#8FA89B]/30">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Quantos acompanhantes você trará?
                      </label>
                      <select
                        {...register('companions_count', { valueAsNumber: true })}
                        className="px-3 py-1.5 border-2 rounded-xl border-[#8FA89B]/30 focus:border-[#E66C86] focus:outline-none text-sm bg-white cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dynamic Companion Name Slots */}
                    {companionsCountValue > 0 && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800">
                          Nome de cada acompanhante:
                        </label>
                        {Array.from({ length: companionsCountValue }).map((_, index) => (
                          <div key={index} className="flex gap-2 items-center animate-in slide-in-from-left duration-150">
                            <span className="text-xs bg-[#8FA89B]/20 w-5 h-5 rounded-full flex items-center justify-center font-bold text-emerald-900 shrink-0 select-none">
                              {index + 1}
                            </span>
                            <div className="w-full">
                              <input
                                type="text"
                                {...register(`companions_names.${index}` as const)}
                                placeholder="Nome completo do acompanhante"
                                className="w-full px-3 py-1.5 text-xs border-2 rounded-xl border-[#8FA89B]/30 focus:border-[#E66C86] focus:outline-none bg-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Remarks text input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Observações ou Restrições <span className="text-gray-400 font-normal">(Opcional)</span>
              </label>
              <textarea
                rows={2}
                {...register('notes')}
                placeholder="Ex: Sou intolerante a glúten / Vou chegar um pouquinho mais tarde..."
                className="w-full px-4 py-2 text-sm border-2 rounded-2xl border-[#8FA89B]/30 focus:border-[#E66C86] focus:outline-none bg-amber-50/10 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-bold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-98 rounded-2xl cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                style={{ backgroundColor: buttonColor }}
              >
                {loading ? 'Processando...' : 'Confirmar Presença'}
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS SCREEN DISPLAY */
          <div className="p-10 text-center space-y-6">
            <div className="flex justify-center select-none">
              <div className="relative">
                <CuteFox size={90} className="mx-auto" />
                <span className="text-3xl absolute -top-1 -right-2 text-amber-500 animate-bounce">🎈</span>
                <span className="text-2xl absolute -bottom-1 -left-2 text-rose-500 animate-pulse">💕</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-emerald-800">Obrigada pela confirmação!</h4>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                Sua resposta foi registrada com carinho para o aniversário da <span className="font-bold mb-1 block text-lg" style={{ color: settings.button_color || '#E66C86' }}>{settings.birthday_name}</span>.
              </p>
            </div>

            <div className="inline-flex gap-2 items-center justify-center bg-emerald-50 text-emerald-800 py-2 px-4 rounded-full text-xs font-bold shadow-xs">
              <CheckCircle2 size={16} />
              <span>Resposta registrada no Bosque!</span>
            </div>

            <div>
              <button
                type="button"
                onClick={onClose}
                className="w-full max-w-xs py-3 text-sm font-bold text-white tracking-wide shadow-md active:scale-97 rounded-2xl cursor-pointer transition-transform"
                style={{ backgroundColor: settings.button_color || '#E66C86' }}
              >
                Fechar janela
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
