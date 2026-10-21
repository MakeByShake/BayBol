import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useTx } from '../hooks/useTx'
import { waLink } from '../lib/whatsapp'
import { GoldButton, OutlineButton } from './ui/Buttons'
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
const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  x: (Math.random() - 0.5) * 460,
  y: -Math.random() * 220 - 60,
  r: Math.random() * 360,
  s: Math.random() * 0.6 + 0.6,
  d: Math.random() * 0.2,
  c: i % 4 === 0 ? '#2E8FD6' : i % 3 === 0 ? '#C8932E' : '#F4C46A',
  w: i % 2 ? 6 : 9,
}))

function Confetti() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/4 z-10">
      {CONFETTI.map((p, i) => (
        <m.span
          key={i}
          className="absolute block rounded-[2px]"
          style={{ width: p.w, height: p.w * 0.45, background: p.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: p.s }}
          animate={{ x: p.x, y: [0, p.y, p.y + 380], opacity: [1, 1, 0], rotate: p.r + 540 }}
          transition={{ duration: 2, delay: p.d, ease: [0.2, 0.7, 0.4, 1] }}
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
    setAnswers([...answers.slice(0, step), i])
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
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
      }

  const resultColor = result === 'ok' ? 'text-[#1F7A47]' : result === 'maybe' ? 'text-link' : 'text-ink'

  return (
    <section id="check" aria-labelledby="quiz-title" className="section tone-light">
      <div className="container-x">
        <SectionHeading n="03" id="quiz-title" eyebrow={q.eyebrow} title={q.title} accent={q.titleAccent} subtitle={q.subtitle} />

        <Reveal className="mt-10 sm:mt-12">
          <div className="card relative grid overflow-hidden lg:grid-cols-[1.5fr_1fr]">
            {/* левая часть — вопрос или результат */}
            <div className="relative p-5 sm:p-8 lg:p-10">
              {/* прогресс сегментами */}
              <div className="flex items-center justify-between gap-3">
                <p className="label" aria-live="polite">
                  {done ? q.summary : f(q.progress, { n: step + 1, total })}
                </p>
                {!done && step > 0 && (
                  <button type="button" onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink">
                    <ArrowLeft size={16} aria-hidden="true" />
                    {q.back}
                  </button>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done ? total : step} aria-label={q.title}>
                {q.questions.map((_, i) => (
                  <span key={i} className={`h-1 rounded-full transition-colors duration-300 ${done || i < step ? 'bg-gold-deep' : i === step ? 'bg-gold' : 'bg-line/10'}`} />
                ))}
              </div>

              <div className="relative mt-7 min-h-[280px]">
                <AnimatePresence mode="wait" initial={false}>
                  {!done ? (
                    <m.fieldset key={`q${step}`} {...slide}>
                      <legend className="text-2xl font-semibold sm:text-[28px]">{q.questions[step].q}</legend>
                      <div className="mt-6 border-t border-line/10">
                        {q.questions[step].options.map((opt, i) => {
                          const selected = answers[step] === i
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => choose(i)}
                              aria-pressed={selected}
                              className={`group flex min-h-[60px] w-full items-center justify-between gap-4 border-b border-line/10 px-1 py-4 text-left text-[15px] font-medium transition-colors sm:text-base ${
                                selected ? 'text-accent' : 'hover:bg-line/[0.03]'
                              }`}
                            >
                              <span className="flex items-baseline gap-4">
                                <span className="text-xs font-semibold text-ink-muted">{String.fromCharCode(65 + i)}</span>
                                {opt}
                              </span>
                              <ArrowRight size={18} className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true" />
                            </button>
                          )
                        })}
                      </div>
                    </m.fieldset>
                  ) : (
                    <m.div key="result" {...slide} role="status">
                      {result === 'ok' && <Confetti />}
                      <h3 className={`text-[28px] font-semibold sm:text-4xl ${resultColor}`}>{q.results[result!].title}</h3>
                      <p className="mt-3 max-w-lg leading-relaxed text-ink-muted">{q.results[result!].text}</p>

                      {answers[2] === 1 && result !== 'no' && (
                        <p className="mt-5 flex max-w-lg items-start gap-2.5 border-l-2 border-gold-deep bg-gold/10 px-4 py-3 text-sm text-ink">
                          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                          {q.passportNote}
                        </p>
                      )}

                      <div className="mt-8 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center">
                        {result === 'no' ? (
                          <OutlineButton href={waLink(waText)} external>
                            {q.results.no.btn}
                            <ArrowUpRight size={17} aria-hidden="true" />
                          </OutlineButton>
                        ) : (
                          <GoldButton href={waLink(waText)}>
                            {q.results[result!].btn}
                            <ArrowUpRight size={17} aria-hidden="true" />
                          </GoldButton>
                        )}
                        <button
                          type="button"
                          onClick={restart}
                          className="inline-flex h-12 items-center justify-center gap-2 px-3 text-[15px] font-medium text-ink-muted transition-colors hover:text-ink"
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

            {/* правая часть — сводка ответов */}
            <aside className="border-t border-line/10 bg-[#0B2233] p-5 text-[#F5F7FF] sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A9B3D1]">{q.summary}</p>
              <dl className="mt-5">
                {q.short.map((label, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3.5 text-sm">
                    <dt className="text-[#A9B3D1]">{label}</dt>
                    <dd className={`text-right font-medium ${answers[i] === undefined ? 'text-[#A9B3D1]/60' : 'text-[#F5F7FF]'}`}>
                      {answers[i] === undefined ? q.pending : q.questions[i].options[answers[i]]}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
