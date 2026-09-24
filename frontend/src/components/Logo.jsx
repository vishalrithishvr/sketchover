import React from 'react'
import { Link } from 'react-router-dom'
import logoSko from '../assets/logo-sko.png'

// The SKO wordmark ships with a transparent background, so one file serves
// both the white header and the black footer.
const Logo = ({ className = '' }) => (
  <Link to='/' className={`flex items-center shrink-0 ${className}`}>
    <img src={logoSko} alt='Sketchover' className='h-9 sm:h-11 w-auto object-contain' />
  </Link>
)

export default Logo
