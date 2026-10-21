import { m, useReducedMotion } from 'framer-motion'
import { DV, OPENS_AT } from '../config/dv'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { monthIndex } from '../lib/format'
import { CountUp } from './ui/CountUp'
import { GlowCard } from './ui/GlowCard'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Stats() {
  const { t, f } = useTx()
  const reduce = useReducedMotion()
  const s = t.stats
  const values = [
    { v: DV.visasPerYear, suffix: '' },
    { v: DV.registrationDays, suffix: '' },
    { v: 1, suffix: '' },
    { v: SITE.prices.single, suffix: ' ₸' },
  ]
  const active = monthIndex(OPENS_AT)

  return (
    <section aria-labelledby="stats-title" className="section">
      <div className="container-x">
        <SectionHeading id="stats-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} subtitle={s.subtitle} />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {values.map((it, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <GlowCard glow={i === 3 ? 'gold' : 'sky'} className="h-full p-5 sm:p-7">
                <p
                  className={`font-display text-[28px] font-extrabold leading-none sm:text-5xl ${
                    i === 3 ? 'neon-gold text-gold' : 'text-ink'
                  }`}
                >
                  <CountUp value={it.v} suffix={it.suffix} />
                </p>
                <p className="mt-3 text-sm leading-snug text-ink-muted sm:text-base">{s.items[i]}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6">
          <div className="glass p-5 sm:p-7">
            <ol className="grid grid-cols-6 gap-1.5 sm:grid-cols-12 sm:gap-2">
              {t.dates.months.short.map((name, i) => {
                const on = i === active
                return (
                  <li key={i} aria-current={on ? 'true' : undefined}>
                    <m.div
                      className={`flex h-12 items-center justify-center rounded-xl text-xs font-semibold sm:h-14 sm:text-sm ${
                        on ? 'bg-gold text-night shadow-gold' : 'border border-white/[0.06] bg-white/[0.02] text-ink-muted/70'
                      }`}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 0.4 }}
                    >
                      {name}
                    </m.div>
                  </li>
                )
              })}
            </ol>
            <p className="mt-4 text-center text-sm text-ink-muted">{f(s.monthsCaption)}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
