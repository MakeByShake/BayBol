// avoid-ai-design-ignore-file: CP3, SD4, SD4m — бриф: ссылка «Проверить, подхожу ли я →»; поля посадочного талона моно-капсом
import { Plane } from 'lucide-react'
import type { CSSProperties } from 'react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatPrice } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { Barcode } from './ui/Barcode'
import { GuillocheBand } from './ui/Guilloche'
import { MarkLine } from './ui/Logo'
import { Ticket } from './ui/Ticket'

const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties

/** Посадочный талон первого экрана */
function BoardingPass() {
  const { t, f } = useTx()
  const k = t.hero.ticket
  const price = formatPrice(SITE.prices.single)

  const field = (label: string, value: string) => (
    <div className="min-w-0">
      <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">{label}</dt>
      <dd className="mt-0.5 font-mono text-[15px] font-medium text-ink">{value}</dd>
    </div>
  )

  return (
    <Ticket
      label={f(k.aria)}
      stubY={128}
      stubX={176}
      main={
        <div className="relative p-5 pb-12 sm:p-6 sm:pb-12">
          <div className="flex items-center justify-between border-b border-dashed pb-3 rule">
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink-2">{k.title}</p>
            <MarkLine className="h-6 w-6 text-ink" />
          </div>

          {/* маршрут */}
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">{k.from}</p>
              <p className="font-mono text-[40px] font-medium leading-none tracking-tight sm:text-[46px]">{k.fromCode}</p>
              <p className="mt-1 text-[13px] text-ink-2">{k.fromCity}</p>
            </div>
            <div className="mb-7 flex flex-1 items-center gap-1 text-sky-ink" aria-hidden="true">
              <span className="h-px flex-1 border-t border-dashed border-sky-ink/60" />
              <Plane size={18} strokeWidth={1.5} />
            </div>
            <div className="text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">{k.to}</p>
              <p className="font-mono text-[40px] font-medium leading-none tracking-tight sm:text-[46px]">{k.toCode}</p>
              <p className="mt-1 text-[13px] text-ink-2">{k.toCity}</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 rule">
            {field(k.program, f('{program}'))}
            {field(k.depart, f(k.departValue))}
            {field(k.passenger, k.passengerValue)}
            {field(k.seat, k.seatValue)}
          </dl>

          <GuillocheBand className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full" opacity={0.7} />
        </div>
      }
      stub={
        <div className="flex h-full items-center justify-between gap-4 px-5 py-4 sm:flex-col sm:items-start sm:justify-between sm:py-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">{k.price}</p>
            <p className="mt-1 whitespace-nowrap font-mono text-[24px] font-semibold leading-none">{price}</p>
            <p className="mt-1.5 text-[13px] text-ink-2">{k.perForm}</p>
            <p className="mt-2 font-mono text-[12px] text-ink-2">
              {k.fee}: {f(k.feeValue)}
            </p>
          </div>
          <Barcode seed={27} className="h-14 w-24 sm:h-12 sm:w-full" />
        </div>
      }
    />
  )
}

export function Hero() {
  const { t, f } = useTx()
  const h = t.hero

  return (
    <section id="top" aria-labelledby="hero-title" className="relative pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-36">
      <div className="w-full-x grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h1
            id="hero-title"
            className="lay font-serif font-light text-ink"
            style={{ ...delay(60), fontSize: 'clamp(36px, 11vw, 86px)', lineHeight: 0.98, letterSpacing: '-0.03em', fontVariationSettings: "'opsz' 72" }}
          >
            {h.title}
          </h1>
          <p className="lay mt-7 max-w-[34rem] text-[18px] leading-relaxed text-ink-2 sm:text-[19px]" style={delay(160)}>
            {f(h.subtitle)}
          </p>
          <div className="lay mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7" style={delay(250)}>
            <a href={waLink(f(t.wa.general))} target="_blank" rel="noopener noreferrer" className="btn-gold w-full sm:w-auto">
              {f(h.cta)}
            </a>
            <a href="#check" className="link text-[16px]">
              {h.check} →
            </a>
          </div>
          <p className="lay mt-9 max-w-[32rem] border-l-2 border-gold pl-3 font-mono text-[13px] leading-relaxed text-ink-2" style={delay(330)}>
            {f(h.court)}
          </p>
        </div>

        <div className="lay-ticket lg:col-span-5 xl:-mr-8 2xl:-mr-20" style={delay(380)}>
          <div className="mx-auto max-w-[520px] -rotate-[1.5deg] sm:-rotate-[3deg]">
            <BoardingPass />
          </div>
        </div>
      </div>
    </section>
  )
}
