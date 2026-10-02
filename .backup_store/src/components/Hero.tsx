import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { formatPrice } from '../products.ts';
import { ArrowRight, Zap, Star } from 'lucide-react';

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
    <section id="hero-section" className="relative bg-[#0088cc] text-white font-sans overflow-hidden">
      {/* Background Gradient & Dynamic Angle */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#0070ba] via-[#008cd2] to-[#00a2e8] pointer-events-none"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)'
        }}
      />
      
      {/* Subtle light effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-300/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 sm:pt-14 sm:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 3 Tilted Floating Product Cards in Pure White */}
          <div className="lg:col-span-6 flex items-center justify-center order-2 lg:order-1 pt-4 lg:pt-0">
            <div className="relative flex items-center justify-center gap-3 sm:gap-4 max-w-lg w-full">
              
              {/* Card 1: Windows 11 Pro (tilted left) */}
              <div 
                onClick={() => navigateToProduct('windows-11-pro-key')}
                className="w-32 sm:w-40 bg-white rounded-xl shadow-xl p-3 sm:p-3.5 text-center transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/60 shrink-0 text-slate-900"
              >
                <div className="w-full aspect-square bg-slate-50 rounded-lg p-2 mb-2 flex items-center justify-center">
                  <img 
                    src="/products/windows-11-pro.webp" 
                    alt="Windows 11 Pro"
                    onError={(e) => { e.currentTarget.src = '/products/windows-11-pro.png'; }}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs"
                  />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Windows 11 Pro</div>
                <div className="text-xs sm:text-sm font-extrabold text-[#0070ba] mt-0.5">{formatPrice(20)}</div>
              </div>

              {/* Card 2: Office 2024 Pro (Center prominent) */}
              <div 
                onClick={() => navigateToProduct('office-2024-pro-plus')}
                className="w-36 sm:w-44 bg-white rounded-xl shadow-2xl p-3.5 sm:p-4 text-center transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-cyan-400 z-10 shrink-0 -translate-y-2 sm:-translate-y-3 text-slate-900"
              >
                <div className="w-full aspect-square bg-slate-50 rounded-lg p-2 mb-2 flex items-center justify-center">
                  <img 
                    src="/products/office-2024.webp" 
                    alt="Office 2024 Pro"
                    onError={(e) => { e.currentTarget.src = '/products/office-2024.png'; }}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs"
                  />
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">Office 2024 Pro</div>
                <div className="text-sm sm:text-base font-extrabold text-[#0070ba] mt-0.5">{formatPrice(27)}</div>
              </div>

              {/* Card 3: McAfee Antivirus (tilted right) */}
              <div 
                onClick={() => navigateToProduct('mcafee-antivirus-total-protection-12m')}
                className="w-32 sm:w-40 bg-white rounded-xl shadow-xl p-3 sm:p-3.5 text-center transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/60 shrink-0 text-slate-900"
              >
                <div className="w-full aspect-square bg-slate-50 rounded-lg p-2 mb-2 flex items-center justify-center">
                  <img 
                    src="/products/mcafee-antivirus.webp" 
                    alt="Total Security"
                    onError={(e) => { e.currentTarget.src = '/products/mcafee-antivirus.jpg'; }}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs"
                  />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Total Security</div>
                <div className="text-xs sm:text-sm font-extrabold text-[#0070ba] mt-0.5">{formatPrice(38)}</div>
              </div>

            </div>
          </div>

          {/* Right Column: Main Typography & Call To Actions */}
          <div className="lg:col-span-6 text-center lg:text-left order-1 lg:order-2">
            
            {/* Pill: Envío Digital */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-300/40 text-cyan-100 text-xs font-bold tracking-wide uppercase mb-4 backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
              <span>Envío Digital Inmediato</span>
            </div>

            {/* Massive Bold Headline: TU SOFTWARE LISTO EN MINUTOS */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-6 drop-shadow-xs">
              <span className="block text-white">TU SOFTWARE</span>
              <span className="block text-[#FFC107]">LISTO</span>
              <span className="block text-[#FFC107]">EN MINUTOS</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-cyan-50 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0 mb-7">
              Licencias digitales oficiales de Windows, Microsoft Office y software antivirus con activación garantizada y soporte técnico personalizado en Perú.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6">
              <button
                id="hero-ver-catalogo-btn"
                onClick={() => handleScrollTo('catalogo-section', 'all')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-[#00A3E0] hover:bg-[#0092cc] text-white font-black text-sm sm:text-base transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2 active:scale-95 border border-cyan-300/30"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                id="hero-destacados-btn"
                onClick={() => handleScrollTo('destacados-section')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/40 transition-all duration-150 cursor-pointer backdrop-blur-xs active:scale-95"
              >
                <span>Lo más vendido</span>
              </button>
            </div>

            {/* 5 Stars Rating & Trust text */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-cyan-100">
              <div className="flex text-amber-300">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-300 stroke-none" />
                ))}
              </div>
              <span>4.9 / 5.0 • Calificaciones verificadas en Perú</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
