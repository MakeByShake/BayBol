import { useReducedMotion } from 'framer-motion'
import { useEffect, useId, useRef, useState, type RefObject } from 'react'

type Geom = { w: number; h: number; d: string; landX: number; landY: number; startY: number }

/** Х-координата линии: в левом поле страницы, где нет текста */
function railX(w: number): number {
  if (w < 640) return 8 // поле 16px
  if (w < 1024) return 12 // поле 24px
  const content = Math.min(w, 1152)
  return Math.max(16, (w - content) / 2 / 2 + 6)
}

/** Маршрут: мягкая волна вдоль левого поля, в конце — поворот к точке посадки */
function buildPath(w: number, startY: number, landX: number, landY: number): string {
  const x = railX(w)
  const amp = w < 1024 ? 3 : Math.min(18, x - 8) // насколько линия «гуляет» влево-вправо
  const turnY = landY - Math.min(420, w < 640 ? 260 : 380)
  const step = 600
  let d = `M${x} ${startY}`
  let y = startY
  let side = 1
  while (y + step < turnY) {
    const ny = y + step
    d += ` C${x + amp * side} ${y + step * 0.35} ${x + amp * side} ${y + step * 0.65} ${x} ${ny}`
    y = ny
    side *= -1
  }
  // поворот к центру и посадка
  d += ` L${x} ${turnY} C${x} ${turnY + (landY - turnY) * 0.75} ${landX} ${landY - (landY - turnY) * 0.6} ${landX} ${landY}`
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
      // маршрут начинается под первым экраном
      const hero = container.querySelector<HTMLElement>('#top')
      const startY = hero ? hero.offsetHeight : 600
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
      const landed = len >= total - 1
      const angle = landed ? 90 : (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI
      if (planeRef.current) {
        planeRef.current.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${angle}deg)`
        planeRef.current.style.opacity = targetY < geom.startY ? '0' : '1'
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
    // поверх секций, но линия идёт по полю страницы и не пересекает текст
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <svg width={geom.w} height={geom.h} className="absolute left-0 top-0" fill="none">
        <defs>
          <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="0" y="0" width={geom.w} height={geom.h}>
            <path ref={revealRef} d={geom.d} stroke="#fff" strokeWidth="8" style={reduce ? undefined : { strokeDasharray: '0 1' }} />
          </mask>
        </defs>
        {/* весь маршрут — едва заметный пунктир */}
        <path ref={pathRef} d={geom.d} stroke="#6C8DB8" strokeOpacity="0.35" strokeWidth="1.25" strokeDasharray="1.5 7" strokeLinecap="round" />
        {/* пройденная часть — золотом */}
        <path d={geom.d} stroke="#E0A84A" strokeWidth="1.5" strokeDasharray="1.5 7" strokeLinecap="round" mask={`url(#${id}m)`} />
      </svg>
      {!reduce && (
        <div ref={planeRef} className="absolute left-0 top-0 opacity-0 transition-opacity duration-500 will-change-transform">
          <svg viewBox="-12 -12 24 24" className="h-4 w-4 sm:h-[22px] sm:w-[22px]">
            <path
              d="M9 0 C9 -.9 7.6 -1.4 5 -1.4 L1.6 -1.4 L-2.6 -7.6 L-5 -7.6 L-2.4 -1.4 L-5.6 -1.4 L-7.6 -4 L-9.2 -4 L-8 0 L-9.2 4 L-7.6 4 L-5.6 1.4 L-2.4 1.4 L-5 7.6 L-2.6 7.6 L1.6 1.4 L5 1.4 C7.6 1.4 9 .9 9 0 Z"
              fill="#F4C46A"
              stroke="#0B2233"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
