'use client';

import React, { useState } from 'react';
import { ThreatEvent } from '@/lib/types/network';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, FileText, Save, ShieldCheck, AlertCircle, Lock, Search, RefreshCw } from 'lucide-react';

export interface RecommendedResponseCardProps {
  threat: ThreatEvent;
}

export const RecommendedResponseCard: React.FC<RecommendedResponseCardProps> = ({ threat }) => {
  const [noteText, setNoteText] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const isRealMl = threat.detectionSource === 'ml';

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavedNotes((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${noteText}`]);
    setNoteText('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const rawActions = threat.recommendedActionsList || [threat.recommendedAction];

  // Group recommendations into 4 response phases
  const phasedActions = [
    {
      phase: 'IMMEDIATE',
      icon: AlertCircle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/40 border-rose-800/60',
      actions: [rawActions[0] || 'Block initiating source IP address on perimeter firewalls.'],
    },
    {
      phase: 'INVESTIGATE',
      icon: Search,
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/40 border-orange-800/60',
      actions: [rawActions[1] || 'Inspect host logs and verify authentication attempt history.'],
    },
    {
      phase: 'CONTAIN',
      icon: Lock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-800/60',
      actions: [rawActions[2] || 'Rate-limit connection requests on target destination ports.'],
    },
    {
      phase: 'FOLLOW-UP',
      icon: RefreshCw,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-800/60',
      actions: [rawActions[3] || 'Flag flow record for supervised ML retraining.'],
    },
  ];

  return (
    <Card className="p-6 space-y-6">
      {/* Recommended Response */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <h3 className="text-xs font-mono uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> RECOMMENDED ANALYST RESPONSE
          </h3>
          <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800">
            Analyst Decision Required
          </span>
        </div>

        <p className="text-[11px] font-mono text-slate-400 mb-3">
          Advisory response guidelines for Tier-1/Tier-2 SOC analysts. Actions require explicit analyst review.
        </p>

        {/* Phased Recommendations */}
        <div className="space-y-3 font-mono">
          {phasedActions.map((pa, idx) => {
            const Icon = pa.icon;
            return (
              <div key={idx} className={`p-3 rounded-xl border ${pa.bgColor} space-y-1`}>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                  <Icon className={`h-3.5 w-3.5 ${pa.color}`} />
                  <span className={pa.color}>PHASE {idx + 1}: {pa.phase}</span>
                </div>
                {pa.actions.map((act, aIdx) => (
                  <div key={aIdx} className="text-xs text-slate-200 leading-relaxed pl-5">
                    • {act}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Analyst Session Notes */}
      <div className="pt-4 border-t border-slate-800">
        <h4 className="text-xs font-mono uppercase font-bold text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-slate-400" /> ANALYST INVESTIGATION NOTES
        </h4>

        <form onSubmit={handleSaveNote} className="space-y-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Add triage findings, analyst comments, or incident handler notes..."
            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">
              {isSaved ? '✓ Note saved to session memory' : 'Notes persist during active session'}
            </span>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!noteText.trim()}
              leftIcon={<Save className="h-3.5 w-3.5" />}
            >
              Save Note
            </Button>
          </div>
        </form>

        {/* Display Saved Notes */}
        {savedNotes.length > 0 && (
          <div className="mt-4 space-y-2 pt-3 border-t border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-400 block font-bold">SAVED SESSION NOTES:</span>
            {savedNotes.map((note, i) => (
              <div key={i} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                {note}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
