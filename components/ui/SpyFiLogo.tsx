'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SpyFiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const SpyFiLogo: React.FC<SpyFiLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-3 py-1.5 rounded-xl',
        'bg-gradient-to-r from-slate-950/90 via-[#0D111A]/95 to-slate-950/90',
        'backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400/60',
        'shadow-[0_0_15px_rgba(16,185,129,0.12)] hover:shadow-[0_0_22px_rgba(16,185,129,0.22)]',
        'transition-all duration-300 select-none',
        className
      )}
    >
      {/* Glassmorphic Shield Icon Container */}
      <div
        className={cn(
          'rounded-lg bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950',
          'border border-emerald-500/40 flex items-center justify-center text-emerald-400',
          'shadow-[0_0_10px_rgba(16,185,129,0.2)] group-hover:border-emerald-400 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.35)]',
          'transition-all shrink-0',
          size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9'
        )}
      >
        <Shield
          className={cn(
            'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]',
            size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-6 w-6' : 'h-4.5 w-4.5'
          )}
        />
      </div>

      {/* Prominent Neon/Emerald Wordmark & Subtitle */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={cn(
            'font-sans font-extrabold tracking-tight text-emerald-400',
            'drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]',
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
          )}
        >
          Spy-fi
        </span>
        {showSubtitle && (
          <span
            className={cn(
              'font-mono font-bold uppercase tracking-[0.18em] text-emerald-400/80 mt-0.5',
              size === 'sm' ? 'text-[7px]' : 'text-[8px] sm:text-[9px]'
            )}
          >
            UNIDIRECTIONAL SECURITY
          </span>
        )}
      </div>
    </div>
  );
};
