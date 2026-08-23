import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.aboutImage} alt="Sketchover posters" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Sketchover started as a small passion project for fans who wanted their favourite movies, anime, cars and artists on their walls — printed properly, not stretched off a low-res download.</p>
              <p>Every design in our catalogue is hand-picked and printed on premium matte paper, available in A4, A3 and A2 sizes. From single statement prints to matching poster sets, we've got a wall for every kind of fan.</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>To help you turn a blank wall into a mood board — with fast printing, careful packaging, and designs you won't find in a generic print shop.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Premium Print Quality:</b>
            <p className=' text-gray-600'>Every poster is printed on thick, matte finish paper — sharp colours, no glare, built to last on your wall.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Sizes For Every Wall:</b>
            <p className=' text-gray-600'>Choose from A4, A3 or A2, and mix single prints with matching poster sets.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Fan-First Designs:</b>
            <p className=' text-gray-600'>Curated by fans, for fans — new drops across movies, anime, cars and music added regularly.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
