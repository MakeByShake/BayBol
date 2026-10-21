import { useState } from 'react'
import { useTx } from '../hooks/useTx'
import { waLink } from '../lib/whatsapp'
import { DocNo } from './ui/Doc'
import { GuillocheBand } from './ui/Guilloche'

type Result = 'ok' | 'maybe' | 'no'

function getResult(a: (number | undefined)[]): Result {
  const [birth, edu] = a
  if (edu === 2) return 'no'
  if (birth === 2 || edu === 1) return 'maybe'
  return 'ok'
}

const STAMP_COLOR: Record<Result, string> = {
  ok: 'text-sky-ink border-sky-ink',
  maybe: 'text-gold-ink border-gold-ink',
  no: 'text-ink-2 border-ink-2',
}

/** Квадратик, в котором галочка «прорисовывается» чернилами */
function Box({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden="true" className="relative mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center border-[1.5px] border-ink bg-paper-2">
      {checked && (
        <svg viewBox="0 0 24 24" className="absolute -left-0.5 -top-1.5 h-7 w-7">
          <path
            d="M4 13 C 6 15, 8 17, 10 20 C 13 13, 17 7, 22 2"
            fill="none"
            stroke="#14213A"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className="ink-check"
          />
        </svg>
      )}
    </span>
  )
}

export function Quiz() {
  const { t, f } = useTx()
  const q = t.quiz
  const [answers, setAnswers] = useState<(number | undefined)[]>([undefined, undefined, undefined])
  const [round, setRound] = useState(0) // чтобы штамп «ударял» заново после сброса
  const done = answers.every((a) => a !== undefined)
  const result = done ? getResult(answers) : null

  const choose = (qi: number, oi: number) => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))
  const restart = () => {
    setAnswers([undefined, undefined, undefined])
    setRound((r) => r + 1)
  }

  const waText = done
    ? f(t.wa.quiz, {
        a1: q.questions[0].options[answers[0]!],
        a2: q.questions[1].options[answers[1]!],
        a3: q.questions[2].options[answers[2]!],
      })
    : ''

  return (
    <section id="check" aria-labelledby="quiz-title" className="border-t py-20 rule sm:py-28">
      <div className="w-wide">
        <DocNo n={3} label={t.sections.check} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div>
            <h2 id="quiz-title" className="h-section">
              {q.title}
            </h2>
            <p className="mt-6 max-w-[28rem] text-ink-2">{q.hint}</p>
          </div>

          {/* лист анкеты */}
          <div className="doc relative overflow-hidden">
            <header className="flex flex-wrap items-baseline justify-between gap-2 border-b px-5 py-4 rule sm:px-8">
              <p className="font-serif text-[22px]">{q.sheetTitle}</p>
              <p className="font-mono text-[12px] text-ink-2">{q.sheetSub}</p>
            </header>

            <div className="px-5 pb-6 sm:px-8">
              {q.questions.map((qq, qi) => (
                <fieldset key={qi} className="border-b py-5 rule last:border-b-0">
                  <legend className="float-left mb-3 flex w-full items-baseline gap-3 font-semibold">
                    <span className="font-mono text-[13px] font-medium text-ink-2">{qi + 1}.</span>
                    {qq.q}
                  </legend>
                  <div role="radiogroup" aria-label={qq.q} className="clear-left">
                    {qq.options.map((opt, oi) => {
                      const checked = answers[qi] === oi
                      return (
                        <button
                          key={oi}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          onClick={() => choose(qi, oi)}
                          className="flex min-h-[48px] w-full items-start gap-3.5 py-2.5 text-left text-[16px] transition-colors hover:text-sky-ink sm:text-[17px]"
                        >
                          <Box checked={checked} />
                          <span className={checked ? 'font-medium text-ink' : 'text-ink'}>{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            {/* результат: штамп на лист */}
            <div className="relative border-t border-dashed px-5 py-6 rule sm:px-8" aria-live="polite">
              <GuillocheBand className="pointer-events-none absolute inset-0 h-full w-full" opacity={0.35} />
              {result ? (
                <div key={`${round}-${result}`} className="relative grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="max-w-[30rem]">{q.results[result].text}</p>
                    {answers[2] === 1 && result !== 'no' && <p className="mt-3 max-w-[30rem] text-[15px] text-ink-2">{q.passportNote}</p>}
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <a href={waLink(waText)} target="_blank" rel="noopener noreferrer" className={result === 'no' ? 'btn-ink' : 'btn-gold'}>
                        {q.results[result].btn}
                      </a>
                      <button type="button" onClick={restart} className="link min-h-[44px] text-[15px]">
                        {q.restart}
                      </button>
                    </div>
                  </div>
                  <span
                    className={`stamp stamp-hit order-first justify-self-start bg-paper-2/80 text-[20px] sm:order-none sm:justify-self-end sm:text-[24px] ${STAMP_COLOR[result]}`}
                    style={{ ['--rot' as string]: '-7deg' }}
                  >
                    {q.stamps[result]}
                  </span>
                </div>
              ) : (
                <p className="relative font-mono text-[13px] text-ink-2">{answers.filter((a) => a !== undefined).length} / 3</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
