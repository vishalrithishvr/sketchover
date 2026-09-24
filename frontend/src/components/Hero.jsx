import React from 'react'
import { Link } from 'react-router-dom'
import { banners } from '../assets/assets'

// Studio's own "Buy 4 Get 4 Free" promo banner.
const Hero = () => (
  <Link to='/collection' className='block bleed-2cm overflow-hidden'>
    <img
      src={banners.hero}
      alt='Buy 4 get 4 free at ₹356 only'
      className='w-full h-auto object-cover'
      fetchpriority='high'
    />
  </Link>
)

export default Hero
