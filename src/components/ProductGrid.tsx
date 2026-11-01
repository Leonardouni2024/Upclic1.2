import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Tv,
  Layers,
  Monitor,
  Palette,
  Briefcase,
  Tag,
  Flame,
  MessageCircle
} from 'lucide-react';
import { WHATSAPP_NUMBER, getProductsByCategory, searchProducts, getCategoryLabel } from '../products';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';
import { ProductCategory } from '../types';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const ProductGrid: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    catalogProducts
  } = useCart();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: { id: ProductCategory; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'bestsellers', label: 'Más Vendidos', icon: <Flame className="w-3.5 h-3.5 text-[#E8440A]" /> },
    { id: 'offers', label: 'Ofertas Especiales', icon: <Tag className="w-3.5 h-3.5 text-emerald-600" /> },
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
  ];

  const baseList = searchQuery.trim()
    ? searchProducts(searchQuery, selectedCategory, catalogProducts)
    : getProductsByCategory(selectedCategory, catalogProducts);

  const filteredProducts = [...baseList].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.bestSeller && !b.bestSeller) return -1;
    if (!a.bestSeller && b.bestSeller) return 1;
    return 0;
  });

  const streamingPlatforms = [
    'Prime Video',
    'Netflix',
    'HBO Max',
    'Disney Plus',
    'Crunchyroll',
    'Paramount Plus',
    'Apple TV'
  ];

  return (
    <section id="catalogo" className="py-14 sm:py-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <span className="inline-flex items-center gap-2 text-[#1668E3] font-bold text-xs uppercase tracking-widest mb-2">
              <img
                src="/assets/aistudio/image_776e6470.png"
                alt="Catálogo Oficial UPCLIC"
                className="w-5 h-5 object-contain shrink-0"
              />
              Catálogo Oficial UPCLIC
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {selectedCategory === 'all'
                ? 'Productos Destacados y Catálogo Digital'
                : getCategoryLabel(selectedCategory)}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Precios expresados en Soles peruanos (S/) • Entrega digital con guía paso a paso y garantía aplicable.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 ml-2" />
            <span className="text-xs text-slate-500 font-semibold">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Ordenar productos"
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1668E3] cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Search Filter Indicator */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between bg-blue-50/70 border border-blue-200 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-blue-950">
              <Search className="w-4 h-4 text-[#1668E3]" />
              <span>
                Resultados para: <strong className="font-bold">"{searchQuery}"</strong> ({filteredProducts.length})
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#1668E3] hover:text-blue-800 underline cursor-pointer"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : selectedCategory === 'streaming' ? (
          <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 text-center border border-slate-200 max-w-3xl mx-auto my-4">
            <div className="w-14 h-14 bg-[#EEE9FF] text-[#5B3CC4] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tv className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0B1F3A] mb-2">
              Streaming y Entretenimiento Digital
            </h3>
            <p className="text-slate-600 text-sm mb-6 max-w-xl mx-auto leading-relaxed">
              Consulta disponibilidad en tiempo real de perfiles individuales o cuentas completas verificadas con entrega inmediata por WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
              {streamingPlatforms.map(platform => (
                <a
                  key={platform}
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola UPCLIC, deseo consultar disponibilidad y precio en Soles de: ${platform}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#1668E3] text-xs font-bold text-[#0B1F3A] hover:text-[#1668E3] shadow-2xs transition-all"
                >
                  {platform}
                </a>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola UPCLIC, deseo consultar el catálogo actualizado de cuentas de Streaming disponibles hoy.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#E8440A] hover:bg-[#d83b01] text-white font-bold rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Consultar Streaming por WhatsApp
              </a>
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs sm:text-sm border border-slate-200 transition-colors cursor-pointer"
              >
                Ver todo el catálogo
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto my-8">
            <div className="w-14 h-14 bg-blue-50 text-[#1668E3] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              No encontramos resultados exactos
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Intenta con otro término o consulta directamente por WhatsApp para ayudarte al instante.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#1668E3] hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Ver Todos los Productos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
