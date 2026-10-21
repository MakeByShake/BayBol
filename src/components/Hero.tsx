import { m, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatPrice } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { GreenCard } from './GreenCard'
import { StarField } from './StarField'
import { GoldButton, OutlineButton } from './ui/Buttons'
import { Countdown } from './ui/Countdown'

export function Hero() {
  const { t, f } = useTx()
  const reduce = useReducedMotion()
  const h = t.hero

  const item = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section id="top" aria-labelledby="hero-title" className="tone-dark relative overflow-hidden pt-[100px] sm:pt-28 lg:pt-32">
      {/* ночное небо — едва заметно */}
      <div aria-hidden="true" className="absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_80%_0%,rgba(46,143,214,.16),transparent_65%)]" />
        <StarField density={0.00007} />
      </div>

      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
          <div>
            <m.p {...item(0)} className="label flex items-start gap-3 leading-relaxed sm:items-center">
              <span aria-hidden="true" className="mt-2 h-px w-8 shrink-0 bg-gold sm:mt-0" />
              <span>{f(h.badge, { date: f('{openDate}') })}</span>
            </m.p>

            <m.h1 {...item(1)} id="hero-title" className="mt-6 text-[36px] font-semibold leading-[1.05] min-[400px]:text-[40px] sm:text-[52px] lg:text-[60px] xl:text-[66px]">
              {h.titleA} <span className="accent-word">{h.titleAccent}</span>
              {h.titleB && ` ${h.titleB}`}
            </m.h1>

            <m.p {...item(2)} className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {f(h.subtitle)}
            </m.p>

            <m.div {...item(3)} className="mt-7 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
              <GoldButton href={waLink(f(t.wa.general))} size="lg">
                {h.ctaPrimary} · {formatPrice(SITE.prices.single)}
                <ArrowUpRight size={18} aria-hidden="true" />
              </GoldButton>
              <OutlineButton href="#check" size="lg">
                {h.ctaSecondary}
              </OutlineButton>
            </m.div>
            <m.p {...item(4)} className="mt-3 text-sm text-ink-muted">
              {formatPrice(SITE.prices.single)} — {h.priceNote}
            </m.p>

            <m.div {...item(5)} className="mt-9">
              <Countdown />
            </m.div>
          </div>

          <m.div
            className="mx-auto w-full max-w-[440px] lg:max-w-none"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <GreenCard />
          </m.div>
        </div>

        {/* три преимущества — строкой под первым экраном, как в документе */}
        <ul className="mt-14 grid border-t border-line/10 sm:grid-cols-3 lg:mt-20">
          {h.perks.map((p, i) => (
            <li
              key={i}
              className={`flex items-baseline gap-3 py-5 sm:py-6 ${i ? 'border-t border-line/10 sm:border-l sm:border-t-0 sm:pl-6' : ''} ${i < 2 ? 'sm:pr-6' : ''}`}
            >
              <span className="text-xs font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[15px] font-medium">{f(p)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
