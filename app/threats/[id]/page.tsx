'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSimulation } from '@/lib/simulation/simulationStore';
import { SocLayout } from '@/components/layout/SocLayout';
import { InvestigationHeader } from '@/components/investigation/InvestigationHeader';
import { AiDetectionSummary } from '@/components/investigation/AiDetectionSummary';
import { ThreatOverviewCard } from '@/components/investigation/ThreatOverviewCard';
import { TrafficEvidenceCard } from '@/components/investigation/TrafficEvidenceCard';
import { FeatureAnalysisCard } from '@/components/investigation/FeatureAnalysisCard';
import { AnomalyScoreGauge } from '@/components/investigation/AnomalyScoreGauge';
import { AiExplanationCard } from '@/components/investigation/AiExplanationCard';
import { RiskAssessmentCard } from '@/components/investigation/RiskAssessmentCard';
import { IncidentTimeline } from '@/components/investigation/IncidentTimeline';
import { RecommendedResponseCard } from '@/components/investigation/RecommendedResponseCard';
import { AiResponsePanel } from '@/components/investigation/AiResponsePanel';
import { RelatedTrafficTable } from '@/components/investigation/RelatedTrafficTable';
import { ShieldAlert, ArrowLeft, AlertCircle, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function ThreatInvestigationWorkspace() {
  const params = useParams();
  const threatId = params.id as string;
  const { threats, detectionMode, mlHealth } = useSimulation();

  // Find threat in single source of truth global store
  const threat = threats.find((t) => t.id === threatId);

  // Invalid / Expired Threat State
  if (!threat) {
    return (
      <div className="py-16 text-center space-y-4 max-w-xl mx-auto">
        <div className="h-14 w-14 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">THREAT NOT FOUND</h1>
        <p className="text-xs font-mono text-slate-400 leading-relaxed">
          The requested threat identifier <strong className="text-slate-200">[{threatId}]</strong> could not be located in active global state. It may have expired or been cleared during a demo reset.
        </p>
        <div className="pt-4">
          <Link href="/threats">
            <Button variant="primary" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Threat Detection Center
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isMlUnavailable = detectionMode === 'ml' && (!mlHealth || !mlHealth.model_loaded);

  return (
    <div className="space-y-6">
      {/* Real ML Service Unavailable Banner if FastAPI offline */}
      {isMlUnavailable && (
        <div className="p-4 rounded-xl bg-amber-950/90 border border-amber-700 text-amber-200 font-mono text-xs flex items-start gap-3 shadow-xl">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold uppercase flex items-center gap-2">
              <Cpu className="h-4 w-4 text-amber-400" /> REAL ML ENGINE UNAVAILABLE
            </div>
            <p className="text-amber-300 font-sans text-xs">
              FastAPI detection service is not reachable at <code className="bg-amber-900/60 px-1 py-0.5 rounded text-amber-100 font-mono">http://localhost:8000</code>.
              Start the Python ML service to enable real inference. Demo Simulation mode remains fully operational.
            </p>
          </div>
        </div>
      )}

      {/* Top Header & Workflow Action Bar */}
      <InvestigationHeader threat={threat} />

      {/* AI Detection Summary Banner (WHY, HOW CONFIDENT, HOW SUSPICIOUS) */}
      <AiDetectionSummary threat={threat} />

      {/* Human-In-The-Loop AI Response Planner & Consent Panel */}
      <AiResponsePanel threat={threat} />

      {/* Main Workspace 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Forensic Telemetry & Evidence (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <ThreatOverviewCard threat={threat} />
          <TrafficEvidenceCard threat={threat} />
          <FeatureAnalysisCard threat={threat} />
          <AiExplanationCard threat={threat} />
          <IncidentTimeline threat={threat} />
          <RelatedTrafficTable threat={threat} />
        </div>

        {/* Right Column: Gauges, Risk & Mitigation Response (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <AnomalyScoreGauge threat={threat} />
          <RiskAssessmentCard threat={threat} />
          <RecommendedResponseCard threat={threat} />
        </div>

      </div>
    </div>
  );
}

export default function ThreatDetailPage() {
  return (
    <SocLayout>
      <ThreatInvestigationWorkspace />
    </SocLayout>
  );
}
