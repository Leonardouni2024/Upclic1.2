import React from 'react';
import { ShoppingCart, CheckCheck, CreditCard, DollarSign, MessageCircle } from 'lucide-react';

export const HowToBuySection: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'PASO 1',
      text: 'Selecciona tus productos y agrégalos al carrito.',
      icon: ShoppingCart,
      color: 'bg-blue-100 text-[#0066FF]'
    },
    {
      num: '2',
      title: 'PASO 2',
      text: 'Verifica la cantidad y el total con descuento automático.',
      icon: CheckCheck,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      num: '3',
      title: 'PASO 3',
      text: 'Presiona "Pagar con Mercado Pago".',
      icon: CreditCard,
      color: 'bg-sky-100 text-sky-600'
    },
    {
      num: '4',
      title: 'PASO 4',
      text: 'Realiza el pago seguro por el importe exacto mostrado.',
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      num: '5',
      title: 'PASO 5',
      text: 'Después del pago, presiona "Confirmar compra por WhatsApp".',
      icon: MessageCircle,
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
            Sigue estos 5 pasos simples para recibir tu licencia digital en minutos
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
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-9 h-9 rounded-xl ${step.color} flex items-center justify-center border border-white shadow-2xs`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[11px] font-black tracking-wider px-2 py-0.5 rounded-lg bg-white border border-slate-200/90 text-slate-600 shadow-2xs">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                    {step.text}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-400 font-semibold">
                  Atención instantánea
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
