import { m, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { forwardRef, useRef } from 'react'
import { useTx } from '../hooks/useTx'
import { waLink } from '../lib/whatsapp'
import { GoldButton } from './ui/Buttons'
import { Countdown } from './ui/Countdown'

/** Финальный призыв. Здесь «приземляется» самолётик маршрута (точка landing) */
export const FinalCta = forwardRef<HTMLDivElement>(function FinalCta(_, landingRef) {
  const { t, f } = useTx()
  const c = t.finalCta
  const reduce = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const inView = useInView(boxRef, { once: true, margin: '0px 0px -35% 0px' })

  return (
    <section aria-labelledby="final-title" className="section tone-dark overflow-hidden">
      <div ref={boxRef} className="container-x relative pt-16 text-center sm:pt-20">
        {/* мягкое золотое свечение в момент «посадки» */}
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(244,196,106,.28),rgba(244,196,106,.06)_45%,transparent_70%)]"
          style={{ x: '-50%', y: '-50%' }}
          initial={reduce ? false : { scale: 0.3, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
        {/* точка посадки */}
        <div ref={landingRef} aria-hidden="true" className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />

        <div className="relative">
          <h2 id="final-title" className="mx-auto max-w-3xl text-[30px] font-semibold leading-[1.1] sm:text-5xl lg:text-[56px]">
            {c.title} <span className="accent-word">{c.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">{c.text}</p>
          <div className="mt-9">
            <Countdown align="center" />
          </div>
          <GoldButton href={waLink(f(t.wa.general))} size="lg" className="mt-9 w-full min-[480px]:w-auto">
            {c.btn}
            <ArrowUpRight size={18} aria-hidden="true" />
          </GoldButton>
        </div>
      </div>
    </section>
  )
})
