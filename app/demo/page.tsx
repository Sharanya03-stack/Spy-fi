'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SocLayout } from '@/components/layout/SocLayout';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { DetectionPipeline } from '@/components/demo/DetectionPipeline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThreatType } from '@/lib/types/network';
import {
  Play,
  RotateCcw,
  Activity,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  FileText,
  AlertTriangle,
  Radio,
  Search,
} from 'lucide-react';

function SihDemoContent() {
  const {
    threats,
    detectionMode,
    mlHealth,
    simulateThreat,
    resetDemo,
    setDetectionMode,
  } = useSimulation();

  const [activeScenario, setActiveScenario] = useState<string>('NORMAL');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [latestDemoThreatId, setLatestDemoThreatId] = useState<string | null>(null);

  const activeThreat = threats.find((t) => t.id === latestDemoThreatId) || threats[0];

  const handleRunScenario = (scenarioKey: string, threatType?: ThreatType) => {
    setActiveScenario(scenarioKey);
    if (scenarioKey === 'NORMAL') {
      setActiveStep(0);
      setLatestDemoThreatId(null);
    } else if (threatType) {
      const newThreat = simulateThreat(threatType);
      setLatestDemoThreatId(newThreat.id);
      setActiveStep(1);
    }
  };

  const handleStartDemoFlow = () => {
    setActiveScenario('PORT_SCAN');
    const newThreat = simulateThreat('PORT_SCAN');
    setLatestDemoThreatId(newThreat.id);
    setActiveStep(1);
  };

  const handleReset = () => {
    resetDemo();
    setActiveScenario('NORMAL');
    setActiveStep(0);
    setLatestDemoThreatId(null);
  };

  const isRealMl = detectionMode === 'ml' && mlHealth?.model_loaded;

  return (
    <div className="space-y-6">
      {/* SIH Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                SMART INDIA HACKATHON 2026
              </span>
              <span className="text-[10px] font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded bg-slate-900">
                PROBLEM STATEMENT 145
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              UNIGUARD AI — SIH DEMONSTRATION CONSOLE
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1 max-w-2xl">
              AI-Based Detection of Cyber Threats in Unidirectional IP Traffic Telemetry
            </p>
          </div>

          {/* Mode & Health Pill */}
          <div className="flex flex-col items-end gap-2 font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <Radio className={`h-3.5 w-3.5 ${isRealMl ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-[11px] text-slate-400">DETECTION ENGINE:</span>
              {isRealMl ? (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  ● REAL ML INFERENCE (UNSW-NB15)
                </span>
              ) : (
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  ● DEMO SIMULATION
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <button
                onClick={() => setDetectionMode('simulation')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  detectionMode === 'simulation'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                SIMULATION MODE
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setDetectionMode('ml')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  detectionMode === 'ml'
                    ? 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-800'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                REAL ML MODE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Step Progress Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> GUIDED DEMONSTRATION WORKFLOW
          </span>
          <span className="text-slate-500 text-[10px]">STEP {activeStep + 1} OF 4</span>
        </div>

        <div className="grid grid-cols-4 gap-2 font-mono text-xs">
          {[
            { num: '01', title: 'TRAFFIC', desc: 'Ingress Telemetry' },
            { num: '02', title: 'DETECTION', desc: 'AI Classification' },
            { num: '03', title: 'INVESTIGATION', desc: 'Forensic XAI' },
            { num: '04', title: 'RESPONSE', desc: 'Advisory Action' },
          ].map((st, idx) => (
            <button
              key={st.num}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-lg border text-left transition-all ${
                activeStep === idx
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40'
                  : activeStep > idx
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold opacity-60">{st.num}</span>
                {activeStep > idx && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
              <div className="font-bold tracking-tight text-xs mt-0.5">{st.title}</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5 truncate">{st.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* End-to-End Pipeline Visualization */}
      <DetectionPipeline activeStepIndex={activeStep * 2} />

      {/* Scenario Controls & One-Click Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Scenario Selector */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" /> DEMO SCENARIO SELECTOR
              </h3>
              <p className="text-[11px] font-sans text-slate-400 mt-0.5">
                Select a scenario to simulate traffic telemetry against the detection engine
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartDemoFlow}
                leftIcon={<Play className="h-3.5 w-3.5 text-amber-300" />}
              >
                START DEMO
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcw className="h-3.5 w-3.5 text-slate-400" />}
              >
                RESET
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {/* Scenario 1: Normal Traffic */}
            <div
              onClick={() => handleRunScenario('NORMAL')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeScenario === 'NORMAL'
                  ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="h-4 w-4" /> NORMAL TRAFFIC
                </span>
                <Badge variant="normal" size="sm">BENIGN</Badge>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed mb-3">
                Simulates standard unidirectional web & DNS background flow telemetry.
              </p>
              <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <span>EXPECTED RESULT:</span>
                <span className="font-bold text-emerald-400">BENIGN / NORMAL</span>
              </div>
            </div>

            {/* Scenario 2: Port Scan */}
            <div
              onClick={() => handleRunScenario('PORT_SCAN', 'PORT_SCAN')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeScenario === 'PORT_SCAN'
                  ? 'bg-orange-950/40 border-orange-500 shadow-md ring-1 ring-orange-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-orange-400 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" /> PORT SCAN
                </span>
                <Badge severity="HIGH" size="sm">PORT_SCAN</Badge>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed mb-3">
                Simulates abnormal connection probes across multiple target destination ports.
              </p>
              <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <span>EXPECTED RESULT:</span>
                <span className="font-bold text-orange-400">PORT_SCAN</span>
              </div>
            </div>

            {/* Scenario 3: DoS / Traffic Flood */}
            <div
              onClick={() => handleRunScenario('DOS', 'DOS_DDOS')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeScenario === 'DOS'
                  ? 'bg-rose-950/40 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> DENIAL OF SERVICE
                </span>
                <Badge severity="CRITICAL" size="sm">DOS</Badge>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed mb-3">
                Simulates unusually high packet throughput toward protected perimeter assets.
              </p>
              <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <span>EXPECTED RESULT:</span>
                <span className="font-bold text-rose-400">DOS</span>
              </div>
            </div>

            {/* Scenario 4: Traffic Anomaly */}
            <div
              onClick={() => handleRunScenario('TRAFFIC_ANOMALY', 'TRAFFIC_ANOMALY')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeScenario === 'TRAFFIC_ANOMALY'
                  ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> TRAFFIC ANOMALY
                </span>
                <Badge severity="MEDIUM" size="sm">ANOMALY</Badge>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed mb-3">
                Simulates flow characteristics significantly outside benign reference stats.
              </p>
              <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <span>EXPECTED RESULT:</span>
                <span className="font-bold text-amber-400">ANOMALY</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Column 3: Live Evidence & Active Threat Preview */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Search className="h-4 w-4 text-emerald-400" /> EVIDENCE PREVIEW
            </h3>
            {activeThreat && (
              <span className="text-[10px] font-mono text-slate-400">{activeThreat.id}</span>
            )}
          </div>

          {activeScenario === 'NORMAL' && !latestDemoThreatId ? (
            <div className="py-10 text-center font-mono space-y-2">
              <Activity className="h-8 w-8 text-emerald-400 mx-auto animate-pulse" />
              <p className="text-xs text-slate-300 font-bold">NORMAL TRAFFIC FLOWING</p>
              <p className="text-[11px] text-slate-500 font-sans max-w-xs mx-auto">
                No anomalous threats detected in current baseline telemetry stream.
              </p>
            </div>
          ) : activeThreat ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">AI RESULT</div>
                <div className="text-sm font-extrabold text-white flex items-center justify-between">
                  <span>{activeThreat.title}</span>
                  <Badge severity={activeThreat.severity} size="sm" dot />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">AI CONFIDENCE</span>
                  <span className="text-sm font-bold text-emerald-400">{activeThreat.confidence}%</span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">RISK SCORE</span>
                  <span className="text-sm font-bold text-orange-400">{activeThreat.riskScore} / 100</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div><span className="text-slate-500">SOURCE:</span> {activeThreat.sourceIp}</div>
                <div><span className="text-slate-500">DEST:</span> {activeThreat.destinationIp}</div>
                <div><span className="text-slate-500">ENGINE:</span> {activeThreat.detectionSource === 'ml' ? 'REAL ML (UNSW-NB15)' : 'DEMO SIMULATION'}</div>
              </div>

              <Link href={`/threats/${activeThreat.id}`} className="block">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  OPEN INVESTIGATION WORKSPACE
                </Button>
              </Link>
            </div>
          ) : null}
        </Card>
      </div>

      {/* Live Attack Unidirectional Visualizer */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" /> UNIDIRECTIONAL TOPOLOGY SCHEMATIC (ONE-WAY TELEMETRY)
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            STRICT HARDWARE ENFORCED DIRECTION
          </span>
        </div>

        <div className="py-6 px-4 rounded-xl bg-slate-950 border border-slate-900 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center font-mono text-center text-xs">
            
            {/* Node 1: Untrusted Source */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">NODE 01</span>
              <span className="text-slate-200 font-bold block">UNTRUSTED SOURCE</span>
              <span className="text-[10px] text-slate-400 font-sans block">External IP Ingress</span>
            </div>

            {/* Node 2: Telemetry Flow */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 relative">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">DIRECTIONAL FLOW</span>
              <span className={`font-bold block ${activeScenario === 'NORMAL' ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                {activeScenario === 'NORMAL' ? 'NORMAL FLOW ──────►' : 'SUSPICIOUS FLOW ───►'}
              </span>
              <span className="text-[10px] text-slate-400 font-sans block">One-Way Transmission</span>
            </div>

            {/* Node 3: AI Engine */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">NODE 02</span>
              <span className="text-emerald-400 font-bold block">UNIGUARD AI ENGINE</span>
              <span className="text-[10px] text-slate-400 font-sans block">
                {isRealMl ? 'HistGradientBoosting ML' : 'Simulation Engine'}
              </span>
            </div>

            {/* Node 4: Protected Zone */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">NODE 03</span>
              <span className="text-slate-200 font-bold block">PROTECTED PERIMETER</span>
              <span className="text-[10px] text-slate-400 font-sans block">Isolated Internal Zone</span>
            </div>

          </div>
        </div>
      </Card>

      {/* PS-145 Problem Statement Alignment Panel */}
      <Card className="p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" /> HOW UNIGUARD AI ADDRESSES PROBLEM STATEMENT 145
          </h3>
          <p className="text-xs font-sans text-slate-400 mt-1">
            Smart India Hackathon 2026 — AI-Based Detection of Cyber Threats in Unidirectional IP Network Traffic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-emerald-400 font-bold">01 — UNIDIRECTIONAL TELEMETRY</div>
            <div className="text-slate-200 font-bold">One-Way Flow Ingestion</div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Designed around strictly unidirectional IP flow telemetry captured from untrusted network boundaries without backward transmissions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-emerald-400 font-bold">02 — FEATURE EXTRACTION</div>
            <div className="text-slate-200 font-bold">9 Native Flow Features</div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Transforms raw flow records into 9 native features (packet counts, flow duration, rate, bytes/sec, ports, and protocol).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-emerald-400 font-bold">03 — AI DETECTION</div>
            <div className="text-slate-200 font-bold">UNSW-NB15 Trained Model</div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Classifies network flows using a supervised HistGradientBoosting model trained on 257,673 authentic UNSW-NB15 records.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-emerald-400 font-bold">04 — EXPLAINABILITY</div>
            <div className="text-slate-200 font-bold">Baseline Deviation XAI</div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Provides baseline deviation statistics against benign training metrics so analysts understand why alerts were triggered.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-emerald-400 font-bold">05 — RISK ASSESSMENT</div>
            <div className="text-slate-200 font-bold">Decoupled SOC Policy</div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Combines raw model confidence and suspicion scores with operational SOC policy to assign severity levels transparently.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-emerald-400 font-bold">06 — ANALYST RESPONSE</div>
            <div className="text-slate-200 font-bold">Phased Advisory Guidance</div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Offers non-destructive advisory response steps across 4 operational phases, keeping human SOC analysts strictly in control.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function SihDemoPage() {
  return (
    <SocLayout>
      <SihDemoContent />
    </SocLayout>
  );
}
