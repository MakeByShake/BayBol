import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { SITE } from '../config/site'
import { useTx } from '../hooks/useTx'

export function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, f } = useTx()
  const p = t.privacy
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      prevFocus?.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-night/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            className="glass relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-b-none bg-night-card p-6 sm:rounded-3xl sm:p-8"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="privacy-title" className="text-xl font-bold sm:text-2xl">
                {p.title}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={p.close}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-ink-muted hover:text-ink"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-muted">
              {p.paragraphs.map((para, i) => (
                <p key={i}>{f(para, { legal: SITE.company.legalName })}</p>
              ))}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
