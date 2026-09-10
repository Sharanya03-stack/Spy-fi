'use client';

import React from 'react';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import { Clock, CheckCircle2, AlertTriangle, ShieldAlert, Play, Check } from 'lucide-react';

export interface IncidentTimelineProps {
  threat: ThreatEvent;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ threat }) => {
  const baseTime = new Date(threat.detectedAt).getTime();

  const formatOffsetTime = (secondsOffset: number) => {
    return new Date(baseTime + secondsOffset * 1000).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const isRealMl = threat.detectionSource === 'ml';

  // Coherent SOC Incident Lifecycle Events
  const events = [
    {
      time: formatOffsetTime(0),
      title: 'THREAT DETECTED',
      text: `Ingress flow telemetry captured from ${threat.sourceIp} to ${threat.destinationIp}`,
      icon: ShieldAlert,
      type: 'alert',
    },
    {
      time: formatOffsetTime(1),
      title: `ML CLASSIFICATION: ${threat.threatType}`,
      text: isRealMl
        ? `Real UNSW-NB15 ML engine classified flow with ${threat.confidence}% confidence (Suspicion: ${threat.riskScore})`
        : `Simulation engine flagged flow as ${threat.threatType} (${threat.confidence}% confidence)`,
      icon: CpuIcon,
      type: 'alert',
    },
  ];

  if (threat.status === 'ACKNOWLEDGED' || threat.status === 'INVESTIGATING' || threat.status === 'RESOLVED') {
    events.push({
      time: formatOffsetTime(45),
      title: 'ANALYST ACKNOWLEDGED',
      text: 'SOC analyst acknowledged incident alert and logged into workspace',
      icon: Check,
      type: 'warning',
    });
  }

  if (threat.status === 'INVESTIGATING' || threat.status === 'RESOLVED') {
    events.push({
      time: formatOffsetTime(115),
      title: 'INVESTIGATION STARTED',
      text: 'Forensic baseline deviation analysis and traffic evidence correlation initiated',
      icon: Play,
      type: 'warning',
    });
  }

  events.push({
    time: formatOffsetTime(180),
    title: 'RECOMMENDED RESPONSE REVIEWED',
    text: `Analyst reviewed phased response guidelines: ${threat.recommendedAction}`,
    icon: Clock,
    type: 'info',
  });

  if (threat.status === 'RESOLVED') {
    events.push({
      time: formatOffsetTime(300),
      title: 'INCIDENT RESOLVED',
      text: 'Mitigation rules confirmed. SOC analyst marked incident as resolved.',
      icon: CheckCircle2,
      type: 'success',
    });
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-400" /> FORENSIC INCIDENT TIMELINE
        </h3>
        <span className="text-[10px] font-mono text-slate-400">SOC INCIDENT LIFECYCLE AUDIT</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((e, idx) => {
          const Icon = e.icon;
          return (
            <div key={idx} className="relative flex items-start gap-3 group">
              <div
                className={`absolute -left-[23px] h-5 w-5 rounded-full border flex items-center justify-center ${
                  e.type === 'success'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : e.type === 'alert'
                    ? 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse'
                    : e.type === 'warning'
                    ? 'bg-orange-950 border-orange-500 text-orange-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Icon className="h-3 w-3" />
              </div>

              <div className="flex-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">{e.time}</span>
                  <span
                    className={`font-bold text-xs ${
                      e.type === 'success'
                        ? 'text-emerald-400'
                        : e.type === 'alert'
                        ? 'text-rose-300'
                        : e.type === 'warning'
                        ? 'text-orange-300'
                        : 'text-slate-200'
                    }`}
                  >
                    {e.title}
                  </span>
                </div>
                <p className="text-slate-300 font-sans text-xs mt-0.5 leading-relaxed">{e.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

function CpuIcon(props: any) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
      <path d="M9 9h6v6H9z" strokeWidth="2" />
    </svg>
  );
}
