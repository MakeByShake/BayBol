/** @type {import('tailwindcss').Config} */

// Цвета, которые меняются в светлых секциях (.tone-light), заданы CSS-переменными в index.css
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#070B1A', 2: '#0B1226' },
        cream: '#F3F0E8',
        ink: { DEFAULT: v('ink'), muted: v('muted') },
        line: v('line'),
        surface: v('surface'),
        accent: v('accent'), // золото для текста (в светлых секциях темнее)
        link: v('link'), // голубой для текста (в светлых секциях темнее)
        gold: { DEFAULT: '#F4C46A', glow: '#FFE2A8', deep: '#C8932E' },
        sky: { DEFAULT: '#6CC3FF', glow: '#BFE6FF', deep: '#2E8FD6' },
        coral: v('coral'),
        wa: '#25D366',
      },
      fontFamily: {
        sans: ['Onest', 'system-ui', 'sans-serif'],
        display: ['Onest', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        ping2: { '0%': { transform: 'scale(1)', opacity: '.8' }, '100%': { transform: 'scale(2.6)', opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        ping2: 'ping2 1.6s cubic-bezier(0,0,.2,1) infinite',
      },
    },
  },
  plugins: [],
}
