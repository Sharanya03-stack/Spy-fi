'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { Radar, Zap, KeyRound, Activity, PieChart } from 'lucide-react';

export const ThreatDistributionChart: React.FC = () => {
  const { threatDistribution, threats } = useSimulation();

  const totalThreats = threats.length || 1;

  const categories = [
    {
      key: 'PORT_SCAN' as const,
      label: 'Port Scan Attack',
      count: threatDistribution.PORT_SCAN || 0,
      icon: Radar,
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
    },
    {
      key: 'DOS_DDOS' as const,
      label: 'DoS / DDoS Flood',
      count: threatDistribution.DOS_DDOS || 0,
      icon: Zap,
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
    },
    {
      key: 'BRUTE_FORCE' as const,
      label: 'Brute Force Auth',
      count: threatDistribution.BRUTE_FORCE || 0,
      icon: KeyRound,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
    },
    {
      key: 'ANOMALY' as const,
      label: 'Traffic Baseline Anomaly',
      count: threatDistribution.ANOMALY || 0,
      icon: Activity,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400',
    },
  ];

  return (
    <Card className="p-6">
      <CardHeader className="pb-2 mb-4 border-b border-slate-800/60">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <PieChart className="h-4 w-4 text-cyan-400" />
          THREAT VECTOR DISTRIBUTION
        </CardTitle>
        <CardDescription className="text-xs text-slate-400 font-mono">
          Breakdown of detected attack categories
        </CardDescription>
      </CardHeader>

      <div className="space-y-4 mt-4">
        {categories.map((c) => {
          const Icon = c.icon;
          const percentage = Math.round((c.count / totalThreats) * 100);

          return (
            <div key={c.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${c.textColor}`} />
                  <span className="text-slate-200 font-medium">{c.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{c.count} events</span>
                  <span className={`font-bold ${c.textColor}`}>{percentage}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full ${c.color} transition-all duration-500 rounded-full shadow-sm`}
                  style={{ width: `${Math.max(4, percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Total Detected Events:</span>
        <span className="text-slate-200 font-bold">{threats.length}</span>
      </div>
    </Card>
  );
};
