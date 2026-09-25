import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Severity } from '@/lib/types/network';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  activeBorder?: boolean;
  severityBorder?: Severity;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, activeBorder = false, severityBorder, children, ...props }, ref) => {
    const severityBorderStyles = {
      CRITICAL: 'border-l-4 border-l-rose-500 border-t-slate-800/80 border-r-slate-800/80 border-b-slate-800/80',
      HIGH: 'border-l-4 border-l-orange-500 border-t-slate-800/80 border-r-slate-800/80 border-b-slate-800/80',
      MEDIUM: 'border-l-4 border-l-amber-500 border-t-slate-800/80 border-r-slate-800/80 border-b-slate-800/80',
      LOW: 'border-l-4 border-l-sky-500 border-t-slate-800/80 border-r-slate-800/80 border-b-slate-800/80',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-[#121925]/90 backdrop-blur-md border border-slate-800/80 shadow-soc-subtle p-6 transition-all duration-200 relative overflow-hidden',
          hoverable && 'hover:border-slate-700/90 hover:shadow-soc-panel hover:-translate-y-0.5',
          activeBorder && 'border-cyan-500/50 shadow-soc-glow',
          severityBorder && severityBorderStyles[severityBorder],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base sm:text-lg font-semibold tracking-tight text-slate-100 flex items-center gap-2', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs sm:text-sm text-slate-400 leading-relaxed', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('relative z-10', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center pt-4 border-t border-slate-800/60 mt-4', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';
