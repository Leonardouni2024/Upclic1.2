import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { products, getProductBySlug, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '../products.ts';
import { useCart } from '../context/CartContext.tsx';
import { useReviews } from '../context/ReviewsContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { ProductReviewsSection } from './ProductReviewsSection.tsx';
import { ComparisonTable } from './ComparisonTable.tsx';
import { InstallationModal } from './InstallationModal.tsx';
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
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { addItem, navigateToHome, navigateToCheckout } = useCart();
  const { getProductStats } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const product = getProductBySlug(slug) || products[0];
  const stats = getProductStats(product.id);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [selectedVariantId, setSelectedVariantId] = useState<'oem' | 'retail'>(
    product.variants ? product.variants[0].id : 'oem'
  );

  const currentVariant = product.variants
    ? product.variants.find(v => v.id === selectedVariantId) || product.variants[0]
    : undefined;

  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeOldPrice = currentVariant ? currentVariant.oldPrice : product.oldPrice;

  // Synchronize dynamic SEO title, meta description, and OpenGraph social share tags
  useEffect(() => {
    const pageTitle = `${product.name} - S/ ${activePrice.toFixed(2)} | UpClic`;
    document.title = pageTitle;

    const shortDesc = `Compra ${product.name} al mejor precio de S/ ${activePrice.toFixed(2)} en UpClic. Licencia digital original, entrega inmediata y garantía oficial.`;
    
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

    setImgSrc(product.imageUrl);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product, activePrice]);

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
        ? '¿Cómo recibiré mi acceso a Office 365 Profesional?'
        : '¿Cómo y cuándo recibiré mi licencia de software?',
      a: product.isAccountAccess
        ? 'Al completar tu pago y enviar la captura por WhatsApp, validamos la transacción y te enviamos tus credenciales oficiales de acceso en un lapso de 10 a 20 minutos.'
        : 'Al completar tu pago y enviar tu captura de comprobante por WhatsApp, validamos tu compra y te entregamos tu clave digital original de 25 caracteres y guía oficial en un lapso estimado de 10 a 20 minutos.'
    },
    {
      q: '¿La licencia es original y permanente?',
      a: product.duration === '1 año'
        ? 'Es una suscripción original garantizada por 1 año con 100 GB de almacenamiento OneDrive y soporte continuo de Microsoft.'
        : product.isAccountAccess
        ? 'Es una cuenta oficial corporativa con acceso completo a las aplicaciones de Office (Word, Excel, PowerPoint, Outlook) con actualizaciones continuas.'
        : 'Sí, es una licencia 100% original, perpetua y de por vida para 1 computadora. No tiene costos mensuales ni renovaciones.'
    },
    {
      q: '¿Qué garantía tengo al comprar en UpClic?',
      a: 'Cuentas con garantía de 6 meses si presentas algún inconveniente durante o después de la instalación. Nuestro equipo de soporte técnico te asiste en tiempo real vía WhatsApp.'
    },
    {
      q: '¿Puedo reinstalar el software si formateo mi PC?',
      a: product.isAccountAccess
        ? 'Sí, solo debes volver a iniciar sesión con tu cuenta en portal.office.com y reinstalar las aplicaciones en tu equipo.'
        : 'Solo para las licencias Windows están disponibles, ya que estas licencias se vinculan directamente en placa de su dispositivo PC/laptop.'
    }
  ];

  return (
    <div id="product-detail-view" className="py-10 sm:py-14 bg-slate-50/70 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={navigateToHome}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#0066FF] hover:border-blue-200 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la tienda</span>
          </button>

          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Inicio / {product.category.toUpperCase()} / {product.name}
          </span>
        </div>

        {/* Main Product Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Image Column (1:1 Aspect Ratio, clean background) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[480px] aspect-square rounded-2xl bg-linear-to-b from-slate-50/60 via-white to-white p-8 border border-slate-200/80 shadow-2xs flex items-center justify-center group">
                {/* Badges on Top-Left */}
                <div className="absolute top-3.5 left-3.5 flex flex-col items-start gap-1.5 z-10">
                  {product.badge && (
                    <span className="px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-black rounded-lg bg-[#0066FF] text-white uppercase tracking-wider shadow-2xs border border-white/20">
                      {product.badge}
                    </span>
                  )}
                  {product.cloudStorage && (
                    <span className="px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-lg bg-blue-50/95 text-[#0066FF] border border-blue-200/80 shadow-2xs backdrop-blur-xs">
                      {product.cloudStorage}
                    </span>
                  )}
                </div>

                {/* Share Button on Top-Right of the image */}
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-[#0066FF] text-slate-700 hover:text-white border border-slate-200 hover:border-[#0066FF] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-xs font-bold active:scale-95 group/share backdrop-blur-xs"
                  title="Compartir producto en redes sociales"
                  aria-label="Compartir en redes sociales"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#0066FF] group-hover/share:text-white transition-colors" />
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
              <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Activación oficial garantizada
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Pago seguro Mercado Pago
                </span>
              </div>
            </div>

            {/* Information & Purchase Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Warning notice if legacy version */}
                {product.warning && (
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50/90 px-3 py-1.5 rounded-xl border border-amber-200/70">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
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
                  title="Ver opiniones y reseñas de clientes"
                >
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(stats.averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-extrabold text-sm text-slate-800 tabular-nums group-hover:text-[#0066FF] transition-colors">
                    {stats.averageRating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-[#0066FF] underline underline-offset-2 transition-colors">
                    ({stats.totalReviews} {stats.totalReviews === 1 ? 'calificación verificada' : 'calificaciones verificadas'})
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* License Tag & Cloud pill */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-slate-200/60">
                    Modalidad: {product.duration}
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold border border-emerald-100">
                    ✓ Licencia 100% Original Microsoft
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-blue-50 text-[#0066FF] text-[11px] sm:text-xs font-bold border border-blue-100">
                    ✓ Entrega digital inmediata
                  </span>
                </div>

                {/* Variant Selector (OEM vs Retail) for Windows products */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                        Selecciona el tipo de clave:
                      </span>
                      <span className="text-[11px] font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {currentVariant?.name} (S/ {activePrice.toFixed(2)})
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
                                ? 'bg-blue-50/60 border-[#0066FF] shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected
                                      ? 'border-[#0066FF] bg-[#0066FF]'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <span className={`text-xs font-black ${isSelected ? 'text-[#0066FF]' : 'text-slate-800'}`}>
                                  {v.name}
                                </span>
                              </div>
                              {v.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700">
                                  {v.badge}
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xs font-bold text-slate-500">S/</span>
                              <span className="text-lg font-black text-slate-950 tabular-nums">
                                {v.price.toFixed(2)}
                              </span>
                              {v.oldPrice && (
                                <span className="text-xs text-slate-400 line-through tabular-nums">
                                  S/ {v.oldPrice.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 leading-snug font-medium">
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
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-bold text-slate-500">S/</span>
                    <span className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums leading-none">
                      {activePrice.toFixed(2)}
                    </span>
                  </div>
                  {activeOldPrice && (
                    <span className="text-base sm:text-lg text-slate-400 line-through font-semibold tabular-nums">
                      S/ {activeOldPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Precio final en soles
                  </span>
                </div>

                {/* 10% Auto Discount or 10% Coupon reminder */}
                <div className="mt-3 p-2.5 sm:p-3 rounded-xl bg-linear-to-r from-blue-50/90 to-sky-50/80 border border-blue-200 text-[11px] sm:text-xs font-bold text-[#0066FF] flex items-center gap-2 shadow-2xs">
                  <span className="text-base shrink-0">🔥</span>
                  <span className="leading-snug">
                    ¡Lleva 2 o más productos y obtén <span className="text-emerald-700 underline font-black">10% de descuento</span>! O usa el cupón <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-[#0066FF] font-mono">PRIMUPCLIC</code> para 10% de descuento (en productos desde S/ 40.00).
                  </span>
                </div>

                {/* Quantity selector */}
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Cantidad:
                  </span>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white font-black text-base flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Disminuir"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-black text-sm text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white font-black text-base flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Aumentar"
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
                      className="py-3 px-6 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-sm shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-blue-500/20"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Agregar al carrito</span>
                    </button>

                    <button
                      id="detail-buy-now-btn"
                      onClick={handleBuyNow}
                      className="py-3 px-6 rounded-xl bg-[#0f172a] hover:bg-slate-900 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-slate-800"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Comprar ahora</span>
                    </button>
                  </div>

                  {/* Botón Guía de instalación (Abre ventana con descarga oficial y pasos) */}
                  <button
                    id="detail-guide-btn"
                    onClick={() => setShowInstallModal(true)}
                    className="w-full py-3 px-4 rounded-xl bg-blue-50/90 hover:bg-blue-100 text-[#0066FF] font-bold text-sm border border-blue-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <BookOpen className="w-4 h-4 text-[#0066FF]" />
                    <span>Guía de instalación</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Specs Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Description & Features & Installation Guide (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Short & Understandable Buying Instructions */}
            <div
              id="how-to-buy-product-guide"
              className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs"
            >
              <div className="flex items-center gap-2.5 pb-5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0f172a]">
                    ¿Cómo comprar {product.name}?
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Proceso de 4 pasos simples y rápidos para recibir tu licencia
                  </p>
                </div>
              </div>

              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Paso 1 */}
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex gap-3 items-start">
                  <span className="w-7 h-7 rounded-xl bg-[#0066FF] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    1
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#0066FF] mb-1">
                      1. Link de Pago y Monto
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Al presionar <strong className="text-slate-900 font-bold">"Comprar ahora"</strong>, serás redireccionado al link de pago seguro. Digita el monto exacto: <span className="font-bold text-[#0066FF]">S/ {product.price.toFixed(2)}</span> y presiona <strong className="text-slate-900 font-bold">"Continuar"</strong>.
                    </p>
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex gap-3 items-start">
                  <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    2
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-700 mb-1">
                      2. Opciones de Pago
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Se abrirán tus métodos preferidos: <strong className="text-slate-900">Tarjeta de crédito/débito</strong>, <strong className="text-slate-900">Banca o agentes</strong>, <strong className="text-slate-900">PagoEfectivo</strong> y <strong className="text-slate-900">Yape</strong>.
                    </p>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex gap-3 items-start">
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    3
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-1">
                      3. Redirección y Captura
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Al completar el pago, serás redireccionado automáticamente al chat de WhatsApp del proveedor. Envía la <strong className="text-slate-900 font-bold">captura de tu pago</strong> como confirmación.
                    </p>
                  </div>
                </div>

                {/* Paso 4 */}
                <div className="p-4 rounded-2xl bg-green-50/70 border border-green-100 flex gap-3 items-start">
                  <span className="w-7 h-7 rounded-xl bg-green-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    4
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-green-700 mb-1">
                      4. Entrega (10 a 20 min)
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Validamos tu comprobante y te entregamos tu clave original y guía de activación. El tiempo de respuesta es de <span className="font-bold text-green-800">10 a 20 minutos</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Installation Guide Trigger Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    ¿Deseas descargar el instalador oficial o consultar la guía?
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Descarga directa desde servidores oficiales y manual de instalación.
                  </p>
                </div>
              </div>

              <button
                id="product-detail-open-guide-btn"
                onClick={() => setShowInstallModal(true)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <BookOpen className="w-4 h-4" />
                <span>Guía de instalación</span>
              </button>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-black text-[#0f172a] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#0066FF]" />
                <span>Descripción del Producto</span>
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>

              <h4 className="font-extrabold text-slate-800 text-sm mt-6 mb-3 uppercase tracking-wider">
                Características Principales:
              </h4>
              <ul className="space-y-2.5">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compatibility & License details */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-black text-[#0f172a] mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#0066FF]" />
                <span>Compatibilidad y Requisitos</span>
              </h3>
              <p className="text-sm text-slate-700 font-medium mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                {product.compatibility}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="font-bold text-slate-800 block mb-1">Modalidad de Licencia:</span>
                  <span>{product.duration}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="font-bold text-slate-800 block mb-1">
                    Tipo de Entrega / Clave:
                  </span>
                  <span>
                    {product.id === 'prod-m365'
                      ? 'Credenciales oficiales directas (correo y contraseña asignados a su dominio)'
                      : 'Clave digital alfanumérica de 25 caracteres (Original Microsoft)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion Column (1 col) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs h-fit">
            <h3 className="text-lg font-black text-[#0f172a] mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#0066FF]" />
              <span>Preguntas Frecuentes</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200/80 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-3.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'transform rotate-180 text-[#0066FF]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
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
            <h3 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
              Productos Relacionados
            </h3>
            <button
              onClick={navigateToHome}
              className="text-xs font-bold text-[#0066FF] hover:underline"
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

      {/* Installation Guide Modal (Exclusive download button & native hardware steps) */}
      <InstallationModal
        product={product}
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

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

