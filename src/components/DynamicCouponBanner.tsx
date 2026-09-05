import React, { useState, useEffect } from 'react';

interface DynamicCouponBannerProps {
  onApply: (code: string) => void;
  isCouponApplied: boolean;
  totalQuantity: number;
}

export const DynamicCouponBanner: React.FC<DynamicCouponBannerProps> = ({ onApply, isCouponApplied, totalQuantity }) => {
  const [coupon, setCoupon] = useState<{ code: string, discountPercent: number, expiresAt: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const checkCoupon = () => {
      try {
        const dyn = localStorage.getItem('upclic_dynamic_coupon');
        if (dyn) {
          const parsed = JSON.parse(dyn);
          if (parsed.expiresAt > Date.now()) {
            setCoupon(parsed);
          } else {
            setCoupon(null);
            localStorage.removeItem('upclic_dynamic_coupon');
          }
        }
      } catch (e) {}
    };

    checkCoupon();
    // Update every second for the timer
    const interval = setInterval(() => {
      if (!coupon) {
        checkCoupon();
      } else {
        const remaining = coupon.expiresAt - Date.now();
        if (remaining <= 0) {
          setCoupon(null);
          localStorage.removeItem('upclic_dynamic_coupon');
        } else {
          const m = Math.floor(remaining / 60000);
          const s = Math.floor((remaining % 60000) / 1000);
          setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [coupon]);

  if (!coupon || isCouponApplied || totalQuantity >= 2) return null;

  return (
    <div className="mx-6 mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
      <div>
        <p className="text-xs font-bold text-blue-800">Tienes un cupón de {coupon.discountPercent}% OFF</p>
        <p className="text-[10px] text-blue-600 mt-0.5">
          Código: <span className="font-bold font-mono text-xs text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-100 mr-1">{coupon.code}</span>
        </p>
        <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          Expira en: {timeLeft}
        </p>
      </div>
      <button 
        onClick={() => onApply(coupon.code)}
        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
      >
        Aplicar
      </button>
    </div>
  );
};
