import React, { useState } from 'react'
import Title from './Title'
import Reveal from './Reveal'
import { PlusIcon, MinusIcon } from './icons/NavIcons'
import { bannerPosters } from '../assets/assets'

const faqs = [
  { q: 'What sizes of posters are available?', a: 'Every poster ships in A6, A5, A4, A3 or A3+ — pick the size that fits your wall on the product page. Each size is priced separately.' },
  { q: 'Are the posters framed?', a: 'Posters ship unframed, rolled in a rigid tube so they arrive flat and crease-free. Frames are not included.' },
  { q: 'How long does it take to deliver?', a: 'Orders are printed and dispatched within 2-3 business days, with delivery typically taking 4-7 days depending on your location.' },
  { q: 'Can I customize posters for events?', a: 'Yes — head to Custom Posters, upload your design, or message us on WhatsApp for bulk and event pricing.' },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className='my-16'>
      <div className='text-center text-xl sm:text-2xl mb-8'>
        <Title text1={'FAQ'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-[602fr_560fr] gap-8 lg:gap-14 items-center'>
        <Reveal className='hidden md:block'>
          <div className='relative aspect-[602/534] overflow-hidden bg-black'>
            <img src={bannerPosters[4]} alt='' className='absolute inset-0 w-full h-full object-cover opacity-55' />
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='heading-font text-white text-5xl lg:text-6xl tracking-[0.2em]'>FAQ</span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.q} className='border-b border-gray-200'>
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className='w-full flex items-center justify-between text-left py-4 gap-4'
                >
                  <span className='text-sm text-gray-800'>{item.q}</span>
                  {isOpen
                    ? <MinusIcon className='w-4 h-4 shrink-0 text-gray-500' />
                    : <PlusIcon className='w-4 h-4 shrink-0 text-gray-500' />}
                </button>
                {isOpen && <p className='text-sm text-gray-500 pb-4 pr-8'>{item.a}</p>}
              </div>
            )
          })}
        </Reveal>
      </div>
    </div>
  )
}

export default FAQ
