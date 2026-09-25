'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SocLayout } from '@/components/layout/SocLayout';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  ShieldAlert,
  ArrowRight,
  Printer,
  Cpu,
  Radio,
  FileCheck2,
} from 'lucide-react';

function ReportsContent() {
  const { threats } = useSimulation();
  const [selectedThreatId, setSelectedThreatId] = useState<string>(
    threats[0]?.id || ''
  );

  const selectedThreat = threats.find((t) => t.id === selectedThreatId) || threats[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#121925]/95 border border-slate-800/80 shadow-soc-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              INCIDENT REPORTING ENGINE
            </span>
            <span className="text-[10px] font-mono text-slate-400">SOC FORENSIC AUDIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-7 w-7 text-cyan-400" /> INCIDENT REPORT PREVIEW & AUDIT LOGS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="h-4 w-4 text-slate-400" />}
          >
            Print / Export Report
          </Button>
        </div>
      </div>

      {threats.length === 0 ? (
        <Card className="p-12 text-center font-mono space-y-3 bg-[#0F1623]">
          <FileText className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200 uppercase">NO INCIDENT REPORTS AVAILABLE</h3>
          <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
            Incident reports generate automatically when threats are detected by the ML inference engine or simulation stream.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar: Incident Selector */}
          <Card className="p-6 space-y-4 bg-[#121925]/95 border-slate-800/80">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-cyan-400" /> SELECT DETECTED INCIDENT
              </h3>
              <p className="text-[11px] font-sans text-slate-400 mt-0.5">
                Select an incident record to preview forensic report documentation
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs max-h-[500px] overflow-y-auto pr-1">
              {threats.map((t) => {
                const isSelected = selectedThreat?.id === t.id;
                const isRealMl = t.detectionSource === 'ml';

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedThreatId(t.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-soc-glow'
                        : 'bg-[#090D16] border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200">{t.id}</span>
                      <Badge severity={t.severity} size="sm" dot />
                    </div>

                    <div className="font-bold text-xs truncate mb-1">{t.title}</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{t.sourceIp}</span>
                      {isRealMl ? (
                        <span className="text-emerald-400 font-bold">REAL ML</span>
                      ) : (
                        <span className="text-cyan-400">SIMULATION</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Main Area: Printable / Viewable Incident Report Preview */}
          <Card className="p-8 lg:col-span-2 space-y-6 font-mono border-slate-800/80 bg-[#121925]/95 shadow-soc-panel">
            {selectedThreat && (
              <>
                {/* Report Header */}
                <div className="border-b border-slate-800/80 pb-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                        SPY-FI
                      </span>
                      <span className="text-xs text-slate-400 font-bold">OFFICIAL SOC INCIDENT REPORT</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Generated: {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-white tracking-tight pt-1">
                    INCIDENT REPORT: {selectedThreat.id}
                  </h2>
                  <p className="text-xs font-sans text-slate-400 leading-relaxed">
                    Forensic telemetry summary and explainable machine learning risk classification record.
                  </p>
                </div>

                {/* Summary Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">THREAT TYPE</span>
                    <span className="font-bold text-white">{selectedThreat.threatType}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">DETECTION SOURCE</span>
                    {selectedThreat.detectionSource === 'ml' ? (
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Cpu className="h-3 w-3" /> REAL ML
                      </span>
                    ) : (
                      <span className="font-bold text-cyan-400 flex items-center gap-1">
                        <Radio className="h-3 w-3" /> SIMULATION
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">AI CONFIDENCE</span>
                    <span className="font-bold text-cyan-400">{selectedThreat.confidence}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">RISK SCORE</span>
                    <span className="font-bold text-amber-400">{selectedThreat.riskScore} / 100</span>
                  </div>
                </div>

                {/* Telemetry Details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck2 className="h-3.5 w-3.5 text-cyan-400" /> INGRESS NETWORK TELEMETRY
                  </h4>
                  <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div><span className="text-slate-400">Source IP:</span> <span className="text-slate-200 font-bold">{selectedThreat.sourceIp}</span></div>
                    <div><span className="text-slate-400">Destination IP:</span> <span className="text-slate-200 font-bold">{selectedThreat.destinationIp}</span></div>
                    <div><span className="text-slate-400">Protocol:</span> <span className="text-cyan-400 font-bold">{selectedThreat.protocol}</span></div>
                    <div><span className="text-slate-400">Target Ports:</span> <span className="text-slate-200 font-bold">{selectedThreat.destinationPortCount}</span></div>
                    <div><span className="text-slate-400">Packets:</span> <span className="text-slate-200 font-bold">{selectedThreat.connectionAttempts}</span></div>
                    <div><span className="text-slate-400">Flow Duration:</span> <span className="text-slate-200 font-bold">{selectedThreat.flowDuration}s</span></div>
                  </div>
                </div>

                {/* Summary & Indicators */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">THREAT SUMMARY & KEY INDICATORS</h4>
                  <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-2 text-xs font-sans">
                    <p className="text-slate-200 leading-relaxed font-mono">{selectedThreat.summary}</p>
                    {selectedThreat.indicators?.map((ind, i) => (
                      <div key={i} className="text-slate-400 font-mono text-[11px]">
                        • {ind}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">RECOMMENDED ANALYST ADVISORY ACTION</h4>
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs font-mono text-amber-200 space-y-1">
                    <div className="font-bold flex items-center justify-between text-[10px] uppercase">
                      <span>Advisory Guidance</span>
                      <span className="text-amber-400 font-bold">Analyst Decision Required</span>
                    </div>
                    <p className="pt-1">{selectedThreat.recommendedAction}</p>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Report Status: <span className="text-slate-200 font-bold">{selectedThreat.status}</span>
                  </span>

                  <Link href={`/threats/${selectedThreat.id}`}>
                    <Button
                      variant="cyan"
                      size="sm"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      VIEW INVESTIGATION WORKSPACE
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <SocLayout>
      <ReportsContent />
    </SocLayout>
  );
}
