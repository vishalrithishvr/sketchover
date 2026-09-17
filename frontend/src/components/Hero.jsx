import React from 'react'
import { Link } from 'react-router-dom'
import { bannerPosters } from '../assets/assets'

// Promotional hero: poster collage on the left, combo offer headline on the right.
const Hero = () => {
  return (
    <Link to='/collection' className='block relative overflow-hidden bg-black text-white'>
      <div className='flex items-stretch min-h-[190px] sm:min-h-[260px] lg:min-h-[330px]'>

        {/* Poster collage */}
        <div className='w-[45%] sm:w-1/2 flex items-stretch gap-0.5 sm:gap-1 shrink-0'>
          {bannerPosters.slice(0, 5).map((src, i) => (
            <div
              key={i}
              className={`relative flex-1 overflow-hidden ${i > 2 ? 'hidden sm:block' : ''}`}
            >
              <img src={src} alt='' className='absolute inset-0 w-full h-full object-cover' />
            </div>
          ))}
          {/* fade into the black panel */}
          <div className='absolute left-[40%] sm:left-[45%] top-0 bottom-0 w-[12%] bg-gradient-to-r from-transparent to-black pointer-events-none' />
        </div>

        {/* Offer copy */}
        <div className='flex-1 flex flex-col justify-center items-center text-center px-3 sm:px-6 py-6'>
          <p className='heading-font leading-none tracking-wide text-[clamp(1.1rem,4.2vw,3.2rem)]'>
            BUY <span className='text-brand'>4</span> GET <span className='text-brand'>4</span> FREE
          </p>
          <p className='heading-font leading-none tracking-wide text-[clamp(1.8rem,7vw,5.5rem)] mt-1'>
            @ ₹356
          </p>
          <p className='heading-font leading-none tracking-[0.35em] text-[clamp(0.7rem,2vw,1.5rem)] mt-1 text-white/70'>
            ONLY
          </p>
        </div>
      </div>
    </Link>
  )
}

export default Hero
