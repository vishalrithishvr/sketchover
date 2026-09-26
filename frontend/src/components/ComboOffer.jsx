import React from 'react'
import { COMBO_TIERS } from '../assets/assets'

// Combo ladder panel shown under the product accordions.
const ComboOffer = () => (
  <div className='mt-6 border-2 border-dashed border-black p-4'>
    <p className='heading-font tracking-[0.18em] text-sm sm:text-base mb-3'>COMBO&nbsp;&nbsp;OFFER</p>

    <div className='grid grid-cols-2 gap-3'>
      {COMBO_TIERS.map(({ buy, get, effective }) => (
        <div key={buy} className='bg-neutral-900 text-white px-3 py-2.5'>
          <p className='flex items-center gap-1.5 text-xs sm:text-sm font-medium'>
            BUY {buy} <span className='text-brand'>&rarr;</span> GET {get}
          </p>
          <p className='text-brand text-[10px] sm:text-[11px] mt-0.5'>+{get - buy} FREE posters</p>
          <p className='text-white/60 text-[10px] sm:text-[11px] mt-1'>Just ₹{effective}/poster effective</p>
        </div>
      ))}
    </div>
  </div>
)

export default ComboOffer
