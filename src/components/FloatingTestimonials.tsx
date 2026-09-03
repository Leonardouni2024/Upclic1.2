import React, { useState, useEffect } from 'react';
import { demonstrationReviews } from '../testimonials.ts';
import { Star, X, Users, CheckCircle2, ChevronLeft, ChevronRight, Minus, MessageSquare } from 'lucide-react';

export const FloatingTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Rotate every 7 seconds unless paused
  useEffect(() => {
    if (!isVisible || isPaused || isMinimized) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % demonstrationReviews.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isVisible, isPaused, isMinimized]);

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

  // Minimized state - tiny unobtrusive pill at the bottom
  if (isMinimized) {
    return (
      <aside
        id="floating-recommendations-widget-minimized"
        aria-label="Testimonios de clientes minimizado"
        className="fixed bottom-20 left-3 sm:bottom-5 sm:left-5 z-20 pointer-events-auto"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-sm hover:shadow-md text-[11px] font-bold text-slate-700 hover:text-[#0066FF] transition-all cursor-pointer group"
          title="Ver opiniones de clientes"
        >
          <div className="flex text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </div>
          <span>4.9 · Clientes satisfechos</span>
          <MessageSquare className="w-3 h-3 text-slate-400 group-hover:text-[#0066FF] ml-0.5" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      id="floating-recommendations-widget"
      aria-label="Recomendaciones y testimonios de clientes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed bottom-20 left-3 sm:bottom-5 sm:left-5 z-20 max-w-[240px] sm:max-w-[260px] w-full bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 shadow-md border border-slate-200/80 transition-all duration-300 pointer-events-auto group"
    >
      {/* Mini header bar */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-500">
        <div className="flex items-center gap-1 text-[#0066FF]">
          <Users className="w-3 h-3 shrink-0" />
          <span className="font-extrabold tracking-tight truncate">Nos recomiendan</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
            {currentIndex + 1}/{demonstrationReviews.length}
          </span>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="Minimizar"
            aria-label="Minimizar widget"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="Ocultar"
            aria-label="Cerrar recomendaciones"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mini testimonial body */}
      <div key={current.id} className="animate-in fade-in duration-200">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0066FF] font-black text-[10px] flex items-center justify-center shrink-0">
              {current.author.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-900 leading-none truncate">
                {current.author}
              </div>
              <div className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
                {current.city ? `${current.city}, Perú` : 'Cliente verificado'}
              </div>
            </div>
          </div>

          {/* Mini Stars */}
          <div className="flex items-center text-amber-400 shrink-0" title={`${current.rating}/5 estrellas`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 ${
                  i < current.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Compact quote */}
        <p className="text-[10px] text-slate-600 italic font-medium leading-snug line-clamp-2 bg-slate-50/80 px-2 py-1.5 rounded-lg border border-slate-100">
          "{current.comment}"
        </p>

        {/* Bottom meta row */}
        <div className="mt-1.5 flex items-center justify-between text-[9px] font-medium text-slate-400">
          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-0.5 font-bold">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            Compra Verificada
          </span>

          <div className="flex items-center gap-0.5">
            <button
              onClick={handlePrev}
              aria-label="Anterior"
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente"
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

