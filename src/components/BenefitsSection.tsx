import React from 'react';
import { ShieldCheck, Laptop, Headphones, Zap, Wrench } from 'lucide-react';

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

export const BenefitsSection: React.FC = () => {
  const benefits: BenefitItem[] = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#0067B8]" />,
      title: 'Licencias seguras',
      subtitle: '100% Genuinas y Originales',
      description: 'Claves digitales auditadas y validadas con los servidores de activación oficiales de cada fabricante sin modificaciones.'
    },
    {
      icon: <Laptop className="w-6 h-6 text-[#0067B8]" />,
      title: 'Instalación asistida',
      subtitle: 'Paso a paso garantizado',
      description: 'Enlaces directos de descarga oficial, manuales ilustrados y asistencia remota para que actives tu software sin complicaciones.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#0067B8]" />,
      title: 'Atención personalizada',
      subtitle: 'Trato directo humano',
      description: 'Especialistas disponibles por WhatsApp y correo electrónico para responder tus dudas antes, durante y después de tu compra.'
    },
    {
      icon: <Zap className="w-6 h-6 text-[#0067B8]" />,
      title: 'Activación rápida',
      subtitle: 'Entrega en 5 a 15 minutos',
      description: 'Recibe tu clave de licencia e instrucciones de instalación de inmediato en tu correo electrónico o bandeja de WhatsApp.'
    },
    {
      icon: <Wrench className="w-6 h-6 text-[#0067B8]" />,
      title: 'Soporte técnico',
      subtitle: 'Garantía total de activación',
      description: 'Reemplazo inmediato ante cualquier eventualidad o asistencia guiada en vivo para verificar que tu equipo quede 100% activo.'
    }
  ];

  return (
    <section id="beneficios-section" className="py-14 sm:py-16 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-[#0067B8] text-xs font-bold tracking-wide uppercase mb-2.5">
            <span>Compromiso de Confianza</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            ¿Por qué comprar en UpClic?
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 font-normal">
            Seguridad tecnológica y respaldo en cada una de tus compras digitales.
          </p>
        </div>

        {/* Benefits Grid (5 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 hover:border-[#0067B8]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-start"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A] mb-1">
                {item.title}
              </h3>
              <p className="text-[11px] font-bold text-[#0067B8] uppercase tracking-wide mb-2.5">
                {item.subtitle}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reassurance Bar */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-[#0B1F3A]">
              Servidores de activación de Microsoft y fabricantes operativos en tiempo real
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Respaldado por garantía de activación verificada
          </div>
        </div>

      </div>
    </section>
  );
};
