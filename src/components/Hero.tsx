import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Laptop, FileSpreadsheet, Layers, BarChart3, Cloud, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveCategory, navigateToHome, currentPath } = useCart();

  const handleFilter = (category: 'office' | 'windows' | 'combos' | 'project-visio' | 'all') => {
    setActiveCategory(category);
    if (currentPath !== '/') {
      navigateToHome();
    }
    setTimeout(() => {
      const el = document.getElementById('catalogo-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section id="hero-section" className="relative bg-gradient-to-b from-[#2e0c66] via-[#3a137e] to-[#250953] text-white pt-6 pb-10 border-b border-white/10 overflow-hidden font-sans">
      {/* Decorative Eneba ambient lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Banners Layout (Eneba Style: Big Banner Left + 3 Stacked Cards Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Main Big Hero Banner (8 Cols) */}
          <div className="lg:col-span-8 relative rounded-2xl bg-gradient-to-r from-[#1d0642] via-[#2a0b5c] to-[#451892] p-6 sm:p-10 border border-white/15 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[300px] sm:min-h-[360px]">
            {/* Background decorative glow element */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-gradient-to-br from-[#facc15]/20 to-purple-500/30 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#facc15] text-slate-950 text-[11px] font-black uppercase tracking-wider mb-4 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Licencias Digitales Originales</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Software Corporativo <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] via-amber-300 to-yellow-400">
                  y Residencial Microsoft
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-purple-100 font-medium leading-relaxed max-w-lg">
                Garantía técnica de activación permanente. Descarga directa oficial y soporte personalizado 24/7.
              </p>
            </div>

            <div className="relative z-10 mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleFilter('office')}
                className="px-6 py-3 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2 border border-amber-300"
              >
                <span>EXPLORAR CATÁLOGO</span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
              </button>

              <button
                onClick={() => handleFilter('combos')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>VER COMBOS 2 EN 1</span>
              </button>
            </div>
          </div>

          {/* Right Stacked Feature Banners (4 Cols) - Exact Eneba Right Column Style */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {/* Promo Card 1 */}
            <div 
              onClick={() => handleFilter('office')}
              className="group relative rounded-xl bg-gradient-to-r from-[#2c0b61] to-[#3a107e] p-4 border border-white/15 hover:border-[#facc15]/60 transition-all duration-200 cursor-pointer flex items-center justify-between shadow-lg overflow-hidden"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase mb-1">
                  MÁS VENDIDO
                </span>
                <h3 className="font-black text-sm text-white group-hover:text-[#facc15] transition-colors">
                  Office 2024 Pro Plus
                </h3>
                <p className="text-[11px] text-purple-200">Licencia vitalicia para 1 PC</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-purple-300 line-through block">S/ 180</span>
                <span className="text-base font-black text-[#facc15]">S/ 48.90</span>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div 
              onClick={() => handleFilter('windows')}
              className="group relative rounded-xl bg-gradient-to-r from-[#2c0b61] to-[#3a107e] p-4 border border-white/15 hover:border-[#facc15]/60 transition-all duration-200 cursor-pointer flex items-center justify-between shadow-lg overflow-hidden"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-black text-[10px] uppercase mb-1">
                  100% GARANTIZADO
                </span>
                <h3 className="font-black text-sm text-white group-hover:text-[#facc15] transition-colors">
                  Windows 11 Pro Key
                </h3>
                <p className="text-[11px] text-purple-200">Activación oficial permanente</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-purple-300 line-through block">S/ 120</span>
                <span className="text-base font-black text-[#facc15]">S/ 39.90</span>
              </div>
            </div>

            {/* Promo Card 3 */}
            <div 
              onClick={() => handleFilter('combos')}
              className="group relative rounded-xl bg-gradient-to-r from-[#2c0b61] to-[#3a107e] p-4 border border-white/15 hover:border-[#facc15]/60 transition-all duration-200 cursor-pointer flex items-center justify-between shadow-lg overflow-hidden"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded bg-rose-500 text-white font-black text-[10px] uppercase mb-1">
                  ¡OFERTA FLASH!
                </span>
                <h3 className="font-black text-sm text-white group-hover:text-[#facc15] transition-colors">
                  Combo Win 11 + Off 2024
                </h3>
                <p className="text-[11px] text-purple-200">Ahorras más de 50%</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-purple-300 line-through block">S/ 280</span>
                <span className="text-base font-black text-[#facc15]">S/ 79.90</span>
              </div>
            </div>
          </div>

        </div>

        {/* Eneba Signature Category Shortcut Bar (Matching bottom row in user screenshot!) */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 text-center">
            <button
              onClick={() => handleFilter('windows')}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#facc15]/50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-900/80 text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform border border-cyan-400/30">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#facc15] transition-colors">Windows 11</span>
            </button>

            <button
              onClick={() => handleFilter('office')}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#facc15]/50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-900/80 text-orange-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform border border-orange-400/30">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#facc15] transition-colors">Office 2024</span>
            </button>

            <button
              onClick={() => handleFilter('combos')}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#facc15]/50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-900/80 text-[#facc15] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform border border-amber-400/30">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#facc15] transition-colors">Combos 2en1</span>
            </button>

            <button
              onClick={() => handleFilter('project-visio')}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#facc15]/50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-900/80 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform border border-emerald-400/30">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#facc15] transition-colors">Visio Pro</span>
            </button>

            <button
              onClick={() => handleFilter('project-visio')}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#facc15]/50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-900/80 text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform border border-blue-400/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#facc15] transition-colors">Project Pro</span>
            </button>

            <button
              onClick={() => handleFilter('office')}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#facc15]/50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-900/80 text-sky-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform border border-sky-400/30">
                <Cloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#facc15] transition-colors">Microsoft 365</span>
            </button>

            <button
              onClick={() => handleFilter('all')}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#facc15]/50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-900/80 text-green-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform border border-green-400/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#facc15] transition-colors">Permanente</span>
            </button>

            <button
              onClick={() => handleFilter('all')}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#facc15]/50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-900/80 text-yellow-300 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform border border-yellow-300/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#facc15] transition-colors">Envío Digital</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

