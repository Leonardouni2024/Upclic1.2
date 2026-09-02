import React, { useMemo } from 'react';
import { products, searchProducts } from '../products.ts';
import { ProductCard } from './ProductCard.tsx';
import { useCart } from '../context/CartContext.tsx';
import { ProductCategory } from '../types.ts';
import { Sparkles, SearchX } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useCart();

  // Filter products by category and tokenized search engine
  const filteredProducts = useMemo(() => {
    // If user has typed, use tokenized search with prefix matching
    let result = searchQuery.trim() ? searchProducts(searchQuery) : products;

    // Category Filter
    if (activeCategory === 'combos') {
      result = result.filter(p => p.category === 'combos');
    } else if (activeCategory === 'office') {
      result = result.filter(p => p.category === 'office');
    } else if (activeCategory === 'windows') {
      result = result.filter(p => p.category === 'windows');
    } else if (activeCategory === 'project-visio') {
      result = result.filter(p => p.category === 'project-visio');
    } else if (activeCategory === 'top') {
      result = result.filter(p => p.featured || p.bestSeller);
    } else if (activeCategory === 'bestsellers') {
      result = result.filter(p => p.bestSeller);
    } else if (activeCategory === 'offers') {
      result = result.filter(p => p.oldPrice !== undefined || p.badge?.includes('OFERTA') || p.badge?.includes('AHORRO'));
    }

    return result;
  }, [activeCategory, searchQuery]);

  const categories: { key: ProductCategory; label: string; count?: number }[] = [
    { key: 'all', label: 'Todos los productos' },
    { key: 'combos', label: 'COMBOS 2 EN 1' },
    { key: 'office', label: 'OFFICE' },
    { key: 'windows', label: 'WINDOWS' },
    { key: 'project-visio', label: 'PROJECT & VISIO' },
    { key: 'top', label: 'TOP' },
    { key: 'bestsellers', label: 'MÁS VENDIDOS' },
    { key: 'offers', label: 'OFERTAS' }
  ];

  return (
    <section id="catalogo-section" className="py-14 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 text-[#0066FF] text-xs font-bold uppercase tracking-wider mb-2.5 border border-blue-100 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catálogo Completo</span>
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight">
              Software Microsoft Original
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-1.5 font-medium">
              Licencias digitales con entrega inmediata y activación 100% garantizada
            </p>
          </div>

          {/* Results count pill */}
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 bg-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 shadow-2xs self-start md:self-auto flex items-center gap-1.5">
            <span>Mostrando</span>
            <span className="font-black text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 tabular-nums">
              {filteredProducts.length}
            </span>
            <span>productos</span>
            {searchQuery && <span className="text-slate-700 font-bold"> para "{searchQuery}"</span>}
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 no-scrollbar scroll-smooth">
          {categories.map(cat => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                id={`cat-filter-${cat.key}`}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0066FF] text-white font-bold shadow-xs shadow-[#0066FF]/25 border border-blue-500/20'
                    : 'bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid: 4 cols desktop, 3 tablet, 2 mobile */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <SearchX className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No se encontraron productos</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              No encontramos coincidencias para "<span className="font-semibold text-slate-700">{searchQuery}</span>". Prueba buscando "Office", "Windows 11", "Pro" o "2024".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs sm:text-sm font-bold hover:bg-[#0052cc] shadow-xs hover:shadow-md transition-all cursor-pointer border border-blue-500/20"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
