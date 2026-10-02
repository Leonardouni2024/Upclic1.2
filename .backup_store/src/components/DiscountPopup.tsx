import React, { useEffect, useState } from 'react';
import { Percent, X, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface DiscountPopupProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const DiscountPopup: React.FC<DiscountPopupProps> = ({ isOpen, onComplete }) => {
  const { language } = useCart();
  const isEn = language === 'EN';

  const [timeLeftMs, setTimeLeftMs] = useState(7000);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeftMs(7000);
      setIsFadingOut(false);
      return;
    }

    setTimeLeftMs(7000);
    setIsFadingOut(false);

    const startTime = Date.now();
    const totalDuration = 7000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, totalDuration - elapsed);
      setTimeLeftMs(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        // Start smooth fade-out animation
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 700); // Allow fade-out transition to complete smoothly
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen && !isFadingOut) return null;

  const secondsDisplay = Math.ceil(timeLeftMs / 1000);
  const progressPercent = Math.max(0, Math.min(100, (timeLeftMs / 7000) * 100));

  const handleInstantApply = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div
      id="discount-popup-toast"
      role="alert"
      aria-live="assertive"
      className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md transition-all duration-700 ease-out transform pointer-events-auto ${
        isFadingOut
          ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          : 'opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-top-6 duration-400'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border border-sky-300/80 shadow-[0_20px_50px_rgba(0,112,186,0.25)] rounded-2xl p-4 sm:p-4.5 overflow-hidden relative">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0070ba] via-[#00A3E0] to-[#60CDFF]" />

        <div className="flex items-start gap-3.5 pt-0.5">
          {/* Modern Percent Icon in UpClic Cyan Gradient */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0070ba] to-[#00A3E0] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 mt-0.5">
            <Percent className="w-5 h-5 stroke-[2.5]" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0070ba] border border-blue-200">
                <CheckCircle2 className="w-3 h-3 text-[#0070ba]" />
                <span>{isEn ? '10% Discount Unlocked' : '¡Descuento Desbloqueado!'}</span>
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              {isEn
                ? 'You won a 10% discount!'
                : '¡Ganaste un descuento del 10%!'}
            </h4>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              {isEn
                ? 'For adding 1 more product to your cart. The discount will apply automatically.'
                : 'Por agregar 1 producto más a tu carrito. Se aplicará de forma automática.'}
            </p>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="text-[#0070ba] font-bold">
                {isEn ? `Applying in ${secondsDisplay}s...` : `Aplicando automáticamente en ${secondsDisplay}s...`}
              </span>
              <button
                type="button"
                onClick={handleInstantApply}
                className="text-[11px] font-bold text-[#0070ba] hover:underline cursor-pointer"
              >
                {isEn ? 'Apply now' : 'Aplicar ahora'}
              </button>
            </div>

            {/* 7-Second Animated Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0070ba] to-[#00A3E0] transition-all duration-75 ease-linear rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Close / Dismiss Button */}
          <button
            type="button"
            onClick={handleInstantApply}
            className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar y aplicar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
