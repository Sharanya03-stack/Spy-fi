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
import { ShieldAlert } from 'lucide-react';

export const ThreatActivityChart: React.FC = () => {
  const { threatChartData } = useSimulation();

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 mb-2">
        <div>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-orange-400" />
            THREAT ACTIVITY OVER TIME
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 font-mono">
            Detected security events broken down by severity level
          </CardDescription>
        </div>
      </CardHeader>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={threatChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#f8fafc',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }}
            />
            <Bar dataKey="critical" name="Critical" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="high" name="High" fill="#f97316" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="medium" name="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="low" name="Low" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
