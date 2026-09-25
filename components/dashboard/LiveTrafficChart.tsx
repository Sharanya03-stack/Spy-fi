'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { Radio } from 'lucide-react';

export const LiveTrafficChart: React.FC = () => {
  const { trafficChartData } = useSimulation();

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/60">
        <div>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
            LIVE TRAFFIC VISUALIZATION
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 font-mono">
            Unidirectional packet rate velocity (rolling 60s telemetry window)
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)] self-start sm:self-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>LIVE TELEMETRY STREAMING</span>
        </div>
      </CardHeader>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="cyanTrafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#121925',
                borderColor: '#334155',
                borderRadius: '10px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#f8fafc',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
              formatter={(value: any) => [`${value.toLocaleString()} pkt/s`, 'Packet Velocity']}
              labelFormatter={(label) => `Timestamp: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="packetRate"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cyanTrafficGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
