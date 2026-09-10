'use client';

import React from 'react';
import { Activity, Network, ShieldAlert, AlertTriangle, HeartPulse } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useSimulation } from '@/lib/simulation/simulationStore';

export const MetricCards: React.FC = () => {
  const { metrics } = useSimulation();

  const cards = [
    {
      label: 'TOTAL TRAFFIC',
      value: metrics.totalPacketsPerSec,
      suffix: ' pkt/s',
      subtext: 'Ingress Line Velocity',
      icon: Activity,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/60 border-emerald-800/60',
    },
    {
      label: 'ACTIVE FLOWS',
      value: metrics.activeFlows,
      subtext: 'Unidirectional IP Pairs',
      icon: Network,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/60 border-sky-800/60',
    },
    {
      label: 'THREATS DETECTED',
      value: metrics.threatsDetected,
      subtext: 'Cumulative Detections',
      icon: ShieldAlert,
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/60 border-orange-800/60',
    },
    {
      label: 'CRITICAL ALERTS',
      value: metrics.criticalAlerts,
      subtext: 'Active High/Critical Incidents',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/60 border-rose-800/60',
    },
    {
      label: 'NETWORK HEALTH',
      value: metrics.networkHealth,
      suffix: '%',
      decimals: 1,
      subtext: 'Data Diode Protection Score',
      icon: HeartPulse,
      color: metrics.networkHealth >= 95 ? 'text-emerald-400' : 'text-amber-400',
      bgColor: metrics.networkHealth >= 95 ? 'bg-emerald-950/60 border-emerald-800/60' : 'bg-amber-950/60 border-amber-800/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className="p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
                {c.label}
              </span>
              <div className={`h-8 w-8 rounded-lg ${c.bgColor} border flex items-center justify-center ${c.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-1">
              <div className="text-2xl font-mono font-extrabold text-white tracking-tight">
                <AnimatedCounter
                  value={c.value}
                  suffix={c.suffix || ''}
                  decimals={c.decimals || 0}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 block mt-1">
                {c.subtext}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
