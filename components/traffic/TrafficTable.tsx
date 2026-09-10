'use client';

import React, { useMemo } from 'react';
import { NetworkTraffic } from '@/lib/types/network';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Eye, ShieldAlert, CheckCircle2 } from 'lucide-react';

export interface TrafficTableProps {
  trafficList: NetworkTraffic[];
  onSelectTraffic: (item: NetworkTraffic) => void;
  searchQuery: string;
  protocolFilter: string;
  statusFilter: string;
  timeRange: string;
}

export const TrafficTable: React.FC<TrafficTableProps> = ({
  trafficList,
  onSelectTraffic,
  searchQuery,
  protocolFilter,
  statusFilter,
  timeRange,
}) => {
  // Composable Filter Logic
  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const now = Date.now();

    return trafficList.filter((item) => {
      // Protocol match
      if (protocolFilter !== 'ALL' && item.protocol !== protocolFilter) {
        return false;
      }

      // Status match
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // Time range match
      if (timeRange === '1M') {
        const itemTime = new Date(item.timestamp).getTime();
        if (now - itemTime > 60000) return false;
      } else if (timeRange === '5M') {
        const itemTime = new Date(item.timestamp).getTime();
        if (now - itemTime > 300000) return false;
      }

      // Search query match
      if (query) {
        const matchSrc = item.sourceIp.toLowerCase().includes(query);
        const matchDst = item.destinationIp.toLowerCase().includes(query);
        const matchProtocol = item.protocol.toLowerCase().includes(query);
        const matchPort = item.destinationPort.toString().includes(query) || item.sourcePort.toString().includes(query);
        if (!matchSrc && !matchDst && !matchProtocol && !matchPort) {
          return false;
        }
      }

      return true;
    }).slice().reverse(); // Newest first
  }, [trafficList, searchQuery, protocolFilter, statusFilter, timeRange]);

  return (
    <Card className="p-0 overflow-hidden border border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 select-none">
            <tr>
              <th className="py-3 px-4 font-semibold">TIMESTAMP</th>
              <th className="py-3 px-4 font-semibold">SOURCE IP</th>
              <th className="py-3 px-4 font-semibold">DESTINATION IP</th>
              <th className="py-3 px-4 font-semibold">PROTOCOL</th>
              <th className="py-3 px-4 font-semibold">SRC PORT</th>
              <th className="py-3 px-4 font-semibold">DST PORT</th>
              <th className="py-3 px-4 font-semibold text-right">PACKETS</th>
              <th className="py-3 px-4 font-semibold text-right">BYTES</th>
              <th className="py-3 px-4 font-semibold text-right">RATE</th>
              <th className="py-3 px-4 font-semibold text-center">STATUS</th>
              <th className="py-3 px-3 text-center">DETAILS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-500 font-sans">
                  <p className="text-sm font-semibold text-slate-400">No traffic events match your filters</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Try clearing your search query or selecting "ALL" protocols
                  </p>
                </td>
              </tr>
            ) : (
              filteredList.map((item) => {
                const timeFormatted = new Date(item.timestamp).toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                const isAnomalous = item.status === 'ANOMALOUS' || item.status === 'SUSPICIOUS';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectTraffic(item)}
                    className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      isAnomalous ? 'bg-orange-950/20 hover:bg-orange-950/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{timeFormatted}</td>
                    <td className="py-3 px-4 font-semibold text-slate-100 whitespace-nowrap">
                      {item.sourceIp}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100 whitespace-nowrap">
                      {item.destinationIp}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold whitespace-nowrap">
                      {item.protocol}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{item.sourcePort}</td>
                    <td className="py-3 px-4 text-slate-200 font-semibold whitespace-nowrap">
                      {item.destinationPort}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 whitespace-nowrap">
                      {item.packets.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 whitespace-nowrap">
                      {(item.bytes / 1024).toFixed(1)} KB
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400 whitespace-nowrap">
                      {item.packetRate.toLocaleString()} pkt/s
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <Badge status={item.status} size="sm" dot />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
