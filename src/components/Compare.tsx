import { Check, Minus } from 'lucide-react'
import { useState } from 'react'
import { useTx } from '../hooks/useTx'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Compare() {
  const { t, f } = useTx()
  const c = t.compare
  const [view, setView] = useState<'self' | 'us'>('us')

  return (
    <section aria-labelledby="compare-title" className="section tone-dark">
      <div className="container-x">
        <SectionHeading n="07" id="compare-title" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} />

        {/* Планшет и десктоп: таблица */}
        <Reveal className="mt-12 hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line/15">
                <th scope="col" className="label w-[26%] pb-4 pr-4 font-semibold">
                  {c.criterion}
                </th>
                <th scope="col" className="label w-[37%] px-4 pb-4 font-semibold">
                  {c.self}
                </th>
                <th scope="col" className="w-[37%] rounded-t-lg bg-gold/[0.07] px-5 pb-4 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  {c.us}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r, i) => (
                <tr key={i} className="border-b border-line/10">
                  <th scope="row" className="py-5 pr-4 text-[15px] font-semibold">
                    {f(r.label)}
                  </th>
                  <td className="px-4 py-5">
                    <span className="flex items-center gap-2.5 text-ink-muted">
                      <Minus size={16} className="shrink-0 text-coral" aria-hidden="true" />
                      {r.self}
                    </span>
                  </td>
                  <td className="bg-gold/[0.07] px-5 py-5">
                    <span className="flex items-center gap-2.5 font-medium">
                      <Check size={16} className="shrink-0 text-accent" aria-hidden="true" />
                      {r.us}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* Мобильный: переключатель «Сами / С нами» */}
        <Reveal className="mt-10 md:hidden">
          <div role="tablist" aria-label={c.title} className="grid grid-cols-2 rounded-[10px] border border-line/15 p-1">
            {(['self', 'us'] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={view === k}
                aria-controls="compare-panel"
                onClick={() => setView(k)}
                className={`h-11 rounded-md text-sm font-semibold transition-colors ${
                  view === k ? (k === 'us' ? 'bg-gold text-night' : 'bg-line/15 text-ink') : 'text-ink-muted'
                }`}
              >
                {k === 'self' ? c.self : c.us}
              </button>
            ))}
          </div>

          <div id="compare-panel" role="tabpanel">
          <ul className="mt-4 border-t border-line/10">
            {c.rows.map((r, i) => (
              <li key={i} className="flex items-start gap-3 border-b border-line/10 py-4">
                {view === 'us' ? (
                  <Check size={16} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                ) : (
                  <Minus size={16} className="mt-1 shrink-0 text-coral" aria-hidden="true" />
                )}
                <div>
                  <p className="label">{f(r.label)}</p>
                  <p className={`mt-1 text-[15px] ${view === 'us' ? 'font-medium' : 'text-ink-muted'}`}>{view === 'us' ? r.us : r.self}</p>
                </div>
              </li>
            ))}
          </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
