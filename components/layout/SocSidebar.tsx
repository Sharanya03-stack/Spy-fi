'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  ShieldAlert,
  BarChart3,
  Clock,
  FileText,
  Settings,
  Sparkles,
  Cpu,
  Radio,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { SpyFiLogo } from '@/components/ui/SpyFiLogo';
import { useSimulation } from '@/lib/simulation/simulationStore';

interface SocSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SocSidebar: React.FC<SocSidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();
  const { detectionMode, setDetectionMode, isMlConnecting } = useSimulation();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Traffic', href: '/traffic', icon: Activity },
    { label: 'Threats', href: '/threats', icon: ShieldAlert },
    { label: 'Response Audit', href: '/timeline', icon: Clock },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'SIH Demo', href: '/demo', icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header / Brand */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/dashboard" onClick={onClose} className="block">
            <SpyFiLogo size="sm" showSubtitle={true} />
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Subtitle / Console Tag */}
        <div className="px-4 py-2 bg-[#090D16] border-b border-slate-800/50 flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Radio className="h-3 w-3 animate-pulse text-cyan-400" />
            AI-ASSISTED SOC
          </span>
          <span className="text-slate-500">v1.0.0</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-mono transition-all relative select-none',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900/90 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                )}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                )}

                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors shrink-0',
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span className="flex-1">{item.label}</span>

                {item.label === 'SIH Demo' && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                    PS-145
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Environment / System Status Footer Area */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090D16] space-y-3">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-slate-400 uppercase text-[10px]">SYSTEM STATUS</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SOC ONLINE
            </span>
          </div>

          {/* Mode Switcher Pill */}
          <div className="p-1 rounded-xl bg-[#0F1623] border border-slate-800 flex items-center gap-1 font-mono text-[10px]">
            <button
              onClick={() => setDetectionMode('simulation')}
              className={cn(
                'flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all',
                detectionMode === 'simulation'
                  ? 'bg-sky-950 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Sparkles className="h-3 w-3 text-sky-400" />
              SIMULATION
            </button>
            <button
              onClick={() => setDetectionMode('ml')}
              disabled={isMlConnecting}
              className={cn(
                'flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all',
                detectionMode === 'ml'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Cpu className="h-3 w-3 text-emerald-400" />
              REAL ML
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
