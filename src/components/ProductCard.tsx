import React, { useState } from 'react';
import { ShoppingCart, Zap, Eye, Monitor, Clock } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { getProductDeviceTag, getCategoryLabel } from '../products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, buyNow, setSelectedProduct, formatPrice, language, getStock } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : undefined
  );

  const activeVariant = product.variants?.find(v => v.id === selectedVariantId);
  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentOldPrice = activeVariant ? activeVariant.oldPrice : product.oldPrice;

  const discountPercentage =
    currentOldPrice && currentOldPrice > currentPrice
      ? Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)
      : 0;

  const deviceTag = getProductDeviceTag(product, language);
  const stock = getStock(product.id);

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#1668E3]/50 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden relative cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none gap-1.5">
        {product.badge ? (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs bg-[#0B1F3A] text-white truncate">
            {product.badge}
          </span>
        ) : (
          <span />
        )}

        {discountPercentage > 0 && (
          <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200/80 text-rose-700 text-[11px] font-bold shrink-0">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <div className="relative h-48 bg-slate-50/70 p-6 flex items-center justify-center border-b border-slate-100 overflow-hidden group-hover:bg-blue-50/20 transition-colors">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-36 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (product.fallbackImage && target.src !== product.fallbackImage) {
              target.src = product.fallbackImage;
            }
          }}
        />

        {/* Quick View Hint */}
        <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs border border-slate-200/80 flex items-center justify-center text-slate-500 group-hover:text-[#1668E3] group-hover:border-blue-200 shadow-xs transition-all">
          <Eye className="w-4 h-4" />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1668E3] bg-blue-50 px-2 py-0.5 rounded-md truncate">
              {getCategoryLabel(product.category)}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-[#0B1F3A] text-sm sm:text-base leading-snug mb-2 group-hover:text-[#1668E3] transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Key Metadata Pills (Duration & Devices) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              <Clock className="w-3 h-3 text-slate-500" />
              {product.duration}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              <Monitor className="w-3 h-3 text-slate-500" />
              {deviceTag}
            </span>
          </div>

          {/* Variant Selector (OEM / Retail or Durations) */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-3 p-1 bg-slate-100 rounded-lg grid grid-cols-2 gap-1 border border-slate-200/70">
              {product.variants.map(v => {
                const isSelected = v.id === selectedVariantId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariantId(v.id);
                    }}
                    className={`py-1 px-2 rounded-md text-[11px] font-bold transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'bg-[#1668E3] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {v.type || v.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 mt-1">
          <div className="flex items-end justify-between mb-3">
            <div>
              {currentOldPrice && currentOldPrice > currentPrice && (
                <span className="text-[11px] text-slate-400 line-through block leading-none mb-0.5 font-medium">
                  Antes: {formatPrice(currentOldPrice)}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-[#0B1F3A] tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                stock > 0
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60'
                  : 'text-rose-700 bg-rose-50 border-rose-200/60'
              }`}
            >
              {stock > 0 ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {/* Add to Cart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1, selectedVariantId);
              }}
              disabled={stock <= 0}
              className="col-span-2 py-2.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-[0.98]"
              title="Añadir al carrito"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#1668E3]" />
              <span>Carrito</span>
            </button>

            {/* Primary Buy Now CTA (Orange) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                buyNow(product, 1, selectedVariantId);
              }}
              disabled={stock <= 0}
              className="col-span-3 py-2.5 px-3 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
