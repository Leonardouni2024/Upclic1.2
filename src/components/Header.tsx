import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ProductCategory, Product } from '../types.ts';
import { searchProducts } from '../products.ts';
import { Search, Menu, X, Star, ArrowRight, Sparkles, Layers, ShoppingCart } from 'lucide-react';
import { UpClicLogo } from './UpClicLogo.tsx';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const {
    totalQuantity,
    setIsCartOpen,
    activeCategory,
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

  const handleHowToBuyClick = () => {
    if (currentPath !== '/') {
      navigateToHome();
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('como-comprar-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Mobile menu toggle button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-[#0066FF] transition-all cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <button
              id="logo-btn"
              onClick={navigateToHome}
              className="flex items-center group text-left cursor-pointer focus:outline-none hover:opacity-95 transition-opacity shrink-0"
              aria-label="UpClic - Inicio"
            >
              <UpClicLogo size="md" variant="full" />
            </button>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 text-xs lg:text-[13px] xl:text-sm font-semibold text-slate-600">
            <button
              id="nav-inicio"
              onClick={() => {
                setActiveCategory('all');
                navigateToHome();
              }}
              className={`px-2 xl:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === 'all' && currentPath === '/'
                  ? 'text-[#0066FF] bg-blue-50/90 font-bold border border-blue-100 shadow-2xs'
                  : 'hover:text-[#0066FF] hover:bg-slate-100/70'
              }`}
            >
              Inicio
            </button>
            <button
              id="nav-combos"
              onClick={() => handleCategoryClick('combos')}
              className={`px-2 xl:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeCategory === 'combos'
                  ? 'text-[#0066FF] bg-blue-50/90 font-bold border border-blue-100 shadow-2xs'
                  : 'hover:text-[#0066FF] hover:bg-slate-100/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Combos</span>
            </button>
            <button
              id="nav-office"
              onClick={() => handleCategoryClick('office')}
              className={`px-2 xl:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === 'office'
                  ? 'text-[#0066FF] bg-blue-50/90 font-bold border border-blue-100 shadow-2xs'
                  : 'hover:text-[#0066FF] hover:bg-slate-100/70'
              }`}
            >
              Office
            </button>
            <button
              id="nav-windows"
              onClick={() => handleCategoryClick('windows')}
              className={`px-2 xl:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === 'windows'
                  ? 'text-[#0066FF] bg-blue-50/90 font-bold border border-blue-100 shadow-2xs'
                  : 'hover:text-[#0066FF] hover:bg-slate-100/70'
              }`}
            >
              Windows
            </button>
            <button
              id="nav-project-visio"
              onClick={() => handleCategoryClick('project-visio')}
              className={`px-2 xl:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeCategory === 'project-visio'
                  ? 'text-[#0066FF] bg-blue-50/90 font-bold border border-blue-100 shadow-2xs'
                  : 'hover:text-[#0066FF] hover:bg-slate-100/70'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Project & Visio</span>
            </button>
            <button
              id="nav-top"
              onClick={handleTopClick}
              className={`px-2 xl:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === 'top'
                  ? 'text-[#0066FF] bg-blue-50/90 font-bold border border-blue-100 shadow-2xs'
                  : 'hover:text-[#0066FF] hover:bg-slate-100/70'
              }`}
            >
              Top
            </button>
            <button
              id="nav-bestsellers"
              onClick={handleBestSellersClick}
              className={`px-2 xl:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === 'bestsellers'
                  ? 'text-[#0066FF] bg-blue-50/90 font-bold border border-blue-100 shadow-2xs'
                  : 'hover:text-[#0066FF] hover:bg-slate-100/70'
              }`}
            >
              Más vendidos
            </button>
            <button
              id="nav-offers"
              onClick={() => handleCategoryClick('offers')}
              className={`px-2 xl:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === 'offers'
                  ? 'text-[#0066FF] bg-blue-50/90 font-bold border border-blue-100 shadow-2xs'
                  : 'hover:text-[#0066FF] hover:bg-slate-100/70'
              }`}
            >
              Ofertas
            </button>
            <button
              id="nav-how-to-buy"
              onClick={handleHowToBuyClick}
              className="px-2 xl:px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-[#0066FF] hover:bg-slate-100/70 transition-all cursor-pointer font-medium"
            >
              Cómo comprar
            </button>
          </nav>

          {/* Right Controls: Search, User, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Desktop Real-time Search Input with Live Autocomplete */}
            <div ref={searchContainerRef} className="relative hidden md:block w-44 lg:w-56 xl:w-72">
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
                placeholder="Buscar 'win', 'off', 'vis', 'proj', '2024'..."
                className="w-full pl-9 pr-7 py-2 text-xs font-medium rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] text-slate-800 transition-all placeholder:text-slate-400 shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs p-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              )}

              {/* Live Search Autocomplete Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Resultados rápidos para "{searchQuery}"</span>
                    <span className="text-[#0066FF]">{liveResults.length} encontrados</span>
                  </div>

                  {liveResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">No encontramos productos con ese término</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Prueba con: <span className="font-semibold text-[#0066FF]">Windows 11, Office 2024, Combo, Project, Visio</span>
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {liveResults.map(prod => (
                        <button
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod.slug)}
                          className="w-full text-left p-3 hover:bg-blue-50/60 transition-colors flex items-center gap-3 group cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200/80 p-1 shrink-0 flex items-center justify-center">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              onError={(e) => { e.currentTarget.src = prod.fallbackImage; }}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-slate-900 group-hover:text-[#0066FF] truncate transition-colors">
                              {prod.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                              <span className="bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.5 rounded">
                                {prod.category === 'combos' ? 'Combo' : prod.category === 'project-visio' ? 'Project/Visio' : prod.category.toUpperCase()}
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
                              S/ {prod.price.toFixed(2)}
                            </div>
                            {prod.oldPrice && (
                              <div className="text-[10px] text-slate-400 line-through tabular-nums">
                                S/ {prod.oldPrice.toFixed(2)}
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
                          className="text-xs font-bold text-[#0066FF] hover:underline flex items-center justify-center gap-1 w-full cursor-pointer py-1"
                        >
                          <span>Ver todos los resultados en el catálogo</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Toggle Button */}
            <button
              id="search-toggle-mobile"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0066FF] transition-colors cursor-pointer"
              aria-label="Buscar productos"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button: Clean icon with counter badge (No "Carrito" text) */}
            <button
              id="cart-header-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm shadow-xs shadow-[#0066FF]/25 hover:shadow-md hover:shadow-[#0066FF]/35 transition-all cursor-pointer active:scale-95 border border-blue-500/20 shrink-0"
              aria-label={`Ver carrito: ${totalQuantity} productos`}
              title={`Carrito: ${totalQuantity} productos`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[11px] sm:text-xs tabular-nums font-black leading-none min-w-[18px] text-center">
                {totalQuantity}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown with Live Autocomplete */}
        {mobileSearchOpen && (
          <div ref={mobileSearchRef} className="md:hidden pb-3 pt-1 border-t border-slate-100">
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
                placeholder="Escribe 'win', 'off', 'vis', 'proj'..."
                className="w-full pl-9 pr-9 py-2 text-sm rounded-xl bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Live Results */}
            {searchQuery.trim().length > 0 && (
              <div className="mt-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
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
                        <div className="text-[10px] text-slate-500">S/ {prod.price.toFixed(2)} • {prod.duration}</div>
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
          <div className="lg:hidden py-3 border-t border-slate-100 flex flex-col space-y-1">
            <button
              onClick={() => {
                setActiveCategory('all');
                navigateToHome();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Inicio
            </button>
            <button
              onClick={() => handleCategoryClick('combos')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800 flex items-center justify-between"
            >
              <span>Combos 2 en 1</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">SUPER AHORRO</span>
            </button>
            <button
              onClick={() => handleCategoryClick('office')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Office
            </button>
            <button
              onClick={() => handleCategoryClick('windows')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Windows
            </button>
            <button
              onClick={() => handleCategoryClick('project-visio')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800 flex items-center justify-between"
            >
              <span>Project & Visio</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">NUEVOS</span>
            </button>
            <button
              onClick={handleTopClick}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Top
            </button>
            <button
              onClick={handleBestSellersClick}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Más vendidos
            </button>
            <button
              onClick={() => handleCategoryClick('offers')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Ofertas
            </button>
            <button
              onClick={handleHowToBuyClick}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Cómo comprar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
