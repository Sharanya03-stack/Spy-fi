'use client';

import React from 'react';
import { SocLayout } from '@/components/layout/SocLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { Settings, Cpu, ShieldCheck, Sliders, Server, Zap, Radio } from 'lucide-react';

export default function SettingsPage() {
  const { detectionMode, setDetectionMode, mlHealth } = useSimulation();

  return (
    <SocLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-[#121925]/95 border border-slate-800/80 shadow-soc-panel flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                SYSTEM CONFIGURATION
              </span>
              <span className="text-[10px] font-mono text-slate-400">SOC ENGINE PARAMETERS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Settings className="h-7 w-7 text-cyan-400" /> SYSTEM & MODEL SETTINGS
            </h1>
          </div>

          <Badge variant="cyan" size="md">
            Operational Console Settings
          </Badge>
        </div>

        {/* Grid Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
          
          {/* Section 1: Detection Engine Mode */}
          <Card className="p-6 space-y-4 bg-[#121925]/95 border-slate-800/80">
            <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" /> DETECTION ENGINE MODE
              </h3>
              <Badge variant={detectionMode === 'ml' ? 'normal' : 'cyan'} size="sm">
                Active: {detectionMode === 'ml' ? 'REAL ML' : 'SIMULATION'}
              </Badge>
            </div>

            <p className="text-xs font-sans text-slate-400 leading-relaxed">
              Switch operational mode between Real ML Inference (FastAPI backend running HistGradientBoosting on UNSW-NB15 dataset) and Controlled Browser Demo Simulation.
            </p>

            <div className="space-y-3 pt-2">
              <div
                onClick={() => setDetectionMode('simulation')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  detectionMode === 'simulation'
                    ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-soc-glow'
                    : 'bg-[#090D16] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Radio className="h-4 w-4" /> DEMO SIMULATION MODE
                  </span>
                  <span>Standalone</span>
                </div>
                <p className="text-[11px] font-sans text-slate-400">
                  Autonomous in-memory threat stream for presenter demos, testing, and UI validation without backend dependencies.
                </p>
              </div>

              <div
                onClick={() => setDetectionMode('ml')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  detectionMode === 'ml'
                    ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-[#090D16] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Cpu className="h-4 w-4" /> REAL ML INFERENCE MODE
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">FastAPI :8000</span>
                </div>
                <p className="text-[11px] font-sans text-slate-400">
                  Connects to FastAPI Python ML service (`/api/v1/detect`) running `HistGradientBoostingClassifier` trained on UNSW-NB15 data.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 2: FastAPI Endpoint Status */}
          <Card className="p-6 space-y-4 bg-[#121925]/95 border-slate-800/80">
            <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Server className="h-4 w-4 text-cyan-400" /> FASTAPI SERVICE METRICS
              </h3>
              <Badge variant={mlHealth?.model_loaded ? 'normal' : 'critical'} size="sm">
                {mlHealth?.model_loaded ? 'ONLINE' : 'DISCONNECTED'}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">ENDPOINT URL</span>
                <span className="text-slate-200 font-bold">http://localhost:8000</span>
              </div>

              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">MODEL TYPE</span>
                <span className="text-emerald-400 font-bold">{mlHealth?.model_type || 'HistGradientBoostingClassifier'}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">BENCHMARK MACRO F1</span>
                <span className="text-emerald-400 font-bold">{mlHealth?.macro_f1 || 0.6288}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">DATASET REFERENCE</span>
                <span className="text-slate-200 font-bold">UNSW-NB15 (25,072 Test Samples)</span>
              </div>
            </div>
          </Card>

          {/* Section 3: Detection Sensitivity & Threshold Controls */}
          <Card className="p-6 space-y-4 bg-[#121925]/95 border-slate-800/80">
            <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-400" /> SENSITIVITY THRESHOLDS
              </h3>
              <span className="text-[10px] text-amber-400 font-bold">SOC POLICY</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Port Scan Detection Threshold</span>
                  <span className="text-amber-400 font-bold">15 ports / sec</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#090D16] overflow-hidden border border-slate-800">
                  <div className="h-full bg-amber-500 rounded-full w-[70%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>DoS Volumetric Threshold</span>
                  <span className="text-rose-400 font-bold">25,000 pkt / sec</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#090D16] overflow-hidden border border-slate-800">
                  <div className="h-full bg-rose-500 rounded-full w-[85%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Baseline Anomaly Z-Score Sensitivity</span>
                  <span className="text-cyan-400 font-bold">2.5 Sigma</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#090D16] overflow-hidden border border-slate-800">
                  <div className="h-full bg-cyan-500 rounded-full w-[60%]" />
                </div>
              </div>
            </div>
          </Card>

          {/* Section 4: Data Diode Protection Protocol */}
          <Card className="p-6 space-y-4 bg-[#121925]/95 border-slate-800/80">
            <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> DATA DIODE PROTECTION SCHEME
              </h3>
              <Badge variant="normal" size="sm">
                HARDWARE ISOLATION
              </Badge>
            </div>

            <p className="text-xs font-sans text-slate-400 leading-relaxed">
              Spy-fi operates on strict unidirectional hardware data diode channels (SIH 2026 Problem Statement 145), prohibiting backchannel reverse signals from entering protected industrial networks.
            </p>

            <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div>• Physical Layer: One-Way Optical Transceiver Pair</div>
              <div>• Protocol Layer: Non-Acknowledgable Telemetry Stream</div>
              <div>• Human Consent: Required prior to controlled response execution</div>
            </div>
          </Card>

        </div>
      </div>
    </SocLayout>
  );
}
