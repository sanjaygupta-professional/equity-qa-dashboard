/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          deep: '#0F172A',
          vibrant: '#3B82F6',
          light: '#DBEAFE',
        },
        secondary: {
          emerald: '#10B981',
          red: '#EF4444',
          amber: '#F59E0B',
        },
        neutral: {
          white: '#FFFFFF',
          'soft-gray': '#F8FAFC',
          'medium-gray': '#64748B',
          'dark-gray': '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'h1': '2.5rem',
        'h2': '2rem',
        'h3': '1.5rem',
        'body': '1rem',
        'small': '0.875rem',
        'tiny': '0.75rem',
      },
      borderRadius: {
        'xl': '12px',
        'lg': '10px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
