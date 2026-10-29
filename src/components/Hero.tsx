import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { formatPrice, WHATSAPP_NUMBER } from '../products.ts';
import { ArrowRight, ShieldCheck, MessageCircle, CheckCircle2, Lock, Zap, Globe, Mail, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveCategory, navigateToHome, navigateToProduct, currentPath } = useCart();

  const handleScrollTo = (sectionId: string, category?: 'office' | 'windows' | 'combos' | 'all') => {
    if (category) {
      setActiveCategory(category);
    }
    if (currentPath !== '/') {
      navigateToHome();
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleWhatsAppSupport = () => {
    const text = 'Hola UpClic, deseo información y asesoría sobre las licencias originales de Microsoft Office.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="hero-section" className="relative bg-[#f8fafc] text-slate-900 font-sans pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-200/80 overflow-hidden">
      {/* Subtle architectural background grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Bento Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Main Bento Cell (7 cols): High-Impact Value Proposition */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden">
            {/* Subtle top Microsoft Blue accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0078d4] via-[#0078d4] to-[#d83b01]" />

            <div>
              {/* Discreet Floating Badge: Garantía de activación del 100% */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-800 text-xs font-semibold tracking-tight mb-6 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <ShieldCheck className="w-4 h-4 text-[#0078d4] shrink-0" />
                <span>Garantía de activación del 100% • Partner Digital Verificado</span>
              </div>

              {/* High-impact Headline focused on originality, instant delivery, and warranty */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-5">
                Licencias Originales de{' '}
                <span className="text-[#0078d4]">Microsoft Office</span> con Entrega Inmediata y Garantía Total
              </h1>

              {/* Short explanatory subtext */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
                Olvídate de activadores inseguros o suscripciones ocultas. Recibe una licencia 100% genuina, permanente de por vida y vinculada directamente a tu cuenta o servidor oficial de Microsoft en menos de 2 minutos.
              </p>

              {/* Primary and Secondary CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
                <button
                  id="hero-ver-catalogo-btn"
                  onClick={() => handleScrollTo('destacados-section')}
                  className="px-7 py-4 rounded-2xl bg-[#d83b01] hover:bg-[#b83201] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.99]"
                >
                  <span>Ver Licencias Disponibles</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  id="hero-whatsapp-support-btn"
                  onClick={handleWhatsAppSupport}
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 hover:border-[#0078d4] hover:text-[#0078d4] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 text-[#0078d4]" />
                  <span>Soporte por WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Bottom Micro-Trust Metrics inside Main Bento Cell */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">100% Genuino</div>
                  <div className="text-[11px] text-slate-500">Cero riesgos o virus</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Envío Digital</div>
                  <div className="text-[11px] text-slate-500">Clave al Email / WhatsApp</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0078d4]/10 text-[#0078d4] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Pago Único</div>
                  <div className="text-[11px] text-slate-500">Licencia vitalicia</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Bento Column (5 cols): Modular Bento Showcase */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 content-between">
            
            {/* Top Wide Bento Box: Official Microsoft Ecosystem Status */}
            <div className="sm:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  {/* Official 4-square Microsoft symbol */}
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0">
                    <span className="bg-[#f25022] block w-full h-full" />
                    <span className="bg-[#7fba00] block w-full h-full" />
                    <span className="bg-[#00a4ef] block w-full h-full" />
                    <span className="bg-[#ffb900] block w-full h-full" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Ecosistema Oficial Microsoft
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Servidores Activos
                </span>
              </div>

              {/* Suite App Pills Bento Row */}
              <div className="grid grid-cols-4 gap-2.5 my-2">
                {[
                  { name: 'Word', color: 'bg-[#185abd]', letter: 'W' },
                  { name: 'Excel', color: 'bg-[#107c41]', letter: 'X' },
                  { name: 'PowerPoint', color: 'bg-[#d24726]', letter: 'P' },
                  { name: 'Outlook', color: 'bg-[#0078d4]', letter: 'O' }
                ].map((app) => (
                  <div
                    key={app.name}
                    className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70 flex flex-col items-center justify-center text-center group hover:border-[#0078d4]/40 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl ${app.color} text-white font-black text-sm flex items-center justify-center shadow-2xs mb-1.5`}>
                      {app.letter}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">{app.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Descarga directa desde setup.office.com</span>
                <span className="font-bold text-[#0078d4]">32 / 64 Bits</span>
              </div>
            </div>

            {/* Bottom Left Bento Box: Flagship Office 2024 Quick Card */}
            <div
              onClick={() => navigateToProduct('office-2024-pro-plus')}
              className="bg-white rounded-3xl p-5 border-2 border-[#0078d4]/20 hover:border-[#0078d4] shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d83b01]/10 text-[#d83b01] text-[10px] font-extrabold uppercase tracking-wider">
                    Más Vendido
                  </span>
                  <span className="text-xs font-bold text-slate-400 line-through">
                    {formatPrice(110)}
                  </span>
                </div>
                <div className="w-full h-24 bg-slate-50 rounded-2xl p-2 mb-3 flex items-center justify-center border border-slate-100">
                  <img
                    src="/products/office-2024.webp"
                    alt="Office 2024 Professional Plus"
                    onError={(e) => { e.currentTarget.src = '/products/office-2024.png'; }}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#0078d4] transition-colors">
                  Office Pro Plus 2024
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Licencia permanente • 1 PC
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">{formatPrice(27)}</span>
                <span className="text-xs font-bold text-[#0078d4] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  Ver detalle <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Bottom Right Bento Box: Security & Verification Seal */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#0078d4] flex items-center justify-center text-white mb-3.5 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1">
                  Seguridad Verificada
                </div>
                <h3 className="text-base font-extrabold text-white leading-snug">
                  Activación Oficial sin Programas Externos
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Ingresa tu clave de 25 caracteres directamente en tu aplicación de Office o en el portal oficial de Microsoft.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Factura y Garantía por escrito</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

