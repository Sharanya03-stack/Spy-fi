import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Activity, Brain } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { LoginCard } from '@/components/auth/LoginCard';
import { Container } from '@/components/ui/Container';
import { SpyFiLogo } from '@/components/ui/SpyFiLogo';

export default function LoginPage() {
  return (
    <PageTransition className="min-h-screen bg-[#080B12] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="p-6 border-b border-slate-800/80 relative z-20">
        <Container size="xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block">
              <SpyFiLogo size="sm" showSubtitle={true} />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Product Site
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Content split */}
      <main className="flex-grow flex items-center py-12 relative z-10">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left branding side */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1623] border border-slate-800 text-xs font-mono text-cyan-400">
                <Activity className="h-3.5 w-3.5" /> Smart India Hackathon 2026 PS 145
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Secure the flow.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400">
                  Understand the threat.
                </span>
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-lg">
                Enter the Security Operations Console to experience real-time AI anomaly classification, XAI evidence analysis, and live threat simulation for one-way IP networks.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="h-7 w-7 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-mono text-sm">Unidirectional Telemetry Inspection</strong>
                    Zero operational latency packet monitoring across hardware data diodes.
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="h-7 w-7 rounded-lg bg-violet-950/80 border border-violet-700/60 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-mono text-sm">Explainable AI Reasoning (XAI)</strong>
                    Quantifiable evidence metrics and automated SOC analyst response plans.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Auth Card */}
            <div className="lg:col-span-6 flex justify-center">
              <LoginCard />
            </div>

          </div>
        </Container>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-800/80 text-center text-xs font-mono text-slate-400 relative z-20">
        © 2026 Spy-fi • Cyber Threat Detection Console developed for Smart India Hackathon 2026.
      </footer>
    </PageTransition>
  );
}
