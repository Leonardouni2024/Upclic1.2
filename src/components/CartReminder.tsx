import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ShoppingCart, X, ArrowRight } from 'lucide-react';

export const CartReminder: React.FC = () => {
  const { totalQuantity, currentPath, isCartOpen, setIsCartOpen, navigateToCheckout } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  useEffect(() => {
    // Only show if there's items, not in checkout, cart drawer is closed, and user hasn't explicitly dismissed it
    if (totalQuantity > 0 && currentPath !== '/checkout' && !isCartOpen && !hasClosed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300000); // Esperar 5 minutos (300,000 ms) antes de mostrar el recordatorio
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [totalQuantity, currentPath, isCartOpen, hasClosed]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-4 left-4 sm:left-auto sm:right-6 z-40 animate-in slide-in-from-right-8 fade-in duration-500 sm:max-w-[320px]">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 p-4 flex items-start gap-4 relative overflow-hidden group">
        
        {/* Accent border top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
        
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-blue-50 flex flex-shrink-0 items-center justify-center relative mt-0.5">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
            {totalQuantity}
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 pr-4">
          <h4 className="text-sm font-extrabold text-slate-800">¡No olvides tu carrito!</h4>
          <p className="text-[13px] text-slate-500 mt-1 leading-snug">
            Tienes {totalQuantity} {totalQuantity === 1 ? 'producto esperando' : 'productos esperando'} ser {totalQuantity === 1 ? 'activado' : 'activados'}.
          </p>
          
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                setIsVisible(false);
                navigateToCheckout();
              }}
              className="text-[11px] font-extrabold bg-[#0066FF] hover:bg-[#0052cc] text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              Completar compra <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-2 transition-colors"
            >
              Ver carrito
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setHasClosed(true);
          }}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Cerrar recordatorio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
