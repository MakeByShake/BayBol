import { useEffect, useState } from 'react'
import { CLOSES_AT, OPENS_AT, getPhase, type DvPhase } from '../config/dv'

export type Countdown = {
  phase: DvPhase
  days: number
  hours: number
  minutes: number
  seconds: number
}

function compute(now: number): Countdown {
  const phase = getPhase(now)
  const target = phase === 'before' ? OPENS_AT.getTime() : CLOSES_AT.getTime()
  const diff = Math.max(0, target - now)
  const s = Math.floor(diff / 1000)
  return {
    phase,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

/** Обратный отсчёт: расчёт от UTC, тикает раз в секунду */
export function useCountdown(): Countdown {
  const [state, setState] = useState(() => compute(Date.now()))
  useEffect(() => {
    const id = window.setInterval(() => setState(compute(Date.now())), 1000)
    return () => window.clearInterval(id)
  }, [])
  return state
}
