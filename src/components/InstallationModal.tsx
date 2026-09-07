import React from 'react';
import { Product } from '../types.ts';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '../products.ts';
import { useCart } from '../context/CartContext.tsx';
import {
  X,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Headphones,
  Copy,
  Check
} from 'lucide-react';

interface InstallationModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const InstallationModal: React.FC<InstallationModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { t } = useCart();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = (url: string, id: string = 'primary') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const hasMultipleDownloads = Boolean(product.downloadOptions && product.downloadOptions.length > 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#180e38] text-white w-full max-w-2xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between bg-[#110928]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-[#facc15] flex items-center justify-center font-black border border-amber-400/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-lg leading-tight">
                {t('installationModalTitle')}
              </h3>
              <p className="text-xs text-purple-200 font-medium truncate max-w-[200px] sm:max-w-md">
                {product.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Download Action Section */}
          {hasMultipleDownloads && product.downloadOptions ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  Enlaces de Descarga Directa ({product.downloadOptions.length})
                </span>
                <span className="text-[11px] text-purple-300 font-medium hidden sm:inline">
                  Descarga los instaladores de ambos productos
                </span>
              </div>

              <div className="space-y-3">
                {product.downloadOptions.map((opt, idx) => (
                  <div
                    key={opt.id || idx}
                    className="p-4 rounded-2xl bg-[#110928] border border-white/10 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/20">
                          #{idx + 1}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {opt.name}
                        </span>
                        {opt.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.description && (
                        <p className="text-xs text-purple-200 leading-relaxed">
                          {opt.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        id={`modal-exclusive-download-${opt.id}`}
                        href={opt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer border border-amber-300"
                      >
                        <Download className="w-4 h-4 text-slate-950" />
                        <span>Descargar</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>

                      <button
                        onClick={() => handleCopyLink(opt.url, opt.id)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
                        title="Copiar enlace de descarga directa"
                      >
                        {copiedId === opt.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-purple-200" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(product.category === 'windows' || product.category === 'combos') && (
                <div className="p-3.5 rounded-2xl bg-purple-900/30 border border-purple-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-600/40 text-purple-200 flex items-center justify-center shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Herramienta Booteable recomendada: Rufus</span>
                      <span className="text-[11px] text-purple-200">Software gratuito y seguro para grabar la ISO de Windows en un USB de 8 GB.</span>
                    </div>
                  </div>
                  <a
                    href="https://rufus.ie/es/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3.5 rounded-xl bg-purple-600/40 hover:bg-purple-600/60 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-purple-400/30 transition-all shrink-0 cursor-pointer"
                    title="Descargar Rufus oficial para crear el USB booteable"
                  >
                    <span>Descargar Rufus</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#110928] border border-white/10 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-bold text-white block mb-0.5">
                    {product.downloadLabel || t('downloadInstaller')}
                  </span>
                  <p className="text-xs text-purple-200 font-medium leading-relaxed">
                    Descarga directa del archivo de instalación para tu equipo.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    id={`modal-exclusive-download-${product.id}`}
                    href={product.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer border border-amber-300"
                  >
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>{t('downloadInstaller')}</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>

                  {(product.category === 'windows' || product.category === 'combos') && (
                    <a
                      href="https://rufus.ie/es/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-purple-400/30 transition-all cursor-pointer"
                      title="Descargar Rufus oficial para crear el USB booteable"
                    >
                      <span>Descargar Rufus</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  )}

                  <button
                    onClick={() => handleCopyLink(product.downloadUrl, 'single')}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
                    title="Copiar enlace de descarga directa"
                  >
                    {copiedId === 'single' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-purple-200" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step-by-Step Installation Instructions */}
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('quickInstallSummary')}</span>
            </h4>

            <div className="space-y-2.5">
              {product.installationSteps.map((rawStep, idx) => {
                const cleanText = rawStep.replace(/^Paso\s*\d+\s*:\s*/i, '').replace(/^Step\s*\d+\s*:\s*/i, '');
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-[#110928] border border-white/10"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#facc15] text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-medium">
                      <span className="font-bold text-white mr-1.5">{t('stepLabel')} {idx + 1}:</span>
                      {cleanText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Guarantee Footer */}
          <div className="p-4 rounded-xl bg-[#110928] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('guaranteeSupportMsg')}</span>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hola UpClic, requiero asistencia para la instalación de ${product.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#facc15] font-bold hover:underline"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Soporte WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-white/10 flex justify-end bg-[#110928]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer border border-white/15"
          >
            {t('gotItClose')}
          </button>
        </div>
      </div>
    </div>
  );
};
