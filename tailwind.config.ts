import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A2C0A',
          dark: '#2E1903',
          light: '#613B0E',
        },
        secondary: {
          DEFAULT: '#7B4F1E',
          dark: '#583611',
          light: '#96632A',
        },
        accent: {
          DEFAULT: '#C8922A',
          hover: '#B58220',
          light: '#E2AC47',
          dark: '#9E6E18',
        },
        'bg-light': '#F5ECD7',
        'wood-cream': '#FAF6EE',
        'wood-dark': '#241402',
        'wood-border': '#E4D5B8',
        'charcoal': '#333333',
        'charcoal-light': '#666666',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Playfair Display', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(74, 44, 10, 0.12)',
        'card-hover': '0 12px 32px rgba(74, 44, 10, 0.20)',
        'gold-glow': '0 0 20px rgba(200, 146, 42, 0.35)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
