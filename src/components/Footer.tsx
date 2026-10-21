import { DV } from '../config/dv'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { Logo } from './ui/Logo'

const YEAR = new Date().getFullYear()

/** Подвал на бумаге: слева логотип, реквизиты и дисклеймер, справа контакты */
export function Footer({ onPrivacy }: { onPrivacy: () => void }) {
  const { t, f, lang } = useTx()
  const ft = t.footer
  const c = t.contacts
  const q = encodeURIComponent(SITE.company.mapQuery)

  return (
    <footer id="contacts" className="border-t border-ink pb-28 pt-14 lg:pb-12">
      <div className="w-full-x grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div>
          <Logo className="h-8 w-auto" />
          <p className="mt-6 font-mono text-[13px] leading-relaxed text-ink-2">
            {SITE.company.legalName}
            <br />
            {ft.bin} {SITE.company.bin}
            <br />
            {SITE.company.address[lang]}
          </p>
          <p className="mt-6 max-w-[40rem] text-[14px] leading-relaxed text-ink-2">{f(ft.disclaimer)}</p>
        </div>

        <div>
          <h2 className="font-serif text-[30px] font-light">{c.title}</h2>
          <ul className="mt-5 border-t rule">
            {SITE.whatsapp.map((w, i) => (
              <li key={w.number} className="border-b rule">
                <a href={waLink(f(t.wa.manager), i)} target="_blank" rel="noopener noreferrer" className="leader min-h-[52px] items-center py-3 hover:text-sky-ink">
                  <span className="text-[15px] text-ink-2">
                    {f(c.manager, { n: i + 1 })}, WhatsApp
                  </span>
                  <span aria-hidden="true" className="fill" />
                  <span className="whitespace-nowrap font-mono text-[16px] font-medium">{w.display}</span>
                </a>
              </li>
            ))}
            <li className="border-b rule">
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="leader min-h-[52px] items-center py-3 hover:text-sky-ink">
                <span className="text-[15px] text-ink-2">{c.instagram}</span>
                <span aria-hidden="true" className="fill" />
                <span className="font-mono text-[16px] font-medium">{SITE.instagram.handle}</span>
              </a>
            </li>
          </ul>
          <dl className="mt-6 space-y-2 text-[15px]">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink-2">{c.hours}:</dt>
              <dd>{SITE.workHours[lang]}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink-2">{c.maps}:</dt>
              <dd className="flex gap-4">
                <a href={`https://2gis.kz/almaty/search/${q}`} target="_blank" rel="noopener noreferrer" className="link">
                  {c.open2gis}
                </a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="link">
                  {c.openGmaps}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="w-full-x mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5 font-mono text-[12px] text-ink-2 rule">
          <p>
            {f(ft.facts, {
              checked: formatDate(DV.factsCheckedAt, 'numeric', t),
              courtDate: formatDate(DV.courtDate, 'numeric', t),
            })}
          </p>
          <p className="flex items-center gap-5">
            <span>{f(ft.rights, { year: YEAR, brand: SITE.brand })}</span>
            <button type="button" onClick={onPrivacy} className="min-h-[44px] underline underline-offset-4 hover:text-ink">
              {ft.privacy}
            </button>
          </p>
        </div>
      </div>
    </footer>
  )
}
