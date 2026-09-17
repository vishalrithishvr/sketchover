import React, { useEffect, useRef, useState } from 'react'

// Lightweight horizontal-scroll carousel (native scroll-snap, no library).
// Children carry their own width class, e.g. w-[46%] sm:w-[23%] shrink-0 snap-start.
const Carousel = ({ children, theme = 'light' }) => {
  const trackRef = useRef(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const isDark = theme === 'dark'

  const recalc = () => {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    setPageCount(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)))
    setPage(Math.round(el.scrollLeft / el.clientWidth))
  }

  useEffect(() => {
    recalc()
    const el = trackRef.current
    if (!el) return
    const onScroll = () => setPage(Math.round(el.scrollLeft / el.clientWidth))
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', recalc)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', recalc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [React.Children.count(children)])

  const scrollByPage = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }

  const arrowClass = `px-2 text-lg leading-none disabled:opacity-25 disabled:cursor-not-allowed transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-black'}`

  return (
    <div className='relative'>
      <div
        ref={trackRef}
        className={`flex overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory gap-3 sm:gap-4 ${pageCount === 1 ? 'sm:justify-center' : ''}`}
      >
        {children}
      </div>

      {pageCount > 1 && (
        <div className='flex items-center justify-center gap-2 mt-6'>
          <button onClick={() => scrollByPage(-1)} disabled={page === 0} aria-label='Previous' className={arrowClass}>&lt;</button>
          <span className={`text-xs tabular-nums tracking-widest ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
            {page + 1} / {pageCount}
          </span>
          <button onClick={() => scrollByPage(1)} disabled={page === pageCount - 1} aria-label='Next' className={arrowClass}>&gt;</button>
        </div>
      )}
    </div>
  )
}

export default Carousel
