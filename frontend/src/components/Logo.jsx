import React from 'react'
import { Link } from 'react-router-dom'
import logoOnLight from '../assets/logo-sko.png'
import logoOnDark from '../assets/logo-sko-light.png'

// `variant='light'` = the artwork drawn for dark backgrounds (footer).
const Logo = ({ className = '', variant = 'dark' }) => {
  const onDark = variant === 'light'

  return (
    <Link to='/' className={`flex items-center shrink-0 ${className}`}>
      <img
        src={onDark ? logoOnDark : logoOnLight}
        alt='Sketchover'
        className='h-10 sm:h-11 w-auto object-contain'
      />
    </Link>
  )
}

export default Logo
