import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { formatPrice } from '../products.ts';
import { ArrowRight, ShieldCheck, Zap, Headphones, CheckCircle2, Check, ExternalLink } from 'lucide-react';

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

  return (
    <section id="hero-section" className="relative bg-white text-[#0B1F3A] pt-12 pb-16 sm:pt-18 sm:pb-20 border-b border-slate-200 font-sans overflow-hidden">
      
      {/* Subtle background tech ambient gradients */}
      <div className="absolute top-0 right-1/4 w-[550px] h-[550px] bg-blue-50/70 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-slate-100/80 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0067B8] text-xs font-bold tracking-wide uppercase mb-6">
          <ShieldCheck className="w-4 h-4 text-[#0067B8]" />
          <span>Tienda Especializada en Software Original</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1F3A] tracking-tight leading-[1.12] mb-6">
          Licencias digitales originales para potenciar tu productividad
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
          Software profesional para empresas, estudiantes y usuarios que buscan soluciones rápidas, seguras y confiables.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
          <button
            id="hero-buy-now-btn"
            onClick={() => handleScrollTo('destacados-section')}
            className="px-7 py-3.5 rounded-lg bg-[#0067B8] hover:bg-[#005499] text-white font-bold text-sm sm:text-base transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>Comprar ahora</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            id="hero-catalog-btn"
            onClick={() => handleScrollTo('catalogo-section', 'all')}
            className="px-7 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-[#0B1F3A] font-bold text-sm sm:text-base border border-slate-300 hover:border-slate-400 transition-all duration-150 cursor-pointer shadow-xs active:scale-95"
          >
            <span>Ver catálogo</span>
          </button>
        </div>

        {/* Micro assurances */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Activación directa garantizada</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Entrega en 5-15 minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#0067B8] shrink-0" />
            <span>Soporte personalizado</span>
          </div>
        </div>

      </div>
    </section>
  );
};
