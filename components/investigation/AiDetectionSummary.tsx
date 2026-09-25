'use client';

import React from 'react';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import { Brain, HelpCircle, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export interface AiDetectionSummaryProps {
  threat: ThreatEvent;
}

export const AiDetectionSummary: React.FC<AiDetectionSummaryProps> = ({ threat }) => {
  const isRealMl = threat.detectionSource === 'ml';

  const getWhyExplanation = () => {
    if (threat.summary) {
      return threat.summary;
    }
    switch (threat.threatType) {
      case 'PORT_SCAN':
        return `Traffic was classified as PORT_SCAN because the initiating source host (${threat.sourceIp}) executed high-velocity connection attempts across multiple destination ports, significantly exceeding the benign baseline flow profile.`;
      case 'DOS_DDOS':
      case 'DOS':
        return `Traffic was classified as DOS because ingress packet volume and byte throughput reached critical threshold levels, indicating an active volume flood targeted at ${threat.destinationIp}.`;
      case 'BRUTE_FORCE':
        return `Traffic was classified as BRUTE_FORCE due to repetitive high-frequency connection attempts targeted at authentication service ports without payload transmission.`;
      case 'ANOMALY':
      case 'TRAFFIC_ANOMALY':
      default:
        return `Traffic was classified as ANOMALY because flow duration, packet velocity, and payload parameters exhibited statistically significant Z-score deviations from standard benign training baselines.`;
    }
  };

  return (
    <Card className="p-6 border-slate-800/80 bg-[#121925]/95 shadow-soc-panel relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Brain className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-mono uppercase font-extrabold text-white tracking-wider">
            AI DETECTION SUMMARY & DECISION SUPPORT
          </h3>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Question 1: WHY WAS THIS FLAGGED? */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
            <HelpCircle className="h-4 w-4" /> WHY WAS THIS FLAGGED?
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {getWhyExplanation()}
          </p>
        </div>

        {/* Question 2: HOW CONFIDENT? */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-[#090D16] border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase mb-1">
              <Sparkles className="h-4 w-4" /> HOW CONFIDENT?
            </div>
            <span className="text-[10px] font-mono text-slate-400 block">MODEL CONFIDENCE SCORE</span>
          </div>
          <div className="mt-2 font-mono">
            <span className="text-3xl font-extrabold text-cyan-400">{threat.confidence}%</span>
            <div className="w-full h-1.5 rounded-full bg-slate-900 border border-slate-800 mt-2 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${Math.min(100, threat.confidence)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question 3: HOW SUSPICIOUS? */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-[#090D16] border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase mb-1">
              <ShieldAlert className="h-4 w-4" /> HOW SUSPICIOUS?
            </div>
            <span className="text-[10px] font-mono text-slate-400 block">MODEL SUSPICION RATING</span>
          </div>
          <div className="mt-2 font-mono">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-amber-400">{threat.riskScore}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 font-bold block mt-1 uppercase">
              {threat.riskScore >= 85 ? 'HIGH DEVIATION' : 'ELEVATED SUSPICION'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
