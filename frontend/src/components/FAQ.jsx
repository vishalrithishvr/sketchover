import React, { useState } from 'react'
import Title from './Title'
import Reveal from './Reveal'
import { PlusIcon, MinusIcon } from './icons/NavIcons'

const faqs = [
  { q: 'What sizes of posters are available?', a: 'Every poster ships in A5, A4, A3 or A3+ — pick the size that fits your wall on the product page.' },
  { q: 'Are the posters framed?', a: 'Posters ship unframed, rolled in a rigid tube to arrive flat and crease-free. Frames are not included.' },
  { q: 'How long does it take to deliver?', a: 'Most orders are printed and dispatched within 2-3 business days, with delivery typically taking 4-7 days depending on your location.' },
  { q: 'Can I customize posters for events?', a: 'Yes — head to Custom Posters or message us on WhatsApp with your design/photo and we\'ll quote bulk or event pricing.' },
]

const FAQItem = ({ item, isOpen, onToggle }) => (
  <div className='border-b border-gray-200 py-4'>
    <button onClick={onToggle} className='w-full flex items-center justify-between text-left'>
      <span className='text-sm sm:text-base font-medium text-gray-800'>{item.q}</span>
      {isOpen ? <MinusIcon className='w-4 h-4 shrink-0' /> : <PlusIcon className='w-4 h-4 shrink-0' />}
    </button>
    {isOpen && <p className='text-sm text-gray-500 mt-3 max-w-2xl'>{item.a}</p>}
  </div>
)

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className='my-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
      <Reveal className='hidden md:block'>
        <div className='bg-neutral-950 rounded-2xl aspect-[4/3] flex items-center justify-center'>
          <span className='prata-regular text-white/20 text-4xl'>FAQ</span>
        </div>
      </Reveal>
      <Reveal>
        <div className='text-2xl mb-4'>
          <Title text1={'FAQ'} text2={''} />
        </div>
        {faqs.map((item, i) => (
          <FAQItem key={item.q} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </Reveal>
    </div>
  )
}

export default FAQ
