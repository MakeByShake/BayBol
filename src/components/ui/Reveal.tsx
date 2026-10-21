import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type Props = { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' }

// Один общий наблюдатель на всю страницу — дешевле, чем отдельный на каждый блок
let observer: IntersectionObserver | null = null
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            observer!.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    )
  }
  return observer
}

/** Плавное появление: fade + лёгкий подъём, один раз (CSS-переход, см. .reveal в index.css) */
export function Reveal({ children, delay = 0, className = '', as = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = getObserver()
    io.observe(el)
    return () => io.unobserve(el)
  }, [])
  const style = delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined
  const Comp = as
  return (
    <Comp ref={ref as never} className={`reveal ${className}`} style={style}>
      {children}
    </Comp>
  )
}
