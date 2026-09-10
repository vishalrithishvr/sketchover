import React from 'react'
import { WhatsappIcon } from './icons/NavIcons'

const WHATSAPP_NUMBER = '918870333236'

const WhatsappFloat = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target='_blank'
      rel='noreferrer'
      aria-label='Chat with us on WhatsApp'
      className='fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform'
    >
      <WhatsappIcon className='w-6 h-6' />
    </a>
  )
}

export default WhatsappFloat
