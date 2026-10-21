import { m, useReducedMotion } from 'framer-motion'
import { ArrowRight, CircleDollarSign, Gavel, SearchCheck, Zap } from 'lucide-react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatPrice, nb } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { GreenCard } from './GreenCard'
import { StarField } from './StarField'
import { GoldButton, OutlineButton } from './ui/Buttons'
import { Countdown } from './ui/Countdown'
import { WhatsAppIcon } from './ui/Icons'

const PERK_ICONS = [CircleDollarSign, Zap, SearchCheck]

export function Hero() {
  const { t, f } = useTx()
  const reduce = useReducedMotion()
  const h = t.hero

  const item = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pb-16 pt-[104px] sm:pb-24 sm:pt-32 lg:min-h-[100svh] lg:pt-36">
      {/* небо */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_-10%,rgba(108,195,255,.22),transparent_60%)]" />
        <StarField />
        {/* золотое «солнце-монета» снизу */}
        <div className="absolute -bottom-[38vh] left-1/2 h-[70vh] w-[120vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(244,196,106,.38),rgba(200,147,46,.12)_55%,transparent)] blur-2xl lg:w-[80vw]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" />
      </div>

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
        <div>
          <m.p {...item(0)} className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.08] py-1.5 pl-2 pr-4 text-[13px] font-medium text-gold-glow">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/20">
              <Gavel size={13} className="text-gold" aria-hidden="true" />
            </span>
            <span>{f(h.badge, { date: f('{openDate}') })}</span>
          </m.p>

          <m.h1 {...item(1)} id="hero-title" className="mt-6 text-[34px] font-extrabold leading-[1.06] sm:text-5xl lg:text-[62px]">
            {nb(h.titleA)} <span className="text-gradient">{h.titleAccent}</span>
            {h.titleB && ` ${h.titleB}`}
          </m.h1>

          <m.p {...item(2)} className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {f(h.subtitle)}
          </m.p>

          <m.div {...item(3)} className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="neon-gold font-display text-4xl font-extrabold text-gold sm:text-5xl">{formatPrice(SITE.prices.single)}</span>
            <span className="text-sm text-ink-muted sm:text-base">· {h.priceNote}</span>
          </m.div>

          <m.div {...item(4)} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <GoldButton href={waLink(f(t.wa.general))} size="lg">
              <WhatsAppIcon size={20} />
              {h.ctaPrimary}
            </GoldButton>
            <OutlineButton href="#check" size="lg">
              {h.ctaSecondary}
              <ArrowRight size={18} aria-hidden="true" />
            </OutlineButton>
          </m.div>

          <m.ul {...item(5)} className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
            {h.perks.map((p, i) => {
              const Icon = PERK_ICONS[i]
              return (
                <li key={i} className="flex items-center gap-2 text-sm text-ink">
                  <Icon size={18} strokeWidth={1.6} className="text-sky" aria-hidden="true" />
                  {f(p)}
                </li>
              )
            })}
          </m.ul>

          <m.div {...item(6)} className="mt-9">
            <Countdown />
          </m.div>
        </div>

        <m.div
          initial={reduce ? false : { opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <GreenCard />
        </m.div>
      </div>
    </section>
  )
}
