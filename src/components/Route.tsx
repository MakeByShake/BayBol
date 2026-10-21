import { DV, OPENS_AT, getPhase } from '../config/dv'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { DocNo } from './ui/Doc'

/** «Путь до грин-карты» — таблица рейсов: дата | событие | статус */
export function Route() {
  const { t, f } = useTx()
  const r = t.route
  const phase = getPhase()
  const st = t.board.status
  const first = phase === 'before' ? st.expected : phase === 'open' ? st.boarding : st.done

  const rows = [
    { date: formatDate(OPENS_AT, 'monthYear', t), status: first, hl: phase === 'open' },
    { date: formatDate(DV.resultsBy, 'numeric', t), status: st.scheduled, hl: false },
    { date: DV.visasUntil.slice(0, 4), status: st.scheduled, hl: false },
    { date: formatDate(DV.visasUntil, 'numeric', t), status: st.scheduled, hl: false },
  ]

  return (
    <section aria-labelledby="route-title" className="border-t py-20 rule sm:py-28">
      <div className="w-text">
        <DocNo n={11} label={t.sections.route} />
        <h2 id="route-title" className="h-section mt-8">
          {r.title}
        </h2>

        <table className="mt-12 w-full border-y border-ink text-left">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b rule">
              {r.head.map((h, i) => (
                <th key={h} scope="col" className={`py-3 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink-2 ${i === 2 ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {r.rows.map((row, i) => (
              <tr key={i} className="grid grid-cols-[1fr_auto] gap-x-4 border-b py-4 rule last:border-b-0 sm:table-row sm:py-0">
                <td className="whitespace-nowrap font-mono text-[15px] font-medium sm:w-[170px] sm:py-5 sm:pr-4 sm:align-top">{rows[i].date}</td>
                <td className="col-span-2 row-start-2 mt-1 sm:py-5 sm:pr-4 sm:align-top">
                  <p className="font-serif text-[20px] leading-snug">{row.title}</p>
                  <p className="mt-1 text-[15px] text-ink-2">{f(row.text)}</p>
                </td>
                <td className={`row-start-1 text-right font-mono text-[12px] uppercase tracking-[0.06em] sm:py-5 sm:align-top ${rows[i].hl ? 'text-sky-ink' : 'text-ink-2'}`}>
                  {rows[i].status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
