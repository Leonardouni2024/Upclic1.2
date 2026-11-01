import React from 'react';
import {
  ShieldCheck,
  MessageCircle,
  Lock,
  ExternalLink,
  Settings
} from 'lucide-react';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY, INSTAGRAM_URL, INSTAGRAM_DISPLAY, MERCADO_LIBRE_URL } from '../products';
import { useCart, HelpSection } from '../context/CartContext';
import { ProductCategory } from '../types';
import { UpClicLogo } from './UpClicLogo';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setActiveHelpSection, goToHome, goToAdmin } = useCart();

  const handleCategoryLink = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePolicyLink = (section: HelpSection) => {
    setActiveHelpSection(section);
  };

  return (
    <footer className="bg-[#0B1F3A] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div
              onClick={() => {
                setSelectedCategory('all');
                goToHome();
              }}
              className="cursor-pointer inline-block"
            >
              <UpClicLogo variant="dark" size="md" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Todo lo digital, en un solo lugar. Tienda online de licencias de software, herramientas de productividad, diseño, inteligencia artificial y entretenimiento digital con atención personalizada.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <p>
                <strong className="text-white">WhatsApp:</strong>{' '}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7DB2FF] hover:underline font-bold"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </p>
            </div>
          </div>

          {/* Categories Column */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Categorías del Catálogo
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handleCategoryLink('streaming')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Streaming y Entretenimiento
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryLink('office')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Microsoft Office (365 / 2024 / 2021)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryLink('windows')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Windows (11 / 10 / 8.1)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryLink('ia')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Inteligencia Artificial (Gemini AI)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryLink('diseno')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Diseño y Edición (Canva / CorelDRAW)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryLink('profesional')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Software Profesional y Seguridad
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Legal Policies Column */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Confianza y Políticas Legales
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handlePolicyLink('quienes-somos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Quiénes somos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyLink('contacto')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contacto
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyLink('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Preguntas frecuentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyLink('garantia')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Política de garantía
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyLink('reembolsos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Política de cambios y reembolsos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyLink('terminos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Términos y condiciones
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyLink('privacidad')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Política de privacidad
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support & Payment Methods Column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Atención Directa
            </h3>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola UPCLIC, deseo realizar una consulta comercial.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Oficial</span>
            </a>

            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span>Instagram: {INSTAGRAM_DISPLAY}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={MERCADO_LIBRE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span>Tienda Mercado Libre</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Medios de Pago Disponibles
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Mercado Pago (Yape, Tarjetas de crédito/débito y PagoEfectivo)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin Link */}
        <div className="mt-10 pt-6 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7DB2FF]" />
            <span>
              © {new Date().getFullYear()} UPCLIC. Todos los derechos reservados.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" /> Compra segura SSL
            </span>
            <button
              onClick={goToAdmin}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              title="Acceso restringido para administradores"
            >
              <Settings className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
