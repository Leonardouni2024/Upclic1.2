import { formatPrice } from '../products.ts';
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ProductCategory, Product } from '../types.ts';
import { searchProducts } from '../products.ts';
import { Search, Menu, X, Star, ArrowRight, Sparkles, Layers, ShoppingCart, User } from 'lucide-react';
import { UpClicLogo } from './UpClicLogo.tsx';

interface HeaderProps { onOpenUserOrders?: () => void; setIsCartOpen?: (open: boolean) => void; setIsHelpModalOpen?: (open: boolean) => void; }

export const Header: React.FC<HeaderProps> = ({ onOpenUserOrders }) => {
  const {
    totalQuantity,
    setIsCartOpen, activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    navigateToProduct,
    navigateToHome,
    currentPath
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Live matching products using the prefix/token search engine
  const liveResults: Product[] = searchQuery.trim() ? searchProducts(searchQuery).slice(0, 5) : [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (slug: string) => {
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
    navigateToProduct(slug);
  };

  const handleCategoryClick = (category: ProductCategory) => {
    setActiveCategory(category);
    if (currentPath !== '/') {
      navigateToHome();
    }
    setMobileMenuOpen(false);
    // Smooth scroll to catalog if already on home
    const catalogEl = document.getElementById('catalogo-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTopClick = () => {
    if (currentPath !== '/') {
      navigateToHome();
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('top-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setActiveCategory('top');
      }
    }, 100);
  };

  const handleBestSellersClick = () => {
    if (currentPath !== '/') {
      navigateToHome();
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('mas-vendidos-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setActiveCategory('bestsellers');
      }
    }, 100);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 text-white shadow-lg transition-all font-sans">
      {/* Top Header Row - Eneba Purple */}
      <div className="bg-[#3e1781] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Mobile menu toggle button */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo Eneba style */}
            <div className="flex items-center shrink-0">
              <button
                id="logo-btn"
                onClick={navigateToHome}
                className="flex items-center group text-left cursor-pointer focus:outline-none hover:opacity-95 transition-opacity shrink-0"
                aria-label="UpClic - Inicio"
              >
                <UpClicLogo size="md" variant="full" theme="dark" />
              </button>
            </div>

            {/* Central Search Bar (Eneba style box) */}
            <div ref={searchContainerRef} className="flex-1 max-w-2xl relative hidden sm:block">
              <div className="relative">
                <input
                  id="search-input-desktop"
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                    if (currentPath !== '/') navigateToHome();
                  }}
                  placeholder="Busca licencias, software, office, windows..."
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium rounded-lg bg-[#2b0c61] hover:bg-[#320f70] focus:bg-[#230852] border border-[#642bbd] focus:border-[#facc15] text-white placeholder-purple-200/60 focus:outline-none transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-purple-300 absolute left-3.5 top-3 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="absolute right-3 top-2.5 text-purple-300 hover:text-white text-xs p-1 rounded cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Live Search Autocomplete Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 bg-purple-950 text-white flex items-center justify-between text-xs font-bold">
                    <span>Resultados de búsqueda para "{searchQuery}"</span>
                    <span className="text-[#facc15]">{liveResults.length} encontrados</span>
                  </div>

                  {liveResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">No se encontraron licencias con ese término</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Sugerencias: <span className="font-semibold text-purple-700">Windows 11, Office 2024, Combo, Visio</span>
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {liveResults.map(prod => (
                        <button
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod.slug)}
                          className="w-full text-left p-3 hover:bg-purple-50/80 transition-colors flex items-center gap-3 group cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              onError={(e) => { e.currentTarget.src = prod.fallbackImage; }}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-slate-900 group-hover:text-purple-700 truncate transition-colors">
                              {prod.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                              <span className="bg-purple-100 text-purple-900 font-bold px-1.5 py-0.5 rounded">
                                {prod.category === 'combos' ? 'Combo' : prod.category.toUpperCase()}
                              </span>
                              <span>•</span>
                              <span>{prod.duration}</span>
                              <span className="flex items-center gap-0.5 text-amber-500 ml-auto font-bold">
                                <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                                {prod.rating}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-black text-xs text-slate-900 tabular-nums">
                              {formatPrice(prod.price)}
                            </div>
                            {prod.oldPrice && (
                              <div className="text-[10px] text-slate-400 line-through tabular-nums">
                                {formatPrice(prod.oldPrice)}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}

                      <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsSearchFocused(false);
                            const catalogEl = document.getElementById('catalogo-section');
                            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-xs font-bold text-purple-700 hover:underline flex items-center justify-center gap-1 w-full cursor-pointer py-1"
                        >
                          <span>Ver todos los productos en catálogo</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Controls (Eneba Style: Language/Currency | Cart | Account) */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Language / Currency Tag (Eneba Style) */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b0c61] text-purple-200 text-xs font-semibold border border-[#5923aa]/60">
                <span className="text-base leading-none">🇵🇪</span>
                <span>Español | S/</span>
              </div>

              {/* Mobile Search Icon Toggle */}
              <button
                id="search-toggle-mobile"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="sm:hidden p-2 rounded-lg text-purple-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Buscar productos"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Button - Eneba Signature Yellow Icon */}
              <button
                id="cart-header-btn"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center p-2.5 sm:px-3.5 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 border border-white/20 shrink-0"
                aria-label={`Ver carrito: ${totalQuantity} productos`}
                title={`Carrito: ${totalQuantity} productos`}
              >
                <ShoppingCart className="w-5 h-5 text-[#facc15]" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#facc15] text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {totalQuantity}
                  </span>
                )}
              </button>

              {/* User Account / Orders Button (Eneba Style) */}
              <button
                onClick={() => onOpenUserOrders && onOpenUserOrders()}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer border border-white/15 shrink-0"
                title="Mis Pedidos"
              >
                <User className="w-4 h-4 text-purple-200" />
                <span className="hidden md:inline">Mis Pedidos</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Second Navigation Bar - Eneba Category Bar */}
      <div className="bg-[#2a0b5c] border-b border-white/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2 no-scrollbar text-xs sm:text-sm font-bold">
          {/* Categorías Button */}
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-3.5 py-1.5 rounded-md flex items-center gap-2 cursor-pointer shrink-0 transition-all ${
              activeCategory === 'all' && currentPath === '/'
                ? 'bg-[#facc15] text-slate-950 font-black'
                : 'bg-[#1e0742] hover:bg-[#320f6d] text-white border border-white/15'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>Categorías</span>
          </button>

          {/* Category Chips */}
          <button
            onClick={() => handleCategoryClick('windows')}
            className={`px-3 py-1.5 rounded-md cursor-pointer shrink-0 transition-all ${
              activeCategory === 'windows'
                ? 'bg-white/20 text-white font-extrabold border border-white/30'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Windows
          </button>

          <button
            onClick={() => handleCategoryClick('office')}
            className={`px-3 py-1.5 rounded-md cursor-pointer shrink-0 transition-all ${
              activeCategory === 'office'
                ? 'bg-white/20 text-white font-extrabold border border-white/30'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Office
          </button>

          <button
            onClick={() => handleCategoryClick('combos')}
            className={`px-3 py-1.5 rounded-md cursor-pointer shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'combos'
                ? 'bg-[#facc15] text-slate-950 font-black'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Combos</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
              OFERTA
            </span>
          </button>

          <button
            onClick={() => handleCategoryClick('project-visio')}
            className={`px-3 py-1.5 rounded-md cursor-pointer shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'project-visio'
                ? 'bg-white/20 text-white font-extrabold border border-white/30'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Project & Visio</span>
          </button>

          <button
            onClick={handleTopClick}
            className={`px-3 py-1.5 rounded-md cursor-pointer shrink-0 transition-all ${
              activeCategory === 'top'
                ? 'bg-white/20 text-white font-extrabold border border-white/30'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Top Licencias
          </button>

          <button
            onClick={handleBestSellersClick}
            className={`px-3 py-1.5 rounded-md cursor-pointer shrink-0 transition-all ${
              activeCategory === 'bestsellers'
                ? 'bg-white/20 text-white font-extrabold border border-white/30'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Más vendidos
          </button>

          <button
            onClick={() => handleCategoryClick('offers')}
            className={`px-3 py-1.5 rounded-md cursor-pointer shrink-0 transition-all ${
              activeCategory === 'offers'
                ? 'bg-white/20 text-white font-extrabold border border-white/30'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Ofertas
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Drawer */}
      {mobileSearchOpen && (
        <div ref={mobileSearchRef} className="sm:hidden bg-[#2d0c63] p-3 border-b border-white/10">
          <div className="relative">
            <input
              id="search-input-mobile"
              type="text"
              autoFocus
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (currentPath !== '/') navigateToHome();
              }}
              placeholder="Busca Windows, Office, Visio..."
              className="w-full pl-9 pr-9 py-2 text-sm rounded-lg bg-[#1e0742] border border-white/20 text-white placeholder-purple-200/60 focus:outline-none"
            />
            <Search className="w-4 h-4 text-purple-300 absolute left-3 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-purple-300 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mobile Live Results */}
          {searchQuery.trim().length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {liveResults.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  No encontramos coincidencias para "{searchQuery}"
                </div>
              ) : (
                liveResults.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.slug)}
                    className="w-full text-left p-2.5 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      onError={(e) => { e.currentTarget.src = prod.fallbackImage; }}
                      className="w-9 h-9 object-contain rounded p-0.5 bg-slate-50 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">{prod.name}</div>
                      <div className="text-[10px] text-slate-500">{formatPrice(prod.price)} • {prod.duration}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#240850] py-3 border-b border-white/10 flex flex-col space-y-1 px-4">
          <button
            onClick={() => {
              setActiveCategory('all');
              navigateToHome();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 text-sm font-semibold text-purple-100 hover:text-white"
          >
            Inicio
          </button>
          <button
            onClick={() => handleCategoryClick('combos')}
            className="w-full text-left py-2.5 text-sm font-semibold text-purple-100 hover:text-white flex items-center justify-between"
          >
            <span>Combos 2 en 1</span>
            <span className="text-[10px] bg-[#facc15] text-slate-950 font-bold px-2 py-0.5 rounded">OFERTA</span>
          </button>
          <button
            onClick={() => handleCategoryClick('office')}
            className="w-full text-left py-2.5 text-sm font-semibold text-purple-100 hover:text-white"
          >
            Office
          </button>
          <button
            onClick={() => handleCategoryClick('windows')}
            className="w-full text-left py-2.5 text-sm font-semibold text-purple-100 hover:text-white"
          >
            Windows
          </button>
          <button
            onClick={() => handleCategoryClick('project-visio')}
            className="w-full text-left py-2.5 text-sm font-semibold text-purple-100 hover:text-white flex items-center justify-between"
          >
            <span>Project & Visio</span>
            <span className="text-[10px] bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded">NUEVO</span>
          </button>
          <button
            onClick={handleTopClick}
            className="w-full text-left py-2.5 text-sm font-semibold text-purple-100 hover:text-white"
          >
            Top Licencias
          </button>
          <button
            onClick={handleBestSellersClick}
            className="w-full text-left py-2.5 text-sm font-semibold text-purple-100 hover:text-white"
          >
            Más vendidos
          </button>
          <button
            onClick={() => handleCategoryClick('offers')}
            className="w-full text-left py-2.5 text-sm font-semibold text-purple-100 hover:text-white"
          >
            Ofertas
          </button>
        </div>
      )}
    </header>
  );
};
