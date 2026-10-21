import { DV } from '../config/dv'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatDate } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { Logo } from './ui/Logo'

const YEAR = new Date().getFullYear()

export function Footer({ onPrivacy }: { onPrivacy: () => void }) {
  const { t, f, lang } = useTx()
  const ft = t.footer

  return (
    <footer className="bg-[#05080F] pb-28 pt-14 lg:pb-12">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo className="h-9 w-auto" />
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">
              {SITE.company.legalName}
              <br />
              {ft.bin}: {SITE.company.bin}
            </p>
          </div>
          <div className="text-sm leading-relaxed text-ink-muted">
            <p className="label mb-3">{t.contacts.address}</p>
            <p>{SITE.company.address[lang]}</p>
            <p className="mt-1">{SITE.workHours[lang]}</p>
          </div>
          <div className="text-sm">
            <p className="label mb-3">{ft.phones}</p>
            <ul className="space-y-1.5">
              {SITE.whatsapp.map((w, i) => (
                <li key={w.number}>
                  <a href={waLink(f(t.wa.manager), i)} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-link">
                    {w.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-link">
                  Instagram {SITE.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-3 border-t border-white/[0.07] pt-8 text-xs leading-relaxed text-ink-muted">
          <p className="max-w-4xl">{f(ft.disclaimer)}</p>
          <p>
            {f(ft.facts, {
              checked: formatDate(DV.factsCheckedAt, 'numeric', t),
              courtDate: formatDate(DV.courtDate, 'numeric', t),
            })}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <p>{f(ft.rights, { year: YEAR, brand: SITE.brand })}</p>
            <button type="button" onClick={onPrivacy} className="font-medium text-link underline-offset-4 hover:underline">
              {ft.privacy}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
