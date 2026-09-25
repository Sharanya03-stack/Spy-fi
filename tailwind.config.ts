import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080B12',
        midnight: {
          950: '#080B12',
          900: '#0D111A',
          850: '#111827',
          800: '#121925',
          750: '#151E2D',
          700: '#182234',
          600: '#1e293b',
          500: '#334155',
        },
        surface: {
          DEFAULT: '#121925',
          panel: '#151E2D',
          elevated: '#182234',
          hover: '#1c283d',
          card: 'rgba(18, 25, 37, 0.85)',
        },
        accent: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
          violet: '#8b5cf6',
          indigo: '#6366f1',
        },
        soc: {
          normal: '#10b981', // green
          info: '#3b82f6',   // blue
          medium: '#f59e0b', // amber
          high: '#f97316',   // orange
          critical: '#ef4444', // red
          cyan: '#06b6d4',
          violet: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-right': 'flowRight 2s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        flowRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
      boxShadow: {
        'soc-subtle': '0 4px 24px -2px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.04)',
        'soc-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'soc-glow': '0 0 20px -3px rgba(6, 182, 212, 0.2)',
        'soc-violet': '0 0 20px -3px rgba(139, 92, 246, 0.2)',
        'soc-alert': '0 0 20px -3px rgba(239, 68, 68, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
