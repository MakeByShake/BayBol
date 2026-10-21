import type { Dict } from '../i18n/ru'

const NBSP = ' '
const TZ = 'Asia/Almaty'

/** Подставляет значения в шаблон: fmt('Итого: {sum}', { sum: 5 }) */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => (key in vars ? String(vars[key]) : `{${key}}`))
}

/** 8000 → «8 000 ₸» (неразрывные пробелы) */
export function formatNumber(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
}

export function formatPrice(n: number): string {
  return `${formatNumber(n)}${NBSP}₸`
}

type DateParts = { d: number; m: number; y: number; hh: string; mm: string }

/** Разбирает дату: «2026-12-03» — как календарную дату, ISO со временем — по времени Алматы */
function parts(input: string | Date): DateParts {
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = input.split('-').map(Number)
    return { d, m: m - 1, y, hh: '00', mm: '00' }
  }
  const date = typeof input === 'string' ? new Date(input) : input
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? '0'
  return { d: Number(get('day')), m: Number(get('month')) - 1, y: Number(get('year')), hh: get('hour'), mm: get('minute') }
}

export type DateStyle = keyof Dict['dates']['formats']

/** Форматирует дату по шаблону из словаря (у казахского свои падежи месяцев) */
export function formatDate(input: string | Date, style: DateStyle, t: Dict): string {
  const { d, m, y, hh, mm } = parts(input)
  const months = t.dates.months
  return fmt(t.dates.formats[style], {
    d,
    dd: String(d).padStart(2, '0'),
    mo: String(m + 1).padStart(2, '0'),
    y,
    mNom: months.nom[m],
    mGen: months.gen[m],
    mDat: months.dat[m],
    mAbl: months.abl[m],
    time: `${hh}:${mm}`,
  }).replace(/ /g, NBSP)
}

/** Номер месяца (0–11) по времени Алматы */
export function monthIndex(input: string | Date): number {
  return parts(input).m
}

/** Русское склонение: plural(2, ['ребёнок','ребёнка','детей']) */
export function plural(n: number, forms: string[]): string {
  if (forms.length === 1) return forms[0]
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return forms[2]
  if (b > 1 && b < 5) return forms[1]
  if (b === 1) return forms[0]
  return forms[2]
}

/** Приклеивает тире к предыдущему слову, чтобы строка не начиналась с «—» */
export function nb(s: string): string {
  return s.replace(/ ([—–])/g, '\u00A0$1')
}
