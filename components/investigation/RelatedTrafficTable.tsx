'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { ArrowRight, Activity, ShieldCheck } from 'lucide-react';

export interface RelatedTrafficTableProps {
  threat: ThreatEvent;
}

export const RelatedTrafficTable: React.FC<RelatedTrafficTableProps> = ({ threat }) => {
  const { trafficHistory } = useSimulation();

  const relatedLogs = useMemo(() => {
    const explicit = trafficHistory.filter((t) => t.threatId === threat.id);
    if (explicit.length > 0) return explicit;

    return trafficHistory.filter(
      (t) => t.sourceIp === threat.sourceIp && t.destinationIp === threat.destinationIp
    );
  }, [trafficHistory, threat]);

  return (
    <Card className="p-6 border-slate-800/80 bg-[#121925]/95 shadow-soc-panel">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" /> ASSOCIATED TELEMETRY LOGS
        </h3>
        <Link
          href="/traffic"
          className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
        >
          View Live Traffic Console <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#090D16] text-slate-400 border-b border-slate-800/80">
            <tr>
              <th className="py-3 px-3 font-bold">TIMESTAMP</th>
              <th className="py-3 px-3 font-bold">SOURCE → DESTINATION</th>
              <th className="py-3 px-3 font-bold">PROTO</th>
              <th className="py-3 px-3 font-bold">PORTS</th>
              <th className="py-3 px-3 font-bold text-right">PACKETS</th>
              <th className="py-3 px-3 font-bold text-right">RATE</th>
              <th className="py-3 px-3 font-bold text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {relatedLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                  <ShieldCheck className="h-6 w-6 text-slate-600 mx-auto mb-1" />
                  No associated packet logs currently in active 60s memory window.
                </td>
              </tr>
            ) : (
              relatedLogs.slice(0, 5).map((pkt) => (
                <tr key={pkt.id} className="hover:bg-[#151F30]">
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(pkt.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">
                    <span>{pkt.sourceIp}</span>
                    <span className="text-slate-500 mx-1">→</span>
                    <span>{pkt.destinationIp}</span>
                  </td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{pkt.protocol}</td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {pkt.sourcePort} → {pkt.destinationPort}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {pkt.packets.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-cyan-400 font-bold">
                    {pkt.packetRate.toLocaleString()} pkt/s
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge status={pkt.status} size="sm" dot />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
