import { useTx } from '../hooks/useTx'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Guarantees() {
  const { t, f } = useTx()
  const g = t.guarantees
  return (
    <section aria-labelledby="guarantees-title" className="section tone-dark">
      <div className="container-x">
        <SectionHeading n="13" id="guarantees-title" eyebrow={g.eyebrow} title={g.title} accent={g.titleAccent} subtitle={g.subtitle} />
        <ul className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {g.items.map((it, i) => (
            <Reveal as="li" key={i} delay={i * 0.06} className="border-t-2 border-gold pt-5">
              <span className="text-xs font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{f(it.text)}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
