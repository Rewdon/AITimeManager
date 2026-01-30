export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
          glow: 'rgba(99, 102, 241, 0.15)',
          '20': 'rgba(99, 102, 241, 0.2)',
          '10': 'rgba(99, 102, 241, 0.1)',
        },
        background: {
          DEFAULT: '#0f172a',
          '50': 'rgba(15, 23, 42, 0.5)',
        },
        surface: {
          DEFAULT: '#1e293b',
          '30': 'rgba(30, 41, 59, 0.3)',
          '10': 'rgba(30, 41, 59, 0.1)',
          '20': 'rgba(30, 41, 59, 0.2)',
          '50': 'rgba(30, 41, 59, 0.5)',
        },
        surfaceHover: '#334155',
        border: {
          DEFAULT: '#334155',
          'primary-50': 'rgba(99, 102, 241, 0.5)',
        },
        overlay: 'rgba(0, 0, 0, 0.6)',
        
        text: {
          main: '#f1f5f9',
          muted: '#94a3b8',
          accent: '#c7d2fe'
        },
        danger: {
          DEFAULT: '#ef4444',
          hover: '#dc2626',
          light: '#f87171',
          background: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.2)',
        },
        purple: {
          DEFAULT: '#a855f7',
        },
        yellow: {
          DEFAULT: '#f59e0b',
        },
        blue: {
          DEFAULT: '#3b82f6',
        },
        'note-yellow': {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.5)',
          text: '#fcd34d',
        },
        'note-blue': {
          bg: 'rgba(59, 130, 246, 0.1)',
          border: 'rgba(59, 130, 246, 0.5)',
          text: '#93c5fd',
        },
        'note-green': {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'rgba(16, 185, 129, 0.5)',
          text: '#6ee7b7',
        },
        'note-purple': {
          bg: 'rgba(168, 85, 247, 0.1)',
          border: 'rgba(168, 85, 247, 0.5)',
          text: '#c084fc',
        },
        'note-red': {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.5)',
          text: '#f87171',
        }
      },
      ringWidth: {
        '1': '1px',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'primary': '0 10px 15px -3px rgba(99, 102, 241, 0.25), 0 4px 6px -2px rgba(99, 102, 241, 0.1)',
        'primary-hover': '0 10px 15px -3px rgba(99, 102, 241, 0.4), 0 4px 6px -2px rgba(99, 102, 241, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}