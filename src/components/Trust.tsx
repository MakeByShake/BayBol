import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { DocNo } from './ui/Doc'
import { GuillocheBand } from './ui/Guilloche'
import { Logo } from './ui/Logo'
import { Seal } from './ui/Seal'

const PHOTO_ROT = [-2, 1.5, -1, 2, -1.5, 1]

/** Уголки, которыми фото «вклеено» в альбом */
function Corners() {
  const corners = [
    ['-left-1 -top-1', 'polygon(0 0,100% 0,0 100%)'],
    ['-right-1 -top-1', 'polygon(0 0,100% 0,100% 100%)'],
    ['-bottom-1 -left-1', 'polygon(0 0,0 100%,100% 100%)'],
    ['-bottom-1 -right-1', 'polygon(100% 0,100% 100%,0 100%)'],
  ]
  return (
    <span aria-hidden="true">
      {corners.map(([pos, clip]) => (
        <span key={pos} className={`absolute h-5 w-5 bg-ink/70 ${pos}`} style={{ clipPath: clip }} />
      ))}
    </span>
  )
}

/** «Почему BayBol Visa» — как официальная справка с печатью */
export function Trust() {
  const { t, f, lang } = useTx()
  const s = t.trust
  const vars = {
    legal: SITE.company.legalName,
    bin: SITE.company.bin,
    address: SITE.company.address[lang],
    hours: SITE.workHours[lang],
    handle: SITE.instagram.handle,
  }

  return (
    <section aria-labelledby="trust-title" className="border-t py-20 rule sm:py-28">
      <div className="w-full-x">
        <DocNo n={12} label={t.sections.trust} />
        <h2 id="trust-title" className="h-section mt-8">
          {s.title}
        </h2>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* справка */}
          <article className="doc relative overflow-hidden px-6 pb-10 pt-8 sm:px-10">
            <GuillocheBand className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full" opacity={0.6} />
            <header className="relative flex items-center justify-between gap-4 border-b border-ink pb-5">
              <Logo className="h-7 w-auto sm:h-8" />
              <p className="font-serif text-[26px] sm:text-[30px]">{s.docTitle}</p>
            </header>
            <dl className="relative mt-6 space-y-3 font-mono text-[14px]">
              {s.docLines.map((l, i) => (
                <div key={i} className="leader flex-wrap sm:flex-nowrap">
                  <dt className="shrink-0 text-ink-2">{l.k}</dt>
                  <span aria-hidden="true" className="fill hidden sm:block" />
                  <dd className="w-full text-ink sm:w-auto sm:text-right">
                    {l.k === 'Instagram' ? (
                      <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="link">
                        {f(l.v, vars)}
                      </a>
                    ) : (
                      f(l.v, vars)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="relative mt-8 max-w-[34rem] font-serif text-[18px] leading-[1.7]">{s.docBody}</p>
            <div className="relative mt-8 flex items-end justify-between gap-6">
              <p className="font-mono text-[12px] text-ink-2">
                {SITE.company.owner}
                <span className="mt-6 block w-40 border-t border-ink pt-1">М.П.</span>
              </p>
              <Seal text={s.seal} className="h-32 w-32 shrink-0 -rotate-12 sm:h-36 sm:w-36" />
            </div>
          </article>

          {/* вклеенные фото клиентов */}
          <div>
            <p className="font-serif text-[22px]">{s.photosTitle}</p>
            <p className="mt-2 max-w-[28rem] text-[15px] text-ink-2">{s.photosNote}</p>
            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {SITE.photos.clients.map((src, i) => (
                <li key={src} className="relative bg-paper-2 p-2 pb-6" style={{ transform: `rotate(${PHOTO_ROT[i % PHOTO_ROT.length]}deg)` }}>
                  <img src={src} alt={s.photoAlt} loading="lazy" decoding="async" width={720} height={540} className="aspect-[4/5] w-full object-cover object-[50%_30%]" />
                  <Corners />
                </li>
              ))}
            </ul>
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="link mt-8 inline-block">
              {s.instagramBtn}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
