'use client';

import React from 'react';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import { Brain, Info, Cpu, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface AiExplanationCardProps {
  threat: ThreatEvent;
}

export const AiExplanationCard: React.FC<AiExplanationCardProps> = ({ threat }) => {
  const isRealMl = threat.detectionSource === 'ml';

  const getSeverityRationale = () => {
    switch (threat.threatType) {
      case 'PORT_SCAN':
        return 'Categorized as HIGH severity SOC policy because the source host executed rapid systematic port probing consistent with network topology reconnaissance prior to targeted exploitation.';
      case 'DOS_DDOS':
      case 'DOS':
        return 'Categorized as CRITICAL severity SOC policy due to extreme volumetric packet rate escalation capable of saturating one-way receiving buffers and degrading protected downstream services.';
      case 'BRUTE_FORCE':
        return 'Categorized as HIGH severity SOC policy due to sustained repetitive connection attempts against authentication services without payload delivery.';
      case 'ANOMALY':
      case 'TRAFFIC_ANOMALY':
      default:
        return 'Categorized as MEDIUM severity SOC policy due to statistically significant deviation from learned operational baseline flow characteristics.';
    }
  };

  return (
    <Card className="p-6 border-violet-900/40 bg-[#121925]/95 shadow-soc-panel">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.15)]">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-mono uppercase font-extrabold text-white tracking-wider flex items-center gap-2">
              AI EXPLANATION
            </h3>
            <span className="text-[11px] font-mono text-violet-300 block">
              Why this flow was classified as {threat.title}
            </span>
          </div>
        </div>

        {isRealMl ? (
          <span className="text-[10px] font-mono text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)] flex items-center gap-1">
            <Cpu className="h-3 w-3" /> REAL ML INFERENCE (UNSW-NB15)
          </span>
        ) : (
          <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> DEMO SIMULATION
          </span>
        )}
      </div>

      {/* Transparency Method Banner */}
      <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800/80 mb-4 font-mono text-[11px] text-slate-400 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-200 font-bold uppercase block">EXPLAINABLE AI (XAI) METHODOLOGY</span>
          <span>Statistical baseline feature variance against UNSW-NB15 benign training distribution.</span>
          <span className="text-slate-400 block text-[10px] mt-0.5">
            Model Architecture: HistGradientBoostingClassifier (Macro F1 = 0.6288, Accuracy = 74.40%)
          </span>
        </div>
      </div>

      {/* Feature Explanations List */}
      {threat.explanationDetails && threat.explanationDetails.length > 0 ? (
        <div className="mb-4 space-y-2.5">
          <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
            FEATURE IMPORTANCE & DEVIATION BREAKDOWN:
          </span>
          <div className="space-y-3">
            {threat.explanationDetails.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-violet-400 font-bold uppercase text-xs">{exp.feature_name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    exp.impact === 'HIGH_RISK' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {exp.impact} ({exp.deviation_pct >= 0 ? '+' : ''}{exp.deviation_pct}%)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 py-1.5 border-y border-slate-800/60">
                  <div>Observed Telemetry: <strong className="text-white">{exp.observed_value}</strong></div>
                  <div>Benign Baseline: <strong className="text-slate-300">{exp.baseline_value}</strong></div>
                </div>

                <p className="text-slate-300 font-sans text-xs pt-0.5 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 mb-4 font-mono text-xs text-slate-300 leading-relaxed">
          {threat.summary}
        </div>
      )}

      {/* Severity Rationale */}
      <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 uppercase font-bold">SOC SEVERITY POLICY RATIONALE:</span>
          <Badge severity={threat.severity} size="sm" dot />
        </div>
        <p className="text-slate-300 leading-relaxed text-xs font-sans">
          {getSeverityRationale()}
        </p>
      </div>
    </Card>
  );
};
