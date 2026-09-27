import React, { useState, useMemo } from 'react';
import { 
  X, 
  Check, 
  Minus, 
  Sparkles, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Scale, 
  Layers, 
  ShieldCheck, 
  Clock, 
  HardDrive, 
  Laptop, 
  Plus, 
  Search,
  Star
} from 'lucide-react';
import { Product } from '../types.ts';
import { products } from '../products.ts';
import { useCart } from '../context/CartContext.tsx';

export const ProductComparisonModal: React.FC = () => {
  const {
    comparisonList,
    removeFromComparison,
    clearComparison,
    addToComparison,
    isComparisonModalOpen,
    setIsComparisonModalOpen,
    addItem,
    navigateToCheckout,
    navigateToProduct,
    formatPrice,
    t,
    language,
    getProductName,
    getProductDesc,
    getProductFeatures,
    getProductCompatibility,
    getDurationLabel,
    getBadgeLabel
  } = useCart();

  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [productPickerSlot, setProductPickerSlot] = useState<number | null>(null);
  const [searchPickerQuery, setSearchPickerQuery] = useState('');

  if (!isComparisonModalOpen) return null;

  // Filter available products for adding to comparison
  const availableProducts = useMemo(() => {
    const selectedIds = new Set(comparisonList.map(p => p.id));
    return products.filter(p => !selectedIds.has(p.id) && (
      !searchPickerQuery.trim() ||
      p.name.toLowerCase().includes(searchPickerQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchPickerQuery.toLowerCase())
    ));
  }, [comparisonList, searchPickerQuery]);

  // Derive specs for side-by-side comparison
  const getProductSpecs = (product: Product) => {
    const name = getProductName(product);
    const duration = getDurationLabel(product.duration);
    const compatibility = getProductCompatibility(product);
    const features = getProductFeatures(product);
    
    // Cloud storage detection
    let cloud = product.cloudStorage || (features.find(f => f.toLowerCase().includes('onedrive') || f.toLowerCase().includes('cloud') || f.toLowerCase().includes('nube')) || 'No aplicable');
    if (language === 'EN' && cloud.includes('No aplicable')) cloud = 'Not applicable';

    // Included apps detection
    let apps = features.filter(f => 
      f.toLowerCase().includes('word') || 
      f.toLowerCase().includes('excel') || 
      f.toLowerCase().includes('powerpoint') || 
      f.toLowerCase().includes('access') ||
      f.toLowerCase().includes('antivirus') ||
      f.toLowerCase().includes('defender') ||
      f.toLowerCase().includes('visio') ||
      f.toLowerCase().includes('project')
    ).join(', ');
    if (!apps) apps = features.slice(0, 2).join(' • ');

    // License format
    let licenseType = 'Digital Key (Activación Oficial)';
    if (product.variants && product.variants.length > 0) {
      licenseType = product.variants.map(v => v.name).join(' / ');
    } else if (product.category === 'windows') {
      licenseType = 'Clave Digital OEM / Retail ESD';
    } else if (product.category === 'office') {
      licenseType = 'Licencia Digital Oficial Permanente';
    }
    if (language === 'EN') {
      if (licenseType.includes('OEM / Retail')) licenseType = 'OEM / Retail ESD Digital Key';
      else if (licenseType.includes('Oficial Permanente')) licenseType = 'Official Permanent Digital License';
      else licenseType = 'Official Digital Activation Key';
    }

    // Devices
    let devices = '1 Equipo / Dispositivo';
    if (product.name.toLowerCase().includes('3 pc') || product.duration.toLowerCase().includes('3 pc')) {
      devices = language === 'ES' ? '3 PCs (Multiusuario)' : '3 PCs (Multi-device)';
    } else if (product.name.toLowerCase().includes('5 disp') || product.name.toLowerCase().includes('familia') || product.category === 'office' && product.slug.includes('365-familia')) {
      devices = language === 'ES' ? 'Hasta 5 Dispositivos' : 'Up to 5 Devices';
    } else {
      devices = language === 'ES' ? '1 PC / Dispositivo' : '1 PC / Device';
    }

    return {
      name,
      price: formatPrice(product.price),
      rawPrice: product.price,
      oldPrice: product.oldPrice ? formatPrice(product.oldPrice) : null,
      duration,
      compatibility,
      cloud,
      apps,
      licenseType,
      devices,
      features,
      badge: getBadgeLabel(product.badge) || (product.bestSeller ? (language === 'ES' ? 'MÁS VENDIDO' : 'BEST SELLER') : undefined)
    };
  };

  const specsList = comparisonList.map(getProductSpecs);

  // Helper to check if a specific row has differences across products
  const hasDiff = (keyGetter: (s: ReturnType<typeof getProductSpecs>) => string | number) => {
    if (specsList.length <= 1) return false;
    const first = keyGetter(specsList[0]);
    return specsList.some(s => keyGetter(s) !== first);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsComparisonModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-6xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {t('compareTitle')}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {comparisonList.length}/3 {t('compareSelectedCount')}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t('compareSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {comparisonList.length >= 2 && (
              <button
                type="button"
                onClick={() => setHighlightDiffs(!highlightDiffs)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  highlightDiffs 
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('compareHighlightDiff')}</span>
              </button>
            )}

            {comparisonList.length > 0 && (
              <button
                type="button"
                onClick={clearComparison}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                title={t('compareClear')}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t('compareClear')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsComparisonModalOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={t('compareClose')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {comparisonList.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <Scale className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('compareEmpty')}</h3>
              <p className="text-xs text-slate-400 mb-6">
                {language === 'ES'
                  ? 'Navega por el catálogo y haz clic en "Comparar" en las tarjetas de producto para contrastar sus características técnicas lado a lado.'
                  : 'Browse the catalog and click "Compare" on any product card to analyze specifications side by side.'}
              </p>
              <button
                onClick={() => {
                  setIsComparisonModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {language === 'ES' ? 'Explorar catálogo de licencias' : 'Explore catalog'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[620px]">
                {/* Product Column Headers Grid (up to 3 + optional Add Slot) */}
                <div className={`grid gap-4 items-start ${
                  comparisonList.length === 1 ? 'grid-cols-2' :
                  comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'
                }`}>
                  {comparisonList.map((product, idx) => {
                    const specs = specsList[idx];
                    return (
                      <div 
                        key={product.id}
                        className="bg-slate-800/80 rounded-xl border border-slate-700 p-4 flex flex-col relative shadow-md"
                      >
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeFromComparison(product.id)}
                          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-md bg-slate-700/60 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-colors cursor-pointer text-xs"
                          title={t('compareRemove')}
                          aria-label={t('compareRemove')}
                        >
                          ✕
                        </button>

                        {/* Badge */}
                        {specs.badge && (
                          <div className="mb-2">
                            <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                              {specs.badge}
                            </span>
                          </div>
                        )}

                        {/* Product Image */}
                        <div 
                          className="w-full h-32 bg-slate-900 rounded-lg p-2 mb-3 flex items-center justify-center cursor-pointer group"
                          onClick={() => {
                            setIsComparisonModalOpen(false);
                            navigateToProduct(product.slug);
                          }}
                        >
                          <img 
                            src={product.imageUrl} 
                            alt={specs.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              e.currentTarget.src = product.fallbackImage;
                            }}
                          />
                        </div>

                        {/* Title */}
                        <h4 
                          className="font-black text-sm text-white line-clamp-2 hover:text-blue-400 transition-colors cursor-pointer mb-2 min-h-[2.5rem]"
                          onClick={() => {
                            setIsComparisonModalOpen(false);
                            navigateToProduct(product.slug);
                          }}
                          title={specs.name}
                        >
                          {specs.name}
                        </h4>

                        {/* Price Row */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-white">
                              {specs.price}
                            </span>
                            {specs.oldPrice && (
                              <span className="text-xs text-slate-500 line-through">
                                {specs.oldPrice}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="font-bold text-slate-200">{product.rating}</span>
                            <span className="text-slate-500 text-[11px]">({product.reviews})</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 mt-auto">
                          <button
                            type="button"
                            onClick={() => {
                              addItem(product, 1);
                              setIsComparisonModalOpen(false);
                            }}
                            className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{t('addToCart')}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              addItem(product, 1);
                              setIsComparisonModalOpen(false);
                              navigateToCheckout();
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>{language === 'ES' ? 'Comprar ahora' : 'Buy now'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Product Slot if < 3 */}
                  {comparisonList.length < 3 && (
                    <div className="bg-slate-800/40 border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[300px] relative">
                      <div className="w-12 h-12 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center mb-3 border border-slate-700">
                        <Plus className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm text-white mb-1">
                        {t('compareSelectProduct')}
                      </h4>
                      <p className="text-xs text-slate-400 mb-4 max-w-[200px]">
                        {language === 'ES' 
                          ? 'Elige otro producto para comparar funciones y precios.' 
                          : 'Choose another license to compare specs and prices.'}
                      </p>

                      <div className="w-full relative">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder={language === 'ES' ? 'Buscar producto...' : 'Search product...'}
                            value={searchPickerQuery}
                            onChange={(e) => setSearchPickerQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Quick pick list */}
                        <div className="mt-2 max-h-40 overflow-y-auto divide-y divide-slate-800 rounded-lg bg-slate-900 border border-slate-700 text-left">
                          {availableProducts.slice(0, 6).map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                addToComparison(p);
                                setSearchPickerQuery('');
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-between gap-2 transition-colors cursor-pointer"
                            >
                              <span className="truncate">{getProductName(p)}</span>
                              <span className="font-bold text-blue-400 shrink-0">{formatPrice(p.price)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SPECIFICATION COMPARISON MATRIX */}
                <div className="mt-8 space-y-6">
                  {/* Section 1: General Specs */}
                  <div className="rounded-xl bg-slate-800/60 border border-slate-700/80 overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-800 text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-2 border-b border-slate-700">
                      <Layers className="w-4 h-4" />
                      <span>{t('compareSpecs')}</span>
                    </div>

                    <div className="divide-y divide-slate-700/60 text-xs">
                      {/* Row: Duración */}
                      <div className={`grid ${comparisonList.length === 1 ? 'grid-cols-2' : comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'} p-3.5 items-center ${
                        highlightDiffs && hasDiff(s => s.duration) ? 'bg-amber-400/10' : ''
                      }`}>
                        {specsList.map((s, idx) => (
                          <div key={idx} className="px-2">
                            <span className="text-slate-400 block text-[11px] font-bold uppercase mb-0.5">{t('compareDuration')}</span>
                            <span className="font-bold text-white text-xs">{s.duration}</span>
                          </div>
                        ))}
                      </div>

                      {/* Row: Dispositivos */}
                      <div className={`grid ${comparisonList.length === 1 ? 'grid-cols-2' : comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'} p-3.5 items-center ${
                        highlightDiffs && hasDiff(s => s.devices) ? 'bg-amber-400/10' : ''
                      }`}>
                        {specsList.map((s, idx) => (
                          <div key={idx} className="px-2">
                            <span className="text-slate-400 block text-[11px] font-bold uppercase mb-0.5">{t('compareDevices')}</span>
                            <span className="font-bold text-white text-xs">{s.devices}</span>
                          </div>
                        ))}
                      </div>

                      {/* Row: Compatibilidad */}
                      <div className={`grid ${comparisonList.length === 1 ? 'grid-cols-2' : comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'} p-3.5 items-center ${
                        highlightDiffs && hasDiff(s => s.compatibility) ? 'bg-amber-400/10' : ''
                      }`}>
                        {specsList.map((s, idx) => (
                          <div key={idx} className="px-2">
                            <span className="text-slate-400 block text-[11px] font-bold uppercase mb-0.5">{t('compareCompatibility')}</span>
                            <span className="font-medium text-slate-200 text-xs leading-relaxed">{s.compatibility}</span>
                          </div>
                        ))}
                      </div>

                      {/* Row: Tipo de Licencia */}
                      <div className={`grid ${comparisonList.length === 1 ? 'grid-cols-2' : comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'} p-3.5 items-center ${
                        highlightDiffs && hasDiff(s => s.licenseType) ? 'bg-amber-400/10' : ''
                      }`}>
                        {specsList.map((s, idx) => (
                          <div key={idx} className="px-2">
                            <span className="text-slate-400 block text-[11px] font-bold uppercase mb-0.5">{t('compareLicenseType')}</span>
                            <span className="font-semibold text-slate-300 text-xs">{s.licenseType}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Features & Applications */}
                  <div className="rounded-xl bg-slate-800/60 border border-slate-700/80 overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-800 text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2 border-b border-slate-700">
                      <Sparkles className="w-4 h-4" />
                      <span>{t('compareFeatures')}</span>
                    </div>

                    <div className="divide-y divide-slate-700/60 text-xs">
                      {/* Row: Cloud Storage */}
                      <div className={`grid ${comparisonList.length === 1 ? 'grid-cols-2' : comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'} p-3.5 items-center ${
                        highlightDiffs && hasDiff(s => s.cloud) ? 'bg-amber-400/10' : ''
                      }`}>
                        {specsList.map((s, idx) => (
                          <div key={idx} className="px-2">
                            <span className="text-slate-400 block text-[11px] font-bold uppercase mb-0.5">{t('compareCloudStorage')}</span>
                            <span className="font-bold text-white text-xs">{s.cloud}</span>
                          </div>
                        ))}
                      </div>

                      {/* Row: Software & Apps */}
                      <div className={`grid ${comparisonList.length === 1 ? 'grid-cols-2' : comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'} p-3.5 items-center ${
                        highlightDiffs && hasDiff(s => s.apps) ? 'bg-amber-400/10' : ''
                      }`}>
                        {specsList.map((s, idx) => (
                          <div key={idx} className="px-2">
                            <span className="text-slate-400 block text-[11px] font-bold uppercase mb-0.5">{t('compareApps')}</span>
                            <span className="font-medium text-slate-200 text-xs leading-relaxed">{s.apps}</span>
                          </div>
                        ))}
                      </div>

                      {/* Row: Full Feature Bullet Points */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/40">
                        {specsList.map((s, idx) => (
                          <div key={idx} className="space-y-2 bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                            <span className="text-[11px] font-black uppercase text-slate-400 block mb-1">
                              {language === 'ES' ? 'Funciones incluidas:' : 'Included features:'}
                            </span>
                            <ul className="space-y-1.5">
                              {s.features.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-1.5 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Activation & Warranty */}
                  <div className="rounded-xl bg-slate-800/60 border border-slate-700/80 overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-800 text-xs font-black uppercase tracking-wider text-yellow-300 flex items-center gap-2 border-b border-slate-700">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t('compareSupport')}</span>
                    </div>

                    <div className="divide-y divide-slate-700/60 text-xs">
                      {/* Row: Activation Method */}
                      <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 gap-3">
                        {specsList.map((_, idx) => (
                          <div key={idx} className="px-2 flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div>
                              <span className="text-slate-400 block text-[11px] font-bold uppercase">{t('compareActivation')}</span>
                              <span className="font-bold text-white text-xs">
                                {language === 'ES' ? 'Canje en sitio web oficial del fabricante' : 'Redeem on official manufacturer website'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Row: Guarantee */}
                      <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 gap-3">
                        {specsList.map((_, idx) => (
                          <div key={idx} className="px-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                            <div>
                              <span className="text-slate-400 block text-[11px] font-bold uppercase">{t('compareGuarantee')}</span>
                              <span className="font-bold text-white text-xs">
                                {language === 'ES' ? '100% Oficial con garantía permanente UpClic' : '100% Genuine with UpClic Warranty'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Row: Technical Support */}
                      <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 gap-3">
                        {specsList.map((_, idx) => (
                          <div key={idx} className="px-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <span className="text-slate-400 block text-[11px] font-bold uppercase">{t('compareTechnicalSupport')}</span>
                              <span className="font-bold text-white text-xs">
                                {language === 'ES' ? 'Soporte personalizado 24/7 vía WhatsApp y Correo' : '24/7 Specialized Support via WhatsApp & Email'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with quick actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ES' 
                ? 'Todas las licencias cuentan con activación digital inmediata y garantía de por vida.'
                : 'All licenses include instant digital activation and lifetime warranty.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsComparisonModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {t('gotItClose')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
