'use client';

import React, { useState } from 'react';
import { ThreatEvent } from '@/lib/types/network';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit3,
  Activity,
  Info,
  Lock,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';

export interface AiResponsePanelProps {
  threat: ThreatEvent;
}

export const AiResponsePanel: React.FC<AiResponsePanelProps> = ({ threat }) => {
  const { approveAndExecuteResponse, modifyResponsePlan, rejectResponsePlan } = useSimulation();

  const plan = threat.responsePlan;
  const isRealMl = threat.detectionSource === 'ml';
  const isBenign = (threat.threatType as string) === 'BENIGN';

  const [isEditing, setIsEditing] = useState(false);
  const [customActionText, setCustomActionText] = useState(plan?.analystModifiedAction || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!plan) return null;

  const handleApprove = async () => {
    setIsExecuting(true);
    await new Promise((res) => setTimeout(res, 600));
    await approveAndExecuteResponse(threat.id);
    setIsExecuting(false);
  };

  const handleSaveModification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customActionText.trim()) return;
    modifyResponsePlan(threat.id, customActionText.trim());
    setIsEditing(false);
  };

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    rejectResponsePlan(threat.id, rejectReason.trim() || 'Analyst override — manual investigation chosen.');
    setShowRejectInput(false);
  };

  const isPending = plan.status === 'PENDING' || plan.status === 'MODIFIED';
  const isExecutedOrVerified = plan.status === 'EXECUTED' || plan.status === 'VERIFYING' || plan.status === 'VERIFIED';
  const isRejected = plan.status === 'REJECTED';

  const activeActionText = plan.analystModifiedAction || plan.originalProposedAction;

  // Lifecycle Steps for Stepper
  const lifecycleSteps = [
    { label: 'PENDING', status: 'PENDING' },
    { label: 'APPROVED', status: 'APPROVED' },
    { label: 'EXECUTED', status: 'EXECUTED' },
    { label: 'VERIFYING', status: 'VERIFYING' },
    { label: 'VERIFIED', status: 'VERIFIED' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'MODIFIED':
        return 0;
      case 'APPROVED':
        return 1;
      case 'EXECUTED':
        return 2;
      case 'VERIFYING':
        return 3;
      case 'VERIFIED':
        return 4;
      case 'REJECTED':
      case 'VERIFICATION_FAILED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(plan.status);

  return (
    <Card className="p-6 space-y-6 relative overflow-hidden border-cyan-900/40 bg-[#121925]/95 shadow-soc-panel">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Panel Header & Provenance Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-950 to-cyan-950 border border-violet-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-mono uppercase font-extrabold text-white tracking-wider flex items-center gap-2">
              AI-ASSISTED RESPONSE PLAN
            </h3>
            <span className="text-[11px] font-mono text-slate-400 block">
              HUMAN-IN-THE-LOOP CONTROLLED SIMULATION ENGINE
            </span>
          </div>
        </div>

        {/* Provenance Badge */}
        <div className="flex items-center gap-2">
          {isRealMl ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 font-mono text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <Cpu className="h-3.5 w-3.5" /> REAL ML SOURCE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 font-mono text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              <Activity className="h-3.5 w-3.5" /> SIMULATION SOURCE
            </span>
          )}

          <span className="px-2.5 py-1 rounded bg-[#090D16] border border-slate-800 text-[10px] font-mono text-amber-400 font-bold uppercase">
            CONTROLLED SIMULATION
          </span>
        </div>
      </div>

      {/* Response Lifecycle Stepper Bar */}
      {!isBenign && !isRejected && (
        <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800/80">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-2.5 flex items-center justify-between">
            <span>RESPONSE LIFECYCLE PROGRESSION</span>
            <span className="text-cyan-400">STATUS: {plan.status}</span>
          </div>

          <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
            {lifecycleSteps.map((step, idx) => {
              const isCompleted = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;

              return (
                <React.Fragment key={step.label}>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                        isCompleted
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isCurrent
                          ? 'text-cyan-400'
                          : isCompleted
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < lifecycleSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 min-w-[16px] rounded transition-all ${
                        currentStepIdx > idx ? 'bg-cyan-500/80' : 'bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Threat Summary Context Bar */}
      <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800/80 font-mono text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">CLASSIFICATION</span>
          <strong className="text-cyan-400">{threat.threatType}</strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">RISK SCORE</span>
          <strong className="text-amber-400">{threat.riskScore} / 100</strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">AI CONFIDENCE</span>
          <strong className="text-white">{threat.confidence}%</strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">RESPONSE STATUS</span>
          <strong className="text-emerald-400 uppercase">{plan.status}</strong>
        </div>
      </div>

      {/* BENIGN SAFETY GUARDRAIL VIEW */}
      {isBenign ? (
        <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
            <Info className="h-4 w-4" /> NO RESTRICTIVE ACTION REQUIRED
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Ingress telemetry for this flow conforms to baseline operational specifications. No restrictive rate limiting or packet dropping controls are necessary.
          </p>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            • Baseline Continuous Telemetry Monitoring Active
          </div>
        </div>
      ) : (
        /* NON-BENIGN AI RESPONSE PLAN CONTENT */
        <div className="space-y-5 font-mono">
          
          {/* Action Recommendation Box (Original vs Modified) */}
          <div className="p-4 rounded-xl bg-[#090D16] border border-cyan-900/40 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
                {plan.analystModifiedAction ? 'SOC ANALYST MODIFIED RESPONSE ACTION' : 'RECOMMENDED RESPONSE ACTION'}
              </span>
              {plan.analystModifiedAction && (
                <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800 font-bold">
                  SOC Analyst Override
                </span>
              )}
            </div>

            <div className="text-sm sm:text-base font-bold text-white leading-relaxed pl-1">
              "{activeActionText}"
            </div>

            {/* If modified, show original for transparency */}
            {plan.analystModifiedAction && (
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-slate-400 font-bold block mb-0.5">ORIGINAL AI PROPOSAL:</span>
                "{plan.originalProposedAction}"
              </div>
            )}
          </div>

          {/* Details Grid: RATIONALE, EXPECTED EFFECT, OPERATIONAL IMPACT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* RATIONALE */}
            <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Info className="h-3 w-3 text-cyan-400" /> RATIONALE & EVIDENCE
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{plan.reason}</p>
              <ul className="space-y-1 text-[10px] text-slate-400 pt-2 border-t border-slate-900">
                {plan.supportingEvidence.map((ev, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-cyan-400 shrink-0">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EXPECTED EFFECT */}
            <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" /> EXPECTED EFFECT
              </span>
              <p className="text-[11px] text-emerald-300 leading-relaxed font-sans">{plan.expectedEffect}</p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-900">
                Target Criteria: <strong className="text-white">{plan.verificationCriteria.conditionDescription}</strong>
              </div>
            </div>

            {/* OPERATIONAL IMPACT */}
            <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-amber-400" /> OPERATIONAL IMPACT
              </span>
              <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">{plan.operationalImpact}</p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-900">
                Analyst Decision Required: <strong className="text-white">YES</strong>
              </div>
            </div>
          </div>

          {/* SOC MANDATORY CONSENT BANNER */}
          {isPending && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-sans text-xs">
                  <strong>ANALYST APPROVAL REQUIRED:</strong> No response is executed automatically.
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-amber-900/80 text-amber-300 px-2.5 py-1 rounded font-bold self-start sm:self-auto shrink-0 border border-amber-700/50">
                HUMAN-IN-THE-LOOP CONSENT
              </span>
            </div>
          )}

          {/* INLINE EDIT FORM FOR MODIFYING ACTION */}
          {isEditing && (
            <form onSubmit={handleSaveModification} className="p-4 rounded-xl bg-[#090D16] border border-amber-800/80 space-y-3">
              <label className="text-xs font-bold text-amber-400 block uppercase flex items-center gap-1.5">
                <Edit3 className="h-3.5 w-3.5" /> Modify Response Action
              </label>
              <textarea
                value={customActionText}
                onChange={(e) => setCustomActionText(e.target.value)}
                rows={2}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                placeholder="Type custom response action..."
              />
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" size="sm" disabled={!customActionText.trim()}>
                  Save Modification
                </Button>
              </div>
            </form>
          )}

          {/* INLINE REJECT REASON INPUT */}
          {showRejectInput && (
            <form onSubmit={handleRejectConfirm} className="p-4 rounded-xl bg-[#090D16] border border-rose-800/80 space-y-3">
              <label className="text-xs font-bold text-rose-400 block uppercase flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" /> Reject Response Plan
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (e.g. Authorized benchmark test, false positive)..."
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
              />
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowRejectInput(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger" size="sm">
                  Confirm Rejection
                </Button>
              </div>
            </form>
          )}

          {/* ACTION BUTTONS (APPROVE & EXECUTE, MODIFY, REJECT) */}
          {isPending && !isEditing && !showRejectInput && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="cyan"
                size="md"
                onClick={handleApprove}
                isLoading={isExecuting}
                leftIcon={<ShieldCheck className="h-4 w-4 text-emerald-300" />}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40"
              >
                APPROVE & EXECUTE
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsEditing(true)}
                leftIcon={<Edit3 className="h-4 w-4 text-amber-400" />}
              >
                MODIFY PLAN
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => setShowRejectInput(true)}
                leftIcon={<XCircle className="h-4 w-4 text-rose-400" />}
                className="hover:border-rose-800 hover:text-rose-300"
              >
                REJECT
              </Button>
            </div>
          )}

          {/* REJECTED STATE DISPLAY */}
          {isRejected && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-400 uppercase">
                <XCircle className="h-4 w-4" /> AI RESPONSE PLAN REJECTED BY ANALYST
              </div>
              <p className="text-slate-300 font-sans">
                Rejection Reason: <strong>{plan.rejectionReason || 'Analyst override — manual investigation chosen.'}</strong>
              </p>
              <div className="text-[10px] text-slate-400">
                Recorded in forensic incident timeline. Monitoring continues without active mitigation.
              </div>
            </div>
          )}

          {/* EXECUTED & VERIFIED MULTI-STAGE DISPLAY */}
          {isExecutedOrVerified && (
            <div className="space-y-4 pt-2">
              {/* Multi-stage verification progress strip */}
              <div className="p-4 rounded-xl bg-[#090D16] border border-emerald-800/80 space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900 text-xs">
                  <span className="font-bold text-slate-200 uppercase flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
                    CONTROLLED RESPONSE EXECUTION & VERIFICATION
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                    MITIGATION SIMULATED — MONITORING CONTINUES
                  </span>
                </div>

                {/* Dynamic Telemetry Before vs After Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">PRE-RESPONSE TELEMETRY</span>
                    <span className="text-lg font-extrabold text-amber-400 block">{plan.beforeMetricDisplay || 'Baseline Velocity'}</span>
                    <span className="text-[10px] text-slate-400">Metric: {plan.verificationCriteria.metricName}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80">
                    <span className="text-[10px] text-emerald-400 uppercase block font-bold">POST-RESPONSE TELEMETRY</span>
                    <span className="text-lg font-extrabold text-emerald-400 block">{plan.afterMetricDisplay || 'Simulated Mitigation'}</span>
                    <span className="text-[10px] text-emerald-300">Status: Verified Below Threshold</span>
                  </div>
                </div>

                {/* Audit verification timestamp */}
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-900 flex items-center justify-between">
                  <span>Execution Timestamp: {plan.executedTimestamp ? new Date(plan.executedTimestamp).toLocaleTimeString() : 'Just now'}</span>
                  <span className="text-emerald-400 font-bold">✓ Response Verified</span>
                </div>
              </div>

              {/* Safety disclaimer footer */}
              <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Controlled Simulation Safety:</strong> Response executed in controlled in-memory simulation. Zero real firewall rules, routing tables, or operating-system interfaces modified.
                </span>
              </div>
            </div>
          )}

        </div>
      )}
    </Card>
  );
};
