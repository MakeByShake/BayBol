import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useRef } from 'react'
import { useTx } from '../hooks/useTx'
import { DocNo } from './ui/Doc'

/** «Как это работает» — маршрут на карте: линия прорисовывается при прокрутке, самолёт едет к конечной точке */
export function How() {
  const { t } = useTx()
  const h = t.how
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })
  const p = reduce ? 1 : progress
  const pos = useTransform(progress, (v) => `${(reduce ? 1 : v) * 100}%`)

  return (
    <section aria-labelledby="how-title" className="border-t py-20 rule sm:py-28">
      <div className="w-full-x">
        <DocNo n={10} label={t.sections.how} />
        <h2 id="how-title" className="h-section mt-8">
          {h.title}
        </h2>

        <div ref={ref} className="relative mt-14">
          {/* горизонтальный маршрут (с 768px) */}
          <div aria-hidden="true" className="relative mx-[12.5%] hidden h-10 md:block">
            <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-sky/40" />
            <m.div className="absolute inset-x-0 top-1/2 origin-left border-t-2 border-dashed border-sky-ink" style={{ scaleX: p }} />
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-paper" style={{ left: `${(i / 3) * 100}%` }} />
            ))}
            <m.span className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-[130%] text-sky-ink" style={{ left: pos }}>
              <Plane size={26} strokeWidth={1.5} className="rotate-45" />
            </m.span>
          </div>

          <div className="relative">
            {/* вертикальный маршрут (телефон) */}
            <div aria-hidden="true" className="absolute bottom-10 left-[7px] top-2 md:hidden">
              <div className="absolute inset-y-0 border-l-2 border-dashed border-sky/40" />
              <m.div className="absolute inset-y-0 origin-top border-l-2 border-dashed border-sky-ink" style={{ scaleY: p }} />
              <m.span className="absolute left-0 z-10 -translate-x-1/2 -translate-y-1/2 bg-paper py-1 text-sky-ink" style={{ top: pos }}>
                <Plane size={22} strokeWidth={1.5} className="rotate-[135deg]" />
              </m.span>
            </div>

            <ol className="grid gap-10 md:mt-6 md:grid-cols-4 md:gap-6">
              {h.stops.map((s, i) => (
                <li key={i} className="relative pl-10 md:pl-0 md:text-center">
                  <span aria-hidden="true" className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-ink bg-paper md:hidden" />
                  <p className="font-mono text-[13px] text-ink-2">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 font-serif text-[22px] leading-snug">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-[22rem] text-[15px] text-ink-2">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
