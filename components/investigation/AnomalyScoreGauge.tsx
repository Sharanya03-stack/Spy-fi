'use client';

import React from 'react';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import { Brain } from 'lucide-react';

export interface AnomalyScoreGaugeProps {
  threat: ThreatEvent;
}

export const AnomalyScoreGauge: React.FC<AnomalyScoreGaugeProps> = ({ threat }) => {
  const anomalyScore = Number(
    Math.min(99.8, Math.max(50.0, threat.riskScore * 0.9 + threat.confidence * 0.1)).toFixed(1)
  );

  return (
    <Card className="p-6 flex flex-col justify-between border-slate-800/80 bg-[#121925]/95 shadow-soc-panel">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <Brain className="h-4 w-4 text-cyan-400" /> ANOMALY DETECTOR SCORE
        </h3>
        <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
          XAI SCORE
        </span>
      </div>

      {/* Gauge Meter */}
      <div className="flex flex-col items-center justify-center my-4 text-center">
        <div className="relative h-28 w-28 flex items-center justify-center rounded-full bg-[#090D16] border-4 border-slate-800 shadow-inner">
          <div
            className="absolute inset-0 rounded-full border-4 border-amber-400 transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% ${anomalyScore}%, 0 ${anomalyScore}%)`,
            }}
          />
          <div className="text-center font-mono z-10">
            <span className="text-2xl font-extrabold text-white">{anomalyScore}</span>
            <span className="text-[10px] text-slate-400 block">/ 100</span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 mt-3">
          HIGH ANOMALY DEVIATION
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed font-mono text-center">
        Anomaly scores represent statistical deviation from learned unidirectional traffic baseline metrics.
      </p>
    </Card>
  );
};
