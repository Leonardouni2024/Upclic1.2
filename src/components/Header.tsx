import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Package,
  RefreshCw,
  Tv,
  Layers,
  Monitor,
  Sparkles,
  Palette,
  Briefcase,
  Tag
} from 'lucide-react';
import { useCart, HelpSection } from '../context/CartContext';
import { ProductCategory, Product } from '../types';
import { WHATSAPP_NUMBER, searchProducts, getCategoryLabel } from '../products';
import { UpClicLogo } from './UpClicLogo';

const COUNTRIES = [
  { code: 'PE', name: 'Perú', currency: 'PEN', symbol: 'S/', flag: '🇵🇪', lang: 'ES' },
  { code: 'CO', name: 'Colombia', currency: 'COP', symbol: '$', flag: '🇨🇴', lang: 'ES' },
  { code: 'MX', name: 'México', currency: 'MXN', symbol: '$', flag: '🇲🇽', lang: 'ES' },
  { code: 'US', name: 'United States / Global', currency: 'USD', symbol: '$', flag: '🇺🇸', lang: 'EN' },
];

export const Header: React.FC = () => {
  const {
    cartTotals,
    setIsCartOpen,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedProduct,
    setActiveHelpSection,
    goToHome,
    setIsUserOrdersOpen,
    countryCode,
    selectCountry,
    currency,
    rates,
    ratesSource,
    refreshExchangeRates,
    language,
    formatPrice,
    catalogProducts
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const currentCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  const handleManualRateRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshingRates(true);
    await refreshExchangeRates();
    setTimeout(() => setIsRefreshingRates(false), 500);
  };

  const navCategories: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: language === 'EN' ? 'All Catalog' : 'Catálogo', icon: null },
    { id: 'streaming', label: 'Streaming', icon: <Tv className="w-3.5 h-3.5" /> },
    { id: 'office', label: 'Microsoft Office', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'windows', label: 'Windows', icon: <Monitor className="w-3.5 h-3.5" /> },
    {
      id: 'ia',
      label: 'Inteligencia Artificial',
      icon: (
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/068/082/380/small/artificial-intelligence-design-png.png"
          alt="IA"
          className="w-4 h-4 object-contain"
        />
      )
    },
    { id: 'diseno', label: 'Diseño y Edición', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'profesional', label: 'Software Profesional', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'offers', label: 'Ofertas', icon: <Tag className="w-3.5 h-3.5" /> },
  ];

  const handleCategorySelect = (catId: ProductCategory) => {
    setSelectedCategory(catId);
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleHelpClick = (sec: HelpSection) => {
    setActiveHelpSection(sec);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults =
    searchQuery.trim().length > 0
      ? searchProducts(searchQuery, 'all', catalogProducts).slice(0, 6)
      : [];

  const handleSelectSearchResult = (product: Product) => {
    setSelectedProduct(product);
    setSearchFocused(false);
    setMobileMenuOpen(false);
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchFocused(false);
      setSelectedProduct(null);
      setTimeout(() => {
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex flex-col">
      {/* Main Brand Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Brand Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer shrink-0 group"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                goToHome();
              }}
            >
              <UpClicLogo size="md" />
            </div>

            {/* Search Bar (Desktop) */}
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchEnter}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder="Buscar Office 2024, Windows 11, Canva Pro, Gemini AI..."
                className="w-full pl-10 pr-9 py-2 bg-slate-100/90 border border-slate-200/90 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1668E3]/25 focus:border-[#1668E3] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Instant Live Search Results Dropdown */}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Resultados en catálogo
                        </span>
                        <span className="text-[11px] text-[#1668E3] font-semibold">
                          {searchProducts(searchQuery, 'all', catalogProducts).length} encontrados
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                        {searchResults.map(product => (
                          <button
                            key={product.id}
                            onClick={() => handleSelectSearchResult(product)}
                            className="w-full px-4 py-3 flex items-center gap-3.5 hover:bg-blue-50/50 transition-colors text-left group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/70 p-1 flex items-center justify-center shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (product.fallbackImage && target.src !== product.fallbackImage) {
                                    target.src = product.fallbackImage;
                                  }
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#1668E3] transition-colors">
                                {product.name}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {getCategoryLabel(product.category)} • {product.duration}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-black text-[#0B1F3A] block">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setSearchFocused(false);
                          setSelectedProduct(null);
                          document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#1668E3] flex items-center justify-center gap-1.5 border-t border-slate-200/80 transition-colors"
                      >
                        Ver todos los resultados para "{searchQuery}"
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 text-center">
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        No encontramos "{searchQuery}"
                      </p>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Prueba buscando: Office 2024, Windows 11, Canva Pro, Gemini AI, Project o Visio.
                      </p>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola UPCLIC, estoy buscando información sobre: ${searchQuery}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Consultar disponibilidad por WhatsApp →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Country & Currency Selector */}
              <div ref={countryDropdownRef} className="relative">
                <button
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
                  title="Moneda principal: Soles peruanos (S/)"
                >
                  <span className="text-base leading-none">{currentCountry.flag}</span>
                  <span className="hidden sm:inline">{currentCountry.currency}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {countryDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Moneda / País
                      </span>
                      <button
                        onClick={handleManualRateRefresh}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1668E3] hover:text-blue-700"
                      >
                        <RefreshCw className={`w-2.5 h-2.5 ${isRefreshingRates ? 'animate-spin' : ''}`} />
                        {ratesSource}
                      </button>
                    </div>
                    {COUNTRIES.map((c) => {
                      const isSelected = c.code === countryCode && c.currency === currency;
                      return (
                        <button
                          key={c.code}
                          onClick={() => {
                            selectCountry(c.code, true);
                            setCountryDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-blue-50/60 transition-colors ${
                            isSelected ? 'bg-blue-50/80 font-bold text-[#1668E3]' : 'text-slate-700 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{c.flag}</span>
                            <div>
                              <span className="block leading-tight">{c.name}</span>
                              <span className="text-[10px] text-slate-400">
                                {c.currency} ({c.symbol})
                              </span>
                            </div>
                          </div>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#1668E3]"></span>}
                        </button>
                      );
                    })}
                    <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/70 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Moneda base: Soles (S/)</span>
                      <span className="font-mono font-bold text-slate-700">
                        1 USD = S/ {rates.PEN.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* My Orders Button */}
              <button
                onClick={() => setIsUserOrdersOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-[#1668E3] hover:bg-blue-50/60 transition-colors cursor-pointer"
                title="Consultar estado de mi pedido"
              >
                <Package className="w-4 h-4 text-[#1668E3]" />
                <span className="hidden lg:inline">Mis Pedidos</span>
              </button>

              {/* Cart Button (Orange CTA highlight when items present) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  cartTotals.totalQuantity > 0
                    ? 'bg-[#E8440A] hover:bg-[#d83b01] text-white shadow-orange-600/20'
                    : 'bg-[#0B1F3A] hover:bg-[#1668E3] text-white'
                }`}
                aria-label="Abrir carrito de compras"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Carrito</span>
                {cartTotals.totalQuantity > 0 && (
                  <span className="px-1.5 py-0.5 text-[11px] font-extrabold bg-white text-[#0B1F3A] rounded-md leading-none">
                    {cartTotals.totalQuantity}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Menú principal"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop 6-Category Navigation Bar */}
          <nav className="hidden lg:flex items-center justify-between py-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {navCategories.map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1668E3] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onKeyDown={handleSearchEnter}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar software o suscripción..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1668E3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {navCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#1668E3] text-white'
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {cat.icon}
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => {
                  setIsUserOrdersOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-100 font-bold text-slate-800"
              >
                <Package className="w-4 h-4 text-[#1668E3]" />
                Mis Pedidos
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
