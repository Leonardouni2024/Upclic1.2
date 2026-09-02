import React, { useRef } from 'react';
import { products } from '../products.ts';
import { ProductCard } from './ProductCard.tsx';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

export const BestSellersCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Exact 4 best-sellers requested:
  // Office Professional Plus 2024, Office Professional Plus 2021, Windows 11 Pro, Microsoft 365
  const bestSellers = [
    products.find(p => p.slug === 'office-professional-plus-2024')!,
    products.find(p => p.slug === 'office-professional-plus-2021')!,
    products.find(p => p.slug === 'windows-11-pro')!,
    products.find(p => p.slug === 'microsoft-365')!
  ].filter(Boolean);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="mas-vendidos-section" className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100 shadow-2xs">
              <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0f172a] tracking-tight">
                Más Vendidos
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Las opciones preferidas por nuestros clientes esta semana
              </p>
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer active:scale-95"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {bestSellers.map(product => (
            <div
              key={product.id}
              className="w-[260px] sm:w-[280px] lg:w-[calc(25%-18px)] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
