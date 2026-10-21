import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

/** Лёгкое звёздное небо на canvas: мерцает, пауза за пределами экрана */
export function StarField({ density = 0.00012 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let stars: { x: number; y: number; r: number; a: number; s: number; p: number }[] = []
    let raf = 0
    let visible = true
    let last = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(width < 768 ? 90 : 200, Math.round(width * height * density))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() < 0.85 ? Math.random() * 0.9 + 0.3 : Math.random() * 1.2 + 1,
        a: Math.random() * 0.6 + 0.2,
        s: Math.random() * 0.0015 + 0.0005,
        p: Math.random() * Math.PI * 2,
      }))
      draw(0)
    }

    const draw = (time: number) => {
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)
      for (const st of stars) {
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(time * st.s + st.p)
        ctx.globalAlpha = st.a * tw
        ctx.fillStyle = st.r > 1.2 ? '#FFE2A8' : '#F5F7FF'
        ctx.beginPath()
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (time: number) => {
      // ~20 кадров в секунду достаточно для мерцания
      if (visible && time - last > 50) {
        draw(time)
        last = time
      }
      raf = requestAnimationFrame(loop)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    if (!reduce) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [density, reduce])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}
