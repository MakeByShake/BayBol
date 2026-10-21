import type { ReactNode } from 'react'

type LinkProps = {
  href: string
  children: ReactNode
  className?: string
  size?: 'md' | 'lg'
  external?: boolean
}

const ext = (external?: boolean) => (external ? { target: '_blank', rel: 'noopener noreferrer' } : {})

/** Главная кнопка: сплошное золото, без лишних эффектов */
export function GoldButton({ href, children, className = '', size = 'md', external = true }: LinkProps) {
  const pad = size === 'lg' ? 'h-14 px-7 text-base' : 'h-12 px-5 text-[15px]'
  return (
    <a
      href={href}
      {...ext(external)}
      className={`inline-flex items-center justify-center gap-2.5 rounded-[10px] bg-gold font-semibold text-night transition-colors duration-200 hover:bg-gold-glow ${pad} ${className}`}
    >
      {children}
    </a>
  )
}

/** Вторичная кнопка: тонкая рамка */
export function OutlineButton({ href, children, className = '', size = 'md', external = false }: LinkProps) {
  const pad = size === 'lg' ? 'h-14 px-7 text-base' : 'h-12 px-5 text-[15px]'
  return (
    <a
      href={href}
      {...ext(external)}
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] border border-line/20 font-semibold text-ink transition-colors duration-200 hover:border-line/40 hover:bg-line/[0.04] ${pad} ${className}`}
    >
      {children}
    </a>
  )
}
