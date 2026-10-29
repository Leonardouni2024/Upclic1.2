import React from 'react';
import { MousePointerClick, MailCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const steps = [
    {
      stepNumber: 'PASO 01',
      icon: <MousePointerClick className="w-6 h-6 text-[#0078d4]" />,
      title: 'Elige tu versión de Office y paga de forma segura',
      description:
        'Selecciona la edición de Microsoft Office ideal para tu equipo y completa tu compra mediante nuestra pasarela encriptada (Tarjetas, Yape, Plin o PayPal).',
      tag: 'Compra 100% Protegida SSL'
    },
    {
      stepNumber: 'PASO 02',
      icon: <MailCheck className="w-6 h-6 text-[#d83b01]" />,
      title: 'Recibe tu clave de producto digital por Email en menos de 2 minutos',
      description:
        'Nuestro sistema automatizado envía al instante tu clave original de 25 caracteres junto con el comprobante a tu correo electrónico y WhatsApp.',
      tag: 'Entrega Digital < 2 min'
    },
    {
      stepNumber: 'PASO 03',
      icon: <ShieldCheck className="w-6 h-6 text-[#0078d4]" />,
      title: 'Sigue nuestra guía paso a paso y activa directamente en el sitio oficial de Microsoft',
      description:
        'Descarga los instaladores limpios desde los servidores oficiales de Microsoft, canjea tu licencia y disfruta de todas las funciones sin vencimientos.',
      tag: 'Validación Oficial Microsoft'
    }
  ];

  return (
    <section id="proceso-bento-section" className="py-12 sm:py-16 bg-[#f8fafc] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0078d4]/10 text-[#0078d4] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Proceso Ultra Rápido</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tu software original activo en 3 simples pasos
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-normal">
            Sin esperas físicas ni configuraciones complicadas. Diseñado para que empieces a trabajar hoy mismo.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#0078d4]/40 transition-all duration-200 flex flex-col justify-between relative group"
            >
              <div>
                {/* Top Row: Icon Box & Step Pill */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-13 h-13 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs tracking-wider uppercase">
                    {step.stepNumber}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom Verification Tag */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#0078d4]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{step.tag}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

