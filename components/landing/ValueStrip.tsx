import React from 'react';
import { Activity, Brain, ShieldCheck, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export const ValueStrip: React.FC = () => {
  const values = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Continuous packet-level telemetry inspection without flow disruption.',
    },
    {
      icon: Brain,
      title: 'Explainable AI',
      description: 'Transparent threat scoring backed by clear evidence and rationale.',
    },
    {
      icon: ShieldCheck,
      title: 'Anomaly Detection',
      description: 'Learns baseline behavioral patterns to catch zero-day anomalies.',
    },
    {
      icon: Search,
      title: 'SOC Investigation',
      description: 'Streamlined analyst workflows from detection to response.',
    },
  ];

  return (
    <section className="py-12 bg-slate-950 border-y border-slate-900">
      <Container size="xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{v.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{v.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
