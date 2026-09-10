import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono)',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UniGuard AI — AI-Powered Defense for One-Way Networks',
  description:
    'Detect anomalous traffic, identify cyber threats, and understand the reasoning behind every alert in unidirectional IP network traffic.',
  keywords: [
    'cybersecurity',
    'unidirectional network',
    'data diode',
    'AI threat detection',
    'explainable AI',
    'Smart India Hackathon',
    'SOC console',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
