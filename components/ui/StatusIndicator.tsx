import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface StatusIndicatorProps {
  status?: 'online' | 'warning' | 'critical' | 'offline';
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = 'online',
  label = 'Security Intelligence Online',
  className,
  size = 'md',
}) => {
  const colors = {
    online: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-rose-500',
    offline: 'bg-slate-500',
  };

  const borderColors = {
    online: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
    warning: 'border-amber-500/30 bg-amber-950/40 text-amber-300',
    critical: 'border-rose-500/30 bg-rose-950/40 text-rose-300',
    offline: 'border-slate-700 bg-slate-900 text-slate-400',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border backdrop-blur-sm font-mono font-medium select-none shadow-sm',
        borderColors[status],
        sizes[size],
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            colors[status]
          )}
        />
        <span className={cn('relative inline-flex rounded-full h-2 w-2', colors[status])} />
      </span>
      <span>{label}</span>
    </div>
  );
};
