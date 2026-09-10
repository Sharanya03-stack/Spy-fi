import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Severity, TrafficStatus } from '@/lib/types/network';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'normal' | 'info' | 'medium' | 'high' | 'critical' | 'neutral';
  severity?: Severity;
  status?: TrafficStatus;
  dot?: boolean;
  size?: 'sm' | 'md';
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
  // Infer variant from severity or status if not explicitly passed
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
        resolvedVariant = 'normal';
        break;
      case 'ANOMALOUS':
        resolvedVariant = 'medium';
        break;
      case 'SUSPICIOUS':
        resolvedVariant = 'high';
        break;
    }
  }

  const variantStyles = {
    normal: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    info: 'bg-sky-950/60 text-sky-400 border-sky-800/60',
    medium: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    high: 'bg-orange-950/60 text-orange-400 border-orange-800/60',
    critical: 'bg-rose-950/60 text-rose-400 border-rose-800/60',
    neutral: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
  };

  const dotColors = {
    normal: 'bg-emerald-400',
    info: 'bg-sky-400',
    medium: 'bg-amber-400',
    high: 'bg-orange-400',
    critical: 'bg-rose-400',
    neutral: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-mono tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1 font-mono tracking-wide',
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
