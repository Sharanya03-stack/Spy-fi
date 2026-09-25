'use client';

import React, { useState } from 'react';
import { SocHeader } from './SocHeader';
import { SocSidebar } from './SocSidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { PageTransition } from '@/components/ui/PageTransition';

export const SocLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeToast, dismissToast } = useSimulation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Left Sidebar */}
      <SocSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar width on large screens) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
        {/* Top Header Command Bar */}
        <SocHeader
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1920px] w-full mx-auto space-y-6">
          <PageTransition>{children}</PageTransition>
        </main>

        <ToastContainer toast={activeToast} onClose={dismissToast} />

        {/* Footer */}
        <footer className="py-4 border-t border-slate-800/80 bg-[#090D16] text-center text-xs font-mono text-slate-400">
          <div className="max-w-[1920px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Spy-fi • Unidirectional IP Network Telemetry & Cyber Threat Defense
            </span>
            <span className="text-slate-400 text-[11px]">
              Smart India Hackathon 2026 • Problem Statement 145
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
