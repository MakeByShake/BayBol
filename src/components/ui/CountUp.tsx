import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { formatNumber } from '../../lib/format'

/** Число, которое «набегает» от 0 при появлении на экране */
export function CountUp({ value, duration = 1.8, suffix = '' }: { value: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setShown(v) })
    return () => controls.stop()
  }, [inView, value, duration, reduce])

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(reduce ? value : shown)}
      {suffix}
    </span>
  )
}
