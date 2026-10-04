import React from 'react'
import Logo from './Logo'

const Navbar = ({ setToken }) => (
  <header className='flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-20'>
    <div className='flex items-center gap-3'>
      <Logo />
    </div>
    <button
      onClick={() => setToken('')}
      className='border border-gray-300 hover:border-black text-gray-700 px-4 py-1.5 rounded text-xs sm:text-sm transition-colors'
    >
      Log out
    </button>
  </header>
)

export default Navbar
