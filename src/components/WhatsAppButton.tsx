import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const phoneNumber = "51999999999"; // Can be replaced later by the user
  const message = "Hola, estoy interesado en comprar una licencia en UpClic y tengo una consulta.";
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[85] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer animate-in fade-in slide-in-from-bottom-5"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="font-bold text-sm hidden md:block group-hover:block whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out">
        ¿Dudas? Escríbenos
      </span>
    </a>
  );
};
