import React from 'react'
import { Link } from 'react-router-dom'
import logoSko from '../assets/logo-sko.png'

const Logo = ({ className = '', variant = 'dark' }) => {
  const isLight = variant === 'light';

  return (
    <Link to='/' className={`flex items-center shrink-0 ${className}`}>
      <img
        src={logoSko}
        alt='Sketchover'
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ${isLight ? 'ring-1 ring-white/25' : ''}`}
      />
    </Link>
  )
}

export default Logo
