import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Lock,
  CreditCard,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { WHATSAPP_NUMBER, MERCADO_LIBRE_URL } from '../products.ts';
import { TrustpilotStars } from './TrustpilotWidget.tsx';

interface FaqItem {
  question: string;
  answer: string;
}

export const TrustSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleConsultWhatsApp = () => {
    const text = 'Hola UpClic, tengo una consulta sobre las licencias originales de Microsoft Office.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const faqs: FaqItem[] = [
    {
      question: '¿Son licencias de por vida?',
      answer:
        'Sí. Nuestras licencias de Office Home & Student y Office Professional Plus (2024, 2021, 2019 y 2016) son 100% permanentes de pago único. No caducan ni requieren pagos mensuales o anuales posteriores. Solo el plan Microsoft 365 Personal funciona bajo modalidad de suscripción anual renovable.'
    },
    {
      question: '¿Qué pasa si tengo problemas para activar?',
      answer:
        'Cuentas con nuestra Garantía de Activación del 100%. Junto con tu clave recibes una guía ilustrada paso a paso muy sencilla; además, nuestro equipo de soporte técnico en vivo por WhatsApp te asiste en minutos (incluso mediante conexión remota si lo deseas) o reemplaza tu licencia de inmediato sin costo adicional.'
    },
    {
      question: '¿Entregan factura?',
      answer:
        'Sí, emitimos comprobante de pago electrónico y factura comercial para personas naturales, profesionales independientes y empresas (con RUC). Solo debes indicarlo al finalizar tu pedido en el checkout o solicitarlo por WhatsApp.'
    }
  ];

  const verifiedReviews = [
    {
      author: 'Carlos Mendoza',
      role: 'Ingeniero Civil • Lima',
      comment: 'Recibí la clave de Office 2024 Pro Plus en menos de 2 minutos en mi correo. Descargué desde el enlace oficial y activó a la primera.',
      date: 'Hace 2 días'
    },
    {
      author: 'Valeria Paredes',
      role: 'Contadora Pública • Arequipa',
      comment: 'Excelente servicio y mucha seguridad. Me enviaron factura para mi estudio contable y el soporte por WhatsApp es súper atento.',
      date: 'Hace 4 días'
    }
  ];

  return (
    <section id="confianza-section" className="py-14 sm:py-20 bg-[#f8fafc] font-sans border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0078d4]/10 text-[#0078d4] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-[#0078d4]" />
            <span>Confianza, Respaldo y Transparencia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Compra con total seguridad y respaldo técnico
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-normal">
            Miles de usuarios y empresas confían en nuestra plataforma por nuestra entrega inmediata y garantía real.
          </p>
        </div>

        {/* Bento Box Grid: Left (Customer Rating Widget + Payment Logos) | Right (FAQ Accordion) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column (6 cols): Customer Reviews Widget & Payment Methods Bento */}
          <div className="lg:col-span-6 flex flex-col gap-6 justify-between">
            
            {/* Bento Card 1: 5-Star Customer Rating Widget (Trustpilot / Google style) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Calificación Excelente
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Trustpilot & Google Reviews
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-slate-900">4.9 / 5.0</span>
                    <span className="text-xs text-slate-500 font-medium">
                      Basado en +350 compras verificadas
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <TrustpilotStars count={5} size="md" />
                  <a
                    href="https://www.trustpilot.com/review/upclic.pe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 text-[11px] font-bold text-[#0078d4] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Ver opiniones verificadas</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Mini Verified Buyer Testimonials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {verifiedReviews.map((rev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      "{rev.comment}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{rev.author}</div>
                        <div className="text-[10px] text-slate-500">{rev.role}</div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" /> Verificado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Card 2: Secure Payment Methods Logos */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Métodos de Pago 100% Seguros y Encriptados
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Lock className="w-3 h-3" /> SSL 256-Bit
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Procesamos tu orden al instante con las pasarelas más confiables a nivel nacional e internacional:
              </p>

              {/* Clean Payment Logo Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1a1f71]" />
                  <span className="text-xs font-extrabold text-slate-800">Visa / Mastercard</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#003087]" />
                  <span className="text-xs font-extrabold text-[#003087]">PayPal Oficial</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#009ee3]" />
                  <span className="text-xs font-extrabold text-slate-800">Mercado Pago</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span className="text-xs font-extrabold text-slate-800">Yape / Plin</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-xs font-extrabold text-slate-800">BCP / BBVA / IBK</span>
                </div>
                <a
                  href={MERCADO_LIBRE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-[#FFE600]/25 border border-amber-300 hover:bg-[#FFE600]/40 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-900" />
                  <span className="text-xs font-extrabold text-slate-900">Mercado Libre</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column (6 cols): Interactive FAQ Accordion Bento Box */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-2xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Preguntas Frecuentes (FAQ)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Respuestas claras a las dudas más habituales antes de comprar
                  </p>
                </div>
              </div>

              {/* Accordion Items */}
              <div className="mt-6 space-y-3.5">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'bg-slate-50/80 border-[#0078d4] shadow-2xs'
                          : 'bg-white border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className="text-sm sm:text-base font-bold text-slate-900">
                          {faq.question}
                        </span>
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                            isOpen
                              ? 'bg-[#0078d4] text-white rotate-180'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Support Callout inside FAQ Card */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  ¿Tienes otra consulta específica sobre compatibilidad?
                </div>
                <div className="text-xs text-slate-500">
                  Nuestros técnicos te responden en menos de 2 minutos.
                </div>
              </div>
              <button
                onClick={handleConsultWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-[#0078d4] hover:bg-[#0062ad] text-white font-bold text-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

