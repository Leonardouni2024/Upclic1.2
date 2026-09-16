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
    <section id="hero-section" className="relative bg-white text-slate-900 pt-6 pb-10 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Main Big Hero Banner (8 Cols) */}
          <div className="lg:col-span-12 relative rounded-xl bg-blue-50 p-6 sm:p-10 border border-blue-100 flex flex-col justify-between overflow-hidden min-h-[300px] sm:min-h-[360px]">
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider mb-4 shadow-sm">
                <span>{t('heroBadge')}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t('heroTitleLine1')} <br />
                <span className="text-blue-600">
                  {t('heroTitleLine2')}
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-lg">
                {t('heroSubtitle')}
              </p>
            </div>

            <div className="relative z-10 mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleFilter('all')}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all cursor-pointer flex items-center gap-2 border border-transparent shadow-sm"
              >
                <span>{t('heroExploreCatalog')}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => handleFilter('combos')}
                className="px-5 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all cursor-pointer flex items-center gap-2 border border-slate-300 shadow-sm"
              >
                <span>{t('combos')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

