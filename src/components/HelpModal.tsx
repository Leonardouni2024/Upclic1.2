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
              <h4 className="font-bold text-slate-900 mb-1">¿Cómo realizo el pago en UpClic?</h4>
              <p className="text-slate-600 leading-relaxed">
                El proceso está 100% integrado y automatizado. Agregas tus licencias al carrito, presionas <strong className="text-slate-900 font-bold">"Pagar con Mercado Pago"</strong> y seleccionas tu método preferido: Tarjeta de crédito o débito, Yape, PagoEfectivo o banca por internet. El monto exacto y tus descuentos se calculan de inmediato sin necesidad de digitar montos manualmente.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Cómo y cuándo recibiré mi licencia?</h4>
              <p className="text-slate-600 leading-relaxed">
                Al completar tu pago en Mercado Pago, el sistema te redirige automáticamente a nuestro chat oficial de WhatsApp con tu pedido en estado <strong className="text-emerald-700 font-bold">PAGADO</strong> y tu número de transacción (#ID de Pago). Te entregamos tu clave original de 25 caracteres (o credenciales oficiales), enlaces de descarga directa de Microsoft y guía de instalación en un lapso estimado de 5 a 15 minutos.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Debo enviar captura de comprobante?</h4>
              <p className="text-slate-600 leading-relaxed">
                No es estrictamente necesario, ya que Mercado Pago confirma la aprobación de tu pago en tiempo real y la redirección incluye tu ID oficial de transacción. Sin embargo, si pagaste mediante agente o transferencia en efectivo, puedes adjuntar tu voucher en el chat para una validación aún más veloz.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Qué garantía tengo al comprar en UpClic?</h4>
              <p className="text-slate-600 leading-relaxed">
                Cuentas con <strong className="text-slate-900 font-bold">garantía de 6 meses</strong> ante cualquier error técnico o complicación durante la activación. Nuestro equipo de soporte técnico te asiste en tiempo real vía WhatsApp o te brinda una clave de reemplazo garantizado.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Puedo reinstalar si formateo mi PC?</h4>
              <div className="text-slate-600 leading-relaxed space-y-1 mt-0.5">
                <p>• <strong className="text-slate-800">Windows OEM:</strong> Se enlaza directamente a la placa madre de tu PC/laptop; puedes formatear y reinstalar Windows todas las veces que quieras sin perder la licencia.</p>
                <p>• <strong className="text-slate-800">Windows Retail:</strong> Se vincula a tu cuenta Microsoft y te permite transferirla a un equipo nuevo en el futuro.</p>
                <p>• <strong className="text-slate-800">Microsoft Office 365:</strong> Puedes reinstalar iniciando sesión con tus credenciales en portal.office.com en hasta 5 dispositivos.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Cómo funcionan los descuentos y promociones?</h4>
              <div className="text-slate-600 leading-relaxed space-y-1 mt-0.5">
                <p>• <strong className="text-emerald-700">10% Automático por Volumen:</strong> Se aplica de forma inmediata en el checkout al agregar 2 o más productos al carrito.</p>
                <p>• <strong className="text-[#0066FF]">Cupón PRIMUPCLIC:</strong> Otorga 10% de descuento en compras de productos desde S/ 40.00.</p>
                <p className="text-[11px] text-slate-500 italic">Los descuentos no son combinables entre sí; el sistema aplicará automáticamente el mayor beneficio disponible.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">¿Qué incluye Microsoft Office 365 Profesional Cuenta 1 año?</h4>
              <p className="text-slate-600 leading-relaxed">
                Incluye 1 año de suscripción oficial en modalidad de cuenta (correo y contraseña oficial asignados) para hasta 5 dispositivos simultáneos (PC, Mac, celular, tablet) con 100 GB de almacenamiento en OneDrive.
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
            <p>2. La entrega se efectúa de manera digital en un plazo habitual de 5 a 15 minutos tras la confirmación del pago.</p>
            <p>3. Garantía de activación: en caso de cualquier error técnico durante el canje, brindamos soporte remoto o sustitución de clave garantizada.</p>
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
