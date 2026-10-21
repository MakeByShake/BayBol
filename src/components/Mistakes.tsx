import type { CSSProperties } from 'react'
import { useTx } from '../hooks/useTx'
import { useInViewClass } from '../hooks/useInViewClass'
import { DocNo } from './ui/Doc'

// повороты «документов» и штампов — вручную, чтобы стопка выглядела естественно
const DOC_ROT = [-2.5, 1.8, -1.2, 2.4, -1.8]
const STAMP_ROT = [-14, 9, -6, 12, -10]

export function Mistakes() {
  const { t } = useTx()
  const m = t.mistakes
  const ref = useInViewClass<HTMLUListElement>()

  return (
    <section aria-labelledby="mistakes-title" className="overflow-hidden border-t py-20 rule sm:py-28">
      <div className="w-wide">
        <DocNo n={4} label={t.sections.mistakes} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <h2 id="mistakes-title" className="h-section">
            {m.title}
          </h2>
          <p className="max-w-[30rem] text-ink-2">{m.subtitle}</p>
        </div>
      </div>

      {/* стопка документов внахлёст; штампы «ударяют», когда стопка появилась на экране */}
      <ul ref={ref} className="stamps-group mx-auto mt-14 flex max-w-[1240px] flex-col px-4 sm:px-8 lg:flex-row lg:px-6">
        {m.items.map((it, i) => (
          <li
            key={i}
            className="doc relative -mt-3 min-h-[190px] p-5 first:mt-0 hover:!z-10 sm:p-6 lg:-ml-6 lg:mt-0 lg:min-h-[300px] lg:w-1/5 lg:first:ml-0"
            style={{ transform: `rotate(${DOC_ROT[i] * 0.6}deg)`, zIndex: i }}
          >
            {/* линовка бланка */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 bottom-6 top-20 bg-[repeating-linear-gradient(to_bottom,transparent_0_27px,rgba(20,33,58,.08)_27px_28px)]" />
            <p className="relative font-mono text-[12px] text-ink-2">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="relative mt-2 font-serif text-[21px] leading-snug">{it.title}</h3>
            <p className="relative mt-2 text-[15px] leading-relaxed text-ink-2">{it.text}</p>
            <span
              className="stamp absolute bottom-5 right-5 border-stamp text-stamp lg:bottom-8"
              style={{ '--rot': `${STAMP_ROT[i]}deg`, animationDelay: `${i * 90}ms` } as CSSProperties}
            >
              {m.stamp}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
