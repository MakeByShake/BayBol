import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { startTransition, useCallback, useEffect, useRef, useState } from 'react'
import { Benefits } from './components/Benefits'
import { Changes } from './components/Changes'
import { Compare } from './components/Compare'
import { Contacts } from './components/Contacts'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { FlightPath } from './components/FlightPath'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Guarantees } from './components/Guarantees'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Included } from './components/Included'
import { Marquee } from './components/Marquee'
import { Mistakes } from './components/Mistakes'
import { PhotoRequirements } from './components/PhotoRequirements'
import { Pricing } from './components/Pricing'
import { PrivacyModal } from './components/PrivacyModal'
import { Quiz } from './components/Quiz'
import { Roadmap } from './components/Roadmap'
import { Stats } from './components/Stats'
import { Steps } from './components/Steps'
import { Trust } from './components/Trust'

export default function App() {
  const routeRef = useRef<HTMLDivElement>(null)
  const landingRef = useRef<HTMLDivElement>(null)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const closePrivacy = useCallback(() => setPrivacyOpen(false), [])

  // Первый экран рисуем сразу, остальное — в фоне, не блокируя страницу
  const [rest, setRest] = useState(false)
  useEffect(() => {
    const show = () => startTransition(() => setRest(true))
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(show, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(show, 300)
    return () => window.clearTimeout(id)
  }, [])

  // Если открыли ссылку с якорем (#faq и т.п.) — докручиваем, когда блок появился
  useEffect(() => {
    if (!rest || !location.hash) return
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
  }, [rest])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Header />
        <main id="main">
          {/* всё, над чем пролетает самолётик маршрута */}
          <div ref={routeRef} className="relative">
            <Hero />
            <Marquee />
            {rest && (
              <>
                <FlightPath containerRef={routeRef} landingRef={landingRef} />
                <Stats />
                <Changes />
                <Quiz />
                <Mistakes />
                <PhotoRequirements />
                <Included />
                <Compare />
                <Benefits />
                <Pricing />
                <Steps />
                <Roadmap />
                <Trust />
                <Guarantees />
                <Faq />
                <FinalCta ref={landingRef} />
              </>
            )}
          </div>
          {rest && <Contacts />}
        </main>
        {rest && <Footer onPrivacy={() => setPrivacyOpen(true)} />}
        <FloatingWhatsApp />
        <PrivacyModal open={privacyOpen} onClose={closePrivacy} />
      </MotionConfig>
    </LazyMotion>
  )
}
