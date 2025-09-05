/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: 'hsl(140 60% 45%)',
        danger: 'hsl(0 80% 50%)',
        primary: 'hsl(220 80% 50%)',
        'neutral-100': 'hsl(220 10% 95%)',
        'neutral-500': 'hsl(220 10% 40%)',
        'neutral-900': 'hsl(220 10% 10%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 4px 10px hsla(0, 0%, 0%, 0.1)',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
      animation: {
        'pulse-record': 'pulse 2s infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}