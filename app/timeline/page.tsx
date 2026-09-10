'use client';

import React from 'react';
import { SimulationProvider } from '@/lib/simulation/simulationStore';
import { SocLayout } from '@/components/layout/SocLayout';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function TimelinePlaceholderPage() {
  return (
    <SimulationProvider>
      <SocLayout>
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-3xl mx-auto my-12">
          <div className="h-12 w-12 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 mx-auto">
            <Clock className="h-6 w-6" />
          </div>
          <div className="inline-flex items-center gap-2">
            <Badge variant="normal" size="sm">Phase 4 Route</Badge>
          </div>
          <h2 className="text-2xl font-bold text-white">Incident Timeline</h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            Chronological step-by-step audit trail detailing connection attempts, port hits, threshold breaches, and final AI classification.
          </p>
        </div>
      </SocLayout>
    </SimulationProvider>
  );
}
