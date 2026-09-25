'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
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
  Menu,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { ThreatType } from '@/lib/types/network';

interface SocHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const SocHeader: React.FC<SocHeaderProps> = ({ onToggleMobileMenu }) => {
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
    <header className="bg-[#0B0F19]/90 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Trigger + Command Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white font-sans">
                  Security Operations Center
                </span>
                <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-slate-700" />
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-cyan-400 uppercase font-semibold">
                  <ShieldCheck className="h-3 w-3 text-cyan-400" />
                  UNIDIRECTIONAL DIODE MONITOR
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden md:block">
                SIH PS-145 • AI Cyber Threat Detection Engine
              </span>
            </div>
          </div>

          {/* Center: System Status & Detection Mode Selector */}
          <div className="hidden xl:flex items-center gap-3">
            <StatusIndicator
              status={metrics.criticalAlerts > 0 ? 'warning' : 'online'}
              label={metrics.criticalAlerts > 0 ? 'ATTACK IN PROGRESS' : 'OPERATIONAL'}
              size="sm"
            />

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2 bg-[#0F1623] p-1 rounded-xl border border-slate-800/80">
              <button
                onClick={() => setDetectionMode('simulation')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all ${
                  detectionMode === 'simulation'
                    ? 'bg-sky-950/80 text-sky-400 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                Demo Simulation
              </button>

              <button
                onClick={() => setDetectionMode('ml')}
                disabled={isMlConnecting}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all ${
                  detectionMode === 'ml'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
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
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            
            {/* Simulate Threat Trigger Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="cyan"
                size="sm"
                onClick={() => setIsSimulateOpen(!isSimulateOpen)}
                rightIcon={<ChevronDown className="h-3.5 w-3.5" />}
                leftIcon={<Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-amber-500/40 shadow-lg shadow-amber-950/40 font-mono text-xs"
              >
                Simulate Threat
              </Button>

              {isSimulateOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#121925] border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                      INJECT SIMULATED ATTACK
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Inject telemetry anomaly into unidirectional stream
                    </span>
                  </div>

                  <button
                    onClick={() => handleTrigger('PORT_SCAN')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-200 hover:bg-slate-800/80 hover:text-orange-400 transition-colors"
                  >
                    <Radar className="h-4 w-4 text-orange-400 shrink-0" />
                    <div>
                      <strong className="block font-sans text-xs text-white">Port Scan Attack</strong>
                      <span className="text-[10px] text-slate-400">SYN sweep across ports</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTrigger('DOS_DDOS')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-200 hover:bg-slate-800/80 hover:text-rose-400 transition-colors"
                  >
                    <Zap className="h-4 w-4 text-rose-400 shrink-0" />
                    <div>
                      <strong className="block font-sans text-xs text-white">DoS / DDoS Flood</strong>
                      <span className="text-[10px] text-slate-400">Volumetric packet spike</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTrigger('BRUTE_FORCE')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-200 hover:bg-slate-800/80 hover:text-amber-400 transition-colors"
                  >
                    <KeyRound className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <strong className="block font-sans text-xs text-white">Brute Force Auth</strong>
                      <span className="text-[10px] text-slate-400">Auth handshake spray</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTrigger('TRAFFIC_ANOMALY')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-200 hover:bg-slate-800/80 hover:text-cyan-400 transition-colors"
                  >
                    <Activity className="h-4 w-4 text-cyan-400 shrink-0" />
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
              className="hidden sm:inline-flex"
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
              className="hidden md:inline-flex"
            >
              Reset
            </Button>

            {/* Notification Indicator */}
            <div className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 cursor-pointer">
              <Bell className="h-4 w-4" />
              {metrics.criticalAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="h-8 w-8 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm">
                <User className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight font-sans">Analyst SOC-1</span>
                <span className="text-[10px] font-mono text-slate-400">SIH 2026 Admin</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
