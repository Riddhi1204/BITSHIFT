/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B1220',
          card: '#111827',
          deep: '#7F1D1D',
          red: '#B91C1C',
          bright: '#DC2626',
          blue: '#2563EB',
          cyan: '#06B6D4',
          slate: '#64748B',
          lightBg: '#F8FAFC',
          success: '#16A34A',
          warning: '#F59E0B',
          critical: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(185, 28, 28, 0.35)',
        'glow-wine': '0 12px 30px -8px rgba(127, 29, 29, 0.45)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'card-soft': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        'card-elevated': '0 20px 35px -10px rgba(15, 23, 42, 0.1), 0 8px 16px -6px rgba(15, 23, 42, 0.06)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
