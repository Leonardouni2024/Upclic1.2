import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { Globe, X, Check, RefreshCw } from 'lucide-react';

const getCountryInfo = (code: string | null, lang: 'ES' | 'EN'): { flag: string; name: string } => {
  if (!code) return { flag: '🌐', name: lang === 'ES' ? 'Detectando...' : 'Detecting...' };
  const map: Record<string, { flag: string; es: string; en: string }> = {
    PE: { flag: '🇵🇪', es: 'Perú', en: 'Peru' },
    CO: { flag: '🇨🇴', es: 'Colombia', en: 'Colombia' },
    MX: { flag: '🇲🇽', es: 'México', en: 'Mexico' },
    US: { flag: '🇺🇸', es: 'Estados Unidos', en: 'United States' },
    AR: { flag: '🇦🇷', es: 'Argentina', en: 'Argentina' },
    CL: { flag: '🇨🇱', es: 'Chile', en: 'Chile' },
    EC: { flag: '🇪🇨', es: 'Ecuador', en: 'Ecuador' },
    BO: { flag: '🇧🇴', es: 'Bolivia', en: 'Bolivia' },
    ES: { flag: '🇪🇸', es: 'España', en: 'Spain' },
    CA: { flag: '🇨🇦', es: 'Canadá', en: 'Canada' },
    BR: { flag: '🇧🇷', es: 'Brasil', en: 'Brazil' },
    UY: { flag: '🇺🇾', es: 'Uruguay', en: 'Uruguay' },
    PY: { flag: '🇵🇾', es: 'Paraguay', en: 'Paraguay' },
    VE: { flag: '🇻🇪', es: 'Venezuela', en: 'Venezuela' },
    CR: { flag: '🇨🇷', es: 'Costa Rica', en: 'Costa Rica' },
    PA: { flag: '🇵🇦', es: 'Panamá', en: 'Panama' },
    GT: { flag: '🇬🇹', es: 'Guatemala', en: 'Guatemala' }
  };
  if (map[code]) {
    return { flag: map[code].flag, name: lang === 'ES' ? map[code].es : map[code].en };
  }
  return { flag: '🌐', name: code };
};

export const RegionLanguageModal: React.FC = () => {
  const {
    isRegionModalOpen,
    setIsRegionModalOpen,
    currency,
    setCurrency,
    language,
    setLanguage,
    detectedCountry,
    isDetectingCountry,
    detectUserCountry
  } = useCart();

  if (!isRegionModalOpen) return null;

  const currentCountry = getCountryInfo(detectedCountry, language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#1e293b] text-white w-full max-w-md rounded-lg border border-slate-700 shadow-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black border border-blue-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-lg leading-tight">
                {language === 'ES' ? 'Región, Moneda e Idioma' : 'Region, Currency & Language'}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {language === 'ES' ? 'Selecciona tu preferencia' : 'Select your preference'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRegionModalOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* IP Detection Status Banner */}
          <div className="p-3 bg-[#0f172a] rounded-lg border border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentCountry.flag}</span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{language === 'ES' ? 'País detectado:' : 'Detected country:'}</span>
                  <span className="text-blue-400 font-black">{currentCountry.name}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ES' ? 'Detección automática por IP' : 'Automatic detection by IP'}
                </div>
              </div>
            </div>

            <button
              onClick={() => detectUserCountry(true)}
              disabled={isDetectingCountry}
              className="px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              title={language === 'ES' ? 'Volver a detectar país por IP' : 'Re-detect country by IP'}
            >
              <RefreshCw className={`w-3 h-3 ${isDetectingCountry ? 'animate-spin' : ''}`} />
              <span>{isDetectingCountry ? (language === 'ES' ? 'Detectando...' : 'Detecting...') : (language === 'ES' ? 'Auto-detectar' : 'Auto-detect')}</span>
            </button>
          </div>

          <p className="text-xs font-semibold text-slate-300">
            {language === 'ES' ? 'O elige tu configuración manual:' : 'Or choose manual setting:'}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {/* Option 1: Perú - Soles (S/) - Español */}
            <button
              onClick={() => {
                setCurrency('PEN');
                setLanguage('ES');
              }}
              className={`p-4 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                currency === 'PEN'
                  ? 'bg-slate-800 border-blue-500 text-white shadow-md ring-1 ring-blue-500'
                  : 'bg-[#0f172a] border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🇵🇪</span>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>Perú (PE)</span>
                    <span className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded font-bold border border-slate-600">
                      Español
                    </span>
                  </div>
                  <div className="text-xs text-blue-300 font-bold mt-0.5">Soles Peruanos (S/ PEN)</div>
                </div>
              </div>

              {currency === 'PEN' && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
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
              className={`p-4 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                currency === 'COP'
                  ? 'bg-slate-800 border-blue-500 text-white shadow-md ring-1 ring-blue-500'
                  : 'bg-[#0f172a] border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🇨🇴</span>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>Colombia (CO)</span>
                    <span className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded font-bold border border-slate-600">
                      Español
                    </span>
                  </div>
                  <div className="text-xs text-blue-300 font-bold mt-0.5">Pesos Colombianos ($ COP)</div>
                </div>
              </div>

              {currency === 'COP' && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
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
              className={`p-4 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                currency === 'MXN'
                  ? 'bg-slate-800 border-blue-500 text-white shadow-md ring-1 ring-blue-500'
                  : 'bg-[#0f172a] border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🇲🇽</span>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>México (MX)</span>
                    <span className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded font-bold border border-slate-600">
                      Español
                    </span>
                  </div>
                  <div className="text-xs text-blue-300 font-bold mt-0.5">Pesos Mexicanos ($ MXN)</div>
                </div>
              </div>

              {currency === 'MXN' && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            {/* Option 4: Sudamérica y Latinoamérica - Dólares ($ USD) - Español */}
            <button
              onClick={() => {
                setCurrency('USD', true, 'ES');
                setLanguage('ES');
              }}
              className={`p-4 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                currency === 'USD' && language === 'ES'
                  ? 'bg-slate-800 border-blue-500 text-white shadow-md ring-1 ring-blue-500'
                  : 'bg-[#0f172a] border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🌎</span>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>{language === 'ES' ? 'Sudamérica y Latinoamérica' : 'Latin America & South America'}</span>
                    <span className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded font-bold border border-slate-600">
                      Español
                    </span>
                  </div>
                  <div className="text-xs text-blue-300 font-bold mt-0.5">
                    {language === 'ES' ? 'Dólares Estadounidenses ($ USD)' : 'US Dollars ($ USD)'}
                  </div>
                </div>
              </div>

              {currency === 'USD' && language === 'ES' && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            {/* Option 5: USA / Global - Dólares ($) - English */}
            <button
              onClick={() => {
                setCurrency('USD', true, 'EN');
                setLanguage('EN');
              }}
              className={`p-4 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                currency === 'USD' && language === 'EN'
                  ? 'bg-slate-800 border-blue-500 text-white shadow-md ring-1 ring-blue-500'
                  : 'bg-[#0f172a] border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🇺🇸</span>
                <div>
                  <div className="font-black text-sm text-white flex items-center gap-2">
                    <span>{language === 'ES' ? 'Estados Unidos y Global' : 'United States & Global'}</span>
                    <span className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded font-bold border border-slate-600">
                      English
                    </span>
                  </div>
                  <div className="text-xs text-blue-300 font-bold mt-0.5">
                    {language === 'ES' ? 'Dólares Estadounidenses ($ USD)' : 'US Dollars ($ USD)'}
                  </div>
                </div>
              </div>

              {currency === 'USD' && language === 'EN' && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-end bg-[#0f172a]">
          <button
            onClick={() => setIsRegionModalOpen(false)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer border border-blue-500 shadow-sm"
          >
            {language === 'ES' ? 'Guardar' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
