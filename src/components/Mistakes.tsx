import { X } from 'lucide-react'
import { useTx } from '../hooks/useTx'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Mistakes() {
  const { t } = useTx()
  const s = t.mistakes
  return (
    <section aria-labelledby="mistakes-title" className="section tone-dark">
      <div className="container-x">
        <SectionHeading n="04" id="mistakes-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} subtitle={s.subtitle} />
        <ul className="mt-12 border-t border-line/10">
          {s.items.map((it, i) => (
            <Reveal as="li" key={i} delay={i * 0.04} className="grid gap-2 border-b border-line/10 py-5 sm:py-6 md:grid-cols-[48px_1fr_1.3fr] md:items-baseline md:gap-6">
              <span className="hidden items-center gap-1 text-xs font-semibold text-coral md:inline-flex">
                <X size={13} strokeWidth={2.5} aria-hidden="true" />
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="flex items-baseline gap-3 text-lg font-semibold sm:text-xl">
                <X size={15} strokeWidth={2.5} className="shrink-0 translate-y-0.5 text-coral md:hidden" aria-hidden="true" />
                {it.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-ink-muted max-md:pl-[27px]">{it.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
