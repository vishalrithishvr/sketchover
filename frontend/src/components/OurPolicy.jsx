import React from 'react'
import Reveal from './Reveal'
import { QualityIcon, DesignIcon, OfferIcon, DeliveryIcon } from './icons/NavIcons'
import Title from './Title'

const features = [
  { Icon: QualityIcon, title: 'Quality', desc: '200 GSM premium matte prints' },
  { Icon: DesignIcon, title: 'Custom Design', desc: 'Your photo, your poster' },
  { Icon: OfferIcon, title: 'Exclusive Offers', desc: 'Combo & bulk order pricing' },
  { Icon: DeliveryIcon, title: 'Free Delivery', desc: 'On every order (min. ₹499)' },
]

const OurPolicy = () => {
  return (
    <div className='my-16 -mx-4 sm:mx-0'>
      <div className='text-center py-6 text-3xl hidden sm:block'>
        <Title text1={'WHY TO CHOOSE'} text2={'SKETCHOVER.IN?'} />
      </div>
      <div className='bg-black text-white grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 px-6 sm:px-10 py-10'>
        {features.map(({ Icon, title, desc }, i) => (
          <Reveal key={title} delay={i * 70} className='flex flex-col items-center text-center gap-2'>
            <div className='w-11 h-11 rounded-full bg-[#FF6B00] flex items-center justify-center'>
              <Icon className='w-5 h-5 text-black' />
            </div>
            <p className='font-medium text-sm'>{title}</p>
            <p className='text-white/50 text-xs hidden sm:block'>{desc}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default OurPolicy
