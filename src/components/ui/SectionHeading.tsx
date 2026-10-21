import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = {
  n?: string // номер секции: «01»
  eyebrow?: string
  title: string
  accent?: string
  subtitle?: ReactNode
  id?: string
  center?: boolean
}

/** Заголовок секции: номер / подпись, крупный заголовок слева, пояснение справа (на десктопе) */
export function SectionHeading({ n, eyebrow, title, accent, subtitle, id, center = false }: Props) {
  return (
    <Reveal className={center ? 'mx-auto max-w-3xl text-center' : subtitle ? 'grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10' : 'max-w-3xl'}>
      <div className={!center && subtitle ? 'lg:col-span-7' : ''}>
        {eyebrow && (
          <p className={`label flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
            {n && <span className="text-accent">{n}</span>}
            {n && <span aria-hidden="true" className="h-px w-6 bg-line/25" />}
            {eyebrow}
          </p>
        )}
        <h2 id={id} className="mt-4 text-[28px] font-semibold leading-[1.1] sm:text-4xl lg:text-[44px]">
          {title} {accent && <span className="accent-word">{accent}</span>}
        </h2>
      </div>
      {subtitle && (
        <p className={`text-base leading-relaxed text-ink-muted sm:text-[17px] ${center ? 'mt-4' : 'lg:col-span-5 lg:pb-1.5'}`}>{subtitle}</p>
      )}
    </Reveal>
  )
}
