import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ShoppingCart, Sparkles, ChevronRight } from 'lucide-react';

export const FloatingMobileCart: React.FC = () => {
  const { totalQuantity, total, hasDiscount, setIsCartOpen, currentPath } = useCart();

  // Show only if there is at least 1 item and not already in /checkout
  if (totalQuantity === 0 || currentPath === '/checkout') return null;

  return (
    <div
      id="floating-mobile-cart"
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 animate-in slide-in-from-bottom-5 duration-300"
    >
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-[#0f172a] text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/60 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
        aria-label="Abrir carrito flotante"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center text-white shrink-0 shadow-md">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
              <span>{totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'}</span>
              <span className="text-slate-500">|</span>
              <span className="text-[#60CDFF] text-sm">S/ {total.toFixed(2)}</span>
            </div>
            {hasDiscount && (
              <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span>✓ 10% de descuento aplicado</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-extrabold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-white transition-colors">
          <span>Ver carrito</span>
          <ChevronRight className="w-4 h-4 text-blue-300" />
        </div>
      </button>
    </div>
  );
};
