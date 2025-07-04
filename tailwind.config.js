/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        blue: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        green: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        red: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        yellow: {
          50: '#fefce8',
          500: '#eab308',
          600: '#ca8a04',
        },
        purple: {
          50: '#faf5ff',
          500: '#a855f7',
          600: '#9333ea',
        },
      },
    },
  },
  plugins: [],
};