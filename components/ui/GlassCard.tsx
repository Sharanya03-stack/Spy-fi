import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'emerald' | 'cyan' | 'rose' | 'amber' | 'violet' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  className,
  glowColor = 'none',
  children,
  ...props
}) => {
  const glowStyles = {
    emerald: 'before:absolute before:-inset-px before:bg-gradient-to-r before:from-emerald-500/15 before:to-transparent before:rounded-xl before:-z-10',
    cyan: 'before:absolute before:-inset-px before:bg-gradient-to-r before:from-cyan-500/15 before:to-transparent before:rounded-xl before:-z-10',
    rose: 'before:absolute before:-inset-px before:bg-gradient-to-r before:from-rose-500/15 before:to-transparent before:rounded-xl before:-z-10',
    amber: 'before:absolute before:-inset-px before:bg-gradient-to-r before:from-amber-500/15 before:to-transparent before:rounded-xl before:-z-10',
    violet: 'before:absolute before:-inset-px before:bg-gradient-to-r before:from-violet-500/15 before:to-transparent before:rounded-xl before:-z-10',
    none: '',
  };

  return (
    <div
      className={cn(
        'relative rounded-xl bg-[#121925]/85 backdrop-blur-xl border border-slate-800/80 shadow-soc-panel p-6 transition-all duration-200',
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
