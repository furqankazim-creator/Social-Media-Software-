import React from 'react';

export default function BrandLogo({
  size = 'md',
  showText = false,
  subtitle = null,
  isOnline = true,
  forceWhiteText = false
}) {
  const sizeMap = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl'
  };

  const svgSizeMap = {
    sm: 20,
    md: 24,
    lg: 28
  };

  const titleClass = forceWhiteText
    ? 'text-white'
    : 'text-slate-900 dark:text-white';

  const subtitleClass = forceWhiteText
    ? 'text-slate-300'
    : 'text-slate-500 dark:text-slate-400';

  return (
    <div className="flex items-center gap-3">
      {/* SVG Icon Emblem */}
      <div
        className={`${sizeMap[size] || sizeMap.md} bg-gradient-to-br from-[#3157d5] via-[#4f46e5] to-[#0f9d8a] p-0.5 shadow-md shadow-blue-600/20 shrink-0 flex items-center justify-center transition-transform hover:scale-105`}
      >
        <div className="w-full h-full bg-[#0d1527] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Glowing pulse aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-teal-400/20 blur-xs" />

          {/* Pulse wave & WP Monogram SVG */}
          <svg
            width={svgSizeMap[size] || 24}
            height={svgSizeMap[size] || 24}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Geometric Letter W */}
            <path
              d="M5 8L8.5 22L12 11L15.5 22L19 8"
              stroke="url(#wpGradient)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Geometric Letter P & Pulse Wave */}
            <path
              d="M20 8H25.5C27.433 8 29 9.567 29 11.5C29 13.433 27.433 15 25.5 15H20V24"
              stroke="url(#wpGradient)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Pulse Line Accent */}
            <circle cx="16" cy="18" r="1.5" fill="#38bdf8" />
            <path
              d="M2 26H9L12 21L15 28L18 24L20 26H30"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />

            <defs>
              <linearGradient id="wpGradient" x1="5" y1="8" x2="29" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa" />
                <stop offset="0.5" stopColor="#a5b4fc" />
                <stop offset="1" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-black text-base sm:text-lg ${titleClass} tracking-tight leading-none drop-shadow-xs`}>
              WorkPulse
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              PRO
            </span>
          </div>
          <div className={`text-[11px] ${subtitleClass} mt-1 flex items-center gap-1.5 leading-none font-medium`}>
            <span className="truncate">{subtitle || 'Akhtar Ali Hub'}</span>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
              title={isOnline ? 'Active & Synced' : 'Offline'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
