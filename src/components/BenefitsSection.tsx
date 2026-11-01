import React from 'react';
import { motion } from 'motion/react';
import {
  MousePointerClick,
  MailCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
  Zap,
  Headphones
} from 'lucide-react';

const stepTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
};

export const BenefitsSection: React.FC = () => {
  const steps = [
    {
      stepIndex: '01',
      stepBadge: 'PASO 01',
      stepEyebrow: 'Selección y confirmación',
      icon: <MousePointerClick className="w-6 h-6" strokeWidth={1.75} />,
      tintClass: 'tint-blue',
      title: 'Selecciona tu Licencia o Suscripción Digital',
      description:
        'Elige en nuestro catálogo entre licencias permanentes de pago único (Microsoft Office, Windows 11/10 Pro, Project, Visio y CorelDRAW) o planes de suscripción para Cuentas Premium (Canva Pro, Gemini AI Pro, Microsoft 365 y Duolingo Super).',
      specs: [
        {
          label: 'Modalidad clara:',
          detail: 'Pago único vitalicio en software o planes por periodo en cuentas'
        },
        {
          label: 'Medios de pago:',
          detail: 'Tarjeta de crédito/débito, Yape, Plin, Transferencia o PayPal'
        },
        {
          label: 'Facturación:',
          detail: 'Comprobante electrónico y factura comercial disponible (RUC)'
        }
      ],
      footerIcon: <Lock className="w-3.5 h-3.5 text-[#1457C9]" strokeWidth={2} />,
      tag: 'Pasarela encriptada SSL 256-Bit'
    },
    {
      stepIndex: '02',
      stepBadge: 'PASO 02',
      stepEyebrow: 'Despacho digital inmediato',
      icon: <MailCheck className="w-6 h-6" strokeWidth={1.75} />,
      tintClass: 'tint-violet',
      title: 'Recibe tus Credenciales en Correo y WhatsApp',
      description:
        'Tras validar tu pago, nuestro sistema procesa y envía tu pedido de forma digital sin tiempos de espera físicos, entregando exactamente lo que corresponde a tu producto:',
      specs: [
        {
          label: 'En Licencias de Software:',
          detail: 'Clave alfanumérica original de 25 dígitos + enlace de descarga oficial'
        },
        {
          label: 'En Cuentas Premium:',
          detail: 'Invitación oficial directa a tu correo personal o credencial privada'
        },
        {
          label: 'Documentación:',
          detail: 'Manual técnico paso a paso para una instalación limpia y rápida'
        }
      ],
      footerIcon: <Zap className="w-3.5 h-3.5 text-[#5B3CC4]" strokeWidth={2} />,
      tag: 'Entrega digital en minutos 24/7'
    },
    {
      stepIndex: '03',
      stepBadge: 'PASO 03',
      stepEyebrow: 'Activación y garantía real',
      icon: <ShieldCheck className="w-6 h-6" strokeWidth={1.75} />,
      tintClass: 'tint-teal',
      title: 'Activa tu Producto con Respaldo Técnico Oficial',
      description:
        'Valida tu licencia directamente en el instalador oficial del fabricante o acepta la invitación en tu cuenta personal para habilitar todas las funciones Pro en Windows, Mac o dispositivos móviles.',
      specs: [
        {
          label: 'Validación legítima:',
          detail: 'Activación 100% genuina sin activadores ni programas externos'
        },
        {
          label: 'Asistencia en vivo:',
          detail: 'Soporte técnico personalizado por WhatsApp durante tu instalación'
        },
        {
          label: 'Cobertura total:',
          detail: 'Garantía oficial UpClic de funcionamiento y reemplazo inmediato'
        }
      ],
      footerIcon: <Headphones className="w-3.5 h-3.5 text-[#0B7A64]" strokeWidth={2} />,
      tag: 'Garantía y soporte certificado'
    }
  ];

  return (
    <section
      id="proceso-bento-section"
      className="py-12 sm:py-16 lg:py-20 bg-white font-sans border-b border-[#E2E8F0] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={stepTransition}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F0FF] text-[#1457C9] text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.06em] mb-3">
            Proceso de Compra y Activación Digital
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#0B1F3A] tracking-[-0.02em] leading-[1.2] [text-wrap:balance]">
            ¿Cómo adquieres y activas tu licencia o cuenta premium?
          </h2>
          <p className="mt-2.5 text-sm sm:text-[15.5px] text-[#475569] leading-[1.6] max-w-2xl mx-auto">
            Un flujo transparente, automatizado y respaldado por especialistas para que profesionales, estudiantes y empresas equipen sus dispositivos en minutos.
          </p>
        </motion.div>

        {/* 3-Column Professional Process Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.article
              key={step.stepIndex}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...stepTransition, delay: index * 0.08 }}
              className="bento-card bento-card-interactive p-6 sm:p-7 flex flex-col justify-between gap-5 group relative"
            >
              <div className="flex flex-col gap-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <span className={`upclic-icon-box ${step.tintClass} shrink-0`}>
                      {step.icon}
                    </span>
                    <div>
                      <span className="block text-[11px] font-bold tracking-[0.06em] uppercase text-[#64748B]">
                        {step.stepEyebrow}
                      </span>
                      <h3 className="text-[18px] sm:text-[19px] leading-[1.25] font-extrabold text-[#0B1F3A] mt-0.5">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Main Explanation */}
                <p className="text-[14px] sm:text-[14.5px] text-[#475569] leading-[1.6]">
                  {step.description}
                </p>

                {/* Structured Specification Points */}
                <div className="rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 sm:p-4 space-y-2.5">
                  {step.specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[13px] leading-[1.45]">
                      <CheckCircle2 className="w-4 h-4 text-[#0B7A64] shrink-0 mt-0.5" strokeWidth={2} />
                      <p className="text-[#475569]">
                        <strong className="font-bold text-[#0B1F3A]">{spec.label}</strong>{' '}
                        {spec.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between gap-2 text-[12.5px] font-semibold">
                <span className="inline-flex items-center gap-1.5 text-[#0B1F3A]">
                  {step.footerIcon}
                  <span>{step.tag}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[#64748B] font-bold tabular-nums shrink-0">
                  <span>{step.stepIndex} / 03</span>
                  {index < 2 && <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" strokeWidth={1.75} />}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};
