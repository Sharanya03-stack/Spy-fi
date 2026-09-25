'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { BarChart3 } from 'lucide-react';

export const ThreatActivityChart: React.FC = () => {
  const { threatChartData } = useSimulation();

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
        <div>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            THREAT SEVERITY TIMELINE
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 font-mono">
            Detected security events stacked by severity rating
          </CardDescription>
        </div>
      </CardHeader>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={threatChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" tickLine={false} axisLine={false} />
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
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '12px' }}
            />
            <Bar dataKey="critical" name="Critical" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="high" name="High" fill="#f97316" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="medium" name="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="low" name="Low" fill="#06b6d4" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
