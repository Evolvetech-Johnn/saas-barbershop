import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0F23',
        card: '#1B1B30',
        primary: '#1E1B4B',
        accent: {
          DEFAULT: '#CA8A04',
          hover: '#A16207', // Adding hover to match standard tailwind variants
        },
        foreground: '#F8FAFC',
        'muted-foreground': '#94A3B8',
        border: '#4338CA',
        destructive: '#EF4444',
        
        // Preserving non-related tokens
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          raised: 'var(--surface-raised)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        status: {
          success: 'var(--success)',
          warning: 'var(--warning)',
          danger: 'var(--danger)',
        },
        ring: 'var(--focus-ring)',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '14px',
      }
    },
  },
  plugins: [],
} satisfies Config
