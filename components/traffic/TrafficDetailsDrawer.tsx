'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, ShieldCheck, Server, Database, Activity, Lock } from 'lucide-react';
import { NetworkTraffic } from '@/lib/types/network';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface TrafficDetailsDrawerProps {
  traffic: NetworkTraffic | null;
  onClose: () => void;
}

export const TrafficDetailsDrawer: React.FC<TrafficDetailsDrawerProps> = ({
  traffic,
  onClose,
}) => {
  const router = useRouter();

  if (!traffic) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl relative">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Unidirectional Telemetry Details</h3>
                <span className="text-[10px] font-mono text-slate-400">PACKET ID: {traffic.id}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Unidirectional Visual Diagram Card */}
          <div className="my-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Lock className="h-3 w-3" /> HARDWARE ONE-WAY ISOLATED
              </span>
              <Badge status={traffic.status} size="sm" dot />
            </div>

            <div className="grid grid-cols-11 gap-1 items-center py-3 text-center">
              {/* Source Host */}
              <div className="col-span-4 p-2.5 rounded bg-slate-900 border border-slate-800">
                <Server className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                <span className="text-[9px] font-mono text-slate-500 block">SOURCE</span>
                <span className="text-xs font-mono font-bold text-slate-200">{traffic.sourceIp}</span>
              </div>

              {/* One-Way Arrow */}
              <div className="col-span-3 flex flex-col items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-400 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-6 border-l-cyan-400" />
                </div>
                <span className="text-[9px] font-mono text-emerald-400 mt-1 uppercase">Tx → Rx</span>
              </div>

              {/* Destination Host */}
              <div className="col-span-4 p-2.5 rounded bg-slate-900 border border-slate-800">
                <Database className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                <span className="text-[9px] font-mono text-slate-500 block">DESTINATION</span>
                <span className="text-xs font-mono font-bold text-slate-200">{traffic.destinationIp}</span>
              </div>
            </div>
          </div>

          {/* Telemetry Breakdown Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              FLOW PARAMETERS
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">PROTOCOL</span>
                <span className="text-slate-200 font-bold">{traffic.protocol}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">DESTINATION PORT</span>
                <span className="text-slate-200 font-bold">{traffic.destinationPort}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">SOURCE PORT</span>
                <span className="text-slate-200 font-bold">{traffic.sourcePort}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">PACKET COUNT</span>
                <span className="text-slate-200 font-bold">{traffic.packets.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">TOTAL BYTES</span>
                <span className="text-slate-200 font-bold">{(traffic.bytes / 1024).toFixed(1)} KB</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">PACKET RATE</span>
                <span className="text-emerald-400 font-bold">{traffic.packetRate.toLocaleString()} pkt/s</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">FLOW DURATION</span>
                <span className="text-slate-200 font-bold">{traffic.flowDuration}s</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">TCP FLAGS</span>
                <span className="text-slate-200 font-bold">{traffic.tcpFlags || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
          {traffic.status === 'ANOMALOUS' || traffic.status === 'SUSPICIOUS' ? (
            <Button
              variant="primary"
              className="w-full justify-center bg-orange-600 hover:bg-orange-500 border-orange-500/40"
              onClick={() => {
                onClose();
                router.push(traffic.threatId ? `/threats/${traffic.threatId}` : '/threats');
              }}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View Associated Threat Alert
            </Button>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Normal flow telemetry operating within baseline parameters.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
