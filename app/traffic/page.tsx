'use client';

import React, { useState } from 'react';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { SocLayout } from '@/components/layout/SocLayout';
import { TrafficMetricsStrip } from '@/components/traffic/TrafficMetricsStrip';
import { TrafficFilters } from '@/components/traffic/TrafficFilters';
import { TrafficTable } from '@/components/traffic/TrafficTable';
import { TrafficDetailsDrawer } from '@/components/traffic/TrafficDetailsDrawer';
import { NetworkTraffic } from '@/lib/types/network';
import { Radio, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

function TrafficPageContent() {
  const { trafficHistory, isPaused } = useSimulation();

  const [selectedTraffic, setSelectedTraffic] = useState<NetworkTraffic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timeRange, setTimeRange] = useState('LIVE');

  const handleResetFilters = () => {
    setSearchQuery('');
    setProtocolFilter('ALL');
    setStatusFilter('ALL');
    setTimeRange('LIVE');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
              {isPaused ? '● PAUSED' : '● LIVE INGRESS FEED'}
            </span>
            <Badge variant="normal" size="sm">
              <Lock className="h-3 w-3 inline mr-1" /> ONE-WAY DATA DIODE
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">LIVE TRAFFIC MONITOR</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time visibility into unidirectional network traffic entering the protected environment.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Direction:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            SOURCE NETWORK <Radio className="h-3.5 w-3.5" /> PROTECTED NETWORK
          </span>
        </div>
      </div>

      {/* Metric Strip */}
      <TrafficMetricsStrip />

      {/* Search & Filters */}
      <TrafficFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        protocolFilter={protocolFilter}
        onProtocolChange={setProtocolFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Telemetry Streaming Table */}
      <TrafficTable
        trafficList={trafficHistory}
        onSelectTraffic={(item) => setSelectedTraffic(item)}
        searchQuery={searchQuery}
        protocolFilter={protocolFilter}
        statusFilter={statusFilter}
        timeRange={timeRange}
      />

      {/* Slide-over Telemetry Details Drawer */}
      <TrafficDetailsDrawer
        traffic={selectedTraffic}
        onClose={() => setSelectedTraffic(null)}
      />
    </div>
  );
}

export default function TrafficPage() {
  return (
    <SocLayout>
      <TrafficPageContent />
    </SocLayout>
  );
}
