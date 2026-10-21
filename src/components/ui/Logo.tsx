import { useId } from 'react'
import { useLang } from '../../i18n/LanguageContext'

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

/** Полный логотип: знак + «BayBol Visa» + слоган */
export function Logo({ compact = false }: { compact?: boolean }) {
  const { t } = useLang()
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={compact ? 34 : 40} className="shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] font-bold tracking-tight sm:text-xl">
          <span className="neon-gold text-gold">BayBol</span> <span className="neon-sky text-sky">Visa</span>
        </span>
        {!compact && (
          <span className="mt-1.5 text-[8.5px] font-medium uppercase tracking-[0.3em] text-ink-muted">{t.brand.slogan}</span>
        )}
      </span>
    </span>
  )
}
