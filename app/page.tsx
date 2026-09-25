import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValueStrip } from '@/components/landing/ValueStrip';
import { WhySection } from '@/components/landing/WhySection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ThreatDetectionSection } from '@/components/landing/ThreatDetectionSection';
import { ExplainableAiSection } from '@/components/landing/ExplainableAiSection';
import { SocWorkflowSection } from '@/components/landing/SocWorkflowSection';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';
import { PageTransition } from '@/components/ui/PageTransition';

export default function LandingPage() {
  return (
    <PageTransition className="min-h-screen bg-soc-dark flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ValueStrip />
        <WhySection />
        <HowItWorksSection />
        <ThreatDetectionSection />
        <ExplainableAiSection />
        <SocWorkflowSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </PageTransition>
  );
}
