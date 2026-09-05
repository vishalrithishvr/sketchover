import React from 'react'

const MarqueeBar = ({ text = 'Free Delivery from ₹399' }) => {
  const items = new Array(8).fill(text)

  return (
    <div className='bg-black text-white overflow-hidden whitespace-nowrap py-2 text-[11px] sm:text-xs tracking-wide'>
      <div className='flex w-max animate-marquee motion-reduce:animate-none'>
        {[...items, ...items].map((t, i) => (
          <span key={i} className='px-6 flex items-center gap-2'>
            <span className='w-1 h-1 rounded-full bg-[#FF6B00]'></span>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default MarqueeBar
