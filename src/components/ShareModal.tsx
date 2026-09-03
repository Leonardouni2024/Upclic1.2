import React, { useState } from 'react';
import { Product, ProductVariant } from '../types.ts';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  Sparkles,
  FileText
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const productName = currentVariant ? `${product.name} (${currentVariant.name})` : product.name;
  const productPriceFormatted = `S/ ${activePrice.toFixed(2)}`;

  // Summary of description (first 2 sentences or 160 chars)
  const shortDescription = product.description
    ? product.description.split('\n')[0].slice(0, 160) + (product.description.length > 160 ? '...' : '')
    : 'Licencia digital 100% original con entrega inmediata y garantía oficial en UpClic.';

  // Pre-formatted text for WhatsApp and other platforms
  const shareText = `🛍️ *${productName}* en UpClic\n💰 *Precio:* ${productPriceFormatted}\n\n📋 *Detalles:* ${shortDescription}\n\n👉 *Ver y comprar online:* ${currentUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleCopyFullText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${productName} | UpClic`,
          text: `🛍️ ${productName} a solo ${productPriceFormatted} en UpClic. ${shortDescription}`,
          url: currentUrl,
        });
      } catch {
        // User canceled or failed
      }
    }
  };

  // Social Links
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`🛍️ ${productName} - ${productPriceFormatted}\n${shortDescription}`)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🛍️ ${productName} a solo ${productPriceFormatted} en UpClic. ${shortDescription}\n`)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div
      id="share-product-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0066FF] flex items-center justify-center font-black shadow-2xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                Compartir Producto
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Difunde esta oferta en tus redes sociales
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Card Preview of what is being shared (Image + Name + Description + Price) */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-slate-50 via-blue-50/20 to-slate-50 border border-slate-200 shadow-2xs">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#0066FF]" />
              <span>Vista previa para compartir</span>
            </div>

            <div className="flex items-start gap-3.5">
              {/* Product Image */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl bg-white p-2 border border-slate-200/90 shrink-0 flex items-center justify-center shadow-2xs">
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

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                  {productName}
                </h4>

                {/* Price pill */}
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Precio:</span>
                  <span className="text-base sm:text-lg font-black text-[#0066FF] tabular-nums">
                    {productPriceFormatted}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xs text-slate-400 line-through tabular-nums">
                      S/ {product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Description snippet */}
                <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {shortDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Social Media Sharing Grid */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2.5">
              Compartir directamente en:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] hover:text-[#075E54] font-bold text-xs transition-all shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-4 h-4 fill-white" />
                </div>
                <div className="truncate">
                  <span className="block font-black text-slate-900">WhatsApp</span>
                  <span className="text-[10px] text-slate-500 font-medium">Chat & Estados</span>
                </div>
              </a>

              {/* Facebook */}
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] font-bold text-xs transition-all shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform font-black text-sm">
                  f
                </div>
                <div className="truncate">
                  <span className="block font-black text-slate-900">Facebook</span>
                  <span className="text-[10px] text-slate-500 font-medium">Feed / Grupos</span>
                </div>
              </a>

              {/* Telegram */}
              <a
                href={telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#0088cc] font-bold text-xs transition-all shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#229ED9] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="block font-black text-slate-900">Telegram</span>
                  <span className="text-[10px] text-slate-500 font-medium">Canales / Grupos</span>
                </div>
              </a>

              {/* X / Twitter */}
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-900 font-bold text-xs transition-all shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform font-bold text-xs">
                  𝕏
                </div>
                <div className="truncate">
                  <span className="block font-black text-slate-900">X (Twitter)</span>
                  <span className="text-[10px] text-slate-500 font-medium">Publicar post</span>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] font-bold text-xs transition-all shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform font-bold text-xs">
                  in
                </div>
                <div className="truncate">
                  <span className="block font-black text-slate-900">LinkedIn</span>
                  <span className="text-[10px] text-slate-500 font-medium">Red profesional</span>
                </div>
              </a>

              {/* Native Web Share (if supported) */}
              {hasNativeShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-[#0066FF] font-bold text-xs transition-all shadow-2xs cursor-pointer group text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="block font-black text-[#0066FF]">Más apps</span>
                    <span className="text-[10px] text-slate-500 font-medium">Menú nativo</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Copy Link & Copy Details Action Bars */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            {/* Copy Link Input Bar */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Enlace directo al producto:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono select-all focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    copiedLink
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-2xs hover:shadow-xs'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Copy Complete Text Option */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-[11px] text-slate-600 font-medium">
                  Copiar ficha con texto, precio y descripción
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyFullText}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  copiedText
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                }`}
              >
                {copiedText ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>¡Ficha copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>Copiar texto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
