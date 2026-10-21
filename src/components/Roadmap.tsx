import { CalendarCheck, FileText, Send, Stamp, type LucideIcon } from 'lucide-react'
import { DV, OPENS_AT } from '../config/dv'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const ICONS: LucideIcon[] = [Send, CalendarCheck, FileText, Stamp]

export function Roadmap() {
  const { t, f } = useTx()
  const r = t.roadmap
  const when = [
    formatDate(OPENS_AT, 'monthYear', t),
    formatDate(DV.resultsBy, 'until', t),
    DV.visasUntil.slice(0, 4),
    formatDate(DV.visasUntil, 'until', t),
  ]

  return (
    <section aria-labelledby="roadmap-title" className="section">
      <div className="container-x">
        <SectionHeading id="roadmap-title" eyebrow={r.eyebrow} title={r.title} accent={r.titleAccent} />

        <ol className="relative mt-14 grid gap-4 md:grid-cols-4 md:gap-5">
          <div aria-hidden="true" className="absolute left-0 right-0 top-[27px] hidden h-0.5 bg-gradient-to-r from-gold via-sky to-sky/20 md:block" />
          {r.items.map((it, i) => {
            const Icon = ICONS[i]
            const first = i === 0
            return (
              <Reveal as="li" key={i} delay={i * 0.1} className="relative">
                <span
                  className={`relative z-10 grid h-14 w-14 place-items-center rounded-full border-2 bg-night ${
                    first ? 'border-gold text-gold shadow-gold' : 'border-sky/50 text-sky'
                  }`}
                >
                  <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <p className={`mt-5 font-display text-sm font-bold uppercase tracking-[0.08em] ${first ? 'text-gold' : 'text-sky'}`}>
                  {when[i]}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold">{it.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{f(it.text)}</p>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
