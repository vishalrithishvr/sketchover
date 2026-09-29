import React from 'react'
import { Link } from 'react-router-dom'
import logoSko from '../assets/logo-sko.png'
import logoSkoWhite from '../assets/logo-sko-white.png'

// Two cuts of the same wordmark, both on a transparent background: the marble
// original for light surfaces, a solid white one for the black footer.
const Logo = ({ className = '', id, white = false }) => (
  <Link to='/' id={id} className={`flex items-center shrink-0 ${className}`}>
    <img
      src={white ? logoSkoWhite : logoSko}
      alt='Sketchover'
      className='h-9 sm:h-11 w-auto object-contain'
    />
  </Link>
)

export default Logo
