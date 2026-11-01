import React from 'react';
import {
  Zap,
  ShieldCheck,
  Headphones,
  CreditCard,
  CheckCircle2,
  MousePointerClick,
  MailCheck
} from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const steps = [
    {
      step: 'PASO 01 • ELECCIÓN Y PAGO EN SOLES',
      title: 'Elige tu producto digital o suscripción',
      description:
        'Selecciona entre nuestras categorías de Streaming, Microsoft Office, Windows, Inteligencia Artificial, Diseño y Software Profesional. Paga en Soles (S/) con Yape, Plin, Transferencia o Tarjeta.',
      bullets: ['Precios transparentes en Soles (S/)', 'Pagos con Yape, Plin, Transferencia, Mercado Pago o PayPal'],
      icon: <MousePointerClick className="w-5 h-5 text-[#1668E3]" />,
      tone: 'bg-[#E6F0FF]'
    },
    {
      step: 'PASO 02 • ENTREGA DIGITAL',
      title: 'Recibe tu clave o acceso en tu correo y WhatsApp',
      description:
        'Tras verificar tu pago, enviamos tu clave de licencia, invitación oficial a tu correo personal o credenciales verificadas, acompañadas de la guía de instalación paso a paso.',
      bullets: ['Envío directo sin esperas físicas', 'Instrucciones claras paso a paso'],
      icon: <MailCheck className="w-5 h-5 text-[#5B3CC4]" />,
      tone: 'bg-[#EEE9FF]'
    },
    {
      step: 'PASO 03 • ACTIVACIÓN Y GARANTÍA',
      title: 'Activa tu programa o servicio con soporte real',
      description:
        'Utiliza tus herramientas en tu PC, Mac o dispositivo móvil. Si necesitas asistencia durante la instalación o activación, nuestro equipo técnico te acompaña por WhatsApp.',
      bullets: ['Soporte técnico directo por WhatsApp', 'Garantía aplicable en cada producto'],
      icon: <ShieldCheck className="w-5 h-5 text-[#0B7A64]" />,
      tone: 'bg-[#DDF5EF]'
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-5 h-5 text-[#1668E3]" />,
      title: 'Entrega 100% Digital',
      desc: 'Sin costos de envío físico. Recibe tus accesos e instrucciones directamente en tu correo electrónico y WhatsApp.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#1668E3]" />,
      title: 'Condiciones Claras y Transparentes',
      desc: 'Especificamos con exactitud si el producto es clave OEM, Retail, activación telefónica, invitación personal o perfil.'
    },
    {
      icon: <Headphones className="w-5 h-5 text-[#1668E3]" />,
      title: 'Atención Personalizada en Perú',
      desc: 'Te asesoramos antes, durante y después de tu compra en español a través de nuestro WhatsApp oficial.'
    },
    {
      icon: <CreditCard className="w-5 h-5 text-[#1668E3]" />,
      title: 'Medios de Pago Locales',
      desc: 'Facilidad de pago en Soles peruanos (S/) mediante Yape, Plin, Transferencia bancaria y tarjetas.'
    }
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#F4F7FB] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* How It Works (3 Steps) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1668E3] block mb-2">
              Proceso de Compra Simple
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              ¿Cómo comprar en UPCLIC?
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Adquiere tus licencias y suscripciones digitales en 3 pasos claros y seguros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 sm:p-7 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-11 h-11 rounded-xl ${item.tone} flex items-center justify-center shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {item.step}
                      </span>
                      <h3 className="text-base font-extrabold text-[#0B1F3A] leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {item.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits of Buying at UPCLIC */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1668E3] block mb-1">
              Por qué elegirnos
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
              Beneficios de comprar en UPCLIC
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E6F0FF] flex items-center justify-center">
                  {b.icon}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#0B1F3A]">{b.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
