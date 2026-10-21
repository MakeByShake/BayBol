import { useState } from 'react'
import { useTx } from '../hooks/useTx'
import { DocNo } from './ui/Doc'
import { InkCheck } from './ui/Icons'

export function Compare() {
  const { t, f } = useTx()
  const c = t.compare
  const [view, setView] = useState<'self' | 'us'>('us')

  return (
    <section aria-labelledby="compare-title" className="border-t py-20 rule sm:py-28">
      <div className="w-text">
        <DocNo n={7} label={t.sections.compare} />
        <h2 id="compare-title" className="h-section mt-8 max-w-[16ch]">
          {c.title}
        </h2>

        {/* документ-таблица (с 768px) */}
        <table className="mt-12 hidden w-full border-y border-ink text-left md:table">
          <thead>
            <tr className="border-b rule">
              <th scope="col" className="w-[28%] py-3 pr-4 text-[14px] font-medium text-ink-2">
                {c.criterion}
              </th>
              <th scope="col" className="w-[36%] py-3 pr-4 text-[14px] font-medium text-ink-2">
                {c.self}
              </th>
              <th scope="col" className="py-3 text-[14px] font-semibold text-ink">
                {c.us}
              </th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r, i) => (
              <tr key={i} className="border-b rule last:border-b-0">
                <th scope="row" className="py-4 pr-4 align-top font-medium">
                  {f(r.label)}
                </th>
                <td className="py-4 pr-4 align-top text-ink-2">{r.self}</td>
                <td className="py-4 align-top">
                  <span className="flex items-start gap-2">
                    <InkCheck className="mt-1 h-[18px] w-[18px] shrink-0 text-gold-ink" />
                    {r.us}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* телефон: две вкладки */}
        <div className="mt-10 md:hidden">
          <div role="tablist" aria-label={c.title} className="flex border-b border-ink">
            {(['us', 'self'] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={view === k}
                aria-controls="compare-panel"
                onClick={() => setView(k)}
                className={`-mb-px min-h-[48px] flex-1 border-b-2 text-[15px] ${view === k ? 'border-gold font-semibold text-ink' : 'border-transparent text-ink-2'}`}
              >
                {k === 'us' ? c.us : c.self}
              </button>
            ))}
          </div>
          <div id="compare-panel" role="tabpanel">
            <ul>
              {c.rows.map((r, i) => (
                <li key={i} className="border-b py-4 rule">
                  <p className="text-[14px] text-ink-2">{f(r.label)}</p>
                  <p className={`mt-1 flex items-start gap-2 ${view === 'us' ? 'text-ink' : 'text-ink-2'}`}>
                    {view === 'us' && <InkCheck className="mt-1 h-[18px] w-[18px] shrink-0 text-gold-ink" />}
                    {view === 'us' ? r.us : r.self}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
