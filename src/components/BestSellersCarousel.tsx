import React, { useRef, useState, useEffect, useCallback } from 'react';
import { products } from '../products.ts';
import { ProductCard } from './ProductCard.tsx';
import { useCart } from '../context/CartContext.tsx';
import { Flame, ChevronLeft, ChevronRight, Play, Pause, Sparkles } from 'lucide-react';

export const BestSellersCarousel: React.FC = () => {
  const { t } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Selected top bestselling products for the reel
  const bestSellers = products.slice(products.length - 2, products.length).concat(products.slice(0, 7));
  
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
    <section id="mas-vendidos-section" className="py-12 bg-[#0f172a] text-white border-b border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 shadow-sm border border-blue-500/30">
              <Flame className="w-5 h-5 fill-blue-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                {t('bestSellersTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                {t('bestSellersSubtitle')}
              </p>
            </div>
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
                    ? 'scale-[1.02] ring-2 ring-blue-400 rounded-lg shadow-md shadow-blue-950/40'
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
                    ? 'w-7 bg-white shadow-md shadow-white/50'
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
