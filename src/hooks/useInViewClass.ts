import { useEffect, useRef } from 'react'

// Один общий наблюдатель для проявления при прокрутке
let io: IntersectionObserver | null = null
function observer() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io!.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
  }
  return io
}

/** Хук: добавляет класс is-in, когда элемент появился на экране */
export function useInViewClass<T extends Element>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = observer()
    o.observe(el)
    return () => o.unobserve(el)
  }, [])
  return ref
}
