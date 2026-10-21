import { useRef, type ReactNode, type PointerEvent } from 'react'

type Props = { children: ReactNode; className?: string; glow?: 'gold' | 'sky' | 'coral' }

const GLOW = {
  gold: 'rgba(244,196,106,.16)',
  sky: 'rgba(108,195,255,.16)',
  coral: 'rgba(255,122,122,.14)',
}
const RING = {
  gold: 'group-hover:border-gold/40',
  sky: 'group-hover:border-sky/40',
  coral: 'group-hover:border-coral/40',
}

/** Стеклянная карточка с подсветкой, которая следует за курсором (только мышь) */
export function GlowCard({ children, className = '', glow = 'sky' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`glass group overflow-hidden transition-colors duration-300 ${RING[glow]} ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), ${GLOW[glow]}, transparent 65%)` }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
