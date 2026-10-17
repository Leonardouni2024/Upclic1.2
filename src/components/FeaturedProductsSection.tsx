import React from 'react';
import { products } from '../products.ts';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { ChevronDown, Flame } from 'lucide-react';

export const FeaturedProductsSection: React.FC = () => {
  const { 
    setActiveCategory,
    navigateToHome,
    currentPath
  } = useCart();

  // Curated flagship featured products (Canva Pro 12M S/ 10.00 first)
  const featuredIds = [
    'prod-canva-pro',
    'prod-office-2024',
    'prod-win11-pro',
    'prod-combo-win11-office2024',
    'prod-microsoft-365',
    'prod-office-2021',
    'prod-duolingo-super',
    'prod-mcafee-antivirus'
  ];

  const featuredItems: Product[] = featuredIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const handleViewAll = () => {
    setActiveCategory('all');
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
    <section id="destacados-section" className="py-12 sm:py-16 bg-[#f8fafc] border-t border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wide uppercase mb-2 border border-amber-200/80">
              <Flame className="w-3.5 h-3.5 text-amber-700" />
              <span>Lo más vendido & Ofertas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              Productos Destacados
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
              Software original, licencias permanentes y suscripciones verificadas con soporte en Perú.
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-xs sm:text-sm font-bold text-slate-800 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              <span>Ver catálogo completo</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid: 4 cols desktop, 3 tablet, 2 mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {featuredItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
