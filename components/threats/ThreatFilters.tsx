'use client';

import React from 'react';
import { Search, Filter, ArrowUpDown, RefreshCw, Cpu } from 'lucide-react';

export interface ThreatFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  severityFilter: string;
  onSeverityChange: (severity: string) => void;
  threatTypeFilter: string;
  onThreatTypeChange: (type: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sourceFilter: string;
  onSourceChange: (source: string) => void;
  protocolFilter: string;
  onProtocolChange: (protocol: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onResetFilters: () => void;
}

export const ThreatFilters: React.FC<ThreatFiltersProps> = ({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  threatTypeFilter,
  onThreatTypeChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  protocolFilter,
  onProtocolChange,
  sortBy,
  onSortByChange,
  onResetFilters,
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
      {/* Search Field */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Threat ID, Type, Source IP, Destination IP..."
          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 pl-10 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
        {/* Detection Source Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <Cpu className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-slate-400">Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => onSourceChange(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL SOURCES</option>
            <option value="ml">REAL ML INFERENCE</option>
            <option value="simulation">DEMO SIMULATION</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-slate-400">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL SEVERITIES</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Threat Type Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400">Threat Type:</span>
          <select
            value={threatTypeFilter}
            onChange={(e) => onThreatTypeChange(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL TYPES</option>
            <option value="PORT_SCAN">Port Scan</option>
            <option value="DOS_DDOS">DoS / DDoS</option>
            <option value="BRUTE_FORCE">Brute Force</option>
            <option value="ANOMALY">Traffic Anomaly</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="NEW">New</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="TIME">Newest First</option>
            <option value="SEVERITY">Highest Severity</option>
            <option value="RISK">Highest Risk Score</option>
            <option value="CONFIDENCE">Highest AI Confidence</option>
          </select>
        </div>

        {/* Reset Button */}
        {(searchQuery || severityFilter !== 'ALL' || threatTypeFilter !== 'ALL' || statusFilter !== 'ALL' || sourceFilter !== 'ALL' || protocolFilter !== 'ALL' || sortBy !== 'TIME') && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>
    </div>
  );
};
