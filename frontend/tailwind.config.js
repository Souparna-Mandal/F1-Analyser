/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'f1-red': '#DC0000',
        'f1-blue': '#0600EF',
        'f1-green': '#00D2BE',
        'f1-orange': '#FF8700',
        'f1-yellow': '#FFD700',
        'f1-purple': '#6C0E2A',
        'f1-pink': '#FF69B4',
        'f1-gray': '#2E2E2E',
        'f1-dark': '#1A1A1A',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      fontFamily: {
        'f1': ['Orbitron', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 