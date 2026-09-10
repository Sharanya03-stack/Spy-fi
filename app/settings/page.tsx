'use client';

import React from 'react';
import { SimulationProvider } from '@/lib/simulation/simulationStore';
import { SocLayout } from '@/components/layout/SocLayout';
import { Settings } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function SettingsPlaceholderPage() {
  return (
    <SimulationProvider>
      <SocLayout>
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-3xl mx-auto my-12">
          <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mx-auto">
            <Settings className="h-6 w-6" />
          </div>
          <div className="inline-flex items-center gap-2">
            <Badge variant="neutral" size="sm">Phase 4 Route</Badge>
          </div>
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            Detection sensitivity sliders, threshold configuration, simulation controls, and FastAPI endpoint settings.
          </p>
        </div>
      </SocLayout>
    </SimulationProvider>
  );
}
