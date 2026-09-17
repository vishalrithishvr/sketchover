import React from 'react'
import Title from './Title'
import Reveal from './Reveal'
import { StarIcon } from './icons/NavIcons'
import { bannerPosters } from '../assets/assets'

const reviews = [
  { name: 'Aarav K.',  text: 'Print quality is insane for the price. The colours match the preview exactly.', rating: 5, image: bannerPosters[0] },
  { name: 'Sanya M.',  text: 'Packaging was solid — arrived flat with zero creases. Already ordering a second set.', rating: 5, image: bannerPosters[1] },
  { name: 'Rohit V.',  text: 'Fast delivery and the matte finish looks premium on the wall.', rating: 4, image: bannerPosters[2] },
  { name: 'Meera S.',  text: 'Ordered the combo — great value and the frames-free look works well.', rating: 5, image: bannerPosters[3] },
]

const Stars = ({ rating }) => (
  <div className='flex justify-center gap-1 mt-3'>
    {[1, 2, 3, 4, 5].map(i => (
      <StarIcon key={i} className={`w-4 h-4 ${i <= rating ? 'text-brand' : 'text-gray-200'}`} />
    ))}
  </div>
)

const CustomerReviews = () => {
  return (
    <div className='my-16'>
      <div className='text-center text-xl sm:text-2xl mb-8'>
        <Title text1={'CUSTOMER REVIEWS'} />
      </div>

      <div className='flex gap-5 overflow-x-auto no-scrollbar pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible'>
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={i * 70} className='shrink-0 w-[70%] xs:w-[55%] sm:w-auto'>
            <div className='aspect-[511/455] overflow-hidden bg-gray-100'>
              <img src={r.image} alt='' className='w-full h-full object-cover' loading='lazy' />
            </div>
            <Stars rating={r.rating} />
            <p className='text-xs text-gray-500 text-center mt-2 px-2 line-clamp-3'>"{r.text}"</p>
            <p className='text-xs text-gray-800 text-center mt-1'>{r.name}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default CustomerReviews
