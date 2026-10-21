import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { startTransition, useCallback, useEffect, useRef, useState } from 'react'
import { Benefits } from './components/Benefits'
import { Board } from './components/Board'
import { Compare } from './components/Compare'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { FlightPath } from './components/FlightPath'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Guarantees } from './components/Guarantees'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { How } from './components/How'
import { Included } from './components/Included'
import { Mistakes } from './components/Mistakes'
import { News } from './components/News'
import { Photo } from './components/Photo'
import { Pricing } from './components/Pricing'
import { PrivacyModal } from './components/PrivacyModal'
import { Quiz } from './components/Quiz'
import { Route } from './components/Route'
import { Stats } from './components/Stats'
import { Trust } from './components/Trust'

export default function App() {
  const routeRef = useRef<HTMLDivElement>(null)
  const landingRef = useRef<HTMLSpanElement>(null)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const closePrivacy = useCallback(() => setPrivacyOpen(false), [])

  // Первый экран рисуем сразу, остальное — в фоне в два этапа, не блокируя страницу
  const [stage, setStage] = useState(0)
  useEffect(() => {
    if (stage >= 2) return
    const next = () => startTransition(() => setStage((s) => s + 1))
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(next, { timeout: 1200 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(next, 200)
    return () => window.clearTimeout(id)
  }, [stage])

  // Если открыли ссылку с якорем (#faq и т.п.) — докручиваем, когда блок появился
  useEffect(() => {
    if (stage < 2 || !location.hash) return
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
  }, [stage])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Header />
        <main id="main">
          {/* всё, над чем пролетает самолётик; isolate — чтобы линия маршрута шла позади текста */}
          <div ref={routeRef} className="relative isolate">
            <Hero />
            <Board />
            {stage >= 1 && (
              <>
                <Stats />
                <News />
                <Quiz />
                <Mistakes />
                <Photo />
                <Included />
              </>
            )}
            {stage >= 2 && (
              <>
                <Compare />
                <Benefits />
                <Pricing />
                <How />
                <Route />
                <Trust />
                <Guarantees />
                <Faq />
                <FinalCta ref={landingRef} />
                <FlightPath containerRef={routeRef} landingRef={landingRef} />
              </>
            )}
          </div>
        </main>
        {stage >= 2 && <Footer onPrivacy={() => setPrivacyOpen(true)} />}
        <FloatingWhatsApp />
        <PrivacyModal open={privacyOpen} onClose={closePrivacy} />
      </MotionConfig>
    </LazyMotion>
  )
}
