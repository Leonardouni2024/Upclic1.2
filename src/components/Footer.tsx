import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ProductCategory } from '../types.ts';
import { ShieldCheck, MessageCircle, Heart, Lock, Globe } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../products.ts';
import { UpClicLogo } from './UpClicLogo.tsx';

interface FooterProps {
  onOpenHelpModal: (topic: string) => void;
  onOpenAdminOrders?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHelpModal, onOpenAdminOrders }) => {
  const { setActiveCategory, navigateToHome, currentPath, currency, language, setIsRegionModalOpen, t } = useCart();

  const handleCategory = (category: ProductCategory) => {
    setActiveCategory(category);
    if (currentPath !== '/') {
      navigateToHome();
    }
    const el = document.getElementById('catalogo-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700">
          {/* Brand Info (2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <UpClicLogo size="md" variant="full" theme="dark" />
            </div>

            <p className="text-sm font-bold text-white max-w-sm">
              {t('digitalLicensesSubtitle')}
            </p>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-medium">
              {t('footerDesc')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('activationGuaranteeBadge')}
              </span>
              <span className="flex items-center gap-1.5 text-blue-400 font-bold bg-blue-400/10 px-2.5 py-1 rounded-lg border border-blue-400/20">
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
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
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
                  onClick={() => handleCategory('combos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('combos')}
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
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
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
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium mb-6">
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

            <h4 className="text-xs font-black uppercase text-white tracking-wider mb-2.5">
              {t('paymentMethodLabel')}
            </h4>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-700 shadow-sm">
                <img
                  src="https://woocommerce.com/wp-content/uploads/2021/05/fb-mercado-pago-v2@2x.png"
                  alt="Mercado Pago"
                  className="h-6 sm:h-7 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {language === 'ES' ? 'Tarjetas, transferencias y pagos seguros' : 'Credit/Debit cards & secure transactions'}
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated Mercado Pago & Trust Assurance Bar */}
        <div className="py-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="px-3.5 py-1.5 bg-white rounded-lg border border-slate-700/80 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="https://woocommerce.com/wp-content/uploads/2021/05/fb-mercado-pago-v2@2x.png"
                alt="Mercado Pago"
                className="h-6 sm:h-7 w-auto object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{language === 'ES' ? 'Pagos procesados y protegidos por Mercado Pago' : 'Payments processed and secured by Mercado Pago'}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {language === 'ES' ? 'Transacciones encriptadas SSL de 256 bits con acreditación inmediata' : '256-bit SSL encrypted transactions with instant confirmation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Visa</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Mastercard</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">American Express</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Débito</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} UpClic. {t('allRightsReserved')}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRegionModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer text-xs font-semibold"
              title="Cambiar país, moneda e idioma"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {currency === 'PEN' && '🇵🇪 Perú (S/ PEN)'}
                {currency === 'COP' && '🇨🇴 Colombia ($ COP)'}
                {currency === 'MXN' && '🇲🇽 México ($ MXN)'}
                {currency === 'USD' && '🇺🇸 USA / Global ($ USD)'}
              </span>
            </button>
            <p className="flex items-center gap-1 text-slate-400">
              <span>{t('legalNotice')}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
