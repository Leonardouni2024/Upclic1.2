import { formatPrice, getProductDeviceTag } from '../products.ts';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { ShoppingCart, Zap, Check, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addItem, 
    navigateToProduct, 
    getProductName, 
    getDurationLabel,
    language
  } = useCart();
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : 'oem'
  );
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const productName = getProductName(product);
  const stockCount = product.stock ?? 30;

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
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1200);
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'office') return 'Microsoft Office';
    if (category === 'windows') return 'Windows Oficial';
    if (category === 'combos') return 'Combo Ahorro';
    if (category === 'project-visio') return 'Project & Visio';
    return 'Apps & Diseño';
  };

  const isPermanent = product.duration?.toLowerCase().includes('permanente') || product.duration?.toLowerCase().includes('vida');
  const isYear = product.duration?.toLowerCase().includes('año') || product.duration?.toLowerCase().includes('12 meses');
  const durationTag = isPermanent ? 'Permanente' : (isYear ? '1 año' : getDurationLabel(product.duration));
  
  const deviceTag = getProductDeviceTag(product, language);

  return (
    <article
      id={`product-card-${product.id}`}
      className="bento-card bento-card-interactive rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between group h-full text-slate-700 relative overflow-hidden"
    >
      <div>
        {/* Top Kicker Row: Delivery Speed & Discount */}
        <div className="flex items-center justify-between gap-1 mb-2 text-[10px] sm:text-[11px] font-bold">
          <span className="inline-flex items-center gap-1 text-[#0078d4] truncate">
            <Zap className="w-3 h-3 text-[#0078d4] fill-[#0078d4] shrink-0" />
            <span className="truncate">Envío Digital</span>
          </span>

          {discountPercent > 0 && (
            <span className="text-[#d83b01] font-extrabold font-mono tabular-nums shrink-0">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Product Image Container with Ambient Hover Glow */}
        <div
          onClick={() => navigateToProduct(product.slug)}
          className="relative w-full aspect-square max-h-[120px] sm:max-h-[165px] bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]/70 group-hover:from-[#0078d4]/[0.05] group-hover:to-[#f8fafc] rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center justify-center cursor-pointer my-1 border border-slate-100 group-hover:border-[#0078d4]/25 overflow-hidden transition-colors duration-300"
        >
          <img
            src={imgSrc}
            alt={productName}
            onError={handleImageError}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-106 transition-transform duration-300"
          />
          <span className="hidden sm:inline-flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white/95 text-[#0078d4] text-[10px] font-bold shadow-2xs border border-slate-200/80">
            Ver ficha
          </span>
        </div>

        {/* Category & Guarantee Kicker */}
        <div className="flex items-center justify-between gap-1 text-[9.5px] sm:text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mt-2 mb-1">
          <span className="truncate text-[#0078d4]">{getCategoryLabel(product.category)}</span>
          <span className="inline-flex items-center gap-0.5 text-emerald-700 shrink-0 normal-case font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Original</span>
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => navigateToProduct(product.slug)}
          className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 cursor-pointer group-hover:text-[#0078d4] transition-colors min-h-[2.2rem] sm:min-h-[2.6rem]"
          title={productName}
        >
          {productName}
        </h3>

        {/* Clean Unboxed Metadata with Middot Separators */}
        <div className="mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5 flex-wrap text-[10px] sm:text-[11px] font-medium text-slate-500 leading-tight">
          <span className="text-slate-700 font-semibold">{durationTag}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{deviceTag}</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="text-emerald-700 font-semibold tabular-nums hidden sm:inline">Stock ({stockCount})</span>
        </div>

        {/* Interactive Variant Segmented Control (OEM / Retail) */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2.5 sm:mt-3 flex items-center gap-1 p-1 rounded-xl bg-[#f8fafc] border border-slate-200/80">
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
                  className={`flex-1 py-1 px-1 sm:px-1.5 rounded-lg text-[9.5px] sm:text-[10px] font-bold transition-all cursor-pointer text-center truncate whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#0078d4] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {v.type || v.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price & Primary Action Button */}
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100">
        <div className="flex items-baseline justify-between gap-1 mb-2.5 sm:mb-3 flex-wrap">
          <div className="flex items-baseline gap-1 sm:gap-1.5">
            <span className="text-base sm:text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
              {formatPrice(activePrice)}
            </span>
            {activeOldPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through tabular-nums font-mono">
                {formatPrice(activeOldPrice)}
              </span>
            )}
          </div>
          {discountPercent > 0 && activeOldPrice && (
            <span className="text-[10px] text-emerald-700 font-bold hidden sm:inline tabular-nums">
              Ahorra {formatPrice(activeOldPrice - activePrice)}
            </span>
          )}
        </div>

        {/* Full-width Responsive Action Button */}
        <motion.button
          whileTap={{ scale: 0.975 }}
          id={`add-to-cart-${product.id}`}
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-2.5 sm:px-3 min-h-[40px] sm:min-h-[44px] rounded-xl font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 transition-colors duration-200 shadow-2xs cursor-pointer whitespace-nowrap ${
            isAddedRecently
              ? 'bg-emerald-600 text-white'
              : 'bg-[#0078d4] hover:bg-[#0062ad] text-white'
          }`}
        >
          {isAddedRecently ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
              <span>¡Agregado!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span>Añadir al carrito</span>
            </>
          )}
        </motion.button>
      </div>
    </article>
  );
};
