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
  const { setActiveCategory, navigateToHome, currentPath } = useCart();

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

  const categories: CategoryCardItem[] = [
    {
      id: 'cat-office',
      title: 'Microsoft Office',
      subtitle: 'Productividad y gestión documental',
      icon: <Laptop className="w-5 h-5 text-[#0067B8]" />,
      categoryKey: 'office',
      image: '/products/office-2024.webp',
      badge: 'Más Solicitado',
      featuredItems: ['Office 2024 LTSC', 'Office 2021 LTSC', 'Office 2019 LTSC', 'Microsoft 365 (1 año)'],
      description: 'Suites ofimáticas completas con Word, Excel, PowerPoint y Outlook para hogar, estudios y empresas.'
    },
    {
      id: 'cat-windows',
      title: 'Microsoft Windows',
      subtitle: 'Sistemas operativos oficiales',
      icon: <Layers className="w-5 h-5 text-[#0067B8]" />,
      categoryKey: 'windows',
      image: '/products/windows-11-pro.webp',
      badge: 'Original OEM / Retail',
      featuredItems: ['Windows 11 Pro', 'Windows 10 Pro', 'Windows 11 Home', 'Windows 10 Enterprise'],
      description: 'Activación directa con licencia digital permanente y actualizaciones directas desde los servidores oficiales de Microsoft.'
    },
    {
      id: 'cat-diseno',
      title: 'Diseño Profesional',
      subtitle: 'Creatividad y edición de contenido',
      icon: <Palette className="w-5 h-5 text-[#0067B8]" />,
      categoryKey: 'apps',
      image: '/products/canva-pro.webp',
      badge: 'Cuentas Premium',
      featuredItems: ['Adobe Acrobat Pro DC 2018 (Permanente)', 'Canva Pro (12 meses)', 'CorelDRAW Graphics Suite', 'Gemini AI Pro'],
      description: 'Herramientas de diseño gráfico, plantillas premium y software creativo para diseñadores, agencias y creadores de contenido.'
    },
    {
      id: 'cat-seguridad',
      title: 'Seguridad & Antivirus',
      subtitle: 'Protección integral para tus equipos',
      icon: <Shield className="w-5 h-5 text-[#0067B8]" />,
      categoryKey: 'apps',
      image: '/products/mcafee-antivirus.webp',
      badge: 'Protección 24/7',
      featuredItems: ['McAfee AntiVirus (1 PC • 12 meses)', 'Defensa contra ransomware', 'Navegación segura y firewall', 'Protección para PC'],
      description: 'Protege tu información personal y empresarial contra virus, troyanos, ataques web y software malicioso en tiempo real.'
    }
  ];

  return (
    <section id="categorias-section" className="py-14 sm:py-18 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0067B8] text-xs font-bold tracking-wide uppercase mb-3">
            <span>Catálogo Corporativo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            Categorías de Software Profesional
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Soluciones de software 100% genuinas para empresas, profesionales independientes y estudiantes. Selecciona una categoría para explorar licencias y precios.
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

              {/* Product Visual Container */}
              <div
                onClick={() => handleSelectCategory(cat.categoryKey)}
                className="mx-5 my-2 aspect-[4/3] bg-slate-50 rounded-lg border border-slate-100 p-4 flex items-center justify-center cursor-pointer group-hover:bg-blue-50/40 transition-colors"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.src = '/products/office-2024.png';
                  }}
                />
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
                  <span>Ver productos</span>
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
