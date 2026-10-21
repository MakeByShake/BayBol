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
    <section id="faq" aria-labelledby="faq-title" className="section tone-light">
      <div className="container-x grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading n="14" id="faq-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} />
        </div>
        <Reveal>
          <ul className="border-t border-line/15">
            {s.items.map((it, i) => {
              const isOpen = open === i
              const btnId = `${uid}-b${i}`
              const panelId = `${uid}-p${i}`
              return (
                <li key={i} className="border-b border-line/10">
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-baseline gap-4 py-5 text-left text-base font-semibold sm:text-[17px]"
                    >
                      <span className="w-6 shrink-0 text-xs font-semibold text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
                      <span className="flex-1">{f(it.q)}</span>
                      <Plus size={18} className={`shrink-0 self-center transition-transform duration-300 ${isOpen ? 'rotate-45 text-accent' : 'text-ink-muted'}`} aria-hidden="true" />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        className="overflow-hidden"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="pb-6 pl-10 pr-8 text-[15px] leading-relaxed text-ink-muted sm:text-base">{f(it.a)}</p>
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
