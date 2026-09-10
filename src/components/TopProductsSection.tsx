import React, { useState } from 'react';
import { products , formatPrice } from '../products.ts';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useReviews } from '../context/ReviewsContext.tsx';
import { Trophy, Star, Check, ShoppingCart, ArrowRight } from 'lucide-react';

export const TopProductsSection: React.FC = () => {
  const { addItem, navigateToProduct, t } = useCart();
  const { getProductStats } = useReviews();

  // Highlight top 2 products: Office Professional Plus 2024 and Windows 11 Pro
  const office2024 = products.find(p => p.slug === 'office-professional-plus-2024')!;
  const win11Pro = products.find(p => p.slug === 'windows-11-pro')!;
  const topItems = [office2024, win11Pro].filter(Boolean);

  return (
    <section id="top-section" className="py-14 bg-[#170c36] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2.5 border border-amber-400/30 shadow-md">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('topSectionBadge')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t('topSectionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-purple-200 mt-2 font-medium">
            {t('topSectionSubtitle')}
          </p>
        </div>

        {/* Big Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {topItems.map(item => {
            const stats = getProductStats(item.id);
            return (
            <div
              key={item.id}
              className="bg-[#211247] rounded-xl border border-white/15 shadow-xl hover:shadow-2xl hover:shadow-purple-900/40 hover:border-[#facc15]/80 transition-all duration-300 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center relative overflow-hidden group"
            >
              {/* Top badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-xs font-black rounded-lg bg-[#facc15] text-slate-950 uppercase tracking-wider shadow-md border border-amber-300">
                  {item.badge || t('topFeatured') || 'TOP DESTACADO'}
                </span>
              </div>

              {/* 1:1 Large Image */}
              <div
                onClick={() => navigateToProduct(item.slug)}
                className="w-full sm:w-1/2 aspect-square max-w-[240px] flex items-center justify-center p-4 bg-[#140b2b] border border-white/10 rounded-lg cursor-pointer group-hover:scale-105 transition-transform duration-300"
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
                  <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= Math.round(stats.averageRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-extrabold text-xs text-amber-300 tabular-nums">
                      {stats.averageRating.toFixed(1)}/5
                    </span>
                    <span className="text-xs text-purple-300">({stats.totalReviews})</span>
                  </div>

                  <h3
                    onClick={() => navigateToProduct(item.slug)}
                    className="text-lg sm:text-xl font-black text-white leading-snug group-hover:text-[#facc15] transition-colors cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  <p className="text-xs text-purple-200 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  <div className="mt-3 space-y-1.5">
                    {item.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-purple-300 block uppercase tracking-wider">
                      {item.duration}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl sm:text-2xl font-black text-[#facc15]">
                        {formatPrice(item.price)}
                      </span>
                      {item.oldPrice && (
                        <span className="text-xs text-purple-300 line-through tabular-nums ml-1">
                          {formatPrice(item.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addItem(item, 1)}
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-white/20"
                    >
                      <ShoppingCart className="w-4 h-4 text-purple-200" />
                      <span>{t('cart')}</span>
                    </button>
                    <button
                      onClick={() => {
                        addItem(item, 1);
                        navigateToProduct(item.slug);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer border border-amber-300"
                    >
                      <span>{t('buyNow')}</span>
                      <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
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

