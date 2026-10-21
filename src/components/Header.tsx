import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Lang } from '../config/site'
import { useTx } from '../hooks/useTx'
import { waLink } from '../lib/whatsapp'
import { WhatsAppIcon } from './ui/Icons'
import { Logo } from './ui/Logo'

function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useTx()
  const opts: { id: Lang; label: string }[] = [
    { id: 'ru', label: 'RU' },
    { id: 'kz', label: 'KZ' },
  ]
  return (
    <div role="group" aria-label={t.nav.lang} className={`flex items-center font-mono text-[13px] ${className}`}>
      {opts.map((o, i) => (
        <span key={o.id} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1 text-ink-2">
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => setLang(o.id)}
            aria-pressed={lang === o.id}
            className={`min-h-[44px] px-1.5 font-medium transition-colors ${
              lang === o.id ? 'text-ink underline decoration-gold decoration-2 underline-offset-[6px]' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        </span>
      ))}
    </div>
  )
}

export function Header() {
  const { t, f } = useTx()
  const [open, setOpen] = useState(false)
  const wa = waLink(f(t.wa.general))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const mq = window.matchMedia('(min-width: 1024px)')
    const onMq = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  return (
    <>
      <a href="#main" className="sr-only z-[100] bg-gold px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t.nav.skip}
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-paper rule">
        <div className="w-full-x flex h-16 items-center justify-between gap-6">
          <a href="#top" onClick={() => setOpen(false)} className="shrink-0">
            <Logo className="h-7 w-auto sm:h-8" />
          </a>

          <nav aria-label={t.nav.main} className="hidden items-center gap-7 lg:flex">
            {t.nav.links.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="text-[15px] text-ink-2 transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <LangSwitch className="hidden sm:flex" />
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ink hidden md:inline-flex">
              <WhatsAppIcon size={17} />
              {t.nav.whatsapp}
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              className="grid h-11 w-11 place-items-center text-ink lg:hidden"
            >
              {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="lay fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper px-4 pb-8 pt-24 sm:px-8 lg:hidden" style={{ animationDuration: '200ms' }}>
          <nav aria-label={t.nav.main} className="flex flex-col">
            {t.nav.links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="border-b py-4 font-serif text-[32px] font-light leading-tight text-ink rule"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-5 pt-10">
            <LangSwitch className="sm:hidden" />
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
              <WhatsAppIcon size={19} />
              {t.nav.whatsapp}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
