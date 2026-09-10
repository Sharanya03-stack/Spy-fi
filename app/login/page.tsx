import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, ShieldCheck, Activity, Brain } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { LoginCard } from '@/components/auth/LoginCard';
import { Container } from '@/components/ui/Container';

export default function LoginPage() {
  return (
    <PageTransition className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="p-6 border-b border-slate-900/80 relative z-20">
        <Container size="xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-white">
                UniGuard <span className="text-emerald-400 font-mono text-sm">AI</span>
              </span>
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
                <Activity className="h-3.5 w-3.5" /> Smart India Hackathon 2026 PS 145
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Secure the flow.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Understand the threat.
                </span>
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-lg">
                Enter the Security Operations Console to experience real-time AI anomaly classification, XAI evidence analysis, and live threat simulation for one-way IP networks.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-900">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="h-6 w-6 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block font-mono">Continuous Unidirectional Inspection</strong>
                    Zero operational latency packet monitoring across hardware airgaps.
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="h-6 w-6 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Brain className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block font-mono">Explainable AI Reasoning (XAI)</strong>
                    Quantifiable evidence metrics and automated SOC analyst guidance.
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
      <footer className="p-6 border-t border-slate-900 text-center text-xs font-mono text-slate-500 relative z-20">
        © 2026 UniGuard AI. Prototype developed for Smart India Hackathon 2026.
      </footer>
    </PageTransition>
  );
}
