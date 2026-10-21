import { X } from 'lucide-react'
import { useTx } from '../hooks/useTx'
import { GlowCard } from './ui/GlowCard'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Mistakes() {
  const { t } = useTx()
  const s = t.mistakes
  return (
    <section aria-labelledby="mistakes-title" className="section bg-night-2/60">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading id="mistakes-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} subtitle={s.subtitle} />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
          {s.items.map((it, i) => (
            <Reveal as="li" key={i} delay={i * 0.06} className={i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <GlowCard glow="coral" className="h-full p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-coral/30 bg-coral/10 text-coral">
                    <X size={20} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-[17px] font-semibold leading-snug">{it.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{it.text}</p>
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
