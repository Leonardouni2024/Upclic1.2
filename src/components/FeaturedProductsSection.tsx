import React from 'react';
import { motion } from 'motion/react';
import { products } from '../products.ts';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { Check, Zap, ChevronDown, ArrowRight, Cloud, Monitor } from 'lucide-react';

interface ComparisonTier {
  id: string;
  productId: string;
  slug: string;
  title: string;
  subtitle: string;
  audienceTag: string;
  isPopular?: boolean;
  popularLabel?: string;
  licenseType: string;
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
      id: 'tier-home-student',
      productId: 'prod-office-2021-std',
      slug: 'office-2021-standard',
      title: 'Office Home & Student',
      subtitle: 'Ideal para estudiantes, tareas académicas y uso esencial en el hogar.',
      audienceTag: 'Uso Estudiantil · Hogar',
      isPopular: false,
      licenseType: 'Licencia Permanente · 1 PC (Pago Único)',
      appsIncluded: [
        'Microsoft Word (Procesador de textos)',
        'Microsoft Excel (Hojas de cálculo)',
        'Microsoft PowerPoint (Presentaciones)',
        'Microsoft OneNote (Notas digitales)'
      ],
      highlights: [
        'Un solo pago de por vida, sin mensualidades',
        'Compatible con Windows 10 y Windows 11',
        'Entrega digital inmediata al correo'
      ],
      fallbackPrice: 24.0,
      fallbackOldPrice: 95.0,
      imageUrl: '/products/office-2021.webp',
      fallbackImage: '/products/office-2021.png'
    },
    {
      id: 'tier-pro-plus',
      productId: 'prod-office-2024',
      slug: 'office-2024-pro-plus',
      title: 'Office Professional Plus',
      subtitle: 'La suite completa y definitiva para profesionales, negocios y trabajo avanzado.',
      audienceTag: 'Edición Profesional Completa',
      isPopular: true,
      popularLabel: 'Más Popular',
      licenseType: 'Licencia Permanente Vitalicia · 1 PC',
      appsIncluded: [
        'Microsoft Word 2024 Pro',
        'Microsoft Excel 2024 Pro (Macros y tablas avanzadas)',
        'Microsoft PowerPoint 2024 Pro',
        'Microsoft Outlook (Correo corporativo y agenda)',
        'Microsoft Access (Gestión de bases de datos)',
        'Microsoft OneNote & Publisher'
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
      title: 'Microsoft 365 Personal',
      subtitle: 'Formato suscripción anual con almacenamiento en la nube y uso multidispositivo.',
      audienceTag: 'Suscripción Anual · Nube',
      isPopular: false,
      licenseType: 'Suscripción 12 Meses · Hasta 5 Dispositivos',
      appsIncluded: [
        'Word, Excel, PowerPoint y Outlook siempre actualizados',
        '100 GB de almacenamiento seguro en OneDrive Cloud',
        'Funciona en PC, Mac, iPad, iPhone y Android',
        'Funciones inteligentes y sincronización en tiempo real'
      ],
      highlights: [
        'Usa tu suite en hasta 5 equipos en simultáneo',
        'Respaldo automático de documentos en la nube',
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
    <section id="destacados-section" className="py-14 sm:py-20 bento-bg-pattern border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={cardTransition}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#0078d4] mb-2">
              Tabla Comparativa · Microsoft Office
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
              Compara y elige tu edición original de Office
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-normal">
              Todas nuestras licencias incluyen guía paso a paso, descarga oficial limpia y garantía de activación del 100%.
            </p>
          </div>

          <div className="self-start md:self-auto">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={handleViewAllCatalog}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-300 hover:border-[#0078d4] text-xs sm:text-sm font-bold text-slate-800 hover:text-[#0078d4] transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <span>Ver todas las versiones y Windows</span>
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* 3 Comparison Bento Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
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
                className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-shadow duration-300 ${
                  tier.isPopular
                    ? 'border-2 border-[#0078d4] shadow-xl lg:-translate-y-2 ring-4 ring-[#0078d4]/10'
                    : 'border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#0078d4]/40'
                }`}
              >
                {/* Popular Floating Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#d83b01] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">
                    {tier.popularLabel} · El Más Vendido
                  </div>
                )}

                <div>
                  {/* Top Header & Product Thumbnail */}
                  <div className="flex items-start justify-between gap-4 mb-5 pt-1">
                    <div>
                      <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#0078d4] mb-1">
                        {tier.audienceTag}
                      </span>
                      <h3
                        onClick={() => navigateToProduct(tier.slug)}
                        className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight cursor-pointer hover:text-[#0078d4] transition-colors"
                      >
                        {tier.title}
                      </h3>
                    </div>

                    <div
                      onClick={() => navigateToProduct(tier.slug)}
                      className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/70 p-2 flex items-center justify-center shrink-0 cursor-pointer group"
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
                  <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 mb-6">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums font-mono">
                        {formatPrice(price)}
                      </span>
                      <span className="text-sm font-semibold text-slate-400 line-through tabular-nums font-mono">
                        {formatPrice(oldPrice)}
                      </span>
                      <span className="ml-auto text-emerald-700 font-bold text-xs tabular-nums">
                        Ahorra {Math.round(((oldPrice - price) / oldPrice) * 100)}%
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      {tier.id === 'tier-m365-personal' ? (
                        <Cloud className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
                      )}
                      <span>{tier.licenseType}</span>
                    </div>
                  </div>

                  {/* Applications Included List with Clean Bullets */}
                  <div className="mb-6">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
                      Aplicaciones y funciones incluidas:
                    </div>
                    <ul className="space-y-2.5">
                      {tier.appsIncluded.map((app, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
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
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
                    className={`w-full py-4 px-5 rounded-2xl font-bold text-sm sm:text-base transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap ${
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
                    className="group w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Ver ficha técnica completa</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
