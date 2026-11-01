import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Monitor,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  Copy,
  Check,
  MessageCircle,
  Clock,
  PackageCheck,
  FileText
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import {
  WHATSAPP_NUMBER,
  getProductDeviceTag,
  getProductDeliveryType,
  getProductIncludes,
  getProductTermsOfUse,
  getProductWarranty,
  getCategoryLabel
} from '../products';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const {
    addToCart,
    buyNow,
    setSelectedProduct,
    setSelectedCategory,
    formatPrice,
    language,
    getStock,
    catalogProducts
  } = useCart();

  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : undefined
  );

  useEffect(() => {
    setSelectedVariantId(
      product.variants && product.variants.length > 0 ? product.variants[0].id : undefined
    );
  }, [product]);

  const activeVariant = product.variants?.find(v => v.id === selectedVariantId);
  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentOldPrice = activeVariant ? activeVariant.oldPrice : product.oldPrice;

  const discountPercentage =
    currentOldPrice && currentOldPrice > currentPrice
      ? Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)
      : 0;

  const stock = getStock(product.id);
  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/producto/${product.slug}`
      : `https://upclic.store/producto/${product.slug}`;

  const handleCopyProductLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const variantText = activeVariant ? ` (${activeVariant.name})` : '';
  const whatsappDirectUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola UPCLIC, quiero consultar sobre ${product.name}${variantText} - Precio: ${formatPrice(currentPrice)}`
  )}`;

  const relatedProducts = catalogProducts
    .filter(p => p.category === product.category && p.id !== product.id && p.active !== false)
    .slice(0, 4);

  const deviceTag = getProductDeviceTag(product, language);
  const deliveryModeText = getProductDeliveryType(product, language);
  const productIncludes = getProductIncludes(product);
  const termsOfUseText = getProductTermsOfUse(product, selectedVariantId);
  const warrantyText = getProductWarranty(product);

  return (
    <div className="bg-[#F4F7FB] min-h-screen pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-[#1668E3] transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Catálogo
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <button
              onClick={() => setSelectedCategory(product.category)}
              className="hover:text-[#1668E3] transition-colors cursor-pointer shrink-0 font-medium"
            >
              {getCategoryLabel(product.category)}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[240px] sm:max-w-md">
              {product.name}
            </span>
          </nav>

          <button
            onClick={handleCopyProductLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Enlace copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Compartir ficha</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Product Showcase & Technical Summary */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Image Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#0B1F3A] text-white">
                  {product.badge || getCategoryLabel(product.category)}
                </span>
                {discountPercentage > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
                    Ahorra {discountPercentage}%
                  </span>
                )}
              </div>

              <div className="aspect-[4/3] sm:aspect-square max-h-[340px] w-full flex items-center justify-center bg-slate-50/70 rounded-xl border border-slate-200/60 p-6 sm:p-8">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full max-h-[260px] object-contain drop-shadow-md"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (product.fallbackImage && target.src !== product.fallbackImage) {
                      target.src = product.fallbackImage;
                    }
                  }}
                />
              </div>

              {/* Technical Summary Box directly below image */}
              <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Categoría:</span>
                  <span className="font-bold text-[#0B1F3A]">{getCategoryLabel(product.category)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Duración del servicio:</span>
                  <span className="font-bold text-[#0B1F3A]">{product.duration}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Dispositivos / Usuarios:</span>
                  <span className="font-bold text-[#0B1F3A]">{deviceTag}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 font-medium">Disponibilidad:</span>
                  <span className={`font-bold ${stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {stock > 0 ? `En stock (${stock} disponibles)` : 'Agotado temporalmente'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Commercial Details & Purchase Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
              {/* Top Verification Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <PackageCheck className="w-3.5 h-3.5" />
                  Entrega Digital Verificada
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-[#1668E3] border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Garantía Oficial UPCLIC
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-2.5">
                    Selecciona el tipo de licencia / versión:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.variants.map(v => {
                      const isSelected = v.id === selectedVariantId;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#1668E3] bg-blue-50/50 shadow-2xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-sm text-[#0B1F3A]">{v.name}</span>
                            <span className="text-sm font-extrabold text-[#1668E3] whitespace-nowrap">
                              {formatPrice(v.price)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{v.shortDesc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price & Primary Actions Box (Adapted cleanly so buttons never wrap awkwardly) */}
              <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/90 mb-6 space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block mb-1">
                      Precio en Soles (PEN):
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
                        {formatPrice(currentPrice)}
                      </span>
                      {currentOldPrice && currentOldPrice > currentPrice && (
                        <span className="text-base text-slate-400 line-through font-semibold">
                          {formatPrice(currentOldPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-3 py-1.5 rounded-lg">
                    {product.duration} • Sin cargos ocultos
                  </span>
                </div>

                {/* Full-width 2-Column Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                  <button
                    onClick={() => buyNow(product, 1, selectedVariantId)}
                    disabled={stock <= 0}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>Comprar Ahora</span>
                  </button>

                  <button
                    onClick={() => addToCart(product, 1, selectedVariantId)}
                    disabled={stock <= 0}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#0B1F3A] hover:bg-[#1668E3] disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    <span>Añadir al Carrito</span>
                  </button>
                </div>
              </div>

              {/* Transparent Commercial Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Qué incluye */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B1F3A] mb-2.5 flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-[#1668E3] shrink-0" />
                    Qué incluye tu compra
                  </h3>
                  <ul className="space-y-2">
                    {productIncludes.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Características principales */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B1F3A] mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1668E3] shrink-0" />
                    Características principales
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1668E3] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modalidad de entrega, Condiciones de uso y Garantía */}
              <div className="space-y-3 border-t border-slate-200/80 pt-5">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0B1F3A] mb-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#1668E3] shrink-0" />
                    Modalidad de entrega
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{deliveryModeText}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0B1F3A] mb-1 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#1668E3] shrink-0" />
                    Condiciones de uso y tipo de licencia
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{termsOfUseText}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0B1F3A] mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    Garantía aplicable y compatibilidad
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed mb-1">{warrantyText}</p>
                  <p className="text-xs text-slate-600">
                    <strong>Compatibilidad:</strong> {product.compatibility}
                  </p>
                </div>

                {product.warning && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 leading-relaxed">{product.warning}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-step Activation Guide */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
              <h2 className="text-base sm:text-lg font-extrabold text-[#0B1F3A] mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[#1668E3]" />
                Pasos de Instalación y Activación
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.installationSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1668E3] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-extrabold text-[#0B1F3A] mb-5">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => setSelectedProduct(rel)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#1668E3] transition-all cursor-pointer flex items-center gap-3.5 shadow-2xs"
                >
                  <img
                    src={rel.imageUrl}
                    alt={rel.name}
                    className="w-14 h-14 object-contain shrink-0"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (rel.fallbackImage && target.src !== rel.fallbackImage) {
                        target.src = rel.fallbackImage;
                      }
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-[#0B1F3A] truncate">{rel.name}</h3>
                    <span className="text-sm font-extrabold text-[#1668E3] block mt-0.5">
                      {formatPrice(rel.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
