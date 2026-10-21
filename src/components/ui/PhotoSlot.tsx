import { useState, type ReactNode } from 'react'

/**
 * Фото, которое заказчик положит в public/ позже.
 * Пока файла нет — показывается стильная заглушка (градиент + иконка).
 */
export function PhotoSlot({ src, alt, icon, className = '' }: { src: string; alt: string; icon: ReactNode; className?: string }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/[0.08] ${className}`}>
      {(!loaded || failed) && (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_90%_at_20%_0%,rgba(108,195,255,.28),transparent_55%),radial-gradient(100%_80%_at_100%_100%,rgba(244,196,106,.3),transparent_60%),#111A33]">
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-ink">{icon}</span>
            <span className="text-sm font-medium text-ink-muted">{alt}</span>
          </div>
        </div>
      )}
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}
