'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, Cpu, Activity, ShieldCheck, Flame } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useSimulation } from '@/lib/simulation/simulationStore';

export const ThreatSummaryCards: React.FC = () => {
  const { threats } = useSimulation();

  const total = threats.length;
  const realMlCount = threats.filter((t) => t.detectionSource === 'ml').length;
  const simCount = threats.filter((t) => t.detectionSource === 'simulation').length;
  const critical = threats.filter((t) => t.severity === 'CRITICAL').length;
  const high = threats.filter((t) => t.severity === 'HIGH').length;
  const medium = threats.filter((t) => t.severity === 'MEDIUM').length;
  const low = threats.filter((t) => t.severity === 'LOW').length;

  // Calculate Top Threat Type dynamically
  const typeCounts: Record<string, number> = {};
  threats.forEach((t) => {
    const formattedType = t.threatType.replace('_', ' ');
    typeCounts[formattedType] = (typeCounts[formattedType] || 0) + 1;
  });
  let topType = 'NONE';
  let maxCount = 0;
  Object.entries(typeCounts).forEach(([tType, cnt]) => {
    if (cnt > maxCount) {
      maxCount = cnt;
      topType = tType;
    }
  });

  if (total === 0) {
    return (
      <Card className="p-6 text-center border-slate-800 bg-slate-900/60">
        <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
        <h3 className="text-sm font-mono font-bold text-slate-200 uppercase">NO ACTIVE THREATS</h3>
        <p className="text-xs font-mono text-slate-400 mt-1">
          No suspicious traffic has been detected. Continue monitoring the network telemetry stream.
        </p>
      </Card>
    );
  }

  const cards = [
    {
      label: 'TOTAL THREATS',
      value: total,
      subtext: 'Cumulative Active Incidents',
      icon: ShieldAlert,
      color: 'text-slate-200',
      bgColor: 'bg-slate-800 border-slate-700',
    },
    {
      label: 'REAL ML DETECTIONS',
      value: realMlCount,
      subtext: 'UNSW-NB15 Model Inference',
      icon: Cpu,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/80 border-emerald-700/60',
    },
    {
      label: 'SIMULATION DETECTIONS',
      value: simCount,
      subtext: 'Demo Engine Stream',
      icon: Activity,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/60 border-sky-800/60',
    },
    {
      label: 'CRITICAL / HIGH',
      value: critical + high,
      subtext: `${critical} Critical • ${high} High`,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/60 border-rose-800/60',
    },
    {
      label: 'TOP THREAT TYPE',
      isText: true,
      textValue: topType,
      subtext: `${maxCount} Occurrences`,
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/60 border-orange-800/60',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
        <span className="font-bold text-slate-300">THREAT INTELLIGENCE SUMMARY</span>
        <span>
          {realMlCount} Real ML | {simCount} Simulation
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Card key={i} className="p-3.5 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
                  {c.label}
                </span>
                <div className={`h-7 w-7 rounded-lg ${c.bgColor} border flex items-center justify-center ${c.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-1">
                {c.isText ? (
                  <div className="text-lg font-mono font-extrabold text-white tracking-tight truncate">
                    {c.textValue}
                  </div>
                ) : (
                  <div className="text-2xl font-mono font-extrabold text-white tracking-tight">
                    <AnimatedCounter value={c.value || 0} />
                  </div>
                )}
                <span className="text-[9px] font-mono text-slate-500 block mt-0.5 truncate">
                  {c.subtext}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
