import { useReducedMotion } from 'framer-motion'
import { useEffect, useId, useRef, useState, type RefObject } from 'react'

type Geom = { w: number; h: number; d: string; landX: number; landY: number; startY: number }

/** Строит плавную «змейку» маршрута от верха страницы до точки посадки */
function buildPath(w: number, startY: number, landX: number, landY: number): string {
  const mobile = w < 768
  const contentW = Math.min(w, 1152)
  const gutter = (w - contentW) / 2
  const left = mobile ? 9 : Math.max(22, gutter * 0.5)
  const right = mobile ? w - 9 : w - Math.max(22, gutter * 0.5)
  const segment = mobile ? 1400 : 1100
  const endY = landY - 260

  const pts: [number, number][] = [[right, startY]]
  let y = startY
  let side = 0
  while (y + segment < endY) {
    y += segment
    side ^= 1
    pts.push([mobile ? (side ? left : right) : side ? left : right, y])
  }
  pts.push([landX, landY])

  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const dy = (y1 - y0) / 2
    d += ` C${x0} ${y0 + dy} ${x1} ${y1 - dy} ${x1} ${y1}`
  }
  return d
}

/**
 * Пунктирный маршрут через всю страницу. Самолётик летит вниз вместе со скроллом
 * (держится примерно по центру экрана) и «приземляется» в финальном блоке.
 */
export function FlightPath({ containerRef, landingRef }: { containerRef: RefObject<HTMLElement | null>; landingRef: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion()
  const id = useId().replace(/:/g, '')
  const [geom, setGeom] = useState<Geom | null>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const revealRef = useRef<SVGPathElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)

  // геометрия: пересчитываем при изменении размеров
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const measure = () => {
      const landing = landingRef.current
      const c = container.getBoundingClientRect()
      const w = c.width
      const h = container.scrollHeight
      // маршрут начинается у нижней части первого экрана, чтобы не перекрывать карточку
      const hero = container.querySelector<HTMLElement>('#top')
      const startY = hero ? Math.round(hero.offsetHeight * 0.78) : 140
      let landX = w / 2
      let landY = h - 400
      if (landing) {
        const l = landing.getBoundingClientRect()
        landX = l.left - c.left + l.width / 2
        landY = l.top - c.top + l.height / 2
      }
      setGeom((g) =>
        g && g.w === w && g.h === h && g.landX === landX && g.landY === landY && g.startY === startY
          ? g
          : { w, h, landX, landY, startY, d: buildPath(w, startY, landX, landY) },
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [containerRef, landingRef])

  // полёт: на каждом скролле ищем точку маршрута на уровне центра экрана
  useEffect(() => {
    const path = pathRef.current
    const container = containerRef.current
    if (!geom || !path || !container || reduce) return
    const total = path.getTotalLength()
    let raf = 0

    const findLength = (targetY: number) => {
      let lo = 0
      let hi = total
      for (let i = 0; i < 22; i++) {
        const mid = (lo + hi) / 2
        if (path.getPointAtLength(mid).y < targetY) lo = mid
        else hi = mid
      }
      return lo
    }

    const update = () => {
      raf = 0
      const top = container.getBoundingClientRect().top
      const targetY = -top + window.innerHeight * 0.55
      const len = Math.max(0, Math.min(total, findLength(targetY)))
      const p = path.getPointAtLength(len)
      const ahead = path.getPointAtLength(Math.min(total, len + 2))
      const behind = path.getPointAtLength(Math.max(0, len - 2))
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI
      const landed = len >= total - 1
      if (planeRef.current) {
        planeRef.current.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${landed ? 90 : angle}deg)`
        planeRef.current.style.opacity = targetY < geom.startY ? '0' : '1'
        planeRef.current.dataset.landed = landed ? 'true' : 'false'
      }
      if (revealRef.current) revealRef.current.style.strokeDashoffset = String(total - len)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    if (revealRef.current) revealRef.current.style.strokeDasharray = `${total} ${total}`
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [geom, reduce, containerRef])

  if (!geom) return null

  return (
    <>
    {/* линия — за контентом */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg width={geom.w} height={geom.h} className="absolute left-0 top-0" fill="none">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2={geom.h} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1F6FAE" />
            <stop offset="1" stopColor="#A8761F" />
          </linearGradient>
          <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="0" y="0" width={geom.w} height={geom.h}>
            <path ref={revealRef} d={geom.d} stroke="#fff" strokeWidth="8" style={reduce ? undefined : { strokeDasharray: '0 1' }} />
          </mask>
        </defs>
        {/* весь маршрут — едва заметный пунктир */}
        <path ref={pathRef} d={geom.d} stroke="#1F6FAE" strokeOpacity="0.28" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
        {/* пройденная часть — ярче */}
        <path d={geom.d} stroke={`url(#${id}g)`} strokeOpacity="0.9" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" mask={`url(#${id}m)`} />
      </svg>
    </div>
    {/* самолётик — поверх контента */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {!reduce && (
        <div
          ref={planeRef}
          className="absolute left-0 top-0 opacity-0 transition-opacity duration-500 will-change-transform"
        >
          <svg viewBox="-12 -12 24 24" className="h-5 w-5 sm:h-6 sm:w-6">
            <path
              d="M9 0 C9 -.9 7.6 -1.4 5 -1.4 L1.6 -1.4 L-2.6 -7.6 L-5 -7.6 L-2.4 -1.4 L-5.6 -1.4 L-7.6 -4 L-9.2 -4 L-8 0 L-9.2 4 L-7.6 4 L-5.6 1.4 L-2.4 1.4 L-5 7.6 L-2.6 7.6 L1.6 1.4 L5 1.4 C7.6 1.4 9 .9 9 0 Z"
              fill="#1F6FAE"
              stroke="#FBF8F2"
              strokeWidth="0.8"
            />
          </svg>
        </div>
      )}
    </div>
    </>
  )
}
