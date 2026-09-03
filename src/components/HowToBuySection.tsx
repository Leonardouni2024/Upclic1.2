import React from 'react';
import { ExternalLink, CreditCard, Send, CheckCircle2, Clock } from 'lucide-react';

export const HowToBuySection: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'PASO 1',
      headline: 'Link de pago y monto',
      text: 'Al comprar serás redireccionado al link de pago seguro. Digita el monto exacto y haz clic en "Continuar".',
      icon: ExternalLink,
      color: 'bg-blue-100 text-[#0066FF]'
    },
    {
      num: '2',
      title: 'PASO 2',
      headline: 'Opciones de pago',
      text: 'Elige tu medio preferido: Tarjeta de crédito/débito, Banca por internet, Agentes, PagoEfectivo o Yape.',
      icon: CreditCard,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      num: '3',
      title: 'PASO 3',
      headline: 'Redirección a WhatsApp',
      text: 'Al completar el pago, serás redireccionado automáticamente al chat de WhatsApp del proveedor.',
      icon: Send,
      color: 'bg-sky-100 text-sky-600'
    },
    {
      num: '4',
      title: 'PASO 4',
      headline: 'Envía tu captura',
      text: 'Envía la captura o comprobante de pago por WhatsApp como confirmación de tu compra.',
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      num: '5',
      title: 'PASO 5',
      headline: 'Entrega (10 a 20 min)',
      text: 'Validamos tu pago y te enviamos tu clave original y guía. La respuesta demora entre 10 a 20 min.',
      icon: Clock,
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <section id="como-comprar-section" className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF] bg-blue-50/90 border border-blue-100 px-3 py-1 rounded-full shadow-2xs">
            Proceso Rápido y Seguro
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mt-2.5">
            ¿Cómo comprar en UpClic?
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Guía clara y rápida: Paga con tu método favorito y recibe tu licencia en 10 a 20 minutos
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${step.color} flex items-center justify-center border border-white shadow-2xs`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[11px] font-black tracking-wider px-2 py-0.5 rounded-lg bg-white border border-slate-200/90 text-slate-600 shadow-2xs">
                      {step.title}
                    </span>
                  </div>
                  <h3 className="text-xs font-black uppercase text-slate-900 tracking-wide mb-1">
                    {step.headline}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {step.text}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-400 font-semibold flex items-center justify-between">
                  <span>Paso {idx + 1} de 5</span>
                  <span className="text-emerald-600 font-bold">Garantizado</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
