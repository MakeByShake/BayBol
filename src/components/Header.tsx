import { AnimatePresence, m } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Lang } from '../config/site'
import { useTx } from '../hooks/useTx'
import { waLink } from '../lib/whatsapp'
import { Logo } from './ui/Logo'

function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useTx()
  const opts: { id: Lang; label: string }[] = [
    { id: 'ru', label: 'RU' },
    { id: 'kz', label: 'KZ' },
  ]
  return (
    <div role="group" aria-label={t.nav.lang} className={`flex rounded-lg border border-line/15 p-0.5 ${className}`}>
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setLang(o.id)}
          aria-pressed={lang === o.id}
          className={`h-8 w-10 rounded-md text-xs font-semibold tracking-wider transition-colors ${
            lang === o.id ? 'bg-ink text-night' : 'text-ink-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Header() {
  const { t, f } = useTx()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const wa = waLink(f(t.wa.general))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // на планшете при повороте в ландшафт меню может остаться открытым
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-md bg-gold px-4 py-2 font-semibold text-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t.nav.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled || open ? 'border-white/[0.07] bg-night/90 backdrop-blur-md' : 'border-transparent'
        }`}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-4">
          <a href="#top" onClick={() => setOpen(false)} className="shrink-0">
            <Logo className="h-8 w-auto sm:h-9" />
          </a>

          <nav aria-label={t.nav.main} className="hidden items-center gap-7 lg:flex">
            {t.nav.links.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LangSwitch className="hidden sm:flex" />
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-1.5 rounded-[10px] bg-gold px-4 text-sm font-semibold text-night transition-colors hover:bg-gold-glow md:inline-flex"
            >
              {t.nav.apply}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              className="grid h-10 w-10 place-items-center rounded-lg border border-line/15 text-ink lg:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-night px-4 pb-8 pt-[84px] sm:px-6 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav aria-label={t.nav.main} className="flex flex-col">
              {t.nav.links.map((l, i) => (
                <m.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.04, duration: 0.3 }}
                  className="flex items-baseline gap-4 border-b border-white/[0.07] py-4 text-2xl font-semibold text-ink sm:text-3xl"
                >
                  <span className="text-xs font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </m.a>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4 pt-10">
              <LangSwitch className="self-start sm:hidden" />
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-[10px] bg-gold text-base font-semibold text-night"
              >
                {t.nav.apply}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
