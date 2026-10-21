import { AnimatePresence, m } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DV } from '../config/dv'
import type { Lang } from '../config/site'
import { useTx } from '../hooks/useTx'
import { fmt } from '../lib/format'
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
    <div role="group" aria-label={t.nav.lang} className={`relative flex rounded-full border border-white/10 bg-white/[0.04] p-1 ${className}`}>
      <span
        aria-hidden="true"
        className="absolute left-1 top-1 h-8 w-[42px] rounded-full bg-gold transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${lang === 'kz' ? 42 : 0}px)` }}
      />
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setLang(o.id)}
          aria-pressed={lang === o.id}
          className={`relative h-8 w-[42px] rounded-full text-xs font-bold tracking-wider transition-colors ${
            lang === o.id ? 'text-night' : 'text-ink-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Header() {
  const { t } = useTx()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const wa = waLink(fmt(t.wa.general, { program: DV.programName }))

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

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-gold px-4 py-2 font-semibold text-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t.nav.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open ? 'border-b border-white/[0.06] bg-night/70 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-4">
          <a href="#top" onClick={() => setOpen(false)} className="rounded-xl">
            <Logo />
          </a>

          <nav aria-label={t.nav.main} className="hidden items-center gap-1 lg:flex">
            {t.nav.links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="rounded-full px-3.5 py-2 text-[15px] font-medium text-ink-muted transition-colors hover:bg-white/[0.05] hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LangSwitch className="hidden sm:flex" />
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full bg-wa px-4 text-sm font-semibold text-[#06210f] transition-transform hover:scale-[1.03] md:inline-flex"
            >
              <WhatsAppIcon size={18} />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink lg:hidden"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-night/95 px-4 pb-8 pt-[88px] backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
            <nav aria-label={t.nav.main} className="relative flex flex-col">
              {t.nav.links.map((l, i) => (
                <m.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                  className="border-b border-white/[0.06] py-4 font-display text-2xl font-semibold text-ink"
                >
                  {l.label}
                </m.a>
              ))}
            </nav>
            <m.div
              className="relative mt-auto flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <LangSwitch className="self-start" />
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-wa text-base font-semibold text-[#06210f]"
              >
                <WhatsAppIcon size={22} />
                {t.nav.apply}
              </a>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
