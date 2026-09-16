import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { X, HelpCircle, FileText, Shield, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../products.ts';

interface HelpModalProps {
  topic: string | null;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ topic, onClose }) => {
  const { language } = useCart();
  if (!topic) return null;

  const isEn = language === 'EN';

  const renderContent = () => {
    switch (topic) {
      case 'faq':
        return isEn ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">How do I pay?</h4>
              <p className="text-slate-600 leading-relaxed">
                Directly in the store via Mercado Pago. You can pay with credit card, debit card, or cash. Payment is processed in your local currency with real-time confirmation.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">How and when do I receive my license?</h4>
              <p className="text-slate-600 leading-relaxed">
                It will be delivered digitally to your email address within <strong>10 to 30 minutes</strong> after payment confirmation, including your 25-character genuine product key and step-by-step activation guide.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Do I need to send payment proof screenshot?</h4>
              <p className="text-slate-600 leading-relaxed">
                No. Mercado Pago automatically validates the transaction. The system generates your order and dispatches your license details to your email without manual receipts.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">What warranty do the licenses have?</h4>
              <p className="text-slate-600 leading-relaxed">
                They come with a 1-year official activation warranty. If any issue arises during installation or redemption, our technical team will assist you immediately or provide a replacement key.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Can I reinstall if I format my PC?</h4>
              <div className="text-slate-600 leading-relaxed space-y-1 mt-0.5">
                <p>• <strong className="text-slate-800">Windows OEM:</strong> Tied to the motherboard. You can reformat and reinstall as many times as needed on the same PC.</p>
                <p>• <strong className="text-slate-800">Windows Retail:</strong> Tied to your Microsoft Account and can be transferred to another PC in the future.</p>
                <p>• <strong className="text-slate-800">Microsoft Office 365:</strong> Reinstallable by logging in with your credentials on portal.office.com on up to 5 devices.</p>
                <p>• <strong className="text-slate-800">Perpetual Office:</strong> Lifetime license for 1 PC with no additional payments.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">How do volume discounts work?</h4>
              <div className="text-slate-600 leading-relaxed space-y-1 mt-0.5">
                <p>• <strong className="text-emerald-700">10% automatic volume discount:</strong> Applies automatically when you have 2 or more products in your cart.</p>
                <p className="text-[11px] text-slate-500 italic">Discounts cannot be combined; the highest benefit available applies.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Cómo realizo el pago?</h4>
              <p className="text-slate-600 leading-relaxed">
                Directamente en la tienda a través de Mercado Pago. Puedes pagar con tarjeta de débito o crédito, o efectivo. El cobro se procesará en tu moneda local y la confirmación es en tiempo real.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Cómo y en cuánto tiempo recibo mi licencia?</h4>
              <p className="text-slate-600 leading-relaxed">
                La entrega es 100% digital a tu correo electrónico en un lapso de <strong>10 a 30 minutos</strong> tras confirmarse el pago. Recibirás tu clave original de 25 caracteres, el enlace de descarga oficial de Microsoft y la guía paso a paso de activación.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Debo enviar captura o comprobante de pago?</h4>
              <p className="text-slate-600 leading-relaxed">
                No. Mercado Pago valida la transacción de forma automática. El sistema genera tu pedido y despacha tus datos de activación directamente a tu correo sin requerir comprobantes manuales.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Qué garantía tienen las licencias?</h4>
              <p className="text-slate-600 leading-relaxed">
                Cuentan con garantía oficial de activación de 1 año y soporte técnico especializado. Ante cualquier problema técnico durante la instalación o validación, te asistimos de inmediato o te proporcionamos una clave de reemplazo.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Puedo reinstalar si formateo mi PC?</h4>
              <div className="text-slate-600 leading-relaxed space-y-1 mt-0.5">
                <p>• <strong className="text-slate-800">Windows OEM:</strong> Queda asociada a la placa madre de tu PC, permitiéndote formatear y reinstalar todas las veces que desees sin perder la activación.</p>
                <p>• <strong className="text-slate-800">Windows Retail:</strong> Se vincula a tu cuenta Microsoft y es transferible a otro equipo en el futuro.</p>
                <p>• <strong className="text-slate-800">Microsoft Office 365:</strong> Reinstalable iniciando sesión con tus credenciales en portal.office.com en hasta 5 dispositivos.</p>
                <p>• <strong className="text-slate-800">Office Perpetuo (2024 / 2021):</strong> Licencia permanente de por vida para 1 PC sin costos recurrentes.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Cómo funcionan los descuentos?</h4>
              <div className="text-slate-600 leading-relaxed space-y-1 mt-0.5">
                <p>• <strong className="text-emerald-700">10% automático por volumen:</strong> Aplica directo al tener 2 o más productos en el carrito.</p>
                <p className="text-[11px] text-slate-500 italic">Los descuentos no son acumulables entre sí; se aplica el mayor beneficio disponible.</p>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return isEn ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <p className="text-slate-600">
              Our technical support team is available to help you before and after your purchase.
            </p>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">WhatsApp: Official Support</span>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Chat
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="font-bold">Hours: Monday to Sunday 24/7 (Continuous Support)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <p className="text-slate-600">
              Nuestro equipo de soporte técnico está disponible para atender dudas antes y después de tu compra.
            </p>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
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
                <span className="font-bold">Horario: Lunes a Domingo 24/7 (Atención Continua)</span>
              </div>
            </div>
          </div>
        );
      case 'terms':
      case 'sales_terms':
        return isEn ? (
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <h4 className="font-bold text-slate-900">General Sales and Delivery Terms:</h4>
            <p>1. All licenses sold by UpClic are 100% genuine and backed by official activation warranty.</p>
            <p>2. Delivery is carried out 100% digitally to your registered email address within <strong>10 to 30 minutes</strong> following payment confirmation via Mercado Pago.</p>
            <p>3. Official warranty: in case of any technical verification issue, our team provides immediate support or key replacement.</p>
          </div>
        ) : (
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <h4 className="font-bold text-slate-900">Condiciones de Venta y Entrega:</h4>
            <p>1. Todas las licencias comercializadas por UpClic corresponden a claves digitales 100% originales y cuentan con garantía oficial de activación.</p>
            <p>2. La entrega se efectúa de manera 100% digital a tu correo electrónico en un lapso estimado de <strong>10 a 30 minutos</strong> tras la confirmación del pago en Mercado Pago.</p>
            <p>3. Garantía oficial de activación de 1 año: ante cualquier inconveniente técnico durante la activación, brindamos asistencia inmediata o reemplazo de clave sin costo.</p>
          </div>
        );
      case 'privacy':
        return isEn ? (
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <h4 className="font-bold text-slate-900">Privacy Policy and Data Protection:</h4>
            <p>At UpClic we respect your privacy. Data provided for delivery (name, ID number, or email address) is used exclusively to process your order, provide technical assistance, and send your invoice.</p>
            <p>We do not store credit or debit card details; all payments are processed securely through certified Mercado Pago servers.</p>
          </div>
        ) : (
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <h4 className="font-bold text-slate-900">Política de Privacidad y Protección de Datos:</h4>
            <p>En UpClic respetamos su privacidad. Los datos proporcionados para la entrega (nombre, número de documento de identidad, y correo electrónico) se emplean exclusivamente para procesar su orden, enviar comprobantes de compra y brindar asistencia técnica.</p>
            <p>No almacenamos datos de tarjetas bancarias; todos los cobros se gestionan de forma 100% segura a través de los servidores certificados de Mercado Pago.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const titles: Record<string, string> = isEn ? {
    faq: 'Frequently Asked Questions',
    contact: 'Contact & Support',
    terms: 'Terms of Service',
    sales_terms: 'Sales Conditions',
    privacy: 'Privacy Policy'
  } : {
    faq: 'Preguntas Frecuentes',
    contact: 'Contacto y Soporte',
    terms: 'Términos del Servicio',
    sales_terms: 'Condiciones de Venta',
    privacy: 'Política de Privacidad'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-md border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-base">
            {titles[topic] || (isEn ? 'Information' : 'Información')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
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
            className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            {isEn ? 'Got it' : 'Entendido'}
          </button>
        </div>
      </div>
    </div>
  );
};
