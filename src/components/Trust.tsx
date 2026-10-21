import { ArrowUpRight } from 'lucide-react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
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

  return (
    <section aria-labelledby="trust-title" className="section tone-light">
      <div className="container-x">
        <SectionHeading n="12" id="trust-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} />

        <ul className="mt-12 grid border-t border-line/15 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((it, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 0.05}
              className={`border-b border-line/10 py-6 sm:pr-6 ${i % 2 ? 'sm:border-l sm:pl-6' : ''} ${i === 2 ? 'lg:border-l lg:pl-6' : ''} lg:border-b-0`}
            >
              <span className="text-xs font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-base font-semibold">{it.title}</h3>
              <p className="mt-1.5 break-words text-sm leading-relaxed text-ink-muted">{f(it.text, vars)}</p>
              {i === 3 && (
                <a
                  href={SITE.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-link underline-offset-4 hover:underline"
                >
                  {s.instagramBtn}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
            </Reveal>
          ))}
        </ul>

        {/* настоящие фото клиентов */}
        <Reveal className="mt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <h3 className="text-xl font-semibold sm:text-2xl">{s.clientsTitle}</h3>
            <p className="max-w-md text-sm leading-relaxed text-ink-muted">{s.clientsNote}</p>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
            {SITE.photos.clients.map((src, i) => (
              <li key={src} className="relative overflow-hidden rounded-lg bg-[#0B2233]/10">
                <img
                  src={src}
                  alt={s.clientAlt}
                  loading="lazy"
                  decoding="async"
                  width={720}
                  height={540}
                  className="aspect-[4/3] h-full w-full object-cover object-[50%_30%]"
                />
                <span className="absolute bottom-2 left-2 rounded bg-[#0B2233]/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
