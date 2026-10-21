import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2A6F6F',
          dark: '#1B4B4B',
          light: '#52B2B2',
        },
        accent: {
          DEFAULT: '#F5A623',
          dark: '#D48806',
          light: '#FFA726',
        },
        nido: {
          bg: '#F7F7F2',
          surface: '#FFFFFF',
          text: '#1F2A2E',
          textLight: '#566264',
          border: '#D8E3E0',
        },
        dark: {
          bg: '#12181B',
          surface: '#1E262B',
          text: '#E2E8F0',
          textLight: '#94A3B8',
          border: '#2D3748',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
