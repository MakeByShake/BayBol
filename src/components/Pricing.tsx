import { animate, m, useReducedMotion } from 'framer-motion'
import { Baby, Check, HeartHandshake, Lightbulb, Minus, Plus, User, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatPrice, plural } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { GoldButton } from './ui/Buttons'
import { GlowCard } from './ui/GlowCard'
import { WhatsAppIcon } from './ui/Icons'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const PLAN_ICONS: LucideIcon[] = [User, HeartHandshake, Baby]

/** Итог, который плавно пересчитывается */
function AnimatedPrice({ value }: { value: number }) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    if (reduce) return
    const c = animate(prev.current, value, { duration: 0.5, ease: 'easeOut', onUpdate: setShown })
    prev.current = value
    return () => c.stop()
  }, [value, reduce])
  return <span className="tabular-nums">{formatPrice(reduce ? value : shown)}</span>
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
    <section id="prices" aria-labelledby="prices-title" className="section">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(60%_50%_at_50%_100%,rgba(244,196,106,.12),transparent)]" />
      <div className="container-x relative">
        <SectionHeading id="prices-title" eyebrow={p.eyebrow} title={p.title} accent={p.titleAccent} />

        {/* тарифы */}
        <ul className="mt-12 grid gap-3 sm:gap-4 md:grid-cols-3">
          {p.plans.map((plan, i) => {
            const Icon = PLAN_ICONS[i]
            const featured = i === 1
            return (
              <Reveal as="li" key={i} delay={i * 0.08}>
                <GlowCard glow="gold" className={`h-full p-6 sm:p-7 ${featured ? 'border-gradient' : ''}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold/10 text-gold">
                      <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    {'badge' in plan && plan.badge && (
                      <span className="rounded-full bg-gradient-to-r from-gold to-sky px-3 py-1 text-xs font-bold text-night">{plan.badge}</span>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="neon-gold font-display text-[34px] font-extrabold leading-none text-gold">{planPrices[i]}</span>
                    <span className="text-sm text-ink-muted">{plan.unit}</span>
                  </p>
                  <p className="mt-3 text-[15px] text-ink-muted">{plan.note}</p>
                </GlowCard>
              </Reveal>
            )
          })}
        </ul>

        {/* калькулятор */}
        <Reveal className="mx-auto mt-8 max-w-3xl">
          <div className="glass border-gradient p-5 sm:p-8">
            <h3 className="font-display text-xl font-bold sm:text-2xl">{c.title}</h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p id="calc-mode" className="text-sm font-medium text-ink-muted">
                  {c.modeLabel}
                </p>
                <div role="radiogroup" aria-labelledby="calc-mode" className="relative mt-2 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-xl bg-gold transition-all duration-300"
                    style={{ left: withSpouse ? '50%' : '4px' }}
                  />
                  {[false, true].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      role="radio"
                      aria-checked={withSpouse === v}
                      onClick={() => setWithSpouse(v)}
                      className={`relative h-11 rounded-xl px-2 text-sm font-semibold transition-colors ${
                        withSpouse === v ? 'text-night' : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      {v ? c.couple : c.single}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p id="calc-kids" className="text-sm font-medium text-ink-muted">
                  {c.children}
                </p>
                <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-1">
                  <button
                    type="button"
                    onClick={() => setKids((k) => Math.max(0, k - 1))}
                    disabled={kids === 0}
                    aria-label={c.dec}
                    className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] text-ink transition-colors hover:bg-white/10 disabled:opacity-30"
                  >
                    <Minus size={18} aria-hidden="true" />
                  </button>
                  <output aria-labelledby="calc-kids" aria-live="polite" className="font-display text-2xl font-bold tabular-nums">
                    {kids}
                  </output>
                  <button
                    type="button"
                    onClick={() => setKids((k) => Math.min(maxChildren, k + 1))}
                    disabled={kids === maxChildren}
                    aria-label={c.inc}
                    className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-gold transition-colors hover:bg-gold/25 disabled:opacity-30"
                  >
                    <Plus size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-ink-muted">{c.total}</p>
                <m.p key={total} className="neon-gold mt-1 font-display text-4xl font-extrabold text-gold sm:text-5xl" aria-live="polite">
                  <AnimatedPrice value={total} />
                </m.p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
                  <Check size={15} className="shrink-0 text-sky" aria-hidden="true" />
                  {f(c.included)}
                </p>
              </div>
            </div>

            <p className="mt-5 flex items-start gap-3 rounded-2xl border border-sky/20 bg-sky/[0.06] p-4 text-[15px] leading-relaxed">
              <Lightbulb size={20} className="mt-0.5 shrink-0 text-sky" aria-hidden="true" />
              {c.tip}
            </p>

            <GoldButton href={waLink(waText)} size="lg" className="mt-6 w-full">
              <WhatsAppIcon size={20} />
              {f(c.cta, { total: formatPrice(total) })}
            </GoldButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
