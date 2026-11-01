import { formatPrice, formatPriceNoSymbol, getProductDeviceTag } from '../products.ts';
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
    navigateToCheckout,
    getProductName, 
    getDurationLabel,
    language,
    currency
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

  const handleQuickBuy = () => {
    addItem(product, 1, currentVariant ? currentVariant.id : undefined);
    navigateToCheckout();
  };

  const getCategoryMeta = (category: string) => {
    if (category === 'office') return { label: 'Microsoft Office', pillClass: 'tint-blue' };
    if (category === 'windows') return { label: 'Windows Oficial', pillClass: 'tint-teal' };
    if (category === 'combos') return { label: 'Pack Ahorro', pillClass: 'tint-teal' };
    if (category === 'project-visio') return { label: 'Diseño & Gestión', pillClass: 'tint-amber' };
    return { label: 'Cuenta Premium & IA', pillClass: 'tint-violet' };
  };

  const categoryMeta = getCategoryMeta(product.category);

  const isPermanent = product.duration?.toLowerCase().includes('permanente') || product.duration?.toLowerCase().includes('vida');
  const isYear = product.duration?.toLowerCase().includes('año') || product.duration?.toLowerCase().includes('12 meses');
  const durationTag = isPermanent ? 'Permanente' : (isYear ? '1 año' : getDurationLabel(product.duration));
  
  const deviceTag = getProductDeviceTag(product, language);

  const renderMainPrice = (pricePEN: number) => {
    const numStr = formatPriceNoSymbol(pricePEN, currency);
    const symbol = currency === 'PEN' ? 'S/ ' : '$';
    return (
      <span className="text-lg sm:text-[22px] font-extrabold text-[#0B1F3A] tracking-[-0.01em] tabular-nums leading-none">
        {symbol}{numStr}{' '}
        <small className="text-[11px] sm:text-[12px] font-semibold text-[#64748B]">{currency}</small>
      </span>
    );
  };

  return (
    <article
      id={`product-card-${product.id}`}
      className="bento-card bento-card-interactive p-3.5 sm:p-5 flex flex-col justify-between group h-full text-[#475569] relative overflow-hidden"
    >
      <div>
        {/* Top Kicker Row: Category Tint Pill & Discount */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5 text-[10px] sm:text-[11px] font-bold">
          <span className={`px-2 py-0.5 rounded-full truncate ${categoryMeta.pillClass}`}>
            {categoryMeta.label}
          </span>

          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#FFF0D9] text-[#B25E00] font-extrabold tabular-nums shrink-0">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Product Image Container */}
        <div
          onClick={() => navigateToProduct(product.slug)}
          className="relative w-full aspect-square max-h-[125px] sm:max-h-[164px] bg-[#F4F7FB] group-hover:bg-[#EEF4FF]/60 rounded-[14px] p-2.5 sm:p-3.5 flex items-center justify-center cursor-pointer my-1 border border-[#E2E8F0] group-hover:border-[#CBD5E1] overflow-hidden transition-colors duration-200"
        >
          <img
            src={imgSrc}
            alt={productName}
            onError={handleImageError}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="hidden sm:inline-flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-[#EEF4FF] text-[#1668E3] text-[11px] font-semibold shadow-2xs">
            Ver ficha
          </span>
        </div>

        {/* Delivery & Verification Kicker */}
        <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-[#64748B] mt-2.5 mb-1">
          <span className="inline-flex items-center gap-1 text-[#1668E3] truncate">
            <Zap className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span className="truncate">Envío digital</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[#0B7A64] shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span>Verificado</span>
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => navigateToProduct(product.slug)}
          className="font-bold text-[#0B1F3A] text-xs sm:text-[15px] leading-[1.3] line-clamp-2 cursor-pointer group-hover:text-[#1668E3] transition-colors min-h-[2.2rem] sm:min-h-[2.5rem]"
          title={productName}
        >
          {productName}
        </h3>

        {/* Clean Metadata with Middot Separators */}
        <div className="mt-1.5 flex items-center gap-1 sm:gap-1.5 flex-wrap text-[11px] font-medium text-[#64748B] leading-tight">
          <span className="text-[#475569] font-semibold">{durationTag}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{deviceTag}</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="text-[#0B7A64] font-semibold tabular-nums hidden sm:inline">Stock ({stockCount})</span>
        </div>

        {/* Interactive Variant Segmented Control (OEM / Retail) */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1 p-1 rounded-[12px] bg-[#F4F7FB] border border-[#E2E8F0]">
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
                  className={`flex-1 py-1 px-1 sm:px-1.5 rounded-[8px] text-[10px] font-bold transition-all cursor-pointer text-center truncate whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#1668E3] text-white shadow-2xs'
                      : 'text-[#475569] hover:text-[#0B1F3A] hover:bg-white'
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
      <div className="mt-3.5 pt-3 border-t border-[#E2E8F0]">
        <div className="flex items-end justify-between gap-1 mb-3 flex-wrap">
          <div>
            <span className="text-[11px] text-[#64748B] block leading-none mb-1">
              Precio
            </span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {renderMainPrice(activePrice)}
              {activeOldPrice && (
                <span className="text-[11px] text-[#64748B] line-through tabular-nums font-medium">
                  {formatPrice(activeOldPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dual Action Bar: Add to Cart + Quick Buy */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.button
            whileTap={{ scale: 0.975 }}
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 px-2.5 sm:px-3 min-h-[40px] rounded-[12px] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer whitespace-nowrap ${
              isAddedRecently
                ? 'bg-[#0B7A64] text-white'
                : 'bg-[#1668E3] hover:bg-[#1457C9] text-white'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                <span>Añadir</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.975 }}
            type="button"
            onClick={handleQuickBuy}
            title="Comprar al instante"
            className="py-2.5 px-3 min-h-[40px] rounded-[12px] bg-[#EEF4FF] hover:bg-[#E8440A] text-[#1668E3] hover:text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors duration-200 cursor-pointer shrink-0"
          >
            <Zap className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span className="hidden xs:inline">Comprar</span>
          </motion.button>
        </div>
      </div>
    </article>
  );
};
