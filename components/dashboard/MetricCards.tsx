'use client';

import React from 'react';
import { Activity, Network, ShieldAlert, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useSimulation } from '@/lib/simulation/simulationStore';

export const MetricCards: React.FC = () => {
  const { metrics } = useSimulation();

  const cards = [
    {
      label: 'NETWORK TRAFFIC',
      value: metrics.totalPacketsPerSec,
      suffix: ' pkt/s',
      subtext: 'Ingress Telemetry Velocity',
      trend: '+4.2% baseline',
      trendUp: true,
      icon: Activity,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-950/60 border-cyan-800/60',
      accentColor: 'border-l-cyan-500',
    },
    {
      label: 'ACTIVE FLOWS',
      value: metrics.activeFlows,
      subtext: 'Unidirectional IP Pairs',
      trend: 'Monitored streams',
      trendUp: true,
      icon: Network,
      iconColor: 'text-sky-400',
      iconBg: 'bg-sky-950/60 border-sky-800/60',
      accentColor: 'border-l-sky-500',
    },
    {
      label: 'THREATS DETECTED',
      value: metrics.threatsDetected,
      subtext: 'Cumulative Detections',
      trend: metrics.threatsDetected > 0 ? 'Active threat state' : 'Zero threats',
      trendUp: metrics.threatsDetected === 0,
      icon: ShieldAlert,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-950/60 border-amber-800/60',
      accentColor: 'border-l-amber-500',
    },
    {
      label: 'CRITICAL ALERTS',
      value: metrics.criticalAlerts,
      subtext: 'Active Critical Incidents',
      trend: metrics.criticalAlerts > 0 ? 'Action required' : 'Nominal status',
      trendUp: metrics.criticalAlerts === 0,
      icon: AlertTriangle,
      iconColor: metrics.criticalAlerts > 0 ? 'text-rose-400' : 'text-slate-400',
      iconBg: metrics.criticalAlerts > 0 ? 'bg-rose-950/60 border-rose-800/60' : 'bg-slate-900 border-slate-800',
      accentColor: metrics.criticalAlerts > 0 ? 'border-l-rose-500' : 'border-l-slate-700',
    },
    {
      label: 'DIODE HEALTH',
      value: metrics.networkHealth,
      suffix: '%',
      decimals: 1,
      subtext: 'Isolation Integrity Score',
      trend: 'Hardware diode active',
      trendUp: true,
      icon: ShieldCheck,
      iconColor: metrics.networkHealth >= 95 ? 'text-emerald-400' : 'text-amber-400',
      iconBg: metrics.networkHealth >= 95 ? 'bg-emerald-950/60 border-emerald-800/60' : 'bg-amber-950/60 border-amber-800/60',
      accentColor: metrics.networkHealth >= 95 ? 'border-l-emerald-500' : 'border-l-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className={`p-4 flex flex-col justify-between border-l-4 ${c.accentColor} hover:border-slate-700/80 transition-all`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                {c.label}
              </span>
              <div className={`h-8 w-8 rounded-lg ${c.iconBg} border flex items-center justify-center ${c.iconColor} shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
                <AnimatedCounter
                  value={c.value}
                  suffix={c.suffix || ''}
                  decimals={c.decimals || 0}
                />
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                <span className="text-slate-400 truncate">{c.subtext}</span>
                <span className={c.trendUp ? 'text-emerald-400 font-semibold shrink-0' : 'text-rose-400 font-semibold shrink-0'}>
                  {c.trend}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
