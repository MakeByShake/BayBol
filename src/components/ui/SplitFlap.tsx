import { useEffect, useRef } from 'react'

/** Одна перекидная ячейка: при смене символа верхняя половина падает, нижняя открывает новый */
function Flap({ ch }: { ch: string }) {
  const prev = useRef(ch)
  // eslint-disable-next-line react-hooks/refs -- предыдущий символ нужен именно на этот рендер
  const old = prev.current
  useEffect(() => {
    prev.current = ch
  }, [ch])
  const flipping = old !== ch
  return (
    <span className="flap" aria-hidden="true">
      <span className="top">
        <i>{ch}</i>
      </span>
      <span className="bottom">
        <i>{flipping ? old : ch}</i>
      </span>
      {flipping && (
        <>
          <span key={`t${ch}`} className="fold-top">
            <i>{old}</i>
          </span>
          <span key={`b${ch}`} className="fold-bottom">
            <i>{ch}</i>
          </span>
        </>
      )}
    </span>
  )
}

/** Строка перекидных символов, как на табло аэропорта. label — то, что прочитает скринридер */
export function SplitFlap({ value, label, className = '' }: { value: string; label?: string; className?: string }) {
  return (
    <span className={`inline-flex gap-[0.08em] font-mono font-medium ${className}`} role="text" aria-label={label ?? value}>
      {value.split('').map((ch, i) => (
        <Flap key={i} ch={ch} />
      ))}
    </span>
  )
}
