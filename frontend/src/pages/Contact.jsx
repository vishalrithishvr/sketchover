import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contactImage} alt="Sketchover poster sets" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Sketchover.in</p>
          <p className=' text-gray-500'>Email: sketchoverfactory@gmail.com</p>
          <p className=' text-gray-500'>Follow us: instagram.com/sketchover.in</p>
          <p className='font-semibold text-xl text-gray-600'>Bulk &amp; Custom Orders</p>
          <p className=' text-gray-500'>Printing for events, offices or resale? Reach out for bulk pricing.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Get In Touch</button>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact
