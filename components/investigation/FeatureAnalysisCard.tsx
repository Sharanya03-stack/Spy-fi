'use client';

import React from 'react';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import { BarChart2 } from 'lucide-react';

export interface FeatureAnalysisCardProps {
  threat: ThreatEvent;
}

export const FeatureAnalysisCard: React.FC<FeatureAnalysisCardProps> = ({ threat }) => {
  const features = [
    {
      name: 'Destination Port Diversity',
      observed: threat.destinationPortCount,
      baseline: 1,
      unit: 'ports',
      deviation: `+${(threat.destinationPortCount * 100).toFixed(0)}%`,
    },
    {
      name: 'Connection Request Frequency',
      observed: Math.round(threat.connectionAttempts / Math.max(1, threat.flowDuration)),
      baseline: 15,
      unit: 'req/s',
      deviation: `+${Math.round(((threat.connectionAttempts / threat.flowDuration) / 15) * 100)}%`,
    },
    {
      name: 'Flow Duration Intensity',
      observed: Number(threat.flowDuration.toFixed(1)),
      baseline: 2.5,
      unit: 'seconds',
      deviation: `+${Math.round((threat.flowDuration / 2.5) * 100)}%`,
    },
    {
      name: 'Statistical Anomaly Z-Score',
      observed: Number((threat.riskScore / 20).toFixed(1)),
      baseline: 0.8,
      unit: 'Z-score',
      deviation: `+${Math.round(((threat.riskScore / 20) / 0.8) * 100)}%`,
    },
  ];

  return (
    <Card className="p-6 border-slate-800/80 bg-[#121925]/95 shadow-soc-panel">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-cyan-400" /> FEATURE BASELINE DEVIATION ANALYSIS
        </h3>
        <span className="text-[10px] font-mono text-slate-400">OBSERVED VS LEARNT BASELINE</span>
      </div>

      <div className="space-y-5">
        {features.map((f, i) => (
          <div key={i} className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-semibold">{f.name}</span>
              <span className="text-amber-400 font-bold">{f.deviation} over baseline</span>
            </div>

            {/* Observed Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Observed: {f.observed} {f.unit}</span>
                <span className="text-amber-400 font-bold">Anomalous</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#090D16] overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-[85%]" />
              </div>
            </div>

            {/* Baseline Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Normal Baseline: {f.baseline} {f.unit}</span>
                <span>Normal</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#090D16] overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-500/60 rounded-full w-[20%]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
