import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ProductCategory } from '../types.ts';
import { ShieldCheck, MessageCircle, Heart, Lock } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../products.ts';
import { UpClicLogo } from './UpClicLogo.tsx';

interface FooterProps {
  onOpenHelpModal: (topic: string) => void;
  onOpenAdminOrders?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHelpModal, onOpenAdminOrders }) => {
  const { setActiveCategory, navigateToHome, currentPath } = useCart();

  const handleCategory = (category: ProductCategory) => {
    setActiveCategory(category);
    if (currentPath !== '/') {
      navigateToHome();
    }
    const el = document.getElementById('catalogo-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info (2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <UpClicLogo size="md" variant="full" theme="dark" />
            </div>

            <p className="text-sm font-bold text-slate-300 max-w-sm">
              Licencias y productos digitales
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Especialistas en software original de Microsoft Office y sistemas operativos Windows para uso personal, profesional y empresarial con entrega digital inmediata y soporte técnico dedicado.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                Garantía de activación
              </span>
              <span className="flex items-center gap-1.5 text-sky-400 font-bold bg-sky-950/40 px-2.5 py-1 rounded-lg border border-sky-800/40">
                <Lock className="w-3.5 h-3.5" />
                Mercado Pago
              </span>
            </div>
          </div>

          {/* Col 1: Productos */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-wider mb-4">
              Productos
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => handleCategory('combos')}
                  className="hover:text-white transition-colors cursor-pointer text-[#00C0F3] font-semibold"
                >
                  Combos 2 en 1
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('office')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Office
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('windows')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Windows
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('project-visio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Project & Visio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('bestsellers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Más vendidos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('offers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ofertas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Ayuda */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-wider mb-4">
              Ayuda
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => onOpenHelpModal('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Preguntas frecuentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contacto
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp UpClic</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Método de pago */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium mb-6">
              <li>
                <button
                  onClick={() => onOpenHelpModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Términos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('sales_terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Condiciones de venta
                </button>
              </li>
            </ul>

            <h4 className="text-xs font-black uppercase text-white tracking-wider mb-2">
              Método de pago:
            </h4>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Mercado Pago</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} UpClic. Todos los derechos reservados.</p>
          </div>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Microsoft, Windows y Office son marcas registradas de Microsoft Corporation.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
