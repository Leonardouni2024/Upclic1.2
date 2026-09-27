import React from 'react';
import { products, WHATSAPP_NUMBER } from '../products.ts';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useReviews } from '../context/ReviewsContext.tsx';
import { MessageCircle, ShoppingCart, Star, ArrowRight, ShieldCheck, Check, Scale } from 'lucide-react';

export const FeaturedProductsSection: React.FC = () => {
  const { 
    addItem, 
    navigateToProduct, 
    isInComparison,
    toggleComparison,
    formatPrice, 
    t, 
    currency, 
    language,
    getProductName,
    getProductDesc,
    getBadgeLabel,
    getDurationLabel
  } = useCart();
  const { getProductStats } = useReviews();

  const isEn = language === 'EN';

  // Curated flagship featured products requested by user
  const featuredIds = [
    'prod-office-2024',
    'prod-win11-pro',
    'prod-office-365',
    'prod-canva-pro',
    'prod-mcafee-antivirus',
    'prod-win10-pro',
    'prod-project-2024',
    'prod-visio-2024'
  ];

  const featuredItems: Product[] = featuredIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const handleWhatsAppBuy = (product: Product) => {
    const text = isEn
      ? `Hello UpClic, I would like to buy the license for *${getProductName(product)}* for *${formatPrice(product.price)}*. Could you please provide payment and instant delivery details?`
      : `Hola UpClic, deseo comprar la licencia de *${getProductName(product)}* por *${formatPrice(product.price)}*. ¿Me podrían brindar los medios de pago para coordinar la entrega inmediata?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="destacados-section" className="py-14 sm:py-18 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0067B8] text-xs font-bold tracking-wide uppercase mb-2">
              <span>{isEn ? 'Best Sellers & Recommended' : 'Más Vendidos & Recomendados'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              {isEn ? 'Featured Products' : 'Productos Destacados'}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-normal">
              {isEn
                ? 'The most requested software licenses for companies, professionals, and students with instant digital delivery.'
                : 'Las licencias más solicitadas por empresas, profesionales y estudiantes con entrega digital inmediata.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              {currency === 'PEN' && 'Precios oficiales en Soles peruanos'}
              {currency === 'USD' && (isEn ? 'Official prices in US Dollars ($ USD)' : 'Precios oficiales en Dólares ($ USD)')}
              {currency === 'COP' && 'Precios oficiales en Pesos colombianos ($ COP)'}
              {currency === 'MXN' && 'Precios oficiales en Pesos mexicanos ($ MXN)'}
            </span>
          </div>
        </div>

        {/* E-Commerce Cards Grid (Amazon/Mercado Libre style, clean & elevated) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredItems.map((product) => {
            const stats = getProductStats(product.id);
            const discountPercent = product.oldPrice && product.oldPrice > product.price
              ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
              : 0;

            const name = getProductName(product);
            const desc = getProductDesc(product);
            const badge = getBadgeLabel(product.badge) || (isEn ? 'Genuine' : 'Genuino');
            const duration = getDurationLabel(product.duration);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-slate-200 hover:border-[#0067B8] hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Top Badge & Discount & Compare */}
                <div className="p-4 pb-0 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0067B8] border border-blue-200 uppercase tracking-wider truncate max-w-[150px]">
                    {badge}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Compare button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComparison(product);
                      }}
                      className={`p-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                        isInComparison(product.id)
                          ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 border-slate-200'
                      }`}
                      title={isInComparison(product.id) ? t('compareRemove') : t('compareAdd')}
                      aria-label={isInComparison(product.id) ? t('compareRemove') : t('compareAdd')}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>

                    {discountPercent > 0 && (
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Image */}
                <div
                  onClick={() => navigateToProduct(product.slug)}
                  className="mx-4 my-2 aspect-square max-h-[190px] bg-slate-50 rounded-lg border border-slate-100 p-4 flex items-center justify-center cursor-pointer group-hover:scale-102 transition-transform duration-200"
                >
                  <img
                    src={product.imageUrl}
                    alt={name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = product.fallbackImage;
                    }}
                  />
                </div>

                {/* Body Content */}
                <div className="p-4 pt-2 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-1.5 text-xs">
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
                      <span className="font-bold text-[#0B1F3A] text-xs tabular-nums">
                        {stats.averageRating.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-slate-400">({stats.totalReviews})</span>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => navigateToProduct(product.slug)}
                      className="font-bold text-sm text-[#0B1F3A] group-hover:text-[#0067B8] transition-colors cursor-pointer line-clamp-2 leading-snug min-h-[2.5rem]"
                      title={name}
                    >
                      {name}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  {/* Pricing & Call to Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-extrabold text-[#0B1F3A] tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-500 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">
                        {duration}
                      </span>
                    </div>

                    {/* Action Buttons: Comprar por WhatsApp + Agregar */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleWhatsAppBuy(product)}
                        className="w-full py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all duration-150 cursor-pointer active:scale-[0.98]"
                        title={isEn ? 'Buy via WhatsApp with a live agent' : 'Comprar por WhatsApp directamente con un asesor'}
                      >
                        <MessageCircle className="w-4 h-4 fill-white stroke-none shrink-0" />
                        <span>{isEn ? 'Buy via WhatsApp' : 'Comprar por WhatsApp'}</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addItem(product, 1)}
                          className="w-full py-2 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 border border-slate-200 transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate">{t('addToCart')}</span>
                        </button>

                        <button
                          onClick={() => navigateToProduct(product.slug)}
                          className="w-full py-2 px-2 rounded-lg bg-[#0067B8] hover:bg-[#005499] text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>{t('viewProduct')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
