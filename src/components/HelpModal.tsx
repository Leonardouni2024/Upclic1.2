import React from 'react';
import { X, HelpCircle, FileText, Shield, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../products.ts';

interface HelpModalProps {
  topic: string | null;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ topic, onClose }) => {
  if (!topic) return null;

  const renderContent = () => {
    switch (topic) {
      case 'faq':
        return (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Cómo realizo el pago?</h4>
              <p className="text-slate-600 leading-relaxed">
                Directamente en la tienda a través de Mercado Pago. Puedes pagar con tarjeta de débito o crédito, Yape, PagoEfectivo o banca por internet. El cobro es en soles (S/) y la confirmación se procesa en tiempo real.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Cómo y cuándo recibo mi licencia?</h4>
              <p className="text-slate-600 leading-relaxed">
                Será enviado a su correo electrónico tras confirmar el pago. Puede tardar de 10 a 25 min en llegar con su clave de producto original (o credenciales oficiales), los enlaces de descarga oficial de Microsoft y la guía de instalación.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Debo enviar captura o comprobante de pago?</h4>
              <p className="text-slate-600 leading-relaxed">
                No. Mercado Pago valida la transacción de forma automática. El sistema genera tu pedido y despacha tus datos de activación a tu correo sin requerir comprobantes manuales.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Qué garantía tienen las licencias?</h4>
              <p className="text-slate-600 leading-relaxed">
                Cuentan con garantía oficial de activación de 1 año. Si se presenta cualquier error durante la instalación o el canje, nuestro equipo técnico te asiste de inmediato o te proporciona una clave de reemplazo.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Puedo reinstalar si formateo mi equipo?</h4>
              <div className="text-slate-600 leading-relaxed space-y-1 mt-0.5">
                <p>• <strong className="text-slate-800">Windows OEM:</strong> Se asocia a la placa madre. Puedes formatear e instalar cuantas veces requieras en el mismo equipo sin perder la licencia.</p>
                <p>• <strong className="text-slate-800">Windows Retail:</strong> Se vincula a tu cuenta Microsoft y permite trasladarse a otro equipo en el futuro.</p>
                <p>• <strong className="text-slate-800">Microsoft Office 365:</strong> Reinstalable iniciando sesión con tus credenciales en portal.office.com en hasta 5 dispositivos.</p>
                <p>• <strong className="text-slate-800">Office permanente:</strong> Licencia perpetua para 1 equipo sin pagos adicionales.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Cómo funcionan los descuentos?</h4>
              <div className="text-slate-600 leading-relaxed space-y-1 mt-0.5">
                <p>• <strong className="text-emerald-700">10% automático por volumen:</strong> Aplica directo al tener 2 o más productos en el carrito.</p>
                <p>• <strong className="text-[#0066FF]">Cupón PRIMUPCLIC:</strong> 10% de descuento en productos con precio desde S/ 40.00.</p>
                <p className="text-[11px] text-slate-500 italic">Los descuentos no son acumulables entre sí; se aplica el mayor beneficio disponible.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Qué incluye Microsoft Office 365 Profesional 1 año?</h4>
              <p className="text-slate-600 leading-relaxed">
                Suscripción oficial de 1 año en modalidad de cuenta para hasta 5 dispositivos en simultáneo (PC, Mac, tablet y smartphone) con 100 GB de almacenamiento en OneDrive y actualizaciones oficiales continuas.
              </p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <p className="text-slate-600">
              Nuestro equipo de soporte técnico está disponible para atender dudas antes y después de tu compra.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">WhatsApp: Soporte Oficial</span>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Chatear
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="font-bold">Horario: Lunes a Domingo 24/7 (Entrega Digital)</span>
              </div>
            </div>
          </div>
        );
      case 'terms':
      case 'sales_terms':
        return (
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <h4 className="font-bold text-slate-900">Condiciones de Venta y Entrega de Software:</h4>
            <p>1. Todas las licencias comercializadas por UpClic corresponden a claves alfanuméricas digitales originales de activación directa.</p>
            <p>2. La entrega se efectúa de manera digital y será enviado a su correo electrónico tras la confirmación del pago en Mercado Pago (puede tardar de 10 a 25 min).</p>
            <p>3. Garantía de activación oficial de 1 año: ante cualquier inconveniente técnico durante la instalación o el canje, brindamos asistencia técnica o reemplazo inmediato de la clave.</p>
            <p>4. Las licencias permanentes son de pago único sin cargos recurrentes para 1 equipo.</p>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <h4 className="font-bold text-slate-900">Política de Privacidad y Protección de Datos:</h4>
            <p>En UpClic respetamos tu privacidad. Los datos proporcionados para la entrega (nombre, número de WhatsApp o correo electrónico) se emplean exclusivamente para procesar la orden y brindar asistencia técnica sobre tu licencia.</p>
            <p>No almacenamos datos de tarjetas bancarias; todos los cobros se gestionan de forma segura a través de los servidores certificados de Mercado Pago.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const titles: Record<string, string> = {
    faq: 'Preguntas Frecuentes',
    contact: 'Contacto y Soporte',
    terms: 'Términos del Servicio',
    sales_terms: 'Condiciones de Venta',
    privacy: 'Política de Privacidad'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-base">
            {titles[topic] || 'Información'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {renderContent()}
        </div>

        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
