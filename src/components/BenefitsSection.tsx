import React from 'react';
import { motion } from 'motion/react';
import {
  MousePointerClick,
  MailCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
  KeyRound,
  CreditCard,
  Smartphone,
  Globe
} from 'lucide-react';

const stepTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
};

export const BenefitsSection: React.FC = () => {
  const steps = [
    {
      stepIndex: '01',
      stepLabel: 'Paso 01 · Selección y Pago',
      icon: <MousePointerClick className="w-6 h-6 text-[#0078d4]" />,
      accentBg: 'bg-[#0078d4]/10 border-[#0078d4]/20',
      title: 'Elige tu versión de Office y paga de forma segura',
      description:
        'Selecciona la edición de Microsoft Office ideal para tu equipo (2024, 2021 o 365) y completa tu compra mediante nuestra pasarela encriptada.',
      tag: 'Compra 100% Protegida SSL',
      preview: (
        <div className="mt-4 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Pasarela Encriptada</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 normal-case">
              <Lock className="w-3 h-3 shrink-0" /> SSL 256-Bit
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-700">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f8fafc] border border-slate-200/70">
              <CreditCard className="w-3 h-3 text-[#0078d4]" /> Visa / MC
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f8fafc] border border-slate-200/70">
              <Smartphone className="w-3 h-3 text-[#0078d4]" /> Yape / Plin
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f8fafc] border border-slate-200/70 text-[#003087]">
              PayPal
            </span>
          </div>
        </div>
      )
    },
    {
      stepIndex: '02',
      stepLabel: 'Paso 02 · Entrega Inmediata',
      icon: <MailCheck className="w-6 h-6 text-[#d83b01]" />,
      accentBg: 'bg-[#d83b01]/10 border-[#d83b01]/20',
      title: 'Recibe tu clave de producto digital por Email en menos de 2 minutos',
      description:
        'Nuestro sistema automatizado envía al instante tu clave original de 25 caracteres junto con el comprobante a tu correo electrónico y WhatsApp.',
      tag: 'Entrega Digital < 2 min',
      preview: (
        <div className="mt-4 p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
            <span>Licencia Digital Despachada</span>
            <span className="text-emerald-400 font-mono">ENVIADO</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 tabular-nums">
            <KeyRound className="w-3.5 h-3.5 text-[#d83b01] shrink-0" />
            <span className="truncate">XXXXX-2024P-XXXXX-OFFICE</span>
          </div>
        </div>
      )
    },
    {
      stepIndex: '03',
      stepLabel: 'Paso 03 · Activación Directa',
      icon: <ShieldCheck className="w-6 h-6 text-[#0078d4]" />,
      accentBg: 'bg-[#0078d4]/10 border-[#0078d4]/20',
      title: 'Sigue nuestra guía paso a paso y activa directamente en el sitio oficial de Microsoft',
      description:
        'Descarga los instaladores limpios desde los servidores oficiales de Microsoft, canjea tu licencia y disfruta de todas las funciones sin vencimientos.',
      tag: 'Validación Oficial Microsoft',
      preview: (
        <div className="mt-4 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
            <span className="inline-flex items-center gap-1 font-mono text-slate-700">
              <Globe className="w-3 h-3 text-[#0078d4]" /> setup.office.com
            </span>
            <span className="text-emerald-700">Verificado</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Producto Permanente Activado</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section
      id="proceso-bento-section"
      className="py-12 sm:py-16 lg:py-20 bg-white font-sans border-b border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={stepTransition}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#0078d4] mb-2">
            Proceso Ultra Rápido
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
            Tu software original activo en 3 simples pasos
          </h2>
          <p className="mt-2.5 text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
            Sin esperas físicas ni configuraciones complicadas. Diseñado para que empieces a trabajar hoy mismo en cualquier equipo.
          </p>
        </motion.div>

        {/* 3-Column Responsive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.stepIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...stepTransition, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-[#f8fafc] hover:bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border border-slate-200/90 hover:border-[#0078d4]/45 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative group"
            >
              <div>
                {/* Top Row: Icon Box & Editorial Step Index */}
                <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
                  <div className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${step.accentBg}`}>
                    {step.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-500">
                      {step.stepLabel}
                    </span>
                    {index < 2 && (
                      <ArrowRight className="hidden lg:inline-block w-3.5 h-3.5 text-slate-300 group-hover:text-[#0078d4] group-hover:translate-x-0.5 transition-all shrink-0" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 leading-snug mb-2.5 sm:mb-3 [text-wrap:balance]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Visual Step Preview Card */}
                {step.preview}
              </div>

              {/* Bottom Verification Tag */}
              <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-200/70 flex items-center justify-between gap-2 text-[11px] sm:text-xs font-bold text-[#0078d4]">
                <span className="inline-flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{step.tag}</span>
                </span>
                <span className="font-mono text-slate-400 font-bold tabular-nums shrink-0">
                  {step.stepIndex}/03
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
