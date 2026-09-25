'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, CheckCircle2, Play, Check, Cpu, Sparkles } from 'lucide-react';
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
        <Link href="/threats" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Threat Detection Center
        </Link>
        <span>/</span>
        <span className="text-slate-400">Investigation Workspace</span>
        <span>/</span>
        <span className="text-slate-200 font-bold">{threat.id}</span>
      </nav>

      {/* Main Header Banner */}
      <div className="p-6 rounded-2xl bg-[#121925]/95 border border-slate-800/80 shadow-soc-panel backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Title & Badges */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-1 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-slate-300">{threat.id}</span>
                <Badge severity={threat.severity} size="sm" dot />
                <Badge variant="neutral" size="sm">
                  {threat.protocol} PROTOCOL
                </Badge>
                {threat.detectionSource === 'ml' ? (
                  <Badge variant="normal" size="sm" className="font-mono bg-emerald-950 text-emerald-400 border-emerald-500/50 flex items-center gap-1">
                    <Cpu className="h-3 w-3" /> REAL ML INFERENCE
                  </Badge>
                ) : (
                  <Badge variant="cyan" size="sm" className="font-mono text-cyan-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> DEMO SIMULATION
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                THREAT WORKSPACE: {threat.title}
              </h1>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="flex items-center gap-6 text-right font-mono border-l border-slate-800/80 pl-6">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">AI CONFIDENCE</span>
              <span className="text-2xl font-bold text-cyan-400">{threat.confidence}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">RISK SCORE</span>
              <span className="text-2xl font-bold text-amber-400">{threat.riskScore} <span className="text-xs text-slate-500">/ 100</span></span>
            </div>
          </div>
        </div>

        {/* Workflow Analyst Actions Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400">
            <span>Threat Status:</span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded text-xs uppercase ${
                threat.status === 'NEW'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                  : threat.status === 'INVESTIGATING'
                  ? 'bg-orange-950 text-orange-400 border border-orange-800'
                  : threat.status === 'ACKNOWLEDGED'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
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
              Investigate
            </Button>

            <Button
              variant={threat.status === 'RESOLVED' ? 'success' : 'cyan'}
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
