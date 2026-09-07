import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { Globe, X, Check } from 'lucide-react';

export const RegionLanguageModal: React.FC = () => {
  const {
    isRegionModalOpen,
    setIsRegionModalOpen,
    currency,
    setCurrency,
    language,
    setLanguage
  } = useCart();

  if (!isRegionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#180e38] text-white w-full max-w-md rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#110928]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-[#facc15] flex items-center justify-center font-black border border-amber-400/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-lg leading-tight">
                {language === 'ES' ? 'Región, Moneda e Idioma' : 'Region, Currency & Language'}
              </h3>
              <p className="text-xs text-purple-200 font-medium">
                {language === 'ES' ? 'Selecciona tu preferencia' : 'Select your preference'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRegionModalOpen(false)}
            className="w-8 h-8 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 2 clean option cards */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-semibold text-purple-200">
            {language === 'ES' ? 'Selecciona la configuración de tu tienda:' : 'Select your store setting:'}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {/* Option 1: Perú - Soles (S/) - Español */}
            <button
              onClick={() => {
                setCurrency('PEN');
                setLanguage('ES');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                currency === 'PEN'
                  ? 'bg-[#2a0b5c] border-[#facc15] text-white shadow-lg ring-1 ring-[#facc15]'
                  : 'bg-[#110928] border-white/10 text-purple-200 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🇵🇪</span>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>Perú (PE)</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold border border-purple-500/30">
                      Español
                    </span>
                  </div>
                  <div className="text-xs text-amber-300 font-bold mt-0.5">Soles Peruanos (S/ PEN)</div>
                </div>
              </div>

              {currency === 'PEN' && (
                <div className="w-6 h-6 rounded-full bg-[#facc15] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            {/* Option 2: Colombia - Pesos ($) - Español */}
            <button
              onClick={() => {
                setCurrency('COP');
                setLanguage('ES');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                currency === 'COP'
                  ? 'bg-[#2a0b5c] border-[#facc15] text-white shadow-lg ring-1 ring-[#facc15]'
                  : 'bg-[#110928] border-white/10 text-purple-200 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🇨🇴</span>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>Colombia (CO)</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold border border-purple-500/30">
                      Español
                    </span>
                  </div>
                  <div className="text-xs text-amber-300 font-bold mt-0.5">Pesos Colombianos ($ COP)</div>
                </div>
              </div>

              {currency === 'COP' && (
                <div className="w-6 h-6 rounded-full bg-[#facc15] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            {/* Option 3: México - Pesos ($) - Español */}
            <button
              onClick={() => {
                setCurrency('MXN');
                setLanguage('ES');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                currency === 'MXN'
                  ? 'bg-[#2a0b5c] border-[#facc15] text-white shadow-lg ring-1 ring-[#facc15]'
                  : 'bg-[#110928] border-white/10 text-purple-200 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🇲🇽</span>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>México (MX)</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold border border-purple-500/30">
                      Español
                    </span>
                  </div>
                  <div className="text-xs text-amber-300 font-bold mt-0.5">Pesos Mexicanos ($ MXN)</div>
                </div>
              </div>

              {currency === 'MXN' && (
                <div className="w-6 h-6 rounded-full bg-[#facc15] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            {/* Option 4: USA / Global - Dólares ($) - English */}
            <button
              onClick={() => {
                setCurrency('USD');
                setLanguage('EN');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                currency === 'USD'
                  ? 'bg-[#2a0b5c] border-[#facc15] text-white shadow-lg ring-1 ring-[#facc15]'
                  : 'bg-[#110928] border-white/10 text-purple-200 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🇺🇸</span>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>United States (US)</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold border border-purple-500/30">
                      English
                    </span>
                  </div>
                  <div className="text-xs text-amber-300 font-bold mt-0.5">Dólares Estadounidenses ($ USD)</div>
                </div>
              </div>

              {currency === 'USD' && (
                <div className="w-6 h-6 rounded-full bg-[#facc15] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end bg-[#110928]">
          <button
            onClick={() => setIsRegionModalOpen(false)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-xs transition-colors cursor-pointer border border-amber-300 shadow-md"
          >
            {language === 'ES' ? 'Guardar' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
