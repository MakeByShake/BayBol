import { DV, OPENS_AT } from '../config/dv'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatDate, formatNumber, formatPrice, monthIndex } from '../lib/format'
import { DocNo } from './ui/Doc'

export function Stats() {
  const { t, f } = useTx()
  const s = t.stats
  const values = [formatNumber(DV.visasPerYear), String(DV.registrationDays), '1', formatPrice(SITE.prices.single)]
  const active = monthIndex(OPENS_AT)

  return (
    <section aria-labelledby="stats-title" className="py-20 sm:py-28">
      <div className="w-wide">
        <DocNo n={1} label={t.sections.stats} />
        <h2 id="stats-title" className="h-section mt-8 max-w-[18ch]">
          {s.title}
        </h2>

        {/* одна строка крупных чисел, разделённых тонкими линиями */}
        <dl className="mt-14 grid grid-cols-2 border-y rule lg:grid-cols-4">
          {values.map((v, i) => (
            <div
              key={i}
              className={`flex flex-col-reverse justify-end gap-3 py-6 sm:py-8 ${i % 2 ? 'border-l pl-4 rule sm:pl-6' : 'pr-4'} ${i >= 2 ? 'border-t rule lg:border-t-0' : ''} ${
                i === 2 ? 'lg:border-l lg:pl-6' : ''
              }`}
            >
              <dt className="max-w-[20ch] font-mono text-[12px] leading-snug text-ink-2 sm:text-[13px]">{s.items[i]}</dt>
              <dd
                className={`font-serif font-light leading-none tracking-tight ${i === 3 ? 'text-gold-ink' : 'text-ink'}`}
                style={{ fontSize: 'clamp(34px, 5.2vw, 68px)', fontVariationSettings: "'opsz' 72" }}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>

        {/* линейка из 12 месяцев, ноябрь отмечен маркером */}
        <figure className="mt-12">
          <ol className="relative grid grid-cols-12 border-b border-ink pb-0">
            {t.dates.months.short.map((m, i) => {
              const on = i === active
              return (
                <li key={i} aria-current={on ? 'true' : undefined} className="relative flex flex-col items-start">
                  <span className="relative px-0.5 font-mono text-[10px] uppercase sm:px-1 sm:text-[13px]">
                    {on && (
                      <svg aria-hidden="true" viewBox="0 0 60 24" preserveAspectRatio="none" className="absolute -inset-x-1.5 -inset-y-1 h-[calc(100%+8px)] w-[calc(100%+12px)]">
                        <path d="M3 15 C 12 9, 30 8, 57 11 M2 18 C 20 13, 40 14, 58 16 M4 12 C 22 7, 38 6, 56 9" stroke="#F4C46A" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".85" />
                      </svg>
                    )}
                    <span className={`relative ${on ? 'font-semibold text-ink' : 'text-ink-2'}`}>{m}</span>
                  </span>
                  {/* засечки линейки */}
                  <span aria-hidden="true" className={`mt-2 w-px bg-ink ${on ? 'h-4' : 'h-2.5'}`} />
                </li>
              )
            })}
          </ol>
          <figcaption className="mt-4 text-[15px] text-ink-2">{f(s.caption, { inMonth: formatDate(OPENS_AT, 'inMonth', t) })}</figcaption>
        </figure>
      </div>
    </section>
  )
}
