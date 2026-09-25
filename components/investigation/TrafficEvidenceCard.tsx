'use client';

import React from 'react';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import { Terminal, ArrowRight, ShieldCheck, Cpu, Lock } from 'lucide-react';

export interface TrafficEvidenceCardProps {
  threat: ThreatEvent;
}

export const TrafficEvidenceCard: React.FC<TrafficEvidenceCardProps> = ({ threat }) => {
  const ppsRate = Math.round(threat.connectionAttempts / Math.max(0.1, threat.flowDuration));
  const byteRate = Math.round((threat.connectionAttempts * 512) / Math.max(0.1, threat.flowDuration));

  const telemetryMetrics = [
    { label: 'SOURCE IP', value: threat.sourceIp, subtext: 'Ingress Source' },
    { label: 'DESTINATION IP', value: threat.destinationIp, subtext: 'Protected Target' },
    { label: 'PROTOCOL', value: threat.protocol, subtext: 'Transport Layer' },
    { label: 'FLOW DURATION', value: `${threat.flowDuration.toFixed(2)}s`, subtext: 'Stream Duration' },
    { label: 'PACKET COUNT', value: threat.connectionAttempts.toLocaleString(), subtext: 'Ingress Packets' },
    { label: 'BYTE VOLUME', value: `${((threat.connectionAttempts * 512) / 1024).toFixed(1)} KB`, subtext: 'Ingress Payload' },
    { label: 'PACKET RATE', value: `${ppsRate.toLocaleString()} pkt/s`, subtext: 'Ingress Velocity' },
    { label: 'BANDWIDTH RATE', value: `${(byteRate / 1024).toFixed(1)} KB/s`, subtext: 'Source Throughput' },
  ];

  return (
    <Card className="p-6 border-slate-800/80 bg-[#121925]/95 shadow-soc-panel">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" /> EVIDENCE & TELEMETRY CORRELATION
        </h3>
        <span className="text-[10px] font-mono text-slate-400">
          STRICT ONE-WAY TELEMETRY FLOW
        </span>
      </div>

      {/* Strict Unidirectional Visual Schematic */}
      <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 mb-6 font-mono text-xs">
        <div className="text-[10px] text-slate-400 uppercase font-bold mb-3 flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-cyan-400" /> UNIDIRECTIONAL DIODE FLOW PIPELINE:
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-center">
          {/* Source Network */}
          <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-[#121925] border border-slate-800">
            <span className="text-[9px] text-slate-400 block uppercase">SOURCE NETWORK</span>
            <span className="text-xs font-bold text-white block mt-0.5">{threat.sourceIp}</span>
          </div>

          <div className="flex items-center text-cyan-400 font-bold px-1">
            <span className="text-[10px] text-slate-400 mr-1.5 hidden sm:inline">ONE-WAY FLOW</span>
            <ArrowRight className="h-5 w-5 text-cyan-400 animate-pulse" />
          </div>

          {/* AI Analysis */}
          <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300">
            <span className="text-[9px] text-cyan-400/80 block uppercase">AI INFERENCE</span>
            <span className="text-xs font-bold block mt-0.5 flex items-center justify-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" /> {threat.threatType}
            </span>
          </div>

          <div className="flex items-center text-cyan-400 font-bold px-1">
            <span className="text-[10px] text-slate-400 mr-1.5 hidden sm:inline">PROTECTED BOUNDARY</span>
            <ArrowRight className="h-5 w-5 text-cyan-400 animate-pulse" />
          </div>

          {/* Protected Network */}
          <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-[#121925] border border-slate-800">
            <span className="text-[9px] text-slate-400 block uppercase">PROTECTED TARGET</span>
            <span className="text-xs font-bold text-white block mt-0.5">{threat.destinationIp}</span>
          </div>
        </div>
      </div>

      {/* Extracted Telemetry Grid */}
      <div className="mb-6 space-y-2 font-mono">
        <span className="text-xs font-bold uppercase text-slate-400 block">EXTRACTED TELEMETRY EVIDENCE:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {telemetryMetrics.map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">{m.label}</span>
              <span className="text-sm font-extrabold text-slate-100">{m.value}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">{m.subtext}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Indicators Checklist */}
      <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> EVIDENCE INDICATORS:
        </h4>
        <ul className="space-y-2 text-xs text-slate-300">
          {threat.indicators.map((ind, idx) => (
            <li key={idx} className="flex items-center gap-2.5 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>{ind}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
