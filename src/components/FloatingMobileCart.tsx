import { formatPrice } from '../products.ts';
import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ShoppingCart, ChevronRight } from 'lucide-react';

export const FloatingMobileCart: React.FC = () => {
  const { totalQuantity, total, hasDiscount, setIsCartOpen, currentPath, t } = useCart();

  // Show only if there is at least 1 item and not already in /checkout
  if (totalQuantity === 0 || currentPath === '/checkout') return null;

  return (
    <div
      id="floating-mobile-cart"
      className="md:hidden fixed bottom-4 left-3 right-20 z-40 animate-in slide-in-from-bottom-5 duration-300"
    >
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-[#0f172a]/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-[0_12px_30px_-6px_rgba(15,23,42,0.45)] border border-slate-700/80 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
        aria-label="Abrir carrito flotante"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-9 h-9 rounded-xl bg-[#0078d4] flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShoppingCart className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d83b01] text-white text-[10px] font-black flex items-center justify-center tabular-nums">
              {totalQuantity}
            </span>
          </div>
          <div className="text-left min-w-0">
            <div className="text-xs font-extrabold tracking-tight flex items-center gap-1.5 truncate">
              <span className="text-slate-300">{totalQuantity} {totalQuantity === 1 ? t('item') : t('items')}</span>
              <span className="text-slate-600">·</span>
              <span className="text-white font-black text-sm tabular-nums">{formatPrice(total)}</span>
            </div>
            {hasDiscount ? (
              <div className="text-[10px] font-bold text-emerald-400 truncate">
                {t('discountApplied')}
              </div>
            ) : (
              <div className="text-[10px] font-medium text-slate-400 truncate">
                Entrega digital inmediata
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-extrabold bg-[#d83b01] hover:bg-[#b83201] px-3 py-1.5 rounded-xl text-white transition-colors shrink-0 shadow-xs">
          <span>{t('cart')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        </div>
      </button>
    </div>
  );
};
