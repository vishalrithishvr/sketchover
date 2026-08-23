import React from 'react'

const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      <svg viewBox='0 0 32 32' className='w-8 h-8' aria-hidden='true'>
        <rect x='1' y='1' width='30' height='30' rx='8' fill='#171717' />
        <path d='M8 21 L16 9 L24 21' stroke='#FF6B00' strokeWidth='2.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='16' cy='16' r='2' fill='#FF6B00' />
      </svg>
      <span className='text-xl tracking-wide text-[#171717] whitespace-nowrap font-medium'>
        Sketch<span className='text-[#FF6B00]'>Over</span> <span className='text-gray-400 font-normal text-sm'>Admin</span>
      </span>
    </div>
  )
}

export default Logo
