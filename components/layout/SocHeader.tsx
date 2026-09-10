'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Radar,
  KeyRound,
  Activity,
  ChevronDown,
  User,
  Cpu,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { ThreatType } from '@/lib/types/network';

export const SocHeader: React.FC = () => {
  const {
    isPaused,
    togglePause,
    resetDemo,
    simulateThreat,
    metrics,
    detectionMode,
    mlHealth,
    isMlConnecting,
    setDetectionMode,
  } = useSimulation();

  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSimulateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTrigger = (type: ThreatType) => {
    simulateThreat(type);
    setIsSimulateOpen(false);
  };

  return (
    <header className="bg-slate-950 border-b border-slate-900 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Left: Brand Logo + System Status */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-lg bg-emerald-950/90 border border-emerald-700/60 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500 shadow-soc-glow transition-all">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-white">
                UniGuard <span className="text-emerald-400 font-mono text-sm">AI</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-3">
              <StatusIndicator
                status={metrics.criticalAlerts > 0 ? 'warning' : 'online'}
                label={metrics.criticalAlerts > 0 ? 'ATTACK DETECTED' : 'SYSTEM OPERATIONAL'}
                size="sm"
              />
            </div>
          </div>

          {/* Center: Detection Mode Selector (Demo Simulation vs Real ML) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setDetectionMode('simulation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all ${
                detectionMode === 'simulation'
                  ? 'bg-slate-800 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              Demo Simulation
            </button>

            <button
              onClick={() => setDetectionMode('ml')}
              disabled={isMlConnecting}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all ${
                detectionMode === 'ml'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 shadow-soc-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              {isMlConnecting ? 'Connecting ML...' : 'Real ML Mode'}
            </button>

            {detectionMode === 'ml' && (
              <div className="pl-2 pr-1 flex items-center gap-1.5 border-l border-slate-800">
                {mlHealth?.model_loaded ? (
                  <Badge variant="normal" size="sm" className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 border-emerald-500/40">
                    FastAPI (UNSW-NB15)
                  </Badge>
                ) : (
                  <Badge variant="critical" size="sm" className="font-mono text-[10px] flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    API Offline
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Right Controls Suite */}
          <div className="flex items-center gap-3">
            
            {/* Simulate Threat Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsSimulateOpen(!isSimulateOpen)}
                rightIcon={<ChevronDown className="h-4 w-4" />}
                leftIcon={<Zap className="h-4 w-4 text-amber-300" />}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-amber-500/40 shadow-lg shadow-amber-950/40"
              >
                Simulate Threat
              </Button>

              {isSimulateOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                      TRIGGER DEMO THREAT ATK
                    </span>
                    <span className="text-xs text-slate-300">
                      Inject simulated attack into one-way traffic stream
                    </span>
                  </div>

                  <button
                    onClick={() => handleTrigger('PORT_SCAN')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition-colors"
                  >
                    <Radar className="h-4 w-4 text-orange-400 shrink-0" />
                    <div>
                      <strong className="block font-sans text-xs text-white">Port Scan Attack</strong>
                      <span className="text-[10px] text-slate-400">SYN sweep across 40+ ports</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTrigger('DOS_DDOS')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-200 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                  >
                    <Zap className="h-4 w-4 text-rose-400 shrink-0" />
                    <div>
                      <strong className="block font-sans text-xs text-white">DoS / DDoS Flood</strong>
                      <span className="text-[10px] text-slate-400">Volumetric packet spike</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTrigger('BRUTE_FORCE')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-colors"
                  >
                    <KeyRound className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <strong className="block font-sans text-xs text-white">Brute Force Auth</strong>
                      <span className="text-[10px] text-slate-400">Repetitive password spray</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTrigger('TRAFFIC_ANOMALY')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-200 hover:bg-slate-800 hover:text-sky-400 transition-colors"
                  >
                    <Activity className="h-4 w-4 text-sky-400 shrink-0" />
                    <div>
                      <strong className="block font-sans text-xs text-white">Traffic Anomaly</strong>
                      <span className="text-[10px] text-slate-400">Statistical baseline skew</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Pause / Resume Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={togglePause}
              leftIcon={
                isPaused ? (
                  <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                ) : (
                  <Pause className="h-3.5 w-3.5 text-slate-400" />
                )
              }
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>

            {/* Reset Demo Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetDemo}
              title="Reset Demo State"
              leftIcon={<RotateCcw className="h-3.5 w-3.5 text-slate-400" />}
            >
              <span className="hidden sm:inline">Reset Demo</span>
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">Analyst SOC-1</span>
                <span className="text-[10px] font-mono text-slate-400">SIH Demo User</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
