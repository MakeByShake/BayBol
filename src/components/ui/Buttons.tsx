import type { ReactNode } from 'react'

type LinkProps = {
  href: string
  children: ReactNode
  className?: string
  size?: 'md' | 'lg'
  external?: boolean
  ariaLabel?: string
}

const ext = (external?: boolean) => (external ? { target: '_blank', rel: 'noopener noreferrer' } : {})

/** Главная золотая кнопка: пульсирующее свечение + пробегающий блик */
export function GoldButton({ href, children, className = '', size = 'md', external = true, ariaLabel }: LinkProps) {
  const pad = size === 'lg' ? 'h-14 px-8 text-base sm:h-16 sm:px-10 sm:text-lg' : 'h-12 px-6 text-[15px]'
  return (
    <a
      href={href}
      {...ext(external)}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-gold-glow to-gold font-semibold text-night animate-pulse-glow transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${pad} ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </a>
  )
}

/** Контурная кнопка с градиентной рамкой */
export function OutlineButton({ href, children, className = '', size = 'md', external = false, ariaLabel }: LinkProps) {
  const pad = size === 'lg' ? 'h-14 px-8 text-base' : 'h-12 px-6 text-[15px]'
  return (
    <a
      href={href}
      {...ext(external)}
      aria-label={ariaLabel}
      className={`border-gradient inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.03] font-semibold text-ink transition-colors duration-200 hover:bg-white/[0.08] ${pad} ${className}`}
    >
      {children}
    </a>
  )
}
