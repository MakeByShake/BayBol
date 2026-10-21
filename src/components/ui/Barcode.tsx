// Декоративный штрихкод: полоски разной толщины, всегда одинаковые для одного seed
export function Barcode({ seed = 7, className = '', vertical = false }: { seed?: number; className?: string; vertical?: boolean }) {
  let x = seed
  const rnd = () => {
    x = (x * 9301 + 49297) % 233280
    return x / 233280
  }
  const bars: { pos: number; w: number }[] = []
  let pos = 0
  while (pos < 100) {
    const w = [1, 1, 2, 3][Math.floor(rnd() * 4)]
    bars.push({ pos, w })
    pos += w + [1, 2, 2, 3][Math.floor(rnd() * 4)]
  }
  return (
    <svg viewBox={vertical ? '0 0 30 100' : '0 0 100 30'} preserveAspectRatio="none" className={className} aria-hidden="true">
      {bars.map((b, i) =>
        vertical ? <rect key={i} x="0" y={b.pos} width="30" height={b.w} fill="#14213A" /> : <rect key={i} x={b.pos} y="0" width={b.w} height="30" fill="#14213A" />,
      )}
    </svg>
  )
}
