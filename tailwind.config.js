/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#070B1A', 2: '#0B1226', card: '#111A33' },
        ink: { DEFAULT: '#F5F7FF', muted: '#A9B3D1' },
        gold: { DEFAULT: '#F4C46A', glow: '#FFE2A8', deep: '#C8932E' },
        sky: { DEFAULT: '#6CC3FF', glow: '#BFE6FF', deep: '#2E8FD6' },
        coral: '#FF7A7A',
        wa: '#25D366',
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['Onest', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2.5xl': '20px', '3.5xl': '28px' },
      boxShadow: {
        gold: '0 0 0 1px rgba(244,196,106,.35), 0 10px 40px -10px rgba(244,196,106,.55)',
        sky: '0 0 0 1px rgba(108,195,255,.3), 0 10px 40px -12px rgba(108,195,255,.5)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        shine: { '0%,70%': { transform: 'translateX(-120%) skewX(-20deg)' }, '100%': { transform: 'translateX(220%) skewX(-20deg)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(244,196,106,.45), 0 10px 30px -10px rgba(244,196,106,.6)' }, '50%': { boxShadow: '0 0 0 10px rgba(244,196,106,0), 0 10px 40px -6px rgba(244,196,106,.8)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        twinkle: { '0%,100%': { opacity: '.25' }, '50%': { opacity: '1' } },
        ping2: { '0%': { transform: 'scale(1)', opacity: '.8' }, '100%': { transform: 'scale(2.6)', opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        shine: 'shine 4.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.6s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        ping2: 'ping2 1.6s cubic-bezier(0,0,.2,1) infinite',
      },
    },
  },
  plugins: [],
}
