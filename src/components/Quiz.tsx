import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ChevronRight, CircleAlert, PartyPopper, RotateCcw, ShieldQuestion, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useTx } from '../hooks/useTx'
import { waLink } from '../lib/whatsapp'
import { GoldButton, OutlineButton } from './ui/Buttons'
import { WhatsAppIcon } from './ui/Icons'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

type Result = 'ok' | 'maybe' | 'no'

function getResult(a: number[]): Result {
  const [birth, edu] = a
  if (edu === 2) return 'no'
  if (birth === 2 || edu === 1) return 'maybe'
  return 'ok'
}

// Золотые частицы-конфетти (траектории считаем один раз)
const CONFETTI = Array.from({ length: 36 }, (_, i) => ({
  x: (Math.random() - 0.5) * 520,
  y: -Math.random() * 260 - 60,
  r: Math.random() * 360,
  s: Math.random() * 0.6 + 0.6,
  d: Math.random() * 0.25,
  c: i % 4 === 0 ? '#6CC3FF' : i % 3 === 0 ? '#FFE2A8' : '#F4C46A',
  w: i % 2 ? 6 : 9,
}))

function Confetti() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 z-10">
      {CONFETTI.map((p, i) => (
        <m.span
          key={i}
          className="absolute block rounded-[2px]"
          style={{ width: p.w, height: p.w * 0.45, background: p.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: p.s }}
          animate={{ x: p.x, y: [0, p.y, p.y + 420], opacity: [1, 1, 0], rotate: p.r + 540 }}
          transition={{ duration: 2.2, delay: p.d, ease: [0.2, 0.7, 0.4, 1] }}
        />
      ))}
    </div>
  )
}

export function Quiz() {
  const { t, f } = useTx()
  const q = t.quiz
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const total = q.questions.length
  const done = answers.length === total
  const result = done ? getResult(answers) : null

  const choose = (i: number) => {
    const next = [...answers.slice(0, step), i]
    setAnswers(next)
    if (step < total - 1) setStep(step + 1)
  }
  const back = () => {
    if (step === 0) return
    setAnswers(answers.slice(0, step - 1))
    setStep(step - 1)
  }
  const restart = () => {
    setAnswers([])
    setStep(0)
  }

  const waText = done
    ? f(t.wa.quiz, {
        a1: q.questions[0].options[answers[0]],
        a2: q.questions[1].options[answers[1]],
        a3: q.questions[2].options[answers[2]],
      })
    : ''

  const slide = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      }

  const progress = done ? 1 : step / total

  return (
    <section id="check" aria-labelledby="quiz-title" className="section">
      <div className="container-x">
        <SectionHeading id="quiz-title" eyebrow={q.eyebrow} title={q.title} accent={q.titleAccent} subtitle={q.subtitle} />

        <Reveal className="mx-auto mt-10 max-w-2xl">
          <div className="glass border-gradient relative overflow-hidden p-5 sm:p-8">
            {result === 'ok' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_35%,rgba(91,227,141,.16),rgba(244,196,106,.12)_45%,transparent_75%)]"
              />
            )}
            {/* прогресс */}
            <div className="flex items-center justify-between gap-3 text-sm text-ink-muted">
              <span aria-live="polite">{done ? ' ' : f(q.progress, { n: step + 1, total })}</span>
              {!done && step > 0 && (
                <button type="button" onClick={back} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-ink-muted hover:text-ink">
                  <ArrowLeft size={16} aria-hidden="true" />
                  {q.back}
                </button>
              )}
            </div>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label={q.title}
            >
              <m.div className="h-full rounded-full bg-gradient-to-r from-gold to-sky" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.5 }} />
            </div>

            <div className="relative mt-6 min-h-[300px]">
              <AnimatePresence mode="wait" initial={false}>
                {!done ? (
                  <m.fieldset key={`q${step}`} {...slide}>
                    <legend className="font-display text-xl font-bold sm:text-2xl">{q.questions[step].q}</legend>
                    <div className="mt-5 flex flex-col gap-3">
                      {q.questions[step].options.map((opt, i) => {
                        const selected = answers[step] === i
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => choose(i)}
                            aria-pressed={selected}
                            className={`group flex min-h-[56px] w-full items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 text-left text-[15px] font-medium transition-all sm:text-base ${
                              selected
                                ? 'border-gold/60 bg-gold/10 text-ink'
                                : 'border-white/[0.08] bg-white/[0.03] text-ink hover:border-sky/40 hover:bg-sky/[0.06]'
                            }`}
                          >
                            <span>{opt}</span>
                            <ChevronRight size={18} className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-sky" aria-hidden="true" />
                          </button>
                        )
                      })}
                    </div>
                  </m.fieldset>
                ) : (
                  <m.div key="result" {...slide} role="status" className="text-center">
                    {result === 'ok' && <Confetti />}
                    <ResultIcon result={result!} />
                    <h3
                      className={`mt-5 font-display text-2xl font-bold sm:text-3xl ${
                        result === 'ok' ? 'text-gradient' : result === 'maybe' ? 'text-sky' : 'text-ink'
                      }`}
                    >
                      {q.results[result!].title}
                    </h3>
                    <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-muted">{q.results[result!].text}</p>

                    {answers[2] === 1 && result !== 'no' && (
                      <p className="mx-auto mt-4 flex max-w-md items-start gap-2 rounded-2xl border border-gold/25 bg-gold/[0.07] p-3.5 text-left text-sm text-gold-glow">
                        <TriangleAlert size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                        {q.passportNote}
                      </p>
                    )}

                    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                      {result === 'no' ? (
                        <OutlineButton href={waLink(waText)} external>
                          <WhatsAppIcon size={18} />
                          {q.results.no.btn}
                        </OutlineButton>
                      ) : (
                        <GoldButton href={waLink(waText)}>
                          <WhatsAppIcon size={18} />
                          {q.results[result!].btn}
                        </GoldButton>
                      )}
                      <button
                        type="button"
                        onClick={restart}
                        className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-medium text-ink-muted transition-colors hover:text-ink"
                      >
                        <RotateCcw size={16} aria-hidden="true" />
                        {q.restart}
                      </button>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ResultIcon({ result }: { result: Result }) {
  const styles = {
    ok: 'bg-gradient-to-br from-gold/30 to-[#5BE38D]/20 text-gold border-gold/40',
    maybe: 'bg-sky/10 text-sky border-sky/30',
    no: 'bg-white/[0.04] text-ink-muted border-white/10',
  }
  const Icon = result === 'ok' ? PartyPopper : result === 'maybe' ? ShieldQuestion : CircleAlert
  return (
    <span className={`mx-auto grid h-20 w-20 place-items-center rounded-full border ${styles[result]}`}>
      <Icon size={36} strokeWidth={1.5} aria-hidden="true" />
    </span>
  )
}
