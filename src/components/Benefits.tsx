import { useTx } from '../hooks/useTx'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Benefits() {
  const { t } = useTx()
  const s = t.benefits
  return (
    <section aria-labelledby="benefits-title" className="section tone-dark2">
      <div className="container-x">
        <SectionHeading n="08" id="benefits-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} />
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((it, i) => (
            <Reveal as="li" key={i} delay={(i % 3) * 0.06} className="border-t border-line/15 pt-5">
              <span className="text-xs font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{it.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
