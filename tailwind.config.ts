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
        background: '#090d16',
        surface: {
          DEFAULT: '#0f172a',
          hover: '#1e293b',
          card: 'rgba(15, 23, 42, 0.7)',
        },
        soc: {
          normal: '#10b981', // green
          info: '#3b82f6',   // blue
          medium: '#f59e0b', // amber
          high: '#f97316',   // orange
          critical: '#ef4444', // red
          cyan: '#06b6d4',
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
        'soc-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'soc-glow': '0 0 15px -3px rgba(16, 185, 129, 0.15)',
        'soc-alert': '0 0 20px -3px rgba(239, 68, 68, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
