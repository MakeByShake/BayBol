import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatPrice } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { WhatsAppIcon } from './ui/Icons'

/** Плавающая кнопка WhatsApp (оба менеджера) + липкая нижняя панель на мобильных */
export function FloatingWhatsApp() {
  const { t, f } = useTx()
  const [open, setOpen] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <div
        ref={boxRef}
        className={`fixed right-4 z-[60] flex flex-col items-end gap-3 transition-all duration-300 sm:right-6 ${
          showBar ? 'bottom-[92px] lg:bottom-6' : 'invisible bottom-5 translate-y-4 opacity-0 sm:bottom-6 lg:visible lg:translate-y-0 lg:opacity-100'
        }`}
      >
        <AnimatePresence>
          {open && (
            <m.div
              id="wa-panel"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="glass w-[260px] origin-bottom-right bg-night-card/95 p-3 shadow-2xl"
            >
              <p className="px-2 pb-2 pt-1 text-sm font-semibold text-ink-muted">{t.float.title}</p>
              {SITE.whatsapp.map((w, i) => (
                <a
                  key={w.number}
                  href={waLink(f(t.wa.general), i)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-white/[0.06]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-wa text-[#06210f]">
                    <WhatsAppIcon size={20} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-ink">{f(t.contacts.manager, { n: i + 1 })}</span>
                    <span className="block text-sm text-ink-muted">{w.display}</span>
                  </span>
                </a>
              ))}
            </m.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="wa-panel"
          aria-label={open ? t.float.close : t.float.open}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,.6)] transition-transform hover:scale-105 active:scale-95"
        >
          {!open && <span aria-hidden="true" className="absolute inset-0 animate-ping2 rounded-full bg-wa/40 [animation-duration:2.4s]" />}
          {open ? <X size={26} aria-hidden="true" /> : <WhatsAppIcon size={30} className="relative" />}
        </button>
      </div>

      {/* липкая панель внизу — только мобильные/планшеты */}
      <div
        className={`pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-night/85 px-4 pt-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          showBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <a
          href={waLink(f(t.wa.general))}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={showBar ? 0 : -1}
          className="relative mb-3 flex h-[52px] items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-gold-glow to-gold text-[15px] font-semibold text-night"
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <WhatsAppIcon size={20} className="relative" />
          <span className="relative">{f(t.float.sticky, { price: formatPrice(SITE.prices.single) })}</span>
        </a>
      </div>
    </>
  )
}
