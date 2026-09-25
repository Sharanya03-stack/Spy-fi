'use client';

import React from 'react';
import { Server, Cpu, Database, Lock, ShieldCheck } from 'lucide-react';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';

export interface ThreatOverviewCardProps {
  threat: ThreatEvent;
}

export const ThreatOverviewCard: React.FC<ThreatOverviewCardProps> = ({ threat }) => {
  return (
    <Card className="p-6 border-slate-800/80 bg-[#121925]/95 shadow-soc-panel">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-400" /> THREAT TELEMETRY OVERVIEW
        </h3>
        <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40">
          <Lock className="h-3 w-3 inline mr-1" /> HARDWARE UNIDIRECTIONAL DIODE
        </span>
      </div>

      {/* Target Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">SOURCE IP</span>
          <span className="text-slate-100 font-bold text-sm">{threat.sourceIp}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">DESTINATION IP</span>
          <span className="text-slate-100 font-bold text-sm">{threat.destinationIp}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">PROTOCOL / FLOW</span>
          <span className="text-cyan-400 font-bold text-sm">{threat.protocol}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">FLOW DURATION</span>
          <span className="text-slate-100 font-bold text-sm">{threat.flowDuration}s</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">CONNECTION ATTEMPTS</span>
          <span className="text-amber-400 font-bold text-sm">{threat.connectionAttempts.toLocaleString()}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">PORTS TARGETED</span>
          <span className="text-amber-400 font-bold text-sm">{threat.destinationPortCount} Ports</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">ESTIMATED BYTES</span>
          <span className="text-slate-100 font-bold text-sm">
            {((threat.connectionAttempts * 512) / 1024).toFixed(1)} KB
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">TRAFFIC DIRECTION</span>
          <span className="text-emerald-400 font-bold text-xs uppercase">UNIDIRECTIONAL</span>
        </div>
      </div>

      {/* Unidirectional Flow Visualizer (Strictly 1-Way) */}
      <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 text-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase block mb-3">
          UNIDIRECTIONAL SECURITY BOUNDARY SCHEMATIC
        </span>

        <div className="grid grid-cols-11 gap-1 items-center py-2">
          {/* Source Host */}
          <div className="col-span-3 p-3 rounded-xl bg-[#121925] border border-slate-800">
            <Server className="h-4 w-4 text-slate-400 mx-auto mb-1" />
            <span className="text-[9px] font-mono text-slate-400 block">SOURCE NETWORK</span>
            <span className="text-xs font-mono font-bold text-slate-200">{threat.sourceIp}</span>
          </div>

          {/* Arrow 1 */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-3 border-y-transparent border-l-4 border-l-blue-500" />
            </div>
          </div>

          {/* AI Analysis Node */}
          <div className="col-span-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 shadow-soc-glow">
            <Cpu className="h-4 w-4 text-cyan-400 mx-auto mb-1 animate-pulse" />
            <span className="text-[9px] font-mono text-cyan-300 font-bold block">AI ENGINE</span>
            <span className="text-[10px] font-mono text-slate-400">Diode Inspection</span>
          </div>

          {/* Arrow 2 */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-3 border-y-transparent border-l-4 border-l-emerald-500" />
            </div>
          </div>

          {/* Destination Network */}
          <div className="col-span-3 p-3 rounded-xl bg-[#121925] border border-slate-800">
            <Database className="h-4 w-4 text-slate-400 mx-auto mb-1" />
            <span className="text-[9px] font-mono text-slate-400 block">PROTECTED NETWORK</span>
            <span className="text-xs font-mono font-bold text-slate-200">{threat.destinationIp}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
