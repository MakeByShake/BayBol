import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useTx } from '../hooks/useTx'
import { LogoMark } from './ui/Logo'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Compare() {
  const { t, f } = useTx()
  const c = t.compare
  const reduce = useReducedMotion()
  const [view, setView] = useState<'self' | 'us'>('us')

  return (
    <section aria-labelledby="compare-title" className="section">
      <div className="container-x">
        <SectionHeading id="compare-title" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} />

        {/* Десктоп: таблица */}
        <Reveal className="mx-auto mt-12 hidden max-w-4xl md:block">
          <div className="glass overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th scope="col" className="w-[28%] px-6 py-5 text-sm font-medium text-ink-muted">
                    {c.criterion}
                  </th>
                  <th scope="col" className="w-[36%] px-6 py-5 font-display text-base font-semibold text-ink-muted">
                    {c.self}
                  </th>
                  <th scope="col" className="w-[36%] bg-gold/[0.06] px-6 py-5">
                    <span className="flex items-center gap-2 font-display text-base font-semibold text-gold">
                      <LogoMark size={22} />
                      {c.us}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r, i) => (
                  <tr key={i} className="border-b border-white/[0.04] last:border-0">
                    <th scope="row" className="px-6 py-5 font-display text-[15px] font-semibold">
                      {f(r.label)}
                    </th>
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-2.5 text-ink-muted">
                        <X size={18} className="shrink-0 text-coral" aria-hidden="true" />
                        {r.self}
                      </span>
                    </td>
                    <td className="bg-gold/[0.06] px-6 py-5">
                      <span className="flex items-center gap-2.5 font-medium text-ink">
                        <Check size={18} className="shrink-0 text-gold" aria-hidden="true" />
                        {r.us}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Мобильный: переключатель «Сами / С нами» */}
        <Reveal className="mx-auto mt-10 max-w-md md:hidden">
          <div role="tablist" aria-label={c.title} className="relative grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
            <span
              aria-hidden="true"
              className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ${
                view === 'us' ? 'left-[calc(50%+0px)] bg-gold' : 'left-1 bg-white/15'
              }`}
            />
            {(['self', 'us'] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={view === k}
                aria-controls="compare-panel"
                onClick={() => setView(k)}
                className={`relative h-11 rounded-full text-sm font-semibold transition-colors ${
                  view === k ? (k === 'us' ? 'text-night' : 'text-ink') : 'text-ink-muted'
                }`}
              >
                {k === 'self' ? c.self : c.us}
              </button>
            ))}
          </div>

          <div id="compare-panel" role="tabpanel" className="mt-4">
            <AnimatePresence mode="wait" initial={false}>
              <m.ul
                key={view}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-2.5"
              >
                {c.rows.map((r, i) => (
                  <li
                    key={i}
                    className={`glass flex items-start gap-3 p-4 ${view === 'us' ? 'border-gold/25' : ''}`}
                  >
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                        view === 'us' ? 'bg-gold/15 text-gold' : 'bg-coral/10 text-coral'
                      }`}
                    >
                      {view === 'us' ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">{f(r.label)}</p>
                      <p className={`mt-0.5 text-[15px] ${view === 'us' ? 'font-medium text-ink' : 'text-ink-muted'}`}>
                        {view === 'us' ? r.us : r.self}
                      </p>
                    </div>
                  </li>
                ))}
              </m.ul>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
