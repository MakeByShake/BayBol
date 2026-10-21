import { DV, OPENS_AT } from '../config/dv'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { DocNo, Show } from './ui/Doc'

/** «Что изменилось в 2026» — как газетная заметка */
export function News() {
  const { t, f } = useTx()
  const n = t.news
  const vars = {
    courtDate: formatDate(DV.courtDate, 'fullLong', t),
    announce: formatDate(DV.datesAnnouncedBy, 'untilShort', t),
    open: formatDate(OPENS_AT, 'noLater', t),
  }
  const timeline = [
    { date: formatDate(DV.courtDate, 'numeric', t), text: n.timeline[0] },
    { date: formatDate(OPENS_AT, 'numeric', t), text: n.timeline[1] },
    { date: formatDate(DV.resultsBy, 'numeric', t), text: n.timeline[2] },
  ]

  return (
    <section aria-labelledby="news-title" className="border-t py-20 rule sm:py-28">
      <div className="w-text">
        <DocNo n={2} label={t.sections.news} />

        <div className="mt-10 grid gap-6 md:grid-cols-[180px_1fr] md:gap-10">
          {/* рубрика с датой, как в газете */}
          <p className="font-mono text-[13px] leading-relaxed text-ink-2">
            <span className="block text-[15px] font-medium text-ink">{formatDate(DV.courtDate, 'numeric', t)}</span>
            {n.rubric}
          </p>
          <article className="max-w-[36rem]">
            <h2 id="news-title" className="font-serif text-[30px] font-normal leading-[1.12] sm:text-[38px]">
              {n.title}
            </h2>
            <div className="mt-6 space-y-4 font-serif text-[18px] leading-[1.7] text-ink">
              {n.paragraphs.map((p, i) => (
                <p key={i}>{f(p, vars)}</p>
              ))}
            </div>
          </article>
        </div>

        {/* хронология из трёх дат на одной линии */}
        <div className="relative mt-14 md:ml-[220px]">
          <Show kind="line" className="absolute left-[5px] top-0 h-full w-px bg-ink md:left-0 md:top-[5px] md:h-px md:w-full" />
          <ol className="relative grid gap-6 md:grid-cols-3 md:gap-4">
            {timeline.map((it, i) => (
              <li key={i} className="flex gap-4 md:block">
                <span aria-hidden="true" className={`mt-1 block h-[11px] w-[11px] shrink-0 rounded-full border-2 border-ink ${i === 1 ? 'bg-gold' : 'bg-paper'}`} />
                <div className="md:mt-4">
                  <p className="font-mono text-[15px] font-medium">{it.date}</p>
                  <p className="text-[15px] text-ink-2">{it.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
