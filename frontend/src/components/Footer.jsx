import React from 'react'
import Logo from './Logo'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <Logo className='mb-5' />
            <p className='w-full md:w-2/3 text-gray-600'>
            Sketchover is a poster studio for movie, anime, car and music lovers — premium prints made to turn a blank wall into a mood board.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>sketchoverfactory@gmail.com</li>
                <li>Bulk / custom orders welcome</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2026@ Sketchover - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
