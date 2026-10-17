import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { formatPrice, MERCADO_LIBRE_URL } from '../products.ts';
import { ArrowRight, Zap, ShieldCheck, ShoppingBag, ExternalLink, Headphones, Award, CheckCircle2 } from 'lucide-react';

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
      {/* Background Gradient & Dynamic Depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#00609c] via-[#007cbd] to-[#0092d6] pointer-events-none"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 98%, 0 100%)'
        }}
      />
      
      {/* Subtle light effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-cyan-300/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-12 sm:pb-16 relative z-10">
        
        {/* Top Banner Alert inside Hero: Special Canva Pro S/ 10 Offer */}
        <div className="mb-6 flex justify-center lg:justify-start">
          <div 
            onClick={() => navigateToProduct('canva-pro-12-meses')}
            className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400/90 via-amber-300 to-yellow-400 text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer border border-amber-200 active:scale-98 group"
          >
            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              OFERTA FLASH
            </span>
            <span className="font-extrabold text-slate-900">
              Canva Pro (12 Meses) a solo <span className="underline decoration-2">{formatPrice(10)}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-800 hidden sm:inline">
              (Antes S/ 79.00 • -87% OFF)
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Floating Showcase Cards */}
          <div className="lg:col-span-6 flex items-center justify-center order-2 lg:order-1 pt-2 lg:pt-0">
            <div className="relative flex items-center justify-center gap-2.5 sm:gap-3.5 max-w-lg w-full flex-wrap sm:flex-nowrap">
              
              {/* Card 1: Canva Pro 12 Meses (Super Offer) */}
              <div 
                onClick={() => navigateToProduct('canva-pro-12-meses')}
                className="w-28 sm:w-36 bg-white rounded-xl shadow-2xl p-2.5 sm:p-3 text-center transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-amber-400 shrink-0 text-slate-900 relative group"
              >
                <div className="absolute -top-2.5 -right-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs uppercase">
                  -87% OFF
                </div>
                <div className="w-full aspect-square bg-slate-50 rounded-lg p-1.5 mb-1.5 flex items-center justify-center">
                  <img 
                    src="/products/canva-pro.webp" 
                    alt="Canva Pro"
                    onError={(e) => { e.currentTarget.src = '/products/canva-pro.png'; }}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs"
                  />
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-900 truncate">Canva Pro 12M</div>
                <div className="text-xs sm:text-sm font-black text-rose-600 mt-0.5">{formatPrice(10)}</div>
                <div className="text-[9px] text-slate-400 line-through">{formatPrice(79)}</div>
              </div>

              {/* Card 2: Office 2024 Pro (Center prominent) */}
              <div 
                onClick={() => navigateToProduct('office-2024-pro-plus')}
                className="w-32 sm:w-40 bg-white rounded-xl shadow-2xl p-3 sm:p-3.5 text-center transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-cyan-400 z-10 shrink-0 -translate-y-2 sm:-translate-y-3 text-slate-900"
              >
                <div className="w-full aspect-square bg-slate-50 rounded-lg p-2 mb-1.5 flex items-center justify-center">
                  <img 
                    src="/products/office-2024.webp" 
                    alt="Office 2024 Pro"
                    onError={(e) => { e.currentTarget.src = '/products/office-2024.png'; }}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs"
                  />
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">Office 2024 Pro</div>
                <div className="text-xs sm:text-sm font-extrabold text-[#0070ba] mt-0.5">{formatPrice(27)}</div>
                <div className="text-[9.5px] text-emerald-600 font-bold">Permanente</div>
              </div>

              {/* Card 3: Windows 11 Pro */}
              <div 
                onClick={() => navigateToProduct('windows-11-pro-key')}
                className="w-28 sm:w-36 bg-white rounded-xl shadow-xl p-2.5 sm:p-3 text-center transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/60 shrink-0 text-slate-900"
              >
                <div className="w-full aspect-square bg-slate-50 rounded-lg p-1.5 mb-1.5 flex items-center justify-center">
                  <img 
                    src="/products/windows-11-pro.webp" 
                    alt="Windows 11 Pro"
                    onError={(e) => { e.currentTarget.src = '/products/windows-11-pro.png'; }}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs"
                  />
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-900 truncate">Windows 11 Pro</div>
                <div className="text-xs sm:text-sm font-extrabold text-[#0070ba] mt-0.5">{formatPrice(20)}</div>
                <div className="text-[9.5px] text-emerald-600 font-bold">Oficial OEM</div>
              </div>

            </div>
          </div>

          {/* Right Column: Main Typography & Call To Actions */}
          <div className="lg:col-span-6 text-center lg:text-left order-1 lg:order-2">
            
            {/* Badges: Envío Digital & Mercado Libre */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-300/40 text-cyan-100 text-xs font-bold tracking-wide uppercase backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
                <span>Envío Digital 10-30 min</span>
              </div>

              <a
                href={MERCADO_LIBRE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600] text-[#2D3277] text-xs font-black tracking-wide uppercase shadow-xs hover:bg-[#fff066] transition-colors"
                title="Visitar tienda oficial en Mercado Libre"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#2D3277]" />
                <span>Mercado Libre Líder Gold</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>

            {/* Massive Bold Headline: TU SOFTWARE LISTO EN MINUTOS */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-4 sm:mb-6 drop-shadow-xs">
              <span className="block text-white">TU SOFTWARE</span>
              <span className="block text-[#FFC107]">LISTO EN MINUTOS</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-cyan-50 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-7">
              Licencias digitales oficiales de Windows, Microsoft Office y suscripciones profesionales como Canva Pro a S/ 10 con activación garantizada y soporte técnico personalizado en Perú.
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
                id="hero-canva-btn"
                onClick={() => navigateToProduct('canva-pro-12-meses')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer flex items-center justify-center active:scale-95 border border-amber-300"
              >
                <span>Canva Pro a S/ 10</span>
              </button>
            </div>

            {/* Trust badge under buttons without star icons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-bold text-cyan-100">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>+100 Licencias verificadas con soporte directo en Perú</span>
              </span>
            </div>

          </div>

        </div>

        {/* Sección de 'Sellos de Garantía' */}
        <div className="mt-10 sm:mt-14 pt-8 border-t border-white/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-cyan-200 text-xs font-black tracking-wider uppercase border border-white/25 self-start">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Sellos de Garantía Oficial UpClic</span>
            </div>
            <span className="text-xs text-cyan-100 font-medium">
              Compra 100% protegida y garantizada
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* Sello 1: Garantía de Activación */}
            <div className="bg-white/10 hover:bg-white/15 transition-all duration-300 rounded-2xl p-4 sm:p-4.5 border border-white/20 shadow-lg backdrop-blur-sm flex items-start gap-3.5 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.2] text-white" />
              </div>
              <div>
                <div className="text-[10.5px] font-black tracking-wider uppercase text-emerald-300 mb-0.5">
                  100% Garantizado
                </div>
                <h3 className="text-sm sm:text-[15px] font-black text-white leading-tight">
                  Garantía de Activación
                </h3>
                <p className="text-xs text-cyan-100/90 mt-1 leading-snug">
                  Activación inmediata garantizada con soporte directo o reemplazo de clave.
                </p>
              </div>
            </div>

            {/* Sello 2: Soporte 24/7 WhatsApp */}
            <div className="bg-white/10 hover:bg-white/15 transition-all duration-300 rounded-2xl p-4 sm:p-4.5 border border-white/20 shadow-lg backdrop-blur-sm flex items-start gap-3.5 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Headphones className="w-6 h-6 stroke-[2.2] text-slate-900" />
              </div>
              <div>
                <div className="text-[10.5px] font-black tracking-wider uppercase text-amber-300 mb-0.5">
                  Atención en Perú
                </div>
                <h3 className="text-sm sm:text-[15px] font-black text-white leading-tight">
                  Soporte 24/7 en Vivo
                </h3>
                <p className="text-xs text-cyan-100/90 mt-1 leading-snug">
                  Asistencia técnica rápida y personalizada por WhatsApp durante tu instalación.
                </p>
              </div>
            </div>

            {/* Sello 3: Licencia 100% Original */}
            <div className="bg-white/10 hover:bg-white/15 transition-all duration-300 rounded-2xl p-4 sm:p-4.5 border border-white/20 shadow-lg backdrop-blur-sm flex items-start gap-3.5 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6 stroke-[2.2] text-white" />
              </div>
              <div>
                <div className="text-[10.5px] font-black tracking-wider uppercase text-cyan-300 mb-0.5">
                  Software Oficial
                </div>
                <h3 className="text-sm sm:text-[15px] font-black text-white leading-tight">
                  Licencia Original
                </h3>
                <p className="text-xs text-cyan-100/90 mt-1 leading-snug">
                  Software legítimo y validado con los servidores oficiales de Microsoft.
                </p>
              </div>
            </div>

            {/* Sello 4: Entrega Inmediata */}
            <div className="bg-white/10 hover:bg-white/15 transition-all duration-300 rounded-2xl p-4 sm:p-4.5 border border-white/20 shadow-lg backdrop-blur-sm flex items-start gap-3.5 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 stroke-[2.2] text-white" />
              </div>
              <div>
                <div className="text-[10.5px] font-black tracking-wider uppercase text-rose-300 mb-0.5">
                  Envío Inmediato
                </div>
                <h3 className="text-sm sm:text-[15px] font-black text-white leading-tight">
                  Entrega 10-30 min
                </h3>
                <p className="text-xs text-cyan-100/90 mt-1 leading-snug">
                  Recepción de claves de activación y enlaces de descarga directo a tu WhatsApp.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
