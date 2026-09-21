import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/patterns/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        odoratus: {
          bg: '#f8f6f0',
          card: '#ffffff',
          sand: '#f3efe6',
          sandDark: '#e8e2d4',
          accent: '#b38b4d',
          accentDark: '#8c6d3b',
          gold: '#c29b62',
          espresso: '#1a1816',
          charcoal: '#2b2724',
          muted: '#7a746e',
          border: '#e4decfa0',
        },
        dark: {
          950: '#0c0b0a',
          900: '#141211',
          850: '#1a1816',
          800: '#24211e',
          700: '#332f2b',
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Playfair Display', 'serif'],
        heading: ['var(--font-cormorant)', 'Cinzel', 'serif'],
        sans: ['var(--font-plus-jakarta)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(26, 24, 22, 0.08)',
        'luxury-hover': '0 20px 50px -10px rgba(179, 139, 77, 0.18)',
        'glow-gold': '0 0 30px rgba(194, 155, 98, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
