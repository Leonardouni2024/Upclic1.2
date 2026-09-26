import React from 'react';
import { ShieldCheck, Users, Headphones, Clock, CheckCircle2, MessageCircle, FileCheck2, Instagram, ExternalLink, Star } from 'lucide-react';
import { WHATSAPP_NUMBER, INSTAGRAM_URL, INSTAGRAM_DISPLAY } from '../products.ts';
import { TrustpilotStars, TrustpilotLogo } from './TrustpilotWidget.tsx';

export const TrustSection: React.FC = () => {
  const handleConsultWhatsApp = () => {
    const text = 'Hola UpClic, me gustaría consultar sobre una licencia de software para mi equipo. ¿Podrían asesorarme por favor?';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const trustPoints = [
    {
      title: 'Validación en Servidores Oficiales',
      description: 'Activación directa con los servidores de Microsoft y desarrolladores autorizados.'
    },
    {
      title: 'Garantía Escrita de Activación',
      description: 'Respaldamos tu compra con soporte personalizado y reposición inmediata si se requiere.'
    },
    {
      title: 'Referencias',
      description: 'Conoce opiniones y novedades en nuestro perfil oficial @upclic.peru.',
      isInstagram: true
    },
    {
      title: 'Excelente en Trustpilot (4.8/5)',
      description: 'Calificación sobresaliente respaldada por opiniones independientes de compradores verificados.',
      isTrustpilot: true
    }
  ];

  return (
    <section id="confianza-section" className="py-14 sm:py-20 bg-[#0B1F3A] text-white font-sans relative overflow-hidden">
      {/* Subtle geometric grid background */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center">
          
          {/* Left Column: Heading and narrative text */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Garantía UpClic • También en Mercado Libre</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Tu aliado en soluciones digitales
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Ofrecemos licencias y herramientas digitales para estudiantes, profesionales y empresas, con atención personalizada y soporte durante todo el proceso. También nos encuentras en Mercado Libre con ventas verificadas y garantía total.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="text-2xl sm:text-3xl font-black text-blue-400 tabular-nums">+100</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Licencias activas con éxito</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">99.8%</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Calificaciones positivas y soporte</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleConsultWhatsApp}
                className="px-5 py-3 rounded-lg bg-[#0067B8] hover:bg-[#005499] text-white font-bold text-sm transition-all duration-150 flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hablar con un asesor</span>
              </button>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-bold text-sm transition-all duration-150 flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
                title="Ver referencias en Instagram @upclic.peru"
              >
                <Instagram className="w-4 h-4" />
                <span>Referencias ({INSTAGRAM_DISPLAY})</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* Right Column: 4 Trust cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustPoints.map((point, index) => {
              if (point.isInstagram) {
                return (
                  <a
                    key={index}
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-xl bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-rose-900/20 border border-pink-500/40 hover:border-pink-400 transition-all flex flex-col justify-start group cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] flex items-center justify-center mb-3 text-white shadow-sm group-hover:scale-105 transition-transform">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors leading-snug">
                        {point.title}
                      </h4>
                      <ExternalLink className="w-3.5 h-3.5 text-pink-400 shrink-0 opacity-70 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-slate-300 font-normal leading-relaxed">
                      {point.description}
                    </p>
                    <span className="mt-2 text-[11px] font-bold text-pink-400 group-hover:underline">
                      Abrir @upclic.peru &rarr;
                    </span>
                  </a>
                );
              }

              if (point.isTrustpilot) {
                return (
                  <a
                    key={index}
                    href="https://www.trustpilot.com/review/upclic.pe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-[#00B67A]/50 hover:border-[#00B67A] transition-all flex flex-col justify-start group cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#00B67A] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                        <span className="text-base font-black">★</span>
                      </div>
                      <TrustpilotStars count={5} size="sm" />
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug flex items-center gap-1.5">
                        <span>{point.title}</span>
                      </h4>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0 opacity-70 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-slate-300 font-normal leading-relaxed">
                      {point.description}
                    </p>
                    <span className="mt-2 text-[11px] font-bold text-emerald-400 group-hover:underline flex items-center gap-1">
                      <span>Ver perfil en Trustpilot &rarr;</span>
                    </span>
                  </a>
                );
              }

              return (
                <div
                  key={index}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/40 transition-colors flex flex-col justify-start"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                    {point.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-normal leading-relaxed">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Accepted Payment Methods Band */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-medium">
            Métodos de pago aceptados con confirmación inmediata:
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold text-slate-300">
            <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15">Yape</span>
            <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15">Plin</span>
            <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15">BCP</span>
            <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15">BBVA</span>
            <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15">Interbank</span>
            <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15">Mercado Pago</span>
            <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15">Tarjetas Débito / Crédito</span>
          </div>
        </div>

      </div>
    </section>
  );
};
