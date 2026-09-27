import React from 'react';
import { Scale, X, ArrowRight, Trash2, Check, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

export const FloatingComparisonBar: React.FC = () => {
  const {
    comparisonList,
    removeFromComparison,
    clearComparison,
    setIsComparisonModalOpen,
    isComparisonModalOpen,
    formatPrice,
    t,
    language,
    getProductName
  } = useCart();

  if (comparisonList.length === 0 || isComparisonModalOpen) return null;

  return (
    <aside 
      aria-label={t('compareProducts')}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-2xl shadow-2xl p-3 sm:p-3.5 text-white animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left info & product thumbnails */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0 text-xs font-black">
            <Scale className="w-4 h-4" />
            <span>{comparisonList.length}/3</span>
          </div>

          {/* Slots */}
          <div className="flex items-center gap-2">
            {comparisonList.map((product) => {
              const name = getProductName(product);
              return (
                <div 
                  key={product.id}
                  className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 shrink-0 max-w-[170px] relative group"
                >
                  <img 
                    src={product.imageUrl} 
                    alt={name}
                    className="w-7 h-7 object-contain shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = product.fallbackImage;
                    }}
                  />
                  <div className="min-w-0 pr-4">
                    <p className="text-[11px] font-bold text-white truncate">{name}</p>
                    <p className="text-[10px] text-blue-400 font-bold">{formatPrice(product.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromComparison(product.id)}
                    className="absolute top-1 right-1 p-0.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                    aria-label={`Quitar ${name}`}
                    title={t('compareRemove')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {/* Empty slot placeholder if < 3 */}
            {comparisonList.length < 3 && (
              <div 
                onClick={() => setIsComparisonModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 border border-dashed border-slate-700 bg-slate-800/40 rounded-xl px-3 py-1.5 text-[11px] text-slate-400 hover:text-white hover:border-slate-500 transition-colors cursor-pointer shrink-0"
                title={t('compareSelectProduct')}
              >
                <Plus className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'ES' ? 'Agregar otro' : 'Add another'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right CTA buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={clearComparison}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-xs"
            title={t('compareClear')}
            aria-label={t('compareClear')}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsComparisonModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>{t('compareNow')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
