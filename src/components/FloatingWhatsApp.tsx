import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'
import { formatPrice } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { WhatsAppIcon } from './ui/Icons'

/** Компьютер: небольшая зелёная кнопка (оба менеджера). Телефон: нижняя полоса на бумаге. */
export function FloatingWhatsApp() {
  const { t, f } = useTx()
  const [open, setOpen] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => boxRef.current && !boxRef.current.contains(e.target as Node) && setOpen(false)
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
      <div ref={boxRef} className="fixed bottom-6 right-6 z-[60] hidden flex-col items-end gap-3 lg:flex">
        {open && (
          <div id="wa-panel" className="doc lay w-[270px] p-2" style={{ animationDuration: '160ms' }}>
            <p className="px-3 pb-1 pt-2 font-mono text-[12px] text-ink-2">{t.float.title}</p>
            {SITE.whatsapp.map((w, i) => (
              <a
                key={w.number}
                href={waLink(f(t.wa.general), i)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 border-t px-3 py-3 rule hover:text-sky-ink"
              >
                <span className="text-[15px]">{f(t.contacts.manager, { n: i + 1 })}</span>
                <span className="font-mono text-[14px]">{w.display}</span>
              </a>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="wa-panel"
          aria-label={open ? t.float.close : t.float.open}
          className="grid h-12 w-12 place-items-center rounded-full bg-wa text-white transition-transform hover:scale-105"
        >
          {open ? <X size={22} aria-hidden="true" /> : <WhatsAppIcon size={24} />}
        </button>
      </div>

      {/* телефон и планшет: нижняя полоса */}
      <div
        className={`pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-ink bg-paper px-4 pt-3 transition-transform duration-300 lg:hidden ${showBar ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <a href={waLink(f(t.wa.general))} target="_blank" rel="noopener noreferrer" tabIndex={showBar ? 0 : -1} className="btn-gold mb-3 w-full">
          {f(t.float.sticky, { price: formatPrice(SITE.prices.single) })}
        </a>
      </div>
    </>
  )
}
