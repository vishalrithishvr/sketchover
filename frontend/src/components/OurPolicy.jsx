import React from 'react'
import Reveal from './Reveal'
import Title from './Title'
import { QualityIcon, DesignIcon, OfferIcon, DeliveryIcon } from './icons/NavIcons'

const features = [
  { Icon: QualityIcon,  title: 'Quality' },
  { Icon: DesignIcon,   title: 'Custom Design' },
  { Icon: OfferIcon,    title: 'Exclusive Offers' },
  { Icon: DeliveryIcon, title: 'Free Delivery' },
]

const OurPolicy = () => {
  return (
    <div className='my-16'>
      <div className='text-center text-xl sm:text-2xl mb-10'>
        <Title text1={'WHY TO CHOOSE SKETCHOVER.IN ?'} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4'>
        {features.map(({ Icon, title }, i) => (
          <Reveal key={title} delay={i * 70} className='flex flex-col items-center text-center gap-3'>
            <Icon className='w-9 h-9 sm:w-10 sm:h-10 text-brand' />
            <p className='text-xs sm:text-sm text-gray-800'>{title}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default OurPolicy
