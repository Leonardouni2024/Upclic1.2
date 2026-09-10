import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { products, getProductBySlug, WHATSAPP_DISPLAY, WHATSAPP_NUMBER , formatPrice } from '../products.ts';
import { useCart } from '../context/CartContext.tsx';
import { useReviews } from '../context/ReviewsContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { ProductReviewsSection } from './ProductReviewsSection.tsx';
import { ComparisonTable } from './ComparisonTable.tsx';
import { ShareModal } from './ShareModal.tsx';
import {
  Star,
  ShoppingCart,
  Zap,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Clock,
  HelpCircle,
  AlertCircle,
  Share2,
  Lock,
  ChevronDown,
  BookOpen,
  CreditCard,
  Send,
  Download,
  ExternalLink,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { addItem, navigateToHome, navigateToCheckout, t, currency } = useCart();
  const { getProductStats } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const product = getProductBySlug(slug) || products[0];
  const stats = getProductStats(product.id);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [selectedVariantId, setSelectedVariantId] = useState<'oem' | 'retail'>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : 'oem'
  );
  
  const [showScarcity, setShowScarcity] = useState<{ show: boolean, count: number }>({ show: false, count: 0 });

  useEffect(() => {
    // Generate scarcity badge after 15-20 seconds on the page
    const timer = setTimeout(() => {
      // Random count between 2 and 6
      const randomCount = Math.floor(Math.random() * 5) + 2;
      setShowScarcity({ show: true, count: randomCount });
    }, 15000);
    return () => clearTimeout(timer);
  }, [product.id]);

  // Reset selected variant only when navigating to a different product
  useEffect(() => {
    setImgSrc(product.imageUrl);
    setQuantity(1);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product.id, product.slug]);

  const currentVariant = product.variants
    ? product.variants.find(v => v.id === selectedVariantId) || product.variants[0]
    : undefined;

  
  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeOldPrice = currentVariant ? currentVariant.oldPrice : product.oldPrice;
  const discountPercent = activeOldPrice && activeOldPrice > activePrice 
    ? Math.round(((activeOldPrice - activePrice) / activeOldPrice) * 100) 
    : 0;


  // Synchronize dynamic SEO title, meta description, and OpenGraph social share tags
  useEffect(() => {
    const variantSuffix = currentVariant ? ` (${currentVariant.name})` : '';
    const pageTitle = `${product.name}${variantSuffix} - S/ ${activePrice.toFixed(2)} | UpClic`;
    document.title = pageTitle;

    const shortDesc = `Compra ${product.name}${variantSuffix} al mejor precio de S/ ${activePrice.toFixed(2)} en UpClic. Licencia digital original, entrega inmediata y garantía oficial.`;
    
    // Update or create helper for meta tags
    const updateMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          const propName = selector.match(/property="([^"]+)"/)?.[1];
          if (propName) element.setAttribute('property', propName);
        } else if (selector.includes('name=')) {
          const nameAttr = selector.match(/name="([^"]+)"/)?.[1];
          if (nameAttr) element.setAttribute('name', nameAttr);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    const fullImageUrl = window.location.origin + product.imageUrl;
    const currentUrl = window.location.href;

    updateMetaTag('meta[name="description"]', 'content', shortDesc);
    updateMetaTag('meta[property="og:title"]', 'content', pageTitle);
    updateMetaTag('meta[property="og:description"]', 'content', shortDesc);
    updateMetaTag('meta[property="og:image"]', 'content', fullImageUrl);
    updateMetaTag('meta[property="og:url"]', 'content', currentUrl);
    updateMetaTag('meta[name="twitter:title"]', 'content', pageTitle);
    updateMetaTag('meta[name="twitter:description"]', 'content', shortDesc);
    updateMetaTag('meta[name="twitter:image"]', 'content', fullImageUrl);
  }, [product.name, product.imageUrl, activePrice, currentVariant]);

  const handleAddToCart = () => {
    addItem(product, quantity, currentVariant ? currentVariant.id : undefined);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, currentVariant ? currentVariant.id : undefined);
    navigateToCheckout();
  };

  // Related products from same category or complementary
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.bestSeller))
    .slice(0, 4);

  const faqs = [
    {
      q: product.isAccountAccess
        ? t('productFaqTitle1')
        : t('productFaqTitle1'),
      a: product.isAccountAccess
        ? t('productFaqAns1M365')
        : t('productFaqAns1Default')
    },
    {
      q: t('productFaqTitle2'),
      a: t('productFaqAns2')
    },
    {
      q: '¿La licencia es original y permanente?',
      a: product.duration === '1 año'
        ? t('productFaqAns3M365')
        : product.isAccountAccess
        ? t('productFaqAns3M365Corp')
        : t('productFaqAns3Default')
    },
    {
      q: '¿Qué garantía tengo al comprar en UpClic?',
      a: t('productFaqAns4')
    },
    {
      q: '¿Puedo reinstalar el software si formateo mi PC?',
      a: product.isAccountAccess
        ? t('productFaqAns5M365')
        : product.category === 'windows'
        ? t('productFaqAns5Windows')
        : t('productFaqAns5Default')
    }
  ];

  return (
    <div id="product-detail-view" className="py-10 sm:py-14 bg-[#100c22] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={navigateToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1d123a] border border-white/15 text-xs sm:text-sm font-bold text-white hover:text-[#facc15] hover:border-[#facc15] shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#facc15]" />
            <span>Volver a la tienda</span>
          </button>

          <span className="text-xs font-semibold text-purple-200 hidden sm:inline">
            Inicio / {product.category.toUpperCase()} / {product.name}
          </span>
        </div>

        {/* Main Product Box */}
        <div className="bg-[#17132e] rounded-xl border border-white/5 shadow-md p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Image Column (1:1 Aspect Ratio, clean background) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[480px] aspect-square rounded-lg bg-[#0f172a] p-8 border border-white/5 flex items-center justify-center group">
                {/* Badges on Top-Left */}
                <div className="absolute top-3.5 left-3.5 flex flex-col items-start gap-1.5 z-10">
                  {product.badge && (
                    <span className="px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-md bg-[#334155] text-white uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                  {product.cloudStorage && (
                    <span className="px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-md bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                      {product.cloudStorage}
                    </span>
                  )}
                </div>

                {/* Share Button on Top-Right of the image */}
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 shadow-md transition-all duration-200 cursor-pointer text-xs font-bold active:scale-95 group/share backdrop-blur-md"
                  title={t('productShareTitle')}
                  aria-label={t('productShareTitle')}
                >
                  <Share2 className="w-3.5 h-3.5 text-[#facc15]" />
                  <span className="text-[11px] sm:text-xs font-bold">Compartir</span>
                </button>

                <img
                  src={imgSrc}
                  alt={product.name}
                  onError={() => {
                    if (imgSrc !== product.fallbackImage) {
                      setImgSrc(product.fallbackImage);
                    }
                  }}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Trust Badge under image */}
              <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-purple-200">
                <span className="flex items-center gap-1.5 text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Activación oficial garantizada
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <Lock className="w-4 h-4 text-[#facc15]" />
                  Pago seguro Mercado Pago
                </span>
              </div>
            </div>

            {/* Information & Purchase Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Warning notice if legacy version */}
                {product.warning && (
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-400/30">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{product.warning}</span>
                  </div>
                )}

                {/* Stars and Reviews */}
                <div
                  onClick={() => {
                    const el = document.getElementById('customer-reviews-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 mb-2 cursor-pointer group w-fit"
                  title={t('productReviewsTitle')}
                >
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(stats.averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-extrabold text-sm text-white tabular-nums group-hover:text-[#facc15] transition-colors">
                    {stats.averageRating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-purple-300 group-hover:text-[#facc15] underline underline-offset-2 transition-colors">
                    ({stats.totalReviews} {t('productVerifiedRatings')})
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* License Tag & Cloud pill */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-white/10 text-purple-100 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/15">
                    Modalidad: {product.duration}
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] sm:text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Licencia 100% Original Microsoft</span>
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-400/30 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Entrega digital inmediata</span>
                  </span>
                </div>

                {/* Variant Selector (OEM vs Retail) for Windows products */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-5 p-4 rounded-lg bg-[#140b2b] border border-white/10">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-black uppercase text-purple-200 tracking-wider">
                        Selecciona el tipo de clave:
                      </span>
                      <span className="text-[11px] font-bold text-slate-950 bg-[#facc15] px-2 py-0.5 rounded-md border border-amber-300">
                        {currentVariant?.name} ({formatPrice(activePrice)})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariantId === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariantId(v.id)}
                            className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                              isSelected
                                ? 'bg-amber-400/10 border-[#facc15] shadow-md'
                                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected
                                      ? 'border-[#facc15] bg-[#facc15]'
                                      : 'border-white/30 bg-transparent'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                                </div>
                                <span className={`text-xs font-black ${isSelected ? 'text-[#facc15]' : 'text-white'}`}>
                                  {v.name}
                                </span>
                              </div>
                              {v.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-purple-200">
                                  {v.badge}
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-sm font-black text-[#facc15]">
                                {formatPrice(v.price)}
                              </span>
                              {v.oldPrice && (
                                <span className="text-xs text-purple-300 line-through tabular-nums">
                                  {formatPrice(v.oldPrice)}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-purple-200 leading-snug font-medium">
                              {v.shortDesc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="mt-5 sm:mt-6 flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                  <div className="flex items-baseline gap-1 text-2xl sm:text-3xl font-black text-[#facc15]">
                    {formatPrice(activePrice)}
                  </div>
                  {activeOldPrice && (
                    <span className="text-base sm:text-lg text-purple-300 line-through font-semibold tabular-nums">
                      {formatPrice(activeOldPrice)}
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs font-bold uppercase text-purple-200 tracking-wider">
                    Cantidad:
                  </span>
                  <div className="flex items-center rounded-xl border border-white/20 bg-white/10 p-0.5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg text-white hover:bg-white/20 font-black text-base flex items-center justify-center transition-colors cursor-pointer"
                      aria-label={t('decrease') || 'Decrease'}
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-black text-sm text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg text-white hover:bg-white/20 font-black text-base flex items-center justify-center transition-colors cursor-pointer"
                      aria-label={t('increase') || 'Increase'}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons & Installation Guide Button */}
                <div className="mt-6 flex flex-col gap-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      id="detail-add-to-cart-btn"
                      onClick={handleAddToCart}
                      className="py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-white/20"
                    >
                      <ShoppingCart className="w-4 h-4 text-purple-200" />
                      <span>{t('addToCart')}</span>
                    </button>

                    <button
                      id="detail-buy-now-btn"
                      onClick={handleBuyNow}
                      className="py-3.5 px-6 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-amber-300"
                    >
                      <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                      <span>{t('buyNow')}</span>
                    </button>
                  </div>

                  {/* Scarcity & Trust Indicators */}
                  <div className="flex flex-col gap-3 my-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold text-purple-200">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Garantía de Activación</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Entrega Inmediata al Email</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Soporte Remoto Gratuito</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pago Seguro y Encriptado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Specs Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Description & Features (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Description */}
            <div className="bg-[#180e38] rounded-xl border border-white/10 p-6 sm:p-8 shadow-xl text-white">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#facc15]" />
                <span>Descripción del Producto</span>
              </h3>
              <p className="text-purple-200 text-xs sm:text-sm md:text-base leading-relaxed">
                {product.description}
              </p>

              <h4 className="font-extrabold text-amber-300 text-xs sm:text-sm mt-6 mb-3 uppercase tracking-wider">
                Características Principales:
              </h4>
              <ul className="space-y-2.5">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-purple-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compatibility & License details */}
            <div className="bg-[#180e38] rounded-xl border border-white/10 p-6 sm:p-8 shadow-xl text-white">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#facc15]" />
                <span>Compatibilidad y Requisitos</span>
              </h3>
              <p className="text-xs sm:text-sm text-purple-200 font-medium mb-4 bg-[#110928] p-4 rounded-xl border border-white/10">
                {product.compatibility}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-purple-200">
                <div className="p-3.5 rounded-xl border border-white/10 bg-[#110928]">
                  <span className="font-bold text-white block mb-1">Modalidad de Licencia:</span>
                  <span>{product.duration}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-white/10 bg-[#110928]">
                  <span className="font-bold text-white block mb-1">
                    Tipo de Entrega / Clave:
                  </span>
                  <span>
                    {product.id === 'prod-m365'
                      ? t('productLicenseKeyDescM365')
                      : t('productLicenseKeyDescDefault')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion Column (1 col) */}
          <div className="bg-[#180e38] rounded-xl border border-white/10 p-6 sm:p-8 shadow-xl text-white h-fit">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#facc15]" />
              <span>Preguntas Frecuentes</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border border-white/10 rounded-xl overflow-hidden bg-[#110928]">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/5 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-purple-300 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'transform rotate-180 text-[#facc15]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs text-purple-200 leading-relaxed bg-white/5 border-t border-white/10">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Comparison Table */}
        <ComparisonTable currentCategory={product.category} />

        {/* Customer Reviews and Rating System */}
        <ProductReviewsSection product={product} />

        {/* Related Products Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Productos Relacionados
            </h3>
            <button
              onClick={navigateToHome}
              className="text-xs sm:text-sm font-bold text-[#facc15] hover:underline cursor-pointer"
            >
              Ver todo el catálogo →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Social Media & Product Share Modal */}
      <ShareModal
        product={product}
        currentVariant={currentVariant}
        activePrice={activePrice}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

