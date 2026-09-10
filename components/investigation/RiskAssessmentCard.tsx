'use client';

import React from 'react';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import { AlertTriangle, Cpu, ShieldCheck } from 'lucide-react';

export interface RiskAssessmentCardProps {
  threat: ThreatEvent;
}

export const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({ threat }) => {
  const isBenign = (threat.threatType as string) === 'BENIGN';
  const predictionStr = isBenign ? 'BENIGN' : 'MALICIOUS';

  // Risk contributing factors derived from threat parameters
  const riskFactors = [
    { name: 'Traffic Rate Velocity', weight: threat.severity === 'CRITICAL' ? 95 : 82 },
    { name: 'Port Probing / Target Scope', weight: threat.destinationPortCount > 20 ? 92 : 65 },
    { name: 'Connection Attempt Frequency', weight: Math.min(98, Math.round(threat.connectionAttempts / 4)) },
    { name: 'Baseline Feature Deviation', weight: Math.round(threat.confidence * 0.9) },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-400" /> RISK SCORE ASSESSMENT
        </h3>
        <span className="text-[10px] font-mono text-slate-400">0-100 INDEX</span>
      </div>

      {/* Main Risk Score Card */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">OVERALL RISK SCORE</span>
          <span className="text-3xl font-extrabold text-orange-400">{threat.riskScore}</span>
          <span className="text-slate-500 text-xs"> / 100</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-orange-400 block uppercase">
            {threat.riskScore >= 90 ? 'CRITICAL EXPOSURE' : threat.riskScore >= 75 ? 'HIGH RISK' : 'ELEVATED RISK'}
          </span>
          <span className="text-[10px] text-slate-500">Unidirectional Evaluation</span>
        </div>
      </div>

      {/* Explicit Separation of MODEL OUTPUT vs SOC POLICY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        {/* Model Output Box */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
            <Cpu className="h-3 w-3" /> MODEL OUTPUT
          </span>
          <div className="text-slate-300">
            Prediction: <strong className="text-white">{predictionStr}</strong>
          </div>
          <div className="text-slate-300">
            Confidence: <strong className="text-emerald-400">{threat.confidence}%</strong>
          </div>
          <div className="text-slate-300">
            Suspicion: <strong className="text-orange-400">{threat.riskScore}</strong>
          </div>
        </div>

        {/* SOC Policy Box */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> SOC POLICY
          </span>
          <div className="text-slate-300">
            Assigned Severity: <strong className="text-rose-400">{threat.severity}</strong>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Severity is assigned by SOC risk policy rules based on model threat type and suspicion score.
          </div>
        </div>
      </div>

      {/* Contributing Factors Breakdown */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-[10px] text-slate-400 font-bold uppercase block">CONTRIBUTING RISK FACTORS:</span>
        {riskFactors.map((rf, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300">{rf.name}</span>
              <span className="text-orange-400 font-bold">{rf.weight}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                style={{ width: `${rf.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
