import React from 'react'
import logoSko from '../assets/logo-sko.png'

const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      <img src={logoSko} alt='Sketchover' className='w-9 h-9 rounded-full object-cover' />
      <span className='text-sm tracking-wide text-gray-400 font-normal'>Admin</span>
    </div>
  )
}

export default Logo
