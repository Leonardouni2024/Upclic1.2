import React from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Lock,
  HelpCircle,
  MessageCircle,
  CheckCircle2,
  Building2,
  RefreshCcw
} from 'lucide-react';
import { useCart, HelpSection } from '../context/CartContext';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../products';

export const HelpModal: React.FC = () => {
  const { activeHelpSection, setActiveHelpSection } = useCart();

  if (!activeHelpSection) return null;

  const tabs: { id: HelpSection; label: string; icon: React.ReactNode }[] = [
    { id: 'quienes-somos', label: 'Quiénes somos', icon: <Building2 className="w-4 h-4" /> },
    { id: 'contacto', label: 'Contacto', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'faq', label: 'Preguntas frecuentes', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'garantia', label: 'Política de garantía', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'reembolsos', label: 'Cambios y reembolsos', icon: <RefreshCcw className="w-4 h-4" /> },
    { id: 'terminos', label: 'Términos y condiciones', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacidad', label: 'Política de privacidad', icon: <Lock className="w-4 h-4" /> },
  ];

  const normalizedSection: HelpSection =
    activeHelpSection === 'envio' ? 'faq' : activeHelpSection;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0B1F3A] text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7DB2FF] block">
              Centro de Transparencia y Políticas Comerciales
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold">UPCLIC</h2>
          </div>
          <button
            onClick={() => setActiveHelpSection(null)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Pills */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = normalizedSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveHelpSection(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1668E3] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {normalizedSection === 'quienes-somos' && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#0B1F3A]">Quiénes Somos — UPCLIC</h3>
              <p>
                <strong>UPCLIC</strong> es una tienda especializada en la comercialización de productos digitales, licencias de software (Microsoft Office, Windows, Project, Visio, CorelDRAW, Antivirus), herramientas de Inteligencia Artificial, diseño y suscripciones digitales.
              </p>
              <p>
                Nuestro compromiso principal es ofrecer una experiencia de compra clara, transparente y segura, detallando siempre las condiciones reales de cada producto (ya sea clave OEM, Retail, activación telefónica, invitación a correo personal o acceso a cuenta) y brindando acompañamiento técnico paso a paso por WhatsApp y correo electrónico.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#0B1F3A] block mb-1">Transparencia Total</strong>
                  <span className="text-xs text-slate-600">
                    Cada ficha indica qué incluye, duración, dispositivos permitidos y condiciones de uso.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#0B1F3A] block mb-1">Entrega Digital</strong>
                  <span className="text-xs text-slate-600">
                    Envío directo a tu correo electrónico y WhatsApp tras verificar tu pago.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#0B1F3A] block mb-1">Soporte en Español</strong>
                  <span className="text-xs text-slate-600">
                    Asistencia personalizada durante la instalación y activación de tu producto.
                  </span>
                </div>
              </div>
            </div>
          )}

          {normalizedSection === 'contacto' && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#0B1F3A]">Información de Contacto Oficial</h3>
              <p>
                Para consultas comerciales, soporte de instalación, validación de pagos o seguimiento de pedidos, puedes comunicarte directamente con nuestro equipo de atención al cliente:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">
                    WhatsApp Comercial y Soporte
                  </span>
                  <p className="font-extrabold text-[#0B1F3A] text-base">{WHATSAPP_DISPLAY}</p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold text-[#1668E3] hover:underline pt-1"
                  >
                    Abrir chat directo en WhatsApp →
                  </a>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">
                    Horario y Canales de Atención
                  </span>
                  <p className="font-extrabold text-[#0B1F3A] text-base">Atención Personalizada</p>
                  <p className="text-xs text-slate-500">
                    Asesoría previa a la compra y soporte técnico de activación paso a paso.
                  </p>
                </div>
              </div>
            </div>
          )}

          {normalizedSection === 'faq' && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#0B1F3A]">Preguntas Frecuentes (FAQ)</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-[#0B1F3A] mb-1">
                    1. ¿Cómo recibo mi producto digital después de comprar?
                  </h4>
                  <p className="text-xs text-slate-600">
                    Una vez verificado tu pago, enviamos tu clave de licencia, enlace de invitación o credenciales de acceso junto con la guía de instalación paso a paso a tu correo electrónico y WhatsApp registrados en el checkout.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-[#0B1F3A] mb-1">
                    2. ¿Cuál es la diferencia entre una licencia OEM y una Retail?
                  </h4>
                  <p className="text-xs text-slate-600">
                    Una licencia <strong>OEM</strong> se vincula a la placa madre (hardware) de 1 equipo específico y no puede transferirse a otra PC distinta, aunque sí permite formatear y reinstalar en esa misma máquina. Una licencia <strong>Retail</strong> permite transferirse a otro equipo en caso de que cambies de computadora.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-[#0B1F3A] mb-1">
                    3. ¿Cómo funcionan las suscripciones como Canva Pro o Gemini AI Pro?
                  </h4>
                  <p className="text-xs text-slate-600">
                    Se activan mediante invitación o enlace oficial enviado directamente a tu propio correo personal (sin necesidad de que entregues tu contraseña). En el caso de Microsoft 365, se entrega una cuenta dedicada exclusiva para hasta 5 dispositivos.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-[#0B1F3A] mb-1">
                    4. ¿Qué métodos de pago aceptan?
                  </h4>
                  <p className="text-xs text-slate-600">
                    Aceptamos pagos en Soles (S/) a través de Mercado Pago (Yape, tarjetas de crédito o débito y PagoEfectivo), así como PayPal en USD.
                  </p>
                </div>
              </div>
            </div>
          )}

          {normalizedSection === 'garantia' && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#0B1F3A]">Política de Garantía UPCLIC</h3>
              <p>
                Todos los productos adquiridos en <strong>UPCLIC</strong> cuentan con garantía de activación y funcionamiento conforme a lo detallado en la ficha técnica de cada producto:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Licencias de Clave Directa (Office, Windows, Project, Visio, CorelDRAW, McAfee):</strong> Garantía oficial de 6 meses de activación y funcionamiento más acompañamiento técnico.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Licencias de Activación por Teléfono:</strong> Garantía de activación de 30 días (1 mes) siguiendo el procedimiento automatizado de Microsoft.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Suscripciones y Streaming:</strong> Garantía de funcionamiento y soporte durante la vigencia contratada, siempre que el usuario respete las condiciones de uso indicadas (por ejemplo, no alterar datos en perfiles compartidos).
                  </span>
                </li>
              </ul>
            </div>
          )}

          {normalizedSection === 'reembolsos' && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#0B1F3A]">
                Política de Cambios y Reembolsos
              </h3>
              <p>
                Al tratarse de bienes digitales (claves alfanuméricas, invitaciones y accesos electrónicos), aplicamos las siguientes reglas justas para proteger al comprador:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  Si una clave o acceso presenta algún inconveniente técnico al momento de la activación, nuestro equipo de soporte verificará el caso por WhatsApp y procederá con la solución técnica o el <strong>reemplazo inmediato sin costo</strong>.
                </li>
                <li>
                  Si UPCLIC no pudiera entregar o activar el producto adquirido dentro del plazo establecido y el reemplazo tampoco fuera viable, se realizará el <strong>reembolso del 100% del importe pagado</strong> por el mismo medio de pago.
                </li>
                <li>
                  Una vez que una clave digital ha sido activada exitosamente en el equipo del comprador o cuando el error se debe a incompatibilidad de hardware no consultada previamente (por ejemplo, comprar un software exclusivo de Windows para instalarlo en macOS), se podrá gestionar un cambio previo acuerdo con soporte si la clave no ha sido consumida.
                </li>
              </ul>
            </div>
          )}

          {normalizedSection === 'terminos' && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#0B1F3A]">Términos y Condiciones de Uso</h3>
              <p>
                Al realizar un pedido en <strong>UPCLIC</strong>, el comprador acepta las condiciones descritas en la ficha de cada producto:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  Los precios publicados en la tienda están expresados principalmente en Soles peruanos (S/).
                </li>
                <li>
                  Los pedidos con pago manual (Yape, Plin o Transferencia Bancaria) quedan registrados inicialmente como <em>Pendiente de pago</em> o <em>Pago en revisión</em> hasta que el comprobante sea verificado.
                </li>
                <li>
                  El comprador es responsable de proporcionar un correo electrónico y número de WhatsApp válidos para la recepción de su producto digital.
                </li>
                <li>
                  Las marcas mencionadas en el catálogo pertenecen a sus respectivos propietarios y se utilizan únicamente para identificar la compatibilidad y naturaleza del software o servicio digital.
                </li>
              </ul>
            </div>
          )}

          {normalizedSection === 'privacidad' && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#0B1F3A]">Política de Privacidad</h3>
              <p>
                En <strong>UPCLIC</strong> respetamos y protegemos la privacidad de nuestros clientes conforme a la normativa vigente en Perú (Ley N° 29733 — Ley de Protección de Datos Personales):
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  Solicitamos únicamente los datos estrictamente necesarios para procesar y entregar tu pedido: Nombre, Correo electrónico y Número de WhatsApp.
                </li>
                <li>
                  <strong>Seguridad Financiera:</strong> UPCLIC nunca solicita ni almacena números completos de tarjetas de crédito/débito, códigos CVV ni claves bancarias. Los pagos con tarjeta se procesan de forma encriptada en las pasarelas correspondientes (Mercado Pago / PayPal).
                </li>
                <li>
                  Tus datos de contacto no son vendidos ni cedidos a terceros bajo ninguna circunstancia.
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-slate-500">
            ¿Necesitas atención personalizada de nuestro equipo?
          </span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola UPCLIC, tengo una consulta sobre sus políticas y productos.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Escribir por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
