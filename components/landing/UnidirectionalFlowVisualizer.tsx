'use client';

import React from 'react';
import { Server, ArrowRight, ShieldCheck, Cpu, Database, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const UnidirectionalFlowVisualizer: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-slate-950/90 border border-slate-800/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header bar of visualizer */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-300 tracking-wide uppercase">
            LIVE TELEMETRY DIODE FEED
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="normal" size="sm" dot>
            ONE-WAY HARDWARE ISOLATED
          </Badge>
        </div>
      </div>

      {/* Diagram Layout: Source Network -> Unidirectional Diode / AI Analysis -> Destination Network */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
        
        {/* Node 1: Source Network */}
        <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative group hover:border-slate-700 transition-all">
          <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 mb-3 shadow-inner">
            <Server className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">SOURCE NETWORK</h4>
          <p className="text-xs text-slate-400 font-mono mt-1">Untrusted / External Zone</p>
          <div className="mt-3 px-3 py-1 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
            IP: 192.168.1.0/24
          </div>
        </div>

        {/* Node 2: Unidirectional Diode + AI Analysis Engine */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-emerald-950/20 border border-emerald-800/60 relative shadow-soc-glow">
          {/* Animated Particles flowing strictly Left to Right (or Top to Bottom on mobile) */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 overflow-hidden pointer-events-none opacity-40">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-flow-right" />
          </div>

          <div className="h-14 w-14 rounded-xl bg-emerald-950/80 border border-emerald-600/60 flex items-center justify-center text-emerald-400 mb-3 shadow-lg">
            <Cpu className="h-7 w-7 animate-pulse-subtle" />
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <h4 className="text-sm font-bold text-emerald-400">UNIDIRECTIONAL DIODE</h4>
          </div>
          <p className="text-xs text-emerald-300/80 font-mono text-center">
            Hardware One-Way + AI Threat Engine
          </p>

          <div className="mt-3 w-full grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="px-2.5 py-1 rounded bg-slate-950/90 border border-emerald-900/60 text-slate-300 text-center">
              Direction: <span className="text-emerald-400 font-semibold">Tx → Rx Only</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-slate-950/90 border border-emerald-900/60 text-slate-300 text-center">
              Latency: <span className="text-emerald-400 font-semibold">&lt; 1.2ms</span>
            </div>
          </div>
        </div>

        {/* Node 3: Protected Destination Network */}
        <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative group hover:border-slate-700 transition-all">
          <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 mb-3 shadow-inner">
            <Database className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">DESTINATION NETWORK</h4>
          <p className="text-xs text-slate-400 font-mono mt-1">High-Assurance / Critical Zone</p>
          <div className="mt-3 px-3 py-1 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
            IP: 10.0.0.0/16
          </div>
        </div>

      </div>

      {/* Footer status summary of visualizer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> Physical Airgap Integrity
          </span>
          <span className="text-slate-600">|</span>
          <span>Zero Backchannel Feedback</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>Flow Rate:</span>
          <span className="text-slate-200 font-semibold">12,482 PKT/S</span>
        </div>
      </div>
    </div>
  );
};
