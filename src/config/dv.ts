// ============================================================
//  ДАТЫ И ФАКТЫ ЛОТЕРЕИ — когда Госдеп объявит точные даты,
//  поменяйте нужную строку здесь. Всё на сайте пересчитается само.
// ============================================================

export const DV = {
  programName: 'DV-2027',
  registrationOpensAt: '2026-11-01T00:00:00-05:00', // по решению суда — не позднее 1 ноября (по времени Вашингтона)
  registrationDays: 30,
  registrationClosesAt: null as string | null, // если null — считать как opensAt + 30 дней
  resultsBy: '2026-12-03', // по решению суда уведомить отобранных до 3 декабря 2026
  visasUntil: '2027-09-30',
  feeUsd: 1,
  officialSite: 'https://dvprogram.state.gov',
  datesAnnouncedBy: '2026-10-29', // по решению суда Госдеп должен объявить точные даты до этого дня
  courtCase: 'Red Eagle Law v. Rubio',
  courtDate: '2026-10-14',
  factsCheckedAt: '2026-10-21',
  visasPerYear: 55000, // до 55 000 грин-карт в год по всему миру
}

export const OPENS_AT = new Date(DV.registrationOpensAt)
export const CLOSES_AT = DV.registrationClosesAt
  ? new Date(DV.registrationClosesAt)
  : new Date(OPENS_AT.getTime() + DV.registrationDays * 24 * 60 * 60 * 1000)

export type DvPhase = 'before' | 'open' | 'closed'

export function getPhase(now: number = Date.now()): DvPhase {
  if (now < OPENS_AT.getTime()) return 'before'
  if (now < CLOSES_AT.getTime()) return 'open'
  return 'closed'
}
