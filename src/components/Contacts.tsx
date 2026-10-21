import { ArrowUpRight } from 'lucide-react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { waLink } from '../lib/whatsapp'
import { InstagramIcon, WhatsAppIcon } from './ui/Icons'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Contacts() {
  const { t, f, lang } = useTx()
  const c = t.contacts
  const q = encodeURIComponent(SITE.company.mapQuery)
  const maps = [
    { label: c.open2gis, href: `https://2gis.kz/almaty/search/${q}` },
    { label: c.openGmaps, href: `https://www.google.com/maps/search/?api=1&query=${q}` },
  ]
  const rows = [
    ...SITE.whatsapp.map((w, i) => ({
      label: `${f(c.manager, { n: i + 1 })} · WhatsApp`,
      value: w.display,
      href: waLink(f(t.wa.manager), i),
      icon: <WhatsAppIcon size={18} className="text-wa" />,
    })),
    { label: c.instagram, value: SITE.instagram.handle, href: SITE.instagram.url, icon: <InstagramIcon size={18} className="text-accent" /> },
  ]

  return (
    <section id="contacts" aria-labelledby="contacts-title" className="section tone-dark2">
      <div className="container-x">
        <SectionHeading n="15" id="contacts-title" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <ul className="border-t border-line/15">
              {rows.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 border-b border-line/10 py-5 transition-colors hover:bg-line/[0.03]"
                  >
                    <span className="shrink-0">{r.icon}</span>
                    <span className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <span className="text-sm text-ink-muted">{r.label}</span>
                      <span className="text-lg font-semibold tracking-tight sm:text-xl">{r.value}</span>
                    </span>
                    <ArrowUpRight size={18} className="shrink-0 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.06}>
            <dl className="space-y-6">
              <div>
                <dt className="label">{c.address}</dt>
                <dd className="mt-2 text-lg font-medium">{SITE.company.address[lang]}</dd>
              </div>
              <div>
                <dt className="label">{c.hours}</dt>
                <dd className="mt-2 text-lg font-medium">{SITE.workHours[lang]}</dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-col gap-2.5 min-[480px]:flex-row lg:flex-col xl:flex-row">
              {maps.map((mp) => (
                <a
                  key={mp.href}
                  href={mp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] border border-line/20 px-4 text-[15px] font-semibold transition-colors hover:border-line/40"
                >
                  {mp.label}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
