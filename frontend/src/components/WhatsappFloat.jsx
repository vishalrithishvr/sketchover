import React from 'react'
import { WhatsappIcon } from './icons/NavIcons'

// TODO: replace with Sketchover's real WhatsApp Business number (country code + number, no symbols)
const WHATSAPP_NUMBER = '910000000000'

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
