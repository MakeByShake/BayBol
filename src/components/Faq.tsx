import { useId, useState } from 'react'
import { useTx } from '../hooks/useTx'
import { DocNo } from './ui/Doc'

export function Faq() {
  const { t, f } = useTx()
  const s = t.faq
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t py-20 rule sm:py-28">
      <div className="w-wide">
        <DocNo n={14} label={t.sections.faq} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 id="faq-title" className="h-section lg:sticky lg:top-24 lg:self-start">
            {s.title}
          </h2>
          <ul className="border-t border-ink">
            {s.items.map((it, i) => {
              const isOpen = open === i
              return (
                <li key={i} className="border-b rule">
                  <h3>
                    <button
                      id={`${uid}-b${i}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${uid}-p${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="grid min-h-[56px] w-full grid-cols-[48px_1fr_24px] items-baseline gap-x-3 py-5 text-left sm:grid-cols-[64px_1fr_24px]"
                    >
                      <span className="font-serif text-[30px] font-light leading-none text-ink-2 sm:text-[38px]">{i + 1}</span>
                      <span className="text-[17px] font-medium sm:text-[18px]">{f(it.q)}</span>
                      <span aria-hidden="true" className="text-right font-mono text-[20px]">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${uid}-p${i}`}
                    role="region"
                    aria-labelledby={`${uid}-b${i}`}
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden" inert={!isOpen}>
                      <p className="pb-6 pl-[60px] pr-8 text-ink-2 sm:pl-[76px]">{f(it.a)}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
