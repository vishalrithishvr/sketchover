import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Title from './Title'
import { bannerPosters } from '../assets/assets'

const PersonalizationBanner = () => {
  return (
    <div className='my-14'>
      <div className='text-center text-xl sm:text-2xl'>
        <Title text1={'PERSONALIZATION'} />
        <p className='text-xs sm:text-sm text-gray-500 mt-1 normal-case tracking-normal'>Custom Prints</p>
      </div>

      <Reveal className='mt-6'>
        <Link
          to='/custom-posters'
          className='group relative block overflow-hidden bg-neutral-950 text-white min-h-[170px] sm:min-h-[230px]'
        >
          {/* faded poster strip */}
          <div className='absolute inset-0 flex opacity-35'>
            {bannerPosters.map((src, i) => (
              <img key={i} src={src} alt='' className='flex-1 h-full object-cover' />
            ))}
          </div>
          <div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40' />

          <div className='relative flex flex-col items-center justify-center text-center h-full px-6 py-12 gap-3'>
            <p className='heading-font tracking-wide text-[clamp(1.4rem,4.5vw,3rem)] leading-none'>
              YOUR PHOTO, YOUR POSTER
            </p>
            <p className='text-white/60 text-xs sm:text-sm max-w-md'>
              Upload any photo or artwork — we print it on premium matte paper in A4 or A3.
            </p>
            <span className='inline-block mt-2 bg-brand group-hover:bg-white group-hover:text-black text-white text-xs sm:text-sm px-7 py-2.5 transition-colors'>
              Start a Custom Order
            </span>
          </div>
        </Link>
      </Reveal>
    </div>
  )
}

export default PersonalizationBanner
