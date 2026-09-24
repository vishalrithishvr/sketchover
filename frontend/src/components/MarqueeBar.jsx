import React from 'react'

export const MARQUEE_TEXT = 'Free Delivery from ₹399'

// Top announcement strip.
const MarqueeBar = ({ text = MARQUEE_TEXT }) => {
  const items = new Array(8).fill(text)

  return (
    <div className='bg-black text-white overflow-hidden whitespace-nowrap py-2 text-[11px] sm:text-xs tracking-wide'>
      <div className='flex w-max animate-marquee motion-reduce:animate-none'>
        {[...items, ...items].map((t, i) => (
          <span key={i} className='px-6 flex items-center gap-2'>
            <span className='w-1 h-1 rounded-full bg-brand'></span>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

// Angled ribbon that cuts clean across the full page width.
// The band is over-wide (130vw) and centred so its rotated ends run past
// both edges of the viewport instead of stopping inside the container.
export const DiagonalRibbon = ({ text = MARQUEE_TEXT }) => {
  const items = new Array(14).fill(text)

  return (
    <div className='relative my-16 h-20 sm:h-24 bleed-full overflow-hidden' aria-hidden='true'>
      <div className='absolute left-1/2 top-1/2 w-[130vw] -translate-x-1/2 -translate-y-1/2 -rotate-[4deg] bg-black text-white py-3 sm:py-4 overflow-hidden whitespace-nowrap'>
        <div className='flex w-max animate-marquee motion-reduce:animate-none text-xs sm:text-base tracking-wide'>
          {[...items, ...items].map((t, i) => (
            <span key={i} className='px-7 flex items-center gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-brand'></span>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarqueeBar
