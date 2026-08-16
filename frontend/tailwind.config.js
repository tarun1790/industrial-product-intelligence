/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          50: '#f4f6f8',
          100: '#e1e7eb',
          200: '#c5d0d8',
          300: '#9eb1c0',
          400: '#718da3',
          500: '#516f86',
          600: '#3e576c',
          700: '#334657',
          800: '#2b3a47',
          900: '#1d2730',
          950: '#0e1419',
        },
        brand: {
          blue: '#1e40af',
          amber: '#d97706',
          teal: '#0d9488',
          emerald: '#059669',
          danger: '#dc2626'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
