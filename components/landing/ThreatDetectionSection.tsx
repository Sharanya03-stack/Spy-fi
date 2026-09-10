import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Radar, Zap, KeyRound, Activity } from 'lucide-react';

export const ThreatDetectionSection: React.FC = () => {
  const threats = [
    {
      icon: Radar,
      title: 'Port Scanning & Recon',
      severity: 'HIGH' as const,
      tag: 'Supported Threat Pattern',
      description:
        'Detects sequential or distributed port probing across multiple destination ports in short time windows. Flags origin IPs conducting network topology mapping.',
      indicators: ['30+ unique ports contacted', 'High connection rate', 'Short duration bursts'],
    },
    {
      icon: Zap,
      title: 'Denial of Service (DoS / DDoS)',
      severity: 'CRITICAL' as const,
      tag: 'Supported Threat Pattern',
      description:
        'Identifies sudden volumetric packet bursts designed to saturate one-way receiving buffers or flood destination target services.',
      indicators: ['Packet rate > 50,000 pps', 'High byte velocity', 'SYN flag flooding'],
    },
    {
      icon: KeyRound,
      title: 'Brute Force Attempts',
      severity: 'HIGH' as const,
      tag: 'Supported Threat Pattern',
      description:
        'Detects repetitive connection attempts targeted at authentication ports (SSH, RDP, HTTPS) originating from suspicious source hosts.',
      indicators: ['Targeting ports 22, 3389, 443', 'Sustained request frequency', 'Short TCP flows'],
    },
    {
      icon: Activity,
      title: 'Traffic & Protocol Anomalies',
      severity: 'MEDIUM' as const,
      tag: 'Supported Threat Pattern',
      description:
        'Flags subtle deviations from learned baseline traffic metrics, including unusual average packet sizes, anomalous protocols, or off-hour traffic.',
      indicators: ['Packet size skewness', 'Non-standard protocol usage', 'Baseline Z-score > 3.0'],
    },
  ];

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900" id="threat-detection">
      <Container size="xl">
        <SectionHeading
          badge="THREAT CLASSIFICATION MATRIX"
          title="AI Threat Detection Capabilities"
          subtitle="Spy-fi evaluates incoming unidirectional network flows against four core cybersecurity threat vectors."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {threats.map((t, i) => {
            const Icon = t.icon;
            return (
              <Card key={i} hoverable className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{t.title}</h3>
                        <span className="text-[11px] font-mono text-slate-400">{t.tag}</span>
                      </div>
                    </div>
                    <Badge severity={t.severity} />
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {t.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-xs font-mono text-slate-400 block mb-2">
                    Key Telemetry Indicators:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {t.indicators.map((ind, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        • {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
