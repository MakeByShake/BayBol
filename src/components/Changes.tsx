import { CalendarDays, CircleDollarSign, Hourglass, IdCard, Pause, Rocket, Scale, type LucideIcon } from 'lucide-react'
import { DV, OPENS_AT } from '../config/dv'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { GlowCard } from './ui/GlowCard'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const STORY_ICONS: LucideIcon[] = [Pause, Scale, Rocket]

export function Changes() {
  const { t, f } = useTx()
  const c = t.changes
  const storyVars = {
    courtDate: formatDate(DV.courtDate, 'fullLong', t),
    announce: formatDate(DV.datesAnnouncedBy, 'untilShort', t),
    open: formatDate(OPENS_AT, 'noLater', t),
  }
  const cards: { value: string; icon: LucideIcon; gold?: boolean }[] = [
    { value: formatDate(OPENS_AT, 'dayMonthNum', t), icon: CalendarDays },
    { value: String(DV.registrationDays), icon: Hourglass },
    { value: `$${DV.feeUsd}`, icon: CircleDollarSign, gold: true },
    { value: '', icon: IdCard },
  ]

  return (
    <section aria-labelledby="changes-title" className="section bg-night-2/60">
      <div className="container-x">
        <SectionHeading id="changes-title" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} />

        {/* короткая история */}
        <ol className="relative mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
          <div aria-hidden="true" className="absolute left-[26px] top-6 hidden h-px w-[calc(100%-52px)] border-t border-dashed border-sky/30 md:block" />
          {c.story.map((st, i) => {
            const Icon = STORY_ICONS[i]
            return (
              <Reveal as="li" key={i} delay={i * 0.12} className="relative">
                <div className="flex items-center gap-3">
                  <span
                    className={`relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl border ${
                      i === 2 ? 'border-gold/40 bg-gold/10 text-gold' : 'border-sky/25 bg-night-card text-sky'
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-bold">{st.title}</h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{f(st.text, storyVars)}</p>
              </Reveal>
            )
          })}
        </ol>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <Reveal key={i} delay={i * 0.08}>
                <GlowCard glow={card.gold ? 'gold' : 'sky'} className="h-full p-5 sm:p-6">
                  {i === 3 ? (
                    <IdCard size={40} strokeWidth={1.4} className="text-sky" aria-hidden="true" />
                  ) : (
                    <p className={`font-display text-4xl font-extrabold leading-none sm:text-5xl ${card.gold ? 'neon-gold text-gold' : 'text-ink'}`}>
                      {card.value}
                    </p>
                  )}
                  <p className="mt-3 flex items-start gap-1.5 text-sm leading-snug text-ink-muted sm:text-base">
                    {i !== 3 && <Icon size={15} className="mt-0.5 hidden shrink-0 text-sky sm:block" aria-hidden="true" />}
                    {c.cards[i]}
                  </p>
                </GlowCard>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-ink-muted">
            {c.appeal} <span className="whitespace-nowrap text-ink-muted/70">({f(c.source)})</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
