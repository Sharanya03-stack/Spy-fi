'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThreatEvent, ThreatStatus } from '@/lib/types/network';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { ArrowRight, ShieldAlert, Zap, Cpu, Activity } from 'lucide-react';

export interface ThreatTableProps {
  threatsList: ThreatEvent[];
  searchQuery: string;
  severityFilter: string;
  threatTypeFilter: string;
  statusFilter: string;
  sourceFilter: string;
  protocolFilter: string;
  sortBy: string;
}

export const ThreatTable: React.FC<ThreatTableProps> = ({
  threatsList,
  searchQuery,
  severityFilter,
  threatTypeFilter,
  statusFilter,
  sourceFilter,
  protocolFilter,
  sortBy,
}) => {
  const router = useRouter();
  const { updateThreatStatus, simulateThreat } = useSimulation();

  // Composable Filter & Sort Logic
  const filteredThreats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = threatsList.filter((t) => {
      // Detection Source match
      if (sourceFilter !== 'ALL' && t.detectionSource !== sourceFilter) {
        return false;
      }

      // Severity match
      if (severityFilter !== 'ALL' && t.severity !== severityFilter) {
        return false;
      }

      // Threat Type match
      if (threatTypeFilter !== 'ALL') {
        if (threatTypeFilter === 'ANOMALY' && t.threatType !== 'ANOMALY' && t.threatType !== 'TRAFFIC_ANOMALY') {
          return false;
        } else if (threatTypeFilter !== 'ANOMALY' && t.threatType !== threatTypeFilter) {
          return false;
        }
      }

      // Status match
      if (statusFilter !== 'ALL' && t.status !== statusFilter) {
        return false;
      }

      // Protocol match
      if (protocolFilter !== 'ALL' && t.protocol !== protocolFilter) {
        return false;
      }

      // Search Query match
      if (query) {
        const matchId = t.id.toLowerCase().includes(query);
        const matchType = t.threatType.toLowerCase().includes(query) || t.title.toLowerCase().includes(query);
        const matchSrc = t.sourceIp.toLowerCase().includes(query);
        const matchDst = t.destinationIp.toLowerCase().includes(query);
        if (!matchId && !matchType && !matchSrc && !matchDst) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'SEVERITY') {
        const severityRank: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return severityRank[b.severity] - severityRank[a.severity];
      } else if (sortBy === 'RISK') {
        return b.riskScore - a.riskScore;
      } else if (sortBy === 'CONFIDENCE') {
        return b.confidence - a.confidence;
      } else {
        // TIME (Newest first)
        return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
      }
    });
  }, [threatsList, searchQuery, severityFilter, threatTypeFilter, statusFilter, sourceFilter, protocolFilter, sortBy]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, threatId: string) => {
    e.stopPropagation();
    const newStatus = e.target.value as ThreatStatus;
    updateThreatStatus(threatId, newStatus);
  };

  return (
    <Card className="p-0 overflow-hidden border border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 select-none">
            <tr>
              <th className="py-3 px-4 font-semibold">THREAT ID</th>
              <th className="py-3 px-3 font-semibold text-center">DETECTION SOURCE</th>
              <th className="py-3 px-4 font-semibold">THREAT TYPE</th>
              <th className="py-3 px-4 font-semibold">SOURCE → DESTINATION</th>
              <th className="py-3 px-3 font-semibold">PROTO</th>
              <th className="py-3 px-4 font-semibold text-right">CONFIDENCE</th>
              <th className="py-3 px-4 font-semibold text-right">RISK SCORE</th>
              <th className="py-3 px-4 font-semibold text-center">SEVERITY</th>
              <th className="py-3 px-4 font-semibold">DETECTED AT</th>
              <th className="py-3 px-4 font-semibold text-center">STATUS</th>
              <th className="py-3 px-3 text-center">ACTION</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {filteredThreats.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-14 text-center text-slate-500 font-sans">
                  <ShieldAlert className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-base font-semibold text-slate-300">No active threats match your filters</p>
                  <p className="text-xs text-slate-500 font-mono mt-1 mb-4">
                    Trigger a demo attack or enable Real ML mode to test real-time detection
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => simulateThreat('PORT_SCAN')}
                    leftIcon={<Zap className="h-4 w-4 text-amber-300" />}
                  >
                    Simulate Port Scan Attack
                  </Button>
                </td>
              </tr>
            ) : (
              filteredThreats.map((threat) => {
                const timeFormatted = new Date(threat.detectedAt).toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                const isRealMl = threat.detectionSource === 'ml';

                return (
                  <tr
                    key={threat.id}
                    onClick={() => router.push(`/threats/${threat.id}`)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-200 whitespace-nowrap">
                      {threat.id}
                    </td>

                    {/* Detection Source Badge */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {isRealMl ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-500/50">
                          <Cpu className="h-3 w-3" /> REAL ML
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          <Activity className="h-3 w-3" /> SIMULATION
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                      {threat.title}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <span className="font-semibold text-slate-100">{threat.sourceIp}</span>
                      <span className="text-slate-500 mx-1.5">→</span>
                      <span className="font-semibold text-slate-100">{threat.destinationIp}</span>
                    </td>

                    <td className="py-3.5 px-3 text-emerald-400 font-bold whitespace-nowrap">
                      {threat.protocol}
                    </td>

                    {/* Confidence Visual Progress Indicator */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-emerald-400">{threat.confidence}%</span>
                        <div className="w-16 h-1 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, threat.confidence)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-bold text-orange-400">{threat.riskScore}</span>
                      <span className="text-slate-500 text-[10px]"> / 100</span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <Badge severity={threat.severity} size="sm" dot />
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {timeFormatted}
                    </td>

                    {/* Inline Global Status Dropdown */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={threat.status}
                        onChange={(e) => handleStatusChange(e, threat.id)}
                        className={`text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-950 border focus:outline-none cursor-pointer ${
                          threat.status === 'NEW'
                            ? 'border-rose-700/60 text-rose-300'
                            : threat.status === 'INVESTIGATING'
                            ? 'border-orange-700/60 text-orange-300'
                            : threat.status === 'ACKNOWLEDGED'
                            ? 'border-amber-700/60 text-amber-300'
                            : 'border-emerald-700/60 text-emerald-300'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="INVESTIGATING">INVESTIGATING</option>
                        <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <Link
                        href={`/threats/${threat.id}`}
                        className="p-1 rounded text-slate-400 group-hover:text-emerald-400 transition-colors inline-block"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
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
