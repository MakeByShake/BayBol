import { Sparkle } from 'lucide-react'
import { useTx } from '../hooks/useTx'

/** Бегущая строка с ключевыми фактами */
export function Marquee() {
  const { t, f } = useTx()
  const items = t.marquee.map((s) => f(s))

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((s, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-5 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink sm:px-7 sm:text-base">{s}</span>
          <Sparkle size={14} className="text-gold" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="relative border-y border-white/[0.06] bg-night-2/80 py-4 sm:py-5">
      <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
