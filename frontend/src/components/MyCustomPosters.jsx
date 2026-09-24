import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice } from '../assets/assets'
import Title from './Title'
import Reveal from './Reveal'
import { WhatsappIcon, TrashIcon } from './icons/NavIcons'

export const WHATSAPP_NUMBER = '918870333236'

// Posters the shopper uploaded, kept on the site and sendable to the studio.
const MyCustomPosters = () => {
  const { customPosters, removeCustomPoster, currency, addToCart, products } = useContext(ShopContext)

  if (customPosters.length === 0) return null

  const customProduct = products.find(p => p.isCustom)

  const sendToWhatsapp = (poster) => {
    const { price } = getSizePrice(poster.size, 'Single')
    const lines = [
      'Hi Sketchover! I would like to order this custom poster:',
      '',
      `• Artwork: ${poster.fileName}`,
      `• Size: ${poster.size}`,
      `• Price: ${currency}${price}`,
      '',
      'I am attaching the image in this chat.',
    ]
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
  }

  return (
    <div className='my-16'>
      <div className='text-center text-xl sm:text-2xl mb-3'>
        <Title text1={'YOUR CUSTOM POSTERS'} />
      </div>
      <p className='text-center text-xs sm:text-sm text-gray-500 mb-8'>
        Saved on this device. Send one to us on WhatsApp and attach the image in the chat to place the order.
      </p>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8'>
        {customPosters.map((poster, index) => {
          const { price, originalPrice } = getSizePrice(poster.size, 'Single')

          return (
            <Reveal key={poster.id} delay={(index % 8) * 40}>
              <div className='group'>
                <div className='relative overflow-hidden aspect-[333/461] bg-gray-100'>
                  <img src={poster.dataUrl} alt={poster.fileName} className='w-full h-full object-cover' />
                  <span className='absolute top-0 right-0 bg-black text-white text-[10px] px-3 py-1'>Custom</span>
                  <button
                    onClick={() => removeCustomPoster(poster.id)}
                    aria-label='Remove custom poster'
                    className='absolute top-2 left-2 w-7 h-7 rounded-full bg-white/85 text-gray-600 hover:text-brand flex items-center justify-center transition-colors'
                  >
                    <TrashIcon className='w-3.5 h-3.5' />
                  </button>
                </div>

                <p className='mt-3 text-xs sm:text-[13px] leading-snug truncate text-gray-800'>{poster.fileName}</p>
                <div className='flex items-center gap-2 mt-1'>
                  <span className='text-[11px] text-gray-400 line-through'>RS.{originalPrice}</span>
                  <span className='text-[13px] text-gray-900'>RS.{price}.00</span>
                  <span className='text-[11px] text-gray-400'>· {poster.size}</span>
                </div>

                <button
                  onClick={() => sendToWhatsapp(poster)}
                  className='mt-2 w-full text-[11px] sm:text-xs py-2 bg-whatsapp text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity'
                >
                  <WhatsappIcon className='w-3.5 h-3.5' />
                  Send to Sketchover
                </button>

                {customProduct && (
                  <button
                    onClick={() => addToCart(customProduct._id, poster.size)}
                    className='mt-1.5 w-full text-[11px] sm:text-xs py-2 border border-gray-300 hover:border-black transition-colors'
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

export default MyCustomPosters
