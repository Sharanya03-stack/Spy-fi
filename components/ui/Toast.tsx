'use client';

import React, { useEffect } from 'react';
import { ShieldAlert, X, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ToastAlert } from '@/lib/simulation/simulationStore';
import { useRouter } from 'next/navigation';

export interface ToastProps {
  toast: ToastAlert | null;
  onClose: () => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toast, onClose }) => {
  const router = useRouter();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000); // Auto dismiss after 6s
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-xl bg-slate-900/95 border border-rose-500/50 shadow-soc-alert p-4 text-white backdrop-blur-md relative overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="h-9 w-9 rounded-lg bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
            <ShieldAlert className="h-5 w-5 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge severity={toast.severity} size="sm" dot />
              <span className="text-xs font-mono text-slate-400 uppercase">
                {toast.threatType.replace('_', ' ')}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white truncate">{toast.title}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
              {toast.message}
            </p>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              <span>Source: <strong className="text-slate-200">{toast.sourceIp}</strong></span>
              <button
                onClick={() => {
                  onClose();
                  router.push(`/threats/${toast.threatId}`);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline"
              >
                Inspect Threat <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            aria-label="Dismiss alert notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
