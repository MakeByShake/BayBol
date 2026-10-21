import { IdCard } from 'lucide-react'
import { DV, OPENS_AT } from '../config/dv'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Changes() {
  const { t, f } = useTx()
  const c = t.changes
  const storyVars = {
    courtDate: formatDate(DV.courtDate, 'fullLong', t),
    announce: formatDate(DV.datesAnnouncedBy, 'untilShort', t),
    open: formatDate(OPENS_AT, 'noLater', t),
  }
  const facts = [formatDate(OPENS_AT, 'dayMonthNum', t), String(DV.registrationDays), `$${DV.feeUsd}`, null]

  return (
    <section aria-labelledby="changes-title" className="section tone-dark2">
      <div className="container-x">
        <SectionHeading n="02" id="changes-title" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} />

        {/* короткая история */}
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {c.story.map((st, i) => (
            <Reveal as="li" key={i} delay={i * 0.08} className="border-t border-line/15 pt-5">
              <p className="flex items-baseline gap-3">
                <span className={`text-xs font-semibold ${i === 2 ? 'text-accent' : 'text-ink-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg font-semibold">{st.title}</span>
              </p>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-muted">{f(st.text, storyVars)}</p>
            </Reveal>
          ))}
        </ol>

        {/* ключевые факты — одной таблицей */}
        <Reveal className="mt-12 grid grid-cols-2 overflow-hidden rounded-xl border border-line/10 lg:grid-cols-4">
          {facts.map((value, i) => (
            <div
              key={i}
              className={`p-5 sm:p-7 ${i % 2 ? 'border-l border-line/10' : ''} ${i >= 2 ? 'border-t border-line/10 lg:border-t-0' : ''} ${
                i === 2 ? 'lg:border-l' : ''
              }`}
            >
              {value ? (
                <p className={`text-3xl font-semibold leading-none sm:text-[40px] ${i === 2 ? 'text-accent' : ''}`}>{value}</p>
              ) : (
                <IdCard size={34} strokeWidth={1.4} className="text-link" aria-hidden="true" />
              )}
              <p className="mt-3 text-sm leading-snug text-ink-muted sm:text-[15px]">{c.cards[i]}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-6">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-muted">
            {c.appeal} <span className="whitespace-nowrap opacity-70">({f(c.source)})</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
