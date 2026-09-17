import React from 'react'
import { Link } from 'react-router-dom'
import { categoryShowcase } from '../assets/assets'
import Title from './Title'
import Reveal from './Reveal'

const CategoryShowcase = () => {
  return (
    <div className='my-12'>
      <div className='text-center text-xl sm:text-2xl mb-7'>
        <Title text1={'CATEGORIES'} />
      </div>

      <div className='flex sm:justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar px-1 pb-2'>
        {categoryShowcase.map((item, index) => {
          const to = item.custom ? '/custom-posters' : `/collection?category=${encodeURIComponent(item.category)}`

          return (
            <Reveal key={item.category} delay={index * 40} className='shrink-0'>
              <Link to={to} className='flex flex-col items-center gap-2 w-[68px] sm:w-[84px] group'>
                <div className='relative w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full overflow-hidden ring-2 ring-black/5 group-hover:ring-brand transition-all'>
                  <img
                    src={item.image}
                    alt=''
                    className='absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-black/55 group-hover:bg-black/40 transition-colors' />
                  <span className='absolute inset-0 flex items-center justify-center heading-font text-white text-center leading-none px-1 text-[13px] sm:text-[15px] tracking-wide'>
                    {item.badge}
                  </span>
                </div>
                <p className='text-[11px] sm:text-xs text-center text-gray-700 group-hover:text-brand transition-colors'>
                  {item.category}
                </p>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryShowcase
