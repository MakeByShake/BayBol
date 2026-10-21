import { m, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { useTx } from '../hooks/useTx'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Steps() {
  const { t } = useTx()
  const s = t.steps
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section aria-labelledby="steps-title" className="section bg-night-2/60">
      <div className="container-x">
        <SectionHeading id="steps-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} />

        <ol ref={ref} className="relative mx-auto mt-14 max-w-2xl">
          {/* линия маршрута */}
          <div aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-px border-l-2 border-dashed border-sky/20" />
          <m.div
            aria-hidden="true"
            className="absolute bottom-6 left-[26px] top-6 w-[3px] origin-top rounded-full bg-gradient-to-b from-gold to-sky"
            style={{ scaleY: reduce ? 1 : fill }}
          />
          {s.items.map((it, i) => (
            <Reveal as="li" key={i} delay={i * 0.06} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7">
              <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-night font-display text-xl font-bold text-gold shadow-[0_0_30px_-6px_rgba(244,196,106,.5)]">
                {i + 1}
              </span>
              <div className="glass flex-1 p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
