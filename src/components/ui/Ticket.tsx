import type { CSSProperties, ReactNode } from 'react'

type Props = {
  main: ReactNode
  stub: ReactNode
  /** высота корешка на телефоне */
  stubY?: number
  /** ширина корешка с 640px */
  stubX?: number
  className?: string
  label?: string
}

/** Посадочный талон: основная часть + отрывной корешок, выемки и пунктир линии отрыва */
export function Ticket({ main, stub, stubY = 132, stubX = 170, className = '', label }: Props) {
  const style = { '--stub': `${stubY}px`, '--stub-x': `${stubX}px` } as CSSProperties
  return (
    <div className={`ticket-edge ${className}`} role={label ? 'img' : undefined} aria-label={label}>
      <div className="ticket ticket-grid relative overflow-hidden" style={style}>
        <div className="relative min-w-0">{main}</div>
        <div className="ticket-stub relative min-w-0">{stub}</div>
      </div>
    </div>
  )
}
