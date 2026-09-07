import { formatPrice } from '../products.ts';
import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useReviews } from '../context/ReviewsContext.tsx';
import {
  Star,
  ShoppingCart,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, navigateToProduct, navigateToCheckout } = useCart();
  const { getProductStats } = useReviews();
  const stats = getProductStats(product.id);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<'oem' | 'retail'>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : 'oem'
  );

  useEffect(() => {
    setImgSrc(product.imageUrl);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product.imageUrl, product.id]);

  const currentVariant = product.variants
    ? product.variants.find(v => v.id === selectedVariantId) || product.variants[0]
    : undefined;

  
  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeOldPrice = currentVariant ? currentVariant.oldPrice : product.oldPrice;
  const discountPercent = activeOldPrice && activeOldPrice > activePrice 
    ? Math.round(((activeOldPrice - activePrice) / activeOldPrice) * 100) 
    : 0;


  const handleImageError = () => {
    if (imgSrc !== product.fallbackImage) {
      setImgSrc(product.fallbackImage);
    }
  };

  const handleAddToCart = () => {
    addItem(product, 1, currentVariant ? currentVariant.id : undefined);
  };

  const handleBuyNow = () => {
    addItem(product, 1, currentVariant ? currentVariant.id : undefined);
    navigateToCheckout();
  };

  return (
    <>
      <article
        id={`product-card-${product.id}`}
        className="group bg-[#1b1236] rounded-2xl border border-white/12 shadow-xl hover:shadow-2xl hover:shadow-purple-950/80 hover:border-[#facc15]/80 hover:-translate-y-1 transition-all duration-200 ease-out flex flex-col justify-between overflow-hidden relative h-full text-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span
              className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-black rounded-lg uppercase tracking-wide shadow-md border border-white/20 ${
                product.badge.includes('TOP') || product.badge.includes('MÁS VENDIDO')
                  ? 'bg-amber-400 text-slate-950'
                  : product.badge.includes('1 AÑO')
                  ? 'bg-purple-600 text-white'
                  : 'bg-emerald-400 text-slate-950'
              }`}
            >
              {product.badge}
            </span>
          ) : (
            <div></div>
          )}
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="px-2 py-1 bg-[#facc15] text-slate-950 text-[11px] font-black rounded-lg shadow-md border border-amber-300">
              -{discountPercent}%
            </span>
          )}

          {product.cloudStorage && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/20 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
              {product.cloudStorage}
            </span>
          )}
        </div>

        {/* Product Image Section (occupies ~55-60% of card) */}
        <div
          onClick={() => navigateToProduct(product.slug)}
          className="relative w-full aspect-square p-5 sm:p-6 bg-gradient-to-b from-[#140b2b] via-[#160d30] to-[#1b1236] flex items-center justify-center cursor-pointer overflow-hidden border-b border-white/10"
        >
          <img
            src={imgSrc}
            alt={product.name}
            onError={handleImageError}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-250 ease-out group-hover:scale-105"
          />

          {/* Quick View Overlay on Hover */}
          <div className="absolute inset-0 bg-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-xs font-bold text-white shadow-lg border border-white/20 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
              <Eye className="w-3.5 h-3.5 text-[#facc15]" />
              <span>Ver detalles</span>
            </span>
          </div>
        </div>

        {/* Card Body Details */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-[#1b1236]">
          <div className="flex-1 flex flex-col">
            {/* Warning notice if legacy software */}
            {product.warning ? (
              <div className="mb-2 flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
                <AlertCircle className="w-3 h-3 shrink-0 text-amber-400" />
                <span className="truncate">{product.warning}</span>
              </div>
            ) : null}

            {/* Product Name */}
            <h3
              onClick={() => navigateToProduct(product.slug)}
              className="font-bold text-white text-xs sm:text-[13.5px] md:text-sm line-clamp-2 group-hover:text-[#facc15] transition-colors cursor-pointer leading-snug min-h-[2.4rem] sm:min-h-[2.5rem]"
              title={product.name}
            >
              {product.name}
            </h3>

            {/* Stars Rating and Duration */}
            <div className="mt-2.5 mb-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-amber-400">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.round(stats.averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-purple-200 text-[10.5px] sm:text-[11px] tabular-nums">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span className="text-[9.5px] sm:text-[10px] text-purple-300">({stats.totalReviews})</span>
              </div>

              <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-white/10 text-purple-200 border border-white/10">
                {product.duration}
              </span>
            </div>
          </div>

          {/* Pricing & Buttons - Anchored to bottom with fixed height price line */}
          <div className="pt-2.5 sm:pt-3 border-t border-white/10 mt-auto">
            {/* Variant selector chips if product has OEM/Retail variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-2 flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                {product.variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariantId(v.id);
                      }}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer text-center leading-tight flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-[#facc15] text-slate-950 shadow-md border border-amber-300'
                          : 'text-purple-200 hover:text-white hover:bg-white/10'
                      }`}
                      title={v.name}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-purple-300'}`} />
                      <span>{v.type || v.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="min-h-[1.75rem] sm:min-h-[2rem] flex items-baseline gap-1.5 mb-2.5 sm:mb-3">
              <span className="text-lg sm:text-xl font-black text-[#facc15]">
                {formatPrice(activePrice)}
              </span>
              {activeOldPrice && (
                <span className="text-[11px] sm:text-xs text-purple-300 line-through tabular-nums ml-1">
                  {formatPrice(activeOldPrice)}
                </span>
              )}
              {currentVariant && (
                <span className="text-[10px] font-bold text-amber-300 ml-auto bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                  {currentVariant.name}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="grid grid-cols-2 gap-2">
                {/* Botón: Agregar al carrito */}
                <button
                  id={`add-to-cart-${product.id}`}
                  onClick={handleAddToCart}
                  className="w-full py-2 sm:py-2.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer border border-white/15"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-purple-200" />
                  <span className="truncate">Carrito</span>
                </button>

                {/* Botón Principal: Comprar Ahora (Fast Buy) */}
                <button
                  id={`view-product-${product.id}`}
                  onClick={handleBuyNow}
                  className="w-full py-2 sm:py-2.5 px-2 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:shadow-amber-500/20 transition-all duration-200 cursor-pointer border border-amber-300"
                >
                  <span className="truncate">Comprar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

