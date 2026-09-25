'use client';

import React from 'react';
import {
  Activity,
  Sliders,
  Cpu,
  ShieldAlert,
  Gauge,
  HelpCircle,
  FileCheck2,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface DetectionPipelineProps {
  activeStepIndex?: number;
  className?: string;
}

export const pipelineStages = [
  { id: 'traffic', label: 'TRAFFIC INGRESS', desc: 'One-way flow telemetry captured', icon: Activity },
  { id: 'extraction', label: 'FEATURE EXTRACTION', desc: 'Transformed into 9 native features', icon: Sliders },
  { id: 'inference', label: 'ML INFERENCE', desc: 'Evaluated by HistGradientBoosting', icon: Cpu },
  { id: 'classification', label: 'CLASSIFICATION', desc: 'Categorized into 4-class taxonomy', icon: ShieldAlert },
  { id: 'suspicion', label: 'SUSPICION SCORE', desc: 'Anomaly probability computed', icon: Gauge },
  { id: 'explainability', label: 'EXPLAINABILITY', desc: 'Baseline deviation analyzed', icon: HelpCircle },
  { id: 'risk', label: 'RISK ASSESSMENT', desc: 'SOC severity policy applied', icon: FileCheck2 },
  { id: 'response', label: 'ANALYST RESPONSE', desc: 'Phased advisory guidance generated', icon: UserCheck },
];

export const DetectionPipeline: React.FC<DetectionPipelineProps> = ({
  activeStepIndex = -1,
  className,
}) => {
  return (
    <div className={cn('p-6 rounded-2xl bg-[#121925]/95 border border-slate-800/80 shadow-soc-panel space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" /> END-TO-END DETECTION PIPELINE ARCHITECTURE
        </h3>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/40">
          UNIDIRECTIONAL IP TELEMETRY
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {pipelineStages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = activeStepIndex === idx;
          const isPassed = activeStepIndex > idx;

          return (
            <div
              key={stage.id}
              className={cn(
                'p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 relative',
                isActive
                  ? 'bg-cyan-950/90 border-cyan-500 shadow-soc-glow scale-[1.02]'
                  : isPassed
                  ? 'bg-[#090D16] border-slate-700 text-slate-300'
                  : 'bg-[#090D16]/60 border-slate-800/80 text-slate-500'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold opacity-60">0{idx + 1}</span>
                <div
                  className={cn(
                    'p-1.5 rounded-lg',
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : isPassed
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-900 text-slate-600'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div>
                <p
                  className={cn(
                    'text-[10px] font-mono font-bold uppercase leading-tight tracking-tight mb-1',
                    isActive ? 'text-cyan-300' : isPassed ? 'text-slate-200' : 'text-slate-400'
                  )}
                >
                  {stage.label}
                </p>
                <p className="text-[9px] font-sans text-slate-400 leading-tight line-clamp-2">
                  {stage.desc}
                </p>
              </div>

              {isActive && (
                <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
