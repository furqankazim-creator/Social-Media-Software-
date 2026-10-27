/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        brand: {
          tgt: '#3157d5',
          ltp: '#0f9d8a',
          org: '#7756c8',
          mm: '#e58b32',
          dark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
};

