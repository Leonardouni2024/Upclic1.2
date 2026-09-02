import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { CheckCircle, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map(toast => {
        const isDiscount = toast.type === 'discount';
        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              isDiscount
                ? 'bg-[#0f172a] text-white border-[#0066FF]/40 shadow-[#0066FF]/20'
                : 'bg-white text-[#0f172a] border-slate-200/80 shadow-slate-900/10'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                isDiscount ? 'bg-[#0066FF] text-white' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {isDiscount ? <Sparkles className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm leading-snug">{toast.title}</h4>
              {toast.message && (
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    isDiscount ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
