import logoLight from '../../assets/logo/logo-full-light.svg'

/** Логотип для бумажного фона — плоский, без свечения */
export function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return <img src={logoLight} alt="BayBol Visa" width={220} height={50} className={className} />
}

/** Знак-монета: круг с траекторией (для печатей), рисуется линией чернил */
export function MarkLine({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none" stroke={color}>
      <circle cx="28" cy="37" r="17" strokeWidth="2" />
      <path d="M5 55 Q20 23 50 14" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 14 l-7 -1 M50 14 l-3 6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
