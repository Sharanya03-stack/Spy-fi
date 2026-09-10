'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, CheckCircle2, Play, Check } from 'lucide-react';
import { ThreatEvent, ThreatStatus } from '@/lib/types/network';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useSimulation } from '@/lib/simulation/simulationStore';

export interface InvestigationHeaderProps {
  threat: ThreatEvent;
}

export const InvestigationHeader: React.FC<InvestigationHeaderProps> = ({ threat }) => {
  const { updateThreatStatus } = useSimulation();

  const handleStatusUpdate = (status: ThreatStatus) => {
    updateThreatStatus(threat.id, status);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 select-none">
        <Link href="/threats" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Threat Detection Center
        </Link>
        <span>/</span>
        <span className="text-slate-500">Threat Investigation</span>
        <span>/</span>
        <span className="text-slate-200 font-bold">{threat.id}</span>
      </nav>

      {/* Main Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Title & Badges */}
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-orange-950/80 border border-orange-700/60 flex items-center justify-center text-orange-400 shrink-0 mt-1">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-slate-400">{threat.id}</span>
                <Badge severity={threat.severity} size="sm" dot />
                <Badge variant="neutral" size="sm">
                  {threat.protocol} PROTOCOL
                </Badge>
                {threat.detectionSource === 'ml' ? (
                  <Badge variant="normal" size="sm" className="font-mono bg-emerald-950 text-emerald-400 border-emerald-500/50">
                    REAL ML INFERENCE (UNSW-NB15)
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm" className="font-mono text-slate-400">
                    DEMO SIMULATION
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                THREAT INVESTIGATION: {threat.title}
              </h1>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="flex items-center gap-6 text-right font-mono border-l border-slate-800/80 pl-6">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">AI CONFIDENCE</span>
              <span className="text-xl font-bold text-emerald-400">{threat.confidence}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">RISK SCORE</span>
              <span className="text-xl font-bold text-orange-400">{threat.riskScore} / 100</span>
            </div>
          </div>
        </div>

        {/* Workflow Analyst Actions Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Current Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                threat.status === 'NEW'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : threat.status === 'INVESTIGATING'
                  ? 'bg-orange-950 text-orange-300 border border-orange-800'
                  : threat.status === 'ACKNOWLEDGED'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {threat.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={threat.status === 'ACKNOWLEDGED' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => handleStatusUpdate('ACKNOWLEDGED')}
              leftIcon={<Check className="h-3.5 w-3.5" />}
            >
              Acknowledge
            </Button>

            <Button
              variant={threat.status === 'INVESTIGATING' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => handleStatusUpdate('INVESTIGATING')}
              leftIcon={<Play className="h-3.5 w-3.5" />}
            >
              Start Investigation
            </Button>

            <Button
              variant={threat.status === 'RESOLVED' ? 'success' : 'primary'}
              size="sm"
              onClick={() => handleStatusUpdate('RESOLVED')}
              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
            >
              Mark Resolved
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
