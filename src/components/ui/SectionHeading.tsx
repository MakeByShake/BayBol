import type { ReactNode } from 'react'
import { nb } from '../../lib/format'
import { Reveal } from './Reveal'

type Props = {
  eyebrow?: string
  title: string
  accent?: string
  subtitle?: ReactNode
  align?: 'center' | 'left'
  id?: string
}

export function SectionHeading({ eyebrow, title, accent, subtitle, align = 'center', id }: Props) {
  const center = align === 'center'
  return (
    <Reveal className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 id={id} className="mt-5 text-[28px] font-bold leading-[1.12] sm:text-4xl lg:text-[44px]">
        {nb(title)} {accent && <span className="text-gradient">{nb(accent)}</span>}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{typeof subtitle === 'string' ? nb(subtitle) : subtitle}</p>}
    </Reveal>
  )
}
