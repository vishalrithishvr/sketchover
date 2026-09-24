import React from 'react'
import { Link } from 'react-router-dom'
import { categoryShowcase } from '../assets/assets'
import Title from './Title'
import Reveal from './Reveal'

const CategoryShowcase = () => {
  return (
    <div className='my-14'>
      <div className='text-center text-2xl sm:text-3xl mb-9'>
        <Title text1={'CATEGORIES'} />
      </div>

      {/* Scrolls when the enlarged tiles don't fit; `mx-auto w-fit` keeps them
          centred only while they do, so nothing gets clipped at the edges. */}
      <div className='flex mx-auto w-fit max-w-full gap-5 sm:gap-7 lg:gap-9 overflow-x-auto no-scrollbar px-1 pb-2'>
        {categoryShowcase.map((item, index) => {
          const to = item.custom ? '/custom-posters' : `/collection?category=${encodeURIComponent(item.category)}`

          return (
            <Reveal key={item.category} delay={index * 40} className='shrink-0'>
              <Link to={to} className='flex flex-col items-center gap-3 w-[100px] sm:w-[128px] lg:w-[140px] group'>
                <div className='w-[100px] h-[100px] sm:w-[128px] sm:h-[128px] lg:w-[140px] lg:h-[140px] rounded-full overflow-hidden ring-2 ring-black/5 group-hover:ring-brand transition-all'>
                  <img
                    src={item.image}
                    alt={item.category}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                </div>
                <p className='text-sm sm:text-base text-center text-gray-800 group-hover:text-brand transition-colors'>
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
