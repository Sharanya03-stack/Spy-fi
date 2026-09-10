'use client';

import React, { useState } from 'react';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { SocLayout } from '@/components/layout/SocLayout';
import { ThreatSummaryCards } from '@/components/threats/ThreatSummaryCards';
import { ThreatFilters } from '@/components/threats/ThreatFilters';
import { ThreatTable } from '@/components/threats/ThreatTable';
import { ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

function ThreatCenterContent() {
  const { threats } = useSimulation();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [threatTypeFilter, setThreatTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [protocolFilter, setProtocolFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('TIME');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSeverityFilter('ALL');
    setThreatTypeFilter('ALL');
    setStatusFilter('ALL');
    setSourceFilter('ALL');
    setProtocolFilter('ALL');
    setSortBy('TIME');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="h-4 w-4 text-orange-400" />
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wide">
              XAI INTELLIGENCE MANAGEMENT
            </span>
            <Badge variant="high" size="sm">
              {threats.length} ACTIVE INCIDENTS
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">THREAT DETECTION CENTER</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Investigate AI-detected anomalies and security threats across the monitored network.
          </p>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <ThreatSummaryCards />

      {/* Search, Filters, and Sorting Bar */}
      <ThreatFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        threatTypeFilter={threatTypeFilter}
        onThreatTypeChange={setThreatTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
        protocolFilter={protocolFilter}
        onProtocolChange={setProtocolFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onResetFilters={handleResetFilters}
      />

      {/* Main Threat Management Table */}
      <ThreatTable
        threatsList={threats}
        searchQuery={searchQuery}
        severityFilter={severityFilter}
        threatTypeFilter={threatTypeFilter}
        statusFilter={statusFilter}
        sourceFilter={sourceFilter}
        protocolFilter={protocolFilter}
        sortBy={sortBy}
      />
    </div>
  );
}

export default function ThreatsPage() {
  return (
    <SocLayout>
      <ThreatCenterContent />
    </SocLayout>
  );
}
