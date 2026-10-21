import { useId } from 'react'
import logoFull from '../../assets/logo/logo-full.svg'

const PLANE =
  'M9 0 C9 -.9 7.6 -1.4 5 -1.4 L1.6 -1.4 L-2.6 -7.6 L-5 -7.6 L-2.4 -1.4 L-5.6 -1.4 L-7.6 -4 L-9.2 -4 L-8 0 L-9.2 4 L-7.6 4 L-5.6 1.4 L-2.4 1.4 L-5 7.6 L-2.6 7.6 L1.6 1.4 L5 1.4 C7.6 1.4 9 .9 9 0 Z'
const ARC = 'M5 55 Q20 23 46.5 15'

/** Знак «Золотая монета + траектория» (тот же, что в src/assets/logo/logo-mark.svg) */
export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}g`} cx="34%" cy="28%" r="80%">
          <stop offset="0" stopColor="#FFE2A8" />
          <stop offset=".55" stopColor="#F4C46A" />
          <stop offset="1" stopColor="#C8932E" />
        </radialGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <rect width="64" height="64" fill="#fff" />
          <path d={ARC} fill="none" stroke="#000" strokeWidth="9" strokeLinecap="round" />
        </mask>
      </defs>
      <circle cx="28" cy="37" r="19" fill={`url(#${id}g)`} mask={`url(#${id}m)`} />
      <path d={ARC} fill="none" stroke="#6CC3FF" strokeWidth="3.6" strokeLinecap="round" />
      <path d={PLANE} fill="#6CC3FF" transform="translate(54.5 12.2) rotate(-17) scale(.95)" />
    </svg>
  )
}

/** Полный логотип (знак + «BayBol Visa» + слоган) — готовый SVG из src/assets/logo */
export function Logo({ className = 'h-9 w-auto sm:h-10' }: { className?: string }) {
  return <img src={logoFull} alt="BayBol Visa" width={220} height={50} className={className} />
}
