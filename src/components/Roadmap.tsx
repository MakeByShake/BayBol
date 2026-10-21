import { DV, OPENS_AT } from '../config/dv'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

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
    <section aria-labelledby="roadmap-title" className="section tone-dark2">
      <div className="container-x">
        <SectionHeading n="11" id="roadmap-title" eyebrow={r.eyebrow} title={r.title} accent={r.titleAccent} />

        <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {r.items.map((it, i) => (
            <Reveal as="li" key={i} delay={i * 0.06} className="relative pt-7">
              {/* отрезок шкалы с точкой */}
              <span aria-hidden="true" className={`absolute left-0 right-0 top-[5px] h-px ${i === 0 ? 'bg-gold' : 'bg-line/20'}`} />
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 h-[11px] w-[11px] rounded-full border-2 ${i === 0 ? 'border-gold bg-gold' : 'border-line/40 bg-night-2'}`}
              />
              <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${i === 0 ? 'text-accent' : 'text-link'}`}>{when[i]}</p>
              <h3 className="mt-2 text-lg font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{f(it.text)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
