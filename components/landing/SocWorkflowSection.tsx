import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Radio, Brain, BellRing, Search, ShieldCheck, CheckCircle } from 'lucide-react';

export const SocWorkflowSection: React.FC = () => {
  const steps = [
    { icon: Radio, name: 'Traffic Telemetry', step: '01' },
    { icon: Brain, name: 'AI Detection', step: '02' },
    { icon: BellRing, name: 'Threat Alert', step: '03' },
    { icon: Search, name: 'XAI Investigation', step: '04' },
    { icon: ShieldCheck, name: 'Risk Assessment', step: '05' },
    { icon: CheckCircle, name: 'SOC Response', step: '06' },
  ];

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900" id="workflow">
      <Container size="xl">
        <SectionHeading
          badge="SECURITY OPERATIONS WORKFLOW"
          title="End-to-End SOC Investigation Experience"
          subtitle="Designed to integrate seamlessly into modern Security Operations Center processes with minimal cognitive load."
        />

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-700/60 transition-all group"
              >
                <span className="text-[10px] font-mono text-slate-500 mb-2">PHASE {s.step}</span>
                <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:border-emerald-500 transition-colors mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-semibold text-white">{s.name}</h4>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
