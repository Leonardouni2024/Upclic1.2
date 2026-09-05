import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { Check, ShieldCheck, Zap, Sparkles, MessageCircle, CreditCard } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveCategory, navigateToHome, currentPath } = useCart();

  const handleFilter = (category: 'office' | 'windows') => {
    setActiveCategory(category);
    if (currentPath !== '/') {
      navigateToHome();
    }
    const el = document.getElementById('catalogo-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-section" className="relative overflow-hidden bg-linear-to-b from-white via-slate-50/60 to-slate-100/40 py-12 sm:py-20 border-b border-slate-200/80">
      {/* Decorative sleek ambient glow */}
      <div className="absolute -top-32 right-1/4 w-[480px] h-[480px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-cyan-400/8 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner destacado: COMPRA 2 O MÁS PRODUCTOS Y OBTÉN 10% DE DESCUENTO O USA PRIMUPCLIC PARA 10% */}
        <div className="mb-5 sm:mb-6 flex justify-center">
          <div
            id="promo-discount-banner"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-linear-to-r from-[#0066FF] to-[#0047BA] text-white text-[10px] xs:text-[11px] sm:text-xs font-black shadow-xs shadow-blue-500/20 border border-blue-400/30 uppercase tracking-wider text-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
            <span>🔥 10% OFF automático llevando 2 o más productos</span>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          {/* Título Principal */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight leading-tight sm:leading-tight">
            Software Original y Seguro <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0066FF] via-[#0284c7] to-[#0047BA]">
              para Profesionales
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="mt-3 sm:mt-5 text-sm xs:text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Windows, Office, Project, Visio y más. Entrega digital inmediata y garantía total.
          </p>

          {/* Action Buttons: Ver Catálogo Microsoft / Explorar Software */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <button
              id="btn-hero-office"
              onClick={() => handleFilter('office')}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm md:text-base shadow-sm shadow-[#0066FF]/25 hover:shadow-md hover:shadow-[#0066FF]/35 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-98 cursor-pointer flex items-center gap-2 border border-blue-500/20"
            >
              <span>Ver Office</span>
              <span className="text-blue-200 transition-transform group-hover:translate-x-0.5">→</span>
            </button>

            <button
              id="btn-hero-windows"
              onClick={() => handleFilter('windows')}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm md:text-base border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all duration-200 transform hover:-translate-y-0.5 active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>Ver Windows</span>
              <span className="text-slate-400">→</span>
            </button>
          </div>

          {/* Visual Trust Indicators */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-slate-700">Productos digitales</span>
            </div>

            <div className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-slate-700">Pago con Mercado Pago</span>
            </div>

            <div className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-slate-700">Atención personalizada</span>
            </div>

            <div className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <span className="text-[11px] font-black">S/</span>
              </div>
              <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-slate-700">Precios en soles (PEN)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
