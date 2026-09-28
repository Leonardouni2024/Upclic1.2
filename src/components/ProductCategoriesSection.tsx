import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { Laptop, Layers, Shield, Palette } from 'lucide-react';
import { products } from '../products.ts';

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

  const officeCount = products.filter(p => p.category === 'office').length;
  const windowsCount = products.filter(p => p.category === 'windows').length;
  const antivirusCount = products.filter(p => p.category === 'apps' && (p.id.includes('antivirus') || p.id.includes('mcafee'))).length + 2;
  const pdfDisenoCount = products.filter(p => p.category === 'apps' || p.category === 'project-visio').length;

  const categories = [
    {
      id: 'cat-office',
      title: 'Microsoft Office',
      countText: `${officeCount || 12} productos`,
      icon: <Laptop className="w-6 h-6 text-[#00A3E0]" />,
      categoryKey: 'office' as const,
    },
    {
      id: 'cat-windows',
      title: 'Windows',
      countText: `${windowsCount || 8} productos`,
      icon: <Layers className="w-6 h-6 text-[#00A3E0]" />,
      categoryKey: 'windows' as const,
    },
    {
      id: 'cat-antivirus',
      title: 'Antivirus',
      countText: `${antivirusCount || 11} productos`,
      icon: <Shield className="w-6 h-6 text-[#00A3E0]" />,
      categoryKey: 'apps' as const,
    },
    {
      id: 'cat-diseno',
      title: 'PDF & Diseño',
      countText: `${pdfDisenoCount || 6} productos`,
      icon: <Palette className="w-6 h-6 text-[#00A3E0]" />,
      categoryKey: 'project-visio' as const,
    }
  ];

  return (
    <section id="categorias-section" className="py-12 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#00A3E0] text-xs font-bold tracking-wide mb-3">
            <span>Software para cada necesidad</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Licencias originales de Windows, Office y Antivirus en Perú
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal">
            Explora nuestras categorías y encuentra la licencia perfecta para ti o tu empresa
          </p>
        </div>

        {/* 4 Clean Category Box Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.categoryKey)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#00A3E0] hover:shadow-md transition-all duration-200 p-6 sm:p-7 flex flex-col items-center text-center cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#00A3E0] transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {cat.countText}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
