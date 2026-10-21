import { useTx } from '../hooks/useTx'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Included() {
  const { t, f } = useTx()
  const s = t.included
  return (
    <section id="included" aria-labelledby="included-title" className="section tone-dark2">
      <div className="container-x">
        <SectionHeading n="06" id="included-title" eyebrow={s.eyebrow} title={f(s.title)} accent={f(s.titleAccent)} />
        {/* сетка-«таблица»: рамки складываются в общую сетку при любом числе колонок */}
        <Reveal as="div" className="mt-12">
          <ul className="grid border-l border-t border-line/10 sm:grid-cols-2 lg:grid-cols-3">
            {s.items.map((it, i) => (
              <li key={i} className="border-b border-r border-line/10 p-6 sm:p-7">
                <span className={`text-xs font-semibold ${i === 1 ? 'text-accent' : 'text-ink-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 text-lg font-semibold sm:mt-10">{f(it.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{f(it.text)}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
