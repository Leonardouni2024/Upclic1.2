import { formatPrice, getProductDeviceTag } from '../products.ts';
import React, { useState, useEffect } from 'react';
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
      className="bg-white rounded-2xl border border-slate-200 hover:border-[#0070ba]/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-3.5 sm:p-5 flex flex-col justify-between group h-full text-slate-700 relative overflow-hidden"
    >
      <div>
        {/* Top Badges Row: Delivery Tag + Discount Badge */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0070ba] text-[10px] font-black uppercase tracking-wider border border-blue-200/80">
            <Zap className="w-2.5 h-2.5 text-[#0070ba] fill-[#0070ba]" />
            <span className="truncate">Envío 10-30 min</span>
          </span>

          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-[10px] sm:text-[11px] tracking-wider uppercase shadow-xs shrink-0">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Product Image Section */}
        <div
          onClick={() => navigateToProduct(product.slug)}
          className="w-full aspect-square max-h-[150px] sm:max-h-[175px] bg-slate-50/70 rounded-xl p-2.5 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform duration-300 my-1.5 border border-slate-100"
        >
          <img
            src={imgSrc}
            alt={productName}
            onError={handleImageError}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xs"
          />
        </div>

        {/* Category & Guarantee Tag */}
        <div className="flex items-center justify-between gap-1 text-[10.5px] font-bold text-[#0070ba] uppercase tracking-wider mt-2 mb-1">
          <span className="truncate">{getCategoryLabel(product.category)}</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Garantía Oficial</span>
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => navigateToProduct(product.slug)}
          className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 cursor-pointer group-hover:text-[#0070ba] transition-colors min-h-[2.3rem] sm:min-h-[2.6rem]"
          title={productName}
        >
          {productName}
        </h3>

        {/* Metadata Specs Tags */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] sm:text-[10.5px] font-medium border border-slate-200/80">
            {durationTag}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] sm:text-[10.5px] font-medium border border-slate-200/80">
            {deviceTag}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] sm:text-[10.5px] font-bold border border-emerald-200/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Stock: {stockCount}
          </span>
        </div>

        {/* Variant selector chips if product has OEM/Retail variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1 p-1 rounded-lg bg-slate-50 border border-slate-200">
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
                  className={`flex-1 py-1 px-1 rounded-md text-[10px] font-bold transition-all cursor-pointer text-center truncate ${
                    isSelected
                      ? 'bg-[#0070ba] text-white shadow-2xs'
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
      <div className="mt-3.5 pt-3 border-t border-slate-100">
        <div className="flex items-baseline justify-between gap-1 mb-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl font-black text-slate-900 tabular-nums">
              {formatPrice(activePrice)}
            </span>
            {activeOldPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through tabular-nums">
                {formatPrice(activeOldPrice)}
              </span>
            )}
          </div>
          {discountPercent > 0 && activeOldPrice && (
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 hidden xs:inline">
              Ahorras {formatPrice(activeOldPrice - activePrice)}
            </span>
          )}
        </div>

        {/* Full-width Responsive Action Button */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98] cursor-pointer ${
            isAddedRecently
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-[#0070ba] to-[#0088cc] hover:from-[#005fa0] hover:to-[#0077b5] text-white'
          }`}
        >
          {isAddedRecently ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>¡Agregado!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Añadir al carrito</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
