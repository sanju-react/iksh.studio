/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#04100C',
          900: '#071C17',
          850: '#08251D',
          800: '#0B2A21',
          700: '#113E31',
          600: '#175443',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FAF8F2',
          200: '#F5F3EA',
          300: '#ECE8DC',
          400: '#DDD8C8',
        },
        sage: {
          100: '#E4ECE8',
          200: '#C9D8D0',
          300: '#A7B5AE',
          400: '#7F948B',
          500: '#5F736B',
        },
        accent: {
          emerald: '#2FE69E',
          gold: '#D8C39E',
          mint: '#9AE4C5',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
