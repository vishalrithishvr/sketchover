import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'

// How long the curtain stays up, and when the route swaps behind it.
const CURTAIN_MS = 850
const NAVIGATE_AT_MS = 320

const PageTransitionContext = createContext({ openPage: () => false, opening: null })

export const usePageTransition = () => useContext(PageTransitionContext)

// Shared opening animation for the catalogue links: a branded curtain sweeps
// up carrying the name of the page being opened, the route changes behind it,
// and the new page always starts at its banner rather than wherever the last
// page happened to be scrolled to.
export const PageTransitionProvider = ({ children }) => {
  const [opening, setOpening] = useState(null)
  const timers = useRef([])
  const navigate = useNavigate()

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Returns false when the click should be left to the browser (new tab, etc).
  const openPage = (e, { label, to, accent = '#F5007E' }) => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)) return false
    e?.preventDefault()
    if (opening) return true

    setOpening({ label, accent, to })
    timers.current.push(setTimeout(() => {
      navigate(to)
      window.scrollTo({ top: 0 })
    }, NAVIGATE_AT_MS))
    timers.current.push(setTimeout(() => setOpening(null), CURTAIN_MS))
    return true
  }

  return (
    <PageTransitionContext.Provider value={{ openPage, opening }}>
      {children}

      {opening && createPortal(
        <div className='fixed inset-0 z-[95] overflow-hidden pointer-events-none' aria-hidden='true'>
          <div
            className='absolute inset-0 animate-curtain'
            style={{ background: `linear-gradient(155deg, #070707 0%, #141414 45%, ${opening.accent} 100%)` }}
          >
            <div className='h-full flex flex-col items-center justify-center gap-4 px-6 animate-label-in'>
              <span className='heading-font uppercase text-white leading-none text-[clamp(2rem,9vw,5rem)] text-center'>
                {opening.label}
              </span>
              <span className='block w-7 h-7 rounded-full border-2 border-white/30 border-t-white animate-spin' />
            </div>
          </div>
        </div>,
        document.body
      )}
    </PageTransitionContext.Provider>
  )
}

// Every route change starts at the top of the page — without this a page opened
// from a footer link would open already scrolled to its own footer.
export const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, search])

  return null
}

export default PageTransitionProvider
