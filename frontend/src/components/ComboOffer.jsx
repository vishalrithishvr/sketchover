import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { COMBO_TIERS, getComboEffectivePrice } from '../assets/assets'
import { CheckIcon } from './icons/NavIcons'

// Selectable combo ladder. Picking a tier adds this poster to the basket and
// sets it as the goal — a progress bar then follows the shopper around the site
// while they pick the rest.
const ComboOffer = ({ product, size, onPick }) => {
  const { activeCombo, startCombo, clearCombo, getComboQty, addToCart } = useContext(ShopContext)
  const qty = getComboQty()

  const choose = (tier) => {
    if (activeCombo?.get === tier.get) {
      clearCombo()
      return
    }
    startCombo(tier)
    if (product && size) {
      addToCart(product._id, size)
      onPick?.(tier)
    }
  }

  return (
    <div className='mt-6 border-2 border-dashed border-black p-4'>
      <div className='flex items-baseline justify-between gap-3 mb-1'>
        <p className='heading-font tracking-[0.18em] text-sm sm:text-base'>COMBO&nbsp;&nbsp;OFFER</p>
        {activeCombo && (
          <button onClick={clearCombo} className='text-[11px] text-gray-500 underline hover:text-black'>
            Cancel
          </button>
        )}
      </div>
      <p className='text-[11px] text-gray-500 mb-3'>
        Pick a deal — we'll add this poster and track the rest as you browse.
      </p>

      <div className='grid grid-cols-2 gap-3'>
        {COMBO_TIERS.map((tier) => {
          const selected = activeCombo?.get === tier.get
          const remaining = Math.max(0, tier.get - qty)

          return (
            <button
              key={tier.buy}
              onClick={() => choose(tier)}
              aria-pressed={selected}
              className={`text-left px-3 py-2.5 transition-all ${
                selected
                  ? 'bg-brand text-white ring-2 ring-brand ring-offset-2'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              <p className='flex items-center gap-1.5 text-xs sm:text-sm font-medium'>
                BUY {tier.buy}
                <span className={selected ? 'text-white' : 'text-brand'}>&rarr;</span>
                GET {tier.get}
                {selected && <CheckIcon className='w-3.5 h-3.5 ml-auto' />}
              </p>
              <p className={`text-[10px] sm:text-[11px] mt-0.5 ${selected ? 'text-white/90' : 'text-brand'}`}>
                +{tier.get - tier.buy} FREE posters
              </p>
              <p className={`text-[10px] sm:text-[11px] mt-1 ${selected ? 'text-white/75' : 'text-white/60'}`}>
                {selected
                  ? (remaining > 0 ? `Add ${remaining} more` : 'Unlocked!')
                  : `Just ₹${getComboEffectivePrice(tier, size)}/poster effective`}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ComboOffer
