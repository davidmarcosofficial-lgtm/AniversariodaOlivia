import { RSVP, EventSettings } from '../types/database';
import { CheckCircle, HelpCircle, Landmark, Sparkles, UserPlus, Users2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  rsvps: RSVP[];
  settings?: EventSettings | null;
}

export default function AdminDashboard({ rsvps, settings }: AdminDashboardProps) {
  // Compute metric numbers
  const totalRsvpResponses = rsvps.length;
  
  const confirmedMainGuests = rsvps.filter(r => r.attendance_status === 'confirmed').length;
  const companionGuestsCount = rsvps
    .filter(r => r.attendance_status === 'confirmed')
    .reduce((acc, r) => acc + (r.companions_count || 0), 0);
  
  const grandTotalPeopleConfirmed = confirmedMainGuests + companionGuestsCount;

  const totalMaybe = rsvps.filter(r => r.attendance_status === 'maybe').length;
  const totalDeclined = rsvps.filter(r => r.attendance_status === 'declined').length;

  // Recent logs
  const recentRsvps = rsvps.slice(0, 5);

  const stats = [
    {
      title: 'Presenças Confirmadas (Total Geral)',
      value: grandTotalPeopleConfirmed,
      description: `${confirmedMainGuests} titulares + ${companionGuestsCount} acompanhantes`,
      borderColor: 'border-sage-light/40',
      labelColor: 'text-sage-green',
      valueColor: 'text-pink-dark',
      icon: Users2
    },
    {
      title: 'Convidados Principais (RSVP Sim)',
      value: confirmedMainGuests,
      description: 'Convidados que preencheram o formulário',
      borderColor: 'border-sage-light/40',
      labelColor: 'text-sage-green',
      valueColor: 'text-pink-dark',
      icon: CheckCircle
    },
    {
      title: 'Acompanhantes Cadastrados',
      value: companionGuestsCount,
      description: 'Filhos, parentes e convidados extras',
      borderColor: 'border-sage-light/40',
      labelColor: 'text-sage-green',
      valueColor: 'text-sage-green',
      icon: UserPlus
    },
    {
      title: 'Não Comparecerão',
      value: totalDeclined,
      description: 'Registraram que não poderão ir',
      borderColor: 'border-sage-light/40',
      labelColor: 'text-gray-400',
      valueColor: 'text-gray-400',
      icon: XCircle
    },
    {
      title: 'Talvez / Indecisos',
      value: totalMaybe,
      description: 'Ainda não sabem se vão conseguir comparecer',
      borderColor: 'border-sage-light/40',
      labelColor: 'text-amber-600',
      valueColor: 'text-amber-650',
      icon: HelpCircle
    }
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Header section with woodland details and Cormorant Garamond */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sage-light/40">
        <div>
          <span className="text-xs font-bold text-sage-green uppercase tracking-widest block mb-1">Visão Geral</span>
          <h2 className="text-3xl font-bold font-serif text-slate-800">Olá, Papais! 🌲✨</h2>
          <p className="text-xs text-gray-500 mt-1">
            Aqui está o andamento das confirmações de convidados para o primeiro aninho de {settings?.birthday_name ? settings.birthday_name.split(' ')[0] : 'Melissa'}.
          </p>
        </div>

        <div className="bg-white border border-sage-light/40 p-3.5 rounded-2xl flex items-center justify-center gap-3">
          <div className="text-2xl">🌱</div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-sage-green">Total formulários</span>
            <p className="text-sm font-extrabold text-pink-dark">{totalRsvpResponses} respostas</p>
          </div>
        </div>
      </div>

      {/* Grid of Bento metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, ind) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ind * 0.05 }}
              className={`p-6 rounded-2xl border ${stat.borderColor} flex flex-col justify-between shadow-[0_4px_6px_rgba(0,0,0,0.02)] bg-white transition-all hover:scale-[1.01]`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${stat.labelColor}`}>{stat.title}</span>
                <span className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-400">
                  <IconComponent size={16} />
                </span>
              </div>
              <div>
                <p className={`text-4xl font-bold font-sans ${stat.valueColor}`}>{stat.value}</p>
                <p className="text-[11px] font-medium text-gray-400 mt-1.5">{stat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom widgets split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance distributions progress bars diagram */}
        <div className="bg-white p-6 rounded-3xl border border-sage-light/40">
          <h3 className="text-base font-bold font-serif text-slate-800 tracking-wide mb-5">
            Proporção de Presença (%)
          </h3>

          <div className="space-y-4">
            {/* Confirmed percentage bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-sage-green">Confirmados: {grandTotalPeopleConfirmed} pessoas</span>
                <span className="text-pink-dark">{totalRsvpResponses > 0 ? Math.round((confirmedMainGuests / totalRsvpResponses) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100/70 rounded-full h-3">
                <div 
                  className="bg-pink-soft h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${totalRsvpResponses > 0 ? (confirmedMainGuests / totalRsvpResponses) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Maybe percentage bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#a88d55]">Talvez: {totalMaybe} titular(es)</span>
                <span>{totalRsvpResponses > 0 ? Math.round((totalMaybe / totalRsvpResponses) * 105) / 100 : 0}%</span>
              </div>
              <div className="w-full bg-gray-100/70 rounded-full h-3">
                <div 
                  className="bg-amber-350 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${totalRsvpResponses > 0 ? (totalMaybe / totalRsvpResponses) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Declined percentage bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-500">Não vão: {totalDeclined} titular(es)</span>
                <span>{totalRsvpResponses > 0 ? Math.round((totalDeclined / totalRsvpResponses) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100/70 rounded-full h-3">
                <div 
                  className="bg-gray-300 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${totalRsvpResponses > 0 ? (totalDeclined / totalRsvpResponses) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-sage-light/10 p-4 border border-sage-light/40 rounded-2xl mt-6 text-[11px] text-gray-500 leading-relaxed">
            🌿 <strong>Dica do Bosque:</strong> Utilize estes números para ajustar a quantidade de lembrancinhas, docinhos, salgados e buffet. Considerar uma margem de quebra de 10% a 15% é uma boa prática!
          </div>
        </div>

        {/* Recent Responses logs list */}
        <div className="bg-white p-6 rounded-3xl border border-sage-light/40 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-serif text-slate-800 tracking-wide mb-5">
              Últimas 5 Respostas Recebidas
            </h3>

            {recentRsvps.length > 0 ? (
              <div className="space-y-3.5">
                {recentRsvps.map((r, i) => (
                  <div key={r.id || i} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{r.guest_name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {r.phone ? `WhatsApp: ${r.phone}` : 'Não informou telefone'}
                        {r.has_companions && ` • +${r.companions_count} acompanhante(s)`}
                      </p>
                    </div>

                    <div>
                      {r.attendance_status === 'confirmed' && (
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          Sim, vou
                        </span>
                      )}
                      {r.attendance_status === 'maybe' && (
                        <span className="bg-amber-50 text-amber-800 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          Talvez
                        </span>
                      )}
                      {r.attendance_status === 'declined' && (
                        <span className="bg-red-50 text-red-800 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          Não vou
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-gray-400 font-medium">
                Nenhuma confirmação respondida até o momento. 🍃
              </div>
            )}
          </div>

          <div className="mt-4 text-right">
            <span className="text-[10px] text-[#E66C86] font-bold flex items-center justify-end gap-1 select-none cursor-help">
              <Sparkles size={11} className="animate-spin text-amber-400" />
              <span>Dados atualizados online</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
