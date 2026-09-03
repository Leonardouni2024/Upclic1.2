import React, { useState, useEffect } from 'react';
import { demonstrationReviews } from '../testimonials.ts';
import { Star, X, Users, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export const FloatingTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Rotate every 5.5 seconds unless hovered
  useEffect(() => {
    if (!isVisible || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % demonstrationReviews.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isVisible, isPaused]);

  if (!isVisible) return null;

  const current = demonstrationReviews[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? demonstrationReviews.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % demonstrationReviews.length);
  };

  return (
    <aside
      id="floating-recommendations-widget"
      aria-label="Recomendaciones y testimonios de clientes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-30 max-w-[310px] sm:max-w-xs w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/90 transition-all duration-300 pointer-events-auto group"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[11px] font-bold text-slate-500">
        <div className="flex items-center gap-1.5 text-[#0066FF]">
          <Users className="w-3.5 h-3.5" />
          <span className="font-extrabold tracking-tight">Las personas nos recomiendan</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
            {currentIndex + 1}/{demonstrationReviews.length}
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Ocultar widget"
            aria-label="Cerrar recomendaciones"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Testimonial body */}
      <div key={current.id} className="animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0066FF] font-black text-xs flex items-center justify-center">
              {current.author.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {current.author}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {current.city}
              </div>
            </div>
          </div>

          {/* Dynamic Stars */}
          <div className="flex items-center text-amber-400" title={`Calificación: ${current.rating}/5 estrellas`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < current.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product bought tag */}
        {current.productName && (
          <div className="mt-1.5 text-[10px] text-blue-700 font-semibold bg-blue-50/80 px-2 py-0.5 rounded-md inline-block max-w-full truncate border border-blue-100">
            {current.productName}
          </div>
        )}

        {/* Comment quote */}
        <p className="mt-2 text-xs text-slate-700 italic font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          "{current.comment}"
        </p>

        {/* Verified Purchase Badge + Arrows */}
        <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-500">
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Compra Verificada
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              aria-label="Testimonio anterior"
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente testimonio"
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

