import { EventSettings } from '../types/database';
import { CalendarHeart, Gift, MapPin, MessageSquare } from 'lucide-react';

interface ActionButtonsProps {
  settings: EventSettings;
  onOpenRsvp: () => void;
  onScrollToWall: () => void;
  onOpenGifts: () => void;
}

export default function ActionButtons({ settings, onOpenRsvp, onScrollToWall, onOpenGifts }: ActionButtonsProps) {
  const buttonColor = settings.button_color || '#E66C86';
  const textColor = settings.text_color || '#4A3B32';

  const handleOpenMaps = () => {
    if (settings.maps_url) {
      window.open(settings.maps_url, '_blank', 'referrerPolicy=no-referrer');
    } else {
      alert('Link de localização não cadastrado ainda!');
    }
  };

  const handleOpenGifts = () => {
    onOpenGifts();
  };

  return (
    <div className="grid grid-cols-4 gap-2 py-6 max-w-md mx-auto justify-items-center select-none" id="action-buttons-section">
      {/* RSVP Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={onOpenRsvp}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95 focus:outline-none"
          style={{ backgroundColor: buttonColor }}
          title="Confirmar Presença"
          id="btn-rsvp-confirm"
        >
          <CalendarHeart size={24} />
        </button>
        <span className="text-[10px] sm:text-xs font-bold text-center mt-2" style={{ color: textColor }}>
          Confirmar<br />Presença
        </span>
      </div>

      {/* Google Maps Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleOpenMaps}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95 focus:outline-none"
          style={{ backgroundColor: buttonColor }}
          title="Como Chegar"
          id="btn-maps-location"
        >
          <MapPin size={24} />
        </button>
        <span className="text-[10px] sm:text-xs font-bold text-center mt-2" style={{ color: textColor }}>
          Como<br />Chegar
        </span>
      </div>

      {/* Present Suggestions Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleOpenGifts}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95 focus:outline-none"
          style={{ backgroundColor: buttonColor }}
          title="Lista de Presentes"
          id="btn-gifts-register"
        >
          <Gift size={24} />
        </button>
        <span className="text-[10px] sm:text-xs font-bold text-center mt-2" style={{ color: textColor }}>
          Sugestão de<br />Presente
        </span>
      </div>

      {/* Message Wall Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={onScrollToWall}
          disabled={!settings.enable_wall}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95 focus:outline-none ${!settings.enable_wall ? 'opacity-40 cursor-not-allowed' : ''}`}
          style={{ backgroundColor: buttonColor }}
          title="Mural de Carinho"
          id="btn-messages-mural"
        >
          <MessageSquare size={24} />
        </button>
        <span className="text-[10px] sm:text-xs font-bold text-center mt-2" style={{ color: textColor }}>
          Mural de<br />Carinho
        </span>
      </div>
    </div>
  );
}
