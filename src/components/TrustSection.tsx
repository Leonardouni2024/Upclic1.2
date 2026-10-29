import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Lock,
  CreditCard,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  ShoppingBag,
  Landmark,
  Smartphone,
  Wallet
} from 'lucide-react';
import { WHATSAPP_NUMBER, MERCADO_LIBRE_URL } from '../products.ts';
import { TrustpilotStars } from './TrustpilotWidget.tsx';

interface FaqItem {
  question: string;
  answer: string;
}

const sectionTransition = {
  duration: 0.48,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
};

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
        'Sí. Nuestras licencias de Office Professional Plus (2024, 2021, 2019 y 2016) y Windows son 100% permanentes de pago único. No caducan ni requieren pagos mensuales o anuales posteriores. Solo el plan Microsoft 365 Personal funciona bajo modalidad de suscripción anual renovable.'
    },
    {
      question: '¿Cuál es la diferencia entre Office 2021 Pro Plus y Office 2024 Pro Plus?',
      answer:
        'Ambas son ediciones completas Professional Plus permanentes de pago único que incluyen Word, Excel, PowerPoint, Outlook y Access. Office 2021 Pro Plus destaca por su máxima estabilidad en todo equipo con Windows 10/11, mientras que Office 2024 Pro Plus incorpora la interfaz más reciente, mayor velocidad de procesamiento y nuevas funciones analíticas en Excel.'
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
      role: 'Ingeniero Civil · Lima',
      comment: 'Recibí la clave de Office 2024 Pro Plus en menos de 2 minutos en mi correo. Descargué desde el enlace oficial y activó a la primera.',
      date: 'Hace 2 días'
    },
    {
      author: 'Valeria Paredes',
      role: 'Contadora Pública · Arequipa',
      comment: 'Compré Office 2021 Professional Plus para mi estudio contable. Me enviaron factura electrónica y el soporte por WhatsApp es súper atento.',
      date: 'Hace 4 días'
    }
  ];

  return (
    <section
      id="confianza-section"
      className="py-12 sm:py-16 lg:py-20 bento-bg-pattern font-sans border-b border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={sectionTransition}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#0078d4] mb-2">
            Confianza · Respaldo · Transparencia
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
            Compra con total seguridad y respaldo técnico
          </h2>
          <p className="mt-2 sm:mt-2.5 text-xs sm:text-base text-slate-600 font-normal">
            Miles de usuarios y empresas confían en nuestra plataforma por nuestra entrega inmediata y garantía real.
          </p>
        </motion.div>

        {/* Bento Box Grid: Left (Customer Rating Widget + Payment Logos) | Right (FAQ Accordion) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* Left Column (6 cols): Customer Reviews Widget & Payment Methods Bento */}
          <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6 justify-between">
            
            {/* Bento Card 1: 5-Star Customer Rating Widget (Trustpilot / Google style) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...sectionTransition, delay: 0.05 }}
              className="bento-card rounded-3xl p-5 sm:p-7 xl:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 text-[11px] sm:text-xs font-bold flex-wrap">
                    <span className="text-emerald-700 font-extrabold uppercase tracking-wider">
                      Calificación Excelente
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">
                      Trustpilot & Google Reviews
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                      4.9 / 5.0
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Basado en +350 compras verificadas
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <TrustpilotStars count={5} size="md" />
                  <a
                    href="https://www.trustpilot.com/review/upclic.pe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 text-[11px] font-bold text-[#0078d4] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Ver opiniones verificadas</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Mini Verified Buyer Testimonials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-5">
                {verifiedReviews.map((rev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      "{rev.comment}"
                    </p>
                    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-200/60">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{rev.author}</div>
                        <div className="text-[10px] text-slate-500 truncate">{rev.role}</div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Verificado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bento Card 2: Secure Payment Methods Logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...sectionTransition, delay: 0.14 }}
              className="bento-card rounded-3xl p-5 sm:p-7 xl:p-8"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    Métodos de Pago 100% Seguros y Encriptados
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 shrink-0">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono">SSL 256-Bit</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Procesamos tu orden al instante con las pasarelas más confiables a nivel nacional e internacional:
              </p>

              {/* Clean Payment Method Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                <div className="px-3 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 flex items-center justify-center gap-1.5 sm:gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-extrabold text-slate-800 truncate">Visa / Mastercard</span>
                </div>
                <div className="px-3 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 flex items-center justify-center gap-1.5 sm:gap-2">
                  <Wallet className="w-3.5 h-3.5 text-[#003087] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-extrabold text-[#003087] truncate">PayPal Oficial</span>
                </div>
                <div className="px-3 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 flex items-center justify-center gap-1.5 sm:gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#009ee3] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-extrabold text-slate-800 truncate">Mercado Pago</span>
                </div>
                <div className="px-3 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 flex items-center justify-center gap-1.5 sm:gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-extrabold text-slate-800 truncate">Yape / Plin</span>
                </div>
                <div className="px-3 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 flex items-center justify-center gap-1.5 sm:gap-2">
                  <Landmark className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-extrabold text-slate-800 truncate">BCP / BBVA / IBK</span>
                </div>
                <a
                  href={MERCADO_LIBRE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-[#FFE600]/20 border border-amber-300 hover:bg-[#FFE600]/35 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 truncate">Mercado Libre</span>
                </a>
              </div>
            </motion.div>

          </div>

          {/* Right Column (6 cols): Interactive FAQ Accordion Bento Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ ...sectionTransition, delay: 0.1 }}
            className="lg:col-span-6 bento-card rounded-3xl p-5 sm:p-7 xl:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                    Preguntas Frecuentes (FAQ)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Respuestas claras a las dudas más habituales antes de comprar
                  </p>
                </div>
              </div>

              {/* Animated Accordion Items */}
              <div className="mt-5 sm:mt-6 space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
                        isOpen
                          ? 'bg-[#f8fafc] border-[#0078d4]'
                          : 'bg-white border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span className="text-xs sm:text-base font-bold text-slate-900 leading-snug">
                          {faq.question}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-[#0078d4] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="faq-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Support Callout inside FAQ Card */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  ¿Tienes otra consulta específica sobre compatibilidad?
                </div>
                <div className="text-xs text-slate-500">
                  Nuestros técnicos te responden en menos de 2 minutos.
                </div>
              </div>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConsultWhatsApp}
                className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0078d4] hover:bg-[#0062ad] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Consultar por WhatsApp</span>
              </motion.button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
