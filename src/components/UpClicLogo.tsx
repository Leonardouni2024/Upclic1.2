import React from 'react';

interface UpClicLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark';
}

export const UpClicLogo: React.FC<UpClicLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'light'
}) => {
// Responsive size mappings for fluid mobile & PC viewing - compact & perfectly visible
  const sizeConfig = {
    sm: {
      emblem: 'w-5.5 h-5.5 sm:w-6 sm:h-6',
      text: 'text-[14px] sm:text-[16px]',
      subtitle: 'text-[5.5px] sm:text-[6.5px]',
      gap: 'gap-1.5 sm:gap-2',
      sparkleTop: '-top-1.5 sm:-top-2',
      sparkleRay: 'w-[1px] h-[2.8px] sm:h-[3.2px]',
      sparkleRayCenter: 'w-[1px] h-[3.5px] sm:h-[4px]',
      sparkleOffset: '1.2',
    },
    md: {
      // Made slightly more compact so it fits cleanly in header and mobile views without clipping
      emblem: 'w-6.5 h-6.5 xs:w-7 xs:h-7 sm:w-7.5 sm:h-7.5 md:w-8 md:h-8',
      text: 'text-[17px] xs:text-[18px] sm:text-[20px] md:text-[22px]',
      subtitle: 'text-[6.5px] xs:text-[7px] sm:text-[7.5px] md:text-[8px]',
      gap: 'gap-1.5 sm:gap-2',
      sparkleTop: '-top-1.5 xs:-top-2 sm:-top-2.5',
      sparkleRay: 'w-[1.2px] sm:w-[1.5px] h-[3px] sm:h-[3.8px]',
      sparkleRayCenter: 'w-[1.2px] sm:w-[1.5px] h-[3.8px] sm:h-[4.8px]',
      sparkleOffset: '1.5',
    },
    lg: {
      emblem: 'w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10',
      text: 'text-[22px] sm:text-[25px] md:text-[27px]',
      subtitle: 'text-[7.5px] sm:text-[8.5px] md:text-[9.5px]',
      gap: 'gap-2 sm:gap-2.5',
      sparkleTop: '-top-2.5 sm:-top-3',
      sparkleRay: 'w-[1.8px] h-[4px] sm:h-[5px]',
      sparkleRayCenter: 'w-[1.8px] h-[5px] sm:h-[6px]',
      sparkleOffset: '2',
    },
    xl: {
      emblem: 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
      text: 'text-[26px] sm:text-[32px] md:text-[36px]',
      subtitle: 'text-[9px] sm:text-[10.5px] md:text-[11.5px]',
      gap: 'gap-2.5 sm:gap-3',
      sparkleTop: '-top-3 sm:-top-4',
      sparkleRay: 'w-[2px] h-[5px] sm:h-[6.5px]',
      sparkleRayCenter: 'w-[2px] h-[6px] sm:h-[7.5px]',
      sparkleOffset: '2.5',
    }
  };

  const currentConfig = sizeConfig[size] || sizeConfig.md;

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${currentConfig.emblem} ${className}`}
        aria-label="UpClic"
      >
        <defs>
          <linearGradient id="upBlueSwoosh" x1="10%" y1="20%" x2="90%" y2="80%">
            <stop offset="0%" stopColor="#00A2FF" />
            <stop offset="60%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0046BA" />
          </linearGradient>

          <linearGradient id="upOrangeSwoosh" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E65100" />
            <stop offset="50%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>

          <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B4FF" />
            <stop offset="50%" stopColor="#0072FF" />
            <stop offset="100%" stopColor="#004CB8" />
          </linearGradient>

          <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#0046ba" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Dynamic Logo Emblem */}
        <g filter="url(#logoShadow)">
          {/* Inner Orange Ascending Arrow Ribbon */}
          <path
            d="M32 58C31 46 36 34 46 25L52 30L60 12L40 18L46 23C36 33 30 45 30 58C30 63 32 66 35 68C36 67 36 65 37 62C34 61 32 59 32 58Z"
            fill="url(#upOrangeSwoosh)"
          />
          {/* Orange Arrow Head Accent */}
          <path
            d="M62 10L42 16L48 21C38 31 33 43 32 56C34 54 37 52 40 50C42 40 47 31 55 24L61 29L62 10Z"
            fill="url(#upOrangeSwoosh)"
          />

          {/* Blue U-Swoosh with Arrow */}
          <path
            d="M24 38C22 46 23 55 27 63C32 72 40 77 49 76C54 75 58 72 61 68L56 63C53 66 50 67 47 67C41 68 35 64 32 58C29 52 28 45 30 38C30 36 29 35 28 35L24 38Z"
            fill="#0055D4"
          />
          <path
            d="M24 38C23 44 24 50 26 56C28 62 33 68 39 71C38 68 37 64 37 60C32 56 29 50 28 43C28 40 26 38 24 38Z"
            fill="#0046BA"
          />
          {/* Ascending Blue Arrow Arm */}
          <path
            d="M37 62C39 52 45 42 54 34L60 39L68 20L48 26L54 31C47 38 41 47 39 57C38 59 37 60 37 62Z"
            fill="url(#upBlueSwoosh)"
          />

          {/* Blue Pointer / Cursor Arrow (Overlapping bottom right) */}
          <path
            d="M50 48L68 64L59 66L65 78L59 81L53 69L46 75L50 48Z"
            fill="url(#cursorGradient)"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }

  // Full variant: Emblem + "UpClic" with radiant spark on the 'i'
  return (
    <div className={`inline-flex items-center ${currentConfig.gap} pt-1 pb-0.5 select-none shrink-0 overflow-visible ${className}`}>
      {/* Emblem SVG */}
      <svg
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${currentConfig.emblem}`}
      >
        <defs>
          <linearGradient id="logoBlueGrad" x1="0%" y1="30%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#0099FF" />
            <stop offset="60%" stopColor="#0062E0" />
            <stop offset="100%" stopColor="#0042B3" />
          </linearGradient>

          <linearGradient id="logoOrangeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E65100" />
            <stop offset="50%" stopColor="#FF6A00" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>

          <linearGradient id="logoCursorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B4FF" />
            <stop offset="60%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0047BA" />
          </linearGradient>

          <filter id="badgeShadow" x="-15%" y="-15%" width="135%" height="135%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#00358a" floodOpacity="0.2" />
          </filter>
        </defs>

        <g filter="url(#badgeShadow)">
          {/* Orange ascending ribbon + arrow */}
          <path
            d="M58 8L38 14L44 19C34 29 29 42 29 55C32 54 36 52 39 50C40 40 46 30 53 23L59 28L58 8Z"
            fill="url(#logoOrangeGrad)"
          />

          {/* Blue U-loop base */}
          <path
            d="M20 34C17 44 18 55 24 64C29 72 38 76 47 75C53 74 58 70 61 65L56 61C53 64 49 66 45 66C38 66 31 62 28 55C25 48 25 40 27 33L20 34Z"
            fill="#0050C8"
          />

          {/* Blue ascending sweep + arrow */}
          <path
            d="M33 58C36 48 43 38 52 31L58 36L66 17L46 23L52 28C44 35 38 45 35 55C34 56 34 57 33 58Z"
            fill="url(#logoBlueGrad)"
          />

          {/* Mouse pointer click cursor */}
          <path
            d="M48 45L66 61L57 63L63 75L57 78L51 66L44 72L48 45Z"
            fill="url(#logoCursorGrad)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* Typography: Up in Blue, Clic in Orange with Sparkle on the 'i' */}
      <div className="flex flex-col justify-center shrink-0 overflow-visible">
        <div className={`flex items-baseline font-black tracking-tight leading-none overflow-visible ${currentConfig.text}`}>
          {/* 'Up' in bold Blue */}
          <span className="text-[#0062E0] font-black tracking-tight">Up</span>

          {/* 'Clic' in vibrant Orange */}
          <span className="relative text-[#FF6A00] font-black tracking-tight ml-0.5 overflow-visible">
            Cl
            <span className="relative inline-block overflow-visible">
              {/* Sparkle rays above 'i' dot */}
              <span className={`absolute ${currentConfig.sparkleTop} left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none`}>
                {/* Left ray */}
                <span className={`absolute ${currentConfig.sparkleRay} bg-[#FF9800] rounded-full -rotate-45 -translate-x-1.5 sm:-translate-x-2 -translate-y-0.5`}></span>
                {/* Center top ray */}
                <span className={`absolute ${currentConfig.sparkleRayCenter} bg-[#FF9800] rounded-full -translate-y-1 sm:-translate-y-1.5`}></span>
                {/* Right ray */}
                <span className={`absolute ${currentConfig.sparkleRay} bg-[#FF9800] rounded-full rotate-45 translate-x-1.5 sm:translate-x-2 -translate-y-0.5`}></span>
              </span>
              i
            </span>
            c
          </span>
        </div>

        {/* Small subtitle tag */}
        <span
          className={`${currentConfig.subtitle} font-bold uppercase tracking-wider sm:tracking-widest leading-none mt-0.5 whitespace-nowrap ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Licencias Digitales
        </span>
      </div>
    </div>
  );
};
