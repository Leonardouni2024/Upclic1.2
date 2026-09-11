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
    <section id="hero-section" className="relative bg-[#0f172a] text-white pt-6 pb-10 border-b border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Main Big Hero Banner (8 Cols) */}
          <div className="lg:col-span-8 relative rounded-xl bg-[#1e293b] p-6 sm:p-10 border border-slate-700 flex flex-col justify-between overflow-hidden min-h-[300px] sm:min-h-[360px]">
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#facc15] text-slate-950 text-[11px] font-bold uppercase tracking-wider mb-4">
                <span>{t('heroBadge')}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {t('heroTitleLine1')} <br />
                <span className="text-[#facc15]">
                  {t('heroTitleLine2')}
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-lg">
                {t('heroSubtitle')}
              </p>
            </div>

            <div className="relative z-10 mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleFilter('office')}
                className="px-6 py-3 rounded-lg bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-bold text-sm transition-all cursor-pointer flex items-center gap-2 border border-transparent"
              >
                <span>{t('heroExploreCatalog')}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => handleFilter('combos')}
                className="px-5 py-3 rounded-lg bg-[#334155] hover:bg-[#475569] text-white font-bold text-sm transition-all cursor-pointer flex items-center gap-2 border border-transparent"
              >
                <span>{t('combos')}</span>
              </button>
            </div>
          </div>

          {/* Right Stacked Feature Banners (4 Cols) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {/* Promo Card 1 */}
            <div 
              onClick={() => handleOpenProduct('prod-office-2024', 'office')}
              className="group relative rounded-xl bg-slate-800/80 p-4 border border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-slate-200 transition-colors">
                  Office 2024 Pro Plus
                </h3>
                <p className="text-[11px] text-slate-400">Licencia vitalicia para 1 PC</p>
              </div>
              <div className="text-right shrink-0">
                {office2024?.oldPrice && (
                  <span className="text-xs text-slate-500 line-through block">
                    {formatPrice(office2024.oldPrice)}
                  </span>
                )}
                <span className="text-base font-extrabold text-[#facc15]">
                  {formatPrice(office2024?.price || 25.00)}
                </span>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div 
              onClick={() => handleOpenProduct('prod-win11-pro', 'windows')}
              className="group relative rounded-xl bg-slate-800/80 p-4 border border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-slate-200 transition-colors">
                  Windows 11 Pro Key
                </h3>
                <p className="text-[11px] text-slate-400">Activación oficial permanente</p>
              </div>
              <div className="text-right shrink-0">
                {win11Pro?.oldPrice && (
                  <span className="text-xs text-slate-500 line-through block">
                    {formatPrice(win11Pro.oldPrice)}
                  </span>
                )}
                <span className="text-base font-extrabold text-[#facc15]">
                  {formatPrice(win11Pro?.price || 25.00)}
                </span>
              </div>
            </div>

            {/* Promo Card 3 */}
            <div 
              onClick={() => handleOpenProduct('prod-combo-win11-office2024', 'combos')}
              className="group relative rounded-xl bg-slate-800/80 p-4 border border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-slate-200 transition-colors">
                  Combo Win 11 + Off 2024
                </h3>
                <p className="text-[11px] text-slate-400">Ahorras más de 50%</p>
              </div>
              <div className="text-right shrink-0">
                {comboWinOffice?.oldPrice && (
                  <span className="text-xs text-slate-500 line-through block">
                    {formatPrice(comboWinOffice.oldPrice)}
                  </span>
                )}
                <span className="text-base font-extrabold text-[#facc15]">
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

