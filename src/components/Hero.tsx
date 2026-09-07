import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { products, formatPrice } from '../products.ts';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Laptop, FileSpreadsheet, Layers, BarChart3, Cloud, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveCategory, navigateToHome, currentPath, setSelectedProduct, t } = useCart();

  const office2024 = products.find(p => p.id === 'prod-office-2024');
  const win11Pro = products.find(p => p.id === 'prod-win11-pro');
  const comboWinOffice = products.find(p => p.id === 'prod-combo-win11-office2024');

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

  const handleOpenProduct = (productId: string, defaultCategory: 'office' | 'windows' | 'combos') => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    } else {
      handleFilter(defaultCategory);
    }
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
                <span>{t('heroBadge')}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {t('heroTitleLine1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] via-amber-300 to-yellow-400">
                  {t('heroTitleLine2')}
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-purple-100 font-medium leading-relaxed max-w-lg">
                {t('heroSubtitle')}
              </p>
            </div>

            <div className="relative z-10 mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleFilter('office')}
                className="px-6 py-3 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2 border border-amber-300 uppercase"
              >
                <span>{t('heroExploreCatalog')}</span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
              </button>

              <button
                onClick={() => handleFilter('combos')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 shadow-md transition-all cursor-pointer flex items-center gap-2 uppercase"
              >
                <span>{t('combos')}</span>
              </button>
            </div>
          </div>

          {/* Right Stacked Feature Banners (4 Cols) - Exact Eneba Right Column Style */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {/* Promo Card 1 */}
            <div 
              onClick={() => handleOpenProduct('prod-office-2024', 'office')}
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
                {office2024?.oldPrice && (
                  <span className="text-xs text-purple-300 line-through block">
                    {formatPrice(office2024.oldPrice)}
                  </span>
                )}
                <span className="text-base font-black text-[#facc15]">
                  {formatPrice(office2024?.price || 25.00)}
                </span>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div 
              onClick={() => handleOpenProduct('prod-win11-pro', 'windows')}
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
                {win11Pro?.oldPrice && (
                  <span className="text-xs text-purple-300 line-through block">
                    {formatPrice(win11Pro.oldPrice)}
                  </span>
                )}
                <span className="text-base font-black text-[#facc15]">
                  {formatPrice(win11Pro?.price || 25.00)}
                </span>
              </div>
            </div>

            {/* Promo Card 3 */}
            <div 
              onClick={() => handleOpenProduct('prod-combo-win11-office2024', 'combos')}
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
                {comboWinOffice?.oldPrice && (
                  <span className="text-xs text-purple-300 line-through block">
                    {formatPrice(comboWinOffice.oldPrice)}
                  </span>
                )}
                <span className="text-base font-black text-[#facc15]">
                  {formatPrice(comboWinOffice?.price || 46.50)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

