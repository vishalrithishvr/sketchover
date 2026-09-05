import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({ className = '', variant = 'dark' }) => {
  const isLight = variant === 'light';

  return (
    <Link to='/' className={`flex items-center gap-2 shrink-0 ${className}`}>
      <svg viewBox='0 0 32 32' className='w-8 h-8' aria-hidden='true'>
        <rect x='1' y='1' width='30' height='30' rx='8' fill={isLight ? '#ffffff' : '#171717'} fillOpacity={isLight ? 0.1 : 1} stroke={isLight ? '#ffffff33' : 'none'} />
        <path d='M8 21 L16 9 L24 21' stroke='#FF6B00' strokeWidth='2.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='16' cy='16' r='2' fill='#FF6B00' />
      </svg>
      <span className={`prata-regular text-xl sm:text-2xl tracking-wide whitespace-nowrap ${isLight ? 'text-white' : 'text-[#171717]'}`}>
        Sketch<span className='text-[#FF6B00]'>Over</span>
      </span>
    </Link>
  )
}

export default Logo
