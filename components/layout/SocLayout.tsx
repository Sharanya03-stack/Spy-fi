'use client';

import React from 'react';
import { SocHeader } from './SocHeader';
import { SocNavigation } from './SocNavigation';
import { ToastContainer } from '@/components/ui/Toast';
import { SimulationProvider, useSimulation } from '@/lib/simulation/simulationStore';
import { PageTransition } from '@/components/ui/PageTransition';

function SocLayoutInner({ children }: { children: React.ReactNode }) {
  const { activeToast, dismissToast } = useSimulation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <SocHeader />
      <SocNavigation />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <PageTransition>{children}</PageTransition>
      </main>

      <ToastContainer toast={activeToast} onClose={dismissToast} />

      <footer className="py-4 border-t border-slate-900 text-center text-xs font-mono text-slate-500">
        Spy-fi • Unidirectional IP Network Telemetry & Threat Defense Console
      </footer>
    </div>
  );
}

export const SocLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SimulationProvider>
      <SocLayoutInner>{children}</SocLayoutInner>
    </SimulationProvider>
  );
};
