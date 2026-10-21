/** @type {import('tailwindcss').Config} */
// Цвета и шрифты — по DESIGN.md
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#F5F0E6', 2: '#FBF8F2' },
        ink: { DEFAULT: '#14213A', 2: '#5B6478' },
        gold: { DEFAULT: '#F4C46A', ink: '#A8761F', soft: '#F8DBA0' },
        sky: { DEFAULT: '#6CC3FF', ink: '#1F6FAE' },
        board: { DEFAULT: '#111722', 2: '#1A2231', line: '#2A3446', text: '#E9E4D8' },
        stamp: '#C4452D',
        wa: '#25D366',
      },
      fontFamily: {
        serif: ['Literata', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'Helvetica', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
      },
    },
  },
  plugins: [],
}
