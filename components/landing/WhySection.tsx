import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Eye, ShieldAlert, Cpu } from 'lucide-react';

export const WhySection: React.FC = () => {
  const cards = [
    {
      num: '01',
      icon: Eye,
      title: 'Continuous Monitoring',
      description:
        'Unidirectional data diodes protect against physical return vectors, but incoming traffic streams can still conceal hidden reconnaissance, payloads, or protocol abuse. Spy-fi maintains uninterrupted packet inspection at full line speed.',
    },
    {
      num: '02',
      icon: Cpu,
      title: 'AI-Based Detection',
      description:
        'Static firewall rules fail against novel attack vectors and high-velocity connection spikes. Our machine learning models evaluate multi-dimensional flow metrics to detect anomalies before critical systems are compromised.',
    },
    {
      num: '03',
      icon: ShieldAlert,
      title: 'Explainable Security Intelligence',
      description:
        'Black-box alerts create SOC fatigue and delay response. Spy-fi explicitly details why traffic was flagged — displaying connection counts, targeted ports, anomaly scores, and clear remediation guidelines.',
    },
  ];

  return (
    <section className="py-24 bg-slate-950 relative">
      <Container size="xl">
        <SectionHeading
          badge="WHY SPY-FI"
          title="Security Doesn't Stop at the Network Boundary"
          subtitle="Unidirectional architectures significantly reduce attack surfaces, but one-way traffic entering high-security environments can still carry malicious intent or protocol anomalies."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={i} hoverable className="flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {card.num}
                    </span>
                    <div className="h-10 w-10 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-800/60 text-xs font-mono text-emerald-400/80 flex items-center gap-1">
                  <span>UNIDIRECTIONAL CAPABILITY</span>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
