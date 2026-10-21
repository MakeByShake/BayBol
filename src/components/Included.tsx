import { DV } from '../config/dv'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatDate, formatPrice } from '../lib/format'
import { Barcode } from './ui/Barcode'
import { DocNo } from './ui/Doc'

/** «Что вы получаете» — чек-лист услуг, как квитанция */
export function Included() {
  const { t, f } = useTx()
  const s = t.included

  return (
    <section id="included" aria-labelledby="included-title" className="border-t py-20 rule sm:py-28">
      <div className="w-wide">
        <DocNo n={6} label={t.sections.included} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div>
            <h2 id="included-title" className="h-section max-w-[12ch]">
              {f(s.title)}
            </h2>
            <p className="mt-6 max-w-[26rem] text-ink-2">{s.subtitle}</p>
          </div>

          {/* квитанция */}
          <div className="ticket-edge mx-auto w-full max-w-[460px] rotate-[0.8deg] lg:mx-0">
            <div className="receipt px-6 pb-10 pt-10 font-mono text-[14px] sm:px-8">
              <p className="text-center text-[16px] font-semibold uppercase tracking-[0.14em]">{s.receipt}</p>
              <p className="mt-1 text-center text-[12px] text-ink-2">
                {s.receiptSub}, {formatDate(DV.factsCheckedAt, 'numeric', t)}
              </p>
              <ul className="mt-6 space-y-3 border-t border-dashed pt-5 rule">
                {s.rows.map(([label, value], i) => (
                  <li key={i} className="leader">
                    <span className="min-w-0 font-sans text-[15px] leading-snug">{f(label)}</span>
                    <span aria-hidden="true" className="fill" />
                    <span className="shrink-0 text-[13px] text-ink-2">{value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t-2 border-double border-ink pt-4">
                <p className="leader text-[16px] font-semibold">
                  <span>{s.total}</span>
                  <span aria-hidden="true" className="fill" />
                  <span className="whitespace-nowrap text-[22px]">{formatPrice(SITE.prices.single)}</span>
                </p>
                <p className="mt-1 text-right text-[12px] text-ink-2">{s.per}</p>
              </div>
              <Barcode seed={11} className="mx-auto mt-6 h-10 w-48" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
