import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { useTx } from '../hooks/useTx'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Faq() {
  const { t, f } = useTx()
  const s = t.faq
  const [open, setOpen] = useState<number | null>(0)
  const reduce = useReducedMotion()
  const uid = useId()

  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-night-2/60">
      <div className="container-x">
        <SectionHeading id="faq-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} />
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <ul className="space-y-3">
            {s.items.map((it, i) => {
              const isOpen = open === i
              const btnId = `${uid}-b${i}`
              const panelId = `${uid}-p${i}`
              return (
                <li key={i} className={`glass overflow-hidden transition-colors ${isOpen ? 'border-sky/25' : ''}`}>
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-sans text-base font-semibold sm:px-6 sm:text-[17px]"
                    >
                      <span>{f(it.q)}</span>
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                          isOpen ? 'rotate-45 border-gold/50 bg-gold/15 text-gold' : 'border-white/10 text-ink-muted'
                        }`}
                      >
                        <Plus size={18} aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-muted sm:px-6 sm:text-base">{f(it.a)}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
