'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, Clock, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useSimulation } from '@/lib/simulation/simulationStore';

function formatTimeAgo(isoString: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export const LiveThreatFeed: React.FC = () => {
  const { threats } = useSimulation();

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4 mb-2 border-b border-slate-800/80">
        <div>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            LIVE THREAT FEED
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 font-mono">
            Real-time cyber threat detections (Select incident for XAI workspace)
          </CardDescription>
        </div>

        <Link
          href="/threats"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
        >
          View All ({threats.length}) <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <div className="space-y-3 mt-4">
        {threats.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800/80 rounded-xl bg-[#090D16]">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-90" />
            <p className="text-sm font-semibold text-slate-200 font-mono">NO ACTIVE THREATS DETECTED</p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Monitoring continues across all available unidirectional telemetry streams
            </p>
          </div>
        ) : (
          threats.slice(0, 5).map((threat) => (
            <Link
              key={threat.id}
              href={`/threats/${threat.id}`}
              className="block group focus:outline-none"
            >
              <div
                className={`p-4 rounded-xl bg-[#0F1623] border border-slate-800/80 hover:border-cyan-500/40 hover:bg-[#121B2C] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group-hover:shadow-soc-subtle ${
                  threat.severity === 'CRITICAL' ? 'border-l-4 border-l-rose-500' :
                  threat.severity === 'HIGH' ? 'border-l-4 border-l-orange-500' :
                  threat.severity === 'MEDIUM' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-sky-500'
                }`}
              >
                {/* Left: Severity & Title */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Badge severity={threat.severity} size="sm" dot />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {threat.title}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {threat.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                      <span>
                        Src: <strong className="text-slate-200">{threat.sourceIp}</strong>
                      </span>
                      <span>→</span>
                      <span>
                        Dst: <strong className="text-slate-200">{threat.destinationIp}</strong>
                      </span>
                      <span>•</span>
                      <span>{threat.destinationPortCount} ports</span>
                    </div>
                  </div>
                </div>

                {/* Right: Provenance, Confidence & Time */}
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60 shrink-0 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      {threat.detectionSource === 'ml' ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Cpu className="h-2.5 w-2.5" /> REAL ML
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" /> SIMULATION
                        </span>
                      )}
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {threat.confidence}% Conf
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatTimeAgo(threat.detectedAt)}
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>

              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
};
