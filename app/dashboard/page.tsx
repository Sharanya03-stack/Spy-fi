'use client';

import React from 'react';
import { SocLayout } from '@/components/layout/SocLayout';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { LiveTrafficChart } from '@/components/dashboard/LiveTrafficChart';
import { ThreatActivityChart } from '@/components/dashboard/ThreatActivityChart';
import { ThreatDistributionChart } from '@/components/dashboard/ThreatDistributionChart';
import { LiveThreatFeed } from '@/components/dashboard/LiveThreatFeed';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { Cpu, Activity, AlertCircle } from 'lucide-react';

function DashboardContent() {
  const { detectionMode, mlHealth } = useSimulation();
  const isMl = detectionMode === 'ml';

  return (
    <div className="space-y-6">
      {/* Top Detection Engine Indicator Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 font-bold uppercase">DETECTION ENGINE STATUS:</span>
          {isMl ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/50 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              REAL ML INFERENCE MODE (UNSW-NB15)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-600/50 font-bold">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              DEMO SIMULATION MODE
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-4">
          {isMl && mlHealth?.model_loaded ? (
            <span className="text-emerald-400 font-medium">
              Model: <strong className="text-white">{mlHealth.model_type || 'HistGradientBoosting'}</strong> (Macro F1 = {mlHealth.macro_f1 || 0.6288})
            </span>
          ) : isMl ? (
            <span className="text-amber-400 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> FastAPI Service Offline
            </span>
          ) : (
            <span className="text-slate-400">
              Autonomous Browser Simulation Active
            </span>
          )}
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <MetricCards />

      {/* Row 1: Live Traffic Area Chart + Threat Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <LiveTrafficChart />
        </div>
        <div className="lg:col-span-4">
          <ThreatDistributionChart />
        </div>
      </div>

      {/* Row 2: Threat Activity Bar Chart + Live Threat Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ThreatActivityChart />
        </div>
        <div className="lg:col-span-6">
          <LiveThreatFeed />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SocLayout>
      <DashboardContent />
    </SocLayout>
  );
}
