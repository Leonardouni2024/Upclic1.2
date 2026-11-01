import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../products';

export const WhatsAppButton: React.FC = () => {
  const { language } = useCart();
  const message =
    language === 'EN'
      ? 'Hello UPCLIC, I would like information about your digital products.'
      : 'Hola UPCLIC, quiero información sobre sus productos digitales.';

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[85] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="font-bold text-sm hidden md:block whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
};

