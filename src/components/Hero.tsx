import React from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext.tsx';
import { WHATSAPP_NUMBER } from '../products.ts';
import { ProductCategory } from '../types.ts';
import {
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveCategory, navigateToHome, currentPath } = useCart();

  const handleGoToCatalog = (category: ProductCategory = 'all') => {
    setActiveCategory(category);
    if (currentPath !== '/') {
      navigateToHome();
    }
    setTimeout(() => {
      const el = document.getElementById('catalogo-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  const handleWhatsAppSupport = () => {
    const text = 'Hola UpClic, deseo información sobre licencias de programas y alquiler de cuentas premium.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="hero-section"
      className="bg-[#F4F7FB] text-[#475569] font-sans pt-6 pb-8 sm:pt-9 sm:pb-10 border-b border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10 shadow-2xs"
        >
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F0FF] text-[#1457C9] text-[12px] font-bold tracking-[0.04em] uppercase">
                <ShieldCheck className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span>Licencias de Programas &amp; Cuentas Premium</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0B7A64] bg-[#DDF5EF] px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#0B7A64] animate-pulse" />
                <span>Entrega digital activa 24/7</span>
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0B1F3A] tracking-[-0.025em] leading-[1.14] mb-3.5 [text-wrap:balance]">
              Venta de Licencias de Programas y{' '}
              <span className="text-[#1668E3]">Alquiler de Cuentas Premium</span>
            </h1>

            <p className="text-sm sm:text-[16px] text-[#475569] leading-[1.6] max-w-2xl">
              Adquiere licencias permanentes de{' '}
              <strong className="font-semibold text-[#0B1F3A]">
                Diseño, Microsoft Office, Windows y Productividad
              </strong>
              , o activa suscripciones de cuentas premium verificadas en tu correo personal con garantía y soporte paso a paso.
            </p>

            <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-[13px] font-semibold text-[#475569]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0B7A64] shrink-0" strokeWidth={2} />
                <span>Activación 100% garantizada</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0B7A64] shrink-0" strokeWidth={2} />
                <span>Guía de instalación paso a paso</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0B7A64] shrink-0" strokeWidth={2} />
                <span>Factura electrónica disponible</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:min-w-[250px]">
            <button
              type="button"
              id="hero-ver-catalogo-btn"
              onClick={() => handleGoToCatalog('all')}
              className="group w-full px-6 py-3.5 min-h-[48px] rounded-[14px] bg-[#E8440A] hover:bg-[#cf3b07] text-white font-bold text-sm sm:text-[15px] transition-all shadow-xs hover:shadow-md cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" strokeWidth={2} />
            </button>

            <button
              type="button"
              id="hero-whatsapp-support-btn"
              onClick={handleWhatsAppSupport}
              className="w-full px-6 py-3.5 min-h-[48px] rounded-[14px] bg-[#EEF4FF] hover:bg-[#DCE9FF] text-[#1668E3] font-semibold text-sm sm:text-[15px] transition-colors cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span>Asesoría por WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
