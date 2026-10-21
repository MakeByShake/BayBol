import { BadgeDollarSign, Camera, FileCheck, Hash, MessagesSquare, Users, type LucideIcon } from 'lucide-react'
import { useTx } from '../hooks/useTx'
import { GlowCard } from './ui/GlowCard'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const ICONS: LucideIcon[] = [Users, BadgeDollarSign, Camera, Hash, FileCheck, MessagesSquare]

export function Included() {
  const { t, f } = useTx()
  const s = t.included
  return (
    <section id="included" aria-labelledby="included-title" className="section bg-night-2/60">
      <div className="container-x">
        <SectionHeading id="included-title" eyebrow={s.eyebrow} title={f(s.title)} accent={f(s.titleAccent)} />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {s.items.map((it, i) => {
            const Icon = ICONS[i]
            return (
              <Reveal as="li" key={i} delay={(i % 3) * 0.08}>
                <GlowCard glow={i === 1 ? 'gold' : 'sky'} className="h-full p-6 sm:p-7">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl border ${
                      i === 1 ? 'border-gold/30 bg-gold/10 text-gold' : 'border-sky/25 bg-sky/[0.08] text-sky'
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{f(it.title)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{f(it.text)}</p>
                </GlowCard>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
