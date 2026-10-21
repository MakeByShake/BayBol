import { ArrowUpRight, BadgeCheck, Building, Camera, MapPin, Users } from 'lucide-react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { GlowCard } from './ui/GlowCard'
import { InstagramIcon } from './ui/Icons'
import { PhotoSlot } from './ui/PhotoSlot'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function Trust() {
  const { t, f, lang } = useTx()
  const s = t.trust
  const vars = {
    legal: SITE.company.legalName,
    bin: SITE.company.bin,
    address: SITE.company.address[lang],
    handle: SITE.instagram.handle,
  }
  const icons = [
    <BadgeCheck key="0" size={22} strokeWidth={1.6} aria-hidden="true" />,
    <MapPin key="1" size={22} strokeWidth={1.6} aria-hidden="true" />,
    <Building key="2" size={22} strokeWidth={1.6} aria-hidden="true" />,
    <InstagramIcon key="3" size={22} />,
  ]

  return (
    <section aria-labelledby="trust-title" className="section bg-night-2/60">
      <div className="container-x">
        <SectionHeading id="trust-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} />

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {s.items.map((it, i) => (
              <Reveal as="li" key={i} delay={i * 0.06}>
                <GlowCard glow={i === 0 ? 'gold' : 'sky'} className="h-full p-5 sm:p-6">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl ${i === 0 ? 'bg-gold/10 text-gold' : 'bg-sky/10 text-sky'}`}>
                    {icons[i]}
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{it.title}</h3>
                  <p className="mt-1.5 break-words text-sm leading-relaxed text-ink-muted">{f(it.text, vars)}</p>
                  {i === 3 && (
                    <a
                      href={SITE.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky hover:text-sky-glow"
                    >
                      {s.instagramBtn}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  )}
                </GlowCard>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1} className="grid grid-cols-2 gap-3 sm:gap-4">
            <PhotoSlot src={SITE.photos.office} alt={s.photoOffice} icon={<Camera size={24} aria-hidden="true" />} className="col-span-2 aspect-[16/9]" />
            {SITE.photos.team.map((src, i) => (
              <PhotoSlot key={src} src={src} alt={`${s.photoTeam}${SITE.photos.team.length > 1 ? ` · ${i + 1}` : ''}`} icon={<Users size={24} aria-hidden="true" />} className="aspect-square" />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
