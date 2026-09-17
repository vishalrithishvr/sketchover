import React from 'react'
import { bannerPosters } from '../assets/assets'

// Wide promo strip that sits above listing pages (1428 x 518 in the design).
const PageBanner = ({ title, subtitle, starburst = false, images = bannerPosters }) => {
  return (
    <div className='relative overflow-hidden bg-neutral-950 text-white aspect-[1428/518] max-h-[330px]'>
      <div className='absolute inset-0 flex'>
        {images.map((src, i) => (
          <img key={i} src={src} alt='' className='flex-1 h-full object-cover opacity-45' loading='lazy' />
        ))}
      </div>
      <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/90' />

      <div className='relative h-full flex flex-col items-center justify-center text-center px-6 gap-2'>
        <p className='heading-font tracking-wide leading-none text-[clamp(1.5rem,5vw,3.5rem)]'>{title}</p>
        {subtitle && <p className='text-white/70 text-xs sm:text-sm max-w-md'>{subtitle}</p>}
      </div>

      {starburst && (
        <span className='absolute top-3 right-3 sm:top-6 sm:right-8 w-10 h-10 sm:w-14 sm:h-14 bg-brand [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]' />
      )}
    </div>
  )
}

export default PageBanner
