'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, ShieldAlert, BarChart3, Clock, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const SocNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Traffic', href: '/traffic', icon: Activity },
    { label: 'Threats', href: '/threats', icon: ShieldAlert },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Incidents', href: '/timeline', icon: Clock },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'SIH Demo', href: '/demo', icon: Sparkles },
  ];

  return (
    <nav className="bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono transition-all select-none whitespace-nowrap',
                  isActive
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-emerald-400' : 'text-slate-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
