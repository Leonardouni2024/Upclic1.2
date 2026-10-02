import React from 'react';
import { products, getProductDeviceTag } from '../products.ts';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { ShoppingCart, Zap, ChevronDown } from 'lucide-react';

export const FeaturedProductsSection: React.FC = () => {
  const { 
    addItem, 
    navigateToProduct, 
    formatPrice, 
    setActiveCategory,
    navigateToHome,
    currentPath,
    language
  } = useCart();

  // Curated flagship featured products
  const featuredIds = [
    'prod-office-2021',
    'prod-office-2024',
    'prod-win11-pro',
    'prod-microsoft-365',
    'prod-mcafee-antivirus',
    'prod-win10-pro',
    'prod-project-2024',
    'prod-combo-win11-office2024'
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

  const getCategoryLabel = (category: string) => {
    if (category === 'office') return 'microsoft office';
    if (category === 'windows') return 'windows';
    if (category === 'combos') return 'combos ahorro';
    if (category === 'project-visio') return 'project & visio';
    return 'antivirus & apps';
  };

  const getPillsForProduct = (product: Product) => {
    const isPermanent = product.duration?.toLowerCase().includes('permanente') || product.duration?.toLowerCase().includes('vida');
    const isYear = product.duration?.toLowerCase().includes('año') || product.duration?.toLowerCase().includes('12 meses');
    const durationTag = isPermanent ? 'Permanente' : (isYear ? '1 año' : product.duration);
    
    const deviceTag = getProductDeviceTag(product, language);
    
    return [durationTag, deviceTag];
  };

  return (
    <section id="destacados-section" className="py-12 bg-[#f8fafc] border-t border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wide uppercase mb-2">
              <span>Lo más vendido</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Productos destacados
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
              Los favoritos de nuestros clientes
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Ver catálogo completo</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid: 4 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredItems.map((product) => {
            const pills = getPillsForProduct(product);
            const categoryText = getCategoryLabel(product.category);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#00A3E0] hover:shadow-lg transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top-left Cyan Pill: Envío Digital */}
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00A3E0] text-white text-[10px] font-bold uppercase tracking-wider">
                      <Zap className="w-2.5 h-2.5 fill-white" />
                      <span>Envío Digital</span>
                    </span>
                  </div>

                  {/* Centered Product Image */}
                  <div
                    onClick={() => navigateToProduct(product.slug)}
                    className="w-full aspect-square max-h-[170px] bg-white rounded-lg p-2 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform duration-200 my-2"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      onError={(e) => { e.currentTarget.src = product.fallbackImage; }}
                      className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xs"
                    />
                  </div>

                  {/* Category in Cyan text */}
                  <div className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider mb-1">
                    {categoryText}
                  </div>

                  {/* Product Title */}
                  <h3
                    onClick={() => navigateToProduct(product.slug)}
                    className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 cursor-pointer group-hover:text-[#00A3E0] transition-colors min-h-[2.5rem]"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  {/* Metadata Specs Pills */}
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {pills.map((pill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10.5px] font-medium border border-slate-200/60"
                      >
                        {pill}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200/70">
                      Stock: {product.stock ?? 30} unid.
                    </span>
                  </div>
                </div>

                {/* Price and Add to Cart Button */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-black text-slate-900 tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  {/* Vibrant Full-Width Cyan Button */}
                  <button
                    onClick={() => addItem(product, 1)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#00A3E0] hover:bg-[#0092cc] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Añadir al carrito</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
