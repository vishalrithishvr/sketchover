import React from 'react'
import { Link } from 'react-router-dom'
import { categoryShowcase } from '../assets/assets'
import Title from './Title'
import Reveal from './Reveal'

// All eight categories stay on screen at every width — 4 x 2 on phones and
// tablets, a single row of 8 from large screens up. Tiles share one capped
// size so they read the same everywhere and never need swiping.
const CategoryShowcase = () => {
  return (
    <div className='my-14'>
      <div className='text-center text-2xl sm:text-3xl mb-9'>
        <Title text1={'CATEGORIES'} />
      </div>

      <div className='grid grid-cols-4 xl:grid-cols-8 gap-x-3 sm:gap-x-5 gap-y-7 justify-items-center'>
        {categoryShowcase.map((item, index) => {
          const to = item.custom ? '/custom-posters' : `/collection?category=${encodeURIComponent(item.category)}`

          return (
            <Reveal key={item.category} delay={index * 40} className='w-full flex justify-center'>
              <Link to={to} className='flex flex-col items-center gap-2.5 w-full max-w-[96px] group'>
                <div className='w-full aspect-square rounded-full overflow-hidden ring-2 ring-black/5 group-hover:ring-brand transition-all'>
                  <img
                    src={item.image}
                    alt={item.category}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                </div>
                <p className='text-[11px] sm:text-sm text-center leading-tight text-gray-800 group-hover:text-brand transition-colors'>
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
