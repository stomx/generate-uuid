import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        bg: {
          deep: 'var(--bg-deep)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          hover: 'var(--bg-hover)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          mint: 'var(--accent-mint)',
          'mint-dim': 'var(--accent-mint-dim)',
          amber: 'var(--accent-amber)',
          red: 'var(--accent-red)',
          cyan: 'var(--accent-cyan)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          dashed: 'var(--border-dashed)',
        },
      },
      fontFamily: {
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeInUp 0.4s ease-out forwards',
        'blink': 'blink 1s step-end infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out',
      },
      boxShadow: {
        'glow-mint': 'var(--glow-mint)',
        'glow-amber': 'var(--glow-amber)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
