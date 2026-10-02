import React from 'react';
import { ExternalLink } from 'lucide-react';

interface TrustpilotWidgetProps {
  variant?: 'badge' | 'bar' | 'card' | 'micro' | 'full';
  className?: string;
  showLink?: boolean;
}

export const TrustpilotStarIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="24" height="24" rx="4" fill="#00B67A" />
    <path
      d="M12 4.5L14.2 9.1L19.2 9.8L15.6 13.3L16.4 18.3L12 15.9L7.6 18.3L8.4 13.3L4.8 9.8L9.8 9.1L12 4.5Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const TrustpilotLogo: React.FC<{ className?: string; theme?: 'light' | 'dark' }> = ({
  className = 'h-5 w-auto',
  theme = 'light'
}) => (
  <div className={`inline-flex items-center gap-1.5 font-sans font-bold tracking-tight ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0">
      <path
        d="M12 2L14.7 8.5H21.5L16 12.8L18.1 19.5L12 15.2L5.9 19.5L8 12.8L2.5 8.5H9.3L12 2Z"
        fill="#00B67A"
      />
      <path
        d="M12 2L14.7 8.5L12 15.2V2Z"
        fill="#005128"
      />
    </svg>
    <span className={`text-sm sm:text-base font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      Trustpilot
    </span>
  </div>
);

export const TrustpilotStars: React.FC<{ count?: number; size?: 'sm' | 'md' | 'lg' }> = ({
  count = 5,
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${sizeMap[size]} bg-[#00B67A] rounded-[2px] flex items-center justify-center p-0.5 shadow-xs`}>
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full text-white">
            <path d="M8 1.5L9.8 5.4L14 6L10.9 9L11.6 13.2L8 11.2L4.4 13.2L5.1 9L2 6L6.2 5.4L8 1.5Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export const TrustpilotWidget: React.FC<TrustpilotWidgetProps> = ({
  variant = 'badge',
  className = '',
  showLink = true
}) => {
  const trustpilotUrl = 'https://www.trustpilot.com/review/upclic.pe';

  // 1. Micro Badge (For header, checkout, product details)
  if (variant === 'micro') {
    return (
      <a
        href={trustpilotUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-xs hover:border-[#00B67A] transition-all group ${className}`}
        title="Ver valoraciones en Trustpilot"
      >
        <span className="font-semibold text-[11px] text-slate-700">Excelente</span>
        <TrustpilotStars count={5} size="sm" />
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900 border-l border-slate-200 pl-1.5">
          <span className="text-[#00B67A]">★</span>
          <span>Trustpilot</span>
        </div>
      </a>
    );
  }

  // 2. Bar (For top banner or section dividers)
  if (variant === 'bar') {
    return (
      <div className={`py-3 px-4 bg-[#F8FAF8] border-y border-[#E2E8F0] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-700 ${className}`}>
        <span className="font-bold text-slate-900">Excelente</span>
        <TrustpilotStars count={5} size="sm" />
        <span className="text-slate-600 font-medium">
          Valoración <strong className="text-slate-900">4.8 / 5</strong> basada en <strong className="text-slate-900">180+ opiniones</strong>
        </span>
        <a
          href={trustpilotUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-[#005128] hover:underline"
        >
          <TrustpilotLogo className="h-4" />
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    );
  }

  // 3. Card (For TrustSection or sidebar)
  if (variant === 'card') {
    return (
      <a
        href={trustpilotUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`p-5 rounded-xl bg-white text-slate-900 border border-slate-200 hover:border-[#00B67A] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${className}`}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <TrustpilotLogo theme="light" />
            <span className="text-[11px] font-bold text-[#00B67A] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Verificado
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <TrustpilotStars count={5} size="md" />
            <span className="text-sm font-extrabold text-slate-900">4.8 / 5</span>
          </div>
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            Puntuación <strong>Excelente</strong> en Trustpilot basada en clientes reales y verificados de software y licencias.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00B67A] group-hover:underline">
          <span>Ver opiniones en Trustpilot</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </a>
    );
  }

  // 4. Default Badge
  return (
    <a
      href={trustpilotUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white text-slate-900 border border-slate-200 hover:border-[#00B67A] shadow-xs hover:shadow-sm transition-all group ${className}`}
      title="Ver calificaciones de clientes en Trustpilot"
    >
      <div className="flex flex-col items-start">
        <span className="text-xs font-bold text-slate-900">Excelente</span>
        <TrustpilotStars count={5} size="sm" />
      </div>
      <div className="border-l border-slate-200 pl-3 flex items-center gap-1.5">
        <TrustpilotLogo className="h-4.5" />
        {showLink && <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#00B67A]" />}
      </div>
    </a>
  );
};
