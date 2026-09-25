'use client';

import React from 'react';
import { SocLayout } from '@/components/layout/SocLayout';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { IncidentTimeline } from '@/components/investigation/IncidentTimeline';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, ShieldAlert, FileCheck2 } from 'lucide-react';

export default function TimelinePage() {
  const { threats } = useSimulation();

  return (
    <SocLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-[#121925]/95 border border-slate-800/80 shadow-soc-panel flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                FORENSIC AUDIT TRAIL
              </span>
              <span className="text-[10px] font-mono text-slate-400">SOC TIMELINE LOGS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Clock className="h-7 w-7 text-cyan-400" /> INCIDENT RESPONSE AUDIT TIMELINE
            </h1>
          </div>

          <Badge variant="cyan" size="md">
            {threats.length} Active Incident Trajectories
          </Badge>
        </div>

        {threats.length === 0 ? (
          <Card className="p-12 text-center font-mono space-y-3 bg-[#0F1623]">
            <FileCheck2 className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200 uppercase">NO INCIDENT AUDIT TRAILS RECORDED</h3>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
              Auditable response trajectories generate automatically when threat incidents are detected and reviewed by analysts.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {threats.map((threat) => (
              <div key={threat.id} className="space-y-3">
                <div className="flex items-center justify-between px-1 font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-cyan-400" />
                    <span className="font-bold text-white text-sm">{threat.id}: {threat.title}</span>
                    <Badge severity={threat.severity} size="sm" dot />
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Status: <strong className="text-emerald-400">{threat.status}</strong>
                  </span>
                </div>

                <IncidentTimeline threat={threat} />
              </div>
            ))}
          </div>
        )}
      </div>
    </SocLayout>
  );
}
