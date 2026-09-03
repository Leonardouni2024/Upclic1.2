import React from 'react';
import { Product } from '../types.ts';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '../products.ts';
import {
  X,
  Download,
  CheckCircle2,
  AlertCircle,
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
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(product.downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0066FF] flex items-center justify-center font-black">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                Descarga e Instalación Oficial
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                {product.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Notice if Office 365 (Access by account, NOT key) */}
          {product.isAccountAccess && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-black text-amber-900 block uppercase tracking-wider text-xs mb-1">
                    AVISO DE MODALIDAD: NO ES CLAVE (KEY)
                  </span>
                  <p className="font-medium leading-relaxed">
                    {product.accountNotice ||
                      'Este producto NO es una clave alfanumérica. El acceso es mediante cuenta oficial de Office 365 / Microsoft 365. Se le enviará a su WhatsApp o correo el correo electrónico y contraseña asignados a su dominio para iniciar sesión en portal.office.com y activar todas las aplicaciones.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Download Action Box */}
          <div className="p-5 rounded-2xl bg-linear-to-br from-blue-50/90 via-sky-50/60 to-white border border-blue-200/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  {product.isoFormat || 'Descarga Oficial desde Microsoft'}
                </span>
                <p className="text-xs text-slate-600 font-medium">
                  Enlace directo a los servidores de Microsoft sin intermediarios ni virus.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={product.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{product.downloadLabel || 'Descargar ISO / Software'}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  title="Copiar enlace de descarga"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Step-by-Step Installation Instructions */}
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instrucciones de Instalación Paso a Paso</span>
            </h4>

            <div className="space-y-3">
              {product.installationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70"
                >
                  <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Guarantee Footer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Garantía de activación oficial con asistencia técnica directa</span>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hola UpClic, requiero asistencia para la instalación de ${product.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#0066FF] font-bold hover:underline"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Soporte WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
