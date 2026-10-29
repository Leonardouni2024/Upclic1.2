import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext.tsx';
import { formatPrice, products, WHATSAPP_NUMBER } from '../products.ts';
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
  KeyRound,
  ShoppingCart
} from 'lucide-react';

const bentoTransition = {
  duration: 0.48,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
};

interface SpotlightEdition {
  key: '2024' | '2021' | 'combo';
  tabLabel: string;
  productId: string;
  slug: string;
  kicker: string;
  title: string;
  appsLine: string;
  specLine: string;
  price: number;
  oldPrice: number;
  imageUrl: string;
  fallbackImage: string;
}

const SUITE_APPS = [
  { code: 'W', name: 'Word', color: '#185abd' },
  { code: 'X', name: 'Excel', color: '#107c41' },
  { code: 'P', name: 'PowerPoint', color: '#d24726' },
  { code: 'O', name: 'Outlook', color: '#0078d4' },
  { code: 'A', name: 'Access', color: '#a4373a' },
  { code: 'N', name: 'OneNote', color: '#7719aa' }
];

const SPOTLIGHT_EDITIONS: SpotlightEdition[] = [
  {
    key: '2024',
    tabLabel: 'Office 2024 Pro',
    productId: 'prod-office-2024',
    slug: 'office-2024-pro-plus',
    kicker: 'Más Popular · Edición 2024',
    title: 'Office Professional Plus 2024',
    appsLine: 'Word · Excel · PowerPoint · Outlook · Access',
    specLine: 'Licencia Permanente · 1 PC Windows 10/11',
    price: 27,
    oldPrice: 110,
    imageUrl: '/products/office-2024.webp',
    fallbackImage: '/products/office-2024.png'
  },
  {
    key: '2021',
    tabLabel: 'Office 2021 Pro',
    productId: 'prod-office-2021',
    slug: 'office-2021-pro-plus',
    kicker: 'Alta Estabilidad · Edición 2021',
    title: 'Office Professional Plus 2021',
    appsLine: 'Word · Excel · PowerPoint · Outlook · Access',
    specLine: 'Licencia Permanente · 1 PC Windows 10/11',
    price: 25,
    oldPrice: 110,
    imageUrl: '/products/office-2021.webp',
    fallbackImage: '/products/office-2021.png'
  },
  {
    key: 'combo',
    tabLabel: 'Pack Win 11 + Office',
    productId: 'prod-combo-win11-off24',
    slug: 'pack-windows-11-pro-office-2024-pro-plus',
    kicker: 'Ahorro Máximo · Pack Completo',
    title: 'Windows 11 Pro + Office 2024 Pro',
    appsLine: 'Sistema Operativo Oficial + Suite Completa',
    specLine: '2 Claves Permanentes · 1 PC Windows',
    price: 45,
    oldPrice: 160,
    imageUrl: '/products/combo-2024.webp',
    fallbackImage: '/products/combo-2024.png'
  }
];

export const Hero: React.FC = () => {
  const { setActiveCategory, navigateToHome, navigateToProduct, addItem, navigateToCheckout, currentPath } = useCart();
  const [selectedEditionKey, setSelectedEditionKey] = useState<'2024' | '2021' | 'combo'>('2024');

  const activeEdition = SPOTLIGHT_EDITIONS.find(e => e.key === selectedEditionKey) || SPOTLIGHT_EDITIONS[0];

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

  const handleQuickBuySpotlight = (e: React.MouseEvent) => {
    e.stopPropagation();
    const found = products.find(p => p.id === activeEdition.productId);
    if (found) {
      addItem(found, 1);
      navigateToCheckout();
    } else {
      navigateToProduct(activeEdition.slug);
    }
  };

  return (
    <section
      id="hero-section"
      className="relative bento-bg-pattern text-slate-900 font-sans pt-5 pb-10 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16 border-b border-slate-200/80 overflow-hidden"
    >
      {/* Ambient radial light glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/3 -translate-x-1/2 w-[90vw] max-w-[760px] h-[320px] rounded-full bg-[#0078d4]/7 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 right-0 w-[340px] h-[260px] rounded-full bg-[#d83b01]/5 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 12-Column Responsive Bento Box Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 auto-rows-auto">
          
          {/* BENTO CELL 1 (Main Value Proposition — Spans full width on Mobile/Tablet, 7 cols & 2 rows on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...bentoTransition, delay: 0 }}
            className="sm:col-span-2 lg:col-span-7 lg:row-span-2 bento-card rounded-3xl p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Subtle decorative corner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#0078d4]/10 via-[#0078d4]/4 to-transparent blur-2xl"
            />

            <div className="relative">
              {/* Top Row: Floating Guarantee Badge & Live Dispatch Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-5 sm:mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#0078d4]/8 border border-[#0078d4]/20 text-[#0078d4] text-[11px] sm:text-xs font-bold tracking-tight"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0078d4] shrink-0" />
                  <span>Garantía de activación del 100%</span>
                </motion.div>

                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Despacho digital activo 24/7</span>
                </span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-2xl sm:text-4xl xl:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.13] mb-4 [text-wrap:balance]">
                Licencias 100% Originales de{' '}
                <span className="text-[#0078d4]">Microsoft Office</span> con Entrega Inmediata
              </h1>

              {/* Concise Subtext: Permanent & Linked */}
              <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mb-5 sm:mb-6">
                Adquiere software genuino de pago único (<strong className="font-semibold text-slate-800">Office Professional Plus 2024 y 2021</strong>). Tu licencia es permanente de por vida, libre de renovaciones mensuales y se activa de forma directa y segura en minutos.
              </p>

              {/* Visual Suite Applications Strip */}
              <div className="mb-6 sm:mb-7 p-3 sm:p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/80">
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Suite Completa Professional Plus incluida:
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {SUITE_APPS.map((app) => (
                    <div
                      key={app.code}
                      className="inline-flex items-center gap-1.5 pr-2.5 pl-1.5 py-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                    >
                      <span
                        style={{ backgroundColor: app.color }}
                        className="w-5 h-5 rounded-md text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 font-mono"
                      >
                        {app.code}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-700">
                        {app.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
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
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-2xl bg-white hover:bg-[#0078d4]/6 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 hover:border-[#0078d4] hover:text-[#0078d4] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#0078d4] shrink-0" />
                  <span>Soporte por WhatsApp</span>
                </motion.button>
              </div>

              {/* Compact Bottom Unboxed Metadata Trust Strip */}
              <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 text-[11px] sm:text-xs font-semibold text-slate-600">
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

          {/* BENTO CELL 2 (Interactive Flagship Edition Switcher — Spans full width on Mobile/Tablet, 5 cols on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...bentoTransition, delay: 0.08 }}
            className="sm:col-span-2 lg:col-span-5 bento-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              {/* Interactive Edition Switcher Tabs */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Selector Rápido de Edición
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Stock Inmediato</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#f8fafc] border border-slate-200/80 mb-4">
                {SPOTLIGHT_EDITIONS.map((ed) => {
                  const isSelected = ed.key === selectedEditionKey;
                  return (
                    <button
                      key={ed.key}
                      type="button"
                      onClick={() => setSelectedEditionKey(ed.key)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer truncate ${
                        isSelected
                          ? 'bg-[#0078d4] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      {ed.tabLabel}
                    </button>
                  );
                })}
              </div>

              {/* Animated Edition Preview */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEdition.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigateToProduct(activeEdition.slug)}
                  className="flex items-center gap-3.5 sm:gap-4 p-3 rounded-2xl bg-[#f8fafc]/80 hover:bg-[#f8fafc] border border-slate-200/60 cursor-pointer group transition-colors"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 flex items-center justify-center border border-slate-200/70 shrink-0 shadow-2xs">
                    <img
                      src={activeEdition.imageUrl}
                      alt={activeEdition.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.src = activeEdition.fallbackImage; }}
                      className="max-h-full max-w-full object-contain group-hover:scale-106 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#d83b01] mb-0.5">
                      {activeEdition.kicker}
                    </div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#0078d4] transition-colors leading-snug truncate">
                      {activeEdition.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {activeEdition.appsLine}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                      {activeEdition.specLine}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
                    {formatPrice(activeEdition.price)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 line-through tabular-nums font-mono">
                    {formatPrice(activeEdition.oldPrice)}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700">
                  Ahorras {Math.round(((activeEdition.oldPrice - activeEdition.price) / activeEdition.oldPrice) * 100)}% hoy · Pago único
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateToProduct(activeEdition.slug)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Ver ficha
                </button>
                <button
                  type="button"
                  onClick={handleQuickBuySpotlight}
                  className="px-3.5 py-2 rounded-xl bg-[#0078d4] hover:bg-[#0062ad] text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                  <span>Comprar</span>
                </button>
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
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                &lt; 2 min
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                Entrega Digital
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Clave y guía enviadas directo a tu Email y WhatsApp.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-emerald-700">
                <span>Automatizado</span>
                <span className="font-mono">24/7</span>
              </div>
            </div>
          </motion.div>

          {/* BENTO CELL 4 (100% Originality & Security Tile — Spans 1 col on Tablet, 3 cols on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...bentoTransition, delay: 0.2 }}
            whileHover={{ y: -3 }}
            className="sm:col-span-1 lg:col-span-3 sleek-glass-dark text-white rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0078d4] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>100% Genuino</span>
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug tracking-wide">
                Activación Directa y Segura
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Sin programas externos. Validación oficial con respaldo técnico total.
              </p>
              <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2 text-[11px] font-mono text-cyan-300 tabular-nums">
                <span className="inline-flex items-center gap-1.5 min-w-0">
                  <KeyRound className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
                  <span className="truncate">XXXXX-2024P-XXXXX-PRO24</span>
                </span>
                <span className="text-[10px] font-sans font-bold text-emerald-400 shrink-0">
                  VALIDADA
                </span>
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
              <div className="w-11 h-11 rounded-2xl bg-[#0078d4]/10 border border-[#0078d4]/20 text-[#0078d4] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Licencia Permanente Vitalicia
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Pago único de por vida sin cargos ocultos ni anualidades
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3.5 md:pt-0 md:px-5">
              <div className="w-11 h-11 rounded-2xl bg-[#d83b01]/10 border border-[#d83b01]/20 text-[#d83b01] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Envío Automático al Instante
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Clave original de 25 dígitos enviada a tu correo y WhatsApp
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3.5 md:pt-0 md:px-5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Soporte Técnico y Factura
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Asistencia personalizada paso a paso y comprobante electrónico
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
