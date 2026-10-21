// avoid-ai-design-ignore-file: SD4, SD4m — поля посадочного талона (тариф) моно-капсом, как на настоящем талоне
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatNumber, formatPrice, plural } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { Barcode } from './ui/Barcode'
import { DocNo } from './ui/Doc'
import { SplitFlap } from './ui/SplitFlap'
import { Ticket } from './ui/Ticket'

export function Pricing() {
  const { t, f } = useTx()
  const p = t.pricing
  const c = p.calc
  const { single, couple, child, maxChildren } = SITE.prices
  const [withSpouse, setWithSpouse] = useState(false)
  const [kids, setKids] = useState(0)

  const total = (withSpouse ? couple : single) + kids * child
  const adults = withSpouse ? 2 : 1
  const composition = [`${adults} ${plural(adults, t.wa.adults)}`, kids > 0 ? `${kids} ${plural(kids, t.wa.children)}` : t.wa.noChildren].join(', ')
  const waText = f(t.wa.calc, { composition, total: formatPrice(total) })
  const prices = [formatPrice(single), formatPrice(couple), `+${formatPrice(child)}`]
  // итог на табло: группы разрядов отдельными блоками, без пустых ячеек на месте пробела
  const flapGroups = formatNumber(total).split('\u00A0')

  return (
    <section id="prices" aria-labelledby="prices-title" className="border-t py-20 rule sm:py-28">
      <div className="w-full-x">
        <DocNo n={9} label={t.sections.prices} />
        <h2 id="prices-title" className="h-section mt-8">
          {p.title}
        </h2>

        {/* три тарифа — три посадочных талона */}
        <ul className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-5">
          {p.plans.map((plan, i) => (
            <li key={i} className={i === 1 ? 'lg:-translate-y-3' : ''}>
              <Ticket
                stubY={96}
                stubX={156}
                main={
                  <div className="flex h-full flex-col p-5 sm:p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2">
                      {p.ticketLabel} {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 font-serif text-[24px] leading-tight">{plan.name}</h3>
                    <p className="mt-2 text-[15px] text-ink-2">{plan.note}</p>
                  </div>
                }
                stub={
                  <div className="flex h-full items-center justify-between gap-3 px-5 sm:flex-col sm:items-start sm:justify-center sm:px-4">
                    <div>
                      <p className="whitespace-nowrap font-mono text-[19px] font-semibold leading-none">{prices[i]}</p>
                      <p className="mt-1.5 text-[13px] text-ink-2">{plan.unit}</p>
                    </div>
                    <Barcode seed={i + 3} className="h-8 w-20 sm:mt-4 sm:w-full" />
                  </div>
                }
              />
            </li>
          ))}
        </ul>

        {/* калькулятор — как бланк */}
        <div className="doc mx-auto mt-14 max-w-[880px]">
          <div className="border-b px-5 py-4 rule sm:px-8">
            <h3 className="font-serif text-[24px]">{c.title}</h3>
          </div>
          <div className="grid gap-8 px-5 py-6 sm:px-8 md:grid-cols-2 md:gap-10">
            <div>
              <p id="calc-mode" className="text-[15px] font-medium text-ink-2">
                {c.modeLabel}
              </p>
              <div role="radiogroup" aria-labelledby="calc-mode" className="mt-3 space-y-1">
                {[false, true].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    role="radio"
                    aria-checked={withSpouse === v}
                    onClick={() => setWithSpouse(v)}
                    className="flex min-h-[48px] w-full items-center gap-3.5 text-left"
                  >
                    <span aria-hidden="true" className="grid h-[22px] w-[22px] place-items-center rounded-full border-[1.5px] border-ink">
                      {withSpouse === v && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                    </span>
                    <span className={withSpouse === v ? 'font-medium' : 'text-ink-2'}>{v ? c.couple : c.single}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p id="calc-kids" className="text-[15px] font-medium text-ink-2">
                {c.children}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setKids((k) => Math.max(0, k - 1))}
                  disabled={kids === 0}
                  aria-label={c.dec}
                  className="grid h-14 w-14 place-items-center border border-ink text-ink transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
                >
                  <Minus size={22} strokeWidth={1.5} />
                </button>
                <output aria-labelledby="calc-kids" aria-live="polite" className="w-12 text-center font-mono text-[36px] font-medium">
                  {kids}
                </output>
                <button
                  type="button"
                  onClick={() => setKids((k) => Math.min(maxChildren, k + 1))}
                  disabled={kids === maxChildren}
                  aria-label={c.inc}
                  className="grid h-14 w-14 place-items-center border border-ink text-ink transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
                >
                  <Plus size={22} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed px-5 py-6 rule sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[15px] font-medium text-ink-2">{c.total}</p>
                <p className="mt-2 flex items-center gap-2 text-[30px] text-paper sm:text-[40px]" aria-live="polite">
                  <span className="flex gap-2" role="text" aria-label={formatPrice(total)}>
                    {flapGroups.map((g, i) => (
                      <SplitFlap key={`${flapGroups.length}-${i}`} value={g} label="" className="[--flap-bg:#14213A] [--flap-seam:rgba(245,240,230,.25)]" />
                    ))}
                  </span>
                  <span className="font-mono text-ink">₸</span>
                </p>
              </div>
              <a href={waLink(waText)} target="_blank" rel="noopener noreferrer" className="btn-gold w-full sm:w-auto">
                {f(c.cta, { total: formatPrice(total) })}
              </a>
            </div>
            <p className="mt-5 text-[15px] text-ink-2">{f(c.included)}</p>
            <p className="mt-2 max-w-[40rem] text-[15px]">{c.tip}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
