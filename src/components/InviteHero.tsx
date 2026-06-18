import { EventSettings } from '../types/database';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CuteFox, CuteBear, CuteRabbit, CuteHedgehog, HandDrawnFlower, HandDrawnLeaf, HandDrawnSprout, HandDrawnMushroom } from './WoodlandAnimals';

interface InviteHeroProps {
  settings: EventSettings;
}

export default function InviteHero({ settings }: InviteHeroProps) {
  // Use customizable colors from settings
  const primaryBgColor = settings.primary_color || '#F4D9E1';
  const textColor = settings.text_color || '#4A3B32';

  return (
    <div className="relative text-center px-4 pt-10 pb-8 rounded-3xl overflow-hidden shadow-sm" style={{ backgroundColor: primaryBgColor }}>
      {/* Decorative leaf/forest branches */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-15 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-emerald-800">
          <path d="M10,0 C30,30 20,70 0,90 C10,60 50,40 10,0 Z M30,10 C50,30 40,60 20,80 C30,50 60,40 30,10 Z" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-15 pointer-events-none select-none scale-x-[-1]">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-emerald-800">
          <path d="M10,0 C30,30 20,70 0,90 C10,60 50,40 10,0 Z M30,10 C50,30 40,60 20,80 C30,50 60,40 30,10 Z" />
        </svg>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute top-10 left-8 text-amber-500 animate-pulse">
        <Sparkles size={16} />
      </div>
      <div className="absolute top-24 right-10 text-amber-500 animate-pulse delay-500">
        <Sparkles size={20} />
      </div>

      {/* Main Illustration Area with Cute Hand-Drawn Animals */}
      <div className="flex justify-center items-end gap-3 sm:gap-6 mb-6 select-none mt-2 h-24">
        {/* Cute Bear */}
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: [0, -4, 0], opacity: 1 }}
          transition={{ 
            y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            opacity: { duration: 0.5, delay: 0.05 }
          }}
          className="scale-[0.8] sm:scale-100 flex flex-col items-center"
        >
          <CuteBear size={80} className="filter drop-shadow-md hover:scale-105 transition-transform duration-300" />
        </motion.div>

        {/* Cute Rabbit */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [0, -6, 0], opacity: 1 }}
          transition={{ 
            y: { repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.2 },
            opacity: { duration: 0.5, delay: 0.1 }
          }}
          className="scale-[0.85] sm:scale-100 flex flex-col items-center -mx-2"
        >
          <CuteRabbit size={85} className="filter drop-shadow-md hover:scale-105 transition-transform duration-300" />
        </motion.div>
        
        {/* Cute Fox */}
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: [0, -5, 0], opacity: 1 }}
          transition={{ 
            y: { repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.4 },
            opacity: { duration: 0.5, delay: 0.15 }
          }}
          className="scale-[0.9] sm:scale-100 flex flex-col items-center -mx-2"
        >
          <CuteFox size={90} className="filter drop-shadow-md hover:scale-105 transition-transform duration-300" />
        </motion.div>

        {/* Cute Hedgehog */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [0, -3, 0], opacity: 1 }}
          transition={{ 
            y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.6 },
            opacity: { duration: 0.5, delay: 0.2 }
          }}
          className="scale-[0.8] sm:scale-100 flex flex-col items-center"
        >
          <CuteHedgehog size={75} className="filter drop-shadow-md hover:scale-105 transition-transform duration-300" />
        </motion.div>
      </div>

      {/* Cute woodland hand-drawn garland border style */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 mb-5 opacity-80">
        <HandDrawnLeaf size={18} />
        <HandDrawnFlower size={18} />
        <HandDrawnSprout size={18} />
        <HandDrawnMushroom size={18} />
        <HandDrawnSprout size={18} />
        <HandDrawnFlower size={18} />
        <HandDrawnLeaf size={18} fill="#62826c" className="scale-x-[-1]" />
      </div>

      {/* Hero Header Message */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        className="text-xs font-semibold uppercase tracking-widest mb-1 italic"
        style={{ color: textColor }}
      >
        {settings.hero_title}
      </motion.p>

      {/* Aniversariante Name & Age */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-3"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: settings.button_color || '#E66C86' }}>
          {settings.birthday_name}
        </h1>
        <div className="inline-block px-4 py-1 mt-2 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-sm" style={{ backgroundColor: settings.button_color || '#E66C86' }}>
          ✨ {settings.birthday_age} ✨
        </div>
      </motion.div>

      {/* Invitation Description */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-sm max-w-md mx-auto leading-relaxed px-4 font-medium mb-6"
        style={{ color: textColor }}
      >
        {settings.invite_text}
      </motion.p>

      {/* Event Details Grid */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-3 gap-2 max-w-sm mx-auto bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-white/50 shadow-xs"
      >
        {/* Weekday */}
        <div className="flex flex-col items-center justify-center p-2 border-r border-[#E66C86]/20">
          <Calendar size={18} className="mb-1 text-emerald-700" />
          <p className="text-[11px] uppercase tracking-wide font-extrabold opacity-60" style={{ color: textColor }}>Dia</p>
          <p className="text-sm font-bold truncate" style={{ color: textColor }}>{settings.weekday}</p>
        </div>

        {/* Date */}
        <div className="flex flex-col items-center justify-center p-2 border-r border-[#E66C86]/20">
          <div className="w-2 h-2 rounded-full bg-red-400 absolute top-2 animate-ping" />
          <p className="text-[11px] uppercase tracking-wide font-extrabold opacity-60" style={{ color: textColor }}>Data</p>
          <p className="text-base font-extrabold" style={{ color: settings.button_color }}>{settings.event_date}</p>
        </div>

        {/* Time */}
        <div className="flex flex-col items-center justify-center p-2">
          <Clock size={18} className="mb-1 text-emerald-700" />
          <p className="text-[11px] uppercase tracking-wide font-extrabold opacity-60" style={{ color: textColor }}>Hora</p>
          <p className="text-sm font-bold truncate" style={{ color: textColor }}>{settings.event_time}</p>
        </div>
      </motion.div>

      {/* Address Block */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-5 flex items-center justify-center gap-1.5 px-4"
      >
        <MapPin size={14} className="text-emerald-700 shrink-0" />
        <p className="text-[11px] font-medium max-w-xs truncate" style={{ color: textColor }}>
          {settings.address}
        </p>
      </motion.div>
    </div>
  );
}
