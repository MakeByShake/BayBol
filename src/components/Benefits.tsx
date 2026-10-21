import { Briefcase, GraduationCap, HeartHandshake, Landmark, PlaneTakeoff, Flag, type LucideIcon } from 'lucide-react'
import { useTx } from '../hooks/useTx'
import { GlowCard } from './ui/GlowCard'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const ICONS: LucideIcon[] = [Briefcase, GraduationCap, Flag, HeartHandshake, Landmark, PlaneTakeoff]

export function Benefits() {
  const { t } = useTx()
  const s = t.benefits
  return (
    <section aria-labelledby="benefits-title" className="section bg-night-2/60">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-80 w-[60vw] -translate-x-1/2 rounded-full bg-sky/10 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading id="benefits-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} />
        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {s.items.map((it, i) => {
            const Icon = ICONS[i]
            return (
              <Reveal as="li" key={i} delay={(i % 3) * 0.08}>
                <GlowCard glow={i % 2 ? 'gold' : 'sky'} className="h-full p-6 sm:p-7">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold/20 to-sky/20 text-ink">
                      <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-lg font-semibold leading-snug">{it.title}</h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{it.text}</p>
                </GlowCard>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
