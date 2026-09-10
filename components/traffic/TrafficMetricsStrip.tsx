'use client';

import React from 'react';
import { Activity, HardDrive, Network, Radio } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useSimulation } from '@/lib/simulation/simulationStore';

export const TrafficMetricsStrip: React.FC = () => {
  const { metrics } = useSimulation();

  const bandwidthMb = Number((metrics.byteRate / (1024 * 1024)).toFixed(1));

  const items = [
    {
      label: 'TRAFFIC RATE',
      value: metrics.totalPacketsPerSec,
      suffix: ' pkt/s',
      subtext: 'Current Packet Velocity',
      icon: Activity,
      color: 'text-emerald-400',
    },
    {
      label: 'BANDWIDTH',
      value: bandwidthMb,
      suffix: ' MB/s',
      decimals: 1,
      subtext: 'Ingress Throughput',
      icon: HardDrive,
      color: 'text-sky-400',
    },
    {
      label: 'ACTIVE FLOWS',
      value: metrics.activeFlows,
      subtext: 'Unidirectional IP Pairs',
      icon: Network,
      color: 'text-indigo-400',
    },
    {
      label: 'TCP PROTOCOL',
      value: metrics.protocolBreakdown.TCP,
      suffix: '%',
      subtext: 'Transmission Control',
      icon: Radio,
      color: 'text-emerald-400',
    },
    {
      label: 'UDP PROTOCOL',
      value: metrics.protocolBreakdown.UDP,
      suffix: '%',
      subtext: 'User Datagram',
      icon: Radio,
      color: 'text-amber-400',
    },
    {
      label: 'OTHER / ICMP',
      value: metrics.protocolBreakdown.ICMP,
      suffix: '%',
      subtext: 'Control & Telemetry',
      icon: Radio,
      color: 'text-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Card key={i} className="p-3.5 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
                {item.label}
              </span>
              <Icon className={`h-3.5 w-3.5 ${item.color}`} />
            </div>

            <div className="mt-1">
              <div className="text-xl font-mono font-extrabold text-white tracking-tight">
                <AnimatedCounter
                  value={item.value}
                  suffix={item.suffix || ''}
                  decimals={item.decimals || 0}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-500 block mt-0.5">
                {item.subtext}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
