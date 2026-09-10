'use client';

import React, { useMemo } from 'react';
import { SocLayout } from '@/components/layout/SocLayout';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { Card } from '@/components/ui/Card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  Activity,
  ShieldAlert,
  Cpu,
  Layers,
  Database,
  PieChart,
  Radio,
} from 'lucide-react';

function AnalyticsContent() {
  const {
    trafficChartData,
    threats,
    threatDistribution,
  } = useSimulation();

  // Dynamic Detection Source Counts
  const sourceStats = useMemo(() => {
    const realMlCount = threats.filter((t) => t.detectionSource === 'ml').length;
    const simulationCount = threats.filter((t) => t.detectionSource === 'simulation').length;
    return { realMlCount, simulationCount, total: threats.length };
  }, [threats]);

  // Dynamic Severity Breakdown
  const severityStats = useMemo(() => {
    return {
      CRITICAL: threats.filter((t) => t.severity === 'CRITICAL').length,
      HIGH: threats.filter((t) => t.severity === 'HIGH').length,
      MEDIUM: threats.filter((t) => t.severity === 'MEDIUM').length,
      LOW: threats.filter((t) => t.severity === 'LOW').length,
    };
  }, [threats]);

  // Severity Bar Chart Data
  const severityChartData = useMemo(() => {
    return [
      { name: 'Critical', count: severityStats.CRITICAL, fill: '#f43f5e' },
      { name: 'High', count: severityStats.HIGH, fill: '#f97316' },
      { name: 'Medium', count: severityStats.MEDIUM, fill: '#f59e0b' },
      { name: 'Low', count: severityStats.LOW, fill: '#10b981' },
    ];
  }, [severityStats]);

  // Threat Distribution (Excluding BENIGN)
  const threatTypeStats = useMemo(() => {
    return [
      { name: 'Port Scan', key: 'PORT_SCAN', count: threatDistribution.PORT_SCAN || 0, fill: '#f97316' },
      { name: 'Denial of Service', key: 'DOS', count: (threatDistribution.DOS_DDOS || 0) + (threatDistribution.DOS || 0), fill: '#f43f5e' },
      { name: 'Traffic Anomaly', key: 'ANOMALY', count: (threatDistribution.ANOMALY || 0) + (threatDistribution.TRAFFIC_ANOMALY || 0), fill: '#38bdf8' },
    ];
  }, [threatDistribution]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              REAL-TIME SECURITY ANALYTICS
            </span>
            <span className="text-[10px] font-mono text-slate-400">SOC METRIC ENGINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-400" /> SECURITY & THREAT ANALYTICS DASHBOARD
          </h1>
        </div>

        {/* Quick Metrics Strip */}
        <div className="flex items-center gap-6 font-mono text-right border-l border-slate-800 pl-6">
          <div>
            <span className="text-[10px] text-slate-500 block">TOTAL THREATS</span>
            <span className="text-xl font-bold text-slate-100">{threats.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">REAL ML DETECTIONS</span>
            <span className="text-xl font-bold text-emerald-400">{sourceStats.realMlCount}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">SIMULATION DETECTIONS</span>
            <span className="text-xl font-bold text-slate-400">{sourceStats.simulationCount}</span>
          </div>
        </div>
      </div>

      {/* Empty State Banner if no threats */}
      {threats.length === 0 && (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center font-mono space-y-2">
          <ShieldAlert className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200 uppercase">NO SECURITY EVENTS DETECTED YET</h3>
          <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
            Analytics will populate dynamically as traffic streams and threat events are evaluated by the detection engine.
          </p>
        </div>
      )}

      {/* Grid Row 1: Traffic Velocity & Threat Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Traffic Velocity Time-Series */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" /> UNIDIRECTIONAL PACKET VELOCITY TREND
              </h3>
              <p className="text-[11px] font-sans text-slate-400">
                Real-time packets/sec throughput captured across ingress network interface
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE STREAM
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`${val.toLocaleString()} pkt/s`, 'Packet Velocity']}
                />
                <Area type="monotone" dataKey="packetRate" stroke="#10b981" strokeWidth={2} fill="url(#analyticsGradient)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Threat Vector Distribution */}
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="h-4 w-4 text-emerald-400" /> THREAT VECTOR BREAKDOWN
            </h3>
            <p className="text-[11px] font-sans text-slate-400">
              Categorized threat detections across supported taxonomy
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {threatTypeStats.map((tt) => {
              const pct = sourceStats.total > 0 ? Math.round((tt.count / sourceStats.total) * 100) : 0;
              return (
                <div key={tt.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-semibold">{tt.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{tt.count} events</span>
                      <span className="font-bold text-white">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(4, pct)}%`, backgroundColor: tt.fill }} />
                  </div>
                </div>
              );
            })}

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Active Category Filter:</span>
              <span className="text-emerald-400 font-bold">PORT_SCAN | DOS | ANOMALY</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid Row 2: Severity Distribution & Detection Source Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Severity Distribution */}
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-orange-400" /> SEVERITY RISK DISTRIBUTION
            </h3>
            <p className="text-[11px] font-sans text-slate-400">
              Threat count grouped by operational SOC severity level
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
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
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Detection Source Analytics */}
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" /> DETECTION SOURCE ANALYTICS
            </h3>
            <p className="text-[11px] font-sans text-slate-400">
              Categorized threat origins: Real ML Inference vs Controlled Simulation
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <Cpu className="h-3.5 w-3.5" /> REAL ML INFERENCE
              </div>
              <div className="text-2xl font-extrabold text-white">{sourceStats.realMlCount}</div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-1">
                Inference executed by the UNSW-NB15-trained HistGradientBoosting model via FastAPI.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                <Radio className="h-3.5 w-3.5 text-slate-400" /> DEMO SIMULATION
              </div>
              <div className="text-2xl font-extrabold text-slate-200">{sourceStats.simulationCount}</div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-1">
                Controlled browser scenarios for demonstration, testing, and UI validation.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Model Provenance & Performance Reference Panel */}
      <Card className="p-6 space-y-4 bg-slate-900/90 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-400" /> ML MODEL PERFORMANCE & RESEARCH PROVENANCE
          </h3>
          <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
            RESEARCH PROTOTYPE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">MODEL ARCHITECTURE</span>
            <span className="font-bold text-slate-200">HistGradientBoosting</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">BENCHMARK DATASET</span>
            <span className="font-bold text-slate-200">UNSW-NB15</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">TAXONOMY CLASSES</span>
            <span className="font-bold text-slate-200">4 Classes</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">FEATURE DIMENSION</span>
            <span className="font-bold text-slate-200">9 Native Features</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">HELD-OUT MACRO F1</span>
            <span className="font-bold text-emerald-400">0.6288</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">HELD-OUT ACCURACY</span>
            <span className="font-bold text-emerald-400">74.40%</span>
          </div>
        </div>

        <p className="text-[11px] font-sans text-slate-400 border-t border-slate-800/80 pt-3">
          * Evaluation metrics are based on a stratified held-out test set (25,072 samples) from the public UNSW-NB15 cybersecurity benchmark dataset. Results represent research prototype performance and are not based on live operational NTRO network telemetry.
        </p>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <SocLayout>
      <AnalyticsContent />
    </SocLayout>
  );
}
