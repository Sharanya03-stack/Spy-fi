import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { UnidirectionalFlowVisualizer } from './UnidirectionalFlowVisualizer';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-950">
      {/* Background glow accents (Subtle, non-distracting) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-sky-500/5 blur-[120px] pointer-events-none rounded-full" />

      <Container size="xl" className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Status Indicator */}
          <div className="mb-6">
            <StatusIndicator status="online" label="Security Intelligence Online" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            AI-Powered Defense for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              One-Way Networks
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
            Detect anomalous traffic, identify cyber threats, and understand the reasoning behind every alert — in real time.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Launch Security Console
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore How It Works
              </Button>
            </a>
          </div>

          {/* Subtle info line */}
          <div className="mt-6 flex items-center gap-6 text-xs font-mono text-slate-400">
            <span>✓ Hardware Airgap Compatible</span>
            <span>•</span>
            <span>✓ Zero Backchannel Required</span>
            <span>•</span>
            <span>✓ Explainable AI Reasoning</span>
          </div>

        </div>

        {/* Hero Visualizer Section */}
        <div className="mt-14 max-w-5xl mx-auto" id="platform">
          <UnidirectionalFlowVisualizer />
        </div>
      </Container>
    </section>
  );
};
