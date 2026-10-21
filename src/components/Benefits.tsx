import { useTx } from '../hooks/useTx'
import { DocNo } from './ui/Doc'
import { GuillocheRosette } from './ui/Guilloche'

/** «Что даёт грин-карта» — как разворот паспорта */
export function Benefits() {
  const { t } = useTx()
  const s = t.benefits
  const pages = [s.items.slice(0, 3), s.items.slice(3, 6)]

  return (
    <section aria-labelledby="benefits-title" className="border-t py-20 rule sm:py-28">
      <div className="w-wide">
        <DocNo n={8} label={t.sections.benefits} />
        <h2 id="benefits-title" className="h-section mt-8">
          {s.title}
        </h2>

        <div className="mt-12 grid md:grid-cols-2">
          {pages.map((items, p) => (
            <div
              key={p}
              className={`doc relative overflow-hidden px-6 pb-12 pt-6 sm:px-10 sm:pt-8 ${p === 0 ? 'md:border-r-0' : 'border-t-0 md:border-l md:border-t'}`}
            >
              {/* гильош на странице паспорта */}
              <GuillocheRosette className={`pointer-events-none absolute top-1/2 h-[420px] w-[420px] -translate-y-1/2 ${p === 0 ? '-right-40' : '-left-40'}`} opacity={0.4} />
              <p className="relative font-mono text-[12px] uppercase tracking-[0.1em] text-ink-2">{s.pages[p]}</p>
              <ol className="relative mt-6 space-y-7">
                {items.map((it, i) => (
                  <li key={i} className="grid grid-cols-[36px_1fr] gap-x-3">
                    <span className="font-mono text-[14px] text-ink-2">{String(p * 3 + i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-serif text-[22px] leading-snug">{it.title}</h3>
                      <p className="mt-1 text-[16px] text-ink-2">{it.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="absolute bottom-4 font-mono text-[12px] text-ink-2" style={p === 0 ? { left: 24 } : { right: 24 }}>
                {p + 2}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
