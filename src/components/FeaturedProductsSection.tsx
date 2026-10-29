import React from 'react';
import { motion } from 'motion/react';
import { products } from '../products.ts';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { Check, Zap, ChevronDown, ArrowRight, Cloud, Monitor, ShieldCheck } from 'lucide-react';

interface ComparisonTier {
  id: string;
  productId: string;
  slug: string;
  versionBadge: string;
  title: string;
  subtitle: string;
  audienceTag: string;
  isPopular?: boolean;
  popularLabel?: string;
  licenseType: string;
  compatibilityLabel: string;
  appsIncluded: string[];
  highlights: string[];
  fallbackPrice: number;
  fallbackOldPrice: number;
  imageUrl: string;
  fallbackImage: string;
}

const cardTransition = {
  duration: 0.48,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
};

export const FeaturedProductsSection: React.FC = () => {
  const {
    addItem,
    navigateToCheckout,
    navigateToProduct,
    setActiveCategory,
    navigateToHome,
    currentPath,
    formatPrice
  } = useCart();

  const comparisonTiers: ComparisonTier[] = [
    {
      id: 'tier-pro-plus-2021',
      productId: 'prod-office-2021',
      slug: 'office-2021-pro-plus',
      versionBadge: 'Edición 2021',
      title: 'Office Professional Plus 2021',
      subtitle: 'La versión profesional más estable y compatible para trabajo, estudio y oficina sin suscripciones.',
      audienceTag: 'Estabilidad Total · Pago Único',
      isPopular: false,
      licenseType: 'Licencia Permanente Vitalicia · 1 PC',
      compatibilityLabel: 'Windows 10 y Windows 11 (32/64 Bit)',
      appsIncluded: [
        'Microsoft Word 2021 Pro',
        'Microsoft Excel 2021 Pro (Tablas dinámicas y macros)',
        'Microsoft PowerPoint 2021 Pro',
        'Microsoft Outlook 2021 (Correo y agenda)',
        'Microsoft Access 2021 (Bases de datos)',
        'Microsoft OneNote & Publisher 2021'
      ],
      highlights: [
        'Clave original de 25 caracteres permanente',
        'Un solo pago de por vida, sin mensualidades',
        'Entrega digital inmediata + guía paso a paso'
      ],
      fallbackPrice: 25.0,
      fallbackOldPrice: 110.0,
      imageUrl: '/products/office-2021.webp',
      fallbackImage: '/products/office-2021.png'
    },
    {
      id: 'tier-pro-plus-2024',
      productId: 'prod-office-2024',
      slug: 'office-2024-pro-plus',
      versionBadge: 'Edición 2024',
      title: 'Office Professional Plus 2024',
      subtitle: 'La suite completa de última generación con máximo rendimiento, nuevas funciones y diseño renovado.',
      audienceTag: 'Última Edición Profesional',
      isPopular: true,
      popularLabel: 'Más Popular',
      licenseType: 'Licencia Permanente Vitalicia · 1 PC',
      compatibilityLabel: 'Windows 10 y Windows 11 (32/64 Bit)',
      appsIncluded: [
        'Microsoft Word 2024 Pro',
        'Microsoft Excel 2024 Pro (Funciones y análisis avanzado)',
        'Microsoft PowerPoint 2024 Pro',
        'Microsoft Outlook 2024 (Correo corporativo y agenda)',
        'Microsoft Access 2024 (Gestión de bases de datos)',
        'Microsoft OneNote 2024 integrado'
      ],
      highlights: [
        'Clave original de 25 caracteres permanente',
        'Activación directa en servidores de Microsoft',
        'Garantía de activación del 100% y soporte incluido'
      ],
      fallbackPrice: 27.0,
      fallbackOldPrice: 110.0,
      imageUrl: '/products/office-2024.webp',
      fallbackImage: '/products/office-2024.png'
    },
    {
      id: 'tier-m365-personal',
      productId: 'prod-microsoft-365',
      slug: 'microsoft-365-personal-1-ano',
      versionBadge: 'Cloud 365',
      title: 'Microsoft 365 Personal',
      subtitle: 'Formato suscripción anual con 100 GB de almacenamiento en la nube y acceso multidispositivo.',
      audienceTag: 'Suscripción Anual · Multidispositivo',
      isPopular: false,
      licenseType: 'Suscripción 12 Meses · Hasta 5 Dispositivos',
      compatibilityLabel: 'PC, Mac, iPad, iPhone y Android',
      appsIncluded: [
        'Word, Excel, PowerPoint y Outlook siempre actualizados',
        '100 GB de almacenamiento seguro en OneDrive Cloud',
        'Instalable en PC, Mac, tablets y celulares (hasta 5)',
        'Sincronización en la nube en tiempo real'
      ],
      highlights: [
        'Usa tu suite en hasta 5 equipos en simultáneo',
        'Respaldo automático de documentos en OneDrive',
        'Soporte técnico y garantía durante todo el año'
      ],
      fallbackPrice: 33.0,
      fallbackOldPrice: 180.0,
      imageUrl: '/products/microsoft-365.webp',
      fallbackImage: '/products/microsoft-365.png'
    }
  ];

  const handleInstantBuy = (tier: ComparisonTier) => {
    const foundProduct: Product | undefined = products.find(p => p.id === tier.productId);
    if (foundProduct) {
      addItem(foundProduct, 1);
      navigateToCheckout();
    } else {
      navigateToProduct(tier.slug);
    }
  };

  const handleViewAllCatalog = () => {
    setActiveCategory('all');
    if (currentPath !== '/') {
      navigateToHome();
    }
    setTimeout(() => {
      const el = document.getElementById('catalogo-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section
      id="destacados-section"
      className="py-12 sm:py-16 lg:py-20 bento-bg-pattern border-b border-slate-200/80 font-sans overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={cardTransition}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4"
        >
          <div className="max-w-2xl">
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#0078d4] mb-2">
              Tabla Comparativa · Microsoft Office Original
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
              Compara y elige tu versión ideal de Microsoft Office
            </h2>
            <p className="mt-2 sm:mt-2.5 text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
              Compara entre las ediciones permanentes <strong className="font-semibold text-slate-800">Professional Plus 2021</strong>, <strong className="font-semibold text-slate-800">Professional Plus 2024</strong> o la suscripción en la nube <strong className="font-semibold text-slate-800">Microsoft 365</strong>.
            </p>
          </div>

          <div className="self-start md:self-auto shrink-0">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={handleViewAllCatalog}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-2xl bg-white border border-slate-300 hover:border-[#0078d4] text-xs sm:text-sm font-bold text-slate-800 hover:text-[#0078d4] transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <span>Ver catálogo completo y Windows</span>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </motion.button>
          </div>
        </motion.div>

        {/* 3 Comparison Bento Cards — Responsive across Mobile (1 col), Tablet (2 cols with featured highlighted), Desktop (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {comparisonTiers.map((tier, index) => {
            const productObj = products.find(p => p.id === tier.productId);
            const price = productObj ? productObj.price : tier.fallbackPrice;
            const oldPrice = productObj?.oldPrice || tier.fallbackOldPrice;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ ...cardTransition, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-3xl p-5 sm:p-7 xl:p-8 flex flex-col justify-between relative transition-shadow duration-300 ${
                  tier.isPopular
                    ? 'border-2 border-[#0078d4] shadow-xl lg:-translate-y-2 ring-4 ring-[#0078d4]/10 md:col-span-2 lg:col-span-1 order-first lg:order-none'
                    : 'border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#0078d4]/40'
                }`}
              >
                {/* Popular Floating Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#d83b01] text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">
                    {tier.popularLabel} · El Más Vendido
                  </div>
                )}

                <div>
                  {/* Top Header & Product Thumbnail */}
                  <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 pt-1">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#0078d4]">
                          {tier.audienceTag}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-[11px] font-bold text-slate-600 font-mono">
                          {tier.versionBadge}
                        </span>
                      </div>
                      <h3
                        onClick={() => navigateToProduct(tier.slug)}
                        className="text-lg sm:text-xl xl:text-2xl font-extrabold text-slate-900 tracking-tight cursor-pointer hover:text-[#0078d4] transition-colors leading-snug"
                      >
                        {tier.title}
                      </h3>
                    </div>

                    <div
                      onClick={() => navigateToProduct(tier.slug)}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-200/70 p-2 flex items-center justify-center shrink-0 cursor-pointer group"
                    >
                      <img
                        src={tier.imageUrl}
                        alt={tier.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = tier.fallbackImage; }}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {tier.subtitle}
                  </p>

                  {/* Price Block */}
                  <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 mb-5">
                    <div className="flex items-baseline flex-wrap gap-2">
                      <span className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums font-mono">
                        {formatPrice(price)}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-400 line-through tabular-nums font-mono">
                        {formatPrice(oldPrice)}
                      </span>
                      <span className="ml-auto text-emerald-700 font-bold text-[11px] sm:text-xs tabular-nums">
                        Ahorra {Math.round(((oldPrice - price) / oldPrice) * 100)}%
                      </span>
                    </div>
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex flex-col gap-1 text-[11px] sm:text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        {tier.id === 'tier-m365-personal' ? (
                          <Cloud className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
                        ) : (
                          <Monitor className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
                        )}
                        <span>{tier.licenseType}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Compatible: {tier.compatibilityLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Applications Included List with Clean Bullets */}
                  <div className="mb-5">
                    <div className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
                      Aplicaciones y funciones incluidas:
                    </div>
                    <ul className="space-y-2.5">
                      {tier.appsIncluded.map((app, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium leading-snug">
                          <span className="w-5 h-5 rounded-full bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Additional Guarantees */}
                  <div className="pt-4 border-t border-slate-100 mb-6 space-y-2">
                    {tier.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-500 leading-snug">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleInstantBuy(tier)}
                    className={`w-full py-3.5 sm:py-4 px-4 sm:px-5 min-h-[48px] rounded-2xl font-bold text-xs sm:text-sm xl:text-base transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap ${
                      tier.isPopular
                        ? 'bg-[#d83b01] hover:bg-[#b83201] text-white'
                        : 'bg-[#0078d4] hover:bg-[#0062ad] text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current shrink-0" />
                    <span>Comprar y Recibir Al Instante</span>
                  </motion.button>

                  <button
                    onClick={() => navigateToProduct(tier.slug)}
                    className="group w-full py-2.5 px-4 min-h-[40px] rounded-xl bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Ver ficha técnica completa</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
