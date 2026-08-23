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
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          From car culture to anime, superheroes to soulful music icons — find the wall art that fits your vibe.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 gap-y-6'>
        {categoryShowcase.map((item, index) => (
          <Reveal key={item.category} delay={index * 60}>
            <Link
              to={`/collection?category=${encodeURIComponent(item.category)}`}
              className='relative overflow-hidden rounded-xl group aspect-[3/4] block shadow-sm hover:shadow-lg transition-shadow duration-300'
            >
              <img src={item.image} alt={item.category} className='w-full h-full object-cover group-hover:scale-110 transition-transform ease-out duration-500' />
              <div className='absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors'></div>
              <p className='absolute bottom-3 left-3 text-white font-medium tracking-wide text-sm sm:text-base'>{item.category}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default CategoryShowcase
