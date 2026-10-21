import { DV, OPENS_AT } from '../../config/dv'
import { useCountdown } from '../../hooks/useCountdown'
import { useTx } from '../../hooks/useTx'
import { formatDate } from '../../lib/format'

/** Таймер: до открытия → идёт приём → приём завершён */
export function Countdown({ align = 'left' }: { align?: 'left' | 'center' }) {
  const { t, f } = useTx()
  const { phase, days, hours, minutes, seconds } = useCountdown()
  const center = align === 'center'

  if (phase === 'closed') {
    return (
      <div className={`max-w-md border-l-2 border-accent pl-4 ${center ? 'mx-auto border-l-0 pl-0 text-center' : ''}`} role="status">
        <p className="font-semibold">{f(t.timer.closedTitle, { date: formatDate(DV.resultsBy, 'until', t) })}</p>
        <p className="mt-1 text-ink-muted">{t.timer.closedText}</p>
      </div>
    )
  }

  const values = [days, hours, minutes, seconds]
  return (
    <div className={center ? 'flex flex-col items-center text-center' : ''}>
      <p className={`label flex flex-wrap items-center gap-2.5 ${center ? 'justify-center' : ''}`}>
        {phase === 'open' && (
          <span className="inline-flex items-center gap-1.5 text-[#5BE38D]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping2 rounded-full bg-[#5BE38D]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5BE38D]" />
            </span>
            {t.timer.openBadge} ·
          </span>
        )}
        {phase === 'before' ? t.timer.before : t.timer.open}
      </p>
      <div className="mt-3 inline-grid grid-cols-4 overflow-hidden rounded-[10px] border border-line/15" aria-live="off">
        {values.map((v, i) => (
          <div key={i} className={`flex min-w-[68px] flex-col items-center px-2 py-2.5 sm:min-w-[80px] ${i ? 'border-l border-line/15' : ''}`}>
            <span className="tabular text-2xl font-semibold text-ink sm:text-[28px]">{String(v).padStart(2, '0')}</span>
            <span className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-ink-muted">{t.timer.units[i]}</span>
          </div>
        ))}
      </div>
      {phase === 'before' && <p className="mt-2.5 text-xs text-ink-muted">{f(t.timer.startsAt, { date: formatDate(OPENS_AT, 'withTime', t) })}</p>}
    </div>
  )
}
