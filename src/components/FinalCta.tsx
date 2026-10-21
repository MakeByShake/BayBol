import { m, useInView, useReducedMotion } from 'framer-motion'
import { forwardRef, useRef } from 'react'
import { useTx } from '../hooks/useTx'
import { waLink } from '../lib/whatsapp'
import { GoldButton } from './ui/Buttons'
import { Countdown } from './ui/Countdown'
import { WhatsAppIcon } from './ui/Icons'

/** Финальный призыв. Здесь «приземляется» самолётик маршрута (точка landing) */
export const FinalCta = forwardRef<HTMLDivElement>(function FinalCta(_, landingRef) {
  const { t, f } = useTx()
  const c = t.finalCta
  const reduce = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const inView = useInView(boxRef, { once: true, margin: '0px 0px -35% 0px' })

  return (
    <section aria-labelledby="final-title" className="section overflow-hidden">
      <div className="container-x">
        <div ref={boxRef} className="glass border-gradient relative overflow-hidden px-5 pb-12 pt-20 text-center sm:px-10 sm:pb-16 sm:pt-24">
          {/* золотая вспышка при «посадке» */}
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-10 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,226,168,.7)_0%,rgba(244,196,106,.32)_22%,rgba(200,147,46,.1)_48%,transparent_70%)]"
            style={{ x: '-50%', y: '-50%' }}
            initial={reduce ? false : { scale: 0.2, opacity: 0 }}
            animate={inView ? { scale: [0.2, 1.25, 1], opacity: [0, 1, 0.55] } : {}}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-sky/15 blur-3xl" />

          {/* точка посадки */}
          <div ref={landingRef} aria-hidden="true" className="absolute left-1/2 top-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_24px_6px_rgba(244,196,106,.6)]" />

          <div className="relative">
            <h2 id="final-title" className="mx-auto max-w-3xl text-[30px] font-extrabold leading-[1.1] sm:text-5xl">
              {c.title} <span className="text-gradient">{c.titleAccent}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">{c.text}</p>
            <div className="mt-9">
              <Countdown align="center" />
            </div>
            <GoldButton href={waLink(f(t.wa.general))} size="lg" className="mt-9 w-full sm:w-auto">
              <WhatsAppIcon size={22} />
              {c.btn}
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  )
})
