import React from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext.tsx';
import { formatPrice, WHATSAPP_NUMBER } from '../products.ts';
import {
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  Lock,
  Mail,
  Award,
  Zap,
  Clock,
  FileCheck2,
  KeyRound
} from 'lucide-react';

const bentoTransition = {
  duration: 0.48,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
};

export const Hero: React.FC = () => {
  const { setActiveCategory, navigateToHome, navigateToProduct, currentPath } = useCart();

  const handleScrollTo = (sectionId: string, category?: 'office' | 'windows' | 'combos' | 'all') => {
    if (category) {
      setActiveCategory(category);
    }
    if (currentPath !== '/') {
      navigateToHome();
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleWhatsAppSupport = () => {
    const text = 'Hola UpClic, deseo información y asesoría sobre las licencias originales de Microsoft Office.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="hero-section"
      className="relative bento-bg-pattern text-slate-900 font-sans pt-5 pb-10 sm:pt-9 sm:pb-14 lg:pt-10 lg:pb-16 border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle ambient light radial glow in Microsoft Blue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[90vw] max-w-[780px] h-[300px] rounded-full bg-[#0078d4]/6 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 12-Column Responsive Bento Box Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 auto-rows-auto">
          
          {/* BENTO CELL 1 (Main Value Proposition — Spans full width on Mobile/Tablet, 7 cols & 2 rows on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...bentoTransition, delay: 0 }}
            className="sm:col-span-2 lg:col-span-7 lg:row-span-2 bento-card rounded-3xl p-5 sm:p-8 lg:p-10 xl:p-11 flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              {/* Discreet Floating Badge: Garantía de activación del 100% */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#0078d4]/8 border border-[#0078d4]/20 text-[#0078d4] text-[11px] sm:text-xs font-bold tracking-tight mb-5 sm:mb-6"
              >
                <ShieldCheck className="w-4 h-4 text-[#0078d4] shrink-0" />
                <span>Garantía de activación del 100%</span>
              </motion.div>

              {/* High-Impact Headline */}
              <h1 className="text-2xl sm:text-4xl xl:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.14] mb-4 [text-wrap:balance]">
                Licencias 100% Originales de{' '}
                <span className="text-[#0078d4]">Microsoft Office</span> con Entrega Inmediata
              </h1>

              {/* Concise Subtext: Permanent & Linked to User Account */}
              <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mb-6 sm:mb-8">
                Adquiere software genuino de pago único (<strong className="font-semibold text-slate-800">Office Professional Plus 2024 y 2021</strong>). Tu licencia es permanente de por vida, libre de renovaciones mensuales y se activa de forma limpia y segura en minutos.
              </p>
            </div>

            <div>
              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  id="hero-ver-catalogo-btn"
                  onClick={() => handleScrollTo('destacados-section')}
                  className="group w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-2xl bg-[#d83b01] hover:bg-[#b83201] text-white font-bold text-sm sm:text-base transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Ver Licencias Disponibles</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  id="hero-whatsapp-support-btn"
                  onClick={handleWhatsAppSupport}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-2xl bg-slate-50 hover:bg-[#0078d4]/6 text-slate-800 font-bold text-sm sm:text-base border border-slate-200/90 hover:border-[#0078d4] hover:text-[#0078d4] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#0078d4] shrink-0" />
                  <span>Soporte por WhatsApp</span>
                </motion.button>
              </div>

              {/* Compact Bottom Unboxed Metadata Trust Strip */}
              <div className="mt-6 sm:mt-7 pt-4 sm:pt-5 border-t border-slate-100 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 text-[11px] sm:text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0078d4] shrink-0" />
                  <span>Clave alfanumérica de 25 dígitos</span>
                </span>
                <span aria-hidden="true" className="hidden sm:inline text-slate-300">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0078d4] shrink-0" />
                  <span>Sin pagos recurrentes</span>
                </span>
                <span aria-hidden="true" className="hidden sm:inline text-slate-300">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0078d4] shrink-0" />
                  <span>Factura electrónica disponible</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* BENTO CELL 2 (Flagship Product Spotlight — Spans full width on Mobile/Tablet, 5 cols on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...bentoTransition, delay: 0.08 }}
            whileHover={{ y: -3 }}
            onClick={() => navigateToProduct('office-2024-pro-plus')}
            className="sm:col-span-2 lg:col-span-5 bento-card bento-card-interactive rounded-3xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#d83b01]">
                Más Popular · Edición 2024
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Envío Instantáneo</span>
              </span>
            </div>

            <div className="flex items-center gap-3.5 sm:gap-4 my-1.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl p-2 sm:p-2.5 flex items-center justify-center border border-slate-200/70 shrink-0">
                <img
                  src="/products/office-2024.webp"
                  alt="Office Professional Plus 2024"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = '/products/office-2024.png'; }}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#0078d4] transition-colors leading-snug">
                  Office Professional Plus 2024
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Word · Excel · PowerPoint · Outlook · Access
                </p>
                <p className="text-[11px] font-semibold text-slate-700 mt-1">
                  Licencia Permanente · 1 PC Windows
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
                  {formatPrice(27)}
                </span>
                <span className="text-xs font-semibold text-slate-400 line-through tabular-nums font-mono">
                  {formatPrice(110)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToProduct('office-2021-pro-plus');
                  }}
                  className="text-[11px] font-bold text-slate-600 hover:text-[#0078d4] underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Ver Office 2021 ({formatPrice(25)})
                </button>
                <span className="text-xs font-bold text-[#0078d4] group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1">
                  <span>Comprar</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* BENTO CELL 3 (Instant Delivery Tile — Spans 1 col on Tablet, 2 cols on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...bentoTransition, delay: 0.14 }}
            whileHover={{ y: -3 }}
            className="sm:col-span-1 lg:col-span-2 bento-card rounded-3xl p-5 flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center mb-3 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                &lt; 2 min
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                Entrega Digital
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Clave y guía enviadas directo a tu Email.
              </p>
            </div>
          </motion.div>

          {/* BENTO CELL 4 (100% Originality & Security Tile — Spans 1 col on Tablet, 3 cols on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...bentoTransition, delay: 0.2 }}
            whileHover={{ y: -3 }}
            className="sm:col-span-1 lg:col-span-3 bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0078d4] text-white flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-400 tracking-wide">
                100% Genuino
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug tracking-wide">
                Activación Directa y Segura
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Sin activadores externos. Validación limpia con respaldo total.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 tabular-nums">
                <KeyRound className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
                <span className="truncate">XXXXX-2024P-XXXXX-PRO24</span>
              </div>
            </div>
          </motion.div>

          {/* BENTO CELL 5 (Bottom 3-Pillar Bento Strip — Spans full 12 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...bentoTransition, delay: 0.26 }}
            className="sm:col-span-2 lg:col-span-12 bento-card rounded-3xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100"
          >
            <div className="flex items-center gap-3.5 pt-1 md:pt-0 md:px-2">
              <div className="w-11 h-11 rounded-2xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Licencia Permanente
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Pago único de por vida sin anualidades
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3.5 md:pt-0 md:px-5">
              <div className="w-11 h-11 rounded-2xl bg-[#d83b01]/10 text-[#d83b01] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Envío Automático al Instante
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Clave original enviada a tu correo y WhatsApp
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3.5 md:pt-0 md:px-5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Soporte Técnico y Factura
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Asistencia personalizada paso a paso
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
