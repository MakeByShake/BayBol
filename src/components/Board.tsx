// avoid-ai-design-ignore-file: SD4, SD4m — табло вылетов: моно-капс — это сам предмет, а не декор
import { DV, OPENS_AT } from '../config/dv'
import { useCountdown } from '../hooks/useCountdown'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { SplitFlap } from './ui/SplitFlap'

const pad = (n: number) => String(n).padStart(2, '0')

/** Табло вылетов: таймер перекидными цифрами + строки рейсов. Единственная тёмная секция. */
export function Board() {
  const { t, f } = useTx()
  const b = t.board
  const { phase, days, hours, minutes, seconds } = useCountdown()

  const statusFirst = phase === 'before' ? b.status.expected : phase === 'open' ? b.status.boarding : b.status.done
  const statusColor = phase === 'before' ? 'text-gold' : phase === 'open' ? 'text-sky' : 'text-board-text/70'
  const rows = [
    { flight: DV.programName, dest: b.rows[0], time: formatDate(OPENS_AT, 'numTime', t), status: statusFirst, color: statusColor },
    { flight: DV.programName, dest: b.rows[1], time: formatDate(DV.resultsBy, 'numeric', t), status: b.status.scheduled, color: 'text-board-text/70' },
    { flight: DV.programName, dest: b.rows[2], time: formatDate(DV.visasUntil, 'numeric', t), status: b.status.scheduled, color: 'text-board-text/70' },
  ]
  const groups = [days, hours, minutes, seconds].map((v, i) => ({ v: i === 0 ? String(v).padStart(2, '0') : pad(v), unit: b.units[i], full: b.unitsFull[i] }))
  const countLabel = groups.map((g) => `${Number(g.v)} ${g.full}`).join(', ')

  return (
    <section aria-labelledby="board-title" className="relative bg-board py-14 text-board-text sm:py-20">
      <div className="w-full-x">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-board-line pb-4">
          <h2 id="board-title" className="font-mono text-[15px] font-medium uppercase tracking-[0.1em]">
            {b.title}
          </h2>
          <p className="font-mono text-[13px] text-board-text/75">{phase === 'before' ? f(b.startsAt, { date: formatDate(OPENS_AT, 'withTime', t) }) : ''}</p>
        </div>

        <div className="mt-8 grid gap-10 xl:grid-cols-[auto_1fr] xl:items-start xl:gap-16">
          {/* таймер */}
          <div>
            {phase === 'closed' ? (
              <div role="status" className="max-w-md">
                <p className="font-serif text-[28px] font-light leading-tight">{f(b.closedTitle, { date: formatDate(DV.resultsBy, 'until', t) })}</p>
                <p className="mt-2 text-board-text/70">{b.closedText}</p>
              </div>
            ) : (
              <>
                <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-board-text/75">{phase === 'before' ? b.countBefore : b.countOpen}</p>
                <div className="mt-3 flex items-start gap-1 text-[27px] text-board-text min-[380px]:gap-1.5 min-[380px]:text-[31px] min-[430px]:text-[36px] sm:gap-4 sm:text-[60px] lg:text-[72px]" aria-label={countLabel} role="timer">
                  {groups.map((g, i) => (
                    <div key={i} className="flex items-start gap-1 min-[380px]:gap-1.5 sm:gap-4">
                      <div className="flex flex-col items-center">
                        <SplitFlap value={g.v} label={`${Number(g.v)} ${g.full}`} />
                        <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-board-text/70 sm:text-[12px]">{g.unit}</span>
                      </div>
                      {i < 3 && (
                        <span aria-hidden="true" className="leading-[1.4] text-board-text/40">
                          :
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* строки табло */}
          <table className="w-full font-mono text-[13px] sm:text-[14px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-board-text/70">
                {b.head.map((h, i) => (
                  <th key={h} scope="col" className={`pb-2 font-medium ${i === 2 ? 'hidden sm:table-cell' : ''} ${i === 3 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-board-line align-top">
                  <td className="whitespace-nowrap py-3 pr-3 text-board-text/80">{r.flight}</td>
                  <td className="py-3 pr-3 uppercase">
                    {r.dest}
                    <span className="mt-0.5 block text-board-text/75 sm:hidden">{r.time}</span>
                  </td>
                  <td className="hidden whitespace-nowrap py-3 pr-3 sm:table-cell">{r.time}</td>
                  <td className={`py-3 text-right uppercase ${r.color}`}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
