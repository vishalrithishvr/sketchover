import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141]'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#FF6B00]'></p>
                    <p className=' font-medium text-sm md:text-base'>PREMIUM WALL ART</p>
                </div>
                <h1 className='heading-font text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Get Your Wall Talking</h1>
                <p className='text-xs sm:text-sm text-gray-500 max-w-xs'>Movie, anime, car &amp; music posters printed on premium matte paper.</p>
                <div className='flex items-center gap-2 mt-3'>
                    <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                    <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                </div>
            </div>
      </div>
      {/* Hero Right Side */}
      <img className='w-full sm:w-1/2 object-cover max-h-[420px] sm:max-h-none' src={assets.heroImage} alt="Featured poster" />
    </div>
  )
}

export default Hero
