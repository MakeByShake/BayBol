import { CalendarCheck } from 'lucide-react'
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
      <div className={`glass max-w-md p-5 ${center ? 'mx-auto text-center' : ''}`} role="status">
        <p className="font-display text-lg font-semibold">
          {f(t.timer.closedTitle, { date: formatDate(DV.resultsBy, 'until', t) })}
        </p>
        <p className="mt-1 text-ink-muted">{t.timer.closedText}</p>
      </div>
    )
  }

  const values = [days, hours, minutes, seconds]
  return (
    <div className={center ? 'flex flex-col items-center text-center' : ''}>
      <div className={`flex flex-wrap items-center gap-3 ${center ? 'justify-center' : ''}`}>
        {phase === 'open' && (
          <span className="inline-flex items-center gap-2 rounded-full bg-wa/15 px-3 py-1 text-xs font-semibold text-[#5BE38D]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping2 rounded-full bg-[#5BE38D]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5BE38D]" />
            </span>
            {t.timer.openBadge}
          </span>
        )}
        <p className="text-sm font-medium text-ink-muted">{phase === 'before' ? t.timer.before : t.timer.open}</p>
      </div>
      <div className="mt-3 grid w-full max-w-[400px] grid-cols-4 gap-2 sm:gap-3" aria-live="off">
        {values.map((v, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-2xl border border-white/[0.08] bg-night-card/80 px-1 py-3 backdrop-blur"
          >
            <span className="font-display text-2xl font-bold tabular-nums text-ink sm:text-3xl">
              {String(v).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink-muted sm:text-[11px]">{t.timer.units[i]}</span>
          </div>
        ))}
      </div>
      {phase === 'before' && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <CalendarCheck size={14} className="text-sky" aria-hidden="true" />
          {f(t.timer.startsAt, { date: formatDate(OPENS_AT, 'withTime', t) })}
        </p>
      )}
    </div>
  )
}
