import React from 'react';
import { products } from '../products.ts';
import { useCart } from '../context/CartContext.tsx';
import { useReviews } from '../context/ReviewsContext.tsx';
import { Trophy, Star, Check, ShoppingCart, ArrowRight } from 'lucide-react';

export const TopProductsSection: React.FC = () => {
  const { addItem, navigateToProduct } = useCart();
  const { getProductStats } = useReviews();

  // Highlight top 2 products: Office Professional Plus 2024 and Windows 11 Pro
  const office2024 = products.find(p => p.slug === 'office-professional-plus-2024')!;
  const win11Pro = products.find(p => p.slug === 'windows-11-pro')!;
  const topItems = [office2024, win11Pro].filter(Boolean);

  return (
    <section id="top-section" className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2.5 border border-amber-200/70 shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Destacados UpClic</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
            Los más buscados
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Las soluciones insignia recomendadas para usuarios exigentes, empresas y estudiantes
          </p>
        </div>

        {/* Big Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {topItems.map(item => {
            const stats = getProductStats(item.id);
            return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-300/80 transition-all duration-300 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center relative overflow-hidden group"
            >
              {/* Top badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-xs font-black rounded-lg bg-[#0066FF] text-white uppercase tracking-wider shadow-2xs border border-white/20">
                  {item.badge || 'TOP DESTACADO'}
                </span>
              </div>

              {/* 1:1 Large Image */}
              <div
                onClick={() => navigateToProduct(item.slug)}
                className="w-full sm:w-1/2 aspect-square max-w-[240px] flex items-center justify-center p-4 bg-slate-50/70 border border-slate-100 rounded-2xl cursor-pointer group-hover:scale-102 transition-transform duration-300"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = item.fallbackImage;
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Content & Action */}
              <div className="w-full sm:w-1/2 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= Math.round(stats.averageRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-extrabold text-xs text-slate-700 tabular-nums">
                      {stats.averageRating.toFixed(1)}/5
                    </span>
                    <span className="text-xs text-slate-400">({stats.totalReviews})</span>
                  </div>

                  <h3
                    onClick={() => navigateToProduct(item.slug)}
                    className="text-lg sm:text-xl font-black text-slate-900 leading-snug hover:text-[#0066FF] transition-colors cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 space-y-1.5">
                    {item.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                      {item.duration}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-500">S/</span>
                      <span className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight tabular-nums leading-none">
                        {item.price.toFixed(2)}
                      </span>
                      {item.oldPrice && (
                        <span className="text-xs text-slate-400 line-through tabular-nums ml-1">
                          S/ {item.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addItem(item, 1)}
                      className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-blue-500/20"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Comprar</span>
                    </button>
                    <button
                      onClick={() => navigateToProduct(item.slug)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-colors cursor-pointer"
                      title="Ver detalles"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
};
