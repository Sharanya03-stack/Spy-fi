import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'emerald' | 'cyan' | 'rose' | 'amber' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  className,
  glowColor = 'none',
  children,
  ...props
}) => {
  const glowStyles = {
    emerald: 'before:absolute before:-inset-px before:bg-gradient-to-r before:from-emerald-500/20 before:to-transparent before:rounded-xl before:-z-10',
    cyan: 'before:absolute before:-inset-px before:bg-gradient-to-r before:from-cyan-500/20 before:to-transparent before:rounded-xl before:-z-10',
    rose: 'before:absolute before:-inset-px before:bg-gradient-to-r before:from-rose-500/20 before:to-transparent before:rounded-xl before:-z-10',
    amber: 'before:absolute before:-inset-px before:bg-gradient-to-r before:from-amber-500/20 before:to-transparent before:rounded-xl before:-z-10',
    none: '',
  };

  return (
    <div
      className={cn(
        'relative rounded-xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/90 shadow-2xl p-6 transition-all duration-300',
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
