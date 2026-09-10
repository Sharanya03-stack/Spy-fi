'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const LoginCard: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('analyst@spy-fi.soc');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  const handleDemoAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl relative z-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="h-12 w-12 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-soc-glow">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">SOC Console Access</h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Enter credentials or launch live SIH demonstration mode
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
            Analyst Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 pl-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
              placeholder="analyst@spy-fi.soc"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 pl-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
              placeholder="••••••••••••"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase font-mono">
          <span className="bg-slate-900 px-3 text-slate-500">OR</span>
        </div>
      </div>

      {/* Demo Button */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full justify-center border-emerald-800/40 text-emerald-300 hover:bg-emerald-950/40 hover:border-emerald-700"
          onClick={handleDemoAccess}
          isLoading={isLoading}
          leftIcon={<Play className="h-4 w-4 fill-emerald-400 text-emerald-400" />}
        >
          Continue with Demo Access
        </Button>

        {/* Demo Environment Badge */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Badge variant="normal" size="sm" dot>
            Demo Environment Active
          </Badge>
          <span className="text-[11px] font-mono text-slate-500">SIH 2026 PS 145</span>
        </div>
      </div>

    </div>
  );
};
