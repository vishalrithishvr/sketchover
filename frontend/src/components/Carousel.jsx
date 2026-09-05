import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons/NavIcons'

// A lightweight horizontal-scroll carousel (native scroll-snap, no library).
// Children should each carry their own width class (e.g. w-[46%] sm:w-[23%] shrink-0 snap-start).
const Carousel = ({ children }) => {
  const trackRef = useRef(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)

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

  return (
    <div className='relative'>
      <div ref={trackRef} className='flex overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory gap-4'>
        {children}
      </div>
      {pageCount > 1 && (
        <div className='flex items-center justify-center gap-4 mt-5'>
          <button onClick={() => scrollByPage(-1)} aria-label='Previous' className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors shrink-0'>
            <ChevronLeftIcon className='w-4 h-4' />
          </button>
          <span className='text-xs text-gray-500 tabular-nums w-10 text-center'>{page + 1} / {pageCount}</span>
          <button onClick={() => scrollByPage(1)} aria-label='Next' className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors shrink-0'>
            <ChevronRightIcon className='w-4 h-4' />
          </button>
        </div>
      )}
    </div>
  )
}

export default Carousel
