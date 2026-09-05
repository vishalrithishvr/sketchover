import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { InstagramIcon, FacebookIcon, YoutubeIcon, PinterestIcon } from './icons/NavIcons'

const socialLinks = [
  { Icon: InstagramIcon, href: 'https://instagram.com/sketchover.in', label: 'Instagram' },
  { Icon: FacebookIcon, href: '#', label: 'Facebook' },
  { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
  { Icon: PinterestIcon, href: '#', label: 'Pinterest' },
]

const Footer = () => {
  return (
    <div className='bg-black text-white mt-24'>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-16 pb-8'>

        <div className='grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-10 text-sm'>

          <div>
              <Logo className='mb-5' variant='light' />
              <p className='w-full md:w-3/4 text-gray-400'>
              Sketchover is a poster studio for movie, anime, car and music lovers — premium prints made to turn a blank wall into a mood board.
              </p>
              <p className='text-orange-400/80 text-xs mt-4 italic'>
              "All artwork on Sketchover.in is fan-made and not officially affiliated with or endorsed by any brands, unless explicitly stated otherwise."
              </p>
              <div className='flex gap-3 mt-5'>
                {socialLinks.map(({ Icon, href, label }) => (
                  <a key={label} href={href} target='_blank' rel='noreferrer' aria-label={label} className='w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors'>
                    <Icon className='w-4 h-4' />
                  </a>
                ))}
              </div>
          </div>

          <div>
              <p className='font-medium mb-4 tracking-wide'>EXPLORE OUR CATEGORY</p>
              <ul className='flex flex-col gap-2 text-gray-400'>
                  <li><Link to='/collection' className='hover:text-white'>Shop all products</Link></li>
                  <li><Link to='/collection?sort=new' className='hover:text-white'>New Arrivals</Link></li>
                  <li><Link to='/collection?bestseller=true' className='hover:text-white'>Best Selling</Link></li>
                  <li><Link to='/custom-posters' className='hover:text-white'>Personalization</Link></li>
              </ul>
          </div>

          <div>
              <p className='font-medium mb-4 tracking-wide'>INFORMATION</p>
              <ul className='flex flex-col gap-2 text-gray-400'>
                  <li><Link to='/contact' className='hover:text-white'>Contact Us</Link></li>
                  <li><Link to='/about' className='hover:text-white'>Terms and Conditions</Link></li>
                  <li><Link to='/contact' className='hover:text-white'>Affiliate / Refer &amp; Earns</Link></li>
                  <li><Link to='/contact' className='hover:text-white'>FAQ</Link></li>
              </ul>
          </div>

        </div>

        <hr className='border-white/10 my-10' />
        <p className='text-xs text-center text-gray-500'>© 2026 Sketchover.in #SKOTRIBE</p>
      </div>

      <p className='select-none text-center font-black uppercase leading-none text-white/95 text-[16vw] sm:text-[10vw] tracking-tight py-2 overflow-hidden'>
        #SKOTRIBE
      </p>
    </div>
  )
}

export default Footer
