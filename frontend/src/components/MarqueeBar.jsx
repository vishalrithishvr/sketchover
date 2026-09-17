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

// Angled ribbon that cuts across the page between homepage sections.
export const DiagonalRibbon = ({ text = MARQUEE_TEXT }) => {
  const items = new Array(10).fill(text)

  return (
    <div className='relative my-14 h-16 sm:h-20 overflow-hidden' aria-hidden='true'>
      <div className='absolute inset-x-[-8%] top-1/2 -translate-y-1/2 -rotate-[4deg] bg-black text-white py-2.5 sm:py-3 overflow-hidden whitespace-nowrap'>
        <div className='flex w-max animate-marquee motion-reduce:animate-none text-[11px] sm:text-sm tracking-wide'>
          {[...items, ...items].map((t, i) => (
            <span key={i} className='px-6 flex items-center gap-2'>
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
