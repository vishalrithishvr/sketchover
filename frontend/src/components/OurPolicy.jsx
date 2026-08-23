import React from 'react'
import { assets } from '../assets/assets'
import Reveal from './Reveal'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>

      <Reveal delay={0}>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>Damage-Free Guarantee</p>
        <p className=' text-gray-400'>Free replacement if a poster arrives damaged</p>
      </Reveal>
      <Reveal delay={80}>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>7 Days Return Policy</p>
        <p className=' text-gray-400'>We provide 7 days free return policy</p>
      </Reveal>
      <Reveal delay={160}>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>Best customer support</p>
        <p className=' text-gray-400'>we provide 24/7 customer support</p>
      </Reveal>

    </div>
  )
}

export default OurPolicy
