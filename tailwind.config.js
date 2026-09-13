import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  blocklist: ["overline"],
  darkMode: ["class"],
  content: [
    "./index.html",
    "./app/frontend/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['Quicksand', '"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cream: '#fff6f2',
        blush: '#ffe1e8',
        blush2: '#ffc9d6',
        rose: '#ff7a9c',
        deeprose: '#d6336c',
        plum: '#5c2a3b',
        gold: '#e3b23c',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        },
        eq: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '16px' }
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(4px)' }
        }
      },
      animation: {
        marquee: 'marquee 46s linear infinite',
        eq: 'eq 0.9s ease-in-out infinite',
        'spin-slow': 'spin-slow 22s linear infinite',
        'bounce-slow': 'bounce-slow 1.8s ease-in-out infinite'
      }
    }
  },
  plugins: [tailwindcssAnimate],
};
