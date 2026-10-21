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
    <section aria-labelledby="steps-title" className="section tone-dark">
      <div className="container-x grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading n="10" id="steps-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} />
        </div>

        <ol ref={ref} className="relative">
          {/* линия маршрута — заполняется при прокрутке */}
          <div aria-hidden="true" className="absolute bottom-4 left-[15px] top-4 w-px bg-line/15" />
          <m.div aria-hidden="true" className="absolute bottom-4 left-[15px] top-4 w-px origin-top bg-gold" style={{ scaleY: reduce ? 1 : fill }} />
          {s.items.map((it, i) => (
            <Reveal as="li" key={i} delay={i * 0.05} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7">
              <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/60 bg-night text-xs font-semibold text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1">
                <h3 className="text-lg font-semibold sm:text-xl">{it.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
