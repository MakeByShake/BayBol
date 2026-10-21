import { useTx } from '../hooks/useTx'

/** Бегущая строка с ключевыми фактами */
export function Marquee() {
  const { t, f } = useTx()
  const items = t.marquee.map((s) => f(s))

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((s, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-[13px] font-medium uppercase tracking-[0.12em] text-ink-muted">{s}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="tone-dark2 border-y border-line/10 py-4">
      <div className="flex overflow-hidden">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
