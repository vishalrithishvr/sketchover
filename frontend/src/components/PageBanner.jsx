import React from 'react'
import { banners } from '../assets/assets'

// Wide promo strip above listing pages. Uses the studio's artwork when one is
// supplied, otherwise falls back to a titled dark panel.
const PageBanner = ({ image = banners.combos, title, subtitle, starburst = false }) => {
  if (image) {
    return (
      <div className='relative bleed-2cm overflow-hidden'>
        <img src={image} alt={title || ''} className='w-full h-auto object-cover' />
        {starburst && (
          <span className='absolute top-3 right-3 sm:top-6 sm:right-8 w-10 h-10 sm:w-14 sm:h-14 bg-brand [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]' />
        )}
      </div>
    )
  }

  return (
    <div className='relative bleed-2cm overflow-hidden bg-neutral-950 text-white aspect-[1428/518] max-h-[330px]'>
      <div className='h-full flex flex-col items-center justify-center text-center px-6 gap-2'>
        <p className='heading-font tracking-wide leading-none text-[clamp(1.5rem,5vw,3.5rem)]'>{title}</p>
        {subtitle && <p className='text-white/70 text-xs sm:text-sm max-w-md'>{subtitle}</p>}
      </div>
    </div>
  )
}

export default PageBanner
