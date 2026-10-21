import { RotateCcw, ShieldCheck, Vault, type LucideIcon } from 'lucide-react'
import { useTx } from '../hooks/useTx'
import { GlowCard } from './ui/GlowCard'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const ICONS: LucideIcon[] = [ShieldCheck, Vault, RotateCcw]

export function Guarantees() {
  const { t, f } = useTx()
  const g = t.guarantees
  return (
    <section aria-labelledby="guarantees-title" className="section">
      <div className="container-x">
        <SectionHeading id="guarantees-title" eyebrow={g.eyebrow} title={g.title} accent={g.titleAccent} subtitle={g.subtitle} />
        <ul className="mt-12 grid gap-3 sm:gap-4 md:grid-cols-3">
          {g.items.map((it, i) => {
            const Icon = ICONS[i]
            return (
              <Reveal as="li" key={i} delay={i * 0.08}>
                <GlowCard glow="gold" className="h-full p-6 text-center sm:p-8">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/30 bg-[radial-gradient(circle,rgba(244,196,106,.22),rgba(244,196,106,.04))] text-gold shadow-[0_0_40px_-10px_rgba(244,196,106,.6)]">
                    <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{it.title}</h3>
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
