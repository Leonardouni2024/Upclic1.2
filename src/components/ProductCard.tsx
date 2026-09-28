import { formatPrice } from '../products.ts';
import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { ShoppingCart, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addItem, 
    navigateToProduct, 
    getProductName, 
    getDurationLabel 
  } = useCart();
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [selectedVariantId, setSelectedVariantId] = useState<'oem' | 'retail'>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : 'oem'
  );

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

  const handleImageError = () => {
    if (imgSrc !== product.fallbackImage) {
      setImgSrc(product.fallbackImage);
    }
  };

  const handleAddToCart = () => {
    addItem(product, 1, currentVariant ? currentVariant.id : undefined);
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'office') return 'microsoft office';
    if (category === 'windows') return 'windows';
    if (category === 'combos') return 'combos ahorro';
    if (category === 'project-visio') return 'project & visio';
    return 'antivirus & apps';
  };

  const isPermanent = product.duration?.toLowerCase().includes('permanente') || product.duration?.toLowerCase().includes('vida');
  const isYear = product.duration?.toLowerCase().includes('año') || product.duration?.toLowerCase().includes('12 meses');
  const durationTag = isPermanent ? 'Permanente' : (isYear ? '1 año' : getDurationLabel(product.duration));
  
  let deviceTag = '1 PC';
  if (product.id.includes('3pc')) deviceTag = '3 PC';
  if (product.id.includes('365')) deviceTag = '5 Dispositivos';
  if (product.id.includes('mac')) deviceTag = '1 Mac';

  return (
    <article
      id={`product-card-${product.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#00A3E0] hover:shadow-lg transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group h-full text-slate-700"
    >
      <div>
        {/* Top-left Cyan Pill: Envío Digital */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00A3E0] text-white text-[10px] font-bold uppercase tracking-wider">
            <Zap className="w-2.5 h-2.5 fill-white" />
            <span>Envío Digital</span>
          </span>
        </div>

        {/* Product Image Section */}
        <div
          onClick={() => navigateToProduct(product.slug)}
          className="w-full aspect-square max-h-[170px] bg-white rounded-lg p-2 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform duration-200 my-2"
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

        {/* Category in Cyan text */}
        <div className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider mb-1">
          {getCategoryLabel(product.category)}
        </div>

        {/* Product Title */}
        <h3
          onClick={() => navigateToProduct(product.slug)}
          className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 cursor-pointer group-hover:text-[#00A3E0] transition-colors min-h-[2.5rem]"
          title={productName}
        >
          {productName}
        </h3>

        {/* Metadata Specs Pills */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10.5px] font-medium border border-slate-200/60">
            {durationTag}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10.5px] font-medium border border-slate-200/60">
            {deviceTag}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200/70">
            Stock: {stockCount} unid.
          </span>
        </div>

        {/* Variant selector chips if product has OEM/Retail variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 p-1 rounded-lg bg-slate-50 border border-slate-200">
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
                  className={`flex-1 py-1 px-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-[#00A3E0] text-white shadow-2xs'
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
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-black text-slate-900 tabular-nums">
            {formatPrice(activePrice)}
          </span>
          {activeOldPrice && (
            <span className="text-xs text-slate-400 line-through tabular-nums">
              {formatPrice(activeOldPrice)}
            </span>
          )}
        </div>

        {/* Full-width Cyan Button */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={handleAddToCart}
          className="w-full py-2.5 px-4 rounded-xl bg-[#00A3E0] hover:bg-[#0092cc] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-[0.98] cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Añadir al carrito</span>
        </button>
      </div>
    </article>
  );
};
