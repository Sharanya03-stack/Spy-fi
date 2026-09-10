import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-slate-950 pointer-events-none" />

      <Container size="lg" className="relative z-10 text-center">
        <div className="p-10 md:p-16 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="h-14 w-14 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto mb-6">
            <Shield className="h-7 w-7" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
            See Your Network From a Different Direction.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Turn one-way traffic into actionable security intelligence.
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/login">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Launch Security Console
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs font-mono text-slate-500">
            Prototype — Smart India Hackathon 2026 (Problem Statement 145)
          </p>
        </div>
      </Container>
    </section>
  );
};
