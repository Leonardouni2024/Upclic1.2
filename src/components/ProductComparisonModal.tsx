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
  Star,
  FileText,
  Zap,
  Info
} from 'lucide-react';
import { Product, ProductCategory } from '../types.ts';
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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchPickerQuery, setSearchPickerQuery] = useState('');

  // Determine active category of currently selected products to prioritize similar products
  const primaryCategory = comparisonList.length > 0 ? comparisonList[0].category : 'combos';

  // Filter available products for adding to comparison, prioritizing similar products from same category
  const availableProducts = useMemo(() => {
    const selectedIds = new Set(comparisonList.map(p => p.id));
    return products.filter(p => {
      if (selectedIds.has(p.id)) return false;
      
      // Category filter
      if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
        return false;
      }

      // Search query
      if (searchPickerQuery.trim()) {
        const q = searchPickerQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [comparisonList, selectedCategoryFilter, searchPickerQuery]);

  // Specific similar products to recommend when user has 1 or 2 products
  const suggestedSimilarProducts = useMemo(() => {
    const selectedIds = new Set(comparisonList.map(p => p.id));
    if (comparisonList.length === 0) return [];
    
    // Find products in the same category first
    return products
      .filter(p => !selectedIds.has(p.id) && p.category === primaryCategory)
      .slice(0, 4);
  }, [comparisonList, primaryCategory]);

  if (!isComparisonModalOpen) return null;

  // Derive specs for side-by-side comparison
  const getProductSpecs = (product: Product) => {
    const name = getProductName(product);
    const description = getProductDesc(product);
    const duration = getDurationLabel(product.duration);
    const compatibility = getProductCompatibility(product);
    const features = getProductFeatures(product);
    
    // Cloud storage detection
    let cloud = product.cloudStorage || (features.find(f => f.toLowerCase().includes('onedrive') || f.toLowerCase().includes('cloud') || f.toLowerCase().includes('nube')) || (language === 'ES' ? 'No aplicable' : 'Not applicable'));

    // Included apps detection
    let apps = features.filter(f => 
      f.toLowerCase().includes('word') || 
      f.toLowerCase().includes('excel') || 
      f.toLowerCase().includes('powerpoint') || 
      f.toLowerCase().includes('access') ||
      f.toLowerCase().includes('antivirus') ||
      f.toLowerCase().includes('defender') ||
      f.toLowerCase().includes('visio') ||
      f.toLowerCase().includes('project') ||
      f.toLowerCase().includes('windows 1') ||
      f.toLowerCase().includes('office 20')
    ).join(', ');
    if (!apps) apps = features.slice(0, 2).join(' • ');

    // License format
    let licenseType = 'Digital Key (Activación Oficial)';
    if (product.variants && product.variants.length > 0) {
      licenseType = product.variants.map(v => v.name).join(' / ');
    } else if (product.category === 'combos') {
      licenseType = language === 'ES' ? 'Combo Digital Multilicencia Permanente' : 'Permanent Multi-license Digital Combo';
    } else if (product.category === 'windows') {
      licenseType = language === 'ES' ? 'Clave Digital OEM / Retail ESD' : 'OEM / Retail ESD Digital Key';
    } else if (product.category === 'office') {
      licenseType = language === 'ES' ? 'Licencia Digital Oficial Permanente' : 'Official Permanent Digital License';
    }

    // Devices
    let devices = language === 'ES' ? '1 Equipo / Dispositivo' : '1 Device / PC';
    if (product.name.toLowerCase().includes('3 pc') || product.duration.toLowerCase().includes('3 pc')) {
      devices = language === 'ES' ? '3 PCs (Multiusuario)' : '3 PCs (Multi-device)';
    } else if (product.name.toLowerCase().includes('5 disp') || product.name.toLowerCase().includes('familia') || (product.category === 'office' && product.slug.includes('365-familia'))) {
      devices = language === 'ES' ? 'Hasta 5 Dispositivos' : 'Up to 5 Devices';
    }

    return {
      product,
      name,
      description,
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
        className="bg-[#0f172a] border border-slate-700 w-full max-w-6xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0f172a] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-inner">
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
                {language === 'ES' 
                  ? 'Compara especificaciones técnicas, funciones y precios de productos similares lado a lado' 
                  : 'Compare technical specs, features and prices of similar products side by side'}
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
                  ? 'Haz clic en "Comparar" en cualquier producto del catálogo para ver sus características y contrastar con productos similares.'
                  : 'Click "Compare" on any product card to analyze specifications and compare with similar software.'}
              </p>
              <button
                onClick={() => setIsComparisonModalOpen(false)}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {language === 'ES' ? 'Explorar catálogo de licencias' : 'Explore catalog'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[620px]">
                {/* Product Columns Grid */}
                <div className={`grid gap-4 items-stretch ${
                  comparisonList.length === 1 ? 'grid-cols-2' :
                  comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'
                }`}>
                  {comparisonList.map((product, idx) => {
                    const specs = specsList[idx];
                    return (
                      <div 
                        key={product.id}
                        className="bg-slate-800/90 rounded-xl border border-slate-700 p-4 sm:p-5 flex flex-col relative shadow-md"
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
                        <div className="mb-2">
                          <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                            {specs.badge || (product.category === 'combos' ? 'COMBO' : product.category.toUpperCase())}
                          </span>
                        </div>

                        {/* Product Image */}
                        <div 
                          className="w-full h-32 bg-slate-900 rounded-lg p-2 mb-3 flex items-center justify-center cursor-pointer group border border-slate-700/50"
                          onClick={() => {
                            setIsComparisonModalOpen(false);
                            navigateToProduct(product.slug);
                          }}
                        >
                          <img 
                            src={product.imageUrl} 
                            alt={specs.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-sm"
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
                        <div className="mb-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-white tracking-tight">
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

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-slate-700/60">
                          <button
                            type="button"
                            onClick={() => {
                              addItem(product, 1);
                              setIsComparisonModalOpen(false);
                            }}
                            className="py-2 px-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-600 active:scale-95"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-slate-300" />
                            <span className="truncate">{t('addToCart')}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              addItem(product, 1);
                              setIsComparisonModalOpen(false);
                              navigateToCheckout();
                            }}
                            className="py-2 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm active:scale-95"
                          >
                            <span className="truncate">{language === 'ES' ? 'Comprar' : 'Buy'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty Slot / Product Selector */}
                  {comparisonList.length < 3 && (
                    <div className="bg-slate-800/40 border-2 border-dashed border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col justify-between text-center relative">
                      <div>
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-2 border border-blue-500/30">
                          <Plus className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-white mb-1">
                          {language === 'ES' ? 'Comparar con producto similar' : 'Compare with similar product'}
                        </h4>
                        <p className="text-[11px] text-slate-400 mb-3">
                          {language === 'ES' 
                            ? 'Selecciona otra licencia similar para contrastar características' 
                            : 'Select another similar license to compare side-by-side'}
                        </p>

                        {/* Search Input */}
                        <div className="relative mb-2">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder={language === 'ES' ? 'Buscar licencia...' : 'Search license...'}
                            value={searchPickerQuery}
                            onChange={(e) => setSearchPickerQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Category Selector Tabs inside Picker */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mb-2 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryFilter('all')}
                            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                              selectedCategoryFilter === 'all' 
                                ? 'bg-blue-600 text-white font-bold' 
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {language === 'ES' ? 'Todos' : 'All'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryFilter(primaryCategory)}
                            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                              selectedCategoryFilter === primaryCategory 
                                ? 'bg-blue-600 text-white font-bold' 
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {primaryCategory.toUpperCase()}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryFilter('combos')}
                            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                              selectedCategoryFilter === 'combos' 
                                ? 'bg-blue-600 text-white font-bold' 
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            COMBOS
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryFilter('office')}
                            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                              selectedCategoryFilter === 'office' 
                                ? 'bg-blue-600 text-white font-bold' 
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            OFFICE
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryFilter('windows')}
                            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                              selectedCategoryFilter === 'windows' 
                                ? 'bg-blue-600 text-white font-bold' 
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            WINDOWS
                          </button>
                        </div>
                      </div>

                      {/* Quick Pick List */}
                      <div className="max-h-48 overflow-y-auto divide-y divide-slate-800 rounded-lg bg-slate-900 border border-slate-700 text-left">
                        {availableProducts.length > 0 ? (
                          availableProducts.slice(0, 8).map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                addToComparison(p);
                                setSearchPickerQuery('');
                              }}
                              className="w-full px-2.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-between gap-2 transition-colors cursor-pointer"
                            >
                              <span className="truncate">{getProductName(p)}</span>
                              <span className="font-bold text-blue-400 shrink-0">{formatPrice(p.price)}</span>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-[11px] text-slate-500 text-center">
                            {language === 'ES' ? 'No se encontraron más productos en esta categoría.' : 'No other products found.'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* SUGGESTED SIMILAR PRODUCTS ROW IF ONLY 1 PRODUCT SELECTED */}
                {comparisonList.length === 1 && suggestedSimilarProducts.length > 0 && (
                  <div className="mt-4 p-3.5 bg-blue-950/40 border border-blue-800/40 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'ES' ? 'Productos similares recomendados para comparar:' : 'Recommended similar products to compare:'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSimilarProducts.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addToComparison(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3 h-3 text-blue-400 group-hover:text-white" />
                          <span>{getProductName(p)}</span>
                          <span className="text-amber-300 font-bold ml-1">({formatPrice(p.price)})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* MATRIX SECTION 1: EXACT DESCRIPTIONS */}
                <div className="mt-6 rounded-xl bg-slate-800/60 border border-slate-700/80 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-800 text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-2 border-b border-slate-700">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>{language === 'ES' ? 'Descripción Oficial del Producto' : 'Official Product Description'}</span>
                  </div>

                  <div className={`grid ${comparisonList.length === 1 ? 'grid-cols-2' : comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'} p-4 gap-4 text-xs`}>
                    {specsList.map((s, idx) => (
                      <div key={idx} className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/60 flex flex-col">
                        <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Info className="w-3 h-3 text-blue-400" />
                          <span>{s.name}</span>
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-normal">
                          {s.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MATRIX SECTION 2: GENERAL SPECIFICATIONS */}
                <div className="mt-6 rounded-xl bg-slate-800/60 border border-slate-700/80 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-800 text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-2 border-b border-slate-700">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>{t('compareSpecs')}</span>
                  </div>

                  <div className="divide-y divide-slate-700/60 text-xs">
                    {/* Row: Duración / Validez */}
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

                    {/* Row: Compatibilidad */}
                    <div className={`grid ${comparisonList.length === 1 ? 'grid-cols-2' : comparisonList.length === 2 ? 'grid-cols-3' : 'grid-cols-3'} p-3.5 items-center ${
                      highlightDiffs && hasDiff(s => s.compatibility) ? 'bg-amber-400/10' : ''
                    }`}>
                      {specsList.map((s, idx) => (
                        <div key={idx} className="px-2">
                          <span className="text-slate-400 block text-[11px] font-bold uppercase mb-0.5">{t('compareCompatibility')}</span>
                          <span className="font-semibold text-slate-200 text-xs leading-relaxed">{s.compatibility}</span>
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
                  </div>
                </div>

                {/* MATRIX SECTION 3: FEATURES & INCLUDED APPS */}
                <div className="mt-6 rounded-xl bg-slate-800/60 border border-slate-700/80 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-800 text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2 border-b border-slate-700">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{t('compareFeatures')}</span>
                  </div>

                  <div className="divide-y divide-slate-700/60 text-xs">
                    {/* Features list by product */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/40">
                      {specsList.map((s, idx) => (
                        <div key={idx} className="space-y-2 bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
                          <span className="text-[11px] font-black uppercase text-blue-300 block mb-1">
                            {s.name}
                          </span>
                          <ul className="space-y-2">
                            {s.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-200">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* MATRIX SECTION 4: WARRANTY & DELIVERY */}
                <div className="mt-6 rounded-xl bg-slate-800/60 border border-slate-700/80 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-800 text-xs font-black uppercase tracking-wider text-yellow-300 flex items-center gap-2 border-b border-slate-700">
                    <ShieldCheck className="w-4 h-4 text-yellow-400" />
                    <span>{t('compareSupport')}</span>
                  </div>

                  <div className="divide-y divide-slate-700/60 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4">
                      {specsList.map((s, idx) => (
                        <div key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 space-y-2">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-xs font-semibold text-white">
                              {language === 'ES' ? 'Activación 100% oficial de Microsoft' : '100% Genuine Microsoft activation'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="text-xs font-semibold text-white">
                              {language === 'ES' ? 'Entrega en 10 a 30 min por correo' : 'Delivery in 10 to 30 min via email'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                            <span className="text-xs font-semibold text-white">
                              {language === 'ES' ? 'Garantía permanente y soporte 24/7' : 'Lifetime warranty & 24/7 support'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a] flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-30">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ES' 
                ? 'Todas las licencias cuentan con activación digital inmediata y garantía oficial de por vida.'
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
