import React, { useState } from 'react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useReviews } from '../context/ReviewsContext.tsx';
import { Star, ShoppingCart, Eye, AlertCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, navigateToProduct } = useCart();
  const { getProductStats } = useReviews();
  const stats = getProductStats(product.id);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    if (imgSrc !== product.fallbackImage) {
      setImgSrc(product.fallbackImage);
    }
  };

  return (
    <article
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:shadow-slate-200/60 hover:border-blue-300/80 hover:-translate-y-1 transition-all duration-200 ease-out flex flex-col justify-between overflow-hidden relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {product.badge ? (
          <span
            className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-black rounded-lg uppercase tracking-wide shadow-2xs border border-white/20 ${
              product.badge.includes('TOP') || product.badge.includes('MÁS VENDIDO')
                ? 'bg-[#0066FF] text-white'
                : product.badge.includes('1 AÑO')
                ? 'bg-purple-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {product.badge}
          </span>
        ) : (
          <div></div>
        )}

        {product.cloudStorage && (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50/90 text-[#0066FF] border border-blue-200/70 shadow-2xs">
            {product.cloudStorage}
          </span>
        )}
      </div>

      {/* Product Image Section (occupies ~55-60% of card) */}
      <div
        onClick={() => navigateToProduct(product.slug)}
        className="relative w-full aspect-square p-5 sm:p-6 bg-linear-to-b from-slate-50/50 via-white to-white flex items-center justify-center cursor-pointer overflow-hidden border-b border-slate-100"
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-250 ease-out group-hover:scale-105"
        />

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-xs font-bold text-slate-800 shadow-md border border-slate-200/80 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Eye className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>Ver detalles</span>
          </span>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-white">
        <div className="flex-1 flex flex-col">
          {/* Warning notice if legacy software */}
          {product.warning ? (
            <div className="mb-2 flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-lg border border-amber-200/60">
              <AlertCircle className="w-3 h-3 shrink-0 text-amber-600" />
              <span className="truncate">{product.warning}</span>
            </div>
          ) : null}

          {/* Product Name */}
          <h3
            onClick={() => navigateToProduct(product.slug)}
            className="font-bold text-slate-900 text-xs sm:text-[13.5px] md:text-sm line-clamp-2 hover:text-[#0066FF] transition-colors cursor-pointer leading-snug min-h-[2.4rem] sm:min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Stars Rating and Duration */}
          <div className="mt-2.5 mb-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-amber-500">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= Math.round(stats.averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-700 text-[10.5px] sm:text-[11px] tabular-nums">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-400">({stats.totalReviews})</span>
            </div>

            <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
              {product.duration}
            </span>
          </div>
        </div>

        {/* Pricing & Buttons - Anchored to bottom with fixed height price line */}
        <div className="pt-2.5 sm:pt-3 border-t border-slate-100 mt-auto">
          <div className="min-h-[1.75rem] sm:min-h-[2rem] flex items-baseline gap-1.5 mb-2.5 sm:mb-3">
            <span className="text-xs sm:text-sm font-bold text-slate-500">S/</span>
            <span className="text-lg sm:text-xl font-black text-[#0f172a] tracking-tight tabular-nums leading-none">
              {product.price.toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through tabular-nums ml-1">
                S/ {product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            {/* Botón Principal: Agregar al carrito */}
            <button
              id={`add-to-cart-${product.id}`}
              onClick={() => addItem(product, 1)}
              className="w-full py-2 sm:py-2.5 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200 active:scale-98 cursor-pointer border border-blue-500/20"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Agregar al carrito</span>
            </button>

            {/* Botón Secundario: Ver producto */}
            <button
              id={`view-product-${product.id}`}
              onClick={() => navigateToProduct(product.slug)}
              className="w-full py-1.5 sm:py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-slate-700 font-semibold text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60"
            >
              <Eye className="w-3 h-3 text-slate-500" />
              <span>Ver producto</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
