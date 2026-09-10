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
import { Activity } from 'lucide-react';

export const LiveTrafficChart: React.FC = () => {
  const { trafficChartData } = useSimulation();

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 mb-2">
        <div>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            LIVE TRAFFIC ACTIVITY
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 font-mono">
            Unidirectional packet rate velocity (rolling 60s stream)
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">Live Ingress Feed</span>
        </div>
      </CardHeader>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#f8fafc',
              }}
              formatter={(value: any) => [`${value.toLocaleString()} pkt/s`, 'Packet Velocity']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="packetRate"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#trafficGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
