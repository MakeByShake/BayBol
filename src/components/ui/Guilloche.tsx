import { useMemo } from 'react'

/**
 * Гильоширный узор, как на банкнотах и в паспорте: переплетённые синусоиды.
 * Рисуется один раз, растягивается на весь блок.
 */
export function GuillocheBand({ className = '', color = '#F4C46A', lines = 14, opacity = 0.55 }: { className?: string; color?: string; lines?: number; opacity?: number }) {
  const paths = useMemo(() => {
    const W = 600
    const H = 120
    const out: string[] = []
    for (let k = 0; k < lines; k++) {
      const phase = (k / lines) * Math.PI * 2
      const amp = 18 + 22 * Math.sin(phase / 2) ** 2
      let d = ''
      for (let x = 0; x <= W; x += 4) {
        const y = H / 2 + amp * Math.sin((x / W) * Math.PI * 6 + phase) * Math.cos((x / W) * Math.PI * 1.5 + phase / 3)
        d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`
      }
      out.push(d)
    }
    return out
  }, [lines])

  return (
    <svg viewBox="0 0 600 120" preserveAspectRatio="none" className={className} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="0.6" opacity={opacity}>
        {paths.map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  )
}

/** Розетка — круглый гильош (для паспорта и печатей) */
export function GuillocheRosette({ className = '', color = '#F4C46A', opacity = 0.5 }: { className?: string; color?: string; opacity?: number }) {
  const paths = useMemo(() => {
    const out: string[] = []
    for (let k = 0; k < 9; k++) {
      const phase = (k / 9) * Math.PI * 2
      let d = ''
      for (let a = 0; a <= 360; a += 2) {
        const t = (a * Math.PI) / 180
        const r = 70 + 22 * Math.sin(t * 12 + phase) + 8 * Math.sin(t * 5 - phase)
        d += `${a === 0 ? 'M' : 'L'}${(100 + r * Math.cos(t)).toFixed(1)} ${(100 + r * Math.sin(t)).toFixed(1)}`
      }
      out.push(d + 'Z')
    }
    return out
  }, [])
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="0.5" opacity={opacity}>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  )
}
