import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { products, searchProducts } from '../products.ts';
import { ProductCard } from './ProductCard.tsx';
import { useCart } from '../context/CartContext.tsx';
import { ProductCategory } from '../types.ts';
import { SearchX } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, t } = useCart();

  // Filter products by category and tokenized search engine
  const filteredProducts = useMemo(() => {
    let result = searchQuery.trim() ? searchProducts(searchQuery) : products;

    if (activeCategory === 'combos') {
      result = result.filter(p => p.category === 'combos');
    } else if (activeCategory === 'office') {
      result = result.filter(p => p.category === 'office');
    } else if (activeCategory === 'windows') {
      result = result.filter(p => p.category === 'windows');
    } else if (activeCategory === 'project-visio') {
      result = result.filter(p => p.category === 'project-visio');
    } else if (activeCategory === 'apps') {
      result = result.filter(p => p.category === 'apps');
    } else if (activeCategory === 'top') {
      result = result.filter(p => p.featured || p.bestSeller);
    } else if (activeCategory === 'bestsellers') {
      result = result.filter(p => p.bestSeller);
    } else if (activeCategory === 'offers') {
      result = result.filter(p => p.oldPrice !== undefined || p.badge?.includes('OFERTA') || p.badge?.includes('AHORRO'));
    }

    return result;
  }, [activeCategory, searchQuery]);

  const categories: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: t('allProducts') },
    { key: 'office', label: t('office') },
    { key: 'windows', label: t('windows') },
    { key: 'combos', label: t('combos') },
    { key: 'project-visio', label: t('projectVisio') },
    { key: 'apps', label: t('apps') || 'Apps' },
    { key: 'bestsellers', label: t('bestSellers') },
    { key: 'offers', label: t('deals') }
  ];

  return (
    <section id="catalogo-section" className="py-14 sm:py-20 bg-white text-slate-900 border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#0078d4] mb-2">
              {t('catalogBadge')}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
              {t('catalogTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal">
              {t('catalogSubtitle')}
            </p>
          </div>

          {/* Results count indicator */}
          <div className="text-xs font-semibold text-slate-600 bg-[#f8fafc] px-4 py-2 rounded-2xl border border-slate-200/90 self-start md:self-auto flex items-center gap-1.5">
            <span>Mostrando</span>
            <span className="font-extrabold text-[#0078d4] font-mono tabular-nums">
              {filteredProducts.length}
            </span>
            <span>licencias disponibles</span>
            {searchQuery && <span className="text-slate-900 font-bold"> · "{searchQuery}"</span>}
          </div>
        </motion.div>

        {/* Interactive Segmented Category Filter Bar with Animated Active Pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 mb-8 rounded-2xl bg-[#f8fafc] border border-slate-200/80 no-scrollbar scroll-smooth">
          {categories.map(cat => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                id={`cat-filter-${cat.key}`}
                onClick={() => setActiveCategory(cat.key)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 cursor-pointer font-bold shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="catalogCategoryActivePill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-[#0078d4] shadow-xs"
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid: 4 cols desktop, 3 tablet, 2 mobile */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.32,
                    delay: Math.min(idx * 0.03, 0.24),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#f8fafc] rounded-3xl p-12 text-center border border-slate-200/90 max-w-lg mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <SearchX className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">{t('noProductsMatch')}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              No encontramos coincidencias para "<span className="font-semibold text-slate-900">{searchQuery}</span>". Prueba buscando Windows 11, Office 2024 o Combos.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#0078d4] text-white text-xs sm:text-sm font-bold hover:bg-[#0062ad] shadow-xs transition-colors cursor-pointer"
            >
              {t('viewAllCatalog')}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
