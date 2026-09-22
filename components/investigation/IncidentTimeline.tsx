'use client';

import React from 'react';
import { ThreatEvent, ResponseTimelineEntry } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Play,
  Check,
  Cpu,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Sliders,
  XCircle,
  Activity,
} from 'lucide-react';

export interface IncidentTimelineProps {
  threat: ThreatEvent;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ threat }) => {
  const isRealMl = threat.detectionSource === 'ml';
  const history = threat.responseHistory || [];

  const formatDisplayTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getEventIcon = (entry: ResponseTimelineEntry) => {
    switch (entry.type) {
      case 'DETECTED':
        return { icon: ShieldAlert, color: 'text-rose-400 border-rose-500 bg-rose-950', badgeColor: 'text-rose-300' };
      case 'CLASSIFIED':
        return { icon: Cpu, color: 'text-emerald-400 border-emerald-500 bg-emerald-950', badgeColor: 'text-emerald-300' };
      case 'RISK_ASSESSED':
        return { icon: AlertTriangle, color: 'text-orange-400 border-orange-500 bg-orange-950', badgeColor: 'text-orange-300' };
      case 'PLAN_GENERATED':
        return { icon: Sparkles, color: 'text-cyan-400 border-cyan-500 bg-cyan-950', badgeColor: 'text-cyan-300' };
      case 'ANALYST_REVIEW':
        return { icon: UserCheck, color: 'text-amber-400 border-amber-500 bg-amber-950', badgeColor: 'text-amber-300' };
      case 'DECISION':
        return entry.title.includes('Rejected')
          ? { icon: XCircle, color: 'text-rose-400 border-rose-500 bg-rose-950', badgeColor: 'text-rose-300' }
          : { icon: ShieldCheck, color: 'text-emerald-400 border-emerald-500 bg-emerald-950', badgeColor: 'text-emerald-300' };
      case 'EXECUTION':
        return { icon: Sliders, color: 'text-amber-400 border-amber-500 bg-amber-950', badgeColor: 'text-amber-300' };
      case 'VERIFICATION':
        return { icon: CheckCircle2, color: 'text-emerald-400 border-emerald-500 bg-emerald-950', badgeColor: 'text-emerald-300' };
      default:
        return { icon: Activity, color: 'text-slate-400 border-slate-700 bg-slate-900', badgeColor: 'text-slate-300' };
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-400" /> FORENSIC INCIDENT & RESPONSE TIMELINE
        </h3>
        <span className="text-[10px] font-mono text-slate-400">CHRONOLOGICAL AUDIT TRAIL</span>
      </div>

      {history.length > 0 ? (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {history.map((entry) => {
            const { icon: Icon, color, badgeColor } = getEventIcon(entry);
            return (
              <div key={entry.id} className="relative flex items-start gap-3 group">
                <div
                  className={`absolute -left-[23px] h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${color}`}
                >
                  <Icon className="h-3 w-3" />
                </div>

                <div className="flex-1 font-mono text-xs space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-slate-500">{formatDisplayTime(entry.timestamp)}</span>
                    <span className={`font-bold text-xs ${badgeColor}`}>{entry.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                      Actor: {entry.actor}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">{entry.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-4 text-center text-xs font-mono text-slate-500">
          No audit history entries recorded for this threat.
        </div>
      )}
    </Card>
  );
};
