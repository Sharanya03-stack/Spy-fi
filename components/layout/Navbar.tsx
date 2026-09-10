'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

import { SpyFiLogo } from '@/components/ui/SpyFiLogo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Threat Detection', href: '#threat-detection' },
    { label: 'Security Intelligence', href: '#explainable-ai' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg py-3'
          : 'bg-transparent py-5 border-b border-transparent'
      )}
    >
      <Container size="xl">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-xl"
          >
            <SpyFiLogo />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-300 hover:text-white transition-colors duration-150 font-medium focus:outline-none focus:text-emerald-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Launch Console
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-6 border-t border-slate-800 flex flex-col space-y-4 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base text-slate-300 hover:text-emerald-400 font-medium px-2 py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-center" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Launch Security Console
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
