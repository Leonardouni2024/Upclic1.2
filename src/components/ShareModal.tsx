import React, { useState } from 'react';
import { Product, ProductVariant } from '../types.ts';
import {
  X,
  Share2,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';

interface ShareModalProps {
  product: Product;
  currentVariant?: ProductVariant;
  activePrice: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  product,
  currentVariant,
  activePrice,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.fallbackImage || product.imageUrl);

  if (!isOpen) return null;

  const productName = currentVariant ? `${product.name} (${currentVariant.name})` : product.name;
  const productPriceFormatted = `S/ ${activePrice.toFixed(2)}`;
  
  // Enlace oficial de upclic.store
  const productStoreUrl = `https://upclic.store/producto/${product.slug}`;

  // Mensaje de recomendación con enlace directo de upclic.store
  const exactMessage = `¡Hola! Te recomiendo este producto:\n\n🛍️ *${productName}*\n💰 *Precio:* ${productPriceFormatted}\n\n${productStoreUrl}`;

  // Enlace directo a WhatsApp
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(exactMessage)}`;
  
  // Enlace directo a Facebook
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productStoreUrl)}&quote=${encodeURIComponent(exactMessage)}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(exactMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="share-product-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header compacto */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-[#0066FF] flex items-center justify-center font-black shadow-2xs">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">
                Compartir Producto
              </h3>
              <p className="text-[11px] text-slate-500">
                Te recomiendo este producto
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body compacto */}
        <div className="p-3.5 space-y-3">
          {/* Card miniatura del producto */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
            <div className="w-13 h-13 rounded-lg bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center">
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

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-xs leading-snug truncate">
                {productName}
              </h4>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-slate-500">Precio:</span>
                <span className="text-sm font-black text-[#0066FF] tabular-nums">
                  {productPriceFormatted}
                </span>
                {product.oldPrice && (
                  <span className="text-[10px] text-slate-400 line-through tabular-nums">
                    S/ {product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Vista previa del mensaje */}
          <div className="p-2.5 rounded-xl bg-blue-50/40 border border-blue-100 text-xs space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-blue-900">
              <span>Mensaje a enviar:</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[#0066FF] hover:underline font-bold cursor-pointer"
              >
                {copied ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <div className="p-2 rounded-lg bg-white border border-blue-100/70 text-[11px] text-slate-700 whitespace-pre-line leading-relaxed font-sans select-all break-all">
              {exactMessage}
            </div>
          </div>

          {/* Botones de acción directos y más pequeños */}
          <div className="space-y-2 pt-0.5">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-bold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white shrink-0" />
              <span>Compartir en WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] active:scale-[0.98] text-white font-bold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-white text-[#1877F2] flex items-center justify-center font-black text-[10px] shrink-0">
                f
              </div>
              <span>Compartir en Facebook</span>
            </a>
          </div>
        </div>

        {/* Footer compacto */}
        <div className="px-3.5 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copiar texto</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
