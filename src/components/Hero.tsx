import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductCategory } from '../types';

export const Hero: React.FC = () => {
  const { setSelectedCategory } = useCart();

  const scrollToCatalog = (category?: ProductCategory) => {
    if (category) {
      setSelectedCategory(category);
    }
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-[#F4F7FB] text-slate-900 pt-6 pb-8 lg:pt-10 lg:pb-12 border-b border-slate-200/80 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Hero Banner */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F0FF] border border-blue-200 text-[#1457C9] text-xs font-bold tracking-wide mb-5">
            <span className="w-2 h-2 rounded-full bg-[#1668E3]"></span>
            TIENDA OFICIAL DE SOFTWARE Y SUSCRIPCIONES EN PERÚ
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.1] mb-4 text-[#0B1F3A]">
            Todo lo digital, <span className="text-[#1668E3]">en un solo lugar.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#475569] mb-7 max-w-2xl font-normal leading-relaxed">
            Descubre software, entretenimiento y herramientas digitales con atención personalizada y entrega digital.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={() => scrollToCatalog('all')}
              className="px-7 py-4 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Explorar Catálogo Digital</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

