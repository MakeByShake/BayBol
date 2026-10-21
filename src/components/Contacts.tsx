import { ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { waLink } from '../lib/whatsapp'
import { GlowCard } from './ui/GlowCard'
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

  return (
    <section id="contacts" aria-labelledby="contacts-title" className="section bg-night-2">
      <div className="container-x">
        <SectionHeading id="contacts-title" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} />

        <div className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-3">
          {SITE.whatsapp.map((w, i) => (
            <Reveal key={w.number} delay={i * 0.06}>
              <a href={waLink(f(t.wa.manager), i)} target="_blank" rel="noopener noreferrer" className="block h-full rounded-3xl">
                <GlowCard glow="sky" className="h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-wa/15 text-wa">
                      <WhatsAppIcon size={24} />
                    </span>
                    <ArrowUpRight size={20} className="text-ink-muted transition-colors group-hover:text-ink" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-sm text-ink-muted">{f(c.manager, { n: i + 1 })} · WhatsApp</p>
                  <p className="mt-1 font-display text-xl font-semibold tracking-tight">{w.display}</p>
                </GlowCard>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.12}>
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="block h-full rounded-3xl">
              <GlowCard glow="gold" className="h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-gold/25 to-coral/20 text-gold">
                    <InstagramIcon size={24} />
                  </span>
                  <ArrowUpRight size={20} className="text-ink-muted transition-colors group-hover:text-ink" aria-hidden="true" />
                </div>
                <p className="mt-5 text-sm text-ink-muted">{c.instagram}</p>
                <p className="mt-1 font-display text-xl font-semibold tracking-tight">{SITE.instagram.handle}</p>
              </GlowCard>
            </a>
          </Reveal>
        </div>

        <Reveal className="mt-4">
          <div className="glass grid gap-6 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div className="space-y-5">
              <div className="flex gap-4">
                <MapPin size={22} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <div>
                  <p className="text-sm text-ink-muted">{c.address}</p>
                  <p className="mt-1 text-base font-medium sm:text-lg">{SITE.company.address[lang]}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock size={22} className="mt-0.5 shrink-0 text-sky" aria-hidden="true" />
                <div>
                  <p className="text-sm text-ink-muted">{c.hours}</p>
                  <p className="mt-1 text-base font-medium sm:text-lg">{SITE.workHours[lang]}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {maps.map((mp) => (
                <a
                  key={mp.href}
                  href={mp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-[15px] font-semibold transition-colors hover:border-sky/40 hover:bg-sky/[0.08]"
                >
                  <MapPin size={17} className="text-sky" aria-hidden="true" />
                  {mp.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
