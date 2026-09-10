import React from 'react'
import Title from '../components/Title'
import { assets, SIZES } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const steps = [
    { title: '1. Send your design', desc: 'DM us on Instagram or email your photo, artwork, or event design.' },
    { title: '2. We quote & confirm', desc: 'We\'ll confirm size, paper finish and price — single prints or bulk orders.' },
    { title: '3. Printed & shipped', desc: 'Your custom poster is printed on premium matte paper and shipped rolled.' },
]

const CustomPosters = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'CUSTOM'} text2={'POSTERS'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
          <img className='w-full md:max-w-[450px] rounded-lg' src={assets.aboutImage} alt="Custom posters" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Got a photo, a logo, or an event you want on a wall? We print custom posters from your own design — perfect for gifts, birthdays, business branding, or wedding décor.</p>
              <p>Available in {SIZES.join(', ')}, on the same premium matte paper as the rest of our catalogue. Bulk and event pricing available on request.</p>
              <a href='mailto:sketchoverfactory@gmail.com' className='w-fit bg-black text-white px-8 py-3 text-sm rounded hover:bg-[#FF6B00] transition-colors'>
                Email Your Design
              </a>
          </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 my-16'>
        {steps.map(s => (
          <div key={s.title} className='border rounded-lg p-6'>
            <p className='font-medium mb-2'>{s.title}</p>
            <p className='text-sm text-gray-500'>{s.desc}</p>
          </div>
        ))}
      </div>

      <NewsletterBox />
    </div>
  )
}

export default CustomPosters
