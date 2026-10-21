import type { ReactNode } from 'react'
import { useInViewClass } from '../../hooks/useInViewClass'

/**
 * Номер секции в стиле документа: «01 / Проверка».
 * avoid-ai-design-ignore: SD6 SD4m — нумерацию разделов документа задаёт бриф (DESIGN.md)
 */
export function DocNo({ n, label }: { n: number; label: string }) {
  return (
    <p className="doc-no">
      <span>
        {String(n).padStart(2, '0')} / {label}
      </span>
    </p>
  )
}

/** Проявление: 'fade' — текст проявляется, 'line' — линия прорисовывается слева направо */
export function Show({ children, kind = 'fade', className = '' }: { children?: ReactNode; kind?: 'fade' | 'line'; className?: string }) {
  const ref = useInViewClass<HTMLDivElement>()
  return (
    <div ref={ref} className={`${kind === 'line' ? 'show-line' : 'show-fade'} ${className}`}>
      {children}
    </div>
  )
}
