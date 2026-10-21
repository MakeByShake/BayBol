import { useId } from 'react'
import { MarkLine } from './Logo'

/** Круглая печать с текстом по кругу и знаком в центре */
export function Seal({ text, center, color = '#1F6FAE', className = '' }: { text: string; center?: string; color?: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      <defs>
        <path id={`${id}c`} d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
      </defs>
      <g fill="none" stroke={color} opacity="0.85">
        <circle cx="80" cy="80" r="74" strokeWidth="2.5" />
        <circle cx="80" cy="80" r="68" strokeWidth="1" />
        <circle cx="80" cy="80" r="44" strokeWidth="1" />
      </g>
      <text fill={color} opacity="0.85" fontFamily="IBM Plex Mono, monospace" fontSize="11.5" fontWeight="600">
        {/* текст растягивается ровно на всю окружность */}
        <textPath href={`#${id}c`} textLength="362" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
      {center ? (
        <text x="80" y="85" textAnchor="middle" fill={color} opacity="0.85" fontFamily="IBM Plex Mono, monospace" fontSize="12" fontWeight="600" letterSpacing="1.5">
          {center.toUpperCase()}
        </text>
      ) : (
        <g transform="translate(56 56) scale(.75)" opacity="0.85">
          <MarkLine color={color} />
        </g>
      )}
    </svg>
  )
}
