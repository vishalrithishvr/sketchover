import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Title from './Title'

const PersonalizationBanner = () => {
  return (
    <div className='my-16'>
      <div className='text-center py-6 text-3xl'>
        <Title text1={'PERSONALIZATION'} text2={''} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>Custom Prints — your photo or design, printed as a poster.</p>
      </div>
      <Reveal className='rounded-2xl bg-neutral-950 text-white px-6 sm:px-14 py-12 flex flex-col sm:flex-row items-center justify-between gap-6'>
        <div>
          <h3 className='prata-regular text-2xl sm:text-3xl mb-2'>Got a design of your own?</h3>
          <p className='text-white/60 text-sm max-w-md'>Send us your photo, artwork, or event design and we'll print it as a custom poster — single prints or bulk event orders.</p>
        </div>
        <Link to='/custom-posters' className='shrink-0 bg-[#FF6B00] text-white px-8 py-3 text-sm font-medium rounded hover:bg-white hover:text-black transition-colors whitespace-nowrap'>
          Start a Custom Order
        </Link>
      </Reveal>
    </div>
  )
}

export default PersonalizationBanner
