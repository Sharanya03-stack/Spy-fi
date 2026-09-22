import type { Metadata } from 'next';
import { AppProviders } from '@/components/providers/AppProviders';
import './globals.css';

const inter = { variable: 'font-sans' };
const jetbrainsMono = { variable: 'font-mono' };

export const metadata: Metadata = {
  title: 'Spy-fi — AI-Powered Defense for One-Way Networks',
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
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
