import React, { useEffect, useRef, useState } from 'react'
import logoSko from '../assets/logo-sko.png'

// Splash on first load: the SKO mark sits large in the middle, then flies to
// the exact spot the navbar logo occupies and hands over to it.
//
// The target is measured from the real navbar logo (#nav-logo) so the landing
// always lines up, whatever the breakpoint. Runs once per tab.
const LogoIntro = () => {
  const [phase, setPhase] = useState('idle')   // idle -> center -> fly -> done
  const [target, setTarget] = useState(null)
  const markRef = useRef(null)

  useEffect(() => {
    if (sessionStorage.getItem('skoIntroSeen')) {
      setPhase('done')
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('skoIntroSeen', '1')
      setPhase('done')
      return
    }

    sessionStorage.setItem('skoIntroSeen', '1')
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => setPhase('center'))

    const flyTimer = setTimeout(() => {
      const navLogo = document.querySelector('#nav-logo img')
      const mark = markRef.current
      if (navLogo && mark) {
        const to = navLogo.getBoundingClientRect()
        const from = mark.getBoundingClientRect()
        setTarget({
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
          scale: to.height / from.height,
        })
      }
      setPhase('fly')
    }, 900)

    const endTimer = setTimeout(() => {
      document.body.style.overflow = ''
      setPhase('done')
    }, 2000)

    return () => {
      clearTimeout(flyTimer)
      clearTimeout(endTimer)
      document.body.style.overflow = ''
    }
  }, [])

  if (phase === 'done') return null

  const flying = phase === 'fly'

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${flying ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden='true'
    >
      <img
        ref={markRef}
        src={logoSko}
        alt=''
        className='h-24 sm:h-32 w-auto object-contain will-change-transform'
        style={{
          transition: 'transform 900ms cubic-bezier(0.65, 0, 0.35, 1), opacity 500ms ease',
          transform: flying && target
            ? `translate(${target.x}px, ${target.y}px) scale(${target.scale})`
            : phase === 'center'
              ? 'translate(0, 0) scale(1)'
              : 'translate(0, 0) scale(0.7)',
          opacity: phase === 'idle' ? 0 : 1,
        }}
      />
    </div>
  )
}

export default LogoIntro
