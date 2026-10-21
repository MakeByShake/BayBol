import { useState } from 'react'
import { useTx } from '../hooks/useTx'
import { DocNo } from './ui/Doc'

// Какая часть чертежа подсвечивается для каждого требования (по порядку в словаре)
type Part = 'frame' | 'file' | 'recent' | 'bg' | 'face' | 'eyes' | 'head'
const PARTS: Part[] = ['frame', 'file', 'recent', 'bg', 'face', 'eyes', 'head']

const BLUE = '#1F6FAE'

/** Стрелка размерной линии */
function Arrow({ x, y, dir }: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' }) {
  const d = { up: `M${x} ${y} l-4 8 h8 z`, down: `M${x} ${y} l-4 -8 h8 z`, left: `M${x} ${y} l8 -4 v8 z`, right: `M${x} ${y} l-8 -4 v8 z` }[dir]
  return <path d={d} fill="currentColor" stroke="none" />
}

function Drawing({ active }: { active: Part | null }) {
  const { t } = useTx()
  const s = t.photo.schema
  const op = (p: Part) => (active === null ? 0.75 : active === p ? 1 : 0.18)
  const sw = (p: Part) => (active === p ? 2 : 1.2)
  const g = (p: Part) => ({ opacity: op(p), style: { transition: 'opacity 200ms' }, strokeWidth: sw(p) })

  return (
    <svg viewBox="0 0 440 470" className="h-auto w-full" role="img" aria-label={s.aria} style={{ color: BLUE }}>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" fill="none" stroke="#1F6FAE" strokeOpacity=".09" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="440" height="470" fill="url(#grid)" />

      {/* кадр 600×600 */}
      <rect x="70" y="50" width="300" height="300" fill={active === 'bg' ? '#FFFFFF' : '#F7F4EE'} stroke="#14213A" strokeWidth={active === 'frame' ? 2 : 1} style={{ transition: 'fill 200ms' }} />
      <text x="82" y="70" fontFamily="IBM Plex Mono" fontSize="11" fill="#5B6478" opacity={op('bg')}>
        {s.background}
      </text>

      {/* силуэт — контур чернилами */}
      <g fill="none" stroke="#14213A" strokeWidth="1.3">
        <path d="M220 104c-36 0-58 28-58 64 0 25 10 46 25 59l-4 21c-44 10-74 34-81 102h236c-7-68-37-92-81-102l-4-21c15-13 25-34 25-59 0-36-22-64-58-64Z" />
      </g>

      {/* ось лица */}
      <g stroke="currentColor" fill="none" {...g('face')}>
        <line x1="220" y1="86" x2="220" y2="336" strokeDasharray="6 4 1 4" />
      </g>
      <text x="226" y="96" fontFamily="IBM Plex Mono" fontSize="11" fill={BLUE} opacity={op('face')}>
        {s.face}
      </text>

      {/* линия глаз */}
      <g stroke="currentColor" fill="none" {...g('eyes')}>
        <line x1="150" y1="166" x2="372" y2="166" strokeDasharray="4 4" />
        <circle cx="200" cy="166" r="5" />
        <circle cx="240" cy="166" r="5" />
      </g>
      <text x="366" y="158" textAnchor="end" fontFamily="IBM Plex Mono" fontSize="11" fill={BLUE} opacity={op('eyes')}>
        {s.eyes}
      </text>

      {/* высота головы 50–69 % */}
      <g stroke="currentColor" {...g('head')}>
        <line x1="150" y1="104" x2="160" y2="104" />
        <line x1="150" y1="250" x2="160" y2="250" />
        <line x1="40" y1="104" x2="150" y2="104" strokeDasharray="2 3" />
        <line x1="40" y1="250" x2="150" y2="250" strokeDasharray="2 3" />
        <line x1="46" y1="108" x2="46" y2="246" />
        <Arrow x={46} y={104} dir="up" />
        <Arrow x={46} y={250} dir="down" />
      </g>
      <text x="40" y="182" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="600" fill={BLUE} opacity={op('head')} transform="rotate(-90 40 182)" textAnchor="middle">
        {s.head}
      </text>

      {/* размер 600 px — сверху и справа */}
      <g stroke="currentColor" {...g('frame')}>
        <line x1="70" y1="22" x2="70" y2="46" />
        <line x1="370" y1="22" x2="370" y2="46" />
        <line x1="74" y1="30" x2="366" y2="30" />
        <Arrow x={70} y={30} dir="left" />
        <Arrow x={370} y={30} dir="right" />
        <line x1="374" y1="50" x2="400" y2="50" />
        <line x1="374" y1="350" x2="400" y2="350" />
        <line x1="392" y1="54" x2="392" y2="346" />
        <Arrow x={392} y={50} dir="up" />
        <Arrow x={392} y={350} dir="down" />
      </g>
      <rect x="196" y="22" width="48" height="16" fill="#FBF8F2" opacity={op('frame')} />
      <text x="220" y="34" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="600" fill={BLUE} opacity={op('frame')}>
        {s.size}
      </text>
      <text x="410" y="200" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="600" fill={BLUE} opacity={op('frame')} transform="rotate(90 410 200)" textAnchor="middle">
        {s.size}
      </text>

      {/* угловой штамп чертежа: формат и давность */}
      <g fontFamily="IBM Plex Mono" fontSize="11.5">
        <rect x="70" y="378" width="300" height="64" fill="none" stroke="#14213A" strokeWidth="1" />
        <line x1="220" y1="378" x2="220" y2="442" stroke="#14213A" strokeWidth="1" />
        <rect x="70.5" y="378.5" width="149" height="63" fill={BLUE} opacity={active === 'file' ? 0.12 : 0} style={{ transition: 'opacity 200ms' }} />
        <rect x="220.5" y="378.5" width="149" height="63" fill={BLUE} opacity={active === 'recent' ? 0.12 : 0} style={{ transition: 'opacity 200ms' }} />
        <text x="82" y="414" fill="#14213A">
          {s.file}
        </text>
        <text x="232" y="414" fill="#14213A">
          {s.recent}
        </text>
      </g>
    </svg>
  )
}

export function Photo() {
  const { t } = useTx()
  const p = t.photo
  const [active, setActive] = useState<Part | null>(null)

  return (
    <section aria-labelledby="photo-title" className="border-t py-20 rule sm:py-28">
      <div className="w-full-x">
        <DocNo n={5} label={t.sections.photo} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 id="photo-title" className="h-section max-w-[14ch]">
              {p.title}
            </h2>
            <p className="mt-6 max-w-[30rem] text-ink-2">{p.subtitle}</p>

            <ol className="mt-10 border-t rule" onMouseLeave={() => setActive(null)}>
              {p.reqs.map((r, i) => {
                const part = PARTS[i]
                const on = active === part
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(part)}
                      onFocus={() => setActive(part)}
                      onBlur={() => setActive(null)}
                      onClick={() => setActive(on ? null : part)}
                      aria-pressed={on}
                      className={`flex min-h-[48px] w-full items-baseline gap-4 border-b py-3 text-left transition-colors duration-150 rule ${on ? 'text-sky-ink' : 'text-ink hover:text-sky-ink'}`}
                    >
                      <span className="w-6 shrink-0 font-mono text-[13px] text-ink-2">{i + 1}</span>
                      <span>{r}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <p className="mt-8 max-w-[32rem]">{p.note}</p>
            <p className="mt-3 text-[15px] text-ink-2">{p.family}</p>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="doc mx-auto max-w-[560px] p-3 sm:p-5">
              <Drawing active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
