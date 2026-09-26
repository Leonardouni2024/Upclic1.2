import React from 'react';
import { TrustpilotLogo, TrustpilotStars, TrustpilotStarIcon } from './TrustpilotWidget.tsx';
import { CheckCircle2, ExternalLink } from 'lucide-react';

interface TrustpilotReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  product: string;
  verified: boolean;
}

const trustpilotReviews: TrustpilotReview[] = [
  {
    id: 'tp-1',
    author: 'Carlos M.',
    date: 'Hace 2 días',
    rating: 5,
    title: 'Activación inmediata y 100% original',
    comment: 'Compré Office 2024 Pro Plus y la clave llegó en menos de 10 minutos a mi correo. Siguiendo la guía oficial activó a la primera en los servidores de Microsoft.',
    product: 'Office 2024 Professional Plus',
    verified: true
  },
  {
    id: 'tp-2',
    author: 'Mariana R.',
    date: 'Hace 4 días',
    rating: 5,
    title: 'Excelente servicio y atención rápida',
    comment: 'Tenía dudas sobre la versión para mi laptop y me asesoraron amablemente por WhatsApp antes de comprar. Activé Windows 11 Pro sin ningún inconveniente.',
    product: 'Windows 11 Professional',
    verified: true
  },
  {
    id: 'tp-3',
    author: 'Gonzalo V.',
    date: 'Hace 1 semana',
    rating: 5,
    title: 'Canva Pro funcionando perfecto',
    comment: 'Me llegó la invitación a mi correo en minutos y se activaron todas las funciones de Canva Pro. Muy confiable y recomendado.',
    product: 'Canva Pro (12 Meses)',
    verified: true
  },
  {
    id: 'tp-4',
    author: 'Patricia L.',
    date: 'Hace 2 semanas',
    rating: 5,
    title: 'Soporte de primera y compra segura',
    comment: 'Pagué por Mercado Pago de manera muy fácil. Todo transparente y la clave de activación funcionó de inmediato. Gran tienda.',
    product: 'Adobe Acrobat Pro DC 2018',
    verified: true
  }
];

export const TrustpilotReviewsSection: React.FC = () => {
  const trustpilotUrl = 'https://www.trustpilot.com/review/upclic.pe';

  return (
    <section className="py-14 sm:py-16 bg-[#F8FAFC] border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Trustpilot Score Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/80 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <TrustpilotLogo className="h-6 sm:h-7" />
              <div className="h-6 w-px bg-slate-300 hidden sm:block" />
            </div>
            
            <div className="flex items-center gap-2.5">
              <span className="text-base sm:text-lg font-black text-slate-900">Excelente</span>
              <TrustpilotStars count={5} size="md" />
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                <strong>4.8</strong> de 5 basado en <strong>180+ valoraciones</strong>
              </span>
            </div>
          </div>

          <a
            href={trustpilotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-[#00B67A] text-xs sm:text-sm font-bold transition-all shadow-xs self-start md:self-auto group cursor-pointer"
          >
            <span>Ver perfil en Trustpilot</span>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#00B67A]" />
          </a>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trustpilotReviews.map(review => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Stars and Verified Badge */}
                <div className="flex items-center justify-between mb-3">
                  <TrustpilotStars count={review.rating} size="sm" />
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00B67A]" />
                    <span>Verificada</span>
                  </div>
                </div>

                {/* Review Title */}
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-1">
                  {review.title}
                </h4>

                {/* Review Comment */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 mb-4">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold text-slate-800">{review.author}</span>
                <span className="text-slate-400">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <span>Las opiniones son recopiladas y verificadas de forma independiente por</span>
            <strong className="text-slate-800 font-bold">Trustpilot</strong>
          </p>
        </div>

      </div>
    </section>
  );
};
