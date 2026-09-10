'use client';

import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { TrafficStatus } from '@/lib/types/network';

export interface TrafficFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  protocolFilter: string;
  onProtocolChange: (protocol: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onResetFilters: () => void;
}

export const TrafficFilters: React.FC<TrafficFiltersProps> = ({
  searchQuery,
  onSearchChange,
  protocolFilter,
  onProtocolChange,
  statusFilter,
  onStatusChange,
  timeRange,
  onTimeRangeChange,
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
          placeholder="Filter by Source IP, Destination IP, Protocol, Port..."
          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 pl-10 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
        {/* Protocol Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-slate-400">Protocol:</span>
          <select
            value={protocolFilter}
            onChange={(e) => onProtocolChange(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="ICMP">ICMP</option>
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
            <option value="ALL">ALL</option>
            <option value="NORMAL">Normal</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="ANOMALOUS">Anomalous</option>
          </select>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400">Time:</span>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="LIVE">Live Stream</option>
            <option value="1M">Last 1 min</option>
            <option value="5M">Last 5 min</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {(searchQuery || protocolFilter !== 'ALL' || statusFilter !== 'ALL' || timeRange !== 'LIVE') && (
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
