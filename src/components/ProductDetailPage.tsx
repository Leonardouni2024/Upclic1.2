import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { products, getProductBySlug, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '../products.ts';
import { useCart } from '../context/CartContext.tsx';
import { useReviews } from '../context/ReviewsContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { ProductReviewsSection } from './ProductReviewsSection.tsx';
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
  Download,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { addItem, navigateToHome, navigateToCheckout } = useCart();
  const { getProductStats } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const product = getProductBySlug(slug) || products[0];
  const stats = getProductStats(product.id);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);

  // Synchronize dynamic SEO title and meta description tag
  useEffect(() => {
    document.title = `${product.name} | UpClic`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `Compra ${product.name} en UpClic. Consulta precio, características y opciones de compra digital inmediata.`
      );
    }
    setImgSrc(product.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
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
        ? 'La entrega es inmediata. Recibirás tu correo electrónico y contraseña exclusiva asignada a tu dominio para iniciar sesión directamente en portal.office.com y descargar las aplicaciones activadas en tus dispositivos.'
        : 'La entrega es inmediata tras confirmar tu pago por WhatsApp o correo. Recibirás tu clave digital original de 25 caracteres junto con el enlace oficial de descarga de Microsoft y una guía de instalación paso a paso.'
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
      a: 'Cuentas con garantía total de activación. Si presentas algún inconveniente durante la instalación, nuestro equipo de soporte técnico te asiste en tiempo real vía WhatsApp.'
    },
    {
      q: '¿Puedo reinstalar el software si formateo mi PC?',
      a: product.isAccountAccess
        ? 'Sí, solo debes volver a iniciar sesión con tu cuenta en portal.office.com y reinstalar las aplicaciones en tu equipo.'
        : 'Sí, la clave permanece asociada a tu equipo o cuenta, permitiéndote reinstalar el software siempre que sea en la misma máquina.'
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
              <div className="relative w-full max-w-[480px] aspect-square rounded-2xl bg-linear-to-b from-slate-50/60 via-white to-white p-8 border border-slate-200/80 shadow-2xs flex items-center justify-center">
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-black rounded-lg bg-[#0066FF] text-white uppercase tracking-wider shadow-2xs border border-white/20">
                    {product.badge}
                  </span>
                )}
                {product.cloudStorage && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50/90 text-[#0066FF] border border-blue-200/70 shadow-2xs">
                    {product.cloudStorage}
                  </span>
                )}
                <img
                  src={imgSrc}
                  alt={product.name}
                  onError={() => {
                    if (imgSrc !== product.fallbackImage) {
                      setImgSrc(product.fallbackImage);
                    }
                  }}
                  className="w-full h-full object-contain"
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

                {/* Price Display */}
                <div className="mt-5 sm:mt-6 flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-bold text-slate-500">S/</span>
                    <span className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight tabular-nums leading-none">
                      {product.price.toFixed(2)}
                    </span>
                  </div>
                  {product.oldPrice && (
                    <span className="text-base sm:text-lg text-slate-400 line-through font-semibold tabular-nums">
                      S/ {product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Precio final en soles
                  </span>
                </div>

                {/* 35% Auto Discount or 30% Coupon reminder */}
                <div className="mt-3 p-2.5 sm:p-3 rounded-xl bg-linear-to-r from-blue-50/90 to-sky-50/80 border border-blue-200 text-[11px] sm:text-xs font-bold text-[#0066FF] flex items-center gap-2 shadow-2xs">
                  <span className="text-base shrink-0">🔥</span>
                  <span className="leading-snug">
                    ¡Lleva 2 o más productos y obtén <span className="text-emerald-700 underline font-black">35% de descuento</span>! O usa el cupón <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-[#0066FF] font-mono">PRIMUPCLIC</code> para 30% de descuento (en productos desde S/ 39.90).
                  </span>
                </div>

                {/* Direct Download ISO link banner */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                    <Download className="w-4 h-4 text-[#0066FF]" />
                    <span>Descarga directa disponible ({product.isoFormat || 'ISO Oficial'})</span>
                  </div>
                  <a
                    href={product.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0066FF] hover:underline"
                  >
                    <span>Descargar ahora</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
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

                {/* Primary Action Buttons */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>
            </div>
          </div>
        </div>

        {/* Details & Specs Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Description & Features & Installation Guide (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Download ISO & Installation Guide Block */}
            <div
              id="download-and-installation-guide"
              className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="w-5 h-5 text-[#0066FF]" />
                    <h3 className="text-lg font-black text-[#0f172a]">
                      Descarga Oficial de la ISO / Instalador
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {product.isoFormat || 'Archivo oficial directo de los servidores de Microsoft.'}
                  </p>
                </div>

                <a
                  id="product-detail-download-iso-btn"
                  href={product.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-blue-500/20 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{product.downloadLabel || 'Descargar ISO Oficial'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>

              {/* Step-by-Step Installation Instructions */}
              <div className="pt-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instrucciones de Instalación Paso a Paso</span>
                </h4>

                <div className="space-y-3">
                  {(product.installationSteps.length >= 5
                    ? product.installationSteps.slice(2, 5)
                    : product.installationSteps
                  ).map((rawStep, idx) => {
                    const cleanText = rawStep.replace(/^Paso\s*\d+\s*:\s*/i, '');
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80"
                      >
                        <span className="w-7 h-7 rounded-xl bg-[#0066FF] text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          {idx + 1}
                        </span>
                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          <span className="font-bold text-slate-900 mr-1.5">Paso {idx + 1}:</span>
                          {cleanText}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="text-slate-600 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    ¿Tienes dudas o necesitas asistencia remota durante la instalación?
                  </span>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hola UpClic, necesito ayuda para la instalación de ${product.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066FF] font-bold hover:underline"
                  >
                    Escríbenos al WhatsApp {WHATSAPP_DISPLAY} →
                  </a>
                </div>
              </div>
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
    </div>
  );
};

