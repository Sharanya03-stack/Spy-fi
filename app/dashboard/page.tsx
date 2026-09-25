'use client';

import React from 'react';
import { SocLayout } from '@/components/layout/SocLayout';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { LiveTrafficChart } from '@/components/dashboard/LiveTrafficChart';
import { ThreatActivityChart } from '@/components/dashboard/ThreatActivityChart';
import { ThreatDistributionChart } from '@/components/dashboard/ThreatDistributionChart';
import { LiveThreatFeed } from '@/components/dashboard/LiveThreatFeed';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { Cpu, Sparkles, AlertCircle, Shield } from 'lucide-react';

function DashboardContent() {
  const { detectionMode, mlHealth } = useSimulation();
  const isMl = detectionMode === 'ml';

  return (
    <div className="space-y-6">
      {/* Top Detection Engine Indicator Banner */}
      <div className="p-4 rounded-xl bg-[#0F1623] border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-soc-subtle">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              OPERATIONAL DETECTION ENGINE
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              {isMl ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  REAL ML INFERENCE MODE (UNSW-NB15)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-950/80 text-sky-400 border border-sky-500/40 font-bold text-xs">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                  DEMO SIMULATION MODE
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-4">
          {isMl && mlHealth?.model_loaded ? (
            <span className="text-emerald-400 font-medium flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              Model: <strong className="text-white">{mlHealth.model_type || 'HistGradientBoosting'}</strong> (Macro F1 = {mlHealth.macro_f1 || 0.6288})
            </span>
          ) : isMl ? (
            <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
              <AlertCircle className="h-4 w-4" /> FastAPI ML Backend Offline
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" /> Autonomous Controlled Simulation Active
            </span>
          )}
        </div>
      </div>

      {/* Top Metric Cards */}
      <MetricCards />

      {/* Row 1: Live Traffic Area Chart + Threat Vector Breakdown */}
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
