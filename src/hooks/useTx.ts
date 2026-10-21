import { useCallback, useMemo } from 'react'
import { DV, OPENS_AT } from '../config/dv'
import { SITE } from '../config/site'
import { useLang } from '../i18n/LanguageContext'
import { fmt, formatDate, formatNumber, formatPrice } from '../lib/format'

/** Словарь + функция f(), которая подставляет в текст цены, даты и прочие значения из config */
export function useTx() {
  const { t, lang, setLang } = useLang()

  const vars = useMemo(
    () => ({
      program: DV.programName,
      fee: DV.feeUsd,
      days: DV.registrationDays,
      price: formatPrice(SITE.prices.single),
      couple: formatPrice(SITE.prices.couple),
      child: formatPrice(SITE.prices.child),
      visas: formatNumber(DV.visasPerYear),
      site: DV.officialSite.replace(/^https?:\/\//, ''),
      openDate: formatDate(OPENS_AT, 'noLater', t),
      courtCase: DV.courtCase,
      payment: SITE.paymentMethods[lang],
    }),
    [t, lang],
  )

  const f = useCallback(
    (template: string, extra: Record<string, string | number> = {}) => fmt(template, { ...vars, ...extra }),
    [vars],
  )

  return { t, lang, setLang, f, vars }
}
