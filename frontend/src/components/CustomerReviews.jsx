import React from 'react'
import Title from './Title'
import Reveal from './Reveal'
import { assets } from '../assets/assets'

const reviews = [
  { name: 'Aarav K.', text: 'Print quality is insane for the price. The BMW poster looks exactly like the preview, no colour washout at all.', rating: 5 },
  { name: 'Sanya M.', text: 'Ordered the One Piece crew set — packaging was solid, arrived flat with zero creases. Already ordering a second set.', rating: 5 },
  { name: 'Rohit V.', text: 'Fast delivery and the matte finish looks premium on the wall. Wish there were frame options but great value overall.', rating: 4 },
]

const Stars = ({ rating }) => (
  <div className='flex gap-1'>
    {[1, 2, 3, 4, 5].map(i => (
      <img key={i} src={i <= rating ? assets.star_icon : assets.star_dull_icon} className='w-3.5' alt='' />
    ))}
  </div>
)

const CustomerReviews = () => {
  return (
    <div className='my-16'>
      <div className='text-center py-6 text-3xl'>
        <Title text1={'CUSTOMER'} text2={'REVIEWS'} />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={i * 80} className='border border-gray-200 rounded-xl p-6 flex flex-col gap-3'>
            <Stars rating={r.rating} />
            <p className='text-sm text-gray-600'>"{r.text}"</p>
            <p className='text-sm font-medium text-gray-800 mt-auto'>{r.name}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default CustomerReviews
