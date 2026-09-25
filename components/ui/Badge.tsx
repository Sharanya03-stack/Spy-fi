import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Severity, TrafficStatus, ResponsePlanStatus } from '@/lib/types/network';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'normal' | 'info' | 'medium' | 'high' | 'critical' | 'neutral' | 'cyan' | 'violet';
  severity?: Severity;
  status?: TrafficStatus | ResponsePlanStatus | string;
  dot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  severity,
  status,
  dot = false,
  size = 'md',
  children,
  ...props
}) => {
  let resolvedVariant = variant || 'neutral';

  if (severity) {
    switch (severity) {
      case 'LOW':
        resolvedVariant = 'info';
        break;
      case 'MEDIUM':
        resolvedVariant = 'medium';
        break;
      case 'HIGH':
        resolvedVariant = 'high';
        break;
      case 'CRITICAL':
        resolvedVariant = 'critical';
        break;
    }
  } else if (status) {
    switch (status) {
      case 'NORMAL':
      case 'VERIFIED':
        resolvedVariant = 'normal';
        break;
      case 'ANOMALOUS':
      case 'PENDING':
      case 'VERIFYING':
        resolvedVariant = 'medium';
        break;
      case 'SUSPICIOUS':
      case 'APPROVED':
      case 'EXECUTED':
      case 'MODIFIED':
        resolvedVariant = 'cyan';
        break;
      case 'REJECTED':
      case 'VERIFICATION_FAILED':
        resolvedVariant = 'critical';
        break;
    }
  }

  const variantStyles = {
    normal: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    info: 'bg-sky-950/70 text-sky-400 border-sky-800/60',
    medium: 'bg-amber-950/70 text-amber-400 border-amber-800/60',
    high: 'bg-orange-950/70 text-orange-400 border-orange-800/60',
    critical: 'bg-rose-950/70 text-rose-400 border-rose-800/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    neutral: 'bg-slate-900/80 text-slate-300 border-slate-700/60',
    cyan: 'bg-cyan-950/70 text-cyan-400 border-cyan-800/60 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    violet: 'bg-violet-950/70 text-violet-400 border-violet-800/60 shadow-[0_0_10px_rgba(139,92,246,0.1)]',
  };

  const dotColors = {
    normal: 'bg-emerald-400',
    info: 'bg-sky-400',
    medium: 'bg-amber-400',
    high: 'bg-orange-400',
    critical: 'bg-rose-400',
    neutral: 'bg-slate-400',
    cyan: 'bg-cyan-400',
    violet: 'bg-violet-400',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-mono tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1 font-mono tracking-wide',
    lg: 'text-xs px-3 py-1.5 font-mono tracking-wider uppercase font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium select-none',
        variantStyles[resolvedVariant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full animate-pulse', dotColors[resolvedVariant])}
        />
      )}
      {children || severity || status}
    </span>
  );
};
