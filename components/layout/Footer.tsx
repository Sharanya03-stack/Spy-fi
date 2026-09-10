import React from 'react';
import Link from 'next/link';
import { Shield, ExternalLink, Activity } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SpyFiLogo } from '@/components/ui/SpyFiLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-16 text-slate-400">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <SpyFiLogo size="sm" showSubtitle={false} />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              AI-powered security intelligence and anomaly detection engineered specifically for high-assurance unidirectional IP network traffic.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>Prototype — Smart India Hackathon 2026</span>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-200 tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#platform" className="hover:text-emerald-400 transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  Architecture
                </a>
              </li>
              <li>
                <a href="#threat-detection" className="hover:text-emerald-400 transition-colors">
                  Threat Classification
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  SOC Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-200 tracking-wider mb-4">
              Security
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#explainable-ai" className="hover:text-emerald-400 transition-colors">
                  Explainable AI (XAI)
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-emerald-400 transition-colors">
                  Analyst Workflow
                </a>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Data Diode Specs
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  FastAPI Engine API
                </span>
              </li>
            </ul>
          </div>

          {/* Nav Col 3 */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-200 tracking-wider mb-4">
              Hackathon Context
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-300">SIH 2026 PS 145</li>
              <li className="text-slate-400 text-xs">Unidirectional Traffic Security</li>
              <li>
                <Link href="/login" className="inline-flex items-center gap-1 text-emerald-400 hover:underline">
                  Launch Demo <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 Spy-fi. Built for Smart India Hackathon 2026 (Problem Statement 145).</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Protocol</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Security Standards</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
