import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
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
  const sx = useSpring(px, { stiffness: 120, damping: 20 })
  const sy = useSpring(py, { stiffness: 120, damping: 20 })
  const rotateY = useTransform(sx, [0, 1], [-8, 8])
  const rotateX = useTransform(sy, [0, 1], [6, -6])

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
  const field = (label: string, value: string) => (
    <div>
      <p className="text-[0.82em] tracking-[0.16em] text-[#8E9AB8]">{label}</p>
      <p className="mt-[0.15em] text-[1.15em] font-semibold tracking-[0.08em] text-[#EEF2FB]">{value}</p>
    </div>
  )

  return (
    <div className="relative w-full [perspective:1200px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <m.div
        role="img"
        aria-label={c.aria}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative aspect-[1.586] w-full overflow-hidden rounded-[18px] border border-white/10 bg-[#13254A] shadow-[0_40px_80px_-40px_rgba(0,0,0,.9)]"
      >
        {/* тонкий гильош */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: 'repeating-radial-gradient(circle at 90% 115%, transparent 0 10px, rgba(191,230,255,.7) 10px 11px)' }}
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[22%] bg-[#0E1C3A]" />

        <div className="relative flex h-full flex-col p-[5.5%] font-mono text-[clamp(7px,2.2vw,10px)] uppercase">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[1.5em] font-semibold tracking-[0.18em] text-gold">{c.top}</p>
            <p className="font-sans text-[1.2em] font-semibold tracking-[0.1em] text-[#EEF2FB]">{f(c.program)}</p>
          </div>
          <p className="mt-[4%] text-[1em] tracking-[0.3em] text-[#8E9AB8]">{c.resident}</p>

          <div className="mt-auto flex items-end gap-[5%]">
            {/* силуэт-заглушка */}
            <div className="relative aspect-[0.8] w-[25%] shrink-0 overflow-hidden rounded-[6px] bg-[#2A4170]">
              <svg viewBox="0 0 80 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <circle cx="40" cy="38" r="17" fill="#6F86B4" />
                <path d="M10 100c2-22 14-32 30-32s28 10 30 32Z" fill="#6F86B4" />
              </svg>
            </div>
            <div className="min-w-0 flex-1 space-y-[0.8em]">
              {field(c.nameLabel, c.name)}
              <div className="flex gap-[10%]">
                {field(c.countryLabel, c.country)}
                {field(c.categoryLabel, c.category)}
              </div>
              {field(c.sinceLabel, f(c.since, { year }))}
            </div>
            <div className="flex w-[17%] shrink-0 flex-col items-center gap-[1em] self-stretch">
              {/* золотой чип */}
              <div className="relative aspect-[1.25] w-full rounded-[5px] bg-gradient-to-br from-gold-glow to-gold-deep">
                <div className="absolute inset-[20%] rounded-[3px] border border-black/20" />
                <div className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
              </div>
              <div className="mt-auto grid aspect-square w-full place-items-center rounded-full border border-white/15">
                <LogoMark size={22} />
              </div>
            </div>
          </div>
        </div>
      </m.div>
      <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-ink-muted/70">{c.note}</p>
    </div>
  )
}
