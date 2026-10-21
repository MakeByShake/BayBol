import { DV, OPENS_AT } from '../config/dv'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { monthIndex } from '../lib/format'
import { CountUp } from './ui/CountUp'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Stats() {
  const { t, f } = useTx()
  const s = t.stats
  const values = [
    { v: DV.visasPerYear, suffix: '' },
    { v: DV.registrationDays, suffix: '' },
    { v: 1, suffix: '' },
    { v: SITE.prices.single, suffix: ' ₸' },
  ]
  const active = monthIndex(OPENS_AT)

  return (
    <section aria-labelledby="stats-title" className="section tone-dark">
      <div className="container-x">
        <SectionHeading n="01" id="stats-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} subtitle={s.subtitle} />

        <Reveal className="mt-12 grid grid-cols-2 border-t border-line/10 lg:grid-cols-4">
          {values.map((it, i) => (
            <div
              key={i}
              className={`py-7 pr-4 sm:py-9 ${i % 2 ? 'border-l border-line/10 pl-4 sm:pl-6' : ''} ${i >= 2 ? 'border-t border-line/10 lg:border-t-0' : ''} ${
                i === 2 ? 'lg:border-l lg:pl-6' : ''
              }`}
            >
              <p className={`text-[30px] font-semibold leading-none tracking-tight min-[400px]:text-[34px] sm:text-[42px] xl:text-5xl ${i === 3 ? 'text-accent' : ''}`}>
                <CountUp value={it.v} suffix={it.suffix} />
              </p>
              <p className="mt-3 max-w-[22ch] text-sm leading-snug text-ink-muted sm:text-[15px]">{s.items[i]}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-4">
          <ol className="grid grid-cols-6 gap-1 sm:grid-cols-12">
            {t.dates.months.short.map((name, i) => {
              const on = i === active
              return (
                <li
                  key={i}
                  aria-current={on ? 'true' : undefined}
                  className={`flex h-11 items-center justify-center rounded-md text-xs font-medium sm:h-12 sm:text-[13px] ${
                    on ? 'bg-gold font-semibold text-night' : 'border border-line/10 text-ink-muted/60'
                  }`}
                >
                  {name}
                </li>
              )
            })}
          </ol>
          <p className="mt-3 text-sm text-ink-muted">{f(s.monthsCaption)}</p>
        </Reveal>
      </div>
    </section>
  )
}
