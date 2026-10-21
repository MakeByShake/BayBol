// avoid-ai-design-ignore-file: SD4m — поля посадочного талона
import { forwardRef } from 'react'
import { DV } from '../config/dv'
import { useCountdown } from '../hooks/useCountdown'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { Barcode } from './ui/Barcode'
import { WhatsAppIcon } from './ui/Icons'
import { SplitFlap } from './ui/SplitFlap'
import { Ticket } from './ui/Ticket'

const pad = (n: number) => String(n).padStart(2, '0')

/** Финальный призыв — большой посадочный талон, на корешке таймер и кнопка. Здесь «приземляется» самолётик маршрута */
export const FinalCta = forwardRef<HTMLSpanElement>(function FinalCta(_, landingRef) {
  const { t, f } = useTx()
  const c = t.finalCta
  const b = t.board
  const { phase, days, hours, minutes } = useCountdown()

  return (
    <section aria-labelledby="final-title" className="border-t py-20 rule sm:py-28">
      <div className="w-wide relative">
        {/* точка посадки самолётика — над талоном */}
        <span ref={landingRef} aria-hidden="true" className="absolute -top-6 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-sky-ink bg-paper" />
        <Ticket
          stubY={250}
          stubX={320}
          main={
            <div className="p-6 sm:p-10">
              <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-2">
                ALA → USA&ensp;{DV.programName}
              </p>
              <h2 id="final-title" className="mt-5 max-w-[16ch] font-serif font-light leading-[1.05]" style={{ fontSize: 'clamp(32px, 4.6vw, 58px)', letterSpacing: '-0.02em' }}>
                {f(c.title)}
              </h2>
              <p className="mt-5 max-w-[32rem] text-ink-2">{c.text}</p>
            </div>
          }
          stub={
            <div className="flex h-full flex-col justify-between gap-4 p-6">
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-2">{phase === 'open' ? b.countOpen : phase === 'before' ? b.countBefore : c.stub}</p>
                {phase !== 'closed' ? (
                  <p className="mt-3 flex items-start gap-1.5 text-[26px] text-paper" role="timer" aria-label={`${days} ${b.unitsFull[0]}, ${hours} ${b.unitsFull[1]}, ${minutes} ${b.unitsFull[2]}`}>
                    {[pad(days), pad(hours), pad(minutes)].map((v, i) => (
                      <span key={i} className="flex flex-col items-center">
                        <SplitFlap value={v} className="[--flap-bg:#14213A] [--flap-seam:rgba(245,240,230,.25)]" />
                        <span className="mt-1 font-mono text-[10px] uppercase text-ink-2">{b.units[i]}</span>
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="mt-2 text-[15px]">{f(b.closedTitle, { date: formatDate(DV.resultsBy, 'until', t) })}</p>
                )}
              </div>
              <a href={waLink(f(t.wa.general))} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
                <WhatsAppIcon size={19} />
                {c.btn}
              </a>
              <Barcode seed={42} className="hidden h-8 w-full sm:block" />
            </div>
          }
        />
      </div>
    </section>
  )
})
