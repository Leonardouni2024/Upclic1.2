import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Zap,
  Tv,
  Layers,
  Monitor,
  Palette,
  Briefcase
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '../products';
import { useCart } from '../context/CartContext';
import { ProductCategory } from '../types';

const AI_CATEGORY_LOGO = 'https://static.vecteezy.com/system/resources/thumbnails/068/082/380/small/artificial-intelligence-design-png.png';

export const Hero: React.FC = () => {
  const { setSelectedCategory, formatPrice } = useCart();

  const scrollToCatalog = (category?: ProductCategory) => {
    if (category) {
      setSelectedCategory(category);
    }
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const bentoCategories: {
    id: ProductCategory;
    eyebrow: string;
    title: string;
    desc: string;
    fromPrice: number;
    toneClass: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'streaming',
      eyebrow: 'A. ENTRETENIMIENTO DIGITAL',
      title: 'Streaming y Entretenimiento',
      desc: 'Prime Video, Netflix, HBO Max, Disney Plus, Crunchyroll, Paramount Plus y Apple TV.',
      fromPrice: 12,
      toneClass: 'bg-[#EEE9FF] text-[#5B3CC4]',
      icon: <Tv className="w-6 h-6" />
    },
    {
      id: 'office',
      eyebrow: 'B. OFIMÁTICA Y PRODUCTIVIDAD',
      title: 'Microsoft Office',
      desc: 'Office 365, Office 2024, Office 2021, Office 2019, Office 2016 y Office Standard.',
      fromPrice: 16,
      toneClass: 'bg-[#E6F0FF] text-[#1457C9]',
      icon: <Layers className="w-6 h-6" />
    },
    {
      id: 'windows',
      eyebrow: 'C. SISTEMAS OPERATIVOS',
      title: 'Windows',
      desc: 'Claves OEM, Retail y activación telefónica para Windows 11, Windows 10 y Windows 8.1.',
      fromPrice: 16,
      toneClass: 'bg-[#DDF5EF] text-[#0B7A64]',
      icon: <Monitor className="w-6 h-6" />
    },
    {
      id: 'ia',
      eyebrow: 'D. HERRAMIENTAS IA',
      title: 'Inteligencia Artificial',
      desc: 'Suscripciones autorizadas a Google Gemini AI Pro con 5 TB en Google One Cloud.',
      fromPrice: 20,
      toneClass: 'bg-[#E6F0FF] text-[#1457C9]',
      icon: (
        <img
          src={AI_CATEGORY_LOGO}
          alt="Inteligencia Artificial"
          className="w-8 h-8 object-contain"
        />
      )
    },
    {
      id: 'diseno',
      eyebrow: 'E. CREATIVIDAD DIGITAL',
      title: 'Diseño y Edición',
      desc: 'Canva Pro en tu correo personal, CorelDRAW Graphics Suite 2024, CapCut y más.',
      fromPrice: 10,
      toneClass: 'bg-[#FFF0D9] text-[#B25E00]',
      icon: <Palette className="w-6 h-6" />
    },
    {
      id: 'profesional',
      eyebrow: 'F. INGENIERÍA Y SEGURIDAD',
      title: 'Software Profesional y Seguridad',
      desc: 'Microsoft Project, Visio, McAfee AntiVirus, Duolingo Super y packs corporativos.',
      fromPrice: 24,
      toneClass: 'bg-[#EEE9FF] text-[#5B3CC4]',
      icon: <Briefcase className="w-6 h-6" />
    }
  ];

  return (
    <section className="relative bg-[#F4F7FB] text-slate-900 pt-6 pb-12 lg:pt-10 lg:pb-16 border-b border-slate-200/80 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Hero Banner */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F0FF] border border-blue-200 text-[#1457C9] text-xs font-bold tracking-wide mb-5">
            <span className="w-2 h-2 rounded-full bg-[#1668E3]"></span>
            TIENDA OFICIAL DE SOFTWARE Y SUSCRIPCIONES EN PERÚ
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.1] mb-4 text-[#0B1F3A]">
            Todo lo digital, <span className="text-[#1668E3]">en un solo lugar.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#475569] mb-7 max-w-2xl font-normal leading-relaxed">
            Descubre software, entretenimiento y herramientas digitales con atención personalizada y entrega digital.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-7">
            <button
              onClick={() => scrollToCatalog('all')}
              className="px-7 py-4 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Explorar Catálogo Digital</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola UPCLIC, deseo asesoría para comprar un producto digital.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-[#0B1F3A] font-bold text-sm sm:text-base border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-[#1668E3]" />
              <span>Atención por WhatsApp</span>
            </a>
          </div>

          {/* Trust Micro-bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-slate-200/90 text-xs font-semibold text-[#475569]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1668E3] shrink-0" />
              <span>Precios claros en Soles (S/)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1668E3] shrink-0" />
              <span>Guía paso a paso incluida</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1668E3] shrink-0" />
              <span>Pagos con Yape, Plin y Tarjeta</span>
            </div>
          </div>
        </div>

        {/* 6-Category Bento Grid */}
        <div className="mt-10 sm:mt-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1668E3] block">
                Organización del catálogo
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
                Categorías Principales UPCLIC
              </h2>
            </div>
            <button
              onClick={() => scrollToCatalog('all')}
              className="text-xs sm:text-sm font-bold text-[#1668E3] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Ver todo el catálogo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bentoCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => scrollToCatalog(cat.id)}
                className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${cat.toneClass}`}>
                    {cat.icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                      {cat.eyebrow}
                    </span>
                    <h3 className="text-lg font-bold text-[#0B1F3A] group-hover:text-[#1668E3] transition-colors leading-snug">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-[#475569] leading-relaxed">
                  {cat.desc}
                </p>

                <div className="mt-auto pt-4 border-t border-[#E2E8F0] flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Desde</span>
                    <span className="text-xl font-extrabold text-[#0B1F3A] tracking-tight">
                      {formatPrice(cat.fromPrice)}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1668E3] bg-[#EEF4FF] group-hover:bg-[#DCE9FF] px-4 py-2 rounded-full transition-all">
                    Explorar <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dark Trust Bar (Entrega / Garantía) */}
          <div className="mt-5 bg-[#0B1F3A] rounded-[20px] p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 text-[#CBD5E1]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-white/10 text-[#7DB2FF] flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-base font-bold flex items-center gap-2.5">
                  <span>Entrega Digital Verificada</span>
                  <span className="text-[11px] font-bold text-[#4ADE80] bg-[#4ADE80]/15 px-2.5 py-0.5 rounded-full">
                    Correo y WhatsApp
                  </span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Recibe tus claves de licencia, enlaces de activación o accesos verificados junto con instrucciones claras paso a paso tras la confirmación de tu pago.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-white/10 text-[#7DB2FF] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-base font-bold flex items-center gap-2.5">
                  <span>Garantía y Soporte en Perú</span>
                  <span className="text-[11px] font-bold text-[#4ADE80] bg-[#4ADE80]/15 px-2.5 py-0.5 rounded-full">
                    Atención Directa
                  </span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Especificamos con total transparencia el tipo de licencia (OEM, Retail o suscripción) y te acompañamos por WhatsApp durante tu instalación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
