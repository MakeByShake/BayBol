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

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        className="doc lay relative max-h-[88vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-10"
        style={{ animationDuration: '200ms' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink pb-4">
          <h2 id="privacy-title" className="font-serif text-[26px] font-light sm:text-[32px]">
            {p.title}
          </h2>
          <button ref={closeRef} type="button" onClick={onClose} className="min-h-[44px] font-mono text-[14px] underline underline-offset-4">
            {p.close}
          </button>
        </div>
        <div className="mt-6 space-y-4 text-[16px] leading-relaxed">
          {p.paragraphs.map((para, i) => (
            <p key={i}>{f(para, { legal: SITE.company.legalName })}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
