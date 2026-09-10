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
  const { setActiveCategory, navigateToHome, currentPath, t } = useCart();

  const handleCategory = (category: ProductCategory) => {
    setActiveCategory(category);
    if (currentPath !== '/') {
      navigateToHome();
    }
    const el = document.getElementById('catalogo-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#0a0717] text-purple-200 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <UpClicLogo size="md" variant="full" theme="dark" />
            </div>

            <p className="text-sm font-bold text-white max-w-sm">
              {t('digitalLicensesSubtitle')}
            </p>

            <p className="text-xs text-purple-200 leading-relaxed max-w-sm font-medium">
              {t('footerDesc')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-purple-200">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('activationGuaranteeBadge')}
              </span>
              <span className="flex items-center gap-1.5 text-[#facc15] font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                <Lock className="w-3.5 h-3.5" />
                Mercado Pago
              </span>
            </div>
          </div>

          {/* Col 1: Productos */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-wider mb-4">
              {t('categories')}
            </h4>
            <ul className="space-y-2.5 text-xs text-purple-200 font-medium">
              <li>
                <button
                  onClick={() => handleCategory('combos')}
                  className="hover:text-[#facc15] transition-colors cursor-pointer text-[#facc15] font-bold"
                >
                  {t('combos')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('office')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('office')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('windows')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('windows')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('project-visio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('projectVisio')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('bestsellers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('bestSellers')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('offers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('deals')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Ayuda */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-wider mb-4">
              {t('helpSection')}
            </h4>
            <ul className="space-y-2.5 text-xs text-purple-200 font-medium">
              <li>
                <button
                  onClick={() => onOpenHelpModal('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('faq')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('contact')}
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
              {t('legalSection')}
            </h4>
            <ul className="space-y-2.5 text-xs text-purple-200 font-medium mb-6">
              <li>
                <button
                  onClick={() => onOpenHelpModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('terms')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('privacy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('sales_terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('salesTerms')}
                </button>
              </li>
            </ul>

            <h4 className="text-xs font-black uppercase text-white tracking-wider mb-2">
              {t('paymentMethodLabel')}
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-[#facc15]">
                <span className="w-2 h-2 rounded-full bg-[#facc15]"></span>
                <span>Mercado Pago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300 font-medium">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} UpClic. {t('allRightsReserved')}</p>
          </div>
          <p className="flex items-center gap-1 text-purple-300">
            <span>{t('legalNotice')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
