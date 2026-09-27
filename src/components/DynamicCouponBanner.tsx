import React from 'react';
import { Sparkles } from 'lucide-react';

interface DynamicCouponBannerProps {
  onApply: (code: string) => void;
  isCouponApplied: boolean;
  totalQuantity: number;
}

export const DynamicCouponBanner: React.FC<DynamicCouponBannerProps> = ({ onApply, isCouponApplied }) => {
  if (isCouponApplied) return null;

  return (
    <div className="mx-6 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between shadow-xs">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-black text-blue-900">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>¡Cupón Oficial del 10% de Descuento!</span>
        </div>
        <p className="text-[11px] text-blue-700 mt-0.5">
          Usa el código oficial: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-900">UPCLIC10</strong>
        </p>
      </div>
      <button 
        type="button"
        onClick={() => onApply('UPCLIC10')}
        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
      >
        Aplicar 10%
      </button>
    </div>
  );
};
