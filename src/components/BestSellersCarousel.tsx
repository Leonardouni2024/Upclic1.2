import React, { useRef, useState, useEffect, useCallback } from 'react';
import { products } from '../products.ts';
import { ProductCard } from './ProductCard.tsx';
import { Flame, ChevronLeft, ChevronRight, Play, Pause, Sparkles } from 'lucide-react';

export const BestSellersCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Selected top bestselling products for the reel
  const bestSellers = [
    products.find(p => p.id === 'prod-combo-win11-office2024'),
    products.find(p => p.slug === 'office-professional-plus-2024'),
    products.find(p => p.slug === 'office-professional-plus-2021'),
    products.find(p => p.slug === 'microsoft-365'),
    products.find(p => p.slug === 'windows-11-pro'),
    products.find(p => p.slug === 'windows-10-pro'),
    products.find(p => p.slug === 'project-professional-2024'),
    products.find(p => p.slug === 'visio-professional-2024'),
    products.find(p => p.slug === 'windows-8-1-pro'),
  ].filter((p): p is typeof products[0] => Boolean(p));

  const totalItems = bestSellers.length;

  const scrollToIndex = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cards = container.children;
    if (cards.length > index) {
      const targetCard = cards[index] as HTMLElement;
      const scrollLeft = targetCard.offsetLeft - container.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalItems;
    scrollToIndex(nextIndex);
  }, [currentIndex, totalItems, scrollToIndex]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    scrollToIndex(prevIndex);
  }, [currentIndex, totalItems, scrollToIndex]);

  // Automated Reel / Carrete ticker animation (scrolls to next product every 3.2 seconds if not paused/hovered)
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3200);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, handleNext]);

  // Listen to manual scroll to update active index
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = 280 + 16; // Card width + gap approximate
    const newIndex = Math.min(
      totalItems - 1,
      Math.max(0, Math.round(scrollLeft / cardWidth))
    );
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <section id="mas-vendidos-section" className="py-12 bg-gradient-to-b from-[#250953] to-[#170c36] text-white border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Reel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 border border-amber-300">
              <Flame className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                Más Vendidos
              </h2>
              <p className="text-xs sm:text-sm text-purple-200 font-medium mt-0.5">
                Licencias oficiales con mayor demanda actualizadas en tiempo real
              </p>
            </div>
          </div>

          {/* Controls: Play/Pause, Indicators, Arrows */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md">
            {/* Play/Pause Button */}
            <button
              id="reel-play-pause-btn"
              onClick={() => setIsPlaying(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 border border-amber-300'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
              title={isPlaying ? 'Pausar animación del carrete' : 'Reanudar animación del carrete'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden md:inline">Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden md:inline">Continuar</span>
                </>
              )}
            </button>

            <div className="h-5 w-px bg-white/20 mx-0.5" />

            {/* Previous Arrow */}
            <button
              id="reel-prev-btn"
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 shadow-sm transition-all cursor-pointer active:scale-95"
              aria-label="Producto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Arrow */}
            <button
              id="reel-next-btn"
              onClick={handleNext}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 shadow-sm transition-all cursor-pointer active:scale-95"
              aria-label="Siguiente producto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Animated Reel Carousel Strip */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Scrollable Container */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory px-1"
          >
            {bestSellers.map((product, idx) => (
              <div
                key={product.id}
                className={`w-[270px] sm:w-[290px] lg:w-[305px] shrink-0 snap-center transition-all duration-300 ${
                  currentIndex === idx
                    ? 'scale-[1.02] ring-2 ring-[#facc15] rounded-2xl shadow-xl shadow-purple-950/80'
                    : 'opacity-90 hover:opacity-100'
                }`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Reel Index Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {bestSellers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 bg-[#facc15] shadow-md shadow-amber-500/50'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Ir al producto ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
