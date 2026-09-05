import React from 'react'
import { Link } from 'react-router-dom'
import { categoryShowcase } from '../assets/assets'
import Title from './Title'
import Reveal from './Reveal'

const CategoryShowcase = () => {
  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'SHOP BY'} text2={'CATEGORY'} />
      </div>

      <div className='flex sm:justify-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar px-1 pb-2'>
        {categoryShowcase.map((item, index) => {
          const isCustom = !item.image;
          const to = isCustom ? '/custom-posters' : `/collection?category=${encodeURIComponent(item.category)}`;

          return (
            <Reveal key={item.category} delay={index * 50} className='shrink-0'>
              <Link to={to} className='flex flex-col items-center gap-2 w-20 sm:w-24 group'>
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md group-hover:border-[#FF6B00] transition-all flex items-center justify-center ${isCustom ? 'bg-neutral-950' : 'bg-gray-100'}`}>
                  {isCustom ? (
                    <span className='text-white text-2xl font-semibold'>+</span>
                  ) : (
                    <img src={item.image} alt={item.category} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                  )}
                </div>
                <p className='text-xs sm:text-sm text-center text-gray-700 group-hover:text-[#FF6B00] transition-colors'>{item.category}</p>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryShowcase
