import { useTx } from '../hooks/useTx'
import { DocNo } from './ui/Doc'
import { Seal } from './ui/Seal'

/** Гарантии — как пункты договора с печатью */
export function Guarantees() {
  const { t, f } = useTx()
  const g = t.guarantees
  return (
    <section aria-labelledby="guarantees-title" className="border-t py-20 rule sm:py-28">
      <div className="w-text">
        <DocNo n={13} label={t.sections.guarantees} />
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <h2 id="guarantees-title" className="h-section">
              {g.title}
            </h2>
            <p className="mt-6 max-w-[34rem] text-ink-2">{g.subtitle}</p>
            <ol className="mt-10 space-y-6 border-l border-ink pl-6">
              {g.items.map((it, i) => (
                <li key={i} className="grid grid-cols-[32px_1fr] gap-x-2">
                  <span className="font-serif text-[22px] leading-none">{i + 1}.</span>
                  <p className="font-serif text-[19px] leading-relaxed">{f(it)}</p>
                </li>
              ))}
            </ol>
          </div>
          <Seal text={`BAYBOL VISA SUPPORT • ${g.seal.toUpperCase()} • `} center={g.seal} className="h-36 w-36 rotate-[8deg] md:mt-28 md:h-44 md:w-44" />
        </div>
      </div>
    </section>
  )
}
