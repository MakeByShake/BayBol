import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { PointerEvent } from 'react'
import { DV } from '../config/dv'
import { useTx } from '../hooks/useTx'
import { LogoMark } from './ui/Logo'

/** Стилизованная карточка «Diversity Visa» — не копия настоящей карты */
export function GreenCard() {
  const { t, f } = useTx()
  const c = t.hero.card
  const reduce = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 150, damping: 18 })
  const sy = useSpring(py, { stiffness: 150, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], [-14, 14])
  const rotateX = useTransform(sy, [0, 1], [10, -10])
  const glareX = useTransform(sx, [0, 1], [0, 100])
  const glareY = useTransform(sy, [0, 1], [0, 100])
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255,255,255,.22), transparent 55%)`
  const holo = useTransform(sx, [0, 1], [0, 140])
  const holoBg = useMotionTemplate`conic-gradient(from ${holo}deg, #6CC3FF, #BFE6FF, #F4C46A, #6CC3FF, #2E8FD6, #6CC3FF)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const year = Number(DV.visasUntil.slice(0, 4))

  return (
    <div className="relative mx-auto w-full max-w-[460px] [perspective:1200px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      {/* свечение под карточкой */}
      <div aria-hidden="true" className="absolute inset-x-8 -bottom-6 h-16 rounded-full bg-sky/30 blur-3xl" />
      <div className={reduce ? '' : 'animate-float'}>
        <m.div
          role="img"
          aria-label={c.aria}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative aspect-[1.586] w-full overflow-hidden rounded-[22px] border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8),0_0_0_1px_rgba(108,195,255,.15)]"
        >
          {/* фон: ночь + гильош */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#17305C_0%,#0F1D3F_45%,#0A1430_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'repeating-radial-gradient(circle at 85% 120%, transparent 0 9px, rgba(191,230,255,.6) 9px 10px), repeating-linear-gradient(115deg, transparent 0 14px, rgba(244,196,106,.25) 14px 15px)',
            }}
          />
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gold/25 blur-3xl" />
          <m.div className="absolute inset-0" style={{ background: glare }} />

          <div className="relative flex h-full flex-col p-[5.5%] text-[clamp(7px,2.1vw,10px)] text-ink">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-[1.55em] font-bold tracking-[0.16em] text-gold">{c.top}</p>
                <p className="mt-[0.3em] text-[1em] font-semibold tracking-[0.3em] text-sky-glow/80">{c.resident}</p>
              </div>
              <span className="rounded-full border border-gold/50 bg-gold/10 px-[0.9em] py-[0.35em] font-display text-[1.2em] font-bold text-gold">
                {f(c.program)}
              </span>
            </div>

            <div className="mt-auto flex items-end gap-[5%]">
              {/* силуэт-заглушка */}
              <div className="relative aspect-[0.8] w-[26%] shrink-0 overflow-hidden rounded-[10px] border border-white/20 bg-gradient-to-b from-sky-glow/30 to-sky/10">
                <svg viewBox="0 0 80 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <circle cx="40" cy="38" r="17" fill="rgba(245,247,255,.55)" />
                  <path d="M10 100c2-22 14-32 30-32s28 10 30 32Z" fill="rgba(245,247,255,.55)" />
                </svg>
              </div>
              <div className="min-w-0 flex-1 space-y-[0.7em] font-mono uppercase">
                <div>
                  <p className="text-[0.85em] tracking-[0.18em] text-ink-muted">{c.nameLabel}</p>
                  <p className="text-[1.3em] font-semibold tracking-[0.12em]">{c.name}</p>
                </div>
                <div className="flex gap-[8%]">
                  <div>
                    <p className="text-[0.85em] tracking-[0.18em] text-ink-muted">{c.countryLabel}</p>
                    <p className="text-[1.15em] font-semibold tracking-[0.1em]">{c.country}</p>
                  </div>
                  <div>
                    <p className="text-[0.85em] tracking-[0.18em] text-ink-muted">{c.categoryLabel}</p>
                    <p className="text-[1.15em] font-semibold tracking-[0.1em]">{c.category}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[0.85em] tracking-[0.18em] text-ink-muted">{c.sinceLabel}</p>
                  <p className="text-[1.15em] font-semibold tracking-[0.1em]">{f(c.since, { year })}</p>
                </div>
              </div>
              <div className="flex w-[18%] shrink-0 flex-col items-center gap-[0.8em] self-stretch">
                {/* золотой чип */}
                <div className="relative aspect-[1.25] w-full rounded-[8px] bg-gradient-to-br from-gold-glow via-gold to-gold-deep shadow-[inset_0_0_0_1px_rgba(0,0,0,.15)]">
                  <div className="absolute inset-[18%] rounded-[4px] border border-black/20" />
                  <div className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-black/20" />
                </div>
                {/* голограмма */}
                <m.div className="mt-auto aspect-square w-full rounded-full opacity-80 mix-blend-screen" style={{ background: holoBg }}>
                  <div className="grid h-full w-full place-items-center rounded-full bg-night/30">
                    <LogoMark size={22} />
                  </div>
                </m.div>
              </div>
            </div>
          </div>
        </m.div>
      </div>
      <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-ink-muted/70">{c.note}</p>
    </div>
  )
}
