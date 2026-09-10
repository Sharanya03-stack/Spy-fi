import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Radio, BarChart2, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Radio,
      title: 'Capture',
      subtitle: 'Unidirectional Telemetry',
      description: 'Passively ingests incoming one-way IP packet streams without generating response packets.',
    },
    {
      num: '02',
      icon: BarChart2,
      title: 'Analyze',
      subtitle: 'Flow Feature Extraction',
      description: 'Extracts 12+ dimensional flow characteristics including packet velocity, TCP flags, and port metrics.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      title: 'Detect',
      subtitle: 'AI Pattern Recognition',
      description: 'FastAPI ML models evaluate flow deviations against baseline normal traffic profiles.',
    },
    {
      num: '04',
      icon: FileText,
      title: 'Explain',
      subtitle: 'XAI Intelligence & Action',
      description: 'Delivers actionable SOC findings with confidence scores, anomaly indicators, and mitigation steps.',
    },
  ];

  return (
    <section className="py-24 bg-slate-950/80 border-t border-slate-900 relative" id="how-it-works">
      <Container size="xl">
        <SectionHeading
          badge="ARCHITECTURE PIPELINE"
          title="How UniGuard AI Defends One-Way Flows"
          subtitle="A streamlined 4-step machine learning pipeline designed to inspect one-way traffic with zero operational latency."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Connector line behind desktop steps */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-emerald-950 via-emerald-600/40 to-emerald-950 -translate-y-6 pointer-events-none" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative flex flex-col p-6 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all z-10 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    STEP {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-1">{step.title}</h3>
                <span className="text-xs font-mono text-emerald-400 mb-2">{step.subtitle}</span>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
