import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { SUPERHERO_IDS } from '../assets/assets'
import { usePageTransition } from './PageTransition'
import Title from './Title'
import Carousel from './Carousel'
import Reveal from './Reveal'
import ProductItem from './ProductItem'

// The three ways into the superhero wall: the combo, the sizes, or your own art.
const entries = [
  { label: 'Buy 4 Get 4 Free', to: '/collection?category=TV Series' },
  { label: 'A3 · A4 · Pocket · Framed', to: '/collection?category=TV Series' },
  { label: 'Upload your own', to: '/custom-posters' },
]

const HeroCollection = () => {
  const { products } = useContext(ShopContext)
  const { openPage } = usePageTransition()

  const heroes = SUPERHERO_IDS
    .map(id => products.find(p => p._id === id))
    .filter(Boolean)

  if (heroes.length === 0) return null

  return (
    <div className='my-14'>
      <div className='text-center text-xl sm:text-2xl mb-6'>
        <Title text1={'MARVEL, DC & SUPERHERO POSTERS IN INDIA'} />
        <p className='text-xs sm:text-sm text-gray-500 mt-1 normal-case tracking-normal'>Your photos, your fandoms</p>
      </div>

      {/* The three ways in, in the studio's dashed-frame style */}
      <Reveal className='border-2 border-dashed border-brand p-3 sm:p-4 mb-8'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          {entries.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={(e) => openPage(e, { label, to })}
              className='border border-brand text-center text-[11px] sm:text-xs tracking-[0.12em] uppercase px-4 py-3 hover:bg-brand hover:text-white transition-colors'
            >
              {label}
            </Link>
          ))}
        </div>
      </Reveal>

      <Carousel>
        {heroes.map((item, index) => (
          <div key={item._id} className='w-[47%] sm:w-[31%] md:w-[23.5%] lg:w-[19%] shrink-0 snap-start'>
            <Reveal delay={(index % 5) * 60}>
              <ProductItem product={item} />
            </Reveal>
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default HeroCollection
