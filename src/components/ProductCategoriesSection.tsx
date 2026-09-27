import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ArrowRight, Laptop, Shield, Palette, Layers, CheckCircle2 } from 'lucide-react';

interface CategoryCardItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  categoryKey: 'office' | 'windows' | 'apps' | 'project-visio';
  image: string;
  badge: string;
  featuredItems: string[];
  description: string;
}

export const ProductCategoriesSection: React.FC = () => {
  const { setActiveCategory, navigateToHome, currentPath, language } = useCart();

  const handleSelectCategory = (categoryKey: 'office' | 'windows' | 'apps' | 'project-visio') => {
    setActiveCategory(categoryKey);
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

  const isEn = language === 'EN';

  const categories: CategoryCardItem[] = [
    {
      id: 'cat-office',
      title: isEn ? 'Microsoft Office' : 'Microsoft Office',
      subtitle: isEn ? 'Productivity & document suites' : 'Productividad y gestión documental',
      icon: <Laptop className="w-5 h-5 text-[#0067B8]" />,
      categoryKey: 'office',
      image: '/products/office-2024.webp',
      badge: isEn ? 'Most Popular' : 'Más Solicitado',
      featuredItems: isEn
        ? ['Office 2024 LTSC', 'Office 2021 LTSC', 'Office 2019 LTSC', 'Microsoft 365 (1 Year)']
        : ['Office 2024 LTSC', 'Office 2021 LTSC', 'Office 2019 LTSC', 'Microsoft 365 (1 año)'],
      description: isEn
        ? 'Complete office productivity suites with Word, Excel, PowerPoint, and Outlook for home, school, and business.'
        : 'Suites ofimáticas completas con Word, Excel, PowerPoint y Outlook para hogar, estudios y empresas.'
    },
    {
      id: 'cat-windows',
      title: isEn ? 'Microsoft Windows' : 'Microsoft Windows',
      subtitle: isEn ? 'Official operating systems' : 'Sistemas operativos oficiales',
      icon: <Layers className="w-5 h-5 text-[#0067B8]" />,
      categoryKey: 'windows',
      image: '/products/windows-11-pro.webp',
      badge: isEn ? 'Genuine OEM / Retail' : 'Original OEM / Retail',
      featuredItems: isEn
        ? ['Windows 11 Pro', 'Windows 10 Pro', 'Windows 11 Home', 'Windows 10 Enterprise']
        : ['Windows 11 Pro', 'Windows 10 Pro', 'Windows 11 Home', 'Windows 10 Enterprise'],
      description: isEn
        ? 'Direct permanent digital activation and updates straight from official Microsoft servers.'
        : 'Activación directa con licencia digital permanente y actualizaciones directas desde los servidores oficiales de Microsoft.'
    },
    {
      id: 'cat-cuentas-premium',
      title: isEn ? 'Premium Accounts' : 'Cuentas Premium',
      subtitle: isEn ? 'Duolingo, Canva Pro, Gemini AI' : 'Duolingo, Canva Pro, Gemini IA',
      icon: <Palette className="w-5 h-5 text-[#0067B8]" />,
      categoryKey: 'apps',
      image: '/products/canva-pro.webp',
      badge: isEn ? 'Popular Accounts' : 'Suscripciones TOP',
      featuredItems: isEn
        ? ['Duolingo Super (12 Months)', 'Canva Pro (12 Months)', 'Gemini AI Pro (18 Months)', 'Gemini AI Pro (12 Months)']
        : ['Duolingo Super (12 meses)', 'Canva Pro (12 meses)', 'Gemini AI Pro (18 meses)', 'Gemini AI Pro (12 meses)'],
      description: isEn
        ? 'Official premium subscriptions for languages, graphic design, and advanced Artificial Intelligence.'
        : 'Cuentas y suscripciones premium oficiales para aprendizaje de idiomas, diseño gráfico e Inteligencia Artificial avanzada.'
    },
    {
      id: 'cat-seguridad',
      title: isEn ? 'Security & Antivirus' : 'Seguridad & Antivirus',
      subtitle: isEn ? 'Comprehensive protection for your PCs' : 'Protección integral para tus equipos',
      icon: <Shield className="w-5 h-5 text-[#0067B8]" />,
      categoryKey: 'apps',
      image: '/products/mcafee-antivirus.webp',
      badge: isEn ? '24/7 Protection' : 'Protección 24/7',
      featuredItems: isEn
        ? ['McAfee AntiVirus (1 PC • 12 Months)', 'Ransomware defense', 'Secure web browsing & firewall', 'Full PC protection']
        : ['McAfee AntiVirus (1 PC • 12 meses)', 'Defensa contra ransomware', 'Navegación segura y firewall', 'Protección para PC'],
      description: isEn
        ? 'Protect personal and business data against viruses, trojans, web threats, and malware in real time.'
        : 'Protege tu información personal y empresarial contra virus, troyanos, ataques web y software malicioso en tiempo real.'
    }
  ];

  return (
    <section id="categorias-section" className="py-14 sm:py-18 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0067B8] text-xs font-bold tracking-wide uppercase mb-3">
            <span>{isEn ? 'Corporate Catalog' : 'Catálogo Corporativo'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            {isEn ? 'Professional Software Categories' : 'Categorías de Software Profesional'}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {isEn
              ? '100% genuine software solutions for companies, professionals, and students. Select a category to explore licenses and pricing.'
              : 'Soluciones de software 100% genuinas para empresas, profesionales independientes y estudiantes. Selecciona una categoría para explorar licencias y precios.'}
          </p>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white rounded-xl border border-slate-200 hover:border-[#0067B8] hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header & Badge */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0B1F3A] group-hover:text-[#0067B8] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {cat.subtitle}
                </p>
              </div>

              {/* Product Visual Container - Standardized dimensions and padding */}
              <div
                onClick={() => handleSelectCategory(cat.categoryKey)}
                className="mx-5 my-2 h-44 bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center justify-center cursor-pointer group-hover:bg-blue-50/40 transition-colors"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center bg-white rounded-lg p-2 shadow-xs border border-slate-200/60 group-hover:scale-105 transition-transform duration-200">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain drop-shadow-xs mix-blend-multiply"
                    onError={(e) => {
                      e.currentTarget.src = '/products/office-2024.png';
                    }}
                  />
                </div>
              </div>

              {/* Card Body: Short Description & Bullet points */}
              <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="space-y-1.5 mb-5 pb-4 border-b border-slate-100">
                    {cat.featuredItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11.5px] text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSelectCategory(cat.categoryKey)}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-50 hover:bg-[#0067B8] text-[#0B1F3A] hover:text-white font-bold text-xs sm:text-sm border border-slate-200 hover:border-[#0067B8] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <span>{isEn ? 'View products' : 'Ver productos'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
