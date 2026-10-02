import React from 'react';
import { Headphones, Zap, ShieldCheck, Tag } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Headphones className="w-5 h-5 text-[#00A3E0]" />,
      title: 'Soporte personalizado',
      subtitle: 'Te ayudamos en todo'
    },
    {
      icon: <Zap className="w-5 h-5 text-[#00A3E0]" />,
      title: 'Activación rápida',
      subtitle: 'En minutos'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#00A3E0]" />,
      title: 'Garantía y Seguridad',
      subtitle: '100% original'
    },
    {
      icon: <Tag className="w-5 h-5 text-[#00A3E0]" />,
      title: 'Descuentos únicos',
      subtitle: 'Los mejores precios'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 -mt-8 sm:-mt-10 mb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-5 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {benefits.map((item, index) => (
          <div key={index} className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0 text-[#00A3E0]">
              {item.icon}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {item.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
