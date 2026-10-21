import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DV } from '../config/dv'
import { SITE, type Lang } from '../config/site'
import { fmt, formatPrice, nb } from '../lib/format'
import { kz } from './kz'
import { ru, type Dict } from './ru'

/** Во всех текстах приклеиваем тире к предыдущему слову (строка не начнётся с «—») */
function glueDashes<T>(value: T): T {
  if (typeof value === 'string') return nb(value) as T
  if (Array.isArray(value)) return value.map(glueDashes) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, glueDashes(v)])) as T
  }
  return value
}

const DICTS: Record<Lang, Dict> = { ru: glueDashes(ru), kz: glueDashes(kz) }
const STORAGE_KEY = 'bb-lang'

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void }

const LanguageContext = createContext<Ctx | null>(null)

function readSaved(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'ru' || v === 'kz') return v
  } catch {
    /* хранилище недоступно — используем русский */
  }
  return 'ru'
}

function setMeta(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute('content', content)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readSaved)
  const t = DICTS[lang]

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ничего страшного */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru'
    const vars = { price: formatPrice(SITE.prices.single), program: DV.programName, fee: DV.feeUsd }
    const title = fmt(t.meta.title, vars)
    const description = fmt(t.meta.description, vars)
    document.title = title
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:locale"]', lang === 'kz' ? 'kk_KZ' : 'ru_RU')
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
  }, [lang, t])

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): Ctx {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
