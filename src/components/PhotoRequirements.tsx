import { Check, Users } from 'lucide-react'
import { useState } from 'react'
import { useTx } from '../hooks/useTx'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

// Какая часть схемы подсвечивается для каждого требования (по порядку в словаре)
type Part = 'frame' | 'file' | 'recent' | 'bg' | 'face' | 'eyes' | 'head'
const PARTS: Part[] = ['frame', 'file', 'recent', 'bg', 'face', 'eyes', 'head']

function PhotoSchema({ active }: { active: Part | null }) {
  const { t } = useTx()
  const s = t.photo.schema
  const on = (p: Part) => active === p
  const dim = (p: Part) => (active && !on(p) ? 0.35 : 1)
  const gold = '#C8932E'
  const sky = '#2E8FD6'

  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full" role="img" aria-label={s.aria}>
      {/* фон */}
      <rect x="40" y="40" width="320" height="320" rx="6" fill={on('bg') ? '#F5F7FF' : '#E4E9F5'} opacity={active === 'bg' ? 1 : 0.92} style={{ transition: 'all .3s' }} />
      {/* силуэт */}
      <g opacity={active && !['face', 'eyes', 'head'].includes(active) ? 0.35 : 1} style={{ transition: 'opacity .3s' }}>
        <path d="M200 112c-38 0-62 30-62 68 0 26 10 48 26 62l-4 22c-46 10-78 36-86 96h252c-8-60-40-86-86-96l-4-22c16-14 26-36 26-62 0-38-24-68-62-68Z" fill="#9AA6C4" />
      </g>
      {/* центральная ось лица */}
      <line x1="200" y1="90" x2="200" y2="330" stroke={sky} strokeWidth="2" strokeDasharray="5 6" opacity={on('face') ? 1 : 0} style={{ transition: 'opacity .3s' }} />
      {/* линия глаз */}
      <g opacity={on('eyes') ? 1 : active ? 0.25 : 0.7} style={{ transition: 'opacity .3s' }}>
        <line x1="120" y1="172" x2="350" y2="172" stroke={sky} strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="178" cy="172" r="4" fill={sky} />
        <circle cx="222" cy="172" r="4" fill={sky} />
        <text x="350" y="162" textAnchor="end" fill="#2E8FD6" fontSize="13" fontWeight="700" fontFamily="Onest, sans-serif">
          {s.eyes}
        </text>
      </g>
      {/* высота головы */}
      <g opacity={on('head') ? 1 : active ? 0.25 : 0.8} style={{ transition: 'opacity .3s' }}>
        <line x1="72" y1="104" x2="72" y2="268" stroke={gold} strokeWidth="2.5" />
        <line x1="62" y1="104" x2="82" y2="104" stroke={gold} strokeWidth="2.5" />
        <line x1="62" y1="268" x2="82" y2="268" stroke={gold} strokeWidth="2.5" />
        <line x1="82" y1="104" x2="200" y2="104" stroke={gold} strokeWidth="1.5" strokeDasharray="4 5" />
        <line x1="82" y1="268" x2="200" y2="268" stroke={gold} strokeWidth="1.5" strokeDasharray="4 5" />
        <rect x="48" y="175" width="48" height="22" rx="11" fill="#0B2233" />
        <text x="72" y="190" textAnchor="middle" fill="#F4C46A" fontSize="12" fontWeight="700" fontFamily="Onest, sans-serif">
          {s.head}
        </text>
      </g>
      {/* рамка 600×600 */}
      <g opacity={dim('frame')} style={{ transition: 'opacity .3s' }}>
        <rect x="40" y="40" width="320" height="320" rx="6" fill="none" stroke={on('frame') ? gold : sky} strokeWidth={on('frame') ? 4 : 2} strokeDasharray={on('frame') ? '0' : '8 6'} />
        <text x="200" y="28" textAnchor="middle" fill={on('frame') ? gold : '#475569'} fontSize="14" fontWeight="600" fontFamily="Onest, sans-serif">
          {s.size}
        </text>
      </g>
      {/* подпись фона */}
      <text x="56" y="68" fill="#5D6889" fontSize="12" fontWeight="600" fontFamily="Onest, sans-serif" opacity={on('bg') ? 1 : 0.55}>
        {s.background}
      </text>
      {/* бейджи файла и даты */}
      <g opacity={dim('file')} style={{ transition: 'opacity .3s' }}>
        <rect x="236" y="376" width="124" height="24" rx="12" fill={on('file') ? gold : '#0B2233'} />
        <text x="298" y="392" textAnchor="middle" fill="#F5F7FF" fontSize="12" fontWeight="700" fontFamily="Onest, sans-serif">
          {s.file}
        </text>
      </g>
      <g opacity={dim('recent')} style={{ transition: 'opacity .3s' }}>
        <rect x="40" y="376" width="88" height="24" rx="12" fill={on('recent') ? gold : '#0B2233'} />
        <text x="84" y="392" textAnchor="middle" fill="#F5F7FF" fontSize="12" fontWeight="700" fontFamily="Onest, sans-serif">
          {s.recent}
        </text>
      </g>
      {/* подпись «смотрим прямо» */}
      <text x="200" y="350" textAnchor="middle" fill={sky} fontSize="12" fontWeight="600" fontFamily="Onest, sans-serif" opacity={on('face') ? 1 : 0} style={{ transition: 'opacity .3s' }}>
        {s.face}
      </text>
    </svg>
  )
}

export function PhotoRequirements() {
  const { t } = useTx()
  const p = t.photo
  const [active, setActive] = useState<Part | null>(null)

  return (
    <section aria-labelledby="photo-title" className="section tone-light">
      <div className="container-x">
        <SectionHeading n="05" id="photo-title" eyebrow={p.eyebrow} title={p.title} accent={p.titleAccent} subtitle={p.subtitle} />

        <div className="mt-12 grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <Reveal className="md:sticky md:top-24">
            <div className="card mx-auto max-w-md p-4 sm:p-6">
              <PhotoSchema active={active} />
            </div>
          </Reveal>

          <div>
            <ul className="border-t border-line/10" onMouseLeave={() => setActive(null)}>
              {p.reqs.map((r, i) => {
                const part = PARTS[i]
                const isOn = active === part
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(part)}
                      onFocus={() => setActive(part)}
                      onBlur={() => setActive(null)}
                      onClick={() => setActive(isOn ? null : part)}
                      aria-pressed={isOn}
                      className={`flex w-full items-baseline gap-4 border-b border-line/10 px-1 py-3.5 text-left text-[15px] transition-colors sm:text-base ${
                        isOn ? 'bg-gold/15' : 'hover:bg-line/[0.03]'
                      }`}
                    >
                      <span className={`text-xs font-semibold ${isOn ? 'text-accent' : 'text-ink-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="flex-1">{r}</span>
                      <Check size={16} strokeWidth={2.5} className={`shrink-0 self-center ${isOn ? 'text-accent' : 'text-link'}`} aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
            <Reveal className="mt-6 space-y-3">
              <p className="border-l-2 border-gold-deep pl-4 leading-relaxed">{p.note}</p>
              <p className="flex items-center gap-2 text-sm text-ink-muted">
                <Users size={16} className="shrink-0 text-link" aria-hidden="true" />
                {p.family}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
