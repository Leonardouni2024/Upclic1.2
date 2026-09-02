import React, { useState } from 'react';
import { X, User, Key, Download, HelpCircle, MessageCircle, CheckCircle2 } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../products.ts';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  const [emailQuery, setEmailQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center shadow-2xs">
              <User className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Portal de Cliente UpClic</h3>
              <p className="text-xs text-slate-500 font-medium">Gestión de licencias y soporte técnico</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Cerrar portal de cliente"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick License Lookup */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Consultar tus pedidos por correo o WhatsApp:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder="Ingresa tu correo o número de celular..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
              />
              <button
                onClick={() => setHasSearched(true)}
                className="px-4 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052cc] shadow-xs transition-colors cursor-pointer"
              >
                Buscar
              </button>
            </div>

            {hasSearched && (
              <div className="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold block text-blue-900 mb-1">✓ Historial de pedidos digital:</span>
                Tus claves de producto adquiridas son enviadas inmediatamente a tu correo y confirmadas en tu WhatsApp de contacto. Si necesitas reenviar o recuperar una clave anterior, puedes solicitarla directamente a nuestro equipo técnico.
              </div>
            )}
          </div>

          {/* Quick Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola UpClic, requiero asistencia técnica con mi licencia de Microsoft.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/70 transition-all flex items-center gap-3 text-left"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Soporte por WhatsApp</span>
                <span className="text-[11px] text-emerald-700 font-medium">Atención personalizada</span>
              </div>
            </a>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center gap-3">
              <Key className="w-5 h-5 text-[#0066FF] shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Licencias 100% Originales</span>
                <span className="text-[11px] text-slate-500 font-medium">Garantía permanente</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
