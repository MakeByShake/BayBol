import { animate, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, Minus, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatPrice, plural } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { GoldButton } from './ui/Buttons'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

/** Итог, который плавно пересчитывается */
function AnimatedPrice({ value }: { value: number }) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    if (reduce) return
    const c = animate(prev.current, value, { duration: 0.45, ease: 'easeOut', onUpdate: setShown })
    prev.current = value
    return () => c.stop()
  }, [value, reduce])
  return <span className="tabular">{formatPrice(reduce ? value : shown)}</span>
}

export function Pricing() {
  const { t, f } = useTx()
  const p = t.pricing
  const c = p.calc
  const { single, couple, child, maxChildren } = SITE.prices
  const [withSpouse, setWithSpouse] = useState(false)
  const [kids, setKids] = useState(0)

  const total = (withSpouse ? couple : single) + kids * child
  const adults = withSpouse ? 2 : 1
  const composition = [
    `${adults} ${plural(adults, t.wa.adults)}`,
    kids > 0 ? `${kids} ${plural(kids, t.wa.children)}` : t.wa.noChildren,
  ].join(', ')
  const waText = f(t.wa.calc, { composition, total: formatPrice(total) })
  const planPrices = [formatPrice(single), formatPrice(couple), `+${formatPrice(child)}`]

  return (
    <section id="prices" aria-labelledby="prices-title" className="section tone-light">
      <div className="container-x">
        <SectionHeading n="09" id="prices-title" eyebrow={p.eyebrow} title={p.title} accent={p.titleAccent} subtitle={f(c.included)} />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          {/* тарифы — строками, как смета */}
          <Reveal>
            <ul className="border-t border-line/15">
              {p.plans.map((plan, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-b border-line/10 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:py-6">
                  <span className="text-xs font-semibold text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-semibold">
                      {plan.name}
                      {'badge' in plan && plan.badge && (
                        <span className="rounded-md bg-[#0B2233] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gold">{plan.badge}</span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">{plan.note}</p>
                  </div>
                  <p className="col-start-2 mt-2 text-right max-sm:text-left sm:col-start-auto sm:mt-0">
                    <span className="block text-2xl font-semibold tracking-tight">{planPrices[i]}</span>
                    <span className="text-xs text-ink-muted">{plan.unit}</span>
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-l-2 border-gold-deep pl-4 text-[15px] leading-relaxed">{c.tip}</p>
          </Reveal>

          {/* калькулятор */}
          <Reveal delay={0.08}>
            <div className="card p-5 shadow-[0_1px_0_rgba(11,34,51,.04)] sm:p-7">
              <h3 className="text-xl font-semibold">{c.title}</h3>

              <p id="calc-mode" className="label mt-6">
                {c.modeLabel}
              </p>
              <div role="radiogroup" aria-labelledby="calc-mode" className="mt-2 grid grid-cols-2 rounded-[10px] border border-line/15 p-1">
                {[false, true].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    role="radio"
                    aria-checked={withSpouse === v}
                    onClick={() => setWithSpouse(v)}
                    className={`h-11 rounded-md px-2 text-sm font-semibold transition-colors ${
                      withSpouse === v ? 'bg-[#0B2233] text-white' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {v ? c.couple : c.single}
                  </button>
                ))}
              </div>

              <p id="calc-kids" className="label mt-5">
                {c.children}
              </p>
              <div className="mt-2 flex items-center justify-between rounded-[10px] border border-line/15 p-1">
                <button
                  type="button"
                  onClick={() => setKids((k) => Math.max(0, k - 1))}
                  disabled={kids === 0}
                  aria-label={c.dec}
                  className="grid h-11 w-11 place-items-center rounded-md text-ink transition-colors hover:bg-line/5 disabled:opacity-30"
                >
                  <Minus size={18} aria-hidden="true" />
                </button>
                <output aria-labelledby="calc-kids" aria-live="polite" className="tabular text-xl font-semibold">
                  {kids}
                </output>
                <button
                  type="button"
                  onClick={() => setKids((k) => Math.min(maxChildren, k + 1))}
                  disabled={kids === maxChildren}
                  aria-label={c.inc}
                  className="grid h-11 w-11 place-items-center rounded-md text-ink transition-colors hover:bg-line/5 disabled:opacity-30"
                >
                  <Plus size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 border-t border-line/10 pt-5">
                <p className="label">{c.total}</p>
                <p className="mt-1.5 text-4xl font-semibold tracking-tight sm:text-[44px]" aria-live="polite">
                  <AnimatedPrice value={total} />
                </p>
                <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-muted">
                  <Check size={15} className="mt-0.5 shrink-0 text-link" aria-hidden="true" />
                  {f(c.included)}
                </p>
              </div>

              <GoldButton href={waLink(waText)} size="lg" className="mt-6 w-full text-[15px] sm:text-base">
                {f(c.cta, { total: formatPrice(total) })}
                <ArrowUpRight size={18} aria-hidden="true" />
              </GoldButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
